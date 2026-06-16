export default function SoccerBall({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {/* 머리 */}
      <circle cx="5.5" cy="2.8" r="1.8" stroke="currentColor" strokeWidth="1.5" />
      {/* 몸통 */}
      <line x1="5.5" y1="4.8" x2="5.5" y2="9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* 팔 (균형) */}
      <line x1="5.5" y1="6.8" x2="2.5" y2="9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5.5" y1="6.8" x2="8.5" y2="8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* 지지하는 왼쪽 다리 */}
      <polyline points="5.5,9.5 4,14 3,16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* 공 차는 오른쪽 다리: 허벅지 앞으로, 하퇴부 공 방향으로 */}
      <polyline points="5.5,9.5 11,7.5 16.5,13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* 공 */}
      <circle cx="19.5" cy="15.5" r="3" stroke="currentColor" strokeWidth="1.5" />
      {/* 공 중앙 패턴 */}
      <path d="M19.5 13.5 L21 14.5 L20.5 16.5 L18.5 16.5 L18 14.5 Z" fill="currentColor" fillOpacity="0.65" />
    </svg>
  )
}
