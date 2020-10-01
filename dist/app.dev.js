"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Define game piece class
var Tetromino =
/*#__PURE__*/
function () {
  function Tetromino(one, two, three, four, colour, rotationArr) {
    _classCallCheck(this, Tetromino);

    this.mapping = [one, two, three, four]; // Where on the board the piece renders

    this.colour = colour;
    this.status = "active";
    this.rotationArr = rotationArr; // Defines the rotation matrix for each piece

    this.rotationIndex = 0; // Initialises the index for the above matrix

    this.nextRotation = this.rotationArr[this.rotationIndex]; // Used to access the next rotation matrix
  } // Render the game piece on the board


  _createClass(Tetromino, [{
    key: "render",
    value: function render() {
      var _this = this;

      this.mapping.forEach(function (squareValue) {
        gameBoard.hook.childNodes[squareValue].style.backgroundColor = _this.colour;
        gameBoard.hook.childNodes[squareValue].classList.add("active");
      });
    } // Allow the piece to fall down one row, unless it's status becomes fixed

  }, {
    key: "pieceFall",
    value: function pieceFall() {
      if (this.pieceToFixed() === true) {
        gameBoard.checkLose();
        this.status = "fixed";
        this.mapping.forEach(function (squareValue) {
          gameBoard.hook.childNodes[squareValue].classList.remove("active");
          gameBoard.hook.childNodes[squareValue].classList.add("fixed");
        });
        gameBoard.checkRow();
        gameBoard.activePiece = newTetromino(Math.floor(Math.random() * 7));
        gameBoard.activePiece.render();
      }

      if (this.status === "active") {
        this.mapping = this.mapping.map(function (squareValue) {
          gameBoard.hook.childNodes[squareValue].style.backgroundColor = "black";
          gameBoard.hook.childNodes[squareValue].classList.remove("active");
          return squareValue += 10;
        });
        this.render();
      }
    } // Move piece left and right within bounds of the game area

  }, {
    key: "pieceLeft",
    value: function pieceLeft() {
      var nodes = Array.from(gameBoard.hook.childNodes);
      if (this.mapping.some(function (squareValue, index) {
        return nodes[squareValue - 1].classList.contains("fixed");
      })) return;
      if (this.mapping.some(function (squareValue) {
        return squareValue % 10 === 0;
      })) return;else if (this.status === "active") {
        this.mapping = this.mapping.map(function (squareValue) {
          gameBoard.hook.childNodes[squareValue].style.backgroundColor = "black";
          gameBoard.hook.childNodes[squareValue].classList.remove("active");
          return squareValue -= 1;
        });
        this.render();
      }
    }
  }, {
    key: "pieceRight",
    value: function pieceRight() {
      var nodes = Array.from(gameBoard.hook.childNodes);
      if (this.mapping.some(function (squareValue, index) {
        return nodes[squareValue + 1].classList.contains("fixed");
      })) return;
      if (this.mapping.some(function (squareValue) {
        return squareValue % 10 === 9;
      })) return;else if (this.status === "active") {
        this.mapping = this.mapping.map(function (squareValue) {
          gameBoard.hook.childNodes[squareValue].style.backgroundColor = "black";
          gameBoard.hook.childNodes[squareValue].classList.remove("active");
          return squareValue += 1;
        });
        this.render();
      }
    } // Rotate the piece according to the matrix rotation values passed in

  }, {
    key: "pieceRotate",
    value: function pieceRotate() {
      var _this2 = this;

      if (this.status === "active") {
        this.mapping = this.mapping.map(function (squareValue, index) {
          gameBoard.hook.childNodes[squareValue].style.backgroundColor = "black";
          gameBoard.hook.childNodes[squareValue].classList.remove("active");
          return squareValue += _this2.nextRotation[index];
        });
        this.render();
      }

      if (this.rotationIndex < 3) {
        this.rotationIndex++;
        this.nextRotation = this.rotationArr[this.rotationIndex];
      } else {
        this.rotationIndex = 0;
        this.nextRotation = this.rotationArr[this.rotationIndex];
      }
    } // Checks if the piece should become fixed

  }, {
    key: "pieceToFixed",
    value: function pieceToFixed() {
      if (this.mapping.some(function (squareValue) {
        return squareValue >= 210;
      }) || this.mapping.some(function (squareValue) {
        return gameBoard.hook.childNodes[squareValue + 10].classList.contains("fixed");
      })) {
        return true;
      }

      ;
      return false;
    }
  }]);

  return Tetromino;
}();

