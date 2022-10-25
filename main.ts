const mbId = "1"
const isVba = true;

/****
 * Device control variables
 */

/*
    Sensor List
*/

// Sensors
let sensor = {
    enabled: true,
    type: SensorType.Distance,
    pin: ThreePort.One,
    minTrigger: 5,
    maxTrigger: 15,
    readDelay: 300
}


/*
    Servo List
    You do not need to add or remove any servos, but you can alter the max/min if needed

    stype: s (position) | c (continuous rotation)
    max/min: Clamp rotation speed or position
        rotation extremes: full reverse = -100, full forward = 100
        position extremes: 0 - 180
*/
let servos = [
    {
        port: "1",
        stype: "r",
        pin: FourPort.One,
        state: 0,
        min: -100,
        max: 100,
        fudge: 0,
        startState: 0,
        invert: false
    },
    {
        port: "2",
        pin: FourPort.Two,
        stype: "r",
        state: 0,
        min: -100,
        max: 100,
        fudge: 0,
        startState: 0,
        invert: false
    },
    {
        port: "3",
        pin: FourPort.Three,
        stype: "p",
        state: 0,
        min: 0,
        max: 180,
        fudge: 0,
        startState: 0,
        invert: false
    },
    {
        port: "4",
        pin: FourPort.Four,
        stype: "p",
        state: 0,
        min: 10,
        max: 150,
        fudge: 0,
        startState: 0,
        invert: false
    }
];

// let rovers = [
//     {
//         id: "1",
//         fudge: 5,
//         speedLimitStraight: 0,
//         speedLimitTurn: 0,
//         staticSpeedStraight: 75,
//         staticSpeedTurn: 50,
//         leftMotor: {
//             pin: FourPort.Two,
//             rotateForward: true
//         },
//         rightMotor: {
//             pin: FourPort.One,
//             rotateForward: false
//         }
//     }
// ];

// let provers = [
//     {
//         id: "1",
//         leftMotor: {
//             pin: FourPort.Two,
//             rotateForward: true
//         },
//         rightMotor: {
//             pin: FourPort.One,
//             rotateForward: false
//         },
//         fudge: 5,
//         speedLimitStraight: 0,
//         speedLimitTurn: 0,
//         staticSpeedStraight: 75,
//         staticSpeedTurn: 50,
//         straightDistance: 10,
//         turnDistance: 90,
//         pause: 500
//     }
// ];

// led.enable(false)
let leds = [
    {
        port: "1",
        state: 0,
        pin: ThreePort.One
    },
    {
        port: "2",
        state: 0,
        pin: ThreePort.Two
    },
    {
        port: "3",
        state: 0,
        pin: ThreePort.Three
    }
];
let trileds = [
    {
        port: "1",
        redState: 0,
        greenState: 0,
        blueState: 0,
        pin: TwoPort.One
    },
    {
        port: "2",
        redState: 0,
        greenState: 0,
        blueState: 0,
        pin: TwoPort.Two
    }
];

// let botheads = [
//     {
//         id: "1",
//         horizontal: {
//             pin: FourPort.One,
//             min: 60,
//             max: 126,
//             center: 90,
//             current: 90,
//             inverse: false,
//             increment: 2
//         },
//         vertical: {
//             pin: FourPort.Two,
//             min: 140,
//             max: 180,
//             center: 162,
//             current: 162,
//             inverse: false,
//             increment: 1
//         }
//     }
// ]

// let botheads = [
//     {
//         id: "1",
//         horizontal: {
//             pin: FourPort.One,
//             min: 0,
//             max: 45,
//             center: 22,
//             current: 22,
//             inverse: false,
//             increment: 2
//         },
//         vertical: {
//             pin: FourPort.Two,
//             min: 150,
//             max: 180,
//             center: 160,
//             current: 160,
//             inverse: false,
//             increment: 1
//         }
//     }
// ];

/******
 * Platform Specific Functions
 */

hummingbird.startHummingbird();

