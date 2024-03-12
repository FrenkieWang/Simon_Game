
# Simon Game

Simon game example web site:

https://freesimon.org/

My deployed project:

https://simon-game-six-gold.vercel.app/

## Game Rules
1. Click the START button to begin and the game status indicator (red/green light below the START button) changes from red to green. The game will start 3 seconds after the green light is on.
2. Simon will give the first signal (randomly flashing a colored button). Repeat the signal by clicking the same colored button.
3. Simon will duplicate the first signal by adding another one. Repeat both signals by clicking the same colored buttons in order.
4. Simon will duplicate the first two signals and add another one
5. Continue playing as long as you can correctly repeat the signals for each sequence. In sequences with the 5th, 9th, and 13th signals, Simon automatically speeds up the intervals between the signals.
6. If you can't repeat a sequence accurately, or if you take longer than 5 seconds to repeat a signal, Simon responds by flashing all 4 buttons at the same time. This means you have lost and the signal sequence is over. The game status indicator switches from green to red, and you will have to click the START button to start a new game.
7. The progress (number of correctly repeated signals) of the game you have just completed (the last game) is shown on the display to the right of the START button. The highest ever score is shown on the display to the left of the start button.

## Required Elements
1. The Whole Page --  App
2. Square container -- Simon UI: Black solid line + Transparent Background
3. Dashboard -- Black Circle
4. Game Controllers x 4 - Button: red, yellow, blue, green + circle
5. Start button - Button:
6. Scoreboards - Button: left/right **Orbitron** https://fonts.googleapis.com/.

## Required Function
1. Start the Game - gameStart()
2. Stop the Game - gameOver()
3. Display each round - displayRound()
4. Click the button - handleButtonClick(event)
5. flash the button - buttonFlash(btnNumber)
6. Start/reset countdown - beginGameLoseCountdown()
7. Stop the countdown - stopGameLoseCountdown()

In addition, there are two asynchronous functions that need to be called
1. delayed execution: setTimeOut(func,[time=5000])
2. interval repeat execution: setInterval(func,[time=5000])

## Game Flow
gameStart() -> indicator turns green -> 3 seconds waiting -> displayRound()  

-> show button flash movies -> end of movies 
(From now on, user can click button for the input)

	1) Input order all correct -> run next round displayRound()  
	2) Input wrong one -> trigger gameOver()
	3) No action in 5 seconds -> trigger gameOver()

-> gameOver() is triggered -> all buttons falsh 5 times ->

indicator turns red -> alert "Game Over".

## Programming Steps
#### 1. In "App" pages, draw the required elements from top to buttom.
#### 2. Combine elements, draw the Simon Game UI
	Use a square container that is big enough to store the entire Simon UI.
	Make a div to store GameStatus, divided into Stop[default], Waiting and Start
#### 3. Button flashes when pressed - buttonFlash(btnNumber)
	Press the Game Controller button and it will flash for 0.4 sec. 
	How to realize flash? [CSS] opacity: 1 -> 0.5
#### 4. Create the Game Start movie - gameStart()
	Countdown - setInterval(func,[time])
	Make a div to store the countdown, starting at 3 and ending at 0.
	Click Start to trigger the gameStart function:
        1) Indicator turns green immediately.
        2) Div changes every second 3 2 1 , at this time GameStatus -> Waiting
        3) When div reaches 0: alert("Game Start"), GameStatus -> Start
#### 5. Create the Game Lose movie - gameOver()
	Make a temporary button, press it to trigger function gameOver():
	1) Indicator turns red
	2) All game buttons flash 5 times - setTimeOut(func,[time]) + buttonFlash(btnNumber)
	3) alert("Game Over:)
    4) GameStatus -> Stop

#### 6.  Generated numbers 1 - 4 ramdomly
	Make a []gameArray to store the array for each round of the game
	Make a temporary button that implements the displayRound function -> each round.
	Press the button to generate a random book from 1-4, insert the array []gameArray from the right side

