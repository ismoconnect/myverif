import { useEffect, useRef, useState } from 'react'

// Usage options:
// - images: [url, ...]
// - OR slides: [{ src, title, text, align: 'left' | 'right' }, ...]
export default function HeroSlider({ images = [], slides = [], intervalMs = 8000 }) {
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  const slideList = slides.length > 0 ? slides : images.map((src) => ({ src }))
  const srcList = slideList.map((s) => s.src)
  const mobileAlign = slideList[index]?.mobileAlign

  useEffect(() => {
    if (srcList.length <= 1) return
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % srcList.length)
    }, intervalMs)
    return () => clearInterval(timerRef.current)
  }, [srcList.length, intervalMs])

  const prev = () => setIndex((i) => (i - 1 + srcList.length) % srcList.length)
  const next = () => setIndex((i) => (i + 1) % srcList.length)

  if (!srcList.length) return null

  return (
    <div className="relative overflow-hidden rounded-xl border bg-gray-200">
      <div className="relative h-56 sm:h-72 md:h-80 lg:h-96">
        {srcList.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="Hero"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
            loading={i === index ? 'eager' : 'lazy'}
          />)
        )}
        {slideList[index]?.maskClass ? (
          <div className={`absolute inset-0 ${slideList[index].maskClass}`} />
        ) : null}
        {slideList[index]?.title || slideList[index]?.text ? (
          <div
            className={
              `absolute inset-y-6 z-10 flex ${mobileAlign === 'right' ? 'right-4 items-end' : mobileAlign === 'left' ? 'left-4 items-start' : 'left-1/2 -translate-x-1/2 items-center'} transform 
              ${slideList[index]?.align === 'left' ? 'sm:left-6 sm:items-start sm:right-auto sm:translate-x-0' : 'sm:right-6 sm:items-end sm:left-auto sm:translate-x-0'}`
            }
          >
            {slideList[index]?.bare ? (
              <div className={`max-w-2xl ${slideList[index]?.overlayClass || 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]'} text-center ${slideList[index]?.align === 'left' ? 'sm:text-left' : 'sm:text-right'}`}>
                {slideList[index]?.title && (
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">{slideList[index].title}</h2>
                )}
                {slideList[index]?.text && (
                  <p className="text-base sm:text-lg md:text-xl">{slideList[index].text}</p>
                )}
              </div>
            ) : (
              <div className={`max-w-md ${slideList[index]?.overlayClass || 'bg-white/60 backdrop-blur-sm text-black'} rounded-lg p-4 sm:p-6 text-center ${slideList[index]?.align === 'left' ? 'sm:text-left' : 'sm:text-right'}`}>
                {slideList[index]?.title && (
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">{slideList[index].title}</h2>
                )}
                {slideList[index]?.text && (
                  <p className="text-sm sm:text-base">{slideList[index].text}</p>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
      {false && (
        <>
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 btn-secondary">‹</button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 btn-secondary">›</button>
        </>
      )}
      {/* indicators removed */}
    </div>
  )
}


