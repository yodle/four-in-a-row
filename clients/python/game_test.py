#!/usr/bin/python

import unittest

from game import Game

class TestGame(unittest.TestCase):
	
	def game_init_get_post_request_mock(self, host, port, url, params):
		return '{"moves":0, "turn":1, "humanPlayer":1, "gameOver":false, "ROWS":3, "COLS":2, "_id":"5011db504daa6da82a000001", "board":[[0, 0, 0], [0, 0, 0]]}';

	def game_move_get_post_request_mock(self, host, port, url, params):
		return '{"board":[[0, 0, 2], [0, 0, 1]]}'

	def setUp(self):
		self.game = Game('localhost', 3000)

	def test_game_init(self):
		self.game.get_post_request = self.game_init_get_post_request_mock
		self.game.init('Player 1', 4)
		self.assertEquals("5011db504daa6da82a000001", self.game.gameId)
		self.assertEquals(3, len(self.game.state.board))
		self.assertEquals(2, len(self.game.state.board[0]))
		for row in self.game.state.board:
			self.assertEquals([0, 0], row)

	def test_game_move(self):
		self.game.get_post_request = self.game_move_get_post_request_mock
		self.game.move(2)
		self.assertEquals(3, len(self.game.state.board))
		self.assertEquals(2, len(self.game.state.board[0]))
		self.assertEquals([0, 0], self.game.state.board[0])
		self.assertEquals([0, 0], self.game.state.board[1])
		self.assertEquals([2, 1], self.game.state.board[2])

if __name__ == '__main__':
	unittest.main()