#### 7.  Connect Number with Color - buttonFlash(btnNumber)
    'Green': 1,
    'Red': 2,
    'Yellow': 3,
    'Blue': 4

    Make a temporary button, 
    when a random number 1-4 is generated, 
    Let the corresponding color button flash.

#### 8. Display movie in each Round - displayRound()
	Make a temporary button that generates a new number to be inserted into the gameArray number and then trigger the displayRound function

	Every time a new number is generated, the entire gameArray[] array, flashes the buttons correspondent to the number in sequence (from left to right).
	Sequential Flash function: buttonFlash(btnNumber) + setTimeOut(func,[time]) + Recursion 

#### 9. Speed up movies according as Round progress

	Define 2 variables in each time displayRound() runs:
		-- startTime and endTime.

	Define 3 variables, record them in a div on the frontend
    1) Current Round number - currentRound
    2) Interval time between button flash - intervalTime
    3) Running time in each round: endTime - startTime
	round = gameArray.length
		[1 <= round <= 4]: intervalTime = 1000 ms
		[5 <= round <= 8]: intervalTime = 800 ms
		[9 <= round <= 12]: intervalTime = 600 ms
		[round >= 13]: intervalTime = 400 ms
	roundTime1 = intervalTime * round
	roundTime2 = startTime - endTime
	Check whether "roundTime1 == roundTime2" ? 

#### 10. Handle input with Game Controller - handleButtonClick(event)
	Press the Game Controller to generate the corresponding number,
    insert that number from the right into inputArray[].
	Remember the flash the Controller after clicked - buttonFlash(btnNumber)

#### 11. Compare gameArray[] and inputArray[] simultaneously - handleButtonClick(event)
    The currentIndex starts from 0.
	Each time a number is inserted into the inputArray[],
	compare the number value of inputArray[] and gameArray[] in currentIndex, 
    check whether they are same?

    Same until the end of gameAaray[] -> alert("You win this round")
	One of them is different -> alert("Game over")

#### 12. Connect Movies - gameStart() + displayRound() + gameOver()
    gameStart() -> 3 sec waiting -> displayRound() 
    [win]-> next DisplayRound() 
    [lose]-> gameOver() -> buttonFlash(all) × 5

#### 13. Record Current Score and Highest Score - handleButtonClick(event)
    gameStart() - currentScore = 0
    input incorrect - gameOver() - keep the currentScore in the last Round
    input correct - currentScore = currentScore + 1
    
    if (currentScore > highestScore)     [Update highestScore]

#### 14. GameLose CountDown for 5 SEC - begin/stop GameLoseCountdown() 
    1) beginGameLoseCountdown(): 
        Reset the countdown to 5. 
        Every second, countDow, = countDown -1. 
        When countDown becomes 0, trigger the gameOver() function.        
    2) stopGameLoseCountdown(): 
        Terminate the countdown, delete the countDown - clearInterval(intervalId);
        Reset countDown to 5, and keep number stable.

    Make two temporary buttons to realize them respectively.
	Remember to clean up the last Interval at any time

#### 15. Set the logic of CountDown
	1) gameOver() is triggered - stopGameLoseCountdown()
	2) gameStart() is triggered - stopGameLoseCountdown()
	Then gameStart() will trigger displayRound()).
	3) displayRound() is triggered
        a) When flash movie begins - stopGameLoseCountdown()
		b) One SEC after flash movie finishes - beginGameLoseCountdown()
	4) Button pressed in handleButtonClick(event) - beginGameLoseCountdown()
	5) When 5 SEC Countdown to 0 -> trigger gameOver()

#### 16. Optimized UI/UX interface - Disable Button
        button.disabled = true;
        if (!isButtonClickable) return; 

Disable button functionality in specific cases:

	1 - gameOver() function is triggered: button -> disabled
	2 - gameStart() function is triggered: button -> disabled
	3 - displayRound() is triggered, the Button Flash movie is running: button -> disabled
	4 - displayRound() is triggered, the Button Flash movie is finished: button -> Can Click
    5 - handleButtonClick(event) in every Round, input all elements in gameArray[] correctly: button -> disabled



    
