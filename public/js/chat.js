const socket = io();


socket.on('message', (welcome) => {
    console.log(welcome);
})

//elements
const $messageForm = document.getElementById('form');
const $messageFormInput = document.getElementById('message-input');
const $messageFormButton = document.getElementById('message-btn');
const $sendLocationButton = document.getElementById('send-location');

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');
    socket.emit('sendMessage', e.target.elements.message.value, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if(error) {
            return console.log(error)
        }
    console.log('Message delivered')
    });
})

$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Get a real browser. Geolocation is not supported by your browser.')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocationButton', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }, (message) => {
            console.log(message);
            $sendLocationButton.removeAttribute('disabled');
        })
    })
})