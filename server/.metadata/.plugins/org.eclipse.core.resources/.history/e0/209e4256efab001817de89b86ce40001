package org.web.game.world;

import java.util.ArrayList;

import org.web.Console;
import org.web.Start;
import org.web.client.Client;
import org.web.client.message.SocketSender;
import org.web.entity.Bomb;
import org.web.entity.Player;

public class World {
	
	public static Map map = new Map("test", 40, 22);
	public static ArrayList<Bomb> bombs = new ArrayList<Bomb>();
	private static int nextplayerid = 0;
	private static int nextbombid = 0;

	public static void loadWorld()
	{
		World.map.initialize();
	}
	
	public static int getnextPlayerId()
	{
		return (nextplayerid++);
	}
	
	public static int getnextBombId()
	{
		return (nextbombid++);
	}
	
	public static void addBomb(Player launcher)
	{
		Case data = launcher.getCurCell();
		if (data == null)
			return ;
		if (data.hasBomb())
			return ;
		Bomb b = new Bomb(getnextBombId(), data.getx() * 32, data.gety() * 32, launcher, 1);
		ArrayList<Client> clients = Start.webServer.getClients();
		for (Client c : clients)
		{
			SocketSender.sendMessage(c, "BA"
					+ b.getId()
					+ "|" + b.getx()
					+ "|" + b.gety()
					+ "|" + b.getrange());
		}
		bombs.add(b);
	}
}
