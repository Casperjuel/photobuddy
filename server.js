//Requires
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

var fs = require("fs");
var gphoto2 = require("gphoto2");
var GPhoto = new gphoto2.GPhoto2();

// Negative value or undefined will disable logging, levels 0-4 enable it.
GPhoto.setLogLevel(1);
GPhoto.on("log", function(level, domain, message) {
  console.log(domain, message);
});



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static Routes
app.use("/static", express.static(path.join(__dirname, "build/static")));

//Main App Route
app.get("/", (req, res, next) =>
  res.sendFile(path.join(__dirname, "build/index.html"))
);
function initialize() {
  return new Promise(function(resolve, reject) {
    GPhoto.list(list => {
      if (list.length === 0) reject("no camera");
      else {
        const picturePath = path.join("/static/picture.jpg");
        const camera = list[0];
        console.log("Found", camera.model);
        console.log(camera);
        camera.takePicture({download: true}, function (er, data) {
            fs.writeFileSync(__dirname + '/build/static/picture.jpg', data);
          });
        resolve(picturePath);
          
      }

    });
  });
}

app.post("/test", function(req, res) {
  var initializePromise = initialize();
  initializePromise.then(
    function(result) {
      console.log("Promise worked");
      res.end(result);
    },
    function(err) {
      console.log("Something broke");
      res.send(err);
    }
  );
});

const port = 8000;

//Run Server

app.listen(port);
