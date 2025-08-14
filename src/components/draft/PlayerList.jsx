import { Trash2, RotateCcw } from "lucide-react"

/**
 * PlayerList Component - Displays list of players with management controls
 * @param {Object} props
 * @param {Array} props.players - Array of player objects
 * @param {Array} props.draftResults - Array of draft results
 * @param {Function} props.onRemovePlayer - Function to remove a player
 * @param {Function} props.onResetDraft - Function to reset the draft
 * @param {Function} props.onShuffle - Function to shuffle players order
 */
export const PlayerList = ({ 
  players, 
  draftResults, 
  onRemovePlayer, 
  onResetDraft,
  onShuffle,
}) => {
  if (players.length === 0) return null

  const canShuffle = players.length >= 2

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Players</span>
        <div className="flex items-center gap-2">
          {canShuffle && (
            <button
              type="button"
              onClick={onShuffle}
              className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Shuffle
            </button>
          )}
          {draftResults.length > 0 && (
            <button
              type="button"
              onClick={onResetDraft}
              className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </button>
          )}
        </div>
      </div>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {players.map((player) => {
          const isDrafted = draftResults.some((result) => result.player.id === player.id)
          return (
            <div
              key={player.id}
              className={`flex items-center justify-between p-2 rounded-md transition-all ${
                isDrafted ? "bg-gray-100 opacity-50" : "bg-orange-50"
              }`}
            >
              <p
                className={`font-medium text-sm ${
                  isDrafted ? "line-through text-gray-500" : "text-gray-900"
                }`}
              >
                {player.name}
              </p>
              <button
                type="button"
                onClick={() => onRemovePlayer(player.id)}
                className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}