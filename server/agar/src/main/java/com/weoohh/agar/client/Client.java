package com.weoohh.agar.client;

import java.net.Socket;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;

import com.weoohh.agar.Console;
import com.weoohh.agar.Console.Color;
import com.weoohh.agar.Start;
import com.weoohh.agar.client.message.SocketSender;
import com.weoohh.agar.entity.Player;
import com.weoohh.agar.game.world.World;
import com.weoohh.agar.utils.Formulas;
import com.weoohh.agar.utils.Utils;

public class Client{
	
	public Socket								session;
	public Aks									aks;
	public Player								player;
	public int									id;
	
	public String								pseudo;
	public int									screenWidth;
	public int									screenHeight;
	
	public boolean								alive;
	
	public static Map<Integer, Client>			players = new HashMap<Integer, Client>();

	public Client(Socket session)
	{
		System.out.println("NEW CLIENT");
		this.session = session;
		this.player = new Player(World.getnextPlayerId(), Formulas.getRandomValue(0, 6000), Formulas.getRandomValue(0, 6000), 40, Utils.getRandomHexColor(), this);
		this.id = this.player.getId();
		Client.players.put(this.id, this);
		this.aks = new Aks(this);
		this.alive = false;
	}
	
	public void connect(JSONObject json) {
		
		screenWidth = json.getInt("width");
		screenHeight = json.getInt("height");
		pseudo = json.getString("pseudo");
		
		JSONObject message = new JSONObject();//set user informations
		
		message
			.put("messageId", 998)
			.put("id", player.getId())
			.put("x", this.player.getx() - (this.screenWidth / 2))
			.put("y", this.player.gety() - (this.screenHeight / 2))
			.put("width", 6000)
			.put("height", 6000);
		
		SocketSender.sendMessage(this, message.toString());
		
		message = new JSONObject();//add currentPlayer
		
		message
			.put("messageId", 1000)
			.put("id", player.getId())
			.put("x", this.player.getx())
			.put("y", this.player.gety())
			.put("r", this.player.getSize())
			.put("color", this.player.getColor())
			.put("pseudo", this.pseudo);
		SocketSender.sendMessage(this, message.toString());
		
		
		message = new JSONObject();//add Entity
		
		message
			.put("messageId", 1001)
			.put("id", player.getId())
			.put("x", this.player.getx())
			.put("y", this.player.gety())
			.put("r", this.player.getSize())
			.put("color", this.player.getColor())
			.put("pseudo", this.pseudo);
		SocketSender.sendMessageToAll(message.toString());
		this.alive = true;
	}
	
	public void update(JSONObject json) {
		if (!this.alive) {
			return ;
		}
		this.player.setx(json.getDouble("x"));
		this.player.sety(json.getDouble("y"));
		this.player.setSize(json.getDouble("r"));
		
		JSONObject message = new JSONObject();//set user informations
		
		message
			.put("messageId", 1002)
			.put("id", player.getId())
			.put("x", this.player.getx())
			.put("y", this.player.gety())
			.put("r", this.player.getSize())
			.put("color", this.player.getColor())
			.put("pseudo", this.pseudo);
		SocketSender.sendMessageToAll(message.toString());
	}
	
	public void eated() {
		Client.players.remove(this.id);
		JSONObject message = new JSONObject();
		
		message
			.put("messageId", 1003)
			.put("id", player.getId());
		
		SocketSender.sendMessageToAll(message.toString());
		this.alive = false;
	}
	
	
	public void kick()
	{
		try
		{
			if (Client.players.containsKey(this.id)) {
				Client.players.remove(this.id);
				// send to all remove message -->
		    	JSONObject message = new JSONObject();
				
				message
					.put("messageId", 1003)
					.put("id", player.getId());
				
				SocketSender.sendMessageToAll(message.toString());
				//<-- end
			}
			
			Start.webServer.removeClient(this);
			if(!session.isClosed())
			{
	    		session.close();
			}
	    	this.aks.closeDescriptors();
	    	
	    	Console.println("Client disconnected ", Color.BLACK);
		}
		catch (Exception e1)
		{
			e1.printStackTrace();
		}
	}
}
