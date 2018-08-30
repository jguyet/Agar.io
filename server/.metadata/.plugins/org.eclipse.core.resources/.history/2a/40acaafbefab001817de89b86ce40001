package org.web.client.receivedmessage;

import java.util.ArrayList;

import org.web.Start;
import org.web.client.Client;
import org.web.client.message.SocketSender;

public class ChatMessage {

	public void receivedMessage(String message, Client client)
	{
		String msg = message.substring(2);
		
		if (msg == null)
			return ;
		if (msg.isEmpty())
			return ;
		ArrayList<Client> clients = Start.webServer.getClients();
		
		for (Client c : clients)
		{
			SocketSender.sendMessage(c, "MN" + msg);
		}
	}
}
