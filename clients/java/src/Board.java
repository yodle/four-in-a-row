
public class Board {

	int[][] boardPositionArray;

	public Board(int[][] boardPosition) {
		this.boardPositionArray = boardPosition;
	};

	public int getPlayerAtPosition(int row, int col) {
		try
		{
		return boardPositionArray[row][col];
		}
		catch (ArrayIndexOutOfBoundsException e)
		{
			int i = 0;
		}
		return -1;
	}

	public int getHeight() {
		return boardPositionArray.length;
	}

	public int getWidth() {
		return boardPositionArray[0].length;
	}

	@Override
	public String toString() {
		String ret = "";

		for (int i = 0; i < boardPositionArray.length; i++) {
			ret += " [ ";
			for(int j = 0; j < boardPositionArray[i].length; j++) {
				if (boardPositionArray[i][j] == 0)
				{
					ret += "  ";
				}
				else
				{
					ret += boardPositionArray[i][j] + " ";
				}
			}
			ret += "]\n";
		}

		return ret;
	}

}
