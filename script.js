var canvas = document.getElementById("canva");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height/2;
var radius = 10;
var dx = 2;
var dy = 2;
var color = "red";
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

var wynik = 0;
var timer = 50
var czas = timer;

var point = [20,15,7];


function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  }
  else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
  else if (e.key === "Up" || e.key === "ArrowUp") {
    upPressed = true;
  }
  else if (e.key === "Down" || e.key === "ArrowDown") {
    downPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  }
  else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
  else if (e.key === "Up" || e.key === "ArrowUp") {
    upPressed = false;
  }
  else if (e.key === "Down" || e.key === "ArrowDown") {
    downPressed = false;
  }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}
function drawPoint() {
    ctx.beginPath();
    ctx.arc(point[0], point[1], point[2], 0, Math.PI*2);
    ctx.fillStyle = "gold";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPoint();
    Movement();
    drawScore();
    drawTime();
    CollisionDetect();
}
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText(`Wynik: ${wynik}`, 8, 20);
}
function drawTime() {
  czas -= 0.1;

  ctx.font = "16px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText(`Czas: ${(czas/10).toFixed(2)}`, 8, 50);
  if (czas <= 0) {
    GameOver();
  }
}

function GameOver() {
clearInterval(interval);
alert("di ent");
location.reload();
}
function Movement() {
    //Movement
    if(rightPressed) {
        x += dx;
    }
    if(leftPressed) {
        x -= dx;
    }
    if(upPressed) {
        y -= dy;
    }
    if(downPressed) {
        y += dy;
    }
    //Walls
    if(x + radius < 0) {
        x = 0;
    }
    else if(x - radius > canvas.width) {
        x = canvas.width;
    }
    if(y + radius < 0) {
        y = 0;
    }
    else if(y - radius > canvas.height) {
        y = canvas.height;
    }
}

function CollisionDetect() {
    if(x > point[0] && x < point[0] + point[2] && y > point[1] && y < point[1] + point[2]) {
        wynik += 1;
        czas = timer;
        point[0] = GetRandom(canvas.width - 10);
        point[1] = GetRandom(canvas.height - 10);
    }
}

function GetRandom(max) {
    return Math.random() * (max - 10) + 10;
}

document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keydown", keyDownHandler, false);

const interval = setInterval(draw, 10);
point[0] = GetRandom(canvas.width - 10);
point[1] = GetRandom(canvas.height - 10);