function controlLed(id: string, newState: number) {
    let foundLeds = [];
    if (id == '*') {
        foundLeds = leds;
    } else {
        foundLeds.push(leds.find(function (value: any, index: number) {
            return value.port == id;
        }));
    }
    // let foundLed = 
    foundLeds.forEach(foundLed => {
        if (foundLed) {
            if (newState != foundLed.state) {
                hummingbird.setLED(foundLed.pin, newState);
                foundLed.state = newState;
            }
            // return true;
        }
        // return false;
    });
}

function controlTriLed(id: string, newRedState: number, newGreenState: number, newBlueState: number) {
    let foundTriLeds = [];
    if (id == '*') {
        foundTriLeds = trileds;
    } else {
        foundTriLeds.push(trileds.find(function (value: any, index: number) {
            return value.port == id;
        }));
    }

    foundTriLeds.forEach(foundTriLed => {
        if (foundTriLed) {
            // let newStates = {
            //     red: convertLed(newState[0]),
            //     green: convertLed(newState[1]),
            //     blue: convertLed(newState[2])
            // };
            if (newRedState != foundTriLed.redState || newGreenState != foundTriLed.greenState || newBlueState != foundTriLed.blueState) {
                // if (newStates.red != foundTriLed.redState || newStates.green != foundTriLed.greenState || newStates.blue != foundTriLed.blueState) {
                hummingbird.setTriLED(foundTriLed.pin, newRedState, newGreenState, newBlueState)
                foundTriLed.redState = newRedState
                foundTriLed.greenState = newGreenState
                foundTriLed.blueState = newBlueState
            };
            // basic.showString(`${newStates.red}${newStates.green}${newStates.blue}`)
            // return true;
        }
    });
    // return false;
}

function controlServo(id: string, stype: string, newState: number) {
    let foundServo = servos.find(function (value: any, index: number) {
        return (value.port == id && value.stype == stype);
    })
    if (foundServo) {
        if (newState != foundServo.state) {
            if (stype == "p") {
                newState = Math.constrain((foundServo.invert ? 180 - newState : newState), foundServo.min, foundServo.max)
                hummingbird.setPositionServo(foundServo.pin, newState);
            } else {
                newState = Math.constrain((foundServo.invert ? newState * -1 : newState), foundServo.min, foundServo.max)
                if (newState < 0 && newState >= foundServo.min) {
                    newState -= foundServo.fudge;
                }
                hummingbird.setRotationServo(foundServo.pin, newState);
            }
            foundServo.state = newState;
        }
        return true;
    }
    return false;
}

// function adjustBotSpeed(bot: any, direction: string, speed: any) {
//     if (direction == 'f' || direction == 'b') {
//         if (bot.static_speed_straight) {
//             speed = bot.static_speed_straight;
//         } else if (bot.speedLimitStraight) {
//             speed = speed > bot.speedLimitStraight ? bot.speedLimitStraight : speed;
//         }
//     } else if (direction == 'l' || direction == 'r') {
//         if (bot.static_speed_turn) {
//             speed = bot.static_speed_turn;
//         } else if (bot.speedLimitTurn) {
//             speed = speed > bot.speedLimitTurn ? bot.speedLimitTurn : speed;
//         }
//     }
//     return speed;
// }

// function controlRover(id: string, direction: string, speed: number) {
//     let foundBot = rovers.find(function (value: any, index: number) {
//         return (value.id == id);
//     })
//     if (foundBot) {
//         speed = adjustBotSpeed(foundBot, direction, speed);
//         switch (direction) {
//             case 'f':
//                 hummingbird.setRotationServo(foundBot.leftMotor.pin, foundBot.leftMotor.rotateForward ? speed : ((speed + foundBot.fudge) * -1));
//                 hummingbird.setRotationServo(foundBot.rightMotor.pin, foundBot.rightMotor.rotateForward ? speed : ((speed + foundBot.fudge) * -1));
//                 break;
//             case 'b':
//                 hummingbird.setRotationServo(foundBot.leftMotor.pin, foundBot.leftMotor.rotateForward ? (speed + foundBot.fudge) * -1 : speed);
//                 hummingbird.setRotationServo(foundBot.rightMotor.pin, foundBot.rightMotor.rotateForward ? (speed + foundBot.fudge) * -1 : speed);
//                 break;
//             case 'r':
//                 hummingbird.setRotationServo(foundBot.leftMotor.pin, foundBot.leftMotor.rotateForward ? speed : (speed + foundBot.fudge) * -1);
//                 hummingbird.setRotationServo(foundBot.rightMotor.pin, foundBot.rightMotor.rotateForward ? (speed + foundBot.fudge) * -1 : speed);
//                 break;
//             case 'l':
//                 hummingbird.setRotationServo(foundBot.leftMotor.pin, foundBot.leftMotor.rotateForward ? (speed + foundBot.fudge) * -1 : speed);
//                 hummingbird.setRotationServo(foundBot.rightMotor.pin, foundBot.rightMotor.rotateForward ? speed : (speed + foundBot.fudge) * -1);
//                 break;
//             case 's':
//                 hummingbird.setRotationServo(foundBot.leftMotor.pin, 0);
//                 hummingbird.setRotationServo(foundBot.rightMotor.pin, 0);
//                 break;
//         }
//     } else {
//         basic.showString(`Rover ${id} not found`);
//     }
// }

