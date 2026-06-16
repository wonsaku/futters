import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default async function DonateFailPage({
  searchParams,
}: {
  searchParams: Promise<{ code: string; message: string; orderId: string }>
}) {
  const { code, message } = await searchParams

  const userMessage =
    code === 'PAY_PROCESS_CANCELED' ? '결제를 취소했어요.' :
    code === 'PAY_PROCESS_ABORTED' ? '결제가 중단됐어요.' :
    code === 'REJECT_CARD_COMPANY' ? '카드사에서 결제를 거절했어요.' :
    message ?? '결제를 완료하지 못했어요.'

  return (
    <main className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="footers-card p-10">
        <div className="flex justify-center mb-4 text-red-400">
          <XCircle size={56} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--footers-dark)' }}>결제 실패</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--footers-gray)' }}>{userMessage}</p>
        <div className="flex flex-col gap-3">
          <Link href="/donate" className="footers-btn-primary inline-block">
            다시 시도하기
          </Link>
          <Link
            href="/"
            className="text-sm font-medium"
            style={{ color: 'var(--footers-gray)' }}
          >
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  )
}
