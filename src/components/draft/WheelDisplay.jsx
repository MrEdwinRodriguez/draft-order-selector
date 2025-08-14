"use client"

import { useRef, useEffect } from "react"
import { Trophy } from "lucide-react"
import { getWheelSegments, getOrdinalSuffix } from "@/utils/draft-utils"

/**
 * WheelDisplay Component - Interactive spinning wheel for draft selection
 * @param {Object} props
 * @param {Array} props.remainingPlayers - Players still available for drafting
 * @param {number} props.totalPlayers - Total number of players in league (league size)
 * @param {Array} props.draftResults - Current draft results
 * @param {boolean} props.isSpinning - Whether wheel is currently spinning
 * @param {number} props.currentRotation - Current wheel rotation in degrees
 * @param {number} props.currentPick - Current pick position
 * @param {string} [props.leagueName] - Optional league name for banner text
 * @param {number} [props.spinDurationSec] - Spin duration in seconds
 * @param {Function} props.onSpin - Function to trigger wheel spin
 */
export const WheelDisplay = ({
  remainingPlayers,
  totalPlayers,
  draftResults,
  isSpinning,
  currentRotation,
  currentPick,
  leagueName,
  spinDurationSec = 5,
  onSpin,
}) => {
  const wheelRef = useRef(null)
  const segments = getWheelSegments(remainingPlayers)

  // Optional sounds: place /public/sounds/spin.mp3 and /public/sounds/ding.mp3 (CC0)
  const spinAudioRef = useRef(null)
  const dingAudioRef = useRef(null)
  useEffect(() => {
    const canPlayMp3 = typeof Audio !== "undefined" && new Audio().canPlayType("audio/mpeg") !== ""

    async function setupAudio() {
      if (!canPlayMp3) return
      try {
        const spinHead = await fetch("/sounds/spin.mp3", { method: "HEAD" })
        if (spinHead.ok) {
          const a = new Audio()
          a.src = "/sounds/spin.mp3"
          a.loop = true
          a.volume = 0.35
          spinAudioRef.current = a
        }
      } catch {}
      try {
        const dingHead = await fetch("/sounds/ding.mp3", { method: "HEAD" })
        if (dingHead.ok) {
          const a = new Audio()
          a.src = "/sounds/ding.mp3"
          a.volume = 0.6
          dingAudioRef.current = a
        }
      } catch {}
    }

    setupAudio()

    return () => {
      if (spinAudioRef.current) {
        spinAudioRef.current.pause()
        spinAudioRef.current.currentTime = 0
      }
    }
  }, [])

  useEffect(() => {
    if (isSpinning) {
      if (spinAudioRef.current && spinAudioRef.current.src) {
        const p = spinAudioRef.current.play()
        if (p && typeof p.catch === "function") p.catch(() => {})
      }
      const timeout = setTimeout(() => {
        if (spinAudioRef.current) {
          spinAudioRef.current.pause()
          spinAudioRef.current.currentTime = 0
        }
        if (dingAudioRef.current && dingAudioRef.current.src) {
          const p = dingAudioRef.current.play()
          if (p && typeof p.catch === "function") p.catch(() => {})
        }
      }, Math.max(0, spinDurationSec * 1000 - 150))
      return () => clearTimeout(timeout)
    } else {
      if (spinAudioRef.current) {
        spinAudioRef.current.pause()
        spinAudioRef.current.currentTime = 0
      }
    }
  }, [isSpinning, spinDurationSec])

  if (remainingPlayers.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-96 h-96 flex items-center justify-center shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-xl">
          <div className="text-center p-6">
            <Trophy className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {draftResults.length === 0 ? "Add Players to Start" : "Draft Complete!"}
            </h3>
            <p className="text-gray-600">
              {draftResults.length === 0
                ? "Add at least 2 players to begin the draft wheel"
                : "All players have been assigned draft positions"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const hasLeagueName = typeof leagueName === "string" && leagueName.trim().length > 0
  const showBanner = (remainingPlayers.length === totalPlayers && totalPlayers >= 2) || draftResults.length > 0

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center">
        {showBanner && (
          <div className="w-96 mb-6 text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg border border-orange-200">
              {hasLeagueName ? (
                <p className="text-lg font-bold text-orange-700">
                  The {getOrdinalSuffix(currentPick)} pick in this year's draft for {leagueName} goes to:
                </p>
              ) : (
                <p className="text-lg font-bold text-orange-700">
                  The {getOrdinalSuffix(currentPick)} pick in this year's draft goes to:
                </p>
              )}
              <p className="text-sm text-gray-600">Spin to select!</p>
            </div>
          </div>
        )}

        {/* Wheel */}
        <div className="relative">
          <div
            ref={wheelRef}
            className={"w-96 h-96 rounded-full relative overflow-hidden shadow-2xl"}
            style={{
              transform: `rotate(${currentRotation}deg)`,
              transitionProperty: "transform",
              transitionDuration: `${spinDurationSec}s`,
              transitionTimingFunction: "cubic-bezier(0.08, 0.8, 0.12, 1)",
            }}
          >
            <svg width="384" height="384" className="absolute inset-0">
              {segments.map((segment) => {
                const { startAngle, endAngle, color, player } = segment
                const startRad = (startAngle * Math.PI) / 180
                const endRad = (endAngle * Math.PI) / 180
                const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

                const x1 = 192 + 180 * Math.cos(startRad)
                const y1 = 192 + 180 * Math.sin(startRad)
                const x2 = 192 + 180 * Math.cos(endRad)
                const y2 = 192 + 180 * Math.sin(endRad)

                const textAngle = (startAngle + endAngle) / 2
                const textRad = (textAngle * Math.PI) / 180
                const textX = 192 + 120 * Math.cos(textRad)
                const textY = 192 + 120 * Math.sin(textRad)

                return (
                  <g key={player.id}>
                    <path
                      d={`M 192 192 L ${x1} ${y1} A 180 180 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={color}
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="white"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                      className="pointer-events-none select-none"
                    >
                      {player.name}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Center Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={onSpin}
              disabled={isSpinning || remainingPlayers.length === 0}
              className="w-24 h-24 rounded-full bg-white hover:bg-gray-50 text-gray-900 shadow-xl border-4 border-orange-500 font-bold text-lg disabled:opacity-50"
            >
              {isSpinning ? "..." : "SPIN"}
            </button>
          </div>

          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-orange-500"></div>
          </div>
        </div>
      </div>
    </div>
  )
}