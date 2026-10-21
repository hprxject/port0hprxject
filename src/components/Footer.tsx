import siteData from '../../content/site.json'

export function Footer() {
  const now = new Date()
  const updateDate = now.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const isoDate = now.toISOString().split('T')[0]

  return (
    <footer
      id="site-footer"
      style={{
        borderTop: '1px solid var(--line)',
        padding: 'var(--space-8) var(--gutter)',
        marginTop: 'var(--space-24)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
      >
        {/* Left: registration code + contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span
            className="label"
            style={{ fontSize: 'var(--text-xs)', opacity: 0.4 }}
          >
            BIA-{isoDate.replace(/-/g, '')} / REG-{String(now.getMonth() + 1).padStart(2, '0')}
          </span>
          <span className="label" style={{ fontSize: 'var(--text-xs)', opacity: 0.6 }}>
            {siteData.contact.email}
          </span>
        </div>

        {/* Right: last updated */}
        <div style={{ textAlign: 'right' }}>
          <p
            className="label"
            style={{ fontSize: 'var(--text-xs)', opacity: 0.4 }}
          >
            LAST UPDATED
          </p>
          <time
            dateTime={isoDate}
            className="label"
            style={{ fontSize: 'var(--text-xs)', opacity: 0.7 }}
          >
            {updateDate}
          </time>
        </div>
      </div>
    </footer>
  )
}
