'use strict';

const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const auth = require('./lib/auth');
const Message = require('./lib/message.schema');
const User = require('./lib/user.schema');

app.use(cors());
app.use(morgan('dev'));

let db = {
  messages: [],
  users: [],
};

function bodyParser(request, response, next) {
  request.on('data', (chunk) => {
    request.body = JSON.parse(chunk.toString());
    next();
  });
}

app.post('/signup', bodyParser, (req, res, next) => {
  console.log(req.body);
  let user = new User(req.body);
  if (user) {
    db.users.push(user);
    req.token = user.generateToken();
    req.user = user;
    console.log('***** SIGNIN SUCCESS *****');
    res.set('token', req.token);
    res.cookie('auth', req.token);
    res.send(req.token);
  } else {
   next('no user');
  }
});

app.post('/signin', auth(db.users), (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

app.get('/messages', auth(db.users),(req, res, next) => {
  res.send(db.messages);
});

app.post('/messages', auth(db.users), bodyParser, (req, res, next) => {
  const message = new Message(req.body.text);
  db.messages.push(message);
  io.emit('MESSAGE_POST', message);
  res.send(message);
});

io.on('connection', (socket) => {
  console.log('Client connected: ', socket.id);
  socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected`);
  });
});

http.listen(3030, () => {
  console.log('App listening on port 3030');
});