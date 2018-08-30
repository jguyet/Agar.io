package com.weoohh.agar.game.world;

public class World {
	
	private static int nextplayerid = 0;

	public static Ladder ladder = new Ladder();
	
	public static void loadWorld()
	{
		
	}
	
	public static int getnextPlayerId()
	{
		return (nextplayerid++);
	}

}
