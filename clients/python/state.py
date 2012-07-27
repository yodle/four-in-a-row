class State:
	EMPTY = 0
	PLAYER = 1
	OPPONENT = 2
	
	def __init__(self, rows, cols):
		self.board = [[State.EMPTY for x in range(cols)] for y in range(rows)]

	def setSlot(self, row, col, who):
		self.board[row][col] = who

	def getSlot(self, row, col):
		return self.board[row][col]

