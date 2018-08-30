(function(global) {
    'use strict';

    var Text = function(args) {
		this.___contructor(args);
    }
    
    Factory.addMethods(Text, {
        ___contructor: function(data) {
            this.init(data, { "color":"fill" }, "text");

            this.set("font-family", "Baloo Bhai");
            this.element.text(this.text);
            this.update();
        },
		___destructor: function() {
            this.element.remove();
        },
        change: function(text) {
            this.element.text(this.text);
            this.set("text", text);
            this.rotate(0);
        },
        update: function() {
            var parent = this;
            var x = this.parent.x;
            var y = this.parent.y;
            var r = this.parent.r;
            var bbox = null;
            var baseSize = this.get("font-size");
            var tt = SVG.append("text");

            tt.attr("font-family", this.get("font-family"));
            tt.text(this.text);
            tt.attr("font-size", 25);

            var mult = 0.5;

            var l = this.text.length;

            while (l > 0) {
                l -= 2;
                mult++;
            }

            tt.attr("font-size", function(d) {
                var diameter, labelAvailableWidth, labelWidth;
                diameter = r * mult;
                this.padding = diameter * 0.10;
                labelAvailableWidth = diameter - this.padding;
                bbox = this.getBBox();
                labelWidth = bbox.width;

                var size = Number(Number(labelAvailableWidth / labelWidth).toFixed(2)) + 'em';
                if (baseSize != size) {
                    parent.set("font-size", size);
                }
                tt.attr("font-size", size);//set new font size for change bbox
                //set to parent x and y points
                parent.set("x", (Number(x) - (this.getBBox().width / 2.0)));
                parent.set("y", (Number(y) + ((this.getBBox().height / 4.0))));
                tt.remove();
                return 0;
            });
        }
    });

    Factory.newClass(Text);
    Factory.extend(Text, Shape);
	//#################################################################
	// SET TO GLOBAL VAR
	//#################################################################
	var glob = typeof global !== 'undefined' ?
    global :
    typeof window !== 'undefined' ?
    window :
    typeof WorkerGlobalScope !== 'undefined' ? self : {};

    glob.Text = Text;
    Text.global = glob;
    //#################################################################
})();