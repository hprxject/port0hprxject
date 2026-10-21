import type { Metadata, Viewport } from 'next'
import { jetbrainsMono } from './fonts'
import './globals.css'
import siteData from '../../content/site.json'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PageWipe } from '@/components/PageWipe'

export const metadata: Metadata = {
  title: {
    default: siteData.openGraph.title,
    template: `%s — ${siteData.name}`,
  },
  description: siteData.openGraph.description,
  openGraph: {
    title: siteData.openGraph.title,
    description: siteData.openGraph.description,
    images: [{ url: siteData.openGraph.image }],
    type: 'website',
  },
  metadataBase: new URL('https://hprxject.vercel.app'),
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang={siteData.locale}
      suppressHydrationWarning
    >
      <head>
        {/* No-flash theme script: runs synchronously before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('bia-theme');
                  var theme = stored
                    ? stored
                    : window.matchMedia('(prefers-color-scheme: dark)').matches
                      ? 'dark'
                      : 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={jetbrainsMono.variable}>
        {/* Grain overlay — fixed, pointer-events none */}
        <div className="grain-overlay" aria-hidden="true" />

        {/* Page transition blue wipe */}
        <PageWipe />

        <Header siteName={siteData.name} nameShort={siteData.nameShort} />

        <main id="main-content">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  )
}
