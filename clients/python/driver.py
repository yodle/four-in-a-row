#!/usr/bin/python

import skeleton

from game import Game

print "C4 Python Driver"

game = Game('localhost', 3000)
game.init('Yodle Player', 4)

while True:
	game.move(move(game.state))

