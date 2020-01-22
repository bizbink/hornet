const YAML = require('yaml');
const fs = require('fs');
const chalk = require('chalk');
const EventEmitter = require('events');
const Drone = require('./drone');
const StaticServer = require('./static_server');

class Hornet extends EventEmitter {

    constructor() {
        super();
        this.config = {};
        this.log = console.log;
        this.drone = null;
    }

    load(path) {
        let file = fs.readFileSync(path, 'utf8');
        this.config = {...this.config, ...YAML.parse(file)};
    }

    start() {
        let staticServer = new StaticServer();
        staticServer.start();
        this.log(chalk.green('HTTP server listening on port: ' + 8080));

        this.drone = new Drone(this.config);

        if (!this.config['debug']) {
            const Gpio = require('pigpio').Gpio;
            this.drone.motors.forEach(motor => {
                motor.gpio = new Gpio(motor.pin, {mode: Gpio.OUTPUT});
            });
        }
    }

    stop() {
        this.log(chalk.green('Terminating...'));
        if (!this.config['debug']) {
            this.drone.motors.forEach(motor => {
                motor.gpio.pwmWrite(0);
            });
        }
    }
}

module.exports = Hornet;