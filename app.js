var app = angular.module('conway', []);
app.controller('mainCtrl', ['$scope', function ($scope) {

  
  $scope.conway = (function () {
  // Initialize main private variables 
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
  var delayTime = 50;

  // Grid and Cell Dimensions
  var cellSize = 10;
  var gridWidth = 1000;
  var cellsPerRow = gridWidth / cellSize;
  var numberOfCells = Math.pow(cellsPerRow, 2);
  var cellInnerDimension = cellSize-1;

  // Constructor function for cells
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
    loop = window.setInterval(redrawBoard, delayTime);
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
    window.setTimeout(redrawBoard, delayTime*3);
  }

  function initBoard(randomize) {
    grid = [];
    for (var xPoint = 0, yPoint = 0, index = 0; index < numberOfCells; index++) {
      var thisShape = new Cell(xPoint, yPoint, cellInnerDimension, cellInnerDimension, index);
      if (randomize) {
        var randNum = Math.floor(Math.random()*15);
        if (randNum <= 2) {
          thisShape.alive = true;
          thisShape.fillColor = aliveColor;
        }
      }
      grid.push(thisShape);
      xPoint += cellSize;
      if (xPoint % gridWidth === 0) {
        xPoint = 0;
        yPoint += cellSize;
      }
      Draw(grid[index]);
    }
  }

  function calcNeighbors() {
    var o = cellsPerRow;
    var neighbors = [-(o+1),-o,-(o-1),-1,1,o-1,o,o+1];
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
    for (var k = 0; k < numberOfCells; k++) {
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

  // Returning public methods
  return {
    run: run,
    pause: pause,
    nextStep: nextStep,
    pause: pause,
    reset: reset,
    randomize: randomize,
    initBoard: initBoard
  };
})();
  $scope.conway.initBoard();
  
}])