import { ImageResponse } from 'next/og'

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
            <div
              style={{
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
              fontSize: 24,
              fontWeight: 400,
              color: '#94a3b8',
              maxWidth: 600,
              lineHeight: 1.4,
              letterSpacing: '-0.005em',
            }}
          >
            View transactions, sellers, origins and resources.
            <br />
            Explore the future of agentic commerce.
          </div>
        </div>

        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            right: 80,
            bottom: 80,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1e40af40, #06b6d440)',
            filter: 'blur(60px)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'linear-gradient(225deg, #0f172a, transparent)',
            opacity: 0.3,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}