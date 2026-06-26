import { useMemo, useState, useEffect } from 'react'

const VERSION = 4
const SIZE = 21 + (VERSION - 1) * 4
const DATA_CODEWORDS = 80
const EC_CODEWORDS = 20

type Matrix = Array<Array<boolean | null>>

function makeMatrix(): { modules: Matrix; reserved: boolean[][] } {
  const modules: Matrix = Array.from({ length: SIZE }, () => Array(SIZE).fill(null))
  const reserved = Array.from({ length: SIZE }, () => Array(SIZE).fill(false))

  const set = (x: number, y: number, dark: boolean, reserve = true) => {
    modules[y][x] = dark
    if (reserve) reserved[y][x] = true
  }

  const finder = (x: number, y: number) => {
    for (let dy = -1; dy <= 7; dy++) {
      for (let dx = -1; dx <= 7; dx++) {
        const xx = x + dx
        const yy = y + dy
        if (xx < 0 || yy < 0 || xx >= SIZE || yy >= SIZE) continue
        const inFinder = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6
        const dark = inFinder && (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4))
        set(xx, yy, dark)
      }
    }
  }

  finder(0, 0)
  finder(SIZE - 7, 0)
  finder(0, SIZE - 7)

  for (let i = 8; i < SIZE - 8; i++) {
    set(i, 6, i % 2 === 0)
    set(6, i, i % 2 === 0)
  }

  const alignmentCenter = 26
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const distance = Math.max(Math.abs(dx), Math.abs(dy))
      set(alignmentCenter + dx, alignmentCenter + dy, distance !== 1)
    }
  }

  set(8, 4 * VERSION + 9, true)

  for (let i = 0; i < 9; i++) {
    reserved[8][i] = true
    reserved[i][8] = true
  }
  for (let i = 0; i < 8; i++) {
    reserved[8][SIZE - 1 - i] = true
    reserved[SIZE - 1 - i][8] = true
  }

  return { modules, reserved }
}

function gfTables() {
  const exp = new Array<number>(512)
  const log = new Array<number>(256)
  let x = 1
  for (let i = 0; i < 255; i++) {
    exp[i] = x
    log[x] = i
    x <<= 1
    if (x & 0x100) x ^= 0x11d
  }
  for (let i = 255; i < 512; i++) exp[i] = exp[i - 255]
  return { exp, log }
}

const GF = gfTables()

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return GF.exp[GF.log[a] + GF.log[b]]
}

function generatorPoly(degree: number): number[] {
  let poly = [1]
  for (let i = 0; i < degree; i++) {
    const next = new Array(poly.length + 1).fill(0)
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j]
      next[j + 1] ^= gfMul(poly[j], GF.exp[i])
    }
    poly = next
  }
  return poly
}

function reedSolomon(data: number[], degree: number): number[] {
  const gen = generatorPoly(degree)
  const result = new Array(degree).fill(0)
  for (const byte of data) {
    const factor = byte ^ result.shift()
    result.push(0)
    if (factor) {
      for (let i = 0; i < degree; i++) {
        result[i] ^= gfMul(gen[i + 1], factor)
      }
    }
  }
  return result
}

function pushBits(bits: number[], value: number, length: number) {
  for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1)
}

function dataCodewords(text: string): number[] {
  const bytes = Array.from(new TextEncoder().encode(text))
  if (bytes.length > 78) {
    throw new Error('QR content is too long for the built-in generator')
  }

  const bits: number[] = []
  pushBits(bits, 0b0100, 4)
  pushBits(bits, bytes.length, 8)
  bytes.forEach(byte => pushBits(bits, byte, 8))

  const capacity = DATA_CODEWORDS * 8
  const terminator = Math.min(4, capacity - bits.length)
  pushBits(bits, 0, terminator)
  while (bits.length % 8 !== 0) bits.push(0)

  const codewords: number[] = []
  for (let i = 0; i < bits.length; i += 8) {
    codewords.push(bits.slice(i, i + 8).reduce((sum, bit) => (sum << 1) | bit, 0))
  }
  for (let pad = 0; codewords.length < DATA_CODEWORDS; pad++) {
    codewords.push(pad % 2 === 0 ? 0xec : 0x11)
  }
  return codewords
}

