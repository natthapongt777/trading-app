import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{
      background: 'linear-gradient(135deg, #030712 0%, #1e3a8a 100%)',
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      borderRadius: '40px',
    }}>
      <div style={{ fontSize: '88px', lineHeight: 1 }}>📈</div>
      <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginTop: '10px', letterSpacing: '2px' }}>
        TRADING
      </div>
    </div>,
    { ...size }
  )
}
