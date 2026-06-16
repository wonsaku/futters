export default function SoccerBall({ size = 20 }: { size?: number }) {
  return (
    <img
      src="/footers-icon.png"
      alt="Footers"
      width={size}
      height={size}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        objectFit: 'contain',
      }}
    />
  )
}
