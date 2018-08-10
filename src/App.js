import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  render() {
    const startBracketing = () => {
      console.log("bracketing");
    };

    const startFocus = () => {
      console.log("focus");
    };

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <button onClick={startBracketing}>Trigger bracketing</button>
          <button onClick={startFocus}>Trigger focus</button>
        </p>
      </div>
    );
  }
}

export default App;
