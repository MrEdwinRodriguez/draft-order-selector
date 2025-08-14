export const WHEEL_COLORS = [
	"#ef4444", // red-500
	"#f97316", // orange-500
	"#eab308", // yellow-500
	"#22c55e", // green-500
	"#06b6d4", // cyan-500
	"#3b82f6", // blue-500
	"#8b5cf6", // violet-500
	"#ec4899", // pink-500
  ]
  
  /**
   * Get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
   * @param {number} num - The number to get suffix for
   * @returns {string} Number with ordinal suffix
   */
  export const getOrdinalSuffix = (num) => {
	const j = num % 10
	const k = num % 100
	if (j === 1 && k !== 11) return num + "st"
	if (j === 2 && k !== 12) return num + "nd"
	if (j === 3 && k !== 13) return num + "rd"
	return num + "th"
  }
  
  /**
   * Calculate the current pick position based on draft direction
   * @param {number} totalPlayers - Total number of players in league
   * @param {number} currentPickIndex - Current pick index (0-based)
   * @param {string} draftDirection - Either "high-to-low" or "low-to-high"
   * @returns {number} Current pick position
   */
  export const getCurrentPickPosition = (totalPlayers, currentPickIndex, draftDirection) => {
	if (draftDirection === "high-to-low") {
	  return totalPlayers - currentPickIndex
	} else {
	  return currentPickIndex + 1
	}
  }
  
  /**
   * Get players that haven't been drafted yet
   * @param {Array} players - All players in the league
   * @param {Array} draftResults - Current draft results
   * @returns {Array} Players still available for drafting
   */
  export const getRemainingPlayers = (players, draftResults) => {
	return players.filter(
	  (player) => !draftResults.some((result) => result.player.id === player.id)
	)
  }
  
  /**
   * Generate wheel segments for the spinning wheel
   * @param {Array} remainingPlayers - Players still available for drafting
   * @returns {Array} Array of wheel segments with angles and colors
   */
  export const getWheelSegments = (remainingPlayers) => {
	if (remainingPlayers.length === 0) return []
  
	const segmentAngle = 360 / remainingPlayers.length
  
	return remainingPlayers.map((player, index) => {
	  const startAngle = index * segmentAngle
	  let endAngle = (index + 1) * segmentAngle
	  // Avoid a 360° arc which SVG cannot render by slightly capping the last segment
	  if (index === remainingPlayers.length - 1 && endAngle === 360) {
		endAngle = 359.999
	  }
	  const midAngle = (startAngle + endAngle) / 2
	  const color = WHEEL_COLORS[index % WHEEL_COLORS.length]
  
	  return {
		player,
		startAngle,
		endAngle,
		midAngle,
		color,
	  }
	})
  }
  
  /**
   * Calculate which player was selected based on wheel rotation
   * @param {number} totalRotation - Total rotation of the wheel
   * @param {Array} remainingPlayers - Players still available for drafting
   * @returns {Object} Selected player object
   */
  export const calculateSelectedPlayer = (totalRotation, remainingPlayers) => {
	const segmentAngle = 360 / remainingPlayers.length
	const normalizedAngle = (360 - (totalRotation % 360)) % 360
	const selectedIndex = Math.floor(normalizedAngle / segmentAngle)
	return remainingPlayers[selectedIndex]
  }