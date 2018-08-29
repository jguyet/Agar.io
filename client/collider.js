

function CircleCircle(circle1, circle2) {
    var dx = circle1.x - circle2.x;
    var dy = circle1.y - circle2.y;
    var distance = Math.sqrt(dx * dx + dy * dy).toFixed(2);

    if (distance < (new Number(circle1.r) + new Number(circle2.r))) {
        return {distance: distance, collide: true};
    }
    return {distance: distance, collide: false};
}

function Collider(func) {
    for (var i = 0; i < world.length; i++) {

        var e1 = world[i];
        if (e1.collider == undefined)
            continue ;
        for (var e = 0; e < world.length; e++) {

            if (i == e)
                continue ;
            var e2 = world[e];
            var collide = CircleCircle(e1, e2);
            if (collide.collide) {
                func(e1, e2, collide);
            }
        }
    }
}