// function controlProgRover(id: string, direction: string, speed: number) {
//     let foundBot = provers.find(function (value: any, index: number) {
//         return (value.id == id)
//     })
//     if (foundBot) {
//         speed = adjustBotSpeed(foundBot, direction, speed);
//         switch (direction) {
//             case 'f':
//                 break;
//             case 'b':
//                 break;
//             case 'r':
//                 break;
//             case 'l':
//                 break;
//             case 's':
//                 break;
//             default:
//                 basic.showString("?");
//         }
//     } else {
//         basic.showString(`PRover ${id} not found`)
//     }
// }

// function controlBotHead(id: string, direction: string) {
//     let foundBot = botheads.find(function (value: any, index: number) {
//         return (value.id == id);
//     })
//     if (foundBot) {
//         let newPosition: number;
//         // basic.showString("*h*")
//         switch (direction) {
//             case 'u':
//                 newPosition = foundBot.vertical.inverse ? foundBot.vertical.current - foundBot.vertical.increment : foundBot.vertical.current + foundBot.vertical.increment;
//                 if (newPosition < foundBot.vertical.max && newPosition > foundBot.vertical.min) {
//                     // basic.showString("*u*")
//                     foundBot.vertical.current = newPosition;
//                     hummingbird.setPositionServo(foundBot.vertical.pin, foundBot.vertical.current);
//                 }
//                 break;
//             case 'd':
//                 newPosition = foundBot.vertical.inverse ? foundBot.vertical.current + foundBot.vertical.increment : foundBot.vertical.current - foundBot.vertical.increment;
//                 if (newPosition < foundBot.vertical.max && newPosition > foundBot.vertical.min) {
//                     foundBot.vertical.current = newPosition;
//                     hummingbird.setPositionServo(foundBot.vertical.pin, foundBot.vertical.current);
//                 }
//                 break;
//             case 'l':
//                 newPosition = foundBot.horizontal.inverse ? foundBot.horizontal.current + foundBot.horizontal.increment : foundBot.horizontal.current - foundBot.horizontal.increment;
//                 if (newPosition < foundBot.horizontal.max && newPosition > foundBot.horizontal.min) {
//                     foundBot.horizontal.current = newPosition;
//                     hummingbird.setPositionServo(foundBot.horizontal.pin, foundBot.horizontal.current);
//                 }
//                 break;
//             case 'r':
//                 newPosition = foundBot.horizontal.inverse ? foundBot.horizontal.current - foundBot.horizontal.increment : foundBot.horizontal.current + foundBot.horizontal.increment;
//                 if (newPosition < foundBot.horizontal.max && newPosition > foundBot.horizontal.min) {
//                     foundBot.horizontal.current = newPosition
//                     hummingbird.setPositionServo(foundBot.horizontal.pin, foundBot.horizontal.current);
//                 }
//                 break;
//             case 'c':
//                 hummingbird.setPositionServo(foundBot.horizontal.pin, foundBot.horizontal.center);
//                 hummingbird.setPositionServo(foundBot.vertical.pin, foundBot.vertical.center);
//                 foundBot.horizontal.current = foundBot.horizontal.center;
//                 foundBot.vertical.current = foundBot.vertical.center;

//                 break;
//         }
//     } else {
//         basic.showString(`Bothead ${id} not found`);
//     }
// }

