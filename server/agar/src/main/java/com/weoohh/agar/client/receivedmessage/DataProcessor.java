package com.weoohh.agar.client.receivedmessage;

import org.json.JSONObject;

import com.weoohh.agar.Console;
import com.weoohh.agar.Console.Color;
import com.weoohh.agar.client.Client;

public class DataProcessor {

	public void postProcess(JSONObject message, Client client)
	{
		Console.println("[NEW MESSAGE] message [" + message.toString() + "]", Color.EXCHANGE);
		
		switch (message.getInt("messageId")) {
			case 0://ready
				client.connect(message);
			break ;
			case 2://update
				client.update(message);
			break ;
			case 3://eat
				int id = message.getInt("id");
				
				if (Client.players.containsKey(id)) {
					Client c = Client.players.get(id);
					
					c.eated();
				}
			break;
		}
		
	}
}
