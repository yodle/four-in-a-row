#Python Client
This is a "Four-in-a-row" client written in python. The purpose of these clients is two fold: to communicate with the Yodle AI server (which is already implemented) and to have a brilliant AI to compete against Yodle AIs (to be implemented by you!). This is a python client so you can conveniently write your AI in python!
##Install Python
Head on over to [http://python.org/download/](http://python.org/download/) and download Python 2.7.3 for your OS 
##Launch client
Launching the client will automatically start a new game against a Yodle AI level of your choice: 1 being the easiest to 6 being the hardest. Just sit back and see the heated battle between your AI and the Yodle AI!

```
python driver.py -a challenge.yodle.com -p 3000 -n "Your Name" -l 1
```

The above will connect to the Yodle AI server at challenge.yodle.com:3000 to compete against the level 1 Yodle AI. For additional help:

```
python driver.py -h
```

##AI programming
You should be coding your AI in the `move` function in `skeleton.py`. The `move` function receives a state object that represents the current board and other useful data. See `state.py` to see what data you can leverage when writing your AI. Feel free to add more if you see anything missing! Once your AI has determined the next move (a column index where 0 is the first column), the `move` function should return this index.

###Default AI
The default AI in ```skeleton.py``` picks a random column index for the next move.

```python
def move(state):
    return random.randint(0, state.getNumCols())
```

