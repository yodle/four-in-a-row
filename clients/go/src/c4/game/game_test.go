package game

import (
	"bytes"
	"strconv"
	"testing"
)

var nickname = "testnick"
var aiLevel = 123

func TestGameNewSetsNickNameAndAiLevel(t *testing.T) {
	game := NewGame(nickname, aiLevel)
	if game.nickname != nickname {
		t.Errorf("Game.New did not properly set the AI nickname. Expected '%s', Got '%s'", nickname, game.nickname)
	}
	if game.aiLevel != 123 {
		t.Errorf("Game.New did not properly set the AI level. Expected '%d', Got '%d'", aiLevel, game.aiLevel)
	}
}

func TestGamePrepareInitWorks(t *testing.T) {
	game := NewGame(nickname, aiLevel)
	method, data := game.prepareInit()

	expectedMethod := "init/" + strconv.Itoa(aiLevel)
	if method != expectedMethod {
		t.Errorf("Game.prepareInit did not return proper method. Expected '%s', Got '%s'", expectedMethod, method)
	}

	if len(data) != 1 {
		t.Errorf("Game.prepareInit did not return the right # of items in map.  Expected '1', Got '%d'", len(data))
	}

	if data["nickname"] != nickname {
		t.Errorf("Game.prepareInit did not return the proper nickname in map.  Expected '%s', Got '%s'", nickname, data["nickname"])
	}
}

func TestGamePrepareMoveWorks(t *testing.T) {
	game := NewGame(nickname, aiLevel)
	game.gameId = "testGameId"

	column := 2
	method, data := game.prepareMove(column)

	expectedMethod := "move/testGameId"
	if method != expectedMethod {
		t.Errorf("Game.prepareMove did not return proper method. Expected '%s', Got '%s'", expectedMethod, method)
	}

	if len(data) != 1 {
		t.Errorf("Game.prepareMove did not return the right # of items in map.  Expected '1', Got '%d'", len(data))
	}

	expectedMove := strconv.Itoa(column)
	if data["move"] != expectedMove {
		t.Errorf("Game.prepareMove did not return the proper move in map.  Expected '%s', Got '%s'", expectedMove, data["move"])
	}
}

func TestGameInitWorks(t *testing.T) {
	game := NewGame(nickname, aiLevel)
	mockRestClient := &MockRestClient{}
	mockRestClient.resultToSend = "{\"_id\": \"abc123\"}"
	game.restClient = mockRestClient

	game.Init()

	if mockRestClient.funcCalled != "Post" {
		t.Errorf("Game.Init did not properly invoke 'Post' method on restClient")
	}

	expectedMethodParam := "init/" + strconv.Itoa(aiLevel)
	if mockRestClient.methodParam != expectedMethodParam {
		t.Errorf("Game.Init did not send proper rest method to restClient.Post.  Expected '%s', Got '%s'", expectedMethodParam, mockRestClient.methodParam)
	}

	if len(mockRestClient.dataParam) != 1 {
		t.Errorf("Game.Init did not send properly sized data map to restClient.Post.  Expected '1', Got '%d'", len(mockRestClient.dataParam))
	}

	if mockRestClient.dataParam["nickname"] != nickname {
		t.Errorf("Game.Init did not send proper value for nickname in data block.  Expected '%s', Got '%s'", nickname, mockRestClient.dataParam["nickname"])
	}

	if game.gameId != "abc123" {
		t.Errorf("Game.Init did not properly set the gameId.  Expected 'abc123', Got '%s'", game.gameId)
	}
}

func TestGameMoveWorks(t *testing.T) {
	game := NewGame(nickname, aiLevel)
	game.gameId = "abc123"
	mockRestClient := &MockRestClient{}
	mockRestClient.resultToSend = "{\"_id\": \"abc123\"}"
	game.restClient = mockRestClient

	column := 3
	game.Move(column)

	if mockRestClient.funcCalled != "Post" {
		t.Errorf("Game.Move did not properly invoke 'Post' method on restClient")
	}

	expectedMethodParam := "move/" + game.gameId
	if mockRestClient.methodParam != expectedMethodParam {
		t.Errorf("Game.Move did not send proper rest method to restClient.Post.  Expected '%s', Got '%s'", expectedMethodParam, mockRestClient.methodParam)
	}

	if len(mockRestClient.dataParam) != 1 {
		t.Errorf("Game.Move did not send properly sized data map to restClient.Post.  Expected '1', Got '%d'", len(mockRestClient.dataParam))
	}

	expectedMove := strconv.Itoa(column)
	if mockRestClient.dataParam["move"] != expectedMove {
		t.Errorf("Game.Move did not send proper value for 'move' in data map.  Expected '%s', Got '%s'", expectedMove, mockRestClient.dataParam["move"])
	}
}

