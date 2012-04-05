// dependencies
var express = require('express');

var serverInfo = {
  ip: "127.0.0.1",
  port: 8080
};

var serverConfig = {
  maxPlayers: 20,
  speed: 20
};

var app = express();
var server = app.listen(8080);
var io = require('socket.io').listen(server);

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


var players = [];

io.sockets.on('connection', function(socket) {
  console.log('A client connected:' + socket.id);
  socket.broadcast.send({announcement: socket.id + ' connected'});
  players.push(socket.id);
  socket.json.send(players);

  // handle messages from the client
  socket.on('message', function ( message ) {
    //TO DO: CHECK IF OUT USER EXISTS
    socket.send({ message: "got your message: " + message});
    socket.broadcast.send({ message: socket.id + " sent message: " + message});
  });
  socket.on('disconnect', function() {
    socket.broadcast.send({announcement: socket.id + ' disconnected'});

  });
});