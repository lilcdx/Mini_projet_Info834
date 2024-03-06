const http = require('http');
const app = require('./app');
const { log } = require('console');
const { Server } = require("socket.io");


const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);


// ---------- Socket 
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    // transports: ['websocket'] 
  },

})

// list of connected users
let listUsersConnected = {};

// io.on('connect', () => {
//   socket.join(socket.handshake.auth.CHAT_ROOM);
//   console.log("a user connected : " + socket.handshake.auth.user.username);
// })

io.on("connection", (socket) => {

  if (socket.handshake.auth.CHAT_ROOM && socket.handshake.auth.user) {

    // join user's own room
    socket.join(socket.handshake.auth.CHAT_ROOM);
    console.log("a user connected : " + socket.handshake.auth.user.username);


    // add user to list of users connected if he's not already in
    if (!(socket.handshake.auth.user.id in listUsersConnected)) {
      listUsersConnected[socket.handshake.auth.user.id] = socket.handshake.auth.user;
    }


    socket.on("disconnect", () => {
      console.log("user disconnected : " + socket.handshake.auth.user.username);
    });

    socket.on("usersConnected", (roomName) => {

      // -- Send listUsersConnected of all members in the roomName
      io.in(roomName).emit("usersConnected", listUsersConnected);
    });

    socket.on("usersDisconnected", (roomName) => {
      // -- Remove the user disconnected from the list 
      delete listUsersConnected[socket.handshake.auth.user.id];

      // -- Send listUsersConnected of all members in the roomName
      io.in(roomName).emit("usersDisconnected", listUsersConnected);

    });

    socket.on("getUsers", (roomName) => {
      io.in(roomName).emit("usersConnected", listUsersConnected);
    });

    socket.on("joinChatRoom", (chatId, userSelectedId) => {
      // let roomName = socket.handshake.auth.user.id + "_" + userSelectedId;
      let roomName = chatId;
      console.log("--------------- JOIN : " + chatId);
      socket.join(chatId);

      socket.on('message', (content) => {
        // console.log("Sender: " + socket.handshake.auth.user.id);
        // console.log("Receiver :" + userSelectedId);
        // console.log(content);
        io.in(chatId).emit("message", {idChat: chatId, content: content,  timestamp: new Date().toISOString(), idSender: socket.handshake.auth.user.id});

        
      })
     
    });


  }

  // console.log("socket id : " + socket.id);

  // console.log("Chat room: " + socket.handshake.auth.CHAT_ROOM);
  // console.log("User: " + socket.handshake.auth.user);



  //     // console.log('prout 💨');
  //     listUsersConnected.pop(socket.handshake.auth.userId);

  //     console.log("usersConnected updated: " + listUsersConnected);
  //     console.log(listUsersConnected);

  //     // socket.to(roomName).emit("usersDisconnected", listUsersConnected);
  //     io.in(roomName).emit("usersDisconnected", listUsersConnected);
  // });

  // socket.on("join", (roomName) => {
  //     console.log("join: " + roomName);
  //     socket.join(roomName);
  //     socket.join('myRandomChatRoomId');
  // });

  // socket.on("message", ({ message, roomName }) => {
  //     console.log("message: " + message + " in " + roomName);

  //     const room = io.sockets.adapter.rooms.get('myRandomChatRoomId');
  //     if (room) {
  //         room.forEach(socketId => {
  //             console.log(socketId);
  //         });
  //     }
  //     // send socket to all in room except sender
  //     socket.to(roomName).emit("message", { msg: message, userId: socket.userId });
  // });

  // socket.on("my message", (msg) => {
  //   console.log("message: " + msg);
  //   io.emit("my broadcast", `server: ${msg}`);
  // });

});

// io.use(async (socket, next) => {
//   // fetch token from handshake auth sent by FE
//   // const token = socket.handshake.auth.token;
//   try {
//       // verify jwt token and get user data
//       //   const user = await jwt.verify(token, JWT_SECRET);
//       const userId = socket.handshake.auth.userId;
//       // console.log(socket.handshake.auth);
//       console.log('userId: ', userId);
//       // save the user data into socket object, to be used further
//       socket.userId = userId;
//       next();
//   } catch (e) {
//       // if token is invalid, close connection
//       console.log('error', e.message);
//       return next(new Error(e.message));
//   }
// });


// ---------- Server
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
