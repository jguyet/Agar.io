package com.weoohh.agar;


import com.weoohh.agar.Console;
import com.weoohh.agar.game.world.World;
import com.weoohh.agar.server.WebServer;

import ch.qos.logback.classic.Level;

public class Start {

	public static int				port = 9998;
	public static boolean			isRunning = true;
	public static WebServer			webServer;
	
	public static void main(String ...args)
	{
		//Charge la console
		Console.initialize();
		Console.refreshTitle();
		Console.begin();
		
		World.loadWorld();
		
		//Charge le serveur Web
		webServer = new WebServer();
		webServer.initialize();
	}
}
