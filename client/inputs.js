
/*
** add grid 30*30
*/
function addGrid(gridWidth, gridHeight, size, large) {
    
    for (var x = -(gridWidth / 2); x < (gridWidth / 2); x += size)
    {
        var line = SVG.append("rect")
        .style("fill", "grey")
        .style("opacity", 0.3)
        .attr("x", x)
        .attr("y", -(gridHeight / 2))
        .attr("width", large)
        .attr("height", gridWidth);

        line.translate = function(x, y) {
            this.attr("x", Number(this.attr("x")) + x);
            this.attr("y", Number(this.attr("y")) + y);
        }

        line.set = function(attr, value) {
            this.attr(attr, value);
        }

        world.push(line);
    }
    for (var y = -(gridHeight / 2); y < (gridHeight / 2); y += size)
    {
        var line = SVG.append("rect")
        .style("fill", "grey")
        .style("opacity", 0.3)
        .attr("x", -(gridWidth / 2))
        .attr("y", y)
        .attr("width", gridHeight)
        .attr("height", large);

        line.translate = function(x, y) {
            this.attr("x", Number(this.attr("x")) + x);
            this.attr("y", Number(this.attr("y")) + y);
        }

        line.set = function(attr, value) {
            this.attr(attr, value);
        }

        world.push(line);
    }
}


Factory.addMethods(Circle, {
    incress: function(i) {
        this.set("r", this.r + i);
        if (this.text != undefined) {
            this.text.update();
        }
    }
});

//var currentPlayer = new Circle({id: "circle", r: 40, x: width / 2, y: height / 2, color: randomColor(), stroke: "black", collider: true, tag: "player" });
//var text = new Text({id: "circleText", parent: player, text: "DEMO", color: "white" });
//var img = new Image({id: "circleImg", parent: currentPlayer, width: 100, height: 100, "xlink:href": "https://i.imgur.com/FBPuTDh.jpg"});

//currentPlayer.childs = [img];
//player.text = text;

//world.push(currentPlayer);


var keys = {};

for (var i = 0; i < 300; i++) {
    keys[i] = false;
}

d3.select("body").attr('tabindex', '0').attr('focusable', 'true')
.on("keydown", function() {
    keys[d3.event.keyCode] = true;
    console.log("KEY D ", d3.event.keyCode, keys[d3.event.keyCode]);
})
.on("keyup", function() {
    keys[d3.event.keyCode] = false; 
    console.log("KEY U ", d3.event.keyCode, keys[d3.event.keyCode]);
});

var maxSpeed = 8;
var lastCalTime = 0;
var stars = {};

noise.seed(0);

////////////////////////////////////////////////////////////////////////

function gameLoop() {

    if (currentPlayer == undefined || currentPlayer == null) {
        return ;
    }

    var deleted = [];
    var finalPosition = mouse;

    //Move World to currentPlayer
    moveWorldTo(currentPlayer, { x: width / 2, y: height / 2 }, maxSpeed, world, false, agar);

    //move currentPlayer
    moveTo(currentPlayer, finalPosition, maxSpeed, agar)

    socket.sendMessage({
        messageId: 2,
        id: currentId,
        x: Number(Number((agar.x + currentPlayer.x) + (agar.width / 2)).toFixed(2)),
        y: Number(Number((agar.y + currentPlayer.y) + (agar.height / 2)).toFixed(2)),
        r: currentPlayer.r
    });

    for (var i = 0; i < world.length; i++) {
        var element = world[i];

        if (element.x < -(width * 0.50) || element.x > (width + (width * 0.50)) || element.y < -(height * 0.50) || element.y > (height + (height * 0.50))) {
            deleted.push(element);
        }

        if (element.path == undefined)
            continue ;
        if (moveTo(element, { x: element.path.position.x - agar.x, y: element.path.position.y - agar.y } , element.maxSpeed, agar) == false) {
            if (element.path.next != undefined && element.path.next != null) {
                element.path = element.path.next;
            }
        }
    }

    Collider(function(entity1, entity2, collide) {

        if (entity2.mur == true || entity1.mur == true) {
            if (entity2.mur == true) {
                var x = entity1.position().x - entity2.position().x;
                var y = entity1.position().y - entity2.position().y;
                entity1.translate(x / 5, y / 5);


                var time = new Date().getTime();

                if (time - lastCalTime > 60) {
                    lastCalTime = time;

                    if (entity2.angle == undefined) {
                        entity2.angle = 0;
                    }
                    entity2.angle += 10;
                    entity2.angle %= 360;
                    var angle = (entity2.angle * (Math.PI / 2)) / 90;

                    var tmp = new Circle({r: 3, x: Math.round(entity2.position().x, 2), y: Math.round(entity2.position().y, 2), color: randomColor(), stroke: "black"})

                    tmp.path = { position: {}, next: null };
                    tmp.path.position.x = (Math.round(entity2.x, 2) + (100 + Math.floor(Math.random() * 100) + entity2.r) * Math.sin(angle)) + agar.x;
                    tmp.path.position.y = (Math.round(entity2.y, 2) + (100 + Math.floor(Math.random() * 100) + entity2.r) * Math.cos(angle)) + agar.y;
                    tmp.maxSpeed = 1;

                    world.push(tmp);
                }
            }
            return ;
        }

        if (entity1.tag == "player" || entity1.tag == "entity") {
            if (collide.distance < (entity1.r - entity2.r)) {

                if (players[entity2.uid + ""] != undefined) {
                    socket.sendMessage({messageId: 3, id: entity2.uid });
                }

                entity1.incress(entity2.r * 0.20);
                deleted.push(entity2);
            }
        } else {
            entity1.incress(entity2.r);
            deleted.push(entity2);
        }
    });

    for (var i = 0; i < deleted.length; i++) {
        if (world.indexOf(deleted[i]) != -1) {
            world.splice(world.indexOf(deleted[i]), 1);
        }
        if (deleted[i].uid != undefined && players["" + deleted[i].uid] != undefined) {
            delete players["" + deleted[i].uid];
        }
        if (deleted[i].xworld != undefined) {
            stars["time" + deleted[i].xworld + "x" + deleted[i].yworld] = new Date().getTime();
            delete stars[deleted[i].xworld + "x" + deleted[i].yworld];
        }
        deleted[i].destroy();
    }

    SVG.select("#circle").moveToFront();
    SVG.select("#circleImg").moveToFront();
    SVG.select("#circleText").moveToFront();
}

