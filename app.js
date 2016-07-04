var app = angular.module('conway', []);

app.controller('mainCtrl', ['$scope', function ($scope) {

  // Initialize spped in milliseconds
  $scope.speed = 200;

  // Initialize size of each cell at 15 pixels
  $scope.cellSize = 13;

  // Initialize number of alive cells and generations
  $scope.aliveCells = 0;
  $scope.alivePercentage = 0;
  $scope.generations = 0;

  // Start the board in paused state
  $scope.status = 'paused';

  /*
  Revealing module containing all of the logic
  Public methods are exposed in return
  */
  $scope.conway = (function () {

    // Set colors for dead and alive cells
    var deadColor = '#9899A6';
    var aliveColor = '#5465E5';

    // Declare module state variables 
    var loop,
      grid,
      canvas,
      ctx,
      canvasLeft,
      canvasTop,
      gridWidth,
      cellsPerRow,
      numberOfCells,
      cellInnerDimension,
      aliveCells = 0;

    // Initialize canvas
    canvas = document.getElementById('canvas');
    canvasLeft = canvas.offsetLeft;
    canvasTop = canvas.offsetTop;
    if (canvas.getContext) {
      ctx = canvas.getContext('2d');
    }
    function initCanvas() {
      grid = [];
      // Set the dimensions of the grid and cells
      gridWidth = 80 * $scope.cellSize;
      cellsPerRow = gridWidth / $scope.cellSize;
      numberOfCells = Math.pow(cellsPerRow, 2);
      cellInnerDimension = $scope.cellSize-1;
    }

    // Constructor function that creates new cells
    function Cell(left, top, width, height, index) {
      // Set the placement and dimensions of the cell
      this.left = left;
      this.top = top;
      this.width = width;
      this.height = height;
      // Set the index of the cell in the grid
      this.index = index;
      // Initialize the cell as dead
      this.alive = false;
      this.fillColor = deadColor;
      // Initialize the number of alive neighbors to 0
      this.aliveNeighbors = 0;
    }

    // Takes a cell as a parameter and draws a rect in the canvas
    function Draw(cell) {
      ctx.fillStyle = cell.fillColor;
      ctx.fillRect(cell.left, cell.top, cell.width, cell.height);
    }

    // If the board is paused, run() sets window interval and redraws the board
    function run() {
      $scope.status === 'paused' ? loop = window.setInterval(redrawBoard, $scope.speed) : null;
      $scope.status = 'running';
    }

    // Clear window interval and set state to paused
    function pause() {
      clearInterval(loop);
      $scope.status = 'paused';
    }

    // Reset the board to initial state
    function reset() {
      $scope.generations = 0;
      $scope.aliveCells = 0;
      $scope.alivePercentage = 0;
      pause();
      initBoard();
    }

    // Initialize a new board with the randomize flag set to true
    function randomize() {
      initBoard(true);
    }

    // Pause the board and redraw only 1 generation
    function nextStep(){
      pause();
      window.setTimeout(redrawBoard, 300);
    }

    // Lower the window interval period, speeding up the board redraw
    function speedUp() {
      if ($scope.speed > 50) {
        $scope.speed -= 50;
        if ($scope.status === 'running') {
          pause();
          run();
        }
      }
    }

    // Increase the window interval period, slowing down the board redraw
    function slowDown() {
      if ($scope.speed < 800) {
        $scope.speed += 50;
        if ($scope.status === 'running') {
          pause();
          run();
        }
      }
    }

    // Initialize the game board, used on initial load and reset
    function initBoard(randomize) {
      initCanvas();

      // Fill up the canvas with new Cell objects
      for (var xPoint = 0, yPoint = 0, index = 0; index < numberOfCells; index++) {
        // Create new cell
        var thisShape = new Cell(xPoint, yPoint, cellInnerDimension, cellInnerDimension, index);
        // If randomize flag is true, randomly assign cells to alive state
        if (randomize) {
          $scope.aliveCells = 0;
          $scope.alivePercentage = 0;
          var randNum = Math.floor(Math.random()*17);
          if (randNum <= 2) {
            thisShape.alive = true;
            $scope.aliveCells += 1;
            $scope.alivePercentage = ($scope.aliveCells/6400)*100;
            thisShape.fillColor = aliveColor;
          }
        }
        // Add the new cell to the grid
        grid.push(thisShape);
        // Increment x-axis by the width of a standard cell
        xPoint += $scope.cellSize;

        // If x-axis has reached max width of the grid,
        // move x-axis to beginning of the line and increment
        // the y-axis by the height of a standard cell
        if (xPoint % gridWidth === 0) {
          xPoint = 0;
          yPoint += $scope.cellSize;
        }
        // Draw the cell we just created to the canvas
        Draw(grid[index]);
      }
    }

    // Calculates the number of neighboring cells that are alive
    function calcNeighbors() {
      // Set o to the number of cells in each row
      var o = cellsPerRow;
      // neighbors is an array containing the locations of all of the cells
      // that are directly adjacent to the current cell
      var neighbors = [-(o+1),-o,-(o-1),-1,1,o-1,o,o+1];
      var aliveNeighbors = 0;

      // Loop through the grid and find alive neighbors for each cell
      grid.forEach(function(cell) {
        cell.aliveNeighbors = 0;
        // Loop through the neighbors array and for each neighbor of the
        // current cell, check if it is alive
        // if so, increment aliveNeighbors by 1
        neighbors.forEach(function(x) {
          var index = cell.index + x;
          if (index > -1){
            if (grid[index] && grid[index].alive === true){
              cell.aliveNeighbors += 1;
            }
          }
        });
      })
    }

    // Set a cell to alive
    function birth(cell) {
      cell.alive = true;
      cell.fillColor = aliveColor;
    }

    // Set a cell to dead
    function death(cell) {
      cell.alive = false;
      cell.fillColor = deadColor;
    }

    // redrawBoard is called on each interval or setTimeout
    function redrawBoard(board) {
      calcNeighbors();
      aliveCells = 0;
      $scope.generations += 1;
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

      grid.forEach(function(cell) {
        if (cell.alive) {
          aliveCells += 1;
        }
        Draw(cell);
      });
      $scope.aliveCells = aliveCells;
      $scope.alivePercentage = ($scope.aliveCells/6400)*100;
      $scope.$apply();
    }

    // Click handler to turn cells dead/alive
    canvas.addEventListener('click', function(event) {
        var x = event.pageX - canvasLeft,
            y = event.pageY - canvasTop;

        grid.forEach(function(element) {
            if (y > element.top && y < element.top + element.height 
                && x > element.left && x < element.left + element.width) {
                if (element.fillColor === deadColor){
                  element.fillColor = aliveColor;
                  element.alive = true;
                  $scope.aliveCells += 1;
                  $scope.$apply();
                  Draw(element);
                } else {
                  element.fillColor = deadColor;
                  element.alive = false;
                  $scope.aliveCells -= 1;
                  $scope.$apply();
                  Draw(element);
                }
            }
            $scope.alivePercentage = ($scope.aliveCells/6400)*100;
        });

    }, false);

    // Return public methods, accessible through $scope.conway
    return {
      run: run,
      pause: pause,
      nextStep: nextStep,
      reset: reset,
      randomize: randomize,
      initBoard: initBoard,
      speedUp: speedUp,
      slowDown: slowDown
    };
})();
  
  // On page load, initialize the board
  $scope.conway.initBoard();
}])