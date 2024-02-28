import React, {useState, useEffect} from 'react';
import './App.css'

function App() {
  const [startBtnPressed, setStartBtnPressed] = useState(false);
  const [indicatorColor, setIndicatorColor] = useState('red'); 
  const [gameStartcountdown, setGameStartCountDown] = useState(3);
  const [showGameStart, setShowGameStart] = useState(false); // The time for Game Start
  const [gameStatus, setGameStatus] = useState('stop'); // The time for Game Start

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

          <div className="GameButton Green Circle"></div>
          <div className="GameButton Red Circle"></div>
          <div className="GameButton Yellow Circle"></div>
          <div className="GameButton Blue Circle"></div>
        </div>
      </div> {/* end of Simon UI */}
      <div>{gameStatus}</div>
      {startBtnPressed && gameStartcountdown > 0 ? gameStartcountdown : ''}
      {showGameStart && <div>Game Start</div>} 
    </div>
  );
}

export default App;
