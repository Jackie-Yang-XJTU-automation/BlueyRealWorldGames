import type { DeliveryReadinessItem } from '../types/playExperience'

const ITEMS: DeliveryReadinessItem[] = [
  {
    id: 'offline',
    emoji: '📶',
    title: '离线可用',
    detail: '推荐、收藏、家庭记录和游戏数据都保存在本机。',
    status: 'ready',
  },
  {
    id: 'privacy',
    emoji: '🔒',
    title: '不登录不上传',
    detail: '没有账号、后端或孩子资料上传，适合家长临时试用。',
    status: 'ready',
  },
  {
    id: 'install',
    emoji: '📱',
    title: '可安装',
    detail: 'PWA 产物会生成 manifest 和 service worker，可添加到手机桌面。',
    status: 'ready',
  },
  {
    id: 'git',
    emoji: '🧾',
    title: '发布前确认',
    detail: '上线前需要把新增源码加入版本控制，否则部署不会带上新页面。',
    status: 'manual',
  },
]

function statusClass(status: DeliveryReadinessItem['status']): string {
  if (status === 'ready') return 'bg-[#E8F5E9] text-[#4CAF50]'
  if (status === 'watch') return 'bg-[#FFF3E0] text-[#F58634]'
  return 'bg-[#FCE4EC] text-[#D96B62]'
}

function statusLabel(status: DeliveryReadinessItem['status']): string {
  if (status === 'ready') return '已就绪'
  if (status === 'watch') return '需观察'
  return '需手动'
}

export function DeliveryReadinessCard() {
  return (
    <section aria-label="交付状态" className="rounded-[30px] border-4 border-white bg-[#FDFBF7] p-4 shadow-[0_8px_0_rgba(174,224,250,0.42),0_14px_30px_rgba(44,67,100,0.08)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="btv-display text-[12px] uppercase tracking-widest text-[#F58634]">交付检查</p>
          <h2 className="text-2xl font-black text-btv-dark">试用前放心点</h2>
        </div>
        <span className="rounded-full bg-[#E3F2FD] px-3 py-1 text-[11px] font-black text-[#5C728D]">
          本机
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {ITEMS.map(item => (
          <article key={item.id} className="rounded-[22px] border-2 border-[#E3F2FD] bg-white px-3 py-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-black text-btv-dark">
                <span className="text-xl">{item.emoji}</span>
                {item.title}
              </span>
              <span className={`rounded-full px-2 py-1 text-[10px] font-black ${statusClass(item.status)}`}>
                {statusLabel(item.status)}
              </span>
            </div>
            <p className="text-[12px] font-extrabold leading-relaxed text-[#5C728D]">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

