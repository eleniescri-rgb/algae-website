import { createClient, isSupabaseConfigured } from './supabase';

const WAITLIST_STORAGE_KEY = 'waitlist_emails';

interface WaitlistEntry {
  email: string;
  timestamp: string;
}

interface WaitlistResult {
  success: boolean;
  message: string;
  fallback: boolean;
}

/**
 * Save email to localStorage as fallback
 */
function saveToLocalStorage(email: string): WaitlistResult {
  try {
    const existingData = localStorage.getItem(WAITLIST_STORAGE_KEY);
    const entries: WaitlistEntry[] = existingData
      ? JSON.parse(existingData)
      : [];

    // Check if email already exists
    if (entries.some((entry) => entry.email === email)) {
      return {
        success: true,
        message: 'You are already on the waitlist',
        fallback: true,
      };
    }

    // Add new entry
    entries.push({
      email,
      timestamp: new Date().toISOString(),
    });

    localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(entries));

    return {
      success: true,
      message: 'Successfully added to waitlist (saved locally)',
      fallback: true,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to save email',
      fallback: true,
    };
  }
}

/**
 * Save email to Supabase
 */
async function saveToSupabase(email: string): Promise<WaitlistResult> {
  try {
    const supabase = createClient();

    // Insert into waitlist table
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email, created_at: new Date().toISOString() }]);

    if (error) {
      // Check if it's a duplicate email error
      if (error.code === '23505') {
        return {
          success: true,
          message: 'You are already on the waitlist',
          fallback: false,
        };
      }
      throw error;
    }

    return {
      success: true,
      message: 'Successfully added to waitlist',
      fallback: false,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Submit email to waitlist
 * Tries Supabase first, falls back to localStorage if Supabase fails or isn't configured
 */
export async function submitToWaitlist(email: string): Promise<WaitlistResult> {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: 'Please enter a valid email address',
      fallback: false,
    };
  }

  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return saveToLocalStorage(email);
  }

  // Try Supabase first
  try {
    return await saveToSupabase(email);
  } catch (error) {
    console.warn('Supabase save failed, falling back to localStorage:', error);
    return saveToLocalStorage(email);
  }
}
