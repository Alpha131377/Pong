const PADDLE_SPEED = 400;
let canvas = document.getElementsByTagName("canvas")[0];
let context = canvas.getContext("2d");

// Make the canvas able to recieve input
canvas.tabIndex = 1;
canvas.focus();
// Create the canvas constants and set the dimensions
const CANVAS_HEIGHT = 720;
const CANVAS_WIDTH = 1080;
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;

// Create the paddle constants
const PADDLE_COLOUR = "white"
const PADDLE_WIDTH = 30;
const PADDLE_HEIGHT = 175;

// Store paddle positions
let player1Y = 0;
let player2Y = CANVAS_HEIGHT - PADDLE_HEIGHT;

let player1Score = 0;
let player2Score = 0;

// Ball variables
const BALL_SIZE = 20;
let ballY = CANVAS_HEIGHT / 2 - BALL_SIZE / 2
let ballX = CANVAS_WIDTH / 2 - BALL_SIZE / 2

let ballXVelocity = 300;
let ballYVelocity = 150;

// Manage the serving state
let serving = 1;
let freezeBall = true;

context.fillStyle = PADDLE_COLOUR;

const keys = {};

canvas.addEventListener('keydown', handleKeyPressDown);
canvas.addEventListener('keyup', handleKeyPressUp);

// Draw the left paddle
context.fillRect(0, 0, PADDLE_WIDTH, PADDLE_HEIGHT);

// Draw the right paddle
context.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, CANVAS_HEIGHT - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);

function handleKeyPressDown(event) {
    keys[event.key] = true;
}
function handleKeyPressUp(event) {
    keys[event.key] = false;
}

let lastTime = 0
// Function called every frame
function GameLoop(currentTime = 0) {
    // Divide by 1000 to go from ms to s
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Update logic
    update(deltaTime);
    render();

    requestAnimationFrame(GameLoop);
}

// Update the game logic.
function update(dt) {// Player 1 movement.
    handleMovement(dt);
    handleBallLogic(dt);

    if(didPlayer1Score()){
        serving = 2;
        resetBall();
        player1Score += 1;
    }
    else if(didPlayer2Score()){
        serving = 1;
        resetBall();
        player2Score += 1;
    }

    if(keys[" "] && freezeBall)
    serve();

}

function handleMovement(dt) {
    if (keys.w) {

        // Subtract paddle speed from current Y scaled by deltaTime.
        player1Y -= PADDLE_SPEED * dt;
        if (player1Y < 0) {
            player1Y = 0;
        }
    }
    else if (keys.s) {
        // Add paddle speed to current Y scaled by deltaTime.
        player1Y += PADDLE_SPEED * dt;
        if (player1Y > CANVAS_HEIGHT - PADDLE_HEIGHT) {
            player1Y = CANVAS_HEIGHT - PADDLE_HEIGHT;
        }
    }

    // Player 2 movement.
    if (keys.ArrowUp) {
        // Subtract paddle speed from current Y scaled by deltaTime.
        player2Y -= PADDLE_SPEED * dt;
        if (player2Y < 0) {
            player2Y = 0;
        }
    }
    else if (keys.ArrowDown) {
        // Add paddle speed to current Y scaled by deltaTime.
        player2Y += PADDLE_SPEED * dt;
        if (player2Y > CANVAS_HEIGHT - PADDLE_HEIGHT) {
            player2Y = CANVAS_HEIGHT - PADDLE_HEIGHT;
        }
    }
}

// Display the game logic
// Display the game logic
function render()
{
    // Clear the screen
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH);

    // Draw the left paddle
    context.fillRect(0, player1Y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw the right paddle
    context.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, player2Y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw the ball
    context.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

    context.font = "48px Arial"
    // Player 1 score
    context.fillText(player1Score, CANVAS_WIDTH / 4, 50);

    // Player 2 score
    context.fillText(player2Score, CANVAS_WIDTH *3 / 4, 50);
}

function handleBallLogic(dt){
    
    if(freezeBall)
    return;
     
    if(ballCollidedWithAPaddle()){
        ballXVelocity *= -1;
    
        if (ballXVelocity > 0)
            ballXVelocity += 30;
        else
            ballXVelocity -= 30;
    }

    ballX += ballXVelocity * dt;
    ballY += ballYVelocity * dt;

    // Check if ball hit the top
if (ballY < 0){
    ballY = 0;
    ballYVelocity *= -1;
}
// Check if ball hit the bottom
else if (ballY > CANVAS_HEIGHT - BALL_SIZE){
    ballY = CANVAS_HEIGHT - BALL_SIZE;
    ballYVelocity *= -1;
}

}

function ballCollidedWithAPaddle(){
    return didCollide(ballX, ballY, BALL_SIZE, BALL_SIZE, 0, player1Y, PADDLE_WIDTH, PADDLE_HEIGHT) 
           || didCollide(ballX, ballY, BALL_SIZE, BALL_SIZE, CANVAS_WIDTH - PADDLE_WIDTH, player2Y, PADDLE_WIDTH, PADDLE_HEIGHT) 
}

function didCollide(x1, y1, width1, height1, x2, y2, width2, height2){
    return x1 < x2 + width2 &&
           x1 + width1 > x2 &&
           y1 < y2 + height2 &&
           y1 + height1 > y2
}


function didPlayer1Score(){
    // Return 1 if player 1 scored
    return ballX > CANVAS_WIDTH;
}

function didPlayer2Score(){
    // Return 2 if player 2 scored
    return ballX < -BALL_SIZE;
}

function resetBall(){
    freezeBall = true;
    ballX = CANVAS_WIDTH / 2 - BALL_SIZE / 2;
    ballY = CANVAS_HEIGHT /2;
}

const STARTING_X_VELOCITY = 300;
function serve(){
    freezeBall = false;
    if(serving == 1)
        ballXVelocity = STARTING_X_VELOCITY
    else
        ballXVelocity = -STARTING_X_VELOCITY
}


GameLoop();

