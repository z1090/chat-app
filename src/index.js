const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
//happens behind scenes anyway, but needed for io config
const server = http.createServer(app)
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath));


io.on('connection', (socket) => {
    console.log('New websocket connection')
    
    socket.emit('message', 'Welcome!');

    socket.on('message', (message) => {
        io.emit('message', message);
    })
})

server.listen(port,() => {
    console.log('Server is up on port ' + port);
});