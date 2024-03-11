
// Global Variables to Simulate State
let gameStatus = 'Press Start Button to begin';
let indicatorColor = 'red';
let startBtnPressed = false;
let gameStartCountdown = 3;
let round = 0;
let highestRound = 0;
let currentRound = 0;
let flashIntervalTime = 1000;
let displayRoundTime = 0;
let gameArray = [];
let buttonFlash = false;
let pressedButton = '';
let flashingButton = '';
let isButtonClickable = false;
let inputIndex = 0;
let inputArray = [];
let gameLoseCountdown = 5;
let isCountingDown = false;
let isCheaterOpen = false;

// Color Map
const colorMap = {
    1: 'Green',
    2: 'Red',
    3: 'Yellow',
    4: 'Blue'
};

// DOM Elements
const startButton = document.getElementById('startButton');
const highestRoundDisplay = document.getElementById('highestRound');
const currentRoundDisplay = document.getElementById('currentRound');
const indicator = document.getElementById('indicator');
const gameStatusDisplay = document.getElementById('gameStatus');
const gameStartCountdownDisplay = document.getElementById('gameStartCountdown');
const roundInfoDisplay = document.getElementById('roundInfo');
const gameLoseCountdownDisplay = document.getElementById('gameLoseCountdown');
const flashIntervalTimeDisplay = document.getElementById('flashIntervalTime');
const displayRoundTimeDisplay = document.getElementById('displayRoundTime');
const cheaterToggle = document.getElementById('toggleCheater');
const cheaterDisplay = document.getElementById('cheater');
const cheaterHint = document.getElementById('cheaterHint');
const gameArrayDisplay = document.getElementById('gameArrayDisplay');
const inputArrayDisplay = document.getElementById('inputArrayDisplay');

// Event Listeners and Functions
startButton.addEventListener('click', gameStart);

// Implement gameStart and other functions here...
// Note: The full implementation of these functions will require a significant amount of code
// to handle all game logic, UI updates, and event management as per your original React app.


// Part 1 - Start Game
function gameStart() {
    // Mimic setIsButtonClickable(false)
    isButtonClickable = false;
    updateButtonClickableState(); // You need to implement this function to disable/enable buttons

    // Mimic stopGameLoseCountdown()
    stopCountdown(); // Use the stopCountdown function from the previous conversion

    // Mimic setStartBtnPressed(true)
    startBtnPressed = true;
    // You might want to reflect this in the UI, for example by disabling the start button
    startButton.disabled = true;

    // Mimic setGameStartCountdown(3)
    gameStartCountdown = 3;
    // Update the UI accordingly
    gameStartCountdownDisplay.textContent = gameStartCountdown;

    // Mimic setCurrentRound(0) and setIndicatorColor('green')
    currentRound = 0;
    indicatorColor = 'green';
    indicator.style.backgroundColor = indicatorColor; // Assuming 'indicator' is the DOM element representing the indicator

    // Mimic setGameStatus('Waiting...')
    gameStatus = 'Waiting...';
    gameStatusDisplay.textContent = gameStatus; // Assuming 'gameStatusDisplay' is the DOM element for displaying the game status

    // Start the game start countdown
    let intervalId = setInterval(() => {
        gameStartCountdown -= 1;
        gameStartCountdownDisplay.textContent = gameStartCountdown;

        if (gameStartCountdown <= 0) {
            clearInterval(intervalId);
            gameStatus = 'Game Start';
            gameStatusDisplay.textContent = gameStatus;
        }
    }, 1000);

    // Delay the start of the first round
    setTimeout(() => {
        displayRound(); // You need to adapt the displayRound function to plain JS as well
    }, 4500);
}

// Make sure to bind the gameStart function to your start button
startButton.addEventListener('click', gameStart);


