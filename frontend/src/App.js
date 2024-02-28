import React, {useState, useEffect} from 'react';
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
  const [round, setRound] = useState(0); // 当前游戏回合
  const [intervalTime, setIntervalTime] = useState(1000); // 间隔时间，默认为1000毫秒

 // 用于存储displayRound的执行时间
  const [displayRoundTime, setDisplayRoundTime] = useState(0); 

  useEffect(() => {
    const currentRound = gameArray.length; // 直接使用 gameArray.length 获取当前回合数
    setRound(currentRound); // 更新 round 的状态
  
    // 根据当前回合数调整间隔时间
    if (currentRound >= 5 && currentRound <= 8) {
      setIntervalTime(800);
    } else if (currentRound >= 9 && currentRound <= 12) {
      setIntervalTime(600);
    } else if (currentRound >= 13) {
      setIntervalTime(400);
    } else {
      setIntervalTime(1000); // 默认间隔时间
    }
  }, [gameArray.length]); // 依赖于 gameArray.length 的变化

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
    }, 1000);  // This will change in UseEffect

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
    }, 400 / 2); // 0.2 sec for show/hide flash
  };

  const generateRandomNumber = () => {
    const number = Math.floor(Math.random() * 4) + 1;
    setRandomNumber(number);
    // Insert Random Number into Game Array
    setGameArray(prevArray => [...prevArray, number]); 

    // Set which button to flash
    setFlashingButton(colorMap[number]);
    // Stop Flashing
    setTimeout(() => {
      setFlashingButton('');
    }, 200); 
  };

  const displayRound = () => {
    const startTime = Date.now(); // 记录开始时间
    let index = 0; // 用于跟踪当前显示的数组元素的索引

    const intervalId = setInterval(() => {
      if (index < gameArray.length) {
        setFlashingButton(colorMap[gameArray[index]]); // 设置当前要闪烁的按钮
        
        // 立即停止闪烁，但留出足够的时间让用户看到闪烁效果
        setTimeout(() => {
          setFlashingButton('');
        }, 200); 
  
        index++; // 移动到数组的下一个元素
      } else {
        clearInterval(intervalId); // 当遍历完数组时清除定时器
        const endTime = Date.now(); // 记录结束时间
        // 计算并更新执行时间, 减去释放Interval的时间
        setDisplayRoundTime(endTime - startTime - intervalTime); 
      }
    }, intervalTime); // update by useEffect
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
      <div><b>Round: {round}</b></div> {/* 显示当前回合 */}
      <div>{gameStatus}</div>
      {startBtnPressed && gameStartcountdown > 0 ? gameStartcountdown : ''}
      {showGameStart && <div>Game Start</div>} 

      {/* 新增Game Over按钮 */}
      <button onClick={gameOver}>Game Over</button>

      <button onClick={generateRandomNumber}>Generate Random Number</button>
      <button onClick={displayRound}>Display Round</button> 

      {/* Game Array */}
      <div>  
        <span> Game Array: [ </span>
        {gameArray.map((num, index) => (
          <span key={index}>{num} </span> // 使用空格分隔数组中的每个数字
        ))}
        <span> ] </span>
      </div>

      <div>Interval Time: {intervalTime}ms</div> {/* 显示当前间隔时间 */}

      {/* 在界面上显示displayRound的执行时间 */}
      <div style = {{color:'blue'}}>Display Round Time: {displayRoundTime}ms</div>

      {/* Delete it later */}
      <p style={{color: 'blue', textAlign: 'center'}}>
        Change Intervals according to <b>Round </b> <br />
        Round 1 - 5 : 1 second <br />
        Round 6 - 8 : 0.8 second<br />
        Round 9 - 12 : 0.6 second<br />
        Round 13 - max : 0.4 second
      </p>
    </div>
  );
}

export default App;
