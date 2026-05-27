import { useState, useEffect, useRef } from 'react'

interface CountdownOverlayProps {
  onComplete: () => void
  emoji?: string
}

export function CountdownOverlay({ onComplete, emoji = '🎈' }: CountdownOverlayProps) {
  const [step, setStep] = useState(0) // 0=3, 1=2, 2=1, 3=GO, 4=done
  const doneRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    timers.push(setTimeout(() => setStep(1), 600))
    timers.push(setTimeout(() => setStep(2), 1200))
    timers.push(setTimeout(() => setStep(3), 1800))
    timers.push(setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true
        setStep(4)
        onCompleteRef.current()
      }
    }, 2300))

    return () => timers.forEach(clearTimeout)
  }, [])

  if (step === 4) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C98ED]/30 backdrop-blur-sm">
      <div
        key={step}
        className="text-[120px] font-black text-[#5a5a87] drop-shadow-2xl select-none animate-jelly"
      >
        {step === 0 ? '3' : step === 1 ? '2' : step === 2 ? '1' : emoji}
      </div>
    </div>
  )
}
