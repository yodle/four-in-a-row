package game

import (
	"bytes"
	"fmt"
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

func getStringFromHttpResponse(resp *http.Response) string {
	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	return buf.String()
}

func executePost(target string, formData url.Values) string {
	resp, err := http.PostForm(target, formData)
	defer resp.Body.Close()

	if err != nil {
		fmt.Printf(err.Error())
	}

	return getStringFromHttpResponse(resp)
}

func (client *RestClient) Post(method string, data map[string]string) string {
	target := client.getApiTarget(method)
	formData := convertMapToUrlValues(data)
	return executePost(target, formData)
}

func executeGet(target string) string {
	resp, err := http.Get(target)
	defer resp.Body.Close()

	if err != nil {
		fmt.Printf(err.Error())
	}

	return getStringFromHttpResponse(resp)
}

func (client *RestClient) Get(method string) string {
	target := client.getApiTarget(method)
	return executeGet(target)
}
