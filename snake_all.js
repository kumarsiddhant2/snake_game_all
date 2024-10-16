// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

// Set the canvas size based on the device screen
canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth - 20; // Leave a margin for mobile
canvas.height = window.innerHeight > 600 ? 600 : window.innerHeight - 100; // Leave space on mobile for controls

// Define the unit size
const box = 20;

// Create the snake
let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box
};

// Create the food
let food = generateFood();

// Define the initial score
let score = 0;
let maxscore = 0;

// Control the snake direction for desktop (keyboard) and mobile (touch)
let d;
document.addEventListener("keydown", direction);
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) { // Detect horizontal swipe
        if (xDiff > 0 && d !== "RIGHT") {
            d = "LEFT"; // Left swipe
        } else if (d !== "LEFT") {
            d = "RIGHT"; // Right swipe
        }
    } else { // Detect vertical swipe
        if (yDiff > 0 && d !== "DOWN") {
            d = "UP"; // Up swipe
        } else if (d !== "UP") {
            d = "DOWN"; // Down swipe
        }
    }

    // Reset values
    xDown = null;
    yDown = null;
}

// Key direction control (desktop)
function direction(event) {
    let key = event.keyCode;
    if (key == 37 && d != "RIGHT") {
        d = "LEFT";
    } else if (key == 38 && d != "DOWN") {
        d = "UP";
    } else if (key == 39 && d != "LEFT") {
        d = "RIGHT";
    } else if (key == 40 && d != "UP") {
        d = "DOWN";
    }
}

// Check if snake collides with itself or walls
function collision(newHead, snake) {
    for (let i = 0; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            return true;
        }
    }
    if (newHead.x < 0 || newHead.y < 0 || newHead.x >= canvas.width || newHead.y >= canvas.height) {
        return true;
    }
    return false;
}

// Generate food in a valid position
function generateFood() {
    const maxX = Math.floor(canvas.width / box);
    const maxY = Math.floor(canvas.height / box);

    let validPosition = false;
    let newFood;

    while (!validPosition) {
        newFood = {
            x: Math.floor(Math.random() * maxX) * box,
            y: Math.floor(Math.random() * maxY) * box
        };
        validPosition = !snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }

    return newFood;
}

function showCongratulationsMessage(maxscore) {
    const newTab = window.open("", "Congratulations", "width=300,height=100");
    newTab.document.write("<p style='font-size:20px;text-align:center;'>Congratulations! Your max score = " + maxscore + "</p>");
    newTab.document.close(); // Ensure the tab is fully loaded
}

// Draw the game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Set font size based on canvas width
    const fontSize = canvas.width < 500 ? 15 : 20;
    ctx.font = `${fontSize}px Arial`;

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw the food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Move the snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;

    // Check if snake eats food
    if (snakeX === food.x && snakeY === food.y) {
        eatSound.play();
        score++;
        food = generateFood();
    } else {
        snake.pop(); // Remove the tail
    }

    // Add new head
    let newHead = {
        x: snakeX,
        y: snakeY
    };

function saveScore(score) {
    // Get the leaderboard array from localStorage (or initialize an empty one if not available)
    let scores = JSON.parse(sessionStorage.getItem("leaderboard")) || [];
    
    // Add the current score to the leaderboard
    scores.push(score);

    // Sort the scores in descending order
    scores.sort((a, b) => b - a);

    // Optionally limit the leaderboard to the top 5 scores
    scores = scores.slice(0, 5);

    // Save the updated leaderboard back to localStorage
    sessionStorage.setItem("leaderboard", JSON.stringify(scores));
}

function updateLeaderboard() {
    // Get the leaderboard array from localStorage (or initialize an empty one if not available)
    let scores = JSON.parse(sessionStorage.getItem("leaderboard")) || [];
    let leaderboardList = document.getElementById("leaderboard-list");
    
    // Clear the previous leaderboard display
    leaderboardList.innerHTML = "";

    // Display each score in the leaderboard
    scores.forEach((score, index) => {
        let li = document.createElement("li");
        li.textContent = (index + 1) + ". " + score;
        leaderboardList.appendChild(li);
    });
}
    
    if (collision(newHead, snake)) {
        gameOverSound.play(); // Play game over sound
        clearInterval(game);
        // Save the score in the leaderboard when the game ends
        saveScore(score);
        // If current score exceeds the maxscore, show congratulations
        if (score > maxscore) {
            maxscore = score;
            showCongratulationsMessage(maxscore); // Show the message after the game ends
        }
        updateLeaderboard();
    } else {
        snake.unshift(newHead); // Add new head to the snake
    }

    // Draw the score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, box, box);
    ctx.fillText("Max Score: " + maxscore, box, box * 2);
}

// Call draw function every 100 ms
let game = setInterval(draw, 100);

// Function to restart the game
function restartGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    food = generateFood(); // Generate new food immediately
    score = 0;
    d = ""; // Reset direction
    clearInterval(game);
    game = setInterval(draw, 100);
}

// Add event listener for restarting
document.addEventListener("keydown", function(event) {
    if (event.keyCode === 82) { // R key
        restartGame();
    }
});

window.onload = function() {
    sessionStorage.clear();
    updateLeaderboard();
};
