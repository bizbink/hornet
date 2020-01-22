# Hornet
A simple NodeJS project that makes Raspberry Pi's fly ![logo](public/images/logo_20x20.png)

### Requirements

- NodeJS v10.0^

### Installation

1. Run `npm i -g node-gyp prebuild-install`
2. Download with `git clone https://github.com/bizbink/hornet`
3. Install with `npm install -g ./hornet`
3. Run with `hornet`

### Configuration
There are two options; modify files in `resources/config` directory, or use CLI `-c <path>` option 
to load another.

###### Configuration files
Here is a short explanation of `resources/config/motors.yml` file that declares motor direction and pin,
this is the minimal amount necessary to make the drone responsive to controller.

```yaml
motors:
  - { id: m1, direction: cw, pin: 17 }
  - { id: m2, direction: ccw, pin: 18 }
  - { id: m3, direction: cw, pin: 19 }
  - { id: m4, direction: ccw, pin: 21 }
```

| Property  | Usage                                   | Default | Example |
| --------- | --------------------------------------- | ------- | ------- |
| id        | Unique identifier for motor             |         | m3      |
| direction | Identifier for directional              |         | cw, ccw |
| pin       | Location of connected motor on header   |         | 18      |

When loading another file (to override), the structure must be the same. It's recommended to read the
full documentation 

###### Using CLI to load configuration
The CLI option is useful for implementing multiple drones that have varying weight 
distribution and/or motors.

```bash
hornet start -c $HOME/hornet/movment_6_motors.yml $HOME/hornet/pmw_6_motors.yml
```

###### Conclusion and further reading
It's recommended to secure the drone to surface before running. There's a large possibility further
configuration is required for expected results.

Read the full documentation [here](resources/doc/config.md) for configuration.