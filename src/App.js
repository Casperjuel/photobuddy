import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

class App extends Component {
  constructor() {
    super();
    this.state = { photo: "" };
  }

  startBracketing = () => {
    console.log("bracketing");
    axios.post('/test')
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
    this.setState({ photo: "https://source.unsplash.com/random" });
  };

  startFocus = () => {
    console.log("focus");
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <button onClick={this.startBracketing}>Trigger bracketing</button>
          <button onClick={this.startFocus}>Trigger focus</button>
          {this.state.photo && <img src={this.state.photo} alt="picture2" />}
        </p>
      </div>
    );
  }
}

export default App;
