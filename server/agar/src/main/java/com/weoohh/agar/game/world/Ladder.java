package com.weoohh.agar.game.world;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.json.JSONArray;
import org.json.JSONObject;

import com.weoohh.agar.client.Client;
import com.weoohh.agar.client.message.SocketSender;
import com.weoohh.agar.entity.Player;

public class Ladder implements Runnable {
	
	private ScheduledExecutorService	movescheduler	= Executors.newScheduledThreadPool(1);
	
	public Ladder() {
		movescheduler.scheduleAtFixedRate(this, 1000, 1000, TimeUnit.MILLISECONDS);
	}
	
	@Override
	public void run() {
		if (Client.players.size() == 0)
			return ;
		JSONObject json = new JSONObject();
		JSONArray array = new JSONArray();
		Map<Double, Player> map = new HashMap<Double, Player>();
		
		for (Client c : Client.players.values()) {
			if (!c.alive) {
				continue ;
			}
			map.put(c.player.getSize(), c.player);
		}
		
		List<Double> l = new ArrayList<Double>(map.keySet());

		Comparator<Double> comparator = (Double o1, Double o2) -> {
			return (int) (o2 - o1);
		};
		
		Collections.sort(l, comparator);
		
		int i = 0;
		for (double d : l) {
			if (i >= 9) {
				break ;
			}
			Player c = map.get(d);
			
			JSONObject tmp = new JSONObject();
			
			tmp.put("name", c.getClient().pseudo);
			tmp.put("score", (int)(d * 100) - 4000);
			array.put(i, tmp);
			i++;
		}
		
		json.put("messageId", 500)
		.put("ranking", array);
		
		SocketSender.sendMessageToAll(json.toString());
	}

}
