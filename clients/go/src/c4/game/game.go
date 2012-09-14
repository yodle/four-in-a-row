package game

import (
	"encoding/json"
)

const SERVER = "http://TODO-SERVER-ADDR/api/"

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
}

func NewGame(nickname string, aiLevel int) *Game {
	restClient := NewRestClient(SERVER)
	return &Game{restClient, nickname, aiLevel}
}

func getGameStateFromString(s string) *GameState {
	result := &GameState{}
	json.Unmarshal([]byte(s), result)
	return result
}

func (game *Game) prepareInit() (method string, data map[string]string) {
	method = "init/" + string(game.aiLevel)
	data = map[string]string{"nickname": game.nickname}
	return method, data
}

func (game *Game) Init() *GameState {
	method, data := game.prepareInit()
	return getGameStateFromString(game.restClient.Call(method, data))
}

func (game *Game) prepareMove(column int) (method string, data map[string]string) {
	method = "move/" + game.Id
	data = map[string]string{"move": column}
	return method, data
}

func (game *Game) Move(column int) *GameState {
	method, data := game.prepareMove(column)
	return getGameStateFromString(game.restClient.call(method, data))
}
