"use client"

import { useMemo } from "react"

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
]

export function ConfettiOverlay({ active, pieces = 120 }) {
  const confetti = useMemo(() => {
    return Array.from({ length: pieces }).map((_, i) => {
      const left = Math.random() * 100
      const size = 6 + Math.random() * 8
      const duration = 3000 + Math.random() * 2500
      const delay = Math.random() * 300
      const rotate = Math.random() * 360
      const color = COLORS[i % COLORS.length]
      const horizontalDrift = (Math.random() - 0.5) * 80
      return { left, size, duration, delay, rotate, color, horizontalDrift, id: i }
    })
  }, [pieces])

  if (!active) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translate3d(0, -110%, 0) rotate(0deg); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate3d(var(--drift, 0px), 110vh, 0) rotate(360deg); opacity: 0; }
        }
      `}</style>
      {confetti.map((c) => (
        <span
          key={c.id}
          style={{
            position: "absolute",
            top: -20,
            left: `${c.left}%`,
            width: c.size,
            height: c.size * (0.6 + Math.random()),
            backgroundColor: c.color,
            transform: `rotate(${c.rotate}deg)`,
            animation: `confetti-fall ${c.duration}ms ease-out ${c.delay}ms forwards`,
            borderRadius: 2,
            // custom property consumed in keyframes
            "--drift": `${c.horizontalDrift}px`,
            boxShadow: "0 0 2px rgba(0,0,0,0.1)",
          }}
        />
      ))}
    </div>
  )
} 