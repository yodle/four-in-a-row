import random

# Your ai logic goes here
# Given current board state, return your next move
def move(state):
	return random.randint(0, state.getNumCols())
