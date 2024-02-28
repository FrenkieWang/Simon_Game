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
  const [gameStartcountdown, setGameStartCountDown] = useState(3);
  const [showGameStart, setShowGameStart] = useState(false); // The time for Game Start
  const [gameStatus, setGameStatus] = useState('stop'); 
  const [buttonFlash, setButtonFlash] = useState(false); 
  const [randomNumber, setRandomNumber] = useState(null); // 1,2,3,4
  const [gameArray, setGameArray] = useState([]); // Store the random Num
  const [flashingButton, setFlashingButton] = useState(''); // Which Button to Flash

  const startGame = () => {
    setStartBtnPressed(true);
    setGameStartCountDown(3); // Reset GameStartCountDown to 3 Second
    setIndicatorColor('green'); // Set Indicator Color to Green
    setGameStatus('waiting...');

    let intervalId = setInterval(() => {
      // Every 1 sec, CountDown - 1
      setGameStartCountDown((prevCountdown) => {

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

  }; // end of Start Game

  const gameOver = () => {
    setGameStatus('stop');
    setIndicatorColor('red');
    setStartBtnPressed(false); // Reset Start Status
    setRandomNumber(null);
    setGameArray([]);

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
    }, 500 / 2); // 0.25 sec for show/hide flash
  };

  const generateRandomNumber = () => {
    const number = Math.floor(Math.random() * 4) + 1;
    setRandomNumber(number);
    // Insert Random Number into Game Array
    setGameArray(prevArray => [...prevArray, number]); 

    // Set which button to flash
    setFlashingButton(colorMap[number]);
    // Flash for 0.5 sec
    setTimeout(() => {
      setFlashingButton('');
    }, 500); 
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

          <div className={`GameButton Green Circle ${buttonFlash ||flashingButton === 'Green' ? 'flash' : ''}`}></div>
          <div className={`GameButton Red Circle ${buttonFlash ||flashingButton === 'Red' ? 'flash' : ''}`}></div>
          <div className={`GameButton Yellow Circle ${buttonFlash ||flashingButton === 'Yellow' ? 'flash' : ''}`}></div>
          <div className={`GameButton Blue Circle ${buttonFlash ||flashingButton === 'Blue' ? 'flash' : ''}`}></div>
        </div>
      </div> {/* end of Simon UI */}
      <div>{gameStatus}</div>
      {startBtnPressed && gameStartcountdown > 0 ? gameStartcountdown : ''}
      {showGameStart && <div>Game Start</div>} 

      {/* 新增Game Over按钮 */}
      <button onClick={gameOver}>Game Over</button>

      <button onClick={generateRandomNumber}>Generate Random Number</button>
      <div>{randomNumber !== null ? randomNumber : ''}</div>

      {/* Show Game Array */}
      <div>  
        <span> [ </span>
        {gameArray.map((num, index) => (
          <span key={index}>{num} </span> // 使用空格分隔数组中的每个数字
        ))}
        <span> ] </span>
      </div>

      {/* Delete it later */}
      <p style={{color: 'red', textAlign: 'center'}}>
        Button Color - Random Number <br />
        Green = 1<br />
        Red = 2<br />
        Yellow = 3<br />
        Blue = 4
      </p>
    </div>
  );
}

export default App;
