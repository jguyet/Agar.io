package org.web.entity;

import java.util.ArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.web.Console;
import org.web.Start;
import org.web.client.Client;
import org.web.client.message.SocketSender;
import org.web.enums.BinaryDirection;
import org.web.enums.PlayerDirection;
import org.web.game.world.Case;
import org.web.game.world.World;
import org.web.utils.TimerWaiter;

public class Player implements Runnable{
	
	private int id;
	private double x;
	private double y;
	private int skin;
	private int dir;
	private ScheduledExecutorService	movescheduler	= Executors.newScheduledThreadPool(1);
	private boolean onmove = false;
	private Client client;
	private int olddir = 1;

	public Player(int id, double x, double y, int skin, Client client)
	{
		this.id = id;
		this.x = x;
		this.y = y;
		this.skin = skin;
		this.dir = 0;
		this.client = client;
		movescheduler.scheduleAtFixedRate(this, 1000/60, 1000/60, TimeUnit.MILLISECONDS);
	}
	
	public int getId()
	{
		return (id);
	}
	
	public double getx()
	{
		return (x);
	}
	
	public void setx(double d)
	{
		this.x = d;
	}
	
	public double gety()
	{
		return (y);
	}
	
	public void sety(double y)
	{
		this.y = y;
	}
	
	public int getskin()
	{
		return (skin);
	}
	
	public void setskin(int skin)
	{
		this.skin = skin;
	}
	
	public int getClientDirection()
	{
		if (this.dir == 0)
			return (olddir);
		if ((this.dir & BinaryDirection.up.getId()) != 0)
			return (0);
		if ((this.dir & BinaryDirection.right.getId()) != 0)
			return (1);
		if ((this.dir & BinaryDirection.down.getId()) != 0)
			return (2);
		if ((this.dir & BinaryDirection.left.getId()) != 0)
			return (3);
		return (olddir);
	}
	
	public int getDirection()
	{
		return (this.dir);
	}
	
	public void setDirection(int d)
	{
		this.dir = d;
		if (d != 0)
			olddir = getClientDirection();
	}
	
	public Case getCurCell()
	{
		return (World.map.getCellPos(x + 10, y + 10));
	}
	
	public Case getposibleCell(double x2, double y2)
	{
		if ((y + 12 + y2) < 0)
			return null;
		if ((x + 13.5 + x2) < 0)
			return null;
		return (World.map.getCellPos(x + 10 + x2, y + 10 + y2));
	}
	
	public void setonMove(boolean move)
	{
		this.onmove = move;
	}
	
	public void move()
	{
		if (!this.onmove)
			return ;
		double speed = 1.5;
		if ((this.dir & BinaryDirection.up.getId()) != 0)
		{
			Case c = getposibleCell(0.0, -speed);
			if (c == null || !c.isWalkableCheckBomb(this))
			{
				client.aks.playermessage.keyUp("KU32", client);
				client.aks.playermessage.keyUp("KU87", client);
			}
			else
				y -= speed;
		}
		if ((this.dir & BinaryDirection.down.getId()) != 0)
		{
			Case c = getposibleCell(0.0, speed + 2);
			if (c == null || !c.isWalkableCheckBomb(this))
			{
				client.aks.playermessage.keyUp("KU40", client);
				client.aks.playermessage.keyUp("KU83", client);
			}
			else
				y += speed;
		}
		if ((this.dir & BinaryDirection.left.getId()) != 0)
		{
			Case c = getposibleCell(-speed, 0.0);
			if (c == null || !c.isWalkableCheckBomb(this))
			{
				client.aks.playermessage.keyUp("KU37", client);
				client.aks.playermessage.keyUp("KU65", client);
			}
			else
				x -= speed;
		}
		if ((this.dir & BinaryDirection.right.getId()) != 0)
		{
			Case c = getposibleCell(speed + 12, 0.0);
			if (c == null || !c.isWalkableCheckBomb(this))
			{
				client.aks.playermessage.keyUp("KU39", client);
				client.aks.playermessage.keyUp("KU68", client);
			}
			else
				x += speed;
		}
	}
	
	public void die(Bomb bomb)
	{
		Case c = World.map.getRandomWalkableCellStart();
		this.x = (c.getx() * 32) - 5;
		this.y = (c.gety() * 32) + 10;
		this.olddir = 0;
		
		for (Client ci : Start.webServer.getClients())
		{
			if (ci == null)
				continue ;
			SocketSender.sendMessage(ci, "PM"
					+ client.player.getId()
					+ "|" + client.player.getx()
					+ "|" + client.player.gety()
					+ "|" + client.player.getClientDirection()
					+ "|" + client.player.getskin()
					+ "|" + client.player.getDirection());
		}
	}

	@Override
	public void run() {
		move();
	}
}
