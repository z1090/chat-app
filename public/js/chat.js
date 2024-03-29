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
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML;

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
    //New message element
    const $newMessage = $messages.lastElementChild

    //Height of new meesage
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = $messages.offsetHeight;

    //Height of messages container
    const containerHeight = $messages.scrollHeight;

    //How far have I scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a'),
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.on('locationMessage', (message) => {
    console.log(message.url);
    const html = Mustache.render(locationMsgTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a'),
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');
    socket.emit('sendMessage', e.target.elements.message.value, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if (error) {
            return console.log(error)
        }
        console.log('Message delivered')
    });
})

socket.on('roomData', ({room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users,
    });
    document.getElementById('sidebar').innerHTML = html;
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
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

socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error);
        location.href = '/';
    }
});