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

  const [isCountingDown, setIsCountingDown] = useState(false); // 新状态，控制倒计时是否开始

  const [highestRound, setHighestRound] = useState(0); // To store the highest round achieved
  const [currentRound, setCurrentRound] = useState(0); // To store the current round value

  const [pressedButton, setPressedButton] = useState(''); // 追踪被按下的按钮

  useEffect(() => {
    let intervalId;

    if (isCountingDown) {
      intervalId = setInterval(() => {
        setGameLoseCountdown((prevCountDown) => {
          if (prevCountDown <= 1) {
            clearInterval(intervalId); // 清除定时器
            // alert('Game Over');
            return 0; // 避免倒计时变成负数
          }
          return prevCountDown - 1;
        });
      }, 1000);
    }

    // 组件卸载或依赖项改变时清理定时器
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isCountingDown]); // 依赖项数组，当isCountingDown改变时重新运行effect

  const gameStart = () => {
    stopGameLoseCountdown(); // 停止倒计时

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

    
    setCurrentRound(0); // Reset the current round display when a new game starts

  }; // end of Start Game

  const gameOver = () => {
    stopGameLoseCountdown(); // 停止倒计时

    setGameStatus('stop');
    setIndicatorColor('red');
    setStartBtnPressed(false); // 重置开始状态
    setGameArray([]);
    setFlashIntervalTime(1000);
    setDisplayRoundTime(0);
  
    // 当游戏结束时，重置输入数组、输入索引和回合数
    setInputIndex(0);
    setInputArray([]);
    setRound(0);
  
    // 闪烁次数（显示加隐藏算一次闪烁）
    let flashes = 10;
  
    const flashButtons = () => {
      setButtonFlash(prev => !prev); // 切换按钮的闪烁状态
      flashes--; // 减少一次闪烁次数
  
      if (flashes > 0) {
        setTimeout(flashButtons, 200); // 设置下一次闪烁
      } else {
        alert('Game Over'); // 所有闪烁完成后显示游戏结束的警告
      }
    };
  
    flashButtons(); // 开始第一次闪烁

    // Last Game = Lose Round - 1
    if (round - 1 > highestRound) {
      setHighestRound(round - 1); // Update the highest round achieved
    }
    setCurrentRound(round - 1); // Update the current round value to be displayed next to the start button
  };
  

  const displayRound = () => {
    stopGameLoseCountdown(); // 停止当前的倒计时

    setInputIndex(0);
    setInputArray([]);
  
    // 记录当前轮次开始的时间
    const startTime = Date.now();
  
    setGameArray(prevArray => {
      const randomNumber = Math.floor(Math.random() * 4) + 1;
      const newArray = [...prevArray, randomNumber];
      const newRound = newArray.length;
      setRound(newRound);
  
      // 根据新回合数动态调整闪烁间隔时间
      let newFlashIntervalTime = 1000; // 默认值
      if (newRound >= 5 && newRound <= 8) {
        newFlashIntervalTime = 800;
      } else if (newRound >= 9 && newRound <= 12) {
        newFlashIntervalTime = 600;
      } else if (newRound >= 13) {
        newFlashIntervalTime = 400;
      }
      setFlashIntervalTime(newFlashIntervalTime);
  
      const flashButton = (index) => {
        if (index < newRound) {
          setFlashingButton(colorMap[newArray[index]]);
          setTimeout(() => setFlashingButton(''), 200); // 闪烁结束后关闭
  
          // 使用新的间隔时间调用下一个闪烁，确保有200ms的显示时间
          setTimeout(() => flashButton(index + 1), newFlashIntervalTime);
        }
  
        // 在最后一个按钮的闪烁结束后立即计算并显示这一轮的耗时
        if (index === newRound - 1) {
          setTimeout(() => {
            const endTime = Date.now(); // 记录当前轮次结束的时间
            setDisplayRoundTime(endTime - startTime + newFlashIntervalTime - 200); // 更新显示的耗时

          // 闪烁序列结束后，等待1秒后开始倒计时
          setTimeout(() => {
            stopGameLoseCountdown();
            beginGameLoseCountdown(); // 重新开始倒计时
          }, 1000);
          }, 200); // 等待最后一个按钮的闪烁结束
        }

      };
  
      // 开始第一个按钮的闪烁
      flashButton(0);
  
      return newArray;
    });
  };
  
  
  
  // When user clicks 1 of 4 GameButton
  const handleButtonClick = (number) => {
    stopGameLoseCountdown();
    beginGameLoseCountdown(); // 开始倒计时 
    
    if (gameArray[inputIndex] === number) {
      // Input Correct -> Update inputArray and inputIndex
      setInputArray(prevArray => [...prevArray, number]);
      setInputIndex(prevIndex => prevIndex + 1);
  
      // Whether inputed all elements of gameArray without error
      if (inputIndex + 1 === round) {
        //alert("You win in this round!");
        // 用户完成了当前轮次的所有输入，延迟1秒后开始新一轮
        setTimeout(() => {
          displayRound();
        }, 1000); // 等待1秒后开始新一轮
      }
    } else {
      // Input Error -> invoke 'GameOver' function
      gameOver();
    }
  };

  const beginGameLoseCountdown = () => {
    setIsCountingDown(true); // 开始倒计时
    setGameLoseCountdown(5); // 重置倒计时为5秒
  };

  const stopGameLoseCountdown = () => {
    setIsCountingDown(false); // 停止倒计时
    setGameLoseCountdown(5); // 重置倒计时为5秒
  };

  // 新的 handleButtonMouseDown 函数
  const handleButtonMouseDown = (color) => {
    setPressedButton(color); // 设置被按下的按钮颜色
    setTimeout(() => setPressedButton(''), 200); // 设置短暂的延迟后清除状态，以产生闪烁效果
  };

  useEffect(()=>{
    if(gameLoseCountdown ===0) gameOver();

  },[gameLoseCountdown])



  
  return (
    <div className = "App">
      Simon Game Controller 

      <div className = "Simon UI">
        <div className = "Dashboard Circle">
          <div className = "ScoreBoard-Bar">
            <button className="ScoreBoard Score">{highestRound}</button>
              <button className="ScoreBoard CtrlBtn" onClick={gameStart} disabled={startBtnPressed}>
                START
              </button>
            <button className="ScoreBoard Score">{currentRound}</button>
          </div>

          <div className="Indicator Circle" 
          style={{ backgroundColor: indicatorColor }}></div> 

          <div className={`GameButton Green Circle ${buttonFlash || flashingButton === 'Green' || pressedButton === 'Green' ? 'flash' : ''}`} 
               onMouseDown={() => handleButtonMouseDown('Green')} onClick={() => handleButtonClick(1)}></div>
          <div className={`GameButton Red Circle ${buttonFlash || flashingButton === 'Red' || pressedButton === 'Red' ? 'flash' : ''}`}
               onMouseDown={() => handleButtonMouseDown('Red')} onClick={() => handleButtonClick(2)}></div>
          <div className={`GameButton Yellow Circle ${buttonFlash || flashingButton === 'Yellow' || pressedButton === 'Yellow' ? 'flash' : ''}`} 
               onMouseDown={() => handleButtonMouseDown('Yellow')} onClick={() => handleButtonClick(3)}></div>
          <div className={`GameButton Blue Circle ${buttonFlash || flashingButton === 'Blue' || pressedButton === 'Blue' ? 'flash' : ''}`} 
               onMouseDown={() => handleButtonMouseDown('Blue')} onClick={() => handleButtonClick(4)}></div>
        </div>{/* end of Dashboard Circle */}
      </div> {/* end of Simon UI */}
      
      <div><b>Round: {round}</b></div>

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
