public class Player
{
	private final int playerId;
	private final int computerId;

	public Player(int playerId)
	{
		this.playerId = playerId;
		computerId = Math.max(1, (playerId + 1) % 3);
	}

	public int play(Board board)
	{
		return (int) Math.random() * board.getWidth();
	}

	public int getId()
	{
		return playerId;
	}
}
