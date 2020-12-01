"use strict";

// Define game piece class
class Tetromino {
  constructor(one, two, three, four, colour, rotationArr) {
    this.mapping = [one, two, three, four]; // Where on the board the piece renders

    this.colour = colour;
    this.status = "active";
    this.rotationArr = rotationArr; // Defines the rotation matrix for each piece

    this.rotationIndex = 0; // Initialises the index for the above matrix

    this.nextRotation = this.rotationArr[this.rotationIndex]; // Used to access the next rotation matrix
  } // Render the game piece on the board


  render() {
    this.mapping.forEach(squareValue => {
      gameBoard.hook.childNodes[squareValue].style.backgroundColor = this.colour;
      gameBoard.hook.childNodes[squareValue].classList.add("active");
    });
  } // Allow the piece to fall down one row, unless it's status becomes fixed


  pieceFall() {
    if (this.pieceToFixed() === true) {
      gameBoard.checkLose();
      this.status = "fixed";
      this.mapping.forEach(squareValue => {
        gameBoard.hook.childNodes[squareValue].classList.remove("active");
        gameBoard.hook.childNodes[squareValue].classList.add("fixed");
      });
      gameBoard.checkRow();
      gameBoard.activePiece = newTetromino(Math.floor(Math.random() * 7));
      gameBoard.activePiece.render();
    }

    if (this.status === "active") {
      this.mapping = this.mapping.map(squareValue => {
        gameBoard.hook.childNodes[squareValue].style.backgroundColor = "#071C1F";
        gameBoard.hook.childNodes[squareValue].classList.remove("active");
        return squareValue += 10;
      });
      this.render();
    }
  } // Move piece left and right within bounds of the game area


  pieceLeft() {
    const nodes = Array.from(gameBoard.hook.childNodes);
    if (this.mapping.some(squareValue => nodes[squareValue - 1].classList.contains("fixed"))) return;
    if (this.mapping.some(squareValue => squareValue % 10 === 0)) return;else if (this.status === "active") {
      this.mapping = this.mapping.map(squareValue => {
        gameBoard.hook.childNodes[squareValue].style.backgroundColor = "#071C1F";
        gameBoard.hook.childNodes[squareValue].classList.remove("active");
        return squareValue -= 1;
      });
      this.render();
    }
  }

  pieceRight() {
    const nodes = Array.from(gameBoard.hook.childNodes);
    if (this.mapping.some(squareValue => nodes[squareValue + 1].classList.contains("fixed"))) return;
    if (this.mapping.some(squareValue => squareValue % 10 === 9)) return;else if (this.status === "active") {
      this.mapping = this.mapping.map(squareValue => {
        gameBoard.hook.childNodes[squareValue].style.backgroundColor = "#071C1F";
        gameBoard.hook.childNodes[squareValue].classList.remove("active");
        return squareValue += 1;
      });
      this.render();
    }
  } // Rotate the piece according to the matrix rotation values passed in


