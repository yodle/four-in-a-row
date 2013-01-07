#!/usr/bin/python

import unittest
import json
from game import Game

class GameTest(unittest.TestCase):
	
	GAME_ID = '5011db504daa6da82a000001'

	def gameInitGetPostRequestMock(self, host, port, url, params):
		return json.dumps({
			'moves': 0,
			'turn': 1,
			'humanPlayer': 1,
			'gameOver': False,
			'ROWS': 3,
			'COLS': 2,
			'id': GameTest.GAME_ID,
			'board': [
				[0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0],
			],
			'moves': 0,
			'moveList': [],
			'challengerPlayer': 1,
		})

	def gameMoveGetPostRequestMock(self, host, port, url, params):
		return json.dumps({
			'board': [
				[0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0],
				[0, 2, 0, 0, 0, 0],
				[0, 1, 0, 0, 0, 0],
			],
			'gameOver': False,
			'moveList': [],
			'moves': 2,
			'challengerPlayer': 1,
		})

	def setUp(self):
		self.game = Game('localhost', 3000)

	def testGameIdAfterGameInit(self):
		self.game.getPostRequest = self.gameInitGetPostRequestMock
		self.game.init('Player 1', 4)
		self.assertEquals(GameTest.GAME_ID, self.game.gameId)

	def testBoardStateAfterGameInit(self):
		self.game.getPostRequest = self.gameInitGetPostRequestMock
		self.game.init('Player 1', 4)
		for row in self.game.state.board:
			self.assertEquals([0, 0, 0, 0, 0, 0, 0], row)

	def testBoardSizeAfterGameInit(self):
		self.game.getPostRequest = self.gameInitGetPostRequestMock
		self.game.init('Player 1', 4)
		self.assertEquals(6, self.game.state.getNumRows())
		self.assertEquals(7, self.game.state.getNumCols())

	def testBoardStateAfterGameMove(self):
		self.game.getPostRequest = self.gameMoveGetPostRequestMock
		self.game.move(2)
		self.assertEquals([0, 0, 0, 0, 0, 2, 1], self.game.state.board[1])

if __name__ == '__main__':
	unittest.main()
