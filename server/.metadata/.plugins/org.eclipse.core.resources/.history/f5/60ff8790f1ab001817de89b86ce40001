package org.web.enums;

public enum BinaryDirection {

	up (4),
	right (8),
	down (16),
	left (32),
	all (up.getId() + right.getId() + down.getId() + left.getId());
	
	private int direction = 0;
	
	public int getId()
	{
		return (direction);
	}
	
	public static BinaryDirection getDirectionById(int id)
	{
		for (BinaryDirection e : BinaryDirection.values())
		{
			if (e.direction == id)
				return (e);
		}
		return (null);
	}
	
	private BinaryDirection(int enums)
	{
		this.direction = enums;
	}
}
