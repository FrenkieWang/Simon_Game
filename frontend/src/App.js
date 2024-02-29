import React, {useState} from 'react';
import './App.css'

// [Map] Num -> Color
const colorMap = {
  1: 'Green',
  2: 'Red',
  3: 'Yellow',
  4: 'Blue'
};

function App() {
  const [startBtnPressed, setStartBtnPressed] = useState(false);
  const [indicatorColor, setIndicatorColor] = useState('red'); 
  const [showGameStart, setShowGameStart] = useState(false); // The time for Game Start
  const [gameStatus, setGameStatus] = useState('stop'); 
  const [buttonFlash, setButtonFlash] = useState(false); 
  const [gameArray, setGameArray] = useState([]); // Store the random Num
  const [flashingButton, setFlashingButton] = useState(''); // Which Button to Flash
  const [round, setRound] = useState(0); 
  const [flashIntervalTime, setFlashIntervalTime] = useState(1000); 
  const [gameStartCountdown, setGameStartCountdown] = useState(3);

  const [inputArray, setInputArray] = useState([]);
  // Use Index to check gameArray and inputArray
  const [inputIndex, setInputIndex] = useState(0);

  // [Unnecessary] Save the Time for each Round's Button Flash Display
  const [displayRoundTime, setDisplayRoundTime] = useState(0); 

  // set Countdown and Interval for every Click
  const [gameLoseCountdown, setGameLoseCountdown] = useState(5);

  const startGame = () => {
    setStartBtnPressed(true);
    setGameStartCountdown(3); // Reset GameStartCountDown to 3 Second
    setIndicatorColor('green'); // Set Indicator Color to Green
    setGameStatus('waiting...');

    let intervalId = setInterval(() => {
      // Every 1 sec, CountDown - 1
      setGameStartCountdown((prevCountdown) => {

        // When count = 0, Game Start
        if (prevCountdown - 1 === 0) {
          setGameStatus('start');
          // Show Text when game start
          setShowGameStart(true);  
          // Hide Text after 1 sec
          setTimeout(() => {
            setShowGameStart(false);            
          }, 1000);

          // Clear Interval (Stop CountDown - 1)
          clearInterval(intervalId); 
        }
        return prevCountdown - 1;
      }); 
    }, 1000);  

    /* Begin the first Round!
       CountDown Time after Start  = 3 sec
       The hint for "Game Start"   = 1 sec
       Prepare Time for Player     = 1 sec  
       So wait for 5 secs after Click "Start Button"
    */
    setTimeout(() => {
      displayRound();
    }, 5000)

  }; // end of Start Game

  const gameOver = () => {  

    setGameStatus('stop');
    setIndicatorColor('red');
    setStartBtnPressed(false); // Reset Start Status
    setGameArray([]);
    setFlashIntervalTime(1000);
    setDisplayRoundTime(0);

    // When lose the game, reset Input Array, Input Index and Round No.
    setInputIndex(0);
    setInputArray([]);
    setRound(0);

    // Flash 5 times (show flash + hide flash)
    let flashes = 10; 

    // [JavaScript Closure]
    const intervalId = setInterval(() => {
      // Toggle flash status of 4 GameButton 
      setButtonFlash((prev) => !prev); 
      flashes--;

      if (flashes === 0) {
        // Delete this Interval according to its ID
        clearInterval(intervalId);
        alert('Game Over');
      }
    }, 400 / 2); // 0.2 sec for show/hide flash
  };

  const displayRound = () => {

    // When each Round begins, reset Input Array and Input Index.
    setInputIndex(0);
    setInputArray([]);

    // Record begin Time of Each Round
    const startTime = Date.now();

    // Create a number from 1 - 4 and put into gameArray
    setGameArray(prevArray => {
      const randomNumber = Math.floor(Math.random() * 4) + 1;
      const newArray = [...prevArray, randomNumber];

      // Update Round Number
      const newRound = newArray.length;
      setRound(newRound);

      // Update flashIntervalTime according to new Round number
      let newFlashIntervalTime = 1000; // Default VALUE
      if (newRound >= 5 && newRound <= 8) {
        newFlashIntervalTime = 800;
      } else if (newRound >= 9 && newRound <= 12) {
        newFlashIntervalTime = 600;
      } else if (newRound >= 13) {
        newFlashIntervalTime = 400;
      }
      setFlashIntervalTime(newFlashIntervalTime); 

      // **The logic of GameButton Flash
      let index = 0;
      const intervalId = setInterval(() => {
        if (index < newRound ) {
          // Set which button to flash - 0.2 sec
          setFlashingButton(colorMap[newArray[index]]); 

          // Stop flashing - 0.2 sec
          setTimeout(() => {
            setFlashingButton('');
          }, 200);
          // next index of Game Array
          index++;
        } else {
          clearInterval(intervalId); 

          // Record the end time.
          const endTime = Date.now(); 
          // The last time useing Interval won't cause Button Flashing.
          // It will only delete this Interval after traverse gameArray
          setDisplayRoundTime(endTime - startTime - newFlashIntervalTime);
        }
      }, newFlashIntervalTime); //Update IntervalTime for the new Round

      return newArray; 
    }); // renew gameArray after the Round ends
  };

  // When user clicks 1 of 4 GameButton
  const handleButtonClick = (number) => {
    
    if (gameArray[inputIndex] === number) {
      // Input Correct -> Update inputArray and inputIndex
      setInputArray(prevArray => [...prevArray, number]);
      setInputIndex(prevIndex => prevIndex + 1);
  
      // Whether inputed all elements of gameArray without error
      if (inputIndex + 1 === round) {
        //alert("You win in this round!");
        displayRound();
      }
    } else {
      // Input Error -> invoke 'GameOver' function
      gameOver();
    }
  };

  const resetGameLoseCountdown = () => {
      
    let gameOverTriggered = false; // 重置标志
    setGameLoseCountdown(5); // 重置倒计时为5秒
  
    const intervalId = setInterval(() => {
      setGameLoseCountdown(prevCountDown => {
        if (prevCountDown <= 1) {
          if (!gameOverTriggered) { // 检查标志以确保只触发一次
            gameOverTriggered = true; // 设置标志以防止再次触发
            clearInterval(intervalId); // 清除interval
            alert('Game Over'); // 显示alert
          }
          return prevCountDown - 1;
        }
        return prevCountDown- 1; // 每次调用减少1秒
      });
    }, 1000);
  
  };

  
  return (
    <div className = "App">
      Simon Game Controller 

      <div className = "Simon UI">
        <div className = "Dashboard Circle">
          <div className = "ScoreBoard-Bar">
            <button className="ScoreBoard Score">10</button>
              <button className="ScoreBoard CtrlBtn" onClick={startGame} disabled={startBtnPressed}>
                START
              </button>
            <button className="ScoreBoard Score">04</button>
          </div>

          <div className="Indicator Circle" 
          style={{ backgroundColor: indicatorColor }}></div> 

          <div className={`GameButton Green Circle ${buttonFlash ||flashingButton === 'Green' ? 'flash' : ''}`} 
                onClick={() => handleButtonClick(1)}></div>
          <div className={`GameButton Red Circle ${buttonFlash ||flashingButton === 'Red' ? 'flash' : ''}`}
                onClick={() => handleButtonClick(2)}></div>
          <div className={`GameButton Yellow Circle ${buttonFlash ||flashingButton === 'Yellow' ? 'flash' : ''}`} 
                onClick={() => handleButtonClick(3)}></div>
          <div className={`GameButton Blue Circle ${buttonFlash ||flashingButton === 'Blue' ? 'flash' : ''}`} 
                onClick={() => handleButtonClick(4)}></div>
        </div>{/* end of Dashboard Circle */}
      </div> {/* end of Simon UI */}
      
      <div><b>Round: {round}</b></div>

      <button onClick={resetGameLoseCountdown}>Start 5-Second Countdown</button>
      {/* 显示剩余倒计时时间 */}
      <div style={{color:'red'}}>Time Left: {gameLoseCountdown} seconds</div> 

      <div>{gameStatus}</div>
      {startBtnPressed && gameStartCountdown > 0 ? gameStartCountdown : ''}
      {showGameStart && <div>Game Start</div>} 

      <div>Interval Time: {flashIntervalTime}ms</div> 
      <div style = {{color:'blue'}}>Display Round Time: {displayRoundTime}ms</div>
      
      {/* Game Array */}
      <div>  
        <span> Game Array: [ </span>
        {gameArray.map((num, index) => (
          <span key={index}>{num} </span> // a space to split
        ))}
        <span> ] </span>
      </div>

      {/* Input Array */}
      <div>  
        <span> Input Array: [ </span>
        {inputArray.map((num, index) => (
          <span key={index}>{num} </span> // a space to split
        ))}
        <span> ] </span>
      </div>

      <div>Next index to input: {inputIndex}</div>
      <div>Next answer should be: {gameArray[inputIndex]}</div>

    </div>
  );
}

export default App;
