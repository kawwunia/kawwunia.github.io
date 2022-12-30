var canvas = document.getElementById("canva");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height/2;
var ballRadius = 10;
var dx = 2;
var dy = 2;
var color = "red";
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var text_color = "#000";

//Czas
var wynik = 0;
var timer = 50; //def 50
var czas = timer;
var czas_powerup = 0;
var def_roznicaCzasu = 0.1;
var spow_roznicaCzasu = 0.05;

var point = [20,15,7];
var powerup = {x:0,y:0,radius:7,color:"blue",type:0,active:false};
const bttn_left = document.getElementById("b_l");
const bttn_up = document.getElementById("b_u");
const bttn_down = document.getElementById("b_d");
const bttn_right = document.getElementById("b_r");


function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.keyCode == 68) {
    rightPressed = true;
  }
  else if (e.key === "Left" || e.key === "ArrowLeft" || e.keyCode == 65) {
    leftPressed = true;
  }
  else if (e.key === "Up" || e.key === "ArrowUp" || e.keyCode == 87) {
    upPressed = true;
  }
  else if (e.key === "Down" || e.key === "ArrowDown" || e.keyCode == 83) {
    downPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.keyCode == 68) {
    rightPressed = false;
  }
  else if (e.key === "Left" || e.key === "ArrowLeft" || e.keyCode == 65) {
    leftPressed = false;
  }
  else if (e.key === "Up" || e.key === "ArrowUp" || e.keyCode == 87) {
    upPressed = false;
  }
  else if (e.key === "Down" || e.key === "ArrowDown" || e.keyCode == 83) {
    downPressed = false;
  }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
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
    drawPowerUp();
    CollisionDetect();
}
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText(`Wynik: ${wynik}`, 8, 20);
}
function drawTime() {
  if(czas_powerup <= 0) {
  czas -= def_roznicaCzasu;
  text_color = "#000"
  }
  else {
    czas -= spow_roznicaCzasu;
    text_color = "blue";
  }
czas_powerup -= 0.1;
  ctx.font = "16px Arial";
  ctx.fillStyle = text_color;
  ctx.fillText(`Czas: ${(czas/10).toFixed(2)}`, 8, 50);
  if (czas <= 0) {
    GameOver();
  }
}

function GameOver() {
clearInterval(interval);
if (localStorage.getItem("highscore") < wynik) {
  localStorage.setItem("highscore", wynik);
}
const alertText = "Koniec! \nWynik: " + wynik + "\nNajlepszy wynik: " + localStorage.getItem("highscore");
alert(alertText);
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
    if(x + ballRadius < 0) {
        x = 0;
    }
    else if(x - ballRadius > canvas.width) {
        x = canvas.width;
    }
    if(y + ballRadius < 0) {
        y = 0;
    }
    else if(y - ballRadius > canvas.height) {
        y = canvas.height;
    }
//przycisk dol
bttn_down.onpointerdown = function() {
  downPressed = true;
}
bttn_down.onpointerup = function() {
  downPressed = false;
}
//przycisk gora
bttn_up.onpointerdown = function() {
  upPressed = true;
}
bttn_up.onpointerup = function() {
  upPressed = false;
}
//przycisk lewo
bttn_left.onpointerdown = function() {
  leftPressed = true;
}
bttn_left.onpointerup = function() {
  leftPressed = false;
}
//przycisk prawo
bttn_right.onpointerdown = function() {
  rightPressed = true;
}
bttn_right.onpointerup = function() {
  rightPressed = false;
}

}

function CollisionDetect() {
  //Collision with point
    if((x >= point[0] && x <= point[0] + point[2] && y >= point[1] && y <= point[1] + point[2]) || (x <= point[0] && x >= point[0] - point[2] && y <= point[1] && y >= point[1] - point[2])) {
        wynik += 1;
        czas = timer;
        point[0] = GetRandom(canvas.width - 10);
        point[1] = GetRandom(canvas.height - 10);
        if (powerup.active == false) {
        SpawnPowerUp();
        }
    }
  //Collision with PowerUp
  if(((x >= powerup.x && x <= powerup.x + powerup.radius && y >= powerup.y && y <= powerup.y + powerup.radius) || (x <= powerup.x && x >= powerup.x - powerup.radius && y <= powerup.y && y >= powerup.y - powerup.radius)) && powerup.active == true) {
powerup.active = false;
czas_powerup = 50;
}
}

function SpawnPowerUp() {

if((Math.round(GetRandom(100)) % 2 == 0)) {
  powerup.active = true;
  powerup.x = GetRandom(canvas.width - 10);
  powerup.y = GetRandom(canvas.height - 10);
}

}

function drawPowerUp() {
  ctx.beginPath();
  if(powerup.active == true) {
  ctx.arc(powerup.x, powerup.y, powerup.radius, 0, Math.PI*2);
  ctx.fillStyle = powerup.color;
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.stroke();
}
  ctx.closePath();
}

function GetRandom(max) {
    return Math.random() * (max - 10) + 10;
}

document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keydown", keyDownHandler, false);

const interval = setInterval(draw, 10);
point[0] = GetRandom(canvas.width - 10);
point[1] = GetRandom(canvas.height - 10);
