var canvas = document.getElementById("canva"); //get canvas as variable
var ctx = canvas.getContext("2d"); //set canvas
var ball = {x:(canvas.width/2),y:(canvas.height/2),radius:10,dx:2,dy:2,color:"red"};
//Up
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
//text color
var text_color = "#000";

//Time and score
var wynik = 0; //score
var timer = 50; //def 50
var time = timer; //set timer
var time_powerup = 0; //powerup timer
var def_timediff = 0.1; //default timer update
var slowed_timediff = 0.05; //powerup timer update

//powerup
var activePowerup = 0; //0 = slower time (blue timer), 1 = double the points (orange ball) 

var point = {x:20,y:15,radius:7,distance:100}; //point array: x,y, radius
var powerup = {x:0,y:0,radius:7,color:"blue",type:0,active:false}; //powerup object
const bttn_left = document.getElementById("b_l"); //get html button left
const bttn_up = document.getElementById("b_u"); //get html button up
const bttn_down = document.getElementById("b_d"); //get html button down
const bttn_right = document.getElementById("b_r"); //get html button right
var soundPoint = new Audio("mixkit-arcade-mechanical-bling-210.wav"); //Sound Effect


function keyDownHandler(e) { //Key Handlers (Down)
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

function keyUpHandler(e) { //Key Handlers (Up)
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

function drawBall() { //draw Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = ball.color; //set ball's color
    ctx.fill();
    ctx.closePath();
}
function drawPoint() { //draw Point 
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI*2);
    ctx.fillStyle = "gold";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.closePath();
}

function draw() { //main Event (using requestAnimationFrame)
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear 
    drawBall();
    drawPoint();
    Movement();
    drawScore();
    drawTime();
    drawPowerUp();
    CollisionDetect();
    if(time > 0) {
    requestAnimationFrame(draw);
    }
}
function drawScore() { //draw Score as text
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText(`Wynik: ${wynik}`, 8, 20);
}
function drawTime() { //draw Timer (black = no active effects, blue = time is slower)
  //Powerup affects on time
  if(time_powerup > 0 && activePowerup == 0 && powerup.type == 0) {

  time -= slowed_timediff; //timer update if powerup is active
  text_color = "blue"; //change text color to blue if powerup is not active
  }
  else {
    time -= def_timediff; //timer update if powerup is not active
    text_color = "#000" //change color to default (black)
  }
time_powerup -= 0.1; //Update powerup time
  ctx.font = "16px Arial"; //set font and size
  ctx.fillStyle = text_color; //set color
  ctx.fillText(`Czas: ${(time/10).toFixed(2)}`, 8, 50); //Set text
  if (time <= 0) { //Game over event
    GameOver();
  }
}

function GameOver() {
cancelAnimationFrame(animationId); //stop the game
if (localStorage.getItem("highscore") < wynik) { //update highscore
  localStorage.setItem("highscore", wynik);
}
const alertText = "Koniec! \nWynik: " + wynik + "\nNajlepszy wynik: " + localStorage.getItem("highscore"); //set alert text
alert(alertText); //alert
location.reload(); //reload the page
}
function Movement() {
    //Movement
    if(rightPressed) {
        ball.x += ball.dx;
    }
    if(leftPressed) {
        ball.x -= ball.dx;
    }
    if(upPressed) {
        ball.y -= ball.dy;
    }
    if(downPressed) {
        ball.y += ball.dy;
    }
    //Border
    if(ball.x + ball.radius < 0) {
        ball.x = 0;
    }
    else if(ball.x - ball.radius > canvas.width) {
        ball.x = canvas.width;
    }
    if(ball.y + ball.radius < 0) {
        ball.y = 0;
    }
    else if(ball.y - ball.radius > canvas.height) {
        ball.y = canvas.height;
    }
//button go down
bttn_down.onpointerdown = function() {
  downPressed = true;
}
bttn_down.onpointerup = function() {
  downPressed = false;
}
//button go up
bttn_up.onpointerdown = function() {
  upPressed = true;
}
bttn_up.onpointerup = function() {
  upPressed = false;
}
//button go left
bttn_left.onpointerdown = function() {
  leftPressed = true;
}
bttn_left.onpointerup = function() {
  leftPressed = false;
}
//button go right
bttn_right.onpointerdown = function() {
  rightPressed = true;
}
bttn_right.onpointerup = function() {
  rightPressed = false;
}

}

function CollisionDetect() {
  //Collision with point
  point.distance = ( Math.sqrt( ( Math.abs((point.x - ball.x)^2)) + Math.abs((point.y - ball.y)^2)));
  powerup.distance = ( Math.sqrt( ( Math.abs((powerup.x - ball.x)^2)) + Math.abs((powerup.y - ball.y)^2)));
    if(point.distance < 3.14) {
      wynik += 1; //Add point
        soundPoint.currentTime = 0;
        soundPoint.play();
        time = timer; //set timer
        point.x = GetRandom(canvas.width - 10); //set powerup location
        point.y = GetRandom(canvas.height - 10);
        point.distance = ( Math.sqrt( ( Math.abs((point.x - ball.x)^2)) + Math.abs((point.y - ball.y)^2)));
        if (powerup.active == false) {
        SpawnPowerUp();
        }
    }
  //Collision with PowerUp
  if(powerup.distance < 3.14 && powerup.active == true) {
powerup.active = false;
time_powerup = 50; //set powerup timer
activePowerup = powerup.type; //set powerup type
}
}

function SpawnPowerUp() { //spawn powerup

if((Math.round(GetRandom(100)) % 2 == 0)) { //Spawn if rng is odd or even
  powerup.active = true;
  powerup.x = GetRandom(canvas.width - 10);
  powerup.y = GetRandom(canvas.height - 10);
}

}

function drawPowerUp() { //draw power up
  ctx.beginPath();
  if(powerup.active == true) { //draw if powerup is active
  ctx.arc(powerup.x, powerup.y, powerup.radius, 0, Math.PI*2);
  ctx.fillStyle = powerup.color; //powerup color based on which powerup should be working (powerup.type))
  ctx.fill();
  ctx.strokeStyle = "#000"; //do not change 
  ctx.stroke();
}
  ctx.closePath();
}

function GetRandom(max) { //rng, not working properly
    return Math.random() * (max - 10) + 10;
}

//Event listeners for buttons
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keydown", keyDownHandler, false);

//reqAnimationFrame and point location rng
const animationId = requestAnimationFrame(draw);
point.x = GetRandom(canvas.width - 10);
point.y = GetRandom(canvas.height - 10);
