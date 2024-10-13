// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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

// Rest of the game logic remains the same...
