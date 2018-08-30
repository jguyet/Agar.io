package org.web.game.world;

import java.util.ArrayList;

import org.web.Start;
import org.web.client.Client;
import org.web.client.message.SocketSender;
import org.web.entity.Bomb;
import org.web.entity.Player;

public class Case {

	private int			id;
	private boolean		walkable;
	private int			ground;
	private double		x;
	private double		y;
	private Bomb		bomb = null;
	
	public Case(int id, boolean walkable, int ground, double x, double y)
	{
		this.id = id;
		this.walkable = walkable;
		this.ground = ground;
		this.x = x;
		this.y = y;
	}
	
	public int getId()
	{
		return (id);
	}
	
	public boolean isWalkable()
	{
		return (this.walkable);
	}
	
	public boolean isWalkableCheckBomb(Player p)
	{
		if (this.hasBomb()
			&& this.bomb.getLauncher().getId() != p.getId())
			return (false);
		else if (this.hasBomb()
				&& p.getCurCell().getId() != this.id)
			return (false);
		else if (this.hasBomb() && p.getCurCell().getId() == this.getId())
			return (true);
		return (this.walkable);
	}
	
	public void setWalkable(boolean walk)
	{
		this.walkable = walk;
	}
	
	public int getGroundId()
	{
		return (this.ground);
	}
	
	public void setGround(int id)
	{
		this.ground = id;
	}
	
	public void sendCell()
	{
		for (Client c : Start.webServer.getClients())
		{
			SocketSender.sendMessage(c, "WC" + this.ground + "|" + x + "|" + y + "|" + (this.walkable ? "1" : "0"));
		}
	}
	
	public double getx()
	{
		return (x);
	}
	
	public double gety()
	{
		return (y);
	}
	
	public void addBomb(Bomb b)
	{
		this.bomb = b;
	}
	
	public boolean hasBomb()
	{
		return (this.bomb != null);
	}
	
	public Bomb getBomb()
	{
		return (this.bomb);
	}
}
