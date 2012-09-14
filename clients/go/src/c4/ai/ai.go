package main

import (
	"c4/game"
	"fmt"
)

func main() {
	fmt.Printf("hello\n")
	theGame := game.NewGame("exampleGoAi", 1)
	gameState := theGame.Init()
	fmt.Printf("game id: %d", gameState.Id)
}