function formatBits(mask: number): number {
  let data = (0b01 << 3) | mask
  let value = data << 10
  const generator = 0x537
  for (let i = 14; i >= 10; i--) {
    if ((value >>> i) & 1) value ^= generator << (i - 10)
  }
  return (((data << 10) | value) ^ 0x5412) & 0x7fff
}

function applyFormat(modules: Matrix, mask: number) {
  const bits = formatBits(mask)
  const bit = (i: number) => ((bits >>> i) & 1) === 1
  const set = (x: number, y: number, dark: boolean) => { modules[y][x] = dark }

  for (let i = 0; i <= 5; i++) set(8, i, bit(i))
  set(8, 7, bit(6))
  set(8, 8, bit(7))
  set(7, 8, bit(8))
  for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i))

  for (let i = 0; i < 8; i++) set(SIZE - 1 - i, 8, bit(i))
  for (let i = 8; i < 15; i++) set(8, SIZE - 15 + i, bit(i))
}

function maskBit(x: number, y: number, mask: number): boolean {
  switch (mask) {
    case 0: return (x + y) % 2 === 0
    case 1: return y % 2 === 0
    case 2: return x % 3 === 0
    case 3: return (x + y) % 3 === 0
    default: return false
  }
}

function qrMatrix(text: string): boolean[][] {
  const { modules, reserved } = makeMatrix()
  const data = dataCodewords(text)
  const allCodewords = data.concat(reedSolomon(data, EC_CODEWORDS))
  const bits = allCodewords.flatMap(byte => Array.from({ length: 8 }, (_, i) => (byte >>> (7 - i)) & 1))
  const mask = 0

  let bitIndex = 0
  let upward = true
  for (let x = SIZE - 1; x > 0; x -= 2) {
    if (x === 6) x--
    for (let step = 0; step < SIZE; step++) {
      const y = upward ? SIZE - 1 - step : step
      for (let dx = 0; dx < 2; dx++) {
        const xx = x - dx
        if (reserved[y][xx]) continue
        const dark = (bits[bitIndex++] ?? 0) === 1
        modules[y][xx] = dark !== maskBit(xx, y, mask)
      }
    }
    upward = !upward
  }

  applyFormat(modules, mask)
  return modules.map(row => row.map(Boolean))
}

function qrSvgDataUrl(text: string): string {
  const modules = qrMatrix(text)
  const quiet = 4
  const size = SIZE + quiet * 2
  const cells = modules.flatMap((row, y) =>
    row.map((dark, x) => dark ? `<rect x="${x + quiet}" y="${y + quiet}" width="1" height="1"/>` : '')
  ).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><g fill="#000">${cells}</g></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export function QRCode() {
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  const qrSrc = useMemo(() => {
    if (!url) return ''
    try {
      return qrSvgDataUrl(url)
    } catch {
      return ''
    }
  }, [url])

  if (!url || !qrSrc) return null

  return (
    <div className="card-btv max-w-xs mx-auto hidden sm:block">
      <div className="text-center">
        <p className="text-base font-extrabold text-btv-dark mb-2">
          扫码打开
        </p>
        <p className="text-xs text-[#5C728D] font-bold mb-3">
          用手机相机扫一扫，立刻开始玩！
        </p>
        <img
          src={qrSrc}
          alt="扫码打开游戏"
          className="w-40 h-40 mx-auto rounded-2xl shadow-sm"
        />
        <p className="text-[10px] text-[#5C728D] font-bold mt-3 truncate max-w-full">
          {url}
        </p>
      </div>
    </div>
  )
}
