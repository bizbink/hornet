const Motor = require('./motor');

class Drone {
    constructor(config) {
        this.config = config;
        this.motors = [];
        this.oldMotors = [];
        this.axes = {yaw: 0, pitch: 0, roll: 0};

        this.config['motors'].forEach(declaration => {
            let motor = new Motor(declaration['id'], declaration['direction'], declaration['pin']);

            // Load default values for pmw throttle (e.g. min, max, threshold, etc.)
            motor.throttle = {...motor.throttle, ...this.config['pmw']['_defaults']['motor']['throttle']};

            // Load individual motors values that are overridden for pmw throttle
            let override = this.config['pmw']['motors'].find(override => override.id === motor.id);
            if (override !== undefined) {
                motor.throttle = {...motor.throttle, ...override['throttle']};
            }

            this.motors.push(motor);
        });
    }

    /**
     * Adjusts throttle of all four motor.
     *
     * @param value between -1 (negative one) and 1 (one)
     */
    throttle(value) {
        if (value > 0) {
            for (let i = 0; i < this.motors.length; i++) {
                let motor = this.motors[i];
                motor['throttle']['nom'] = motor['throttle']['threshold'] + (value * (motor['throttle']['max'] - motor['throttle']['threshold']));
                this.motors[i] = motor;
            }
        } else if (value < 0) {
            for (let i = 0; i < this.motors.length; i++) {
                let motor = this.motors[i];
                motor['throttle']['nom'] = motor['throttle']['threshold'] + (value * (motor['throttle']['threshold'] - motor['throttle']['min']));
                this.motors[i] = motor;
            }
        } else {
            for (let i = 0; i < this.motors.length; i++) {
                let motor = this.motors[i];
                motor['throttle']['nom'] = motor['throttle']['threshold'];
                this.motors[i] = motor;
            }
        }
    }

    /**
     * Rolls either left or right.
     *
     * @param value between -1 (negative one) and 1 (one)
     */
    yaw(value) {
        // Undo previous value
        let previousDirection;
        if (this.axes.yaw > 0) {
            previousDirection = 'counter_clockwise';
        } else if (this.axes.yaw < 0) {
            previousDirection = 'clockwise';
        }
        if (previousDirection !== undefined) {
            for (let i = 0; i < this.motors.length; i++) {
                let motor = this.motors[i];
                motor['throttle']['adj'] -= this.axes.yaw * this.config['movements']['yaw'][previousDirection]['motors']
                    .find(config_motor => config_motor.id === motor.id)['adj'];
                this.motors[i] = motor;
            }
        }

        // Apply current value
        this.axes.yaw = value;
        let currentDirection;
        if (value > 0) {
            currentDirection = 'counter_clockwise';
        } else if (value < 0) {
            currentDirection = 'clockwise';
        }
        if (currentDirection !== undefined) {
            for (let i = 0; i < this.motors.length; i++) {
                let motor = this.motors[i];
                motor['throttle']['adj'] += this.axes.yaw * this.config['movements']['yaw'][currentDirection]['motors']
                    .find(config_motor => config_motor.id === motor.id)['adj'];
                this.motors[i] = motor;
            }
        }
    }

    roll(value) {
        // Undo previous value
        let previousDirection;
        if (this.axes.roll > 0) {
            previousDirection = 'right';
        } else if (this.axes.roll < 0) {
            previousDirection = 'left';
        }
        if (previousDirection !== undefined) {
            for (let i = 0; i < this.motors.length; i++) {
                let motor = this.motors[i];
                motor['throttle']['adj'] -= this.axes.roll * this.config['movements']['roll'][previousDirection]['motors']
                    .find(config_motor => config_motor.id === motor.id)['adj'];
                this.motors[i] = motor;
            }
        }

        // Apply current value
        this.axes.roll = value;
        let currentDirection;
        if (value > 0) {
            currentDirection = 'right';
        } else if (value < 0) {
            currentDirection = 'left';
        }
        if (currentDirection !== undefined) {
            for (let i = 0; i < this.motors.length; i++) {
                let motor = this.motors[i];
                motor['throttle']['adj'] += this.axes.roll * this.config['movements']['roll'][currentDirection]['motors']
                    .find(config_motor => config_motor.id === motor.id)['adj'];
                this.motors[i] = motor;
            }
        }
    }

    pitch(value) {
        // Undo previous value
        let previousDirection;
        if (this.axes.pitch > 0) {
            previousDirection = 'forward';
        } else if (this.axes.pitch < 0) {
            previousDirection = 'backwards';
        }
        if (previousDirection !== undefined) {
            for (let i = 0; i < this.motors.length; i++) {
                let motor = this.motors[i];
                motor['throttle']['adj'] -= this.axes.pitch * this.config['movements']['pitch'][previousDirection]['motors'].find(config_motor => config_motor.id === motor.id)['adj'];
                this.motors[i] = motor;
            }
        }

        // Apply current value
        this.axes.pitch = value;
        let currentDirection;
        if (value > 0) {
            currentDirection = 'forward';
        } else if (value < 0) {
            currentDirection = 'backwards';
        }
        if (currentDirection !== undefined) {
            for (let i = 0; i < this.motors.length; i++) {
                let motor = this.motors[i];
                motor['throttle']['adj'] += this.axes.pitch * this.config['movements']['pitch'][currentDirection]['motors'].find(config_motor => config_motor.id === motor.id)['adj'];
                this.motors[i] = motor;
            }
        }
    }

    calculateAbsoluteThrottle() {
        this.motors.forEach((motor) => {
            let newAbs = Math.round(motor['throttle']['nom'] + (motor['throttle']['nom'] * (motor['throttle']['adj'])));
            if (motor.abs !== newAbs && newAbs >= motor.throttle.min && newAbs <= motor.throttle.max) {
                motor['throttle']['abs'] = newAbs;
            }
        });
    }
}

module.exports = Drone;