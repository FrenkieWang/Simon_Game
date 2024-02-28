import React, {useState, useEffect} from 'react';
import './App.css'

function App() {
  const [startBtnPressed, setStartBtnPressed] = useState(false);
  const [indicatorColor, setIndicatorColor] = useState('red'); 
  const [gameStartcountdown, setGameStartCountDown] = useState(3);
  const [showGameStart, setShowGameStart] = useState(false); // The time for Game Start
  const [gameStatus, setGameStatus] = useState('stop'); 
  const [buttonFlash, setButtonFlash] = useState(false); 
  const [randomNumber, setRandomNumber] = useState(null); // 1,2,3,4

  useEffect(() => {
    let intervalId;

    if (startBtnPressed && gameStartcountdown > 0) {
      // Indicator -> Green [First]
      setIndicatorColor('green');
      setGameStatus('waiting...')

      // Update GameStartcountdown every second
      intervalId = setInterval(() => {
        setGameStartCountDown((prevCountdown) => prevCountdown - 1);
      }, 1000);

    } else if (gameStartcountdown === 0) {
      // Game Start
      setGameStatus('start')
      setShowGameStart(true); 
      // Hide Text after one second
      setTimeout(() => {
        setShowGameStart(false);
      }, 1000);

      setStartBtnPressed(false); // Reset Start Status
    }

    // Delete Interval
    return () => clearInterval(intervalId); 

  },[startBtnPressed, gameStartcountdown]);

  const startGame = () => {
    setStartBtnPressed(true);
    setGameStartCountDown(3); // Reset GameStartCountDown to 3 Second
    setIndicatorColor('red'); // Reset Indicator Color
  };

  const gameOver = () => {
    setGameStatus('stop');
    setIndicatorColor('red');
    // 5次闪烁，每次包括"显示"和"隐藏"两个状态，所以总共是10
    let flashes = 10; 

    const intervalId = setInterval(() => {
      setButtonFlash((prev) => !prev); // 切换GameButton的闪烁状态
      flashes--;

      if (flashes === 0) {
        clearInterval(intervalId);
        alert('Game Over');
      }
    }, 500 / 2); // 500ms分为两个状态，所以每250ms切换一次状态
  };

  const generateRandomNumber = () => {
    const number = Math.floor(Math.random() * 4) + 1;
    setRandomNumber(number);
  };
  
  return (
    <div className = "App">
      Simon Game Controller 

      <div className = "Simon UI">
        <div className = "Dashboard Circle">
          <div className = "ScoreBoard-Bar">
            <button className="ScoreBoard Score">10</button>
              <button className="ScoreBoard CtrlBtn" onClick={startGame}>
                START
              </button>
            <button className="ScoreBoard Score">04</button>
          </div>

          <div className="Indicator Circle" 
          style={{ backgroundColor: indicatorColor }}></div> 

          <div className={`GameButton Green Circle ${buttonFlash ? 'flash' : ''}`}></div>
          <div className={`GameButton Red Circle ${buttonFlash ? 'flash' : ''}`}></div>
          <div className={`GameButton Yellow Circle ${buttonFlash ? 'flash' : ''}`}></div>
          <div className={`GameButton Blue Circle ${buttonFlash ? 'flash' : ''}`}></div>
        </div>
      </div> {/* end of Simon UI */}
      <div>{gameStatus}</div>
      {startBtnPressed && gameStartcountdown > 0 ? gameStartcountdown : ''}
      {showGameStart && <div>Game Start</div>} 

      {/* 新增Game Over按钮 */}
      <button onClick={gameOver}>Game Over</button>

      <button onClick={generateRandomNumber}>Generate Random Number</button>
      <div>{randomNumber !== null ? randomNumber : ''}</div>
    </div>
  );
}

export default App;
