This is a scaffold for easily writing your four-in-a-row AI in Ruby. It handles all the communication, parsing, logging, etc. so you can focus on just the AI!


###How is this scaffold organized?

    four-in-a-row/clients/ruby
    ├── rakefile.rb
    ├── readme.txt
    ├── src
    │   ├── ai.rb
    │   ├── board.rb
    │   ├── c4-client.rb
    │   ├── c4-log-utils.rb
    │   ├── c4-net-utils.rb
    │   └── c4-start.rb
    ├── start-game
    └── test
        ├── board-test.rb
        ├── c4-clent-test.rb
        └── c4-net-utils-test.rb


The only thing you have to interact with is the ```start-game``` and ```src/ai.rb```.

###How do I run a game?
To start the game, navigate to the root of this scaffold ```four-in-a-row/clients/ruby``` and just run:

    ./start-game

    Usage: start-game [options]
    -l, --level N                    Choose which level of AI to play against.
                                     Default: 1
    -n, --nickname NICNAME           This is your nickname. It will be used for high scores.
                                     Default: 'challenger'
    -s, --server SERVER              This is the server to connect to.
                                     Default: challenge.yodle.com:3000
    -v, --[no-]verbose               Verbose mode. See all debug messages.
                                     Default: false

This will automatically start a new game with the server running your AI.

###Where do I start writing my AI?
Just implement ```makeMove()``` inside of ```src/ai.rb```. It takes, as input, a ```Board``` object and returns a number from 0 to 6 for the column in which to make the next move. ```Board``` contains all the information that the server returned for the state of the game. You can inspect ```src/board.rb``` for more detail.