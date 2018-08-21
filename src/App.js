import React, { Component, Fragment } from "react";
import "./App.css";
import axios from "axios";
import openSocket from "socket.io-client";

import {
  Button,
  Box,
  Text,
  Image,
  Spinner,
  Column,
  Icon,
  Divider,
  Link
} from "gestalt";
import "gestalt/dist/gestalt.css";

const socket = openSocket("http://localhost:8000");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageData: null,
      imageList: [],
      loading: false
    };

    socket.on("newImage", data => {
      this.setState({ imageData: data });
      this.setState({ loading: false });
    });

    socket.on("getImagesList", data => {
      this.setState({ imageList: data });
      this.setState({ loading: false });
      console.log(data);
    });

    this.startBracketing = this.startBracketing.bind(this);
    this.showImage = this.showImage.bind(this);
  }

  startBracketing = () => {
    this.setState({ loading: true });
    axios
      .post("http://localhost:8080/test")
      .then(function(response) {
        console.log("succes", response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  showImage = name => {};

  startFocus = () => {
    console.log("focus");
  };

  render() {
    return (
      <div className="App">
        <Box
          display="flex"
          flex="none"
          direction={"column"}
          alignSelf="auto"
          alignContent="center"
          alignItems="center"
          margin={12}
        >
          <Box width={320}>
            <Box
              alignSelf="auto"
              height={320}
              width={320}
              color="darkWash"
              marginBottom={5}
              justifyContent="center"
              alignItems="center"
              display="flex"
            >
              {!this.state.imageData &&
                !this.state.loading && (
                  <Icon
                    icon="camera"
                    accessibilityLabel="camera"
                    color="gray"
                    size={120}
                  />
                )}
              <Spinner
                show={this.state.loading}
                accessibilityLabel="Example spinner"
              />
              {this.state.imageData &&
                !this.state.loading && (
                  <Box alignSelf="center" width={320} height={320}>
                    <Image
                      alignSelf="auto"
                      alt="Tropic greens: The taste of Petrol and Porcelain | Interior design, Vintage Sets and Unique Pieces agave"
                      color="rgb(231, 186, 176)"
                      naturalHeight={600}
                      naturalWidth={600}
                      src={this.state.imageData}
                    />
                  </Box>
                )}
            </Box>
            <Button
              color={this.state.loading ? "gray" : "red"}
              icon="favorite"
              text="Take picture"
              onClick={this.startBracketing}
            />
          </Box>
        </Box>
        <Divider />

        <Box margin={12}>
          <Text align="center" bold size="xl">
            {"Gallery listing all the images in public/pictures folder"}
          </Text>
        </Box>
        <Box
          display="flex"
          wrap
          alignItems="center"
          justifyContent="center"
          direction="row"
          flex="grow"
        >
          {this.state.imageList &&
            this.state.imageList.map((value, key) => (
              <Box minHeight={320} key={key} minWidth={320}>
                <Link inline href={`/pictures/${value}`}>
                  <Image
                    alt={value}
                    color="rgb(231, 186, 176)"
                    naturalHeight={3200}
                    naturalWidth={3200}
                    src={`/pictures/${value}`}
                    onClick={this.showImage(value)}
                  >
                    <Box
                      dangerouslySetInlineStyle={{
                        __style: { mixBlendMode: "difference" }
                      }}
                      padding={3}
                    >
                      <Text color="white">{value}</Text>
                    </Box>
                  </Image>
                </Link>
              </Box>
            ))}
        </Box>
      </div>
    );
  }
}

export default App;
