###What's this now?
This is a skeleton implementation of an AI for the Yodle Four-in-a-Row Challenge written in Go (http://golang.org).  The idea is that if you want to write your AI in Go you can start with this.  All of the interactions with the API are taken care of for you so you can concentrate on writing your AI.

###Awesome!  How do I use it?
#####Make sure you have Go Version 1
Well, this is written in Go 1, so you should make sure you have Go 1 installed.  Running `go version` should output something like `go version go1.0.2`.  Instructions for installing Go 1 on Ubuntu and Ubuntu-derivates are here: https://wiki.ubuntu.com/Go .

#####Set your GOPATH properly
After getting Go installed just go to this directory and run the following to set your GOPATH properly:

```
`./set_gopath.sh`
```

Notice that there are backticks included there.  The set_gopath.sh script will just output something like 'export GOPATH=blahblah' and the backticks are included to make sure that gets executed in your current shell.  The moral of the story is that the 'go' directory of this project should be mentioned in your GOPATH.

#####Run the unit tests
Running ./check.sh will run `go fmt` on all of the Go code and then run the unit tests for skeleton code.  If that works you're most likely good-to-go.

###Write your AI
You can start with the `ai.go` file to write your own AI.  Running `go build c4/ai` will then compile your ai and leave you with a binary called `ai` in the current directory.

###Questions?
If you have any questions send them over to me at mdrago@yodle.com.  Enjoy!
