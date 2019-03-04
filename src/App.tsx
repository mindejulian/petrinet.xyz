import React, { Component } from 'react';
import './App.css';
import PetriNetView from './components/PetriNetView';
import ModelPicker from './components/ModelPicker';

class App extends Component<{}, {}> {
  render() {
    return (
      <div className="App">
        <header className="App-header">

        </header>
        <ModelPicker />
        <PetriNetView />
      </div>
    );
  }
}

export default App;
