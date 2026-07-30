import sharp from 'sharp';

// Brand mark: app-grid motif — four rounded tiles, one lit green.
// Reads clearly from 512px down to a 16px browser-tab favicon.
const icon = () => `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#2563eb"/><stop offset="1" stop-color="#9333ea"/>
    </linearGradient>
    <linearGradient id="tile" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#ffffff"/><stop offset="1" stop-color="#dbeafe"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="#0f172a"/>
  <rect x="24" y="24" width="464" height="464" rx="96" fill="url(#g)"/>
  <rect x="96" y="96" width="148" height="148" rx="36" fill="url(#tile)"/>
  <rect x="268" y="96" width="148" height="148" rx="36" fill="url(#tile)" opacity="0.92"/>
  <rect x="96" y="268" width="148" height="148" rx="36" fill="url(#tile)" opacity="0.92"/>
  <rect x="268" y="268" width="148" height="148" rx="36" fill="#22c55e"/>
  <path d="M306 342l24 24 48-48" stroke="#0f172a" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;

// Social preview 1200x630: dark hero with dot grid, glow, badge, gradient
// headline, category pills, and a tilted mock tool-card stack on the right.
const social = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#0b1120"/><stop offset="0.55" stop-color="#111c3d"/><stop offset="1" stop-color="#2a0a54"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="#60a5fa"/><stop offset="1" stop-color="#c084fc"/>
    </linearGradient>
    <linearGradient id="cardg" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#1e293b"/><stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
    <pattern id="dots" width="34" height="34" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.6" fill="#334155" opacity="0.55"/>
    </pattern>
    <linearGradient id="tileMini" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#2563eb"/><stop offset="1" stop-color="#9333ea"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <circle cx="1120" cy="40" r="300" fill="#7c3aed" opacity="0.16"/>
  <circle cx="40" cy="620" r="260" fill="#2563eb" opacity="0.16"/>

  <!-- brand row -->
  <g transform="translate(76,58)">
    <rect width="52" height="52" rx="14" fill="url(#tileMini)"/>
    <rect x="10" y="10" width="14" height="14" rx="4" fill="#fff"/>
    <rect x="28" y="10" width="14" height="14" rx="4" fill="#fff" opacity="0.9"/>
    <rect x="10" y="28" width="14" height="14" rx="4" fill="#fff" opacity="0.9"/>
    <rect x="28" y="28" width="14" height="14" rx="4" fill="#22c55e"/>
    <text x="68" y="36" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#e2e8f0">toolsweneed.com</text>
  </g>

  <!-- badge -->
  <rect x="76" y="152" width="536" height="46" rx="23" fill="#1d4ed8" opacity="0.28"/>
  <rect x="76" y="152" width="536" height="46" rx="23" fill="none" stroke="#3b82f6" stroke-opacity="0.55" stroke-width="1.5"/>
  <text x="344" y="183" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="2" fill="#93c5fd">36 FREE TOOLS · NO SIGNUP · 100% PRIVATE</text>

  <!-- headline -->
  <text x="76" y="308" font-family="Arial, sans-serif" font-size="92" font-weight="800" fill="#ffffff">Tools We <tspan fill="url(#accent)">Need</tspan></text>
  <text x="76" y="368" font-family="Arial, sans-serif" font-size="31" fill="#cbd5e1">Premium-grade tools. Zero premium pricing.</text>
  <text x="76" y="412" font-family="Arial, sans-serif" font-size="25" fill="#94a3b8">Everything runs in your browser — your data never leaves your device.</text>

  <!-- category pills -->
  <g font-family="Arial, sans-serif" font-size="21" font-weight="600">
    <rect x="76" y="472" width="128" height="42" rx="21" fill="#0f2b5e"/><text x="140" y="500" text-anchor="middle" fill="#93c5fd">Finance</text>
    <rect x="216" y="472" width="112" height="42" rx="21" fill="#312e81"/><text x="272" y="500" text-anchor="middle" fill="#c7d2fe">Career</text>
    <rect x="340" y="472" width="112" height="42" rx="21" fill="#14532d"/><text x="396" y="500" text-anchor="middle" fill="#86efac">Health</text>
    <rect x="464" y="472" width="132" height="42" rx="21" fill="#581c87"/><text x="530" y="500" text-anchor="middle" fill="#e9d5ff">Planning</text>
    <rect x="608" y="472" width="146" height="42" rx="21" fill="#7c2d12"/><text x="681" y="500" text-anchor="middle" fill="#fdba74">Developer</text>
  </g>

  <!-- mock tool-card stack -->
  <g transform="translate(830,150) rotate(6)">
    <rect width="300" height="180" rx="20" fill="url(#cardg)" stroke="#334155" stroke-width="1.5" opacity="0.75"/>
  </g>
  <g transform="translate(850,240) rotate(-4)">
    <rect width="300" height="200" rx="20" fill="url(#cardg)" stroke="#475569" stroke-width="1.5"/>
    <rect x="24" y="24" width="56" height="56" rx="14" fill="url(#tileMini)"/>
    <rect x="98" y="30" width="150" height="16" rx="8" fill="#e2e8f0"/>
    <rect x="98" y="56" width="110" height="12" rx="6" fill="#64748b"/>
    <rect x="24" y="104" width="252" height="12" rx="6" fill="#475569"/>
    <rect x="24" y="128" width="196" height="12" rx="6" fill="#475569"/>
    <rect x="24" y="158" width="104" height="26" rx="13" fill="#22c55e"/>
    <rect x="140" y="158" width="104" height="26" rx="13" fill="#334155"/>
  </g>

  <!-- bottom accent -->
  <rect x="0" y="622" width="1200" height="8" fill="url(#accent)"/>
</svg>`;

const iconSvg = Buffer.from(icon());
const appleIcon = `
<svg width="180" height="180" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">${icon().replace(/^[\s\S]*?<svg[^>]*>/, '').replace('</svg>', '')}</svg>`;

await Promise.all([
  sharp(iconSvg).resize(192, 192).png().toFile('public/app-icon-192.png'),
  sharp(iconSvg).resize(512, 512).png().toFile('public/app-icon-512.png'),
  sharp(iconSvg).resize(512, 512).png().toFile('app/icon.png'),
  sharp(Buffer.from(appleIcon)).resize(180, 180).png().toFile('app/apple-icon.png'),
  sharp(Buffer.from(social)).png().toFile('public/social-preview.png'),
]);

console.log('Generated app icons, favicon, apple icon, and social preview.');
