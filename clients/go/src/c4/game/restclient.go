package game

import (
	"bytes"
	"net/http"
	"net/url"
)

type RestClient struct {
	serverBaseUrl string
}

func NewRestClient(serverBaseUrl string) *RestClient {
	return &RestClient{serverBaseUrl}
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

func executeCall(target string, formData url.Values) string {
	resp, _ := http.PostForm(target, formData)
	defer resp.Body.Close()
	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	return buf.String()
}

func (client *RestClient) Call(method string, data map[string]string) string {
	target := client.getApiTarget(method)
	formData := convertMapToUrlValues(data)
	return executeCall(target, formData)
}
