const socket = io();


//elements
const $messageForm = document.getElementById('form');
const $messageFormInput = document.getElementById('message-input');
const $messageFormButton = document.getElementById('message-btn');
const $sendLocationButton = document.getElementById('send-location');
const $messages = document.getElementById('messages');

//templates
const messageTemplate = document.getElementById('message-template').innerHTML;
const locationMsgTemplate = document.getElementById('location-message-template').innerHTML;

console.log(locationMsgTemplate)

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message,
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

socket.on('locationMessage', (url) => {
    console.log(url);
    const html = Mustache.render(locationMsgTemplate, {
        url
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

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
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }, (message) => {
            console.log(message);
            $sendLocationButton.removeAttribute('disabled');
        })
    })
})
