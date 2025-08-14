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
	if (!remainingPlayers || remainingPlayers.length === 0) {
	  return null
	}
	
	const segmentAngle = 360 / remainingPlayers.length
	// Adjust for pointer at 12 o'clock (270 degrees offset from 3 o'clock)
	const normalizedAngle = (270 - (totalRotation % 360)) % 360
	const selectedIndex = Math.floor(normalizedAngle / segmentAngle)
	
	// Ensure the index is within bounds
	if (selectedIndex >= 0 && selectedIndex < remainingPlayers.length) {
	  return remainingPlayers[selectedIndex]
	}
	
	// Fallback to first player if calculation is out of bounds
	return remainingPlayers[0]
  }
  
  /**
   * Get a short comment for a given pick number/league size
   * @param {number} position
   * @param {number} leagueSize
   */
  export function getPickComment(position, leagueSize) {
	const last = leagueSize
	if (position === Math.ceil(last / 2)) {
	  return "Perfectly centered. Never on the clock too long, never out of the action."
	}
	if (position === 1) {
	  return "Congrats! You just got the easiest decision of the draft. Try not to overthink it."
	}
	if (position === last) {
	  return "Two quick picks, then you can watch your queue get destroyed for 20 minutes."
	}
	if (position == 2) {
	  return "You should be able to get a good player here.  But rounds 2 and 3 are going to be key."
	}
	if (position == 3) {
	  return "Premium talent up top. Bank the star, then be ready for a long wait."
	}
	if (position == 4) {
	  return "Don't get too cute here in the first round.  Follow your rankings."
	}
	if (position == 5) {
	  return "Draft what the board gives you. Hopefully you know your league well enough to know what to do."
	}
	if (position == 6) {
	  return "Draft what the board gives you. Hopefully you know your league well enough to know what to do."
	}
	if (position == 7 ) {
	  return "The sure things are probably gone at this point.  But still a lot of good first round talent left."
	}
	if (position == last - 2) {
		return "The turn is your friend. Double-tap value and break hearts two at a time."
	}
	if (position == last - 1) {
		return "This will be a quick turnaround. Be prepared to adjust quickly."
	}
	if (position == 8 ) {
	  return "As the draft goes. Make sure you are aware of what the people after you need."
	}
	if (position == 9 ) {
	  return "As the draft goes. Make sure you are aware of what the people after you need."
	}
	if (position == 10 ) {
	  return "As the draft goes. Make sure you are aware of what the people after you need."
	}
	if (position < last / 2) {
	  return "Early side advantage. Build anchors now; depth will come later."
	}
	// position > last/2
	return "Late side leverage. Stack mini-runs and punish reaches with value."
  }