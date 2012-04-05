// dependencies
var express = require('express'),
    io      = require('socket.io');

var serverInfo = {
  ip: "localhost",
  port: 8080
};

var serverConfig = {
  maxPlayers: 20,
  speed: 20
};

var app = express();

// config
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// middleware

app.configure(function() {
  app.use(express.logger());
  app.use(express.static(__dirname + '/public'));
});

// routes

app.get('/', function(req, res) {
  res.render('index');
});


app.listen(8080);
io.listen(app);