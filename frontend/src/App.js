import React from 'react';
import './App.css'

function App() {
  
  return (
    <div className = "App">
      Simon Game Controller

      <div className = "Simon UI">
        <div className = "Dashboard Circle">
          <div className = "ScoreBoard-Bar">
            <button className="ScoreBoard Score">10</button>
            <button className="ScoreBoard CtrlBtn">START</button>
            <button className="ScoreBoard Score">04</button>
          </div>

          <div className="Indicator Circle"></div> 

          <div className="GameButton Green Circle"></div>
          <div className="GameButton Red Circle"></div>
          <div className="GameButton Yellow Circle"></div>
          <div className="GameButton Blue Circle"></div>
        </div>
      </div> {/* end of Simon UI */}
    </div>
  );
}

export default App;
