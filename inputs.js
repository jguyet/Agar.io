

Factory.addMethods(Circle, {
    incress: function(i) {
        this.set("r", this.r + i);
        if (this.text != undefined) {
            this.text.update();
        }
    }
});

var stape1 = { position: { x: 1000, y: 300 }, next: null };
var stape2 = { position: { x: 500, y: 300 }, next: null };
stape1.next = stape2;
stape2.next = stape1;

var ia = new Circle({
            id: "enemi",
            r: 80,
            x: 500,
            y: 300,
            color: randomColor(),
            stroke: "grey",
            text: "Ennemi",
            path: stape1,
            stop: 0,
            maxSpeed: 3,
            tag: "entity",
            collider: true
        });

var text = new Text({parent: ia, text: "IA"});

ia.childs = [text];
ia.text = text;

world.push(ia);

var player = new Circle({id: "circle", r: 40, x: width / 2, y: height / 2, color: randomColor(), stroke: "black", collider: true, tag: "player" });
//var text = new Text({id: "circleText", parent: player, text: "DEMO", color: "white" });
var img = new Image({id: "circleImg", parent: player, width: 100, height: 100, "xlink:href": "https://i.imgur.com/FBPuTDh.jpg"});

player.childs = [img];
//player.text = text;

balls.push(player);
world.push(player);

var stars = {};


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
var o = 0;
var deleted = [];
var lastCalTime = 0;

var timer = setInterval(function() {
    deleted = [];
    var finalPosition = mouse;
    var master = 0;

    moveWorldTo(balls[0], { x: width / 2, y: height / 2 }, maxSpeed, world, false, agar);

    for (var i = 0; i < balls.length; i++) {
        var element = balls[i];
        moveTo(element, finalPosition, maxSpeed, agar);

        if (keys[81] === true) {
            element.incress(2);
        }

        if (master == null) {
            master = element;
            finalPosition = element.position();
        }
    }


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

    if (keys[32] === true) {
        keys[32] = false;
        var l = balls.length;
        for (var b = 0; b < l; b++) {
            var circle = balls[b];

            if (circle.r < 100) {
                continue ;
            }

            //var textname = circle.text.text;
            var pos = circle.position();
            var r = circle.r;
            var nr = r / 2;

            deleted.push(circle);
            for (var i = 0; i < 3; i++) {
                var c = new Circle({ id: "circle", r: nr, x: pos.x + ((Math.random() * 100)% 50), y: pos.y + ((Math.random() * 100)% 50), color: randomColor(), stroke: "black" });
                c.collider = true;
                c.speed = 30;
                c.stop = r;
                c.tag = "player";

                //var text = new Text({ id: "circleText", parent: c, text: textname, color: "white"});
                var img = new Image({id: "circleImg", parent: c, width: 100, height: 100, "xlink:href": "https://i.imgur.com/FBPuTDh.jpg"});                
                
                c.childs = [img];
               // c.text = text;

                world.push(c);
                balls.push(c);
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
                    entity2.angle += 10;
                    entity2.angle %= 360;
                    var angle = (entity2.angle * (Math.PI / 2)) / 90;

                    var tmp = new Circle({r: 5, x: Math.round(entity2.position().x, 2), y: Math.round(entity2.position().y, 2), color: randomColor(), stroke: "black"})

                    tmp.path = { position: {}, next: null };
                    tmp.path.position.x = (Math.round(entity2.x, 2) + (100 + Math.floor(Math.random() * 100) + entity2.r) * Math.sin(angle)) + agar.x;
                    tmp.path.position.y = (Math.round(entity2.y, 2) + (100 + Math.floor(Math.random() * 100) + entity2.r) * Math.cos(angle)) + agar.y;
                    tmp.maxSpeed = 1;

                    world.push(tmp);
                }
            }
            return ;
        }

        if (entity1.tag == "player" && entity2.tag == "player") {
            if (entity2.stop <= 0 && entity1.stop <= 0) {
                entity2.stop = 5;
                entity1.incress(entity2.r * 0.5);
                deleted.push(entity2);
            } else {
                var x = entity1.position().x - entity2.position().x;
                var y = entity1.position().y - entity2.position().y;
                entity1.translate(x / 10, y / 10);
            }
            return ;
        }

        if (entity1.tag == "player" || entity1.tag == "entity") {
            if (collide.distance < (entity1.r - entity2.r)) {
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
        if (balls.indexOf(deleted[i]) != -1) {
            balls.splice(balls.indexOf(deleted[i]), 1);
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

}, 1000 / 60);

noise.seed(0);

var scale = 100;

var timer = setInterval(function() {

    if (world.length > 400)
        return ;

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

            if (stars["time" + xworld + "x" + yworld] != undefined && new Date().getTime() < stars["time" + xworld + "x" + yworld] + 6000) {
                continue ;
            }

            var screenx = Number(Number(xworld - (savex + (agar.width / 2))).toFixed(0));
            var screeny = Number(Number(yworld - (savey + (agar.height / 2))).toFixed(0));

            var value = Math.floor(Math.abs(noise.simplex2(Math.floor(xworld * 1000) / 100, Math.floor(yworld * 1000) / 100)) * 100);
            
            if (value > 75) {
                var tmp = new Circle({
                        r: 10,
                        x: (screenx),// forcement < 25% de width
                        y: (screeny),// sur toute la hauteur
                        color: randomColor(),
                        xworld: xworld,
                        yworld: yworld
                    }
                );

                tmp.path = { position: {}, next: null };

                var angle = (Math.floor(Math.random() * 180) % 180);

                tmp.path.position.x = (Math.round(tmp.x, 2) + (100 + Math.floor(Math.random() * 100) + tmp.r) * Math.sin(angle)) + agar.x;
                tmp.path.position.y = (Math.round(tmp.y, 2) + (100 + Math.floor(Math.random() * 100) + tmp.r) * Math.cos(angle)) + agar.y;
                tmp.maxSpeed = 1;

                world.push(tmp);
                stars[xworld + "x" + yworld] = tmp;
            }
        }
    }
    //console.log("WORLD ELEMENTS :", world.length);

    var ray = 0;

    for (var i = 0; i < balls.length; i++) {
        ray += balls[i].r;
    }

    //scale by circle R (MIN + (REST - (R * REST / MAX_R))) Example : (40 + (60 - (40 * 60 / 600)))
    var scale = (40 + (60 - (ray * 60 / 600)));

    if (scale < 30) {
        scale = 30;
    }

    console.log(scale);
    
    //scale * 1 / 100 example : 80 * 1 / 100 = 0.8
    var finalScale = scale * 1 / 100;
    SVG.attr("transform", "translate(" + ((width * (1 - finalScale)) / 2) + "," + ((height * (1 - finalScale)) / 2) + ") scale(" + finalScale + ", " + finalScale + ")");

}, 100);