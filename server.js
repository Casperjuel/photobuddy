var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");
var chokidar = require("chokidar");
var gphoto2 = require("gphoto2");
var GPhoto = new gphoto2.GPhoto2();
var fs = require("fs");

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.post("/test", function(req, res) {
  var takePhotoPromise = takePhoto();
  takePhotoPromise.then(
    function(result) {
      res.end(result);
    },
    function(err) {
      res.send(err);
    }
  );
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(8080);

// Negative value or undefined will disable logging, levels 0-4 enable it.
GPhoto.setLogLevel(1);
GPhoto.on("log", function(level, domain, message) {
  console.log(domain, message);
});

const imageDir = "./public/pictures/";
var watcher = chokidar.watch(imageDir, {
  ignored: ".DS_Store",
  persistent: true
});

function takePhoto() {
  return new Promise(function(resolve, reject) {
    GPhoto.list(list => {
      if (list.length === 0) reject("no camera");
      else {
        const camera = list[0];
        console.log("Found", camera.model);

        camera.takePicture({ download: true }, function(er, data) {
          fs.writeFileSync(__dirname + imageDir + "/picture.jpg", data);
        });
      }
    });
  });
}

io.on("connection", function(socket) {
  findImages(socket);
  watcher
    .on("add", function(path) {
      console.log("File", path, "has been added");
      fs.readFile(path, function(err, data) {
        socket.emit(
          "newImage",
          "data:image/png;base64," + data.toString("base64")
        );
      });
    })
    .on("change", function(path) {
      findImages(socket);
    })
    .on("unlink", function(path) {
      console.log("File", path, "has been removed");
    })
    .on("error", function(error) {
      console.error("Error happened", error);
    });
});

const findImages = socket => {
  fs.readdir(imageDir, function(err, list) {
    var fileType = ".png",
      files = [],
      i;
    for (i = 0; i < list.length; i++) {
      if (path.extname(list[i]) === fileType) {
        files.push(list[i]); //store the file name into the array files
      }
    }
    socket.emit("getImagesList", files);
    console.log(files);
  });
};


http.listen(8000, function() {
  console.log("listening on *:8000");
});
