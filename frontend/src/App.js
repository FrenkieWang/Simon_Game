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
  const [gameArray, setGameArray] = useState([]); // Store the random Num
  const [flashingButton, setFlashingButton] = useState(''); // Which Button to Flash
  const [round, setRound] = useState(0); // 当前游戏回合
  const [intervalTime, setIntervalTime] = useState(1000); // 间隔时间，默认为1000毫秒

 // 用于存储displayRound的执行时间
  const [displayRoundTime, setDisplayRoundTime] = useState(0); 
  const [inputArray, setInputArray] = useState([]);

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
    setGameArray([]);
    setInputArray([]);

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
    const startTime = Date.now(); // 记录开始时间

    // 首先生成一个1-4之间的随机数并添加到gameArray中
    setGameArray(prevArray => {
      const randomNumber = Math.floor(Math.random() * 4) + 1;
      const newArray = [...prevArray, randomNumber];

      // 根据 newArray 的长度更新 round
      const newRound = newArray.length;
      setRound(newRound);

      // 根据 newRound 更新 intervalTime
      let newIntervalTime = 1000; // 默认值
      if (newRound >= 5 && newRound <= 8) {
        newIntervalTime = 800;
      } else if (newRound >= 9 && newRound <= 12) {
        newIntervalTime = 600;
      } else if (newRound >= 13) {
        newIntervalTime = 400;
      }
      setIntervalTime(newIntervalTime); // 更新 intervalTime

      // 启动按钮闪烁逻辑
      let index = 0;
      const intervalId = setInterval(() => {
        if (index < newRound ) {
          setFlashingButton(colorMap[newArray[index]]); // 设置当前要闪烁的按钮

          // 立即停止闪烁，但留出足够的时间让用户看到闪烁效果
          setTimeout(() => {
            setFlashingButton('');
          }, 200);

          index++; // 移动到数组的下一个元素
        } else {
          clearInterval(intervalId); // 当遍历完数组时清除定时器
          const endTime = Date.now(); // 记录结束时间
          // 计算并更新执行时间
          setDisplayRoundTime(endTime - startTime - newIntervalTime);
        }
      }, newIntervalTime);

      return newArray; // renew gameArrayValue
    }); // end of setGameArray
  };

  // 定义处理函数，处理按钮点击事件
  const handleButtonClick = (number) => {
    setInputArray(prevArray => [...prevArray, number]);
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
      
      <div><b>Round: {round}</b></div> {/* 显示当前回合 */}
      <div>{gameStatus}</div>
      {startBtnPressed && gameStartcountdown > 0 ? gameStartcountdown : ''}
      {showGameStart && <div>Game Start</div>} 

      {/* 新增Game Over按钮 */}
      <button onClick={gameOver}>Game Over</button>
      <button onClick={displayRound}>Display Round</button> 

      <div>Interval Time: {intervalTime}ms</div> {/* 显示当前间隔时间 */}

      {/* 在界面上显示displayRound的执行时间 */}
      <div style = {{color:'blue'}}>Display Round Time: {displayRoundTime}ms</div>
      
      {/* Game Array */}
      <div>  
        <span> Game Array: [ </span>
        {gameArray.map((num, index) => (
          <span key={index}>{num} </span> // 使用空格分隔数组中的每个数字
        ))}
        <span> ] </span>
      </div>

      {/* Input Array */}
      <div>  
        <span> Input Array: [ </span>
        {inputArray.map((num, index) => (
          <span key={index}>{num} </span> // 使用空格分隔数组中的每个数字
        ))}
        <span> ] </span>
      </div>

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
