package main

import (
	"c4/game"
	"fmt"
	"math/rand"
)

func main() {
	//create a new game and initialize it
	theGame := game.NewGame("exampleGoAi", 1)
	gameState := theGame.Init()

	fmt.Printf("game id: %s\n", gameState.Id)

	//make random moves until the game is over
	for gameState.GameOver == 0 {
		gameState = theGame.Move(rand.Intn(gameState.Cols))
	}

	//although gameState is already set, reget it to test the State() method
	gameState = theGame.State()

	//declare victory or cower in defeat
	if gameState.GameOver == gameState.HumanPlayer {
		fmt.Print("I won!\n")
	} else {
		fmt.Print("Oh noes! I lost!\n")
	}
}