function entityLoop() {

    var savex = agar.x;
    var savey = agar.y;
    var large = 21;

    for (var y = -(height * 0.25); y < (height + (height * 0.25)); y += 100) {
        for (var x = -(width * 0.25); x < (width + (width * 0.25)); x += 100) {
            
            var posx = Number(Number((savex + x) + (agar.width / 2)).toFixed(0));
            var posy = Number(Number((savey + y) + (agar.height / 2)).toFixed(0));

            if (posx < 0 || posx > agar.width || posy < 0 || posy > agar.height) {
                continue ;
            }

            // //donne la grille x/y sur 100x100 cases
            var gridx = Number(Number(posx * large / agar.width).toFixed(0)) % large;
            var gridy = Number(Number(posy * large / agar.height).toFixed(0)) % large;

            var xworld = Number(Number((agar.width / large) * gridx).toFixed(0));//get world coordinate x of grid
            var yworld = Number(Number((agar.height / large) * gridy).toFixed(0));//get world coordinate y of grid

            if (stars[xworld + "x" + yworld] != undefined) {
                continue ;
            }

            if (stars["time" + xworld + "x" + yworld] != undefined
                && new Date().getTime() < stars["time" + xworld + "x" + yworld] + 6000) {
                continue ;
            }

            var screenx = Number(Number(xworld - (savex + (agar.width / 2))).toFixed(0));
            var screeny = Number(Number(yworld - (savey + (agar.height / 2))).toFixed(0));

            var value = Math.floor(Math.abs(noise.simplex2(Math.floor(xworld * 1000) / 100, Math.floor(yworld * 1000) / 100)) * 100);
            
            if (value > 75 && value < 95) {

                var tmp = new Circle({
                        r: 10,
                        x: (screenx),// forcement < 25% de width
                        y: (screeny),// sur toute la hauteur
                        color: randomColor(),
                        xworld: xworld,
                        yworld: yworld
                    });

                world.push(tmp);
                stars[xworld + "x" + yworld] = tmp;
            } else if (value >= 95) {
                var tmp = new Circle({
                        r: 80,
                        x: (screenx),// forcement < 25% de width
                        y: (screeny),// sur toute la hauteur
                        color: "#669900",
                        xworld: xworld,
                        yworld: yworld,
                        mur: true,
                        stroke: "#446600",
                        "stroke-width": 10
                    });

                world.push(tmp);
                stars[xworld + "x" + yworld] = tmp;
            }
        }
    }
    //console.log("WORLD ELEMENTS :", world.length);

    if (currentPlayer == undefined || currentPlayer == null) {
        return ;
    }

    var ray = 0;

    ray = currentPlayer.r;

    //scale by circle R (MIN + (REST - (R * REST / MAX_R))) Example : (40 + (60 - (40 * 60 / 600)))
    var scale = (40 + (60 - (ray * 60 / 600)));

    if (scale < 30) {
        scale = 30;
    }
    
    //scale * 1 / 100 example : 80 * 1 / 100 = 0.8
    var finalScale = scale * 1 / 100;
    SVG.attr("transform", "translate(" + ((width * (1 - finalScale)) / 2) + "," + ((height * (1 - finalScale)) / 2) + ") scale(" + finalScale + ", " + finalScale + ")");

}


function startGame() {
    console.log("START");

    setInterval(gameLoop, 1000 / 60);
    setInterval(entityLoop, 50);
}