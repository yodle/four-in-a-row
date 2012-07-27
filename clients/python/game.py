import httplib
import urllib
import json

from state import State

class Game:
	def __init__(self, host, port):
		self.gameId = 0
		self.state = None
		self.host = host
		self.port = port

	def init(self, nickname, level):
		response = self.get_post_request(self.host, self.port, '/game/init/' + str(level), {'nickname': nickname})
		json_root = json.loads(response)
		self.gameId = json_root['_id']
		self.update_board(json_root['board'])
	
	def move(self, col):
		response = self.get_post_request(self.host, self.port, '/game/move/' + str(self.gameId), {'move': col})
		json_root = json.loads(response)
		self.update_board(json_root['board'])

	def update_board(self, board):
		cols = len(board)
		rows = len(board[0])
		self.state = State(rows, cols)
		for col_i, col in enumerate(board):
			for row_i, slot in enumerate(col):
				self.state.setSlot(row_i, col_i, slot)

	def get_post_request(self, host, port, url, params):
		params = urllib.urlencode(params)
		headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}
		conn = httplib.HTTPConnection(host, port)
		conn.request('POST', url, params, headers)
		return conn.getresponse().read()
