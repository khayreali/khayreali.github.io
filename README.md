# Khayre Ali's Portfolio

Personal website built with React and Firebase.

## Cloudflare Pages

Connect this GitHub repository to a Cloudflare Pages project with these settings:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build:cloudflare` |
| Build output directory | `build` |
| Node version | `22` |

Copy the existing Firebase web configuration into the project's build environment
variables (production and preview):

- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_MESSAGING_SENDER_ID`
- `REACT_APP_APP_ID`
- `REACT_APP_MEASUREMENT_ID`

For local development, place these values in the ignored `.env.local` file,
run `npm ci`, then `npm start`. Run `npm run build:cloudflare` to reproduce the
Cloudflare artifact. This build excludes source maps and the GitHub Pages
`404.html`/`CNAME` files. Cloudflare supplies the single-page application fallback.

Firebase Authentication, Firestore, and Storage remain in the existing project.
The app continues using its existing hash-based routes. Repository privacy does
not make the JavaScript or Firebase web configuration sent to browsers secret.

### Domain migration order

1. Deploy and verify the site on the Pages project domain.
2. Add `khayreali.com` to Cloudflare, preserve the domain's existing DNS records,
   and update its nameservers at the registrar if necessary.
3. Attach `khayreali.com` and `www.khayreali.com` to the Pages project and verify
   DNS, HTTPS, page content, and Firebase reads.
4. Disable the old GitHub Pages deployment workflow and make the GitHub repository
   private only after the custom domain is working on Cloudflare.

The existing GitHub Pages build is retained during the migration so the current
site can continue serving while the new host and DNS are being verified.
