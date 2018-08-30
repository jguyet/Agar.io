package com.weoohh.agar.entity;

import com.weoohh.agar.client.Client;

public class Player {
	
	private int id;
	private double x;
	private double y;
	private double size;
	private Client client;

	public Player(int id, double x, double y, double size, Client client)
	{
		this.id = id;
		this.x = x;
		this.y = y;
		this.size = size;
		this.client = client;
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
	
	public Client getClient() {
		return client;
	}

	public double getSize() {
		return size;
	}

	public void setSize(double size) {
		this.size = size;
	}
	
}
