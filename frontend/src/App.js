import React from 'react';
import './App.css'

function App() {
  return (
    <div className = "App">
      Simon Game Controller
      <div className = "Container">
        <div className = "Dashboard Black Circle"></div>
        <div className = "Hidden Circle"></div>
      </div>
      <div className = "Container">
        <div className = "GameButton Green Circle"></div>
        <div className = "GameButton Red Circle"></div>
        <div className = "GameButton Yellow Circle"></div>
        <div className = "GameButton Blue Circle"></div>
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
