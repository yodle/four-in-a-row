package game

import (
	"encoding/json"
	"fmt"
)

const SERVER = "http://localhost:3000/game/"

type GameState struct {
	Rows        int    `json:"ROWS"`
	Cols        int    `json:"COLS"`
	Id          string `json:"_id"`
	HumanPlayer int
	GameOver    int
	Nickname    string
	Turn        int
	Moves       int
	LastMove    int
	MoveList    []int
	Ai          int
	Board       [][]int
	Message     string
	Error       string
}

type Game struct {
	restClient *RestClient
	nickname   string
	aiLevel    int
	gameId     string
}

func NewGame(nickname string, aiLevel int) *Game {
	restClient := NewRestClient(SERVER)
	return &Game{restClient, nickname, aiLevel, ""}
}

func getGameStateFromString(s string) *GameState {
	result := &GameState{}
	json.Unmarshal([]byte(s), result)
	return result
}

func (game *Game) prepareInit() (method string, data map[string]string) {
	method = "init/" + fmt.Sprintf("%d", game.aiLevel)
	data = map[string]string{"nickname": game.nickname}
	return method, data
}

func (game *Game) Init() *GameState {
	method, data := game.prepareInit()
	gameState := getGameStateFromString(game.restClient.Post(method, data))
	game.gameId = gameState.Id
	return gameState
}

func (game *Game) prepareMove(column int) (method string, data map[string]string) {
	method = "move/" + game.gameId
	data = map[string]string{"move": fmt.Sprintf("%d", column)}
	return method, data
}

func (game *Game) Move(column int) *GameState {
	method, data := game.prepareMove(column)
	return getGameStateFromString(game.restClient.Post(method, data))
}

func (game *Game) State() *GameState {
	method := "state/" + game.gameId
	return getGameStateFromString(game.restClient.Get(method))
}