function getSensorData(type: any, pin: any) {
    return hummingbird.getSensor(type, pin);
}

/******
 * NON-Platform Specific Functions
 */

/* Variables
Allows RMB to set variables that can then be read by loops to update StringMap
*/
let cmdVars = returnEmptyCmdVars();
let debug = 0;
let isRunning = false;
let cleanedUp = true;
let vbaRanOnce = false;
// let distance = -1;


// for (let i = 0; i < 3; i++) {
//     controlLed("1", 100)
//     controlTriLed('*', 100, 100, 100)
//     basic.pause(300)
//     controlLed("1", 0)
//     controlTriLed('*', 0, 0, 0)
//     basic.pause(300)
// }

function returnEmptyCmdVars() {
    // return [[{
    //     deviceType: '',
    //     deviceId: '',
    //     value: ''
    // }]];
    return [[{
        deviceType: '',
        deviceId: '',
        value: ''
    }],
    [{
        deviceType: '',
        deviceId: '',
        value: ''
    }],
    [{
        deviceType: '',
        deviceId: '',
        value: ''
    }],
    [{
        deviceType: '',
        deviceId: '',
        value: ''
    }],
    [{
        deviceType: '',
        deviceId: '',
        value: ''
    }],
    [{
        deviceType: '',
        deviceId: '',
        value: ''
    }],
    [{
        deviceType: '',
        deviceId: '',
        value: ''
    }],
    [{
        deviceType: '',
        deviceId: '',
        value: ''
    }],
    [{
        deviceType: '',
        deviceId: '',
        value: ''
    }],
    [{
        deviceType: '',
        deviceId: '',
        value: ''
    }]
    ];
}

function setEmptyCmdVars() {
    cmdVars = returnEmptyCmdVars();
}

// function padString(input: string, strLen: number, padChar: string) {
//     while (input.length < strLen) {
//         input = padChar + input;
//     }
//     return input;
// }

// function matrix25Decode(input: string) {
//     let bCon = parseInt(input, 16);
//     let bOut = '';
//     let bLast = 0;
//     do {
//         if (Math.round(bCon % 2) != 0) {
//             bOut = '1' + bOut;
//             bCon--;
//         } else {
//             bOut = '0' + bOut;
//         }
//         bCon = bCon / 2;
//     } while (bCon > 0)
//     bOut = padString(bOut, 52, '0');
//     return bOut;
// }

// function matrix25Plot(bOut: string) {
//     let startPoint = 2
//     for (let r = 0; r < 5; r++) {
//         for (let c = 0; c < 5; c++) {
//             if (bOut.substr(startPoint, 2) == '11') {
//                 led.plot(c, r);
//             } else {
//                 led.unplot(c, r);
//             }
//             startPoint += 2;
//         }
//     }
// }

// function controlMatrix25(value: string) {
//     matrix25Plot(matrix25Decode(value));
// }

function convertLed(value: string) {
    return value.toLowerCase() == "ff" ? 100 : parseInt(value);
}

radio.onReceivedString(function (receivedString) {
    handleMessage(receivedString);
    // basic.showString(receivedString);
})
radio.setGroup(27)

function controlVariable(id: string, data: string) {
    const d = data.split('=');
    if (d.length === 2) {
        if (d[0] == 'bs') {
            isRunning = d[1] == '1' ? true : false;
            if (!isRunning) setEmptyCmdVars();
        }
    }
}

function controlCommands(gid: string, data: string) {
    // 01000
    const devType = data[0];
    const devId = devType == 'x' || devType == 'm' ? '' : data[1];
    const igid = parseInt(gid);
    // const val = devType == 'm' ? matrix25Decode(data.substr(2,20)) : data.substr(2,20);
    const val = data.substr(2, 20);
    // console.log('type: '+devType+' id: '+devId+' val: '+val);

    if (cmdVars[igid][0].deviceType == '') {
        cmdVars[igid][0] = {
            deviceType: devType,
            deviceId: devId,
            value: val
        };
    } else {
        cmdVars[igid].push({
            deviceType: devType,
            deviceId: devId,
            value: val
        });
    }
}

