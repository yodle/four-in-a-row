#!/usr/bin/python

import skeleton
import game_utils
from optparse import OptionParser
from game import Game

parser = OptionParser()
parser.add_option('-a', '--host', dest='host',
	help='hostname of Yodle AI server')
parser.add_option('-p', '--port', dest='port',
	help='port of Yodle AI server')
parser.add_option('-n', '--name', dest='name',
	help='your AI name')
parser.add_option('-l', '--level', dest='level',
	help='Yodle AI level')
(options, args) = parser.parse_args()

if not options.host:
	parser.error('Provide a hostname')
if not options.port:
	parser.error('Provide a port')
if not options.name:
	parser.error('Provide your AI name')
if not options.level:
	parser.error('Provide a Yodle AI level')

game = Game(options.host, options.port)
state = game.init(options.name, options.level)

if state.getError() is not None:
	print state.getError()
else:
	print "\nC4 Python Driver\n"
	print "You are player number: %d" % state.getPlayerNumber()

	while True:
		print "Current Board:"
		game_utils.printState(state)
		print "\n",

		print "Your AI is thinking..."
		next_move = skeleton.move(game.state)
		print "Your next move: %d" % next_move
		print "Waiting for Yodle AI...\n"
		state = game.move(next_move)

		if state.getError() is not None:
			print state.getError()
			break

		if state.isGameOver():
			print 'Game Over, winning player number: %d' % state.getWinnerNumber()
			print 'Total Moves: %d' % state.getMoves()
			print 'Move List:'
			yourPlayer = state.getPlayerNumber() is 1
			for move in state.getMoveList():
				if yourPlayer:
					print "\tYour AI move: %s" % move
				else:
					print "\tYodle AI move: %s" % move
				yourPlayer = not yourPlayer
			break

