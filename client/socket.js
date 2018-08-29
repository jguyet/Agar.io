function InitializeSocket()
{
	if ("WebSocket" in window)
	{
		// Let us open a web socket
		socket = new WebSocket("ws://localhost:9998/echo");

		socket.onopen = function()
		{
			socket.sendMessage("WL");
			console.log("Connection OK");
		};

		socket.onmessage = function (evt) 
		{ 
			var received_msg = evt.data;

			var m = eval(received_msg);
            
			console.log("received : " + received_msg);
			switch (m.id)
			{
				case 999://agar position
					agar.x = m.x;
					agar.y = m.y;
				break ;
				case 1000://add
					var player = new Circle({
						id: "circle",
						r: 40,
						x: width / 2,
						y: height / 2,
						color: randomColor(),
						stroke: "black",
						collider: true,
						tag: "player"
					});
					world.push(player);
				break ;
				case 1001://remove
					
				break ;
				case 1002://move

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
            console.log("send : " + message);
            socket.send(message);
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