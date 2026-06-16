export default function SoccerBall({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8.5 L15.3 10.9 L14.1 14.8 L9.9 14.8 L8.7 10.9 Z" fill="currentColor" />
      <path d="M12 8.5 L12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15.3 10.9 L21.5 8.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14.1 14.8 L17.9 20.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9.9 14.8 L6.1 20.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.7 10.9 L2.5 8.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
