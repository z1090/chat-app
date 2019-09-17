const socket = io();


socket.on('message', (message) => {
    console.log(message);
})

const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit('message', e.target.elements.message.value)
})

document.getElementById('send-location').addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Get a real browser. Geolocation is not supported by your browser.')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        })
    })
})