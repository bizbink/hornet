# Configuration

### Files

The default declarations are located in `resources/config/` directory:

- `motors.yml`
- `movements.yml`
- `pwm.yml`

#### Motors
A list of objects that represent each motors with property values:

| Property  | Usage                                   | Default | Example     |
| --------- | --------------------------------------- | ------- | ----------- |
| id        | Unique identifier for motor             |         | `m3`        |
| direction | Identifier for directional              |         | `cw`, `ccw` |
| pin       | Location of connected motor on header   |         | `18`        |

#### Movements
Rotational axes are defined with each having it's own set of adjustments for direction as `motors`; 
`yaw` is `clockwise` and `counter_clockwise`, `pitch` is `forward` and `backwards`, `roll` is `left` and `right`.

| Property  | Usage                                   | Default | Example       |
| --------- | --------------------------------------- | ------- | ------------- |
| id        | Unique identifier for motor             |         | `m3`          |
| adj       | Adjustment multiplier (-1 to 1)         |         | `.07`, `-.07` |

#### PWM
The pulse wave modulation is used for powering brushed motors. Overriding specific motors values are declared in
`motors` with a corresponding `id`. This is useful to adjust power for weight distribution by modifying `threshold`, 
`min`, and `max` values for `throttle`.

*Warning: Take precautions when modifying  `min` and `max`, these aren't absolute values for PWM. The current Raspberry 
Pi GPIO implementation exceeds an amount that's negligible, modifications could result in unexpected movements.*

| Property  | Usage                                   | Default | Example |
| --------- | --------------------------------------- | ------- | ------- |
| threshold | The minimum absolute value for lift     |         | m3      |
| min       | The minimum nominal value               |         | cw, ccw |
| max       | The maximum nominal value               |         | 18      |