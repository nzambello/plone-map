import type { MetaFunction } from '@remix-run/cloudflare'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'The Plone Map',
  description: 'This is a map of Plone Foundation members',
  viewport: 'width=device-width,initial-scale=1',
  language: 'en',
  'og:title': 'The Plone Map',
  'og:description': 'This is a map of Plone Foundation members',
  'og:site_name': 'The Plone Map',
  'og:type': 'website',
  'og:locale': 'en',
  'twitter:card': 'summary',
  'twitter:title': 'The Plone Map',
  'twitter:description': 'This is a map of Plone Foundation members',
  'twitter:site': '@plone',
  'twitter:creator': '@plone',
  'og:image': 'https://plone.org/logo.png',
  'twitter:image': 'https://plone.org/logo.png'
})

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <script defer data-domain="plone-map.pages.dev" src="https://plausible.io/js/script.js"></script>
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
