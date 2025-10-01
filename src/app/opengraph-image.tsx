import { ImageResponse } from 'next/og'
import { logoBase64 } from './logo-base64'

export const runtime = 'edge'

export const alt = 'x402scan • Explore x402 Ecosystem'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
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
                fontFamily: 'ui-monospace, Menlo, Monaco, "Cascadia Code", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Code", "Droid Sans Mono", "Courier New", monospace',
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
    }
  )
}