// Part 2 - Display  Round
function displayRound() {
    // Mimic setIsButtonClickable(false)
    isButtonClickable = false;
    updateButtonClickableState(); // Update the UI to reflect button clickable state

    // Mimic stopGameLoseCountdown()
    stopCountdown(); // Stop any existing countdown

    // Mimic setInputIndex(0) and setInputArray([])
    inputIndex = 0;
    inputArray = [];

    // Record the BEGIN Time in this Round
    const startTime = Date.now();

    // Generate a random number and add it to the gameArray
    const randomNumber = Math.floor(Math.random() * 4) + 1;
    gameArray.push(randomNumber);
    const newRound = gameArray.length;

    // Mimic setRound(newRound)
    round = newRound;
    roundInfoDisplay.textContent = `Game Round: ${round}`; // Update UI

    // Adjust flashIntervalTime based on the round number
    flashIntervalTime = 1000; // Default
    if (newRound >= 5 && newRound <= 8) {
        flashIntervalTime = 800;
    } else if (newRound >= 9 && newRound <= 12) {
        flashIntervalTime = 600;
    } else if (newRound >= 13) {
        flashIntervalTime = 400;
    }
    flashIntervalTimeDisplay.textContent = `Interval Time: ${flashIntervalTime}ms`;

    function flashButtonMovie(index) {
        if (index < newRound) {
            const color = colorMap[gameArray[index]];
            // Mimic setFlashingButton(colorMap[newArray[index]])
            flashingButton = color;
            // Update the UI to flash the button
            flashButton(color); // You need to implement this function to handle the actual button flash

            setTimeout(() => {
                // Mimic setFlashingButton('')
                flashingButton = '';
                // Update the UI to stop flashing the button
                stopFlashingButton(color); // Implement this function to stop the button flash

                // Go to next ButtonFlash with the flashIntervalTime
                setTimeout(() => flashButtonMovie(index + 1), flashIntervalTime);
            }, 200);
        }

        if (index === newRound - 1) {
            setTimeout(() => {
                const endTime = Date.now();
                // Calculate the `Elapsed Time` of this Round
                displayRoundTime = endTime - startTime + flashIntervalTime - 200;
                displayRoundTimeDisplay.textContent = `Display Round Time: ${displayRoundTime}ms`;

                // Begin a new countdown after a delay
                setTimeout(() => {
                    stopCountdown();
                    beginGameLoseCountdown(); // You need to implement this function
                }, 500);
            }, 200);
        }
    }

    // Begin at the First element in gameArray
    flashButtonMovie(0);

    // Enable clicking after the flashing sequence
    setTimeout(() => {
        isButtonClickable = true;
        updateButtonClickableState(); // Update the UI to reflect button clickable state
    }, 1000);
}

// Part 3 - Lose Game
function gameOver() {
    // Update the game status and indicator color
    gameStatus = 'Game Lose';
    gameStatusDisplay.textContent = gameStatus; // Update the DOM element for game status
    indicatorColor = 'red';
    indicator.style.backgroundColor = indicatorColor; // Update the DOM element for the indicator

    // Disable game buttons
    isButtonClickable = false;
    updateButtonClickableState(); // Update the UI to reflect button clickable state

    // Stop any game lose countdown
    stopCountdown();

    // Reset game data
    round = 0;
    gameArray = [];
    flashIntervalTime = 1000;
    displayRoundTime = 0;
    inputIndex = 0;
    inputArray = [];

    // Initialize the number of flashes
    let flashes = 10;

    function gameOverMovie() {
        // Toggle flash status
        buttonFlash = !buttonFlash;
        // Update the UI to reflect the flash; you need to implement this
        updateFlashUI(buttonFlash);

        flashes--;

        if (flashes > 0) {
            setTimeout(gameOverMovie, 200); // Schedule the next flash
        } else {
            startBtnPressed = false;
            startButton.disabled = false; // Re-enable the start button in the UI
            alert('Game Over'); // Show game over message
        }
    }

    // Start the flashing sequence
    gameOverMovie();

    // Update the highest round if the current round is a new record
    if (round - 1 > highestRound) {
        highestRound = round - 1;
        highestRoundDisplay.textContent = highestRound; // Update the DOM element for highest round
    }

    // Update the current round display
    currentRound = round - 1;
    currentRoundDisplay.textContent = currentRound; // Update the DOM element for current round
}

// Part 4 - Handle GameButton Clicking

function handleButtonClick(number) {
    // If buttons are not clickable, exit the function
    if (!isButtonClickable) return;

    // Make a flash effect when a game button is pressed
    flashButton(colorMap[number]); // You need to implement this to show a flash effect
    setTimeout(() => stopFlashingButton(colorMap[number]), 200); // And this to stop the flash effect

    // Reset and start a new game lose countdown
    stopCountdown();
    beginGameLoseCountdown();

    // Handle input when a button is clicked
    if (gameArray[inputIndex] === number) {
        // Input is correct, update inputArray and inputIndex
        inputArray.push(number);
        inputIndex++;

        // If all elements of gameArray are input correctly, start the next round after a delay
        if (inputIndex === round) {
            setTimeout(() => {
                displayRound();
            }, 1000);
        }
    } else {
        // Input is incorrect, invoke the gameOver function
        gameOver();
    }
}

// You need to add event listeners to your game buttons when initializing your game
// Assuming your buttons have class 'game-button' and a data attribute 'data-number'
document.querySelectorAll('.game-button').forEach(button => {
    button.addEventListener('click', () => {
        const number = parseInt(button.getAttribute('data-number'), 10);
        handleButtonClick(number);
    });
});

