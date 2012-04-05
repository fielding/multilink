/* Author: Fielding Johnston
*/

$(document).ready(function() {
  var debug = true;
  var socket = io.connect("http://sage.local", {port: 8080});
  var nickInput = $("#nick");
  var submitBox = $("#submit");
  var loginBox = $("#dialog-form");
  var keyEnter = 13;


  var config = {
    maxPlayers: 20,
    speed: 5,
    spawnX: Math.floor(Math.random * 600),
    spawnY: Math.floor(Math.random * 600),
    animate: {
      easing: "linear",
      queue: false,
      duration: 500
    }
  };

  var Player = function(uid, nick) {
    this.userId = uid;
    this.nick = nick;
    this.elem = "#" + nick +"";
    this.spawnX = Math.floor(Math.random() * 600);
    this.spawnY = Math.floor(Math.random() * 600);
    this.posX = this.spawnX || 400;
    this.posY = this.spawnY || 400;
    this.movement = {
      movingLeft: false,
      movingUp: false,
      movingRight: false,
      movingDown: false,
      speed: 5
    },
    this.orientation = "right";
  };

  var Connection = function() {
    this.serverConfig = config;
    this.player = {};
    this.players = [];
  };

  var view = {
  };

  function keySmash(keyCode) {
    switch(keyCode) {
      case 37:
      connection.player.movement.movingLeft = true;
      if(debug){console.log("left");}
      break;
      case 38:
      connection.player.movement.movingUp = true;
      if(debug){console.log("up");}
      break;
      case 39:
      connection.player.movement.movingRight = true;
      if(debug){console.log("right");}
      break;
      case 40:
      connection.player.movement.movingDown = true;
      if(debug){console.log("down");}
      break;
      default:
    }
  }

  function keyRelease(keyCode) {
    switch(keyCode) {
      case 37:
      connection.player.movement.movingLeft = false;
      break;
      case 38:
      connection.player.movement.movingUp = false;
      break;
      case 39:
      connection.player.movement.movingRight = false;
      break;
      case 40:
      connection.player.movement.movingDown = false;
      break;
      default:
    }
  }

  function now() {
    d = new Date();
    return d.getTime();
  }

  function next(t) {
    return now() + t;
  }

  function sendMovement() {
    if(connection.player.movement.movingLeft) {        // lets move Left!
      connection.player.posX -= connection.player.movement.speed;
      connection.player.orientation = "left";
      if(debug){console.log("moving left from " + (connection.player.posX - connection.player.movement.speed) + " to " + connection.player.posX + "!");}
    }
    if(connection.player.movement.movingUp) {
      connection.player.posY -= connection.player.movement.speed;
      connection.player.orientation = "up";
      if(debug){console.log("moving up from " + (connection.player.posY  - connection.player.movement.speed) + " to " + connection.player.posY + "!");}
      // lets move Up!
    }
    if(connection.player.movement.movingRight) {
      connection.player.posX += connection.player.movement.speed;
      connection.player.orientation = "right";
      if(debug){console.log("moving right from " + (connection.player.posX + connection.player.movement.speed) + " to " + connection.player.posX + "!");}
      // lets move Right!
    }
    if(connection.player.movement.movingDown) {
      connection.player.posY += connection.player.movement.speed;
      connection.player.orientation = "down";
      if(debug){console.log("moving right from " + (connection.player.posY + connection.player.movement.speed) + " to " + connection.player.posY + "!");}
      // lets move Down!
    }
  }

  function sendNick() {
    $("#dialog-form").dialog('close');
    if(debug){console.log("Player " + connection.player.nick + " has joined the server!");}
    $('body').append('<div id=' + connection.player.nick + ' class="sprite"></div>');

  }

  function updateEnvironment() {
  }

  function updateCharacter() {
    $(connection.player.elem).offset({top: connection.player.posY, left: connection.player.posX});
    characterOrientation(connection.player.orientation);
  }

  function characterOrientation(fc) {
    $(connection.player.elem).css('-webkit-animation-name', function() {
    return "sprite-walking-" + fc;                               // change sprite animation to face left
  });
  }

  function gameInit() {
    connection = new Connection();
    connection.player = new Player(connection.players.length + 1, nickInput.val());
    sendNick();
    console.log("Game Initialized");
    worldly();
  }

  function worldly() {
    // receive
    updateEnvironment();
    updateCharacter();

    // send
    sendMovement();
    setTimeout(worldly, 20);
  }

  $(window).keydown(function(e) {
    // grab keyCode for keydown event
    keySmash(e.keyCode);
    if(debug){console.log(e.keyCode + "pressed");}
  });

  $(window).keyup(function(o) {
    keyRelease(o.keyCode);
    if(debug){console.log(o.keyCode + "released");}
  });

  loginBox.dialog({
    autoOpen: true,
    modal: true,
    height: 300,
    width: 400
  });

  $("#submit").click(function () {
    gameInit();
  });   // send nick if user clicks submit
  $("nick").keyup(function(e) {    // send nick if user uses enter key
  if (e.keyCode === keyEnter) {
    gameInit();
  }
  });

  socket.on('connect', function () {
    socket.send('A client connected.');
  });
  
  socket.on('message', function (message) {
    $('div#messages').append($('<p>'), message);
  });
    
  socket.on('disconnect', function () {
    console.log('disconnected');
  });

  socket.connect();
});









