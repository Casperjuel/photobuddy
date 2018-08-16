import openSocket from "socket.io-client";

const socket = openSocket("http://localhost:8000");

function getImageData(cb) {
  socket.on("imageConversionByServer", imageData => {
      return imageData;
  });
}
export { getImageData };
