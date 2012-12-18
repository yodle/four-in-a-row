import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.PostMethod;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class C4JavaHarness
{

	//---------- GAME OPTIONS ----------
	static final int AI_LEVEL = 1;
	static final String NICKNAME = "NAME";

	static final String BASE_URL = "http://challenge.yodle.com:3000/game/";
	static final String INIT = "init/";
	static final String MOVE = "move/";

	private HttpClient client;
	private String gameId;
	private Board board;
	private Player player;
	private int moves;

	public C4JavaHarness()
	{
		client = new HttpClient();
		moves = 0;
	}

	public void playGame() throws IOException, ParseException
	{
		if( ! initializeGame())
		{
			while(!sendMoveAndUpdateState(player.play(board)))
				;
		}
	}
	private boolean initializeGame() throws IOException, ParseException
	{
		PostMethod post = new PostMethod(BASE_URL + INIT + AI_LEVEL);
		post.addParameter("nickname", NICKNAME);

		client.executeMethod(post);
		JSONObject json = (JSONObject) new JSONParser().parse(convertStreamToString(post.getResponseBodyAsStream()));

		gameId = (String) json.get("_id");
		player = new Player(((Long) json.get("humanPlayer")).intValue());

		return updateGameState(json);
	}

	private boolean sendMoveAndUpdateState(int move) throws IOException, ParseException
	{
		PostMethod post = new PostMethod(BASE_URL + MOVE + gameId);
		post.setParameter("move", Integer.toString(move));
		client.executeMethod(post);

		JSONObject json = (JSONObject) new JSONParser().parse(convertStreamToString(post.getResponseBodyAsStream()));
		return updateGameState(json);
	}

	private boolean updateGameState(JSONObject json)
	{
		board = getBoard((JSONArray) json.get("board"), ((Long) json.get("ROWS")).intValue(), ((Long) json.get("COLS")).intValue());

		try
		{
			return (Boolean) json.get("gameOver");
		}
		catch (ClassCastException e)
		{
			System.out.println("Player " + (Long) json.get("gameOver") + " won the game in " + moves + " moves.");
			return true;
		}
	}

	private Board getBoard(JSONArray board, int rows, int cols)
	{
		int[][] boardState = new int[rows][cols];

		Object[] columns = board.toArray();
		for (int i = 0; i < columns.length; i++) {
			Object[] vals = ((JSONArray) columns[i]).toArray();
			for (int j = 0; j < vals.length; j++) {
				boardState[j][i] = ((Long) vals[j]).intValue();
			}
		}

		return new Board(boardState);
	}

	public static void main(String[] args) throws IOException, ParseException
	{
		C4JavaHarness harness = new C4JavaHarness();
		harness.playGame();
	}

	private static String convertStreamToString(InputStream is)
	{
		try
		{
			return new java.util.Scanner(is).useDelimiter("\\A").next();
		}
		catch (java.util.NoSuchElementException e)
		{
			return "";
		}
	}
}
