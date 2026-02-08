"use client"

import { useEffect, useState } from "react"

interface FloatingHeart {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([])

  useEffect(() => {
    const generated: FloatingHeart[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 16 + 8,
      duration: Math.random() * 10 + 12,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.1,
    }))
    setHearts(generated)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="animate-float-up absolute bottom-0"
          style={{
            left: `${heart.left}%`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          <svg
            width={heart.size}
            height={heart.size}
            viewBox="0 0 24 24"
            fill="none"
            style={{ opacity: heart.opacity }}
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              fill="#ff0844"
            />
          </svg>
        </div>
      ))}
    </div>
  )
}
