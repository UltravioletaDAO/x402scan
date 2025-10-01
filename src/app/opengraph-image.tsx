import { ImageResponse } from 'next/og'
import { logoBase64 } from './logo-base64'

export const runtime = 'edge'

export const alt = 'x402scan • x402 Ecosystem Explorer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Load Google Font dynamically
async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@700&text=${encodeURIComponent(
    text
  )}`

  const css = await fetch(url).then((res) => res.text())

  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  )

  if (resource) {
    const response = await fetch(resource[1])
    if (response.status == 200) {
      return await response.arrayBuffer()
    }
  }

  throw new Error('failed to load font data')
}

export default async function Image() {
  const fontData = await loadGoogleFont('JetBrains Mono', 'x402scan')

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: '#030712',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1e40af20 0%, transparent 70%), radial-gradient(circle at 75% 75%, #06b6d420 0%, transparent 70%)',
        }}
      >
        {/* Main content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '80px',
            width: '100%',
            height: '100%',
          }}
        >
          {/* Logo and brand section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              marginBottom: 48,
            }}
          >
            <img
              src={logoBase64}
              width="72"
              height="72"
              style={{ borderRadius: 16 }}
            />
            <div
              style={{
                display: 'flex',
                fontSize: 84,
                fontWeight: 700,
                fontFamily: 'JetBrains Mono',
                color: '#f8fafc',
                letterSpacing: '-0.025em',
                lineHeight: 0.9,
              }}
            >
              x402scan
            </div>
          </div>

          {/* Main tagline */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: '#e2e8f0',
              marginBottom: 20,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            Explore x402 Ecosystem
          </div>

          {/* Description */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 24,
              fontWeight: 400,
              color: '#94a3b8',
              maxWidth: 600,
              lineHeight: 1.4,
              letterSpacing: '-0.005em',
            }}
          >
            <div style={{ display: 'flex' }}>View transactions, sellers, origins and resources.</div>
            <div style={{ display: 'flex' }}>Explore the future of agentic commerce.</div>
          </div>
        </div>

      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'JetBrains Mono',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  )
}