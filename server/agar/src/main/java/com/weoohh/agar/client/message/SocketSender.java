package com.weoohh.agar.client.message;

import java.util.ArrayList;

import com.weoohh.agar.Console;
import com.weoohh.agar.Start;
import com.weoohh.agar.Console.Color;
import com.weoohh.agar.client.Client;

public class SocketSender {
	
	public static void sendMessage(Client client, String message)
	{
		if (client == null)
			return ;
		if (message == null)
			return ;
		if (client.aks.getoutStream() == null)
			return ;
		Console.println("[SEND Message] " + message, Color.BLUE);
		try
		{
			byte[] response = client.aks.getcodec()
					.encode(message.getBytes("UTF-8"), 0, true);
			client.aks.getoutStream()
				.write(response, 0, response.length);
			client.aks.getoutStream().flush();
		} catch (Exception e)
		{
			e.printStackTrace();
		}
	}
	
	public static void sendMessageToAll(String message) {
		ArrayList<Client> clients = Start.webServer.getClients();
		
		for (Client c : clients) {
			sendMessage(c, message);
		}
	}
}
