/**
 * DraftResults Component - Displays the current draft order results
 * @param {Object} props
 * @param {Array} props.draftResults - Array of draft results with position and player
 */
export const DraftResults = ({ draftResults }) => {
  if (draftResults.length === 0) return null

  return (
    <div className="shadow-lg border-0 bg-white/80 backdrop-blur-sm rounded-xl">
      <div className="px-6 py-4 border-b border-orange-100">
        <h3 className="text-orange-700 font-semibold">Draft Order</h3>
        <p className="text-sm text-gray-600">Results so far</p>
      </div>
      <div className="p-6">
        <div className="space-y-2">
          {draftResults
            .sort((a, b) => a.position - b.position)
            .map((result) => (
              <div
                key={result.player.id}
                className="flex items-center gap-3 p-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg"
              >
                <span className="inline-flex min-w-10 justify-center rounded-md px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-red-500">
                  #{result.position}
                </span>
                <span className="font-medium text-gray-900">{result.player.name}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}