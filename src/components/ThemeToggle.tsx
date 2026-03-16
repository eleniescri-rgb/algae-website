'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // Cycle through themes: light -> dark -> system -> light
  const cycleTheme = () => {
    const themeOrder: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  // Get icon component based on current theme
  const getIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      case 'system':
        return Monitor;
      default:
        return Sun;
    }
  };

  const Icon = getIcon();

  return (
    <button
      onClick={cycleTheme}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label={`Switch to ${
        theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
      } theme`}
      type="button"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="h-5 w-5" />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
