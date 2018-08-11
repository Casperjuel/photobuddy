import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.photo = "";
    this.startBracketing = this.startBracketing.bind(this);
  }

  startBracketing = () => {
    console.log("bracketing");
    axios
      .post("/test")
      .then(function(response) {
        console.log(response.data);
        document.querySelector('img').setAttribute('src', response.data)
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  startFocus = () => {
    console.log("focus");
  };
  render() {
    const { photo } = this;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <button onClick={this.startBracketing}>Trigger bracketing</button>
          <button onClick={this.startFocus}>Trigger focus</button>
          <img src="" alt="picture2" />
        </p>
      </div>
    );
  }
}

export default App;
