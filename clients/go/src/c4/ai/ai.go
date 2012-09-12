package main

import "fmt"
import "c4/game"

func main() {
    fmt.Printf("hello\n")
    theGame := game.New("exampleGoAi", 1)
    gameState := theGame.Init()
    fmt.Printf("game id: %d", gameState.Id)
}
