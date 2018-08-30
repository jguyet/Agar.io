package org.web.game.world;

import java.util.ArrayList;

import org.web.Console;
import org.web.Start;
import org.web.client.Client;
import org.web.client.message.SocketSender;
import org.web.enums.BinaryDirection;
import org.web.enums.PlayerDirection;
import org.web.utils.Formulas;

public class Map {

	private int width;
	private int height;
	private String type;
	private static final int SIZE_CASE = 32;
	private ArrayList<Case> cases = new ArrayList<Case>();
	
	public Map(String type, int width, int height)
	{
		this.type = type;
		this.width = width;
		this.height = height;
	}
	
	public int getwidth()
	{
		return (this.width);
	}
	
	public int getheight()
	{
		return (this.height);
	}
	
	public String getData()
	{
		String data = "";
		
		for (Case c : cases)
		{
			data += (data.isEmpty() ? "" : ";") + c.getId() + "," + c.getGroundId();
		}
		return (data);
	}
	
	public void initialize()//|
	{
		int y = 0;
		int x = 0;
		double cy = 0;
		int i = 0;
		double cx = 0;
		while (y < height)
		{
			cx = 0;
			x = 0;
			while (x < width)
			{
				int g = 0;
				boolean walk = true;
				
				if (Formulas.getRandomValue(1, 2) == 1)
				{
					g = 104;
					walk = false;
				}
				else if (Formulas.getRandomValue(1, 4) == 1)
				{
					g = 80;
					walk = false;
				}
				Case c = new Case(i, walk, g, cx, cy);
				cases.add(c);
				x++;
				i++;
				cx++;
			}
			cy++;
			y++;
		}
	}
	
	public Case getCellPos(double x, double y)
	{
		double[] pos = {Math.round((Math.round(x) / 32) % this.width), Math.round((Math.round(y) / 32) % this.height)};
		for (Case c : cases)
		{
			if (c.getx() == pos[0] && c.gety() == pos[1])
				return (c);
		}
		return (null);
	}
	
	public Case getCell(double x, double y)
	{
		for (Case c : cases)
		{
			if (c.getx() == x && c.gety() == y)
				return (c);
		}
		return (null);
	}
	
	public Case getRandomWalkableCell()
	{
		ArrayList<Case> lst = new ArrayList<Case>();
		for (Case c : cases)
		{
			if (c.isWalkable())
				lst.add(c);
		}
		if (lst.size() == 0)
			return (null);
		return (lst.get(Formulas.getRandomValue(0, lst.size() - 1)));
	}
	
	public int getnbrWalkable(ArrayList<Case> c)
	{
		int nbr = 0;
		for (Case cell : c)
		{
			if (cell.isWalkable())
				nbr++;
			else
				break ;
		}
		return (nbr);
	}
	
	public boolean have3placesCell(Case c)
	{
		if (!c.isWalkable())
			return (false);
		ArrayList<Case> cells = getdircell(c, BinaryDirection.right.getId(), 3);
		int nbr = getnbrWalkable(cells);
		cells = getdircell(c, BinaryDirection.left.getId(), 3);
		nbr += getnbrWalkable(cells);
		cells = getdircell(c, BinaryDirection.down.getId(), 3);
		nbr += getnbrWalkable(cells);
		cells = getdircell(c, BinaryDirection.up.getId(), 3);
		nbr += getnbrWalkable(cells);
		
		if (nbr > 3)
			return (true);
		return (false);
	}
	
	public Case getRandomWalkableCellStart()
	{
		ArrayList<Case> lst = new ArrayList<Case>();
		for (Case c : cases)
		{
			if (have3placesCell(c))
				lst.add(c);
		}
		if (lst.size() == 0)
			return (null);
		return (lst.get(Formulas.getRandomValue(0, lst.size() - 1)));
	}
	
	public ArrayList<Case> getdircell(Case cell, int dir, int range)
	{
		ArrayList<Case> lst = new ArrayList<Case>();
		
		if ((dir & 4) != 0)//up
		{
			for (double i = 1.0; i < range; i++)
			{
				Case c = getCell(cell.getx(), cell.gety() - i);
				if (c != null)
					lst.add(c);
			}
		}
		if ((dir & 8) != 0)//right
		{
			for (double i = 1.0; i < range; i++)
			{
				Case c = getCell(cell.getx() + i, cell.gety());
				if (c != null)
					lst.add(c);
			}
		}
		if ((dir & 16) != 0)//down
		{
			for (double i = 1.0; i < range; i++)
			{
				Case c = getCell(cell.getx(), cell.gety() + i);
				if (c != null)
					lst.add(c);
			}
		}
		if ((dir & 32) != 0)//left
		{
			for (double i = 1.0; i < range; i++)
			{
				Case c = getCell(cell.getx() - i, cell.gety());
				if (c != null)
					lst.add(c);
			}
		}
		return (lst);
	}
}
