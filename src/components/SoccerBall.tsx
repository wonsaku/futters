export default function SoccerBall({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {/* 왕발바닥 */}
      <path
        d="M1 12 C1 8 2 5 5 5 L10 5 C12.5 5 13.5 7 14 9 C14.5 11 14 14 12 16 C10.5 17.5 8 18 5 18 L3 18 C1.5 18 1 17 1 15 Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* 축구공 */}
      <circle cx="20" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      {/* 공 오각형 패턴 */}
      <path
        d="M20 11 L21.9 12.4 L21.2 14.6 L18.8 14.6 L18.1 12.4 Z"
        fill="currentColor"
        fillOpacity="0.65"
      />
      <line x1="20"   y1="11"   x2="20"   y2="9.5"  stroke="currentColor" strokeWidth="1" />
      <line x1="21.9" y1="12.4" x2="23"   y2="11.7" stroke="currentColor" strokeWidth="1" />
      <line x1="21.2" y1="14.6" x2="22.2" y2="16.1" stroke="currentColor" strokeWidth="1" />
      <line x1="18.8" y1="14.6" x2="17.8" y2="16.1" stroke="currentColor" strokeWidth="1" />
      <line x1="18.1" y1="12.4" x2="17"   y2="11.7" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}
