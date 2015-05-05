var grid = [];
var canvas = document.getElementById('canvas'),
    canvasLeft = canvas.offsetLeft,
    canvasTop = canvas.offsetTop;
if (canvas.getContext) {
	var ctx = canvas.getContext('2d');
}
var deadColor = '#BFDFFF';
var aliveColor = '#869CB2';
var loop;

function Cell(left, top, width, height, index) {
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

function randomize() {
	initBoard(true);
}

function nextStep(){
	window.setTimeout(redrawBoard, 300);
}

function initBoard(randomize) {
	grid = [];
	for (var i = 0, j = 0, k = 0; k < 1200; k++) {
		var thisShape = new Cell(i, j, 14, 14, k);
		if (randomize) {
			var randNum = Math.floor(Math.random()*15);
			if (randNum <= 2) {
				thisShape.alive = true;
				thisShape.fillColor = aliveColor;
			}
		}
		grid.push(thisShape);
		i += 15;
		if (i % 600 === 0) {
			i = 0;
			j += 15;
		}
		Draw(grid[k]);
	}
}

initBoard();

function calcNeighbors() {
	var neighbors = [-41,-40,-39,-1,1,39,40,41];
	var aliveNeighbors = 0;
	grid.forEach(function(element) {
		element.aliveNeighbors = 0;
		neighbors.forEach(function(x) {
			var index = element.index + x;
			if (index > -1){
				if (grid[index] && grid[index].alive === true){
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

function death(element) {
	element.alive = false;
	element.fillColor = deadColor;
}

function redrawBoard(board) {
	calcNeighbors();
	for (var k = 0; k < 1200; k++) {
		var element = grid[k];
		var aliveNeighbors = element.aliveNeighbors;

		if (element && element.alive){
			if (element.aliveNeighbors < 2) {
				death(element);
			} else if (element.aliveNeighbors > 3) {
				death(element);
			} else if (element.aliveNeighbors == 2 || element.aliveNeighbors == 3) {
				birth(element);
			}
		} else {
			if (element.aliveNeighbors == 3) {
				birth(element);
			}
		}
	}

	grid.forEach(function(x) {
		Draw(x);
	})
}

canvas.addEventListener('click', function(event) {
    var x = event.pageX - canvasLeft,
        y = event.pageY - canvasTop;

    grid.forEach(function(element) {
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