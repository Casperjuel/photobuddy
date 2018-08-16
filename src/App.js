import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import openSocket from "socket.io-client";

const socket = openSocket("http://localhost:8000");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageData: null,
      imageList: []
    };

    socket.on("newImage", data => {
      this.setState({ imageData: data });
    });

    socket.on("getImagesList", data => {
      this.setState({ imageList: data });

      console.log(data);
    });

    this.startBracketing = this.startBracketing.bind(this);
  }

  startBracketing = () => {
    axios
      .post("http://localhost:8080/test")
      .then(function(response) {
        console.log(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
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
          {this.state.imageData && 

          <img src={this.state.imageData} alt="latest" />
          }
        </p>
        <h3>Gallery listing all the images in public/pictures folder</h3>
        <div>
          {this.state.imageList.map((value, key) => (
            <img alt={value} key={key} src={`/pictures/${value}`} />
          ))}
        </div>
      </div>
    );
  }
}

export default App;
