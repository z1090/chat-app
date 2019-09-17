const socket = io();


socket.on('message', (message) => {
    console.log(message);
})

const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit('message', e.target.elements.message.value)
})