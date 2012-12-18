def printState(state):
	rows = state.getNumRows()
	cols = state.getNumCols()

	for row in range(rows):
		for col in range(cols):
			print state.getSlot(row, col),
		print "\n",
