import sharp from 'sharp';

const icon = size => `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#2563eb"/><stop offset="1" stop-color="#9333ea"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="#0f172a"/>
  <rect x="28" y="28" width="456" height="456" rx="92" fill="url(#g)"/>
  <path d="M148 148h216v52h-77v184h-62V200h-77z" fill="white"/>
  <circle cx="366" cy="362" r="34" fill="#22c55e"/>
</svg>`;

const social = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#0f172a"/><stop offset="0.55" stop-color="#172554"/><stop offset="1" stop-color="#3b0764"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="#3b82f6"/><stop offset="1" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1060" cy="70" r="270" fill="#7c3aed" opacity=".14"/>
  <circle cx="80" cy="600" r="240" fill="#2563eb" opacity=".14"/>
  <rect x="86" y="82" width="190" height="42" rx="21" fill="#1e3a8a"/>
  <text x="181" y="110" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#93c5fd">FREE · PRIVATE · LOCAL</text>
  <text x="86" y="250" font-family="Arial, sans-serif" font-size="84" font-weight="800" fill="white">Tools We Need</text>
  <text x="86" y="325" font-family="Arial, sans-serif" font-size="34" fill="#cbd5e1">Professional-grade utilities without premium pricing.</text>
  <rect x="86" y="398" width="1028" height="4" rx="2" fill="url(#accent)"/>
  <text x="86" y="480" font-family="Arial, sans-serif" font-size="27" font-weight="600" fill="#93c5fd">Finance · Work · Health · Planning · Developer Tools</text>
  <text x="86" y="548" font-family="Arial, sans-serif" font-size="24" fill="#94a3b8">36 browser tools · no account required</text>
</svg>`;

await Promise.all([
  sharp(Buffer.from(icon(192))).png().toFile('public/app-icon-192.png'),
  sharp(Buffer.from(icon(512))).png().toFile('public/app-icon-512.png'),
  sharp(Buffer.from(social)).png().toFile('public/social-preview.png'),
]);

console.log('Generated app icons and social preview.');
