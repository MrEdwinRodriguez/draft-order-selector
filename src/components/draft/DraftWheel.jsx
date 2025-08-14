"use client"

import { Header } from "@/components/layout/Header"
import { SetupPanel } from "./SetupPanel"
import { DraftResults } from "./DraftResults"
import { WheelDisplay } from "./WheelDisplay"
import { useDraft } from "@/hooks/useDraft"
import { Modal } from "@/components/layout/Modal"
import { ConfettiOverlay } from "@/components/effects/Confetti"
import { useState, useCallback, useEffect } from "react"

export const DraftWheel = () => {
  const {
    state: { players, draftResults, settings, isSpinning, currentRotation, lastSelection },
    remainingPlayers,
    addPlayer,
    shufflePlayers,
    removePlayer,
    updateSettings,
    resetDraft,
    spinWheel,
    getCurrentPick,
    clearLastSelection,
  } = useDraft()

  const [showGuardModal, setShowGuardModal] = useState(false)
  const [showFinalModal, setShowFinalModal] = useState(false)

  const handleSpinGuarded = useCallback(() => {
    const totalNeeded = settings.leagueSize
    if (players.length < totalNeeded) {
      setShowGuardModal(true)
      return
    }
    spinWheel()
  }, [players.length, settings.leagueSize, spinWheel])

  // When draft completes: show modal & confetti
  useEffect(() => {
    if (players.length > 0 && draftResults.length === players.length) {
      setShowFinalModal(true)
    }
  }, [players.length, draftResults.length])

  const handleCloseFinal = useCallback(() => setShowFinalModal(false), [])

  const handleReset = useCallback(() => {
    setShowFinalModal(false)
    resetDraft()
  }, [resetDraft])

  const sortedFinal = [...draftResults].sort((a, b) => a.position - b.position)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left: Setup Panel */}
          <div className="lg:col-span-1 space-y-6">
            <SetupPanel
              players={players}
              draftResults={draftResults}
              settings={settings}
              onAddPlayer={addPlayer}
              onRemovePlayer={removePlayer}
              onUpdateSettings={updateSettings}
              onResetDraft={handleReset}
              onShuffle={shufflePlayers}
            />
          </div>

          {/* Center: Wheel */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <WheelDisplay
              remainingPlayers={remainingPlayers}
              totalPlayers={settings.leagueSize}
              draftResults={draftResults}
              isSpinning={isSpinning}
              currentRotation={currentRotation}
              currentPick={getCurrentPick()}
              leagueName={settings.leagueName}
              spinDurationSec={settings.spinDurationSeconds}
              onSpin={handleSpinGuarded}
            />
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-1 space-y-6">
            <DraftResults draftResults={draftResults} />
          </div>
        </div>
      </div>

      <ConfettiOverlay active={showFinalModal} />

      <Modal
        open={showGuardModal}
        onClose={() => setShowGuardModal(false)}
        title="Add all players to spin"
        actionLabel="Got it"
      >
        Please add all players before spinning or adjust League Size.
      </Modal>

      <Modal
        open={!!lastSelection}
        onClose={clearLastSelection}
        title="Pick Assigned"
        actionLabel="OK"
      >
        {lastSelection && (
          <p className="text-center text-lg text-gray-900">
            <span className="font-semibold">{lastSelection.player.name}</span>, you have the <span className="font-semibold">{lastSelection.position}</span> pick in this year's draft.
          </p>
        )}
      </Modal>

      <Modal
        open={showFinalModal}
        onClose={handleCloseFinal}
        title={settings.leagueName ? `${settings.leagueName} - Draft Results` : "Draft Results"}
        actionLabel="Close"
      >
        <div className="space-y-4">
          <p className="text-center text-lg font-semibold text-orange-700">Good Luck everyone!</p>
          <div className="space-y-2">
            {sortedFinal.map((result) => (
              <div key={result.player.id} className="flex items-center gap-3 p-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                <span className="inline-flex min-w-10 justify-center rounded-md px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-red-500">
                  #{result.position}
                </span>
                <span className="font-medium text-gray-900">{result.player.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}
