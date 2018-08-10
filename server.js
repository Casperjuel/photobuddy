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

app.post("/test", function(req, res) {
    GPhoto.list(list => {
        if (list.length === 0) return 'no camera';
        const picturePath = path.join(__dirname + "build/picture.jpg");
        const camera = list[0];
        console.log("Found", camera.model);
      
        camera.takePicture({targetPath: "/tmp/foo.XXXXXX"}, (er, tmpname) => {
            fs.renameSync(tmpname, picturePath);
          }
        ).then(function(result) {
            console.log("Promise worked");
            res.end(result);
          }, function(err) {
            console.log("Something broke");
            res.send(err);
          });
      });
});

const port = 8000;

//Run Server

app.listen(port);