function handleMessage(msg: string) {
    if (mbId == msg[0]) {
        let dId = msg[2]
        switch (msg[1]) {
            // case "b": // Rover
            //     controlRover(dId, msg[3].toLowerCase(), parseInt(msg.substr(4, 4)));
            //     break;
            // case "h": // Bothead or 2 axis gimble
            //     controlBotHead(dId, msg[3].toLowerCase());
            //     break;
            case "l": // LED
                controlLed(dId, convertLed(msg.substr(3, 3)));
                break;
            // case "m": // Matrix 25
            //     controlMatrix25(msg.substr(2, 100));
            //     break;
            case "p": // Position Servo
            case "r": // Rotation Servo
                controlServo(dId, msg[1], parseInt(msg.substr(3, 4)));
                break;
            case "t": // Tricolor LED
                controlTriLed(dId, convertLed(msg.substr(3, 3)), convertLed(msg.substr(6, 3)), convertLed(msg.substr(9, 3)));
                break;
            // case "u": // Programmable Rover
            //     controlProgRover(dId, msg[3].toLowerCase(), 0);
            //     break;
            case "v": // var_batch
                controlVariable(dId, msg.substr(2, 100));
                break;
            case "x": // Pause
                basic.pause(parseInt(msg.substr(2, 20)));
                break;
            case "z": // vba
                controlCommands(dId, msg.substr(3, 20));
                break;
        }
    }
    if (debug === 1) {
        basic.showString(msg);
    }
}

// input.onButtonPressed(Button.A, function () {
//     if (debug === 1) {
//         debug = 0;
//     } else {
//         debug = 1;
//     }
//     basic.showNumber(debug);
//     basic.pause(1000);
//     basic.clearScreen();
// })

// input.onButtonPressed(Button.AB, function () {
//     if (isRunning) {
//         isRunning = false;
//     } else {
//         isRunning = true;
//     }
// })

/*****
 * VBA Functionality
 */

function handleVba(group: number) {
    if (cmdVars[group] && cmdVars[group][0] && cmdVars[group][0].value != '') {
        cmdVars[group].forEach(function (cmd: any) {
            if (cmd.deviceType) {
                handleMessage(`${mbId}${cmd.deviceType}${cmd.deviceId}${cmd.value}`);
            }
        });
    }
}

function cleanUpVba(setStop: boolean = true) {
    if (setStop) {
        vbaRanOnce = false;
        cleanedUp = true;
    }
    handleMessage(`${mbId}m0`);
    trileds.forEach((led) => {
        handleMessage(`${mbId}t${led.port}000`);
    });
    leds.forEach((led) => {
        handleMessage(`${mbId}l${led.port}0`);
    });
    servos.forEach((servo) => {
        // basic.showString(`${ mbId }${ servo.stype }${ servo.port }${ servo.startState }`);
        handleMessage(`${mbId}${servo.stype}${servo.port}${servo.startState}`);
    });
}

if (isVba) {
    // Group 0 - On Start
    basic.forever(function () {
        if (isRunning && !vbaRanOnce) {
            handleVba(0);
            vbaRanOnce = true;
        } else {
            basic.pause(500);
        }
    });

    // Group 1 - Forever
    basic.forever(function () {
        if (isRunning && vbaRanOnce) {
            if (cleanedUp) cleanedUp = false;
            handleVba(1);
        } else {
            basic.pause(500);
            if (!cleanedUp) cleanUpVba();
            // Add any position cleanup for the stop state here
        }
    });

    // Group 2 - Forever
    // basic.forever(function () {
    //     if (isRunning && vbaRanOnce) {
    //         handleVba(2);
    //     } else {
    //         basic.pause(500);
    //     }
    // });

    // Group 4 - On Shake
    // input.onGesture(Gesture.Shake, function () {
    //     handleVba(4);
    // });

    // Group 9 - Sensor
    basic.forever(function () {
        let distance = getSensorData(sensor.type, sensor.pin);
        if (isRunning && sensor.enabled && vbaRanOnce) {
            if (distance >= sensor.minTrigger && distance <= sensor.maxTrigger) {
                handleVba(9);
            } else {
                cleanUpVba(false);
                basic.pause(sensor.readDelay);
            }
        } else {
            basic.pause(500);
        }
    });
}

basic.showString(mbId);