"use client"

import { useState } from "react"
import { Plus, Users } from "lucide-react"
import { PlayerList } from "./PlayerList"

/**
 * SetupPanel Component - League configuration and player management
 * @param {Object} props
 * @param {Array} props.players - Array of player objects
 * @param {Array} props.draftResults - Array of draft results
 * @param {Object} props.settings - League settings object
 * @param {Function} props.onAddPlayer - Function to add a new player
 * @param {Function} props.onRemovePlayer - Function to remove a player
 * @param {Function} props.onUpdateSettings - Function to update settings
 * @param {Function} props.onResetDraft - Function to reset the draft
 * @param {Function} props.onShuffle - Function to shuffle players
 */
export const SetupPanel = ({
  players,
  draftResults,
  settings,
  onAddPlayer,
  onRemovePlayer,
  onUpdateSettings,
  onResetDraft,
  onShuffle,
}) => {
  const [newPlayerName, setNewPlayerName] = useState("")

  const handleAddPlayer = () => {
    if (onAddPlayer(newPlayerName)) {
      setNewPlayerName("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddPlayer()
    }
  }

  const maxPlayers = settings.leagueSize

  return (
    <div className="shadow-lg border-0 bg-white/80 backdrop-blur-sm rounded-xl">
      <div className="px-6 py-4 border-b border-orange-100">
        <div className="flex items-center gap-2 text-orange-700">
          <Users className="w-5 h-5" />
          <h2 className="font-semibold">Setup</h2>
        </div>
        <p className="text-sm text-gray-600">Configure your league</p>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="league-name" className="text-sm font-medium text-gray-700">League Name</label>
          <input
            id="league-name"
            placeholder="Enter league name"
            value={settings.leagueName}
            onChange={(e) => onUpdateSettings({ leagueName: e.target.value })}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="league-size" className="text-sm font-medium text-gray-700">League Size</label>
          <input
            id="league-size"
            type="number"
            min={4}
            max={32}
            step={1}
            value={settings.leagueSize}
            onChange={(e) => {
              const next = Math.max(4, Math.min(32, Number(e.target.value) || 0))
              onUpdateSettings({ leagueSize: next })
            }}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="text-xs text-gray-500">Min 4, max 32. You can add up to {maxPlayers} players.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="spin-duration" className="text-sm font-medium text-gray-700">Spin Duration (seconds)</label>
          <input
            id="spin-duration"
            type="number"
            min={1}
            max={60}
            step={1}
            value={settings.spinDurationSeconds}
            onChange={(e) => {
              const next = Math.max(1, Math.min(60, Number(e.target.value) || 0))
              onUpdateSettings({ spinDurationSeconds: next })
            }}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="text-xs text-gray-500">1–60 seconds. Default is 5s.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="sport" className="text-sm font-medium text-gray-700">Sport</label>
          <select
            id="sport"
            value={settings.sport}
            onChange={(e) => onUpdateSettings({ sport: e.target.value })}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="football">Football</option>
            <option value="basketball">Basketball</option>
            <option value="baseball">Baseball</option>
            <option value="hockey">Hockey</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="draft-direction" className="text-sm font-medium text-gray-700">Draft Order</label>
          <select
            id="draft-direction"
            value={settings.draftDirection}
            onChange={(e) => onUpdateSettings({ draftDirection: e.target.value })}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="high-to-low">High to Low ({maxPlayers}th → 1st)</option>
            <option value="low-to-high">Low to High (1st → {maxPlayers}th)</option>
          </select>
        </div>

        <hr className="my-4 border-orange-100" />

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Add Players ({players.length}/{maxPlayers})</label>
          <div className="space-y-2">
            <input
              placeholder="Player name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={players.length >= maxPlayers}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
            />
            <button
              onClick={handleAddPlayer}
              disabled={players.length >= maxPlayers || !newPlayerName.trim()}
              className="w-full inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white shadow-sm bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Player
            </button>
          </div>
        </div>

        <PlayerList
          players={players}
          draftResults={draftResults}
          onRemovePlayer={onRemovePlayer}
          onResetDraft={onResetDraft}
          onShuffle={onShuffle}
        />
      </div>
    </div>
  )
}