package org.web.client.receivedmessage;

import org.web.Console;
import org.web.Console.Color;
import org.web.client.Client;

public class DataProcessor {

	public void postProcess(char type, char action, String message, Client client)
	{
		Console.println("[NEW MESSAGE] type[" + type + "] action [" + action + "] message [" + message + "]", Color.EXCHANGE);
		switch (type)
		{
			case 'K':
			{
				switch (action)
				{
					case 'D':
						client.aks.playermessage.keyDown(message, client);
						break ;
					case 'U':
						client.aks.playermessage.keyUp(message, client);
						break ;
				}
				break ;
			}
			case 'M':
			{
				switch (action)
				{
					case 'N':
						client.aks.chatmessage.receivedMessage(message, client);
						break ;
				}
				break ;
			}
			case 'P':
			{
				switch (action)
				{
					case 'A':
						client.aks.playermessage.addPlayer(message, client);
						break ;
					case 'M':
						//client.aks.playermessage.movePlayer(message, client);
						break ;
				}
				break ;
			}
			case 'W':
			{
				switch (action)
				{
					case 'L':
						client.aks.worldmessage.loadWorld(message, client);
						break ;
				}
				break ;
			}
		}
	}
}
