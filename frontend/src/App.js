import React, {useState, useEffect} from 'react';
import './App.css';

// [Map] Num -> Color
const colorMap = {
  1: 'Green',
  2: 'Red',
  3: 'Yellow',
  4: 'Blue'
};

function App(){
  // Part 1 - Start Game
  const [gameStatus, setGameStatus] = useState('Press Start Button to begin'); 
  const [indicatorColor, setIndicatorColor] = useState('red'); 
  const [startBtnPressed, setStartBtnPressed] = useState(false);
  const [gameStartCountdown, setGameStartCountdown] = useState(3);

  // Part 2 - Display  Round
  const [round, setRound] = useState(0);
  const [highestScore, setHighestScore] = useState(0); // To store the highest round achieved
  const [currentScore, setCurrentScore] = useState(0); // To store the current round value
  const [flashIntervalTime, setFlashIntervalTime] = useState(1000); 
  const [displayRoundTime, setDisplayRoundTime] = useState(0); 
  // Store the random Num created in each Round
  const [gameArray, setGameArray] = useState([]); 

  // Part 3 - Lose Game
  const [buttonFlash, setButtonFlash] = useState(false); 

  // Part 4 - Handle GameButton Clicking
  const [pressedButton, setPressedButton] = useState(''); // Track which is the pressed GameButton
  const [flashingButton, setFlashingButton] = useState(''); // Track which GameButton will flash
  const [isButtonClickable, setIsButtonClickable] = useState(false); // Track `disable` props.
  // Use Index to check gameArray and inputArray
  const [inputArray, setInputArray] = useState([]);
  const [inputIndex, setInputIndex] = useState(0);

  // Part 5 - Control GameLose countdown
  const [gameLoseCountdown, setGameLoseCountdown] = useState(5);
  const [isCountingDown, setIsCountingDown] = useState(false);   // Whether countdown has begun

  // Part 6 - Cheating Machine
  const [isCheaterOpen, setIsCheaterOpen] = useState(false);


  // [Listener 1] - Clean the current Countdown Interval, when a new Interval was created. 
  useEffect(() => {

    // Create an Interval, run this Interval until Countdown reaches 0.
    let intervalId;

    if (isCountingDown) {
      intervalId = setInterval(() => {
        setGameLoseCountdown((prevCountDown) => {
          // When Countdown reaches last second = 1
          if (prevCountDown <= 1) {
            clearInterval(intervalId); 
            // alert('Game Over');
            return 0; // Countdown must >=0
          }
          return prevCountDown - 1;
        });
      }, 1000);
    }

    /* When React in Unmounting Stage / React Dependency changes,
      clean the current Interval。 */
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isCountingDown]); // Run UseEffect, according to `isCountingDown` Status

  // Part 1 - Start Game
  function gameStart() {
    setIsButtonClickable(false); // GameButton cannot click during 'GameStart' movie
    stopGameLoseCountdown(); 

    setStartBtnPressed(true);    
    setGameStartCountdown(3); // Reset GameStartCountDown to 3 Sec
    setCurrentScore(0); // Reset the current Round number when new game starts
    setIndicatorColor('green'); // Set Indicator Color to  `Green`
    setGameStatus('Waiting...');

    let intervalId = setInterval(() => {
      // Every 1 SEC, CountDown - 1
      setGameStartCountdown((prevCountdown) => {
        // When count = 0, Game Start
        if (prevCountdown - 1 === 0) {
          setGameStatus('Game Start');
          // Clear Interval > Stop `CountDown - 1`  
          clearInterval(intervalId); 
        }
        return prevCountdown - 1;
      }); 
    }, 1000);  

    /* Begin the first Round!
       CountDown Time after Start  = 3 SEC
       The hint for "Game Start"   = 1 SEC
       Prepare Time for Player     = 0.5 SEC  
       So wait for 4.5 SEC after Click "Start Button"
    */
   
    setTimeout(() => {
      // alert('Game Start')
      displayRound();
    }, 4500); // Make it deplay every time the Game starts   

  }; // end of Start Game  

  // Part 2 - Display  Round
  function displayRound () {   

    // GameButton cannot click during 'Round Display' Movie
    setIsButtonClickable(false); 
    stopGameLoseCountdown(); 
    // Reset Input data
    setInputIndex(0);
    setInputArray([]);  

    // Record the BEGIN Time in this Round
    const startTime = Date.now();
  
    // Change Game Array in every Round
    setGameArray(prevArray => {
      const randomNumber = Math.floor(Math.random() * 4) + 1;
      const newArray = [...prevArray, randomNumber];
      const newRound = newArray.length;
      setRound(newRound); 

      // Change `ButtonFlash Intervals` according to the Round number
      let newFlashIntervalTime = 1000; // Default
      if (newRound >= 5 && newRound <= 8) {
        newFlashIntervalTime = 800;
      } else if (newRound >= 9 && newRound <= 12) {
        newFlashIntervalTime = 600;
      } else if (newRound >= 13) {
        newFlashIntervalTime = 400;
      }
      setFlashIntervalTime(newFlashIntervalTime);  

      function flashButtonMovie (index) {        
        if (index < newRound) {
          setFlashingButton(colorMap[newArray[index]]); // begin Flash
          setTimeout(() => setFlashingButton(''), 200); // close Flash
  
          // Go to next ButtonFlash with the FlashIntervalTime
          setTimeout(() => flashButtonMovie(index + 1), newFlashIntervalTime);
        }

        // When it comes to the last element in GameArray
        if (index === newRound - 1) {
          setTimeout(() => {
            const endTime = Date.now(); // Record the END Time in this Round
            // Calculate the `Elapsed Time` of this Round, cut the setTimeOut
            setDisplayRoundTime(endTime - startTime + newFlashIntervalTime - 200); 

            // 1 SEC after `ButtonFlash` movie, GameButton can click now, 
            setTimeout(() => {
              setIsButtonClickable(true); 
            }, 1000); 

            // 0.5 SEC after 'Round Display' Movie, begin a new Countdown
            setTimeout(() => {
              stopGameLoseCountdown();
              beginGameLoseCountdown(); 
            }, 500); 
          }, 200); // After the `ButtonFlash` of last button
        }
      };
  
      // Begin at the First element in GameArray
      flashButtonMovie(0);
  
      return newArray;
    });
  };

  // Part 3 - Lose Game
  function gameOver () {

    // Reset the game Status to Default
    setGameStatus('Game Lose');
    setIndicatorColor('red');
    // GameButton cannot click, when GameOver
    setIsButtonClickable(false); 
    stopGameLoseCountdown(); 

    // Reset all the data
    setRound(0);
    setGameArray([]);
    setFlashIntervalTime(1000);
    setDisplayRoundTime(0);
    setInputIndex(0);
    setInputArray([]);  

    // Show Flash + Recover Flash
    let flashes = 10;  
    function gameOverMovie () {
      // Toggle flash stastus
      setButtonFlash(prev => !prev); 
      flashes--; 
  
      if (flashes > 0) {
        setTimeout(gameOverMovie, 200); // Go to next `Flash`
      } else {
        setStartBtnPressed(false);
        alert('Game Over'); // When all Flash finished
      }
    };
  
    // Begin at the first Flash
    gameOverMovie(); 
  };

  // Part 4 - Handle GameButton Clicking
  function handleButtonClick(number) {
    // If Button cannot Click, perform no operation and return.
    if (!isButtonClickable) return; 
    
    // Make `Flash` effect when GameButton is pressed
    setPressedButton(colorMap[number]); // according to its color
    setTimeout(() => setPressedButton(''), 200); 

    // Begin a new Countdown
    stopGameLoseCountdown();
    beginGameLoseCountdown(); 

    // Handle `Input`,  when the Button is Clicked
    if (gameArray[inputIndex] === number) {
      // Status 1 - Input Correct -> Update inputArray and inputIndex
      setInputArray(prevArray => [...prevArray, number]);
      setInputIndex(prevIndex => prevIndex + 1);

      // Record the Current Score and update the highest Score
      setCurrentScore(prevCount => {
        const newCount = prevCount + 1;
        setHighestScore(prevHighScore => Math.max(prevHighScore, newCount));
        return newCount; 
      });
  
      /* When input all elements of gameArray without error,
          begin the next Round after 1 SEC */
      if (inputIndex + 1 === round) {
        // alert("You win in this round!");
        setIsButtonClickable(false); // Disable input immediately
        setTimeout(() => {
          displayRound();
        }, 1000); 
      }  
    // Status 2 - Input Error -> invoke 'GameOver' function
    } else {
      gameOver();
    }
  }

  // Part 5 - Control GameLose countdown
  function beginGameLoseCountdown () {
    setIsCountingDown(true); // Begin an Countdown Interval
    setGameLoseCountdown(5); // Reset Countdown to 5
  };
  function stopGameLoseCountdown () {
    setIsCountingDown(false); // Stop the Countdown Interval
    setGameLoseCountdown(5); // Reset Countdown to 5
  };

  // Part 6 - Cheating Machine
  function toggleCheatingMachine () {
    setIsCheaterOpen(!isCheaterOpen);
  };

  // [Listener 2] - Invoke GameOver when countdown reaches 0
  useEffect(()=>{    
    if(gameLoseCountdown ===0) gameOver();
  },[gameLoseCountdown])  

  return(
    <div className = "App">
      <h1>Simon Game Controller </h1>
      <div className = "Simon UI">
        <div className = "Dashboard Circle">
          <button className={`Controller Green Circle 
            ${buttonFlash || flashingButton === 'Green' || pressedButton === 'Green' ? 'Flash' : ''}
            ${!isButtonClickable ? 'disabled' : ''}`}
            onClick={() => handleButtonClick(1)}
            disabled={!isButtonClickable}> 
          </button>
          <button className={`Controller Red Circle 
            ${buttonFlash || flashingButton === 'Red' || pressedButton === 'Red' ? 'Flash' : ''}
            ${!isButtonClickable ? 'disabled' : ''}`}
            onClick={() => handleButtonClick(2)}
            disabled={!isButtonClickable}> 
          </button>
          <button className={`Controller Yellow Circle 
            ${buttonFlash || flashingButton === 'Yellow' || pressedButton === 'Yellow' ? 'Flash' : ''}
            ${!isButtonClickable ? 'disabled' : ''}`}
            onClick={() => handleButtonClick(3)}
            disabled={!isButtonClickable}> 
          </button>
          <button className={`Controller Blue Circle 
            ${buttonFlash ||flashingButton === 'Blue' || pressedButton === 'Blue' ? 'Flash' : ''}
            ${!isButtonClickable ? 'disabled' : ''}`}
            onClick={() => handleButtonClick(4)}
            disabled={!isButtonClickable}> 
          </button>

          <div className = "ScoreBoard-Bar">
            <button className="ScoreBoard Score">{highestScore < 10 ? `0${highestScore}` : highestScore}</button>
            <button className={`ScoreBoard Start ${startBtnPressed ? 'disabled' : ''}`} 
              onClick={gameStart} 
              disabled={startBtnPressed} >
                START 
            </button>
            <button className="ScoreBoard Score">{currentScore < 10 ? `0${currentScore}` : currentScore}</button>
          </div>          
          <div className="Indicator Circle"
          style={{ backgroundColor: indicatorColor }}></div> 
        </div>
      </div>

      <div style={{ fontWeight:'bold', fontSize:'25px'}}>Game Round: {round}</div>

      {/* Game Status Monitor */}
      <div>{gameStatus}</div>
      {startBtnPressed && gameStartCountdown > 0 ? gameStartCountdown : ''} 

      {/* Show Remaining Time before Game Lose */}
      <div style={{color:'red', fontWeight:'bold', fontSize:'30px'}}>{gameLoseCountdown} seconds</div> 

      {/* Monitor the running time */}
      <div>Interval Time: {flashIntervalTime}ms</div> 
      <div style = {{color:'blue'}}>Display Round Time: {displayRoundTime}ms</div>  

      <br /> {/* Cheating Machine */}
      <button onClick={toggleCheatingMachine}>
        {isCheaterOpen ? 'Close Cheating Machine' : 'Open Cheating Machine'}
      </button>
      {isCheaterOpen && (
        <div className = "cheater">
          <div style={{ fontWeight:'bold', fontSize:'20px'}}>This is the cheating machine:</div>       
          <div>Please press: &nbsp;          
            <span style={{ fontSize: '30px', fontWeight: 'bold', backgroundColor: 'lightgray', color: colorMap[gameArray[inputIndex]] }}>
              {colorMap[gameArray[inputIndex]]}
            </span>
            &nbsp; Button
          </div>

          <div>  
            <span> Game Array: [ </span>
            {gameArray.map((num, index) => (
              <span key={index} style={{backgroundColor: 'lightgray', color: colorMap[num]}}>{num} </span> // a space to split
            ))}
            <span> ] </span>
          </div>
          <div>  
            <span> Input Array: [ </span >
            {inputArray.map((num, index) => (
              <span key={index}  style={{backgroundColor: 'lightgray', color: colorMap[num]}}>{num} </span> // a space to split
            ))}
            <span> ] </span>
          </div>
        </div>
      )}
    </div>    
  )
}

export default App;