package game

import (
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
