var canvas = document.getElementById("canva"); //get canvas as variable
var ctx = canvas.getContext("2d"); //set canvas
//Ball should be changed to object later $
var x = canvas.width/2; //ball's x
var y = canvas.height/2; //ball's y
var ballRadius = 10; //ball's radius
var dx = 2; //Movement speed x
var dy = 2; //Movement speed y
var color = "red"; //balls color
//Up
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
//text color
var text_color = "#000";

//Time and score
var wynik = 0; //score
var timer = 5000000; //def 50
var czas = timer; //set timer
var czas_powerup = 0; //powerup timer
var def_roznicaCzasu = 0.1; //default timer update
var spow_roznicaCzasu = 0.05; //powerup timer update

//powerup
var activePowerup = 0; //0 = slower time (blue timer), 1 = double the points (orange ball) 

var point = [20,15,7]; //point array
var powerup = {x:0,y:0,radius:7,color:"blue",type:0,active:false}; //powerup object
const bttn_left = document.getElementById("b_l"); //get html button left
const bttn_up = document.getElementById("b_u"); //get html button up
const bttn_down = document.getElementById("b_d"); //get html button down
const bttn_right = document.getElementById("b_r"); //get html button right


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
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = color; //set ball's color
    ctx.fill();
    ctx.closePath();
}
function drawPoint() { //draw Point 
    ctx.beginPath();
    ctx.arc(point[0], point[1], point[2], 0, Math.PI*2);
    ctx.fillStyle = "gold";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.closePath();
}

function draw() { //main Event (refresh time 10)
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear 
    drawBall();
    drawPoint();
    Movement();
    drawScore();
    drawTime();
    drawPowerUp();
    CollisionDetect();
}
function drawScore() { //draw Score as text
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText(`Wynik: ${wynik}`, 8, 20);
}
function drawTime() { //draw Timer (black = no active effects, blue = time is slower)
  //Powerup affects on time
  if(czas_powerup <= 0 && activePowerup == 0) { //add activePowerup $
  czas -= def_roznicaCzasu; //timer update if powerup is not active
  text_color = "#000" //change color to default (black)
  }
  else {
    czas -= spow_roznicaCzasu; //timer update if powerup is active
    text_color = "blue"; //change text color to blue if powerup is not active
  }
czas_powerup -= 0.1; //Update powerup time
  ctx.font = "16px Arial"; //set font and size
  ctx.fillStyle = text_color; //set color
  ctx.fillText(`Czas: ${(czas/10).toFixed(2)}`, 8, 50); //Set text
  if (czas <= 0) { //Game over event
    GameOver();
  }
}

function GameOver() {
clearInterval(interval); //stop the game
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
    //Border
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
    if((x >= point[0] && x <= point[0] + point[2] && y >= point[1] && y <= point[1] + point[2]) || (x <= point[0] && x >= point[0] - point[2] && y <= point[1] && y >= point[1] - point[2])) {
        wynik += 1; //Add point
        czas = timer; //set timer
        point[0] = GetRandom(canvas.width - 10); //set powerup location
        point[1] = GetRandom(canvas.height - 10);
        if (powerup.active == false) {
        SpawnPowerUp();
        }
    }
  //Collision with PowerUp
  if(((x >= powerup.x && x <= powerup.x + powerup.radius && y >= powerup.y && y <= powerup.y + powerup.radius) || (x <= powerup.x && x >= powerup.x - powerup.radius && y <= powerup.y && y >= powerup.y - powerup.radius)) && powerup.active == true) {
powerup.active = false;
czas_powerup = 50; //set powerup timer
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

//intervals and point location rng
const interval = setInterval(draw, 10);
point[0] = GetRandom(canvas.width - 10);
point[1] = GetRandom(canvas.height - 10);
