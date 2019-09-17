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

let count = 0;

io.on('connection', (socket) => {
    console.log('New websocket connection')

    socket.emit('countUpdated', count);

    socket.on('increment', () => {
        count++;
        //only emits to specific connection
        // socket.emit('countUpdated', count)
        
        //emits to all connections
        io.emit('countUpdated', count)
    })
})

server.listen(port,() => {
    console.log('Server is up on port ' + port);
});