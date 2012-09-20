package game

import (
	"io"
	"net/http"
	"strings"
	"testing"
)

func TestConvertMapToUrlValuesWorksInNormalCase(t *testing.T) {
	data := map[string]string{"hello": "world"}
	results := convertMapToUrlValues(data)
	resultValue := results.Get("hello")
	if resultValue != "world" {
		t.Errorf("convertMapToUrlValues did not correctly store key/value.  Expected hello->'world', Got hello->'%s'", resultValue)
	}
}

func TestConvertMapToUrlValuesHandleEmptyMap(t *testing.T) {
	data := map[string]string{}
	results := convertMapToUrlValues(data)
	if results == nil {
		t.Errorf("convertMapToUrlValues returned nil instead of the expected empty map")
	} else if len(results) != 0 {
		t.Errorf("convertMapToUrlValues somehow added an item its map when we gave it an empty map to convert")
	}
}

func TestGetApiTargetConcatenatesBaseUrlAndMethod(t *testing.T) {
	baseurl := "http://www.mybaseurl.com/"
	method := "makeMeASandwich"

	client := NewRestClient(baseurl)
	target := client.getApiTarget(method)

	expected := "http://www.mybaseurl.com/makeMeASandwich"
	if target != expected {
		t.Errorf("getApiTarget did not properly create target url.  Expected '%s', Got '%s'", expected, target)
	}
}

func TestGetApiTargetAddsASlashBetweenBaseUrlAndMethodEvenIfItDidNotExist(t *testing.T) {
	baseurl := "http://www.blahblah.com"
	method := "yumyum"

	client := NewRestClient(baseurl)
	target := client.getApiTarget(method)

	expected := "http://www.blahblah.com/yumyum"
	if target != expected {
		t.Errorf("getApiTarget did not properly add a slash between base url & method.  Expected '%s', Got '%s'", expected, target)
	}
}

func TestGetApiTargetLeavesOneSlashBetweenBaseUrlAndMethodEvenIfTwoWereGiven(t *testing.T) {
	baseurl := "http://www.blahblah.com/"
	method := "/yumyum"

	client := NewRestClient(baseurl)
	target := client.getApiTarget(method)

	expected := "http://www.blahblah.com/yumyum"
	if target != expected {
		t.Errorf("getApiTarget left 2 slashes between base url & method.  Expected '%s', Got '%s'", expected, target)
	}
}

func TestGetStringFromReaderWorks(t *testing.T) {
	str := "The brown fox ate the lazy dog"
	reader := strings.NewReader(str)
	result := getStringFromReader(reader)
	if result != str {
		t.Errorf("getStringFromReader did not get the correct string.  Expected '%s', Got '%s'", str, result)
	}
}

func TestHandleHttpResponseReturnsHttpBody(t *testing.T) {
	resp := new(http.Response)
	var err error

	str := "The brown fox ate the lazy dog"
	resp.Body = NewMockResponseBody(str)

	result := handleHttpResponse(resp, err)

	if result != str {
		t.Errorf("handleHttpResponse did not return proper string from Body.  Expected '%s', Got '%s'", str, result)
	}
}

type MockResponseBody struct {
	reader io.Reader
}

func NewMockResponseBody(str string) *MockResponseBody {
	reader := strings.NewReader(str)
	return &MockResponseBody{reader}
}

func (mock *MockResponseBody) Read(p []byte) (n int, err error) {
	return mock.reader.Read(p)
}

func (mock *MockResponseBody) Close() error {
	return nil
}
