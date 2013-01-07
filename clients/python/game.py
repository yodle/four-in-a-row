import httplib
import urllib
import json

from state import State

class Game:
	ROWS = 6
	COLS = 7

	def __init__(self, host, port):
		self.gameId = 0
		self.state = None
		self.host = host
		self.port = port
		self.state = State(Game.ROWS, Game.COLS)

	def init(self, nickname, level):
		response = self.getPostRequest(
			self.host, self.port,
			'/game/init/%s' % level,
			{'nickname': nickname, 'scaffold': 'python'}
		)
		stateJson = json.loads(response)
		self.updateState(stateJson)

		self.gameId = stateJson['id']

		return self.state

	def move(self, col):
		response = self.getPostRequest(
			self.host, self.port,
			'/game/move/%s' % self.gameId,
			{'move': col}
		)
		stateJson = json.loads(response)
		self.updateState(stateJson)

		return self.state

	def updateState(self, stateJson):
		if 'error' in stateJson:
			self.state.setError(stateJson['error'])
			return
		self.updateBoard(stateJson['board'])
		self.state.setGameOver(stateJson['gameOver'])
		self.state.setMoveList(stateJson['moveList'])
		self.state.setMoves(stateJson['moves'])
		self.state.setPlayerNumber(stateJson['challengerPlayer'])

	def updateBoard(self, board):
		for col_i, col in enumerate(board):
			for row_i, slot in enumerate(col):
				self.state.setSlot(row_i, col_i, slot)

	def getPostRequest(self, host, port, url, params):
		params = urllib.urlencode(params)
		headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}
		conn = httplib.HTTPConnection(host, port)
		conn.request('POST', url, params, headers)
		return conn.getresponse().read()
