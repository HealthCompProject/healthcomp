import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: 6,
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: -1,
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
