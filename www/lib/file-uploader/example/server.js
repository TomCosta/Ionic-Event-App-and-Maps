var express = require('express');
var path = require('path');

var app = express();

var uploadPath = path.join(__dirname, 'uploads');
app.use(express.bodyParser({ uploadDir: uploadPath, keepExtensions: true }));
app.use(express.static(path.join(__dirname, '../bower_components')));
app.use(express.static(path.join(__dirname, '../dist')));
app.use("/uploads", express.static(uploadPath));

app.set("view options", {
  layout: false 
});

app.set("view engine", "jade");
app.set("views", "" + __dirname + "/views");

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/', function(req, res) {
  //slow file transfers down
  setTimeout(function() {
    res.send(req.files.image.path.replace(__dirname, ''));
  }, 5000);
});

var port = process.argv[2] || 8000;
console.log('Server started on port '+port);
app.listen(port);
