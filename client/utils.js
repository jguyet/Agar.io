
var randomColor = (function(){
    var golden_ratio_conjugate = 0.618033988749895;
    var h = Math.random();
  
    var hslToRgb = function (h, s, l){
        var r, g, b;
  
        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
  
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
  
        return '#'+Math.round(r * 255).toString(16)+Math.round(g * 255).toString(16)+Math.round(b * 255).toString(16);
    };
    
    return function(){
      h += golden_ratio_conjugate;
      h %= 1;
      return hslToRgb(h, 0.5, 0.60);
    };
  })();



d3.selection.prototype.moveToFront = function() {  
return this.each(function(){
    this.parentNode.appendChild(this);
});
};
d3.selection.prototype.moveToBack = function() {  
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    });
};



function moveTo(element, finalPosition, maxSpeed, map) {
    var mov = { x: 0, y: 0 };
    var pos = element.position();
    var speed = maxSpeed * (1 - ((100 * element.r / 1000) * 0.01));
    var stop = 5;

    if (element.speed != undefined && element.speed > 0) {
        speed += element.speed;
        element.speed -= 1;
    }
    if (element.stop != undefined && element.stop > 0) {
        stop = element.stop;
        element.stop -= 0.2;
    }

    if ((pos.y - finalPosition.y) < -stop && (map.y + (map.height / 2) + pos.y) < map.height) {
        mov.y += speed * -(pos.y - finalPosition.y)/100;
        if (mov.y > speed)
            mov.y = speed;
    }
    if ((pos.y - finalPosition.y) > stop && (map.y + (map.height / 2) + pos.y) > 0) {
        mov.y += -speed * (pos.y - finalPosition.y)/100;
        if (mov.y < -speed)
            mov.y = -speed;
    }
    if ((pos.x - finalPosition.x) < -stop && (map.x + (map.width / 2) + pos.x) < map.width) {
        mov.x += speed * -(pos.x - finalPosition.x)/100;
        if (mov.x > speed)
            mov.x = speed;
    }
    if ((pos.x - finalPosition.x) > stop && (map.x + (map.width / 2) + pos.x) > 0) {
        mov.x += -speed * (pos.x - finalPosition.x)/100;
        if (mov.x < -speed)
            mov.x = -speed;
    }
    element.translate(mov.x, mov.y);
    element.mov = mov;

    if (mov.x == 0 && mov.y == 0)
        return false;
    return true;
}

function moveWorldTo(element, finalPosition, maxSpeed, world, reverse, map) {
    var mov = { x: 0, y: 0 };
    var pos = element.position();
    var speed = maxSpeed * (1 - ((100 * element.r / 1000)*0.01));
    var stop = 0;

    if ((pos.y - finalPosition.y) < -stop && (map.y + (map.height / 2) + pos.y) > 0) {
        mov.y += speed * -(pos.y - finalPosition.y)/100;
        if (mov.y > speed)
            mov.y = speed;
    }
    if ((pos.y - finalPosition.y) > stop && (map.y + (map.height / 2) + pos.y) < map.height) {
        mov.y += -speed * (pos.y - finalPosition.y)/100;
        if (mov.y < -speed)
            mov.y = -speed;
    }
    if ((pos.x - finalPosition.x) < -stop && (map.x + (map.width / 2) + pos.x) > 0) {
        mov.x += speed * -(pos.x - finalPosition.x)/100;
        if (mov.x > speed)
            mov.x = speed;
    }
    if ((pos.x - finalPosition.x) > stop && (map.x + (map.width / 2) + pos.x) < map.width) {
        mov.x += -speed * (pos.x - finalPosition.x)/100;
        if (mov.x < -speed)
            mov.x = -speed;
    }

    for (var i = 0; i < world.length; i++) {
        var e  = world[i];
        if (reverse) {
            e.translate(-mov.x, -mov.y);
        } else {
            e.translate(mov.x, mov.y);
        }
    }

    if (reverse) {
        agar.x = Number(Number(agar.x + mov.x).toFixed(2));
        agar.y = Number(Number(agar.y + mov.y).toFixed(2));
    } else {
        agar.x = Number(Number(agar.x - mov.x).toFixed(2));
        agar.y = Number(Number(agar.y - mov.y).toFixed(2));
    }

    if (mov.x == 0 && mov.y == 0) {
        return false;
    }
    return true;
}

function setWorldPos(pos, finalPosition, world) {
    var mov = { x: 0, y: 0 };
    var stop = 0;

    mov.y += (pos.y - finalPosition.y);
    mov.x += (pos.x - finalPosition.x);

    for (var i = 0; i < world.length; i++) {
        var e  = world[i];
        e.translate(mov.x, mov.y);
    }

    agar.x = Number(Number(agar.x - mov.x).toFixed(2));
    agar.y = Number(Number(agar.y - mov.y).toFixed(2));

    if (mov.x == 0 && mov.y == 0) {
        return false;
    }
    return true;
}


function randomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }