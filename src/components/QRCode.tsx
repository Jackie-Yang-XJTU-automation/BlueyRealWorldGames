import { useState, useEffect } from 'react'

export function QRCode() {
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  if (!url) return null

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`

  return (
    <div className="card-btv max-w-xs mx-auto">
      <div className="text-center">
        <p className="text-base font-extrabold text-btv-dark mb-2">
          扫码打开
        </p>
        <p className="text-xs text-gray-400 font-bold mb-3">
          用手机相机扫一扫，立刻开始玩！
        </p>
        <img
          src={qrSrc}
          alt="扫码打开游戏"
          className="w-40 h-40 mx-auto rounded-2xl shadow-sm"
        />
        <p className="text-[10px] text-gray-300 font-bold mt-3 truncate max-w-full">
          {url}
        </p>
      </div>
    </div>
  )
}
