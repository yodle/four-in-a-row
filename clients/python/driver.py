#!/usr/bin/python

import skeleton

from game import Game

print "C4 Python Driver"

game = Game('127.0.0.1', 3000)
game.init('Yodle Player', 4)

while True:
	next_move = skeleton.move(game.state)
	game.move(next_move)

