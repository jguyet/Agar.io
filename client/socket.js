function InitializeSocket()
{
	if ("WebSocket" in window)
	{
		// Let us open a web socket
		socket = new WebSocket("ws://weoohh.com:9998/echo");

		socket.onopen = function()
		{
			socket.sendMessage({ messageId: 0, width: width, height: height });
			console.log("Connection OK");
		};

		socket.onmessage = function (evt) 
		{ 
			var received_msg = evt.data;

			var m = JSON.parse(received_msg);
            
			//console.log("received : ", m);
			switch (m.messageId)
			{
				case 998://user informations
					currentId = m.id;
					agar.width = m.width;
					agar.height = m.height;
					agar.x = 0;
					agar.y = 0;
					var x = m.x - (agar.width / 2);
					var y = m.y - (agar.height / 2);
					addGrid(agar.width, agar.height, 50, 1);
					setWorldPos({x: 0, y: 0 }, {x: x, y: y}, world);
					startGame();
				break ;
				case 1000://add currentPlayer
					var worldx = (m.x - (agar.width / 2));
					var worldy = (m.y - (agar.height / 2));
					var x = (worldx + (agar.width / 2)) - (agar.x + (agar.width / 2));
					var y = (worldy + (agar.height / 2)) - (agar.y + (agar.height / 2));

					var player = new Circle({
						id: "circle",
						uid: m.id,
						r: m.r,
						x: x,
						y: y,
						color: randomColor(),
						stroke: "black",
						collider: true,
						tag: "player"
					});
					players[m.id + ""] = player;
					currentPlayer = player;
					world.push(player);
				break ;
				case 1001://add other entity
					if (m.id == currentId) {
						break ;
					}

					var worldx = (m.x - (agar.width / 2));
					var worldy = (m.y - (agar.height / 2));
					var x = (worldx + (agar.width / 2)) - (agar.x + (agar.width / 2));
					var y = (worldy + (agar.height / 2)) - (agar.y + (agar.height / 2));

					var entity = new Circle({
						id: "circle",
						uid: m.id,
						r: m.r,
						x: x,
						y: y,
						color: randomColor(),
						stroke: "black",
						collider: true,
						tag: "player"
					});
					players[m.id + ""] = entity;
					world.push(entity);
				break ;
				case 1002://update
					if (m.id == currentId) {
						break ;
					}

					if (players[m.id + ""] == undefined) {
						var worldx = (m.x - (agar.width / 2));
						var worldy = (m.y - (agar.height / 2));
						var x = (worldx + (agar.width / 2)) - (agar.x + (agar.width / 2));
						var y = (worldy + (agar.height / 2)) - (agar.y + (agar.height / 2));
	
						var entity = new Circle({
							id: "circle",
							uid: m.id,
							r: m.r,
							x: x,
							y: y,
							color: randomColor(),
							stroke: "black",
							collider: true,
							tag: "player"
						});
						players[m.id + ""] = entity;
						world.push(entity);
					}

					var worldx = (m.x - (agar.width / 2));
					var worldy = (m.y - (agar.height / 2));
					var x = (worldx + (agar.width / 2)) - (agar.x + (agar.width / 2));
					var y = (worldy + (agar.height / 2)) - (agar.y + (agar.height / 2));

					players[m.id + ""].set("x", x);
					players[m.id + ""].set("y", y);
					players[m.id + ""].set("r", m.r);

				break ;
				case 1003://remove
					if (players[m.id + ""] != undefined) {
						var player = players[m.id + ""];

						if (world.indexOf(player) != -1) {
							world.splice(world.indexOf(player), 1);
						}
						delete players["" + m.id];
						player.destroy();
					}
				break ;
			}
		};

		socket.onclose = function()
		{
			console.log("Socket connexion echouer waiting 1000s...");
			setTimeout(InitializeSocket, 1000);
        };
        
        socket.sendMessage = function(message)
        {
            //console.log("send : " + JSON.stringify(message));
            socket.send(JSON.stringify(message));
        };
	}
	else
	{
		console.log("Navigateur non fonctionnel");
	}
	if (socket == null)
	{
		console.log("Socket connexion echouer waiting 1000s...");
		setTimeout(InitializeSocket, 1000);
	}
}

InitializeSocket();