var newTetromino = function newTetromino(num) {
  if (num === 0) return new Tetromino(4, 5, 6, 7, "red", [[-8, 11, 0, 19], [8, -11, -0, -19], [-8, 11, 0, 19], [8, -11, -0, -19]]);
  if (num === 1) return new Tetromino(5, 6, 15, 16, "yellow", [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
  if (num === 2) return new Tetromino(4, 5, 6, 16, "blue", [[-9, 0, 9, -2], [21, 10, -1, -10], [-1, -10, -19, -8], [-11, 0, 11, 20]]);
  if (num === 3) return new Tetromino(6, 5, 4, 14, "orange", [[9, 0, -9, -20], [-1, 10, 21, 12], [-19, -10, -1, 10], [11, 0, -11, -2]]);
  if (num === 4) return new Tetromino(14, 15, 5, 6, "pink", [[-20, -11, 0, 9], [20, 11, 0, -9], [-20, -11, 0, 9], [20, 11, 0, -9]]);
  if (num === 5) return new Tetromino(4, 5, 15, 16, "green", [[-8, 1, -10, -1], [8, -1, 10, 1], [-8, 1, -10, -1], [8, -1, 10, 1]]);
  if (num === 6) return new Tetromino(15, 4, 5, 6, "gray", [[-1, 1, 10, 19], [1, 21, 10, -1], [1, -1, -10, -19], [-1, -21, -10, 1]]);
};

var GameBoard =
/*#__PURE__*/
function () {
  function GameBoard(activePiece) {
    _classCallCheck(this, GameBoard);

    this.activePiece = activePiece;
    this.hook = document.querySelector(".game-board");
    this.interval = 1000;
  }

  _createClass(GameBoard, [{
    key: "createDivs",
    value: function createDivs() {
      for (var i = 1; i <= 200; i++) {
        var div = document.createElement("div");
        this.hook.prepend(div);
      }

      for (var _i = 1; _i <= 20; _i++) {
        var _div = document.createElement("div");

        _div.style.display = "none";
        this.hook.prepend(_div);
      }
    }
  }, {
    key: "changeInterval",
    value: function changeInterval() {
      var _this3 = this;

      this.interval -= 100;
      clearInterval(this.intervalMethod);
      this.intervalMethod = setInterval(function () {
        return _this3.activePiece.pieceFall();
      }, this.interval);
    }
  }, {
    key: "startGame",
    value: function startGame() {
      var _this4 = this;

      this.activePiece.render();
      this.intervalMethod = setInterval(function () {
        return _this4.activePiece.pieceFall();
      }, this.interval);
      this.speedChanger = setInterval(function () {
        return _this4.changeInterval();
      }, 10000);
    }
  }, {
    key: "checkRow",
    value: function checkRow() {
      var _this5 = this;

      var nodes = Array.from(this.hook.childNodes);
      var rows = [];

      for (var i = 20; i < 220; i += 10) {
        var chunk = nodes.slice(i, i + 10);
        rows.push(chunk);
      }

      ;
      rows.forEach(function (row, index) {
        if (row.every(function (squareValue) {
          return squareValue.classList.contains("fixed");
        })) {
          nodes.splice((index + 2) * 10, 10);

          for (var _i2 = 1; _i2 <= 10; _i2++) {
            var div = document.createElement("div");
            div.style.display = "block";
            nodes.splice(20, 0, div);
          }

          _this5.hook.innerHTML = "";
          nodes.forEach(function (node) {
            _this5.hook.appendChild(node);
          });
        }
      });
    }
  }, {
    key: "checkLose",
    value: function checkLose() {
      var nodes = Array.from(this.hook.childNodes);

      for (var i = 0; i < 20; i++) {
        if (nodes[i].classList.contains("fixed")) {
          clearInterval(this.intervalMethod);
          clearInterval(this.speedChanger);
          alert("You lose!");
          return this.reset();
        }
      }

      ;
    }
  }, {
    key: "reset",
    value: function reset() {
      var _this6 = this;

      var welcomeScreen = "\n                            <article class=\"welcome-screen\">\n                                <h1>Tetris</h1>\n                                <button>Start new game</button>\n                            </article>";
      gameBoard.hook.innerHTML = welcomeScreen;
      this.activePiece = newTetromino(Math.floor(Math.random() * 7));
      this.interval = 1000;
      document.querySelector("article button").addEventListener("click", function () {
        document.querySelector("article").style.display = "none";

        _this6.createDivs();

        _this6.startGame();
      });
    }
  }]);

  return GameBoard;
}();

var gameBoard = new GameBoard(newTetromino(Math.floor(Math.random() * 7)));
document.querySelector("article button").addEventListener("click", function () {
  document.querySelector("article").style.display = "none";
  gameBoard.createDivs();
  gameBoard.startGame();
});
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowDown") gameBoard.activePiece.pieceFall();
  if (e.key === "ArrowUp") gameBoard.activePiece.pieceRotate();
  if (e.key === "ArrowLeft") gameBoard.activePiece.pieceLeft();
  if (e.key === "ArrowRight") gameBoard.activePiece.pieceRight();
});