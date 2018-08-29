var width = window.innerWidth - 15;
var height = window.innerHeight - 4;
var mouse = {x: width / 2, y: height / 2};

/*
** ADD SVG to body
*/
var sampleSVG = d3.select("body")
.append("svg")
.attr("width", width)
.attr("height", height)
.on('mousemove', function() {
    mouse.x = d3.mouse(this)[0];
    mouse.y = d3.mouse(this)[1];
  });

var SVG = sampleSVG.append("g");

SVG.call(d3.zoom()
.scaleExtent([1 / 2, 4])
.on("zoom", zoomed));

function zoomed() {
    SVG.attr("transform", d3.event.transform);
}

SVG.style("background-color", "#232121");

//d3.selectAll("line").remove();

var blur = SVG.append("defs").append("filter").attr("id", "blur");

var fgaussian = blur.append("feGaussianBlur")
    .attr("stdDeviation","3.5")
    .attr("result","coloredBlur");

var feMerge = blur.append("feMerge");
    feMerge.append("feMergeNode")
        .attr("in","coloredBlur");
    feMerge.append("feMergeNode")
        .attr("in","SourceGraphic");

var pseudo = "SALUT";

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

addGrid(agar.width, agar.height, 50, 1);