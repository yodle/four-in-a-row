package game

import (
	"encoding/json"
	"strconv"
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
	restClient Rester
	nickname   string
	aiLevel    int
	gameId     string
}

type Rester interface {
	Post(method string, data map[string]string) string
	Get(method string) string
}

func NewGame(nickname string, aiLevel int) *Game {
	restClient := NewRestClient(SERVER)
	return &Game{restClient, nickname, aiLevel, ""}
}

func (game *Game) Init() *GameState {
	method, data := game.prepareInit()
	gameState := getGameStateFromString(game.restClient.Post(method, data))
	game.gameId = gameState.Id
	return gameState
}

func (game *Game) Move(column int) *GameState {
	method, data := game.prepareMove(column)
	return getGameStateFromString(game.restClient.Post(method, data))
}

func (game *Game) State() *GameState {
	method := "state/" + game.gameId
	return getGameStateFromString(game.restClient.Get(method))
}

func getGameStateFromString(s string) *GameState {
	result := &GameState{}
	json.Unmarshal([]byte(s), result)
	return result
}

func (game *Game) prepareInit() (method string, data map[string]string) {
	method = "init/" + strconv.Itoa(game.aiLevel)
	data = map[string]string{"nickname": game.nickname}
	return method, data
}

func (game *Game) prepareMove(column int) (method string, data map[string]string) {
	method = "move/" + game.gameId
	data = map[string]string{"move": strconv.Itoa(column)}
	return method, data
}
