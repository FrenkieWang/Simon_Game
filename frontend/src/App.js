import React from 'react';
import './App.css'

function App() {
  return (
    <div className = "App">
      Simon Game Controller
      <div className = "Dashboard"></div>
      <div className = "Container">
        <div className = "GameButton Yellowgreen"></div>
        <div className = "GameButton Orangered"></div>
        <div className = "GameButton Gold"></div>
        <div className = "GameButton Dodgerblue"></div>
      </div>
      <div className = "Container XXX">
        <button className="NumButton">10</button>
        <button className="NumButton">START</button>
        <button className="NumButton">04</button>
      </div>
      <div className = "Container">
        <div className = "Indicator Orangered"></div>
        <div className = "Indicator Yellowgreen"></div>
      </div>


    </div>
  );
}

export default App;
