const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

let leftPaddleSpeed = 0;
let rightPaddleSpeed = 0;
const paddleSpeed = 4;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    rightPaddleSpeed = -paddleSpeed;
  } else if (e.key === "ArrowDown") {
    rightPaddleSpeed = paddleSpeed;
  } else if (e.key === "w") {
    leftPaddleSpeed = -paddleSpeed;
  } else if (e.key === "s") {
    leftPaddleSpeed = paddleSpeed;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    rightPaddleSpeed = 0;
  } else if (e.key === "w" || e.key === "s") {
    leftPaddleSpeed = 0;
  }
});

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
  ctx.fillRect(
    canvas.width - paddleWidth,
    rightPaddleY,
    paddleWidth,
    paddleHeight
  );
  ctx.fillRect(ballX - ballSize / 2, ballY - ballSize / 2, ballSize, ballSize);
}

function movePaddles() {
  if (isPaused) return; // Add this line
  leftPaddleY += leftPaddleSpeed;
  rightPaddleY += rightPaddleSpeed;

  if (leftPaddleY < 0) {
    leftPaddleY = 0;
  } else if (leftPaddleY > canvas.height - paddleHeight) {
    leftPaddleY = canvas.height - paddleHeight;
  }

  if (rightPaddleY < 0) {
    rightPaddleY = 0;
  } else if (rightPaddleY > canvas.height - paddleHeight) {
    rightPaddleY = canvas.height - paddleHeight;
  }
}

let gamePaused = false;

// Add these lines after the gamePaused variable
let leftScore = 0;
let rightScore = 0;

// Replace the existing moveBall function with the following updated version
function moveBall() {
  if (gamePaused || isPaused) return;

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY >= canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  if (
    (ballX <= paddleWidth &&
      ballY > leftPaddleY &&
      ballY < leftPaddleY + paddleHeight) ||
    (ballX >= canvas.width - paddleWidth * 2 &&
      ballY > rightPaddleY &&
      ballY < rightPaddleY + paddleHeight)
  ) {
    ballSpeedX = -ballSpeedX;
  }

  if (ballX <= 0 || ballX >= canvas.width) {
    const winnerElement = document.getElementById("winner");
    const leftScoreElement = document.getElementById("leftScore");
    const rightScoreElement = document.getElementById("rightScore");
    if (ballX <= 0) {
      rightScore++;
      winnerElement.textContent = "Right Player Wins!";
      rightScoreElement.textContent = rightScore;
    } else {
      leftScore++;
      winnerElement.textContent = "Left Player Wins!";
      leftScoreElement.textContent = leftScore;
    }
    gamePaused = true;
    setTimeout(() => {
      winnerElement.textContent = "";
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      gamePaused = false;
    }, 3000);
  }
}

// Add a new variable after the existing variables
let isPaused = false;

// Add this function to toggle the pause state
function togglePause() {
  isPaused = !isPaused;
  const pauseIcon = document.getElementById("pauseIcon");
  const playIcon = document.getElementById("playIcon");
  if (isPaused) {
    pauseIcon.style.display = "none";
    playIcon.style.display = "inline";
  } else {
    pauseIcon.style.display = "inline";
    playIcon.style.display = "none";
  }
}

// Add event listeners for the pause button and space bar
document.getElementById("pauseButton").addEventListener("click", togglePause);
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    togglePause();
  }
});

function gameLoop() {
  draw();
  movePaddles();
  moveBall();
  requestAnimationFrame(gameLoop);
}

gameLoop();
