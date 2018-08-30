package org.web.client.receivedmessage;

import java.util.ArrayList;

import org.web.Console;
import org.web.Start;
import org.web.client.Client;
import org.web.client.message.SocketSender;
import org.web.enums.BinaryDirection;
import org.web.enums.PlayerDirection;
import org.web.game.world.Case;
import org.web.game.world.World;

public class PlayerMessage {

	public void addPlayer(String message, Client client)
	{
		ArrayList<Client> clients = Start.webServer.getClients();
		
		for (Client c : clients)
		{
			if (c == null)
				continue ;
			if (c == client)
				continue ;
			SocketSender.sendMessage(c, message);
		}
	}
	
	public void keyDown(String message, Client client)
	{
		ArrayList<Client> clients = Start.webServer.getClients();
		
		int key = Integer.parseInt(message.substring(2));
		BinaryDirection d = null;
		double speed = 1.5;
		
		if (key == 32)
		{
			World.addBomb(client.player);
			return ;
		}
		if (key == 38 || key == 87)
		{
			d = BinaryDirection.up;
			Case c = client.player.getposibleCell(0.0, -speed);
			if (c != null && !c.isWalkableCheckBomb(client.player))
				d = null;
		}
		if (key == 40 || key == 83)
		{
			d = BinaryDirection.down;
			Case c = client.player.getposibleCell(0.0, speed + 2);
			if (c != null && !c.isWalkableCheckBomb(client.player))
				d = null;
		}
		if (key == 37 || key == 65)
		{
			d = BinaryDirection.left;
			Case c = client.player.getposibleCell(-speed, 0.0);
			if (c != null && !c.isWalkableCheckBomb(client.player))
				d = null;
		}
		if (key == 39 || key == 68)
		{
			d = BinaryDirection.right;
			Case c = client.player.getposibleCell(speed + 12, 0.0);
			if (c != null && !c.isWalkableCheckBomb(client.player))
				d = null;
		}
		if (d == null)
			return ;
		if ((d.getId() & client.player.getDirection()) != 0)
			return ;
		client.player.setDirection(client.player.getDirection() + d.getId());
		client.player.setonMove(true);
		for (Client c : clients)
		{
			if (c == null)
				continue ;
			SocketSender.sendMessage(c, "PM"
					+ client.player.getId()
					+ "|" + client.player.getx()
					+ "|" + client.player.gety()
					+ "|" + client.player.getClientDirection()
					+ "|" + client.player.getskin()
					+ "|" + client.player.getDirection());
		}
	}
	
	public void keyUp(String message, Client client)
	{
		ArrayList<Client> clients = Start.webServer.getClients();
		
		int key = Integer.parseInt(message.substring(2));
		
		BinaryDirection d = null;
		
		if (key == 38 || key == 87)
		{
			d = BinaryDirection.up;
		}
		if (key == 40 || key == 83)
		{
			d = BinaryDirection.down;
		}
		if (key == 37 || key == 65)
		{
			d = BinaryDirection.left;
		}
		if (key == 39 || key == 68)
		{
			d = BinaryDirection.right;
		}
		if (d == null)
			return ;
		if ((d.getId() & client.player.getDirection()) != 0)
			client.player.setDirection(client.player.getDirection() - d.getId());
		if (client.player.getDirection() < 0)
			client.player.setDirection(0);
		if (client.player.getDirection() == 0)
			client.player.setonMove(false);
		for (Client c : clients)
		{
			if (c == null)
				continue ;
			SocketSender.sendMessage(c, "PS"
					+ client.player.getId()
					+ "|" + client.player.getx()
					+ "|" + client.player.gety()
					+ "|" + client.player.getClientDirection()
					+ "|" + client.player.getskin()
					+ "|" + client.player.getDirection());
		}
	}
}
