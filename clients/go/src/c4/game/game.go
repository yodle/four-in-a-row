package game

import (
	"io"
	"net/http"
	"net/url"
)

const (
	SERVER = "http://TODO-SERVER-ADDR/api/"
)

type GameState struct {
	Rows        int
	Cols        int
	Id          int
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
	nickname string
	aiLevel  int
}

func New(nickname string, aiLevel int) *Game {
	return &Game{nickname, aiLevel}
}

func convertMapToUrlValues(data map[string]string) url.Values {
	v := url.Values{}
	for key, value := range data {
		v.Add(key, value)
	}
	return v
}

func getGameStateFromReader(reader io.Reader) *GameState {
	return nil
}

func callApi(method string, data map[string]string) *GameState {
	target := SERVER + method
	formData := convertMapToUrlValues(data)

	resp, _ := http.PostForm(target, formData)
	defer resp.Body.Close()

	return getGameStateFromReader(resp.Body)
}

func (game *Game) Init() *GameState {
	method := "init/" + string(game.aiLevel)
	data := map[string]string{"nickname": game.nickname}
	return callApi(method, data)
}