  pieceRotate() {
    if (this.status === "active") {
      this.mapping = this.mapping.map((squareValue, index) => {
        gameBoard.hook.childNodes[squareValue].style.backgroundColor = "#071C1F";
        gameBoard.hook.childNodes[squareValue].classList.remove("active");
        return squareValue += this.nextRotation[index];
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


  pieceToFixed() {
    if (this.mapping.some(squareValue => squareValue >= 210) || this.mapping.some(squareValue => gameBoard.hook.childNodes[squareValue + 10].classList.contains("fixed"))) {
      return true;
    }

    ;
    return false;
  }

}

const newTetromino = num => {
  if (num === 0) return new Tetromino(4, 5, 6, 7, "#EA3546", [[-8, 11, 0, 19], [8, -11, -0, -19], [-8, 11, 0, 19], [8, -11, -0, -19]]);
  if (num === 1) return new Tetromino(5, 6, 15, 16, "#F9C80E", [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
  if (num === 2) return new Tetromino(4, 5, 6, 16, "#43BCCD", [[-9, 0, 9, -2], [21, 10, -1, -10], [-1, -10, -19, -8], [-11, 0, 11, 20]]);
  if (num === 3) return new Tetromino(6, 5, 4, 14, "#F86624", [[9, 0, -9, -20], [-1, 10, 21, 12], [-19, -10, -1, 10], [11, 0, -11, -2]]);
  if (num === 4) return new Tetromino(14, 15, 5, 6, "#CC5893", [[-20, -11, 0, 9], [20, 11, 0, -9], [-20, -11, 0, 9], [20, 11, 0, -9]]);
  if (num === 5) return new Tetromino(4, 5, 15, 16, "#2BAB55", [[-8, 1, -10, -1], [8, -1, 10, 1], [-8, 1, -10, -1], [8, -1, 10, 1]]);
  if (num === 6) return new Tetromino(15, 4, 5, 6, "#662E9B", [[-1, 1, 10, 19], [1, 21, 10, -1], [1, -1, -10, -19], [-1, -21, -10, 1]]);
};

class GameBoard {
  constructor(activePiece) {
    this.activePiece = activePiece;
    this.hook = document.querySelector(".game-board");
    this.interval = 600;
  }

  createDivs() {
    for (let i = 1; i <= 200; i++) {
      let div = document.createElement("div");
      this.hook.prepend(div);
    }

    for (let i = 1; i <= 20; i++) {
      let div = document.createElement("div");
      div.style.display = "none";
      this.hook.prepend(div);
    }
  }

  changeInterval() {
    this.interval *= 0.8;
    clearInterval(this.intervalMethod);
    this.intervalMethod = setInterval(() => this.activePiece.pieceFall(), this.interval);
  }

  startGame() {
    this.activePiece.render();
    this.intervalMethod = setInterval(() => this.activePiece.pieceFall(), this.interval);
    this.speedChanger = setInterval(() => this.changeInterval(), 10000);
  }

  checkRow() {
    const nodes = Array.from(this.hook.childNodes);
    const rows = [];

    for (let i = 20; i < 220; i += 10) {
      let chunk = nodes.slice(i, i + 10);
      rows.push(chunk);
    }

    ;
    rows.forEach((row, index) => {
      if (row.every(squareValue => squareValue.classList.contains("fixed"))) {
        nodes.splice((index + 2) * 10, 10);

        for (let i = 1; i <= 10; i++) {
          let div = document.createElement("div");
          div.style.display = "block";
          nodes.splice(20, 0, div);
        }

        this.hook.innerHTML = "";
        nodes.forEach(node => {
          this.hook.appendChild(node);
        });
      }
    });
  }

  checkLose() {
    const nodes = Array.from(this.hook.childNodes);

    for (let i = 0; i < 20; i++) {
      if (nodes[i].classList.contains("fixed")) {
        alert("You lose!");
        return this.reset();
      }
    }

    ;
  }

  reset() {
    document.querySelector("audio").pause();
    document.querySelector("audio").currentTime = 0;
    clearInterval(this.intervalMethod);
    clearInterval(this.speedChanger);
    document.querySelector(".reset").style.display = "none";
    const welcomeScreen = "\n                            <article class=\"start\">\n                                <h1>Tetris</h1>\n                                <button class=\"start__button\">Start new game</button>\n                            </article>";
    gameBoard.hook.innerHTML = welcomeScreen;
    this.activePiece = newTetromino(Math.floor(Math.random() * 7));
    this.interval = 600;
    document.querySelector("article button").addEventListener("click", () => {
      document.querySelector("article").style.display = "none";
      this.createDivs();
      this.startGame();
      document.querySelector(".reset").style.display = "inline";
      document.querySelector("audio").play();
    });
  }

}

const gameBoard = new GameBoard(newTetromino(Math.floor(Math.random() * 7)));
document.querySelector(".start__button").addEventListener("click", () => {
  document.querySelector("article").style.display = "none";
  gameBoard.createDivs();
  gameBoard.startGame();
  document.querySelector(".reset").style.display = "inline";
  document.querySelector("audio").play();
});
document.querySelector(".reset").addEventListener("click", e => {
  gameBoard.reset();
  e.target.style.display = "none";
});
document.addEventListener("keydown", e => {
  if (e.key === "ArrowDown") gameBoard.activePiece.pieceFall();
  if (e.key === "ArrowUp") gameBoard.activePiece.pieceRotate();
  if (e.key === "ArrowLeft") gameBoard.activePiece.pieceLeft();
  if (e.key === "ArrowRight") gameBoard.activePiece.pieceRight();
});
document.querySelectorAll(".direction").forEach(button => button.addEventListener("click", e => {
  if (e.target.classList.contains("down__button")) gameBoard.activePiece.pieceFall();
  if (e.target.classList.contains("up__button")) gameBoard.activePiece.pieceRotate();
  if (e.target.classList.contains("left__button")) gameBoard.activePiece.pieceLeft();
  if (e.target.classList.contains("right__button")) gameBoard.activePiece.pieceRight();
}));