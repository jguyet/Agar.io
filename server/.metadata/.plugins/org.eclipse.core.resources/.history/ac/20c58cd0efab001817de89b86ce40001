package org.web.entity;

import java.util.ArrayList;

import org.web.Console;
import org.web.Start;
import org.web.client.Client;
import org.web.client.message.SocketSender;
import org.web.enums.BinaryDirection;
import org.web.game.world.Case;
import org.web.game.world.World;
import org.web.utils.TimerWaiter;

public class Bomb implements Runnable{
	
	private int id;
	private double x;
	private double y;
	private Player launcher;
	private Case curcell;
	private int skin;
	private TimerWaiter timer = new TimerWaiter();
	private int range = 4;
	private boolean haveExplode = false;

	public Bomb(int id, double x, double y, Player launcher, int skin)
	{
		this.id = id;
		this.x = x;
		this.y = y;
		this.launcher = launcher;
		this.curcell = launcher.getCurCell();
		this.skin = skin;
		this.curcell.addBomb(this);
		timer.addNext(this, 3000);
	}
	
	public int getId()
	{
		return (id);
	}
	
	public double getx()
	{
		return (x);
	}
	
	public double gety()
	{
		return (y);
	}
	
	public Player getLauncher()
	{
		return (launcher);
	}
	
	public Case getCurCell()
	{
		return (curcell);
	}
	
	public int getskin()
	{
		return (skin);
	}
	
	public int getrange()
	{
		return (this.range);
	}
	
	public int explodeline(ArrayList<Case> cells)
	{
		int count = 0;
		for (Case cell : cells)
		{
			boolean pdie = false;
			for (Client c : Start.webServer.getClients())
			{
				if (c.player.getCurCell().getId() == cell.getId())
				{
					c.player.die(this);
					pdie = true;
					break ;
				}
			}
			if (pdie)
				break ;
			if (cell.hasBomb())
			{
				cell.getBomb().explode();
				count++;
				break ;
			}
			else if (!cell.isWalkable() && cell.getGroundId() == 104)
			{
				cell.setWalkable(true);
				cell.setGround(0);
				cell.sendCell();
				count++;
				break ;
			}
			else if (!cell.isWalkable() && cell.getGroundId() == 80)
			{
				cell.setGround(81);
				cell.sendCell();
				break ;
			}
			else if (!cell.isWalkable())
				break ;
			count++;
		}
		return (count);
	}
	
	public void explode()
	{
		if (haveExplode)
			return ;
		haveExplode = true;
		ArrayList<Case> cellsup = World.map.getdircell(curcell, BinaryDirection.up.getId(), range);
		ArrayList<Case> cellsdown = World.map.getdircell(curcell, BinaryDirection.down.getId(), range);
		ArrayList<Case> cellsleft = World.map.getdircell(curcell, BinaryDirection.left.getId(), range);
		ArrayList<Case> cellsright = World.map.getdircell(curcell, BinaryDirection.right.getId(), range);
		
		int sup = this.explodeline(cellsup);
		int down = this.explodeline(cellsdown);
		int left = this.explodeline(cellsleft);
		int right = this.explodeline(cellsright);
		for (Client c : Start.webServer.getClients())
		{
			if (c == null)
				continue ;
			SocketSender.sendMessage(c, "BE" + this.id + "|" + sup + "|" + down + "|" + left + "|" + right);
		}
		this.curcell.addBomb(null);
		World.bombs.remove(this);
	}

	@Override
	public void run() {
		explode();
	}
}
