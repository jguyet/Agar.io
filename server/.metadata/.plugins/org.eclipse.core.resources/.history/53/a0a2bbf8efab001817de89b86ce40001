package org.web.client.receivedmessage;

import java.util.ArrayList;

import org.web.Start;
import org.web.client.Client;
import org.web.client.message.SocketSender;
import org.web.game.world.World;

public class WorldMessage {

	public void loadWorld(String message, Client client)
	{
		SocketSender.sendMessage(client, 
				"WL" +  World.map.getwidth()
				+ "|" + World.map.getheight()
				+ "|" + World.map.getData());
		SocketSender.sendMessage(client, "PA"
				+ client.player.getId()
				+ "|" + client.player.getx()
				+ "|" + client.player.gety()
				+ "|" + client.player.getClientDirection()
				+ "|" + client.player.getskin()
				+ "|1");
		ArrayList<Client> clients = Start.webServer.getClients();
		for (Client c : clients)
		{
			if (c == client)
				continue ;
			SocketSender.sendMessage(c, "PA"
					+ client.player.getId()
					+ "|" + client.player.getx()
					+ "|" + client.player.gety()
					+ "|" + client.player.getClientDirection()
					+ "|" + client.player.getskin()
					+ "|0");
		}
	}
}
