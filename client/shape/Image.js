(function(global) {
    'use strict';

    var Image = function(args) {
		this.___contructor(args);
    }
    
    Factory.addMethods(Image, {
        ___contructor: function(data) {
            this.init(data, { "color":"fill" }, "image");
            this.start();
        },
		___destructor: function() {
            this.mask.remove();
        },
        start: function() {
            var str = randomString();
            var tmp = SVG.append("defs").append("clipPath").attr("id", str)
            this.mask = tmp.append("circle");
            this.set("clip-path", "url(#" + str + ")");
            this.update();
        },
        update: function() {
            this.mask.attr("r", this.parent.r);
            this.mask.attr("cx", this.parent.x);
            this.mask.attr("cy", this.parent.y);

            this.set("width", this.parent.r * 2);
            this.set("height", this.parent.r * 2);
            this.set("x", this.parent.x - (this.width / 2));
            this.set("y", this.parent.y - (this.height / 2));
        }
    });

    Factory.newClass(Image);
    Factory.extend(Image, Shape);
	//#################################################################
	// SET TO GLOBAL VAR
	//#################################################################
	var glob = typeof global !== 'undefined' ?
    global :
    typeof window !== 'undefined' ?
    window :
    typeof WorkerGlobalScope !== 'undefined' ? self : {};

    glob.Image = Image;
    Image.global = glob;
    //#################################################################
})();