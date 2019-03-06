import React, { Component } from 'react';
import './App.css';
import PetriNetView from './components/PetriNetView';
import ModelPicker from './components/ModelPicker';
import ReactGA from 'react-ga';

class App extends Component<{}, {}> {
  componentDidMount = () => {
    ReactGA.initialize('UA-135652424-1');
    ReactGA.pageview('/');
  }

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
