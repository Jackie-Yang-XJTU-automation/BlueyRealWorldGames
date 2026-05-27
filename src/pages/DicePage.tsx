import { useState, useCallback, useRef } from 'react'

const DOT_POSITIONS: Record<number, number[][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
}

function Dice({ value, rolling }: { value: number; rolling: boolean }) {
  return (
    <div
      className={`w-24 h-24 rounded-3xl shadow-lg border-2 flex items-center justify-center relative transition-all duration-300 ${
        rolling
          ? 'bg-white border-btv-yellow shadow-[#FDE9B0] animate-balloon-wobble'
          : 'bg-white border-[#E3F2FD]'
      }`}
    >
      <svg width="72" height="72" viewBox="0 0 100 100">
        {(DOT_POSITIONS[value] ?? DOT_POSITIONS[1]).map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="11" fill="#37474F" />
        ))}
      </svg>
    </div>
  )
}

export function DicePage() {
  const [diceCount, setDiceCount] = useState(1)
  const [values, setValues] = useState<number[]>([1])
  const [rolling, setRolling] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const roll = useCallback(() => {
    if (rolling) return
    setRolling(true)

    let ticks = 0
    const finalValues = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1)

    timerRef.current = setInterval(() => {
      ticks++
      if (ticks >= 12) {
        clearInterval(timerRef.current!)
        setValues(finalValues)
        setRolling(false)
      } else {
        setValues(Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1))
      }
    }, 80)
  }, [diceCount, rolling])

  const total = values.reduce((a, b) => a + b, 0)

  const addDice = useCallback(() => {
    if (diceCount < 4) {
      setDiceCount(d => d + 1)
      setValues(prev => [...prev, 1])
    }
  }, [diceCount])

  const removeDice = useCallback(() => {
    if (diceCount > 1) {
      setDiceCount(d => d - 1)
      setValues(prev => prev.slice(0, -1))
    }
  }, [diceCount])

  return (
    <div className="max-w-sm mx-auto">
      <h2 className="page-title-btv text-center mb-1">🎲 虚拟骰子</h2>
      <p className="text-center text-gray-400 font-bold text-sm mb-6">
        需要随机数？直接掷骰子！
      </p>

      {/* 骰子区域 */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {values.map((v, i) => (
          <Dice key={i} value={v} rolling={rolling} />
        ))}
      </div>

      {/* 结果 */}
      {!rolling && values.length > 0 && (
        <div className="text-center mb-6">
          <p className="text-4xl font-extrabold text-btv-dark">
            {values.join(' + ')}
            {values.length > 1 && (
              <span className="text-btv-orange"> = {total}</span>
            )}
          </p>
        </div>
      )}

      {/* 骰子数量 */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={removeDice}
          disabled={diceCount <= 1}
          className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 font-extrabold text-lg disabled:opacity-30"
        >−</button>
        <span className="text-lg font-extrabold text-btv-dark">{diceCount} 颗</span>
        <button
          onClick={addDice}
          disabled={diceCount >= 4}
          className="w-10 h-10 rounded-full bg-gray-100 text-btv-dark font-extrabold text-lg disabled:opacity-30"
        >+</button>
      </div>

      {/* 掷骰子按钮 */}
      <button
        onClick={roll}
        disabled={rolling}
        className="btn-btv w-full text-2xl animate-pulse-glow-btv disabled:opacity-50"
      >
        {rolling ? '🎲 骰子在转...' : '🎲 掷骰子！'}
      </button>
    </div>
  )
}
