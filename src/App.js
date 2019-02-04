import React, { Component } from 'react';
import './App.css';
import Place from './components/Place';
import Transition from './components/Transition';
import Line from './components/Line';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
      
        </header>
        <svg width="1000" height="1000" viewBox="0 0 1000 1000" style={{"background-color":  "gray"}}>
          <Transition title="Start" x="10" y="50"></Transition>
          <Place title="Open App" x="210" y="100"></Place>
          <Line x1="22" y1="75" x2="210" y2="100"></Line>
        </svg>
      </div>
    );
  }
}

export default App;
