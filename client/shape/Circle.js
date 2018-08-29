(function(global) {
    'use strict';

    var Circle = function(args) {
		this.___contructor(args);
    }
    
    Factory.addMethods(Circle, {
        ___contructor: function(data) {
            this.init(data, { "x":"cx", "y":"cy", "color":"fill" }, "circle");

            this.set("filter", "url(#blur)");
        },
		___destructor: function() {
            //console.log("DESTRUCT Circle", this.element);
        }
    });

    Factory.newClass(Circle);
    Factory.extend(Circle, Shape);
	//#################################################################
	// SET TO GLOBAL VAR
	//#################################################################
	var glob = typeof global !== 'undefined' ?
    global :
    typeof window !== 'undefined' ?
    window :
    typeof WorkerGlobalScope !== 'undefined' ? self : {};

    glob.Circle = Circle;
    Circle.global = glob;
    //#################################################################
})();