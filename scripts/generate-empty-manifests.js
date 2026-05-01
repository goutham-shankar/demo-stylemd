const fs = require('fs');
const path = require('path');

function ensureManifest(route) {
  const dir = path.join('.next', 'server', 'app', route);
  const file = path.join(dir, 'page_client-reference-manifest.js');
  if (!fs.existsSync(file)) {
    fs.mkdirSync(dir, { recursive: true });
    const content = "globalThis.__RSC_MANIFEST=(globalThis.__RSC_MANIFEST||{});globalThis.__RSC_MANIFEST['" + route + "']={clientModules:{},ssrModuleMapping:{},entryCSSFiles:{}};";
    fs.writeFileSync(file, content, 'utf8');
    console.log('Created empty manifest:', file);
  } else {
    console.log('Manifest exists:', file);
  }
}

// Ensure the (main) page manifest exists to satisfy some hosting environments
ensureManifest('(main)');

// Also ensure root-level manifest to be safe
ensureManifest('');

console.log('Manifest check complete.');
