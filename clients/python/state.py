class State:
	def __init__(self, rows, cols):
		self.board = [[0 for x in range(cols)] for y in range(rows)]
		self.gameOver = False
		self.error = None

	def setPlayerNumber(self, playerNumber):
		self.playerNumber = playerNumber

	def getPlayerNumber(self):
		return self.playerNumber
	
	def setMoveList(self, moveList):
		self.moveList = moveList

	def getMoveList(self):
		return self.moveList

	def setMoves(self, moves):
		self.moves = moves

	def getMoves(self):
		return self.moves

	def setError(self, error):
		self.error = error

	def getError(self):
		return self.error

	def getNumRows(self):
		return len(self.board)
	
	def getNumCols(self):
		return len(self.board[0])

	def setGameOver(self, gameOver):
		self.gameOver = gameOver

	def isGameOver(self):
		return self.gameOver > 0

	def getWinnerNumber(self):
		return self.gameOver

	def setSlot(self, row, col, who):
		self.board[row][col] = who

	def getSlot(self, row, col):
		return self.board[row][col]

