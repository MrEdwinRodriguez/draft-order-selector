"use client"

import { useState, useCallback } from "react"
import { getRemainingPlayers, getCurrentPickPosition, calculateSelectedPlayer } from "@/utils/draft-utils"

const initialSettings = {
  leagueName: "",
  sport: "football",
  draftDirection: "high-to-low",
  leagueSize: 12,
  spinDurationSeconds: 5,
}

/**
 * Custom hook for managing draft state and logic
 * @returns {Object} Draft state and methods
 */
export const useDraft = () => {
  const [players, setPlayers] = useState([])
  const [draftResults, setDraftResults] = useState([])
  const [settings, setSettings] = useState(initialSettings)
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)
  const [lastSelection, setLastSelection] = useState(null)

  const remainingPlayers = getRemainingPlayers(players, draftResults)

  /**
   * Add a new player to the league
   * @param {string} name - Player name
   * @returns {boolean} Success status
   */
  const addPlayer = useCallback((name) => {
    if (name.trim() && players.length < settings.leagueSize) {
      const newPlayer = {
        id: Date.now().toString(),
        name: name.trim(),
      }
      setPlayers((prev) => [...prev, newPlayer])
      return true
    }
    return false
  }, [players.length, settings.leagueSize])

  /**
   * Shuffle players order (Fisher–Yates)
   */
  const shufflePlayers = useCallback(() => {
    setPlayers((prev) => {
      if (prev.length < 2) return prev
      const next = [...prev]
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const tmp = next[i]
        next[i] = next[j]
        next[j] = tmp
      }
      return next
    })
  }, [])

  /**
   * Remove a player from the league
   * @param {string} playerId - ID of player to remove
   */
  const removePlayer = useCallback((playerId) => {
    setPlayers((prev) => prev.filter((p) => p.id !== playerId))
    setDraftResults((prev) => prev.filter((result) => result.player.id !== playerId))
  }, [])

  /**
   * Update league settings
   * @param {Object} newSettings - Settings to update
   */
  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }, [])

  /**
   * Reset the draft results
   */
  const resetDraft = useCallback(() => {
    setDraftResults([])
    setCurrentRotation(0)
    setLastSelection(null)
  }, [])

  /**
   * Spin the wheel to select next player
   */
  const spinWheel = useCallback(() => {
    if (remainingPlayers.length === 0 || isSpinning) return

    setIsSpinning(true)

    // Calculate random spin (3-5 full rotations plus random position)
    const spins = 3 + Math.random() * 2
    const randomAngle = Math.random() * 360
    const totalRotation = currentRotation + spins * 360 + randomAngle

    setCurrentRotation(totalRotation)

    // Calculate which player was selected
    const selectedPlayer = calculateSelectedPlayer(totalRotation, remainingPlayers)

    // Add result after animation completes + 1 second delay
    const spinDurationMs = Math.max(1, Math.min(60, settings.spinDurationSeconds)) * 1000
    const delayMs = spinDurationMs + 1000 // Add 1 second delay

    setTimeout(() => {
      if (selectedPlayer) {
        const pickPosition = getCurrentPickPosition(
          settings.leagueSize,
          draftResults.length,
          settings.draftDirection
        )
        
        setDraftResults((prev) => [
          ...prev,
          {
            position: pickPosition,
            player: selectedPlayer,
          },
        ])
        setLastSelection({ position: pickPosition, player: selectedPlayer })
      }
      setIsSpinning(false)
    }, delayMs)
  }, [remainingPlayers, isSpinning, currentRotation, draftResults.length, settings.leagueSize, settings.draftDirection, settings.spinDurationSeconds])

  /**
   * Get the current pick position
   * @returns {number} Current pick position
   */
  const getCurrentPick = useCallback(() => {
    return getCurrentPickPosition(
      settings.leagueSize,
      draftResults.length,
      settings.draftDirection
    )
  }, [draftResults.length, settings.leagueSize, settings.draftDirection])

  const state = {
    players,
    draftResults,
    settings,
    isSpinning,
    currentRotation,
    lastSelection,
  }

  const clearLastSelection = useCallback(() => setLastSelection(null), [])

  return {
    state,
    remainingPlayers,
    addPlayer,
    shufflePlayers,
    removePlayer,
    updateSettings,
    resetDraft,
    spinWheel,
    getCurrentPick,
    clearLastSelection,
  }
}