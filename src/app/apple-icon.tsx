import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#102a43',
          borderRadius: 36,
        }}
      >
        <div
          style={{
            fontSize: 100,
            fontWeight: 700,
            letterSpacing: -4,
            display: 'flex',
          }}
        >
          <span style={{ color: '#ffffff' }}>H</span>
          <span style={{ color: '#d97706' }}>C</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
