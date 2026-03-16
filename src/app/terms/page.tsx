import Link from 'next/link'
import legalContent from '@/content/legal.json'

function renderMarkdown(text: string) {
  return text.split('\n\n').map((block, i) => {
    if (block.startsWith('# ')) {
      return <h1 key={i} className="font-display text-3xl font-black tracking-[-0.03em] mb-4" style={{ color: '#063D57' }}>{block.slice(2)}</h1>
    }
    if (block.startsWith('## ')) {
      return <h2 key={i} className="font-display text-xl font-black tracking-[-0.02em] mt-8 mb-3" style={{ color: '#063D57' }}>{block.slice(3)}</h2>
    }
    if (block.startsWith('- ') || block.includes('\n- ')) {
      const items = block.split('\n').filter(l => l.startsWith('- ')).map(l => l.slice(2))
      return <ul key={i} className="list-disc list-inside space-y-1 mb-4 text-sm leading-relaxed" style={{ color: '#2E6A8A' }}>{items.map((item, j) => <li key={j}>{item}</li>)}</ul>
    }
    return <p key={i} className="mb-4 text-sm leading-relaxed" style={{ color: '#2E6A8A' }}>{block}</p>
  })
}

export default function TermsPage() {
  const terms = legalContent.termsOfService
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f8fa' }}>
      <div style={{ backgroundColor: '#063D57', borderBottom: '1px solid #47AECC1a' }}>
        <div className="mx-auto max-w-2xl px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-display text-lg font-black tracking-[-0.03em]" style={{ color: '#CCE6EA' }}>
            Alga.e
          </Link>
          <Link href="/" className="text-sm transition-colors" style={{ color: '#729DB9' }}>
            ← Back to site
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-6 py-12">
        <p className="mb-8 text-xs uppercase tracking-[0.14em]" style={{ color: '#0897B3' }}>
          Last updated: {terms.lastUpdated}
        </p>
        {renderMarkdown(terms.content.en)}
      </div>
    </div>
  )
}
