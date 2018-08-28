(function(global) {
    'use strict';

    var Shape = function(args, special) {
		this.init(args, special);
    }
    
    Factory.addMethods(Shape, {
        init: function(data, special, tag) {

            if (data.rotation == undefined) {
                data.rotation = 0;
            }
            if (data.x == undefined) {
                data.x = 0;
            }
            if (data.y == undefined) {
                data.y = 0;
            }
            if (data.z == undefined) {
                data.z = 0;
            }
            this.special = special;
            this.element = SVG.append(tag);
            var array = Object.entries(data);
            for (var i = 0; i < array.length; i++) {
                this.set(array[i][0], array[i][1]);
            }
            if (this.parent != undefined) {
                this.set("x", this.parent.x);
                this.set("y", this.parent.y);
                this.set("z", this.parent.z);
            }
        },
		___destructor: function() {
            //console.log("DESTRUCT Shape", this.element);
            if (this.childs != undefined) {
                for (var i = 0; i < this.childs.length; i++) {
                    this.childs[i].destroy();
                }
            }
            this.element.remove();
        },
        style: function(key, value) {
            this.element.style(key, value);
        },
        get: function(attr) {
            return this[attr];
        },
        set: function(attr, value) {
            this[attr] = value;
            if (this.special[attr] != undefined) {
                attr = this.special[attr];
            }
            this.element.attr(attr, value);
        },
        translate: function(x, y) {
            this.set("x", Number(Number(this.x + x).toFixed(2)));
            this.set("y", Number(Number(this.y + y).toFixed(2)));
            if (this.update != undefined) {
               this.update();
            }
            //this.rotate(this.rotation);

            if (this.childs != undefined) {
                for (var i = 0; i < this.childs.length; i++) {
                    this.childs[i].translate(x, y);
                }
            }
        },
        position: function() {
            return ({ x: this.x, y: this.y });
        },
        rotate: function(angle) {
            if (this.rotation == 0 && angle == 0)
                return ;
            var parent = this;
            this.rotation = angle;
            this.element.attr("transform", function(d) {
                return "rotate(" + angle + ", "
                + (Math.round(parent.x, 2) + (this.getBBox().width / 2)) + ", "
                + (Math.round(parent.y, 2) - (this.getBBox().height / 3.0)) + ")";
            });
        }
    });

	Factory.newClass(Shape);
	//#################################################################
	// SET TO GLOBAL VAR
	//#################################################################
	var glob = typeof global !== 'undefined' ?
    global :
    typeof window !== 'undefined' ?
    window :
    typeof WorkerGlobalScope !== 'undefined' ? self : {};

    glob.Shape = Shape;
    Shape.global = glob;
    //#################################################################
})();