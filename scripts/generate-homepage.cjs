const fs = require('node:fs');
const path = require('node:path');
const profile = require('../src/data/profile.json');

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));
const imageUrl = new URL(profile.imageUrl, profile.url).href;
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite', '@id': `${profile.url}#website`,
      name: profile.name, alternateName: 'khayreali.com', url: profile.url,
      description: profile.description, author: { '@id': `${profile.url}#person` }
    },
    {
      '@type': 'Person', '@id': `${profile.url}#person`,
      name: profile.name, url: profile.url, description: profile.description,
      image: imageUrl, sameAs: profile.sameAs,
      worksFor: { '@type': 'Organization', name: profile.organization },
      homeLocation: { '@type': 'City', name: profile.city }
    }
  ]
};

// Keep the initial HTML useful to visitors and crawlers before JavaScript or
// Firebase loads. React uses the same profile as its initial content.
const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#1A1816" />
    <title>${escapeHtml(profile.title)}</title>
    <meta data-rh="true" name="title" content="${escapeHtml(profile.title)}" />
    <meta data-rh="true" name="description" content="${escapeHtml(profile.description)}" />
    <meta name="author" content="${escapeHtml(profile.name)}" />
    <link data-rh="true" rel="canonical" href="${profile.url}" />
    <meta data-rh="true" property="og:type" content="profile" />
    <meta data-rh="true" property="og:url" content="${profile.url}" />
    <meta data-rh="true" property="og:title" content="${escapeHtml(profile.title)}" />
    <meta data-rh="true" property="og:description" content="${escapeHtml(profile.description)}" />
    <meta data-rh="true" property="og:image" content="${imageUrl}" />
    <meta data-rh="true" property="og:site_name" content="${escapeHtml(profile.name)}" />
    <meta data-rh="true" name="twitter:card" content="summary" />
    <meta data-rh="true" name="twitter:url" content="${profile.url}" />
    <meta data-rh="true" name="twitter:title" content="${escapeHtml(profile.title)}" />
    <meta data-rh="true" name="twitter:description" content="${escapeHtml(profile.description)}" />
    <meta data-rh="true" name="twitter:image" content="${imageUrl}" />
    <link rel="icon" type="image/png" sizes="96x96" href="%PUBLIC_URL%/favicon-96x96.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="%PUBLIC_URL%/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="%PUBLIC_URL%/favicon-16x16.png" />
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="%PUBLIC_URL%/apple-touch-icon.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <script data-rh="true" type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>
    <script>
      (function(l) {
        if (l.search[1] === '/') {
          var decoded = l.search.slice(1).split('&').map(function(s) {
            return s.replace(/~and~/g, '&');
          }).join('?');
          window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
        }
      }(window.location));
    </script>
  </head>
  <body>
    <div id="root">
      <main class="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <section id="about" class="mb-16">
          <div class="mb-6"><img src="%PUBLIC_URL%${profile.imageUrl}" alt="${escapeHtml(profile.name)}" width="112" height="112" class="w-28 h-28 rounded-full object-cover" style="border:2px solid var(--border)" /></div>
          <h1 class="text-3xl mb-4">${escapeHtml(profile.name)}</h1>
          <p class="text-lg leading-relaxed mb-6 whitespace-pre-line" style="color:var(--text-secondary)">${escapeHtml(profile.introduction)}</p>
          <nav aria-label="Social links" class="flex gap-6 sans">
            <a href="${profile.sameAs[0]}">GitHub</a>
            <a href="${profile.sameAs[1]}">LinkedIn</a>
          </nav>
        </section>
      </main>
    </div>
  </body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../public/index.html'), html);
console.log('Generated homepage HTML and metadata from src/data/profile.json.');
