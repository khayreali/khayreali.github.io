const { spawnSync } = require('node:child_process');
const { rmSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const result = spawnSync(process.execPath, [require.resolve('react-scripts/scripts/build')], {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    // Keep the existing production build's handling of lint warnings.
    CI: 'false',
    // The public deployment should not include original source files in maps.
    GENERATE_SOURCEMAP: 'false',
  },
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);

// Cloudflare manages custom domains and supplies the SPA fallback itself.
// Keep these source files for GitHub Pages until the domain migration finishes.
for (const file of ['404.html', 'CNAME']) {
  rmSync(path.join(root, 'build', file), { force: true });
}
