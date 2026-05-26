import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import celebrationData from '../assets/Confetti Burst.json'

interface Props {
  className?: string
  loop?: boolean
}

export function LottieCelebration({ className = 'w-32 h-32', loop = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      animationData: celebrationData,
      loop,
      autoplay: true,
    })
    return () => anim.destroy()
  }, [loop])

  return <div ref={containerRef} className={className} />
}