func TestGameStateWorks(t *testing.T) {
	game := NewGame(nickname, aiLevel)
	game.gameId = "abc123"
	mockRestClient := &MockRestClient{}
	mockRestClient.resultToSend = "{\"_id\": \"abc123\"}"
	game.restClient = mockRestClient

	game.State()

	if mockRestClient.funcCalled != "Get" {
		t.Errorf("Game.State did not properly invoke 'Get' method on restClient")
	}

	expectedMethodParam := "state/" + game.gameId
	if mockRestClient.methodParam != expectedMethodParam {
		t.Errorf("Game.State did not send proper rest method to restClient.Get.  Expected '%s', Got '%s'", expectedMethodParam, mockRestClient.methodParam)
	}
}

func TestGetGameStateFromStringParsesJsonStringCorrectly(t *testing.T) {
	json := `
      {
        "ROWS"        : 6,
        "COLS"        : 7,
        "_id"         : "abc123",
        "humanPlayer" : 1,
        "gameOver"    : 0,
        "nickname"    : "bender",
        "turn"        : 1,
        "moves"       : 8,
        "lastMove"    : 4,
        "moveList"    : [ 4, 2, 4, 2, 6, 1, 4 ],
        "ai"          : 1,
        "board"       : [[0, 0, 1, 2, 1, 0, 0], [0, 0, 2, 1, 2, 0, 0]],
        "message"     : "undefined",
        "error"       : "undefined"
    }`

	result := getGameStateFromString(json)

	method := "getGameStateFromString"
	verifyGameStateInt(t, method, "Rows", 6, result.Rows)
	verifyGameStateInt(t, method, "Cols", 7, result.Cols)
	verifyGameStateString(t, method, "id", "abc123", result.Id)
	verifyGameStateInt(t, method, "humanPlayer", 1, result.HumanPlayer)
	verifyGameStateInt(t, method, "gameOver", 0, result.GameOver)
	verifyGameStateString(t, method, "nickname", "bender", result.Nickname)
	verifyGameStateInt(t, method, "turn", 1, result.Turn)
	verifyGameStateInt(t, method, "moves", 8, result.Moves)
	verifyGameStateInt(t, method, "lastMove", 4, result.LastMove)
	verifyGameStateIntegerArray(t, method, "moveList",
		[]int{4, 2, 4, 2, 6, 1, 4}, result.MoveList)
	verifyGameStateInt(t, method, "ai", 1, result.Ai)
	verifyGameStateIntegerMatrix(t, method, "board",
		[][]int{{0, 0, 1, 2, 1, 0, 0}, {0, 0, 2, 1, 2, 0, 0}}, result.Board)
	verifyGameStateString(t, method, "message", "undefined", result.Message)
	verifyGameStateString(t, method, "error", "undefined", result.Error)
}

func verifyGameStateIntegerMatrix(t *testing.T, method string, field string, expected [][]int, actual [][]int) {
	if len(expected) != len(actual) {
		t.Errorf("%s did not properly decode %s.  Expected %d sub-arrays, but "+
			"found %d sub-arrays", method, field, len(expected), len(actual))
	}

	for i := range expected {
		subarrayName := field + " sub-array #" + strconv.Itoa(i)
		verifyGameStateIntegerArray(t, method, subarrayName, expected[i], actual[i])
	}
}

func verifyGameStateIntegerArray(t *testing.T, method string, field string, expected []int, actual []int) {
	if len(expected) != len(actual) {
		t.Errorf("%s did not properly decode %s.  Expected length of %d, but "+
			"got length of %d", method, field, len(expected), len(actual))
	}

	for i := range expected {
		if expected[i] != actual[i] {
			t.Errorf("%s did not properly decode %s.  Expected %s, but got %s",
				method, field, getStringOfIntegerArray(expected),
				getStringOfIntegerArray(actual))
		}
	}
}

func getStringOfIntegerArray(array []int) string {
	var buffer bytes.Buffer
	sep := ""

	buffer.WriteString("[")
	for i := range array {
		buffer.WriteString(sep + strconv.Itoa(array[i]))
		sep = " "
	}
	buffer.WriteString("]")

	return buffer.String()
}

func verifyGameStateInt(t *testing.T, method string, fieldName string, expected int, actual int) {
	if expected != actual {
		t.Errorf("%s did not properly decode %s.  Expected '%d', Got '%d'", method, fieldName, expected, actual)
	}
}

func verifyGameStateString(t *testing.T, method string, fieldName string, expected string, actual string) {
	if expected != actual {
		t.Errorf("%s did not properly decode %s.  Expected '%s', Got '%s'", method, fieldName, expected, actual)
	}
}

type MockRestClient struct {
	funcCalled   string
	methodParam  string
	dataParam    map[string]string
	resultToSend string
}

func (mock *MockRestClient) Post(method string, data map[string]string) string {
	mock.funcCalled = "Post"
	mock.methodParam = method
	mock.dataParam = data
	return mock.resultToSend
}

func (mock *MockRestClient) Get(method string) string {
	mock.funcCalled = "Get"
	mock.methodParam = method
	return mock.resultToSend
}
