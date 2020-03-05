const Hornet = require('./src/hornet');
const io = require('socket.io')(3030);
const chalk = require('chalk');

let hornet = new Hornet();

hornet.load(__dirname + '/resources/config/motors.yml');
hornet.load(__dirname + '/resources/config/movements.yml');
hornet.load(__dirname + '/resources/config/pwm.yml');

io.on('connection', socket => {
    let motors = [];
    hornet.drone.motors.forEach(motor => {
        motors.push(motor.toReactObject());
    });
    socket.emit('initializeMotors', motors);

    console.log(chalk.green('Controlled connected.'));
    socket.on('axis_move', data => {
        let {axisMovementValue, axis} = data;
        switch (axis) {
            case 0:
                hornet.emit('movement', {type: 'roll', value: axisMovementValue});
                break;
            case 1:
                hornet.emit('movement', {type: 'pitch', value: axisMovementValue});
                break;
            case 2:
                hornet.emit('movement', {type: 'yaw', value: axisMovementValue});
                break;
            case 3:
                hornet.emit('movement', {type: 'throttle', value: axisMovementValue});
                break;
        }
    });

    socket.on('ping', function () {
        socket.emit('pong');
    });

    hornet.on('movement', (movement) => {
        switch (movement.type) {
            case 'roll':
                hornet.drone.roll(movement.value);
                break;
            case 'pitch':
                hornet.drone.pitch(movement.value);
                break;
            case 'yaw':
                hornet.drone.yaw(movement.value);
                break;
            case 'throttle':
                hornet.drone.throttle(movement.value);
                break;
        }

        hornet.drone.motors.forEach((motor) => {
            let newAbs = Math.round(motor.throttle.nom + (motor.throttle.nom * (motor.throttle.adj)));
            if (newAbs <= 255) {
                motor.throttle.abs = newAbs;

            }
        });

        hornet.drone.motors.forEach(motor => {
            if (motor.gpio !== null) {
                motor.gpio.pwmWrite(motor.throttle.abs);
            }
        });

        io.sockets.emit('motors', hornet.drone.motors);
    });
});
console.log(chalk.green('Drone listening on port: ' + 3030));

module.exports = hornet;