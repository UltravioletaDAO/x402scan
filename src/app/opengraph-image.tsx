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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          fontSize: 60,
          fontWeight: 700,
          color: 'white',
          backgroundImage: 'linear-gradient(45deg, #1a1a1a 25%, transparent 25%), linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1a 75%), linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 20,
            padding: '0 60px',
          }}
        >
          <div style={{ fontSize: 72, fontFamily: 'monospace' }}>
            x402scan
          </div>
          <div style={{
            fontSize: 32,
            color: '#888',
            lineHeight: 1.2,
          }}>
            Explore the x402 ecosystem
          </div>
          <div style={{
            fontSize: 24,
            color: '#666',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.3,
          }}>
            View transactions, sellers, origins and resources. Explore the future of agentic commerce.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}