function beginGameLoseCountdown() {
    // Start a new game lose countdown
    isCountingDown = true;
    gameLoseCountdown = 5; // Reset the countdown
    gameLoseCountdownDisplay.textContent = gameLoseCountdown + ' seconds'; // Update the UI
    startCountdown(); // Use the startCountdown function from previous examples
}

// Part 5 - Control GameLose countdown
function beginGameLoseCountdown() {
    // Set isCountingDown to true to indicate the countdown is active
    isCountingDown = true;
    // Reset the game lose countdown to 5 seconds
    gameLoseCountdown = 5;
    // Update the UI to show the countdown
    gameLoseCountdownDisplay.textContent = gameLoseCountdown + ' seconds';

    // Clear any existing countdown interval to avoid multiple intervals running
    clearInterval(window.gameLoseIntervalId);

    // Start a new countdown interval
    window.gameLoseIntervalId = setInterval(() => {
        // Decrement the countdown each second
        gameLoseCountdown -= 1;
        // Update the UI to show the updated countdown
        gameLoseCountdownDisplay.textContent = gameLoseCountdown + ' seconds';

        // Check if the countdown has reached 0
        if (gameLoseCountdown <= 0) {
            // Stop the countdown interval
            clearInterval(window.gameLoseIntervalId);
            // Trigger the game over logic
            gameOver(); // Make sure the gameOver function is defined and accessible
        }
    }, 1000);
}

function stopGameLoseCountdown() {
    // Set isCountingDown to false to indicate the countdown is not active
    isCountingDown = false;
    // Reset the game lose countdown to 5 seconds
    gameLoseCountdown = 5;
    // Update the UI to show the reset countdown (or hide it, depending on your UI design)
    gameLoseCountdownDisplay.textContent = gameLoseCountdown + ' seconds';

    // Clear the countdown interval to stop it
    clearInterval(window.gameLoseIntervalId);
}

// Make sure to bind these functions to the appropriate events in your game logic

function toggleCheatingMachine() {
    // Toggle the isCheaterOpen flag
    isCheaterOpen = !isCheaterOpen;

    // Update the UI based on the isCheaterOpen flag
    updateCheaterUI(isCheaterOpen);
}

function updateCheaterUI(isOpen) {
    // Select the Cheating Machine container in your HTML
    const cheaterContainer = document.getElementById('cheaterContainer'); // Make sure this ID matches your HTML

    // If the Cheating Machine is open, display it; otherwise, hide it
    if (isOpen) {
        cheaterContainer.style.display = 'block';
    } else {
        cheaterContainer.style.display = 'none';
    }
}

// Make sure you have a button or some element to toggle the Cheating Machine
// For example, if you have a button with id 'toggleCheaterBtn':
const toggleCheaterBtn = document.getElementById('toggleCheaterBtn'); // Make sure this ID matches your HTML
toggleCheaterBtn.addEventListener('click', toggleCheatingMachine);

// UseEfect 2
function beginGameLoseCountdown() {
    isCountingDown = true;
    gameLoseCountdown = 5; // Reset the countdown
    gameLoseCountdownDisplay.textContent = gameLoseCountdown + ' seconds';

    clearInterval(window.gameLoseIntervalId); // Clear any existing interval

    window.gameLoseIntervalId = setInterval(() => {
        gameLoseCountdown -= 1;
        gameLoseCountdownDisplay.textContent = gameLoseCountdown + ' seconds';

        if (gameLoseCountdown <= 0) {
            clearInterval(window.gameLoseIntervalId); // Stop the countdown interval
            gameOver(); // Call the gameOver function when countdown reaches 0
        }
    }, 1000);
}

// UseEfect 1
function beginGameLoseCountdown() {
    // Clear any existing interval to prevent multiple intervals running simultaneously
    clearInterval(window.gameLoseIntervalId);

    // Check if the countdown is supposed to be running
    if (isCountingDown) {
        gameLoseCountdown = 5; // Reset the countdown
        gameLoseCountdownDisplay.textContent = gameLoseCountdown + ' seconds';

        // Start a new interval
        window.gameLoseIntervalId = setInterval(() => {
            gameLoseCountdown -= 1;
            gameLoseCountdownDisplay.textContent = gameLoseCountdown + ' seconds';

            // Check if the countdown has reached the last second
            if (gameLoseCountdown <= 1) {
                clearInterval(window.gameLoseIntervalId); // Clear the interval as we don't need it anymore
                gameOver(); // Call gameOver when countdown reaches 0
            }
        }, 1000);
    }
}

function stopGameLoseCountdown() {
    // Clear the interval when stopping the countdown, regardless of the countdown status
    clearInterval(window.gameLoseIntervalId);
    isCountingDown = false; // Update the countdown status
}