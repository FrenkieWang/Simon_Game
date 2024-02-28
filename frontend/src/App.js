import React, {useState, useEffect} from 'react';
import './App.css'

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [indicatorColor, setIndicatorColor] = useState('red'); 
  const [showOk, setShowOk] = useState(false); // The time for Game Start

  useEffect(() => {
    let intervalId;

    if (isStarted && countdown > 0) {
      // Update CountDown every second
      intervalId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIndicatorColor('green');

      setShowOk(true); 
      // Hide Text after one second
      setTimeout(() => {
        setShowOk(false);
      }, 1000);

      setIsStarted(false); // Reset Start Status
    }

    // Delete Interval
    return () => clearInterval(intervalId); 

  },[isStarted, countdown]);

  const startGame = () => {
    setIsStarted(true);
    setCountdown(3); // Reset CountDown to 3 Second
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
      {isStarted && countdown > 0 ? countdown : ''}
      {showOk && <div>Game Start</div>} 
    </div>
  );
}

export default App;
