"use client"

import { useEffect, useState } from "react"

type ParticleType = "heart" | "sparkle" | "petal"

interface Particle {
  id: number
  type: ParticleType
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
  variant: "normal" | "reverse"
}

function HeartSVG({ size, opacity, color }: { size: number; opacity: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill={color}
      />
    </svg>
  )
}

function SparkleSVG({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
      <path
        d="M12 2L13.5 9.5L21 12L13.5 14.5L12 22L10.5 14.5L3 12L10.5 9.5L12 2Z"
        fill="#ffd700"
      />
    </svg>
  )
}

function PetalSVG({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ opacity }}>
      <ellipse cx="10" cy="10" rx="4" ry="8" fill="#ffb3c1" transform="rotate(25 10 10)" />
    </svg>
  )
}

const HEART_COLORS = ["#ff0844", "#e91e63", "#ff4081", "#ff6b81", "#c2185b"]

export function FloatingHearts() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 20 }, (_, i) => {
      const types: ParticleType[] = ["heart", "heart", "sparkle", "petal", "heart"]
      return {
        id: i,
        type: types[i % types.length],
        left: Math.random() * 100,
        size: Math.random() * 14 + 6,
        duration: Math.random() * 14 + 10,
        delay: Math.random() * 15,
        opacity: Math.random() * 0.35 + 0.08,
        variant: i % 3 === 0 ? "reverse" : "normal",
      }
    })
    setParticles(generated)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute bottom-0 ${p.variant === "reverse" ? "animate-float-up-reverse" : "animate-float-up"}`}
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.type === "heart" && (
            <HeartSVG
              size={p.size}
              opacity={p.opacity}
              color={HEART_COLORS[p.id % HEART_COLORS.length]}
            />
          )}
          {p.type === "sparkle" && <SparkleSVG size={p.size * 0.8} opacity={p.opacity * 0.7} />}
          {p.type === "petal" && <PetalSVG size={p.size * 1.2} opacity={p.opacity * 0.6} />}
        </div>
      ))}
    </div>
  )
}
