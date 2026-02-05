import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  // Color brand: debe coincidir con --COLOR_PRINCIPAL_HEX en src/shared/theme/colors.css
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#ff5454" rx="12"/>
  <text x="50" y="75" font-size="60" text-anchor="middle" fill="white">🛒</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
