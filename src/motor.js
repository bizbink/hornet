class Motor {

    constructor(id = null, direction = null, pin = null, throttle = {}) {
        this.id = id;
        this.direction = direction;
        this.pin = pin;
        this.throttle = {
            ...{threshold: null, min: null, max: null, nom: 1, adj: 0, abs: 1},
            ...throttle
        };
        this.gpio = null;
    }

    toReactObject() {
        return {id: this.id, throttle: this.throttle.abs};
    }
}

module.exports = Motor;