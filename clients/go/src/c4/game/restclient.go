package game

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

type RestClient struct {
	serverBaseUrl string
}

func NewRestClient(serverBaseUrl string) *RestClient {
	return &RestClient{serverBaseUrl}
}

func (client *RestClient) Get(method string) string {
	target := client.getApiTarget(method)

	resp, err := http.Get(target)
	defer resp.Body.Close()

	return handleHttpResponse(resp, err)
}

func (client *RestClient) Post(method string, data map[string]string) string {
	target := client.getApiTarget(method)
	formData := convertMapToUrlValues(data)

	resp, err := http.PostForm(target, formData)
	defer resp.Body.Close()

	return handleHttpResponse(resp, err)
}

func handleHttpResponse(response *http.Response, err error) string {
	if err != nil {
		fmt.Printf(err.Error())
	}

	return getStringFromReader(response.Body)
}

func convertMapToUrlValues(data map[string]string) url.Values {
	v := url.Values{}
	for key, value := range data {
		v.Add(key, value)
	}
	return v
}

func (client *RestClient) getApiTarget(method string) string {
	baseUrl := client.serverBaseUrl
	for string(baseUrl[len(baseUrl)-1]) == "/" {
		baseUrl = baseUrl[:len(baseUrl)-1]
	}

	for string(method[0]) == "/" {
		method = method[1:]
	}

	return baseUrl + "/" + method
}

func getStringFromReader(reader io.Reader) string {
	buf := new(bytes.Buffer)
	buf.ReadFrom(reader)
	return buf.String()
}
