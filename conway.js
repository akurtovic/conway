var shapes = [];
var canvas = document.getElementById('canvas'),
    canvasLeft = canvas.offsetLeft,
    canvasTop = canvas.offsetTop;
if (canvas.getContext) {
	var ctx = canvas.getContext('2d');
}
var deadColor = '#BFDFFF';
var aliveColor = '#869CB2';
var loop;

function Shape(left, top, width, height, index) {
	this.left = left;
	this.top = top;
	this.width = width;
	this.height = height;
	this.index = index;
	this.fillColor = deadColor;
	this.alive = false;
	this.aliveNeighbors = 0;
}

function Draw(shape){
	ctx.fillStyle = shape.fillColor;
	ctx.fillRect(shape.left, shape.top, shape.width, shape.height);
}

function run(){
	loop = window.setInterval(redrawBoard, 100);
}

function pause() {
	clearInterval(loop);
}

function reset() {
	pause();
	initBoard();
}

function nextStep(){
	window.setTimeout(redrawBoard, 300);
}

function initBoard() {
	shapes = [];
	for (var i = 0, j = 0, k = 0; k < 1200; k++) {
		var thisShape = new Shape(i, j, 14, 14, k);
		shapes.push(thisShape);
		i += 15;
		if (i % 600 === 0) {
			i = 0;
			j += 15;
		}
		Draw(shapes[k]);
	}
}

initBoard();

function calcNeighbors() {
	var neighbors = [-41,-40,-39,-1,1,39,40,41];
	var aliveNeighbors = 0;
	shapes.forEach(function(element) {
		element.aliveNeighbors = 0;
		neighbors.forEach(function(x) {
			var index = element.index + x;
			if (index > -1){
				if (shapes[index] && shapes[index].alive === true){
					element.aliveNeighbors += 1;
				}
			}
		});
	})
}

function birth(element) {
	element.alive = true;
	element.fillColor = aliveColor;
}

function kill(element) {
	element.alive = false;
	element.fillColor = deadColor;
}

function redrawBoard(board) {
	calcNeighbors();
	for (var k = 0; k < 1200; k++) {
		var element = shapes[k];
		var aliveNeighbors = element.aliveNeighbors;
		if (aliveNeighbors > 0){
		}
		if (element && element.alive){
			if (element.aliveNeighbors < 2) {
				kill(element);
			} else if (element.aliveNeighbors > 3) {
				kill(element);
			} else if (element.aliveNeighbors == 2 || element.aliveNeighbors == 3) {
				birth(element);
			}
		} else {
			if (element.aliveNeighbors == 3) {
				birth(element);
			}
		}
	}

	shapes.forEach(function(x) {
		Draw(x);
	})
}

canvas.addEventListener('click', function(event) {
    var x = event.pageX - canvasLeft,
        y = event.pageY - canvasTop;

    shapes.forEach(function(element) {
        if (y > element.top && y < element.top + element.height 
            && x > element.left && x < element.left + element.width) {
        		if (element.fillColor === deadColor){
        			element.fillColor = aliveColor;
        			element.alive = true;
        			Draw(element);
        		} else {
        			element.fillColor = deadColor;
        			element.alive = false;
        			Draw(element);
        		}
        }
    });

}, false);