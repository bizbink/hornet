import '/node_modules/joypad.js/dist/joypad.min.js';

let heading = document.getElementById('heading');
let message = document.getElementById('message');

let connectionStatus = document.getElementById('connectionStatus');
let connectionPing = document.getElementById('connectionPing');

let axesElements = {
    leftAxisX: document.getElementById('leftAxisX'),
    leftAxisY: document.getElementById('leftAxisY'),
    rightAxisX: document.getElementById('rightAxisX'),
    rightAxisY: document.getElementById('rightAxisY')
};

let propellerElements = {
    propellerTopLeft: document.getElementById('propellerTopLeft'),
    propellerTopRight: document.getElementById('propellerTopRight'),
    propellerBottomLeft: document.getElementById('propellerBottomLeft'),
    propellerBottomRight: document.getElementById('propellerBottomRight')
};

let time = {startTime: null, endTime: null};

let host = 'http://' + window.location.hostname + ':3030';

function updateSocketInfo(e) {
    connectionStatus.innerText = "Socket connected: " + host;
}

function resetSocketInfo(e) {
    connectionStatus.innerText = "Socket disconnected: " + host;
}

function updateControllerInfo(e) {
    const {gamepad} = e;
    heading.innerText = 'Controller connected!';
    message.innerText = gamepad.id;
}

function resetControllerInfo(e) {
    heading.innerText = 'No controller connected!';
}

function updateAxises(data) {
    const {axisMovementValue, axis} = data;
    let value = (Math.abs(axisMovementValue) < .1 ? 0.0.toFixed(2) : axisMovementValue);

    switch (axis) {
        case 0:
            axesElements.leftAxisX.innerText = value.toString();
            break;
        case 1:
            axesElements.leftAxisY.innerText = value.toString();
            break;
        case 2:
            axesElements.rightAxisX.innerText = value.toString();
            break;
        case 3:
            axesElements.rightAxisY.innerText = value.toString();
            break;
    }
}

let socket = io(host);

resetControllerInfo();
resetSocketInfo();

joypad.set({axisMovementThreshold: 0.01});

joypad.on('connect', e => {
    updateControllerInfo(e);
    updateSocketInfo(e);
});

joypad.on('disconnect', e => {
    resetControllerInfo(e);
    resetSocketInfo(e);
});

let movements = [];
joypad.on('axis_move', e => {
    let {axisMovementValue, axis} = e.detail;
    axisMovementValue = axisMovementValue.toFixed(2);

    if (movements[axis] !== axisMovementValue) {
        updateAxises({axisMovementValue, axis});
        socket.emit('axis_move', {axisMovementValue, axis});
        time.startTime = new Date().getTime();
        movements[axis] = axisMovementValue;
    }
});

socket.on('motors', function (data) {
    time.endTime = new Date().getTime();
    connectionPing.innerText = ((time.endTime - time.startTime) / 1000).toString() + "ms";

    data.forEach(motor => {
        switch (motor['id']) {
            case 'm1':
                propellerElements.propellerTopLeft.innerText = motor['throttle']['abs'].toFixed(2).toString();
                break;
            case 'm2':
                propellerElements.propellerTopRight.innerText = motor['throttle']['abs'].toFixed(2).toString();
                break;
            case 'm3':
                propellerElements.propellerBottomLeft.innerText = motor['throttle']['abs'].toFixed(2).toString();
                break;
            case 'm4':
                propellerElements.propellerBottomRight.innerText = motor['throttle']['abs'].toFixed(2).toString();
                break;
        }
    })
});