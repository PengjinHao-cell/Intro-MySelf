const SITE = 'http://127.0.0.1:4321'

export function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${SITE}/sitemap-0.xml</loc>\n  </sitemap>\n</sitemapindex>`,
    { headers: { 'Content-Type': 'application/xml' } },
  )
}
