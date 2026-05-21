export function Clouds() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {/* 大云朵 - 用多个白色圆叠加 */}
      <div className="absolute animate-cloud-drift" style={{ top: '5%', left: '8%', animationDelay: '0s' }}>
        <div className="relative w-24 h-12">
          <div className="absolute bg-white rounded-full w-16 h-16 bottom-0 left-0 shadow-lg" />
          <div className="absolute bg-white rounded-full w-20 h-20 -bottom-1 left-4 shadow-lg" />
          <div className="absolute bg-white rounded-full w-14 h-14 bottom-0 left-14 shadow-lg" />
          <div className="absolute bg-white rounded-full w-12 h-12 -bottom-2 left-10 shadow-lg" />
        </div>
      </div>

      <div className="absolute animate-cloud-drift" style={{ top: '8%', right: '10%', animationDelay: '3s' }}>
        <div className="relative w-28 h-14">
          <div className="absolute bg-white rounded-full w-20 w-20 bottom-0 left-0 shadow-lg" />
          <div className="absolute bg-white rounded-full w-24 h-24 -bottom-1 left-5 shadow-lg" />
          <div className="absolute bg-white rounded-full w-16 h-16 bottom-0 left-18 shadow-lg" />
        </div>
      </div>

      <div className="absolute animate-cloud-drift" style={{ top: '3%', left: '42%', animationDelay: '5s' }}>
        <div className="relative w-32 h-16">
          <div className="absolute bg-white rounded-full w-24 h-24 bottom-0 left-0 shadow-lg" />
          <div className="absolute bg-white rounded-full w-28 h-28 -bottom-2 left-6 shadow-lg" />
          <div className="absolute bg-white rounded-full w-20 h-20 bottom-0 left-16 shadow-lg" />
          <div className="absolute bg-white rounded-full w-16 h-16 -bottom-1 left-22 shadow-lg" />
        </div>
      </div>

      {/* 小云朵点缀 */}
      <div className="absolute animate-cloud-drift" style={{ top: '78%', left: '12%', animationDelay: '1.5s' }}>
        <div className="relative w-16 h-8">
          <div className="absolute bg-white/90 rounded-full w-10 h-10 bottom-0 left-0 shadow-md" />
          <div className="absolute bg-white/90 rounded-full w-14 h-14 -bottom-1 left-3 shadow-md" />
          <div className="absolute bg-white/90 rounded-full w-10 h-10 bottom-0 left-9 shadow-md" />
        </div>
      </div>

      <div className="absolute animate-cloud-drift" style={{ top: '82%', right: '14%', animationDelay: '4s' }}>
        <div className="relative w-20 h-10">
          <div className="absolute bg-white/90 rounded-full w-14 h-14 bottom-0 left-0 shadow-md" />
          <div className="absolute bg-white/90 rounded-full w-16 h-16 -bottom-1 left-4 shadow-md" />
          <div className="absolute bg-white/90 rounded-full w-12 h-12 bottom-0 left-12 shadow-md" />
        </div>
      </div>

      {/* 星星 */}
      <span className="absolute text-yellow-300 text-2xl animate-star-twinkle drop-shadow-lg" style={{ top: '4%', left: '28%' }}>✦</span>
      <span className="absolute text-yellow-300 text-xl animate-star-twinkle drop-shadow-lg" style={{ top: '9%', right: '30%', animationDelay: '0.7s' }}>✧</span>
      <span className="absolute text-yellow-300 text-2xl animate-star-twinkle drop-shadow-lg" style={{ top: '3%', left: '56%', animationDelay: '1.4s' }}>✦</span>
      <span className="absolute text-yellow-200 text-lg animate-star-twinkle drop-shadow-md" style={{ top: '11%', right: '48%', animationDelay: '0.3s' }}>✧</span>

      {/* 草地 - 底部绿色带 */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-16 rounded-t-[40px] bg-gradient-to-t from-[#A5D6A7] via-[#81C784]/60 to-transparent" />
        <div className="absolute bottom-0 left-[10%] right-[10%] h-10 rounded-t-[30px] bg-gradient-to-t from-[#66BB6A] via-[#81C784]/40 to-transparent" />
        {/* 小草装饰 */}
        <span className="absolute bottom-5 left-[20%] text-lg">🌱</span>
        <span className="absolute bottom-4 left-[35%] text-base">🌿</span>
        <span className="absolute bottom-6 right-[25%] text-lg">🌱</span>
        <span className="absolute bottom-5 right-[40%] text-base">🌿</span>
      </div>
    </div>
  )
}
