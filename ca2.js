 // Map: Color - Number
 const colorMap = {
    'Green': 1,
    'Red': 2,
    'Yellow': 3,
    'Blue': 4
};

document.addEventListener('DOMContentLoaded', function() {
    const controllerButtons = document.querySelectorAll('.Controller');
    const startButton = document.getElementById('startButton'); 
    
    var inputArray = []; 
    var gameArray = []; 
    const roundInfoDisplay = document.getElementById('roundInfo');
    const inputArrayDisplay = document.getElementById('inputArrayDisplay');
    const gameArrayDisplay = document.getElementById('gameArrayDisplay');

    const gameStatus = document.getElementById('gameStatus'); 

    var currentRound = 0;
    var currentScore = 0;
    var highestScore = 0;
    const currentScoreDisplay = document.getElementById('currentScore');
    const highestScoreDisplay = document.getElementById('highestScore');

    var intervalTime = 1000;
    var roundTime = 0;
    const flashIntervalTimeDisplay = document.getElementById('flashIntervalTime');
    const displayRoundTime = document.getElementById('displayRoundTime');
    
    // Disable all controllerButtons when page renders
    controllerButtons.forEach(button => {
        button.disabled = true;
    });


    // Part 1 - Game Start Movie
    startButton.addEventListener('click', function() {

        startButton.disabled = true;
        let countdown = 3; 
        gameStatus.textContent = 'Waiting...'; 
        indicator.style.backgroundColor = 'green'; 

        currentRound = 0;
        currentScore = 0;
        currentScoreDisplay.textContent = '00';

        let intervalId = setInterval(function() {
            const gameStartCountdown = document.getElementById('gameStartCountdown'); 
            gameStartCountdown.textContent = countdown; 

            if (countdown === 0) {
                clearInterval(intervalId); // Delete Interval when countdown to 0
                gameStartCountdown.textContent = ''; 
                gameStatus.textContent = 'Game Start'; 

                displayRound();
            }
            countdown--; 
        }, 1000); 
    });   

    
    // Part 2 - Display Round Movie
    function displayRound(){
        currentRound++;
        roundInfoDisplay.textContent = `Game Round: ${currentRound}`;

        // Disable all controllerButtons when movie ends.
        controllerButtons.forEach(button => {
            button.disabled = true;
        });
        stopGameLoseCountdown();

        // Update IntervalTime according to currentRound
        intervalTime = 1000; // Default Value
        if (currentRound >= 13) {
            intervalTime = 400;
        } else if (currentRound >= 9) {
            intervalTime = 600;
        } else if (currentRound >= 5) {
            intervalTime = 800;
        }
        flashIntervalTimeDisplay.textContent = `Interval Time: ${intervalTime}ms`;

        // The time when movie starts
        const startTime = Date.now();

        // Create random number 1-4 and put it in game ASrray
        const randomNumber = Math.floor(Math.random() * 4) + 1;
        gameArray.push(randomNumber);
        gameArrayDisplay.textContent = `[${gameArray.join(', ')}]`;

        // Flash all elements in gameArray
        gameArray.forEach((number, index) => {
            // Find relevant color according to that number
            const color = Object.keys(colorMap).find(key => colorMap[key] === number);
            // Set delay time according to the index of element in gameArray
            const delay = index * intervalTime; 

            setTimeout(() => {
                // .${color} -> the String value of `color`
                const button = document.querySelector(`.${color}`);
                if (button) {
                    // Flash the button - 0.2 sec Flash + 0.2 sec Remove
                    button.classList.add('Flash');
                    setTimeout(() => {
                        button.classList.remove('Flash');

                        // When it comes to the movie of Last ControllerButton
                        if (index === gameArray.length - 1) {
                            // Get the time when movie ends, and calculate the displayRoundTime.
                            const endTime = Date.now();
                            roundTime = endTime - startTime;
                            displayRoundTime.textContent = `Display Round Time: ${roundTime - 200 + intervalTime}ms`;

                            // Enable all controllerButtons when movie ends.
                            controllerButtons.forEach(button => {
                                button.disabled = false;
                            });

                            // 0.5 SEC after 'Round Display' Movie, begin a new GameLose Countdown
                            setTimeout(() => {
                                stopGameLoseCountdown();
                                beginGameLoseCountdown(); 
                            }, 500); 
                        }
                    }, 200); 
                }
            }, delay);
        });
    }

    // Part 3 - Game Lose Movie
    function gameOver() {
        // Disable all Controller Button
        controllerButtons.forEach(button => {
            button.disabled = true;
        });
        stopGameLoseCountdown(); 
        
        // Reset Game Status
        gameStatus.textContent = 'Game Over'; 
        indicator.style.backgroundColor = 'red'; 
        gameArray = [];
        gameArrayDisplay.textContent = `${gameArray}`;
        intervalTime = 1000;
        flashIntervalTimeDisplay.textContent = `Interval Time: ${intervalTime}ms`;
        roundTime  = 0;
        displayRoundTime.textContent = `Display Round Time: ${roundTime}ms`;

        // Reset Round Number
        currentRound = 0;
        roundInfoDisplay.textContent = `Game Round: ${currentRound}`;
        currentScore = 0; // Reset currentScore to 0 because of incorrect input
        currentScoreDisplay.textContent = currentScore.toString().padStart(2, '0');

        // 5 Flash Times (Open + Close)
        let count = 10; 
        let intervalId = setInterval(function() {
            // Flash all controllers by toggle 'Flash'
            controllerButtons.forEach(controller => {
                // JS: toggle() function !!!
                controller.classList.toggle('Flash'); 
            });
            count--;
            // When countdown -> 0, delete Interval and stop flashing 
            if (count === 0) { 
                clearInterval(intervalId); 
                controllerButtons.forEach(controller => {
                    controller.classList.remove('Flash'); 
                });
                startButton.disabled = false;
                alert('Game Over'); 
            }
        }, 200); 
    }
    
    // Part 4 - Handle ControllerButton Clicking
    controllerButtons.forEach((button) => {
        button.addEventListener('click', function() {

            /*

                    // Calculate current Score and highest Score
        let lastRound = currentRound - 1;
        // Update current Score, pad '0' for 1-digit num
        let textPadZeroRight = lastRound.toString().padStart(2, '0');
        currentScoreDisplay.textContent = textPadZeroRight;
        // Update highest Score , pad '0' for 1-digit num
        if (currentRound - 1 > highestRound) {
            highestRound = currentRound - 1;
            let textPadZeroLeft = highestRound.toString().padStart(2, '0');
            highestScoreDisplay.textContent = textPadZeroLeft;
        }

            */

            // Flash the button after clicking
            button.classList.add('Flash');
            setTimeout(() => button.classList.remove('Flash'), 200); 

            // Begin a new Countdown after you click the button
            stopGameLoseCountdown();
            beginGameLoseCountdown(); 

            // Get number from button color, put it into [inputArray]
            const color = button.classList.contains('Green') ? 'Green' :
                          button.classList.contains('Red') ? 'Red' :
                          button.classList.contains('Yellow') ? 'Yellow' :
                          'Blue'; 
            const number = colorMap[color];
            inputArray.push(number); 
            inputArrayDisplay.textContent = `[${inputArray.join(', ')}]`;

            //Get the index of newly input number.
            const currentPosition = inputArray.length - 1;
            // Compare that number value between gameArray and inputArray
            if (inputArray[currentPosition] !== gameArray[currentPosition]) {
                // 1- One of the input not correct ——> Reset two Arrays + Game Over
                inputArray = [];
                gameArray = [];
                inputArrayDisplay.textContent = '[]'; 
                gameArrayDisplay.textContent = '[]'; 

                gameOver();                
            } else {
                // If input is correct, increment currentScore
                currentScore++;
                currentScoreDisplay.textContent = currentScore.toString().padStart(2, '0');
    
                // Update highestScore 
                if (currentScore > highestScore) {
                    highestScore = currentScore;
                    highestScoreDisplay.textContent = highestScore.toString().padStart(2, '0');
                }
    
                if (inputArray.length === gameArray.length) {
                    // Input all the elements correctly: 
                    // Disable button immediately, to avoid redundant inputs.
                    controllerButtons.forEach(button => {
                        button.disabled = true;
                    });
    
                    // Reset inputArray for next Round
                    inputArray = [];
                    inputArrayDisplay.textContent = '[]'; 
    
                    setTimeout(displayRound, 1000); 
                }
            }
        });
    }); 

    // Part 5 - Control GameLose countdown
    const gameLoseCountdownDisplay = document.getElementById('gameLoseCountdown');  
    var countDownInterval;  // Get 'id' of Interval for countdown

    function beginGameLoseCountdown() {
        let countDown = 5;  
        gameLoseCountdownDisplay.textContent = `${countDown} seconds`;

        countDownInterval = setInterval(function() {
            countDown--;
            gameLoseCountdownDisplay.textContent = `${countDown} seconds`;

            if (countDown === 0) {
                clearInterval(countDownInterval);  // delete Interval
                gameOver(); // Trigger gameOver() function
            }
        }, 1000);  
    }
    function stopGameLoseCountdown() {
        clearInterval(countDownInterval);  // Stop Countdown Interval
        gameLoseCountdownDisplay.textContent = '5 seconds';  // Reset to 5 second
    }

    // Part 6 - Cheating Machine
    const toggleCheaterBtn = document.getElementById('toggleCheater');
    const cheaterDiv = document.getElementById('cheater');

    toggleCheaterBtn.addEventListener('click', function() {
        // Switch Display 'none' <-> 'flex'
        if (cheaterDiv.style.display === 'none' || cheaterDiv.style.display === '') {
            cheaterDiv.style.display = 'flex';
        } else {
            cheaterDiv.style.display = 'none';
        }
    });
});