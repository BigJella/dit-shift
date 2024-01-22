// valid salt and password characters
const {changeRadix} = require( "./driver.js");

const chars = "ABCDEFGHIJLMNOPQRSTUVWXYZabdcdefghijklmnopqrstuvwxyz1234567890!@#$%&*1234567890!@#$%&*";

// map of characters to morse code
const morseCharMap = {
    'a': '.-',
    'b': '-...',
    'c': '-.-.',
    'd': '-..',
    'e': '.',
    'f': '..-.',
    'g': '--.',
    'h': '....',
    'i': '..',
    'j': '.---',
    'k': '-.-',
    'l': '.-..',
    'm': '--',
    'n': '-.',
    'o': '---',
    'p': '.--.',
    'q': '--.-',
    'r': '.-.',
    's': '...',
    't': '-',
    'u': '..-',
    'v': '...-',
    'w': '.--',
    'x': '-..-',
    'y': '-.--',
    'z': '--..',
    '1': '.----',
    '2': '..---',
    '3': '...--',
    '4': '....-',
    '5': '.....',
    '6': '-....',
    '7': '--...',
    '8': '---..',
    '9': '----.',
    '0': '-----',
    '!': '-.-.--',
    '@': '.--.-.',
    '#': '.-..--',
    '$': '...-..-',
    '%': '-.---.',
    '&': '.-...',
    '*': '-.--..'
}

// !!! ENCRYPTION FUNCTIONS BELOW !!!

function validatePassword(password) {
    if (password === "") throw "Password Cannot Be Empty!"
    Array.from(password).forEach((e) => {
        if (!chars.includes(e)) throw "Password Contains Invalid Characters!"
    })
}

function capitalMap(password) {
    let capitalMap = "";
    Array.from(password).forEach(l => {
        if (l !== l.toLowerCase()) capitalMap += "1"; else capitalMap += "0";
    })
    return capitalMap;
}

// generates a random salt from valid characters
function generateSalt() {
    let salt = "";
    while (salt.length < 8) salt += chars[Math.floor((Math.random() * chars.length))];
    return salt;
}

// Automatically salts a password
function salt(password) {
    let salt = generateSalt();
    return [password + salt, salt];
}

// turns passwords into their respective morse equivalent using the morse map
function morse(password, salt) {
    let passArray = password.split("");
    passArray = passArray.map(e => {
        return morseCharMap[e.toLowerCase()]
    });
    let saltArray = salt.split("");
    saltArray = saltArray.map(e => {
        return morseCharMap[e.toLowerCase()]
    });
    return [passArray, saltArray];
}

// turns a string of morse text into binary
function morseToBinary(passArray, saltArray) {
    let pass_binary = [];
    let salt_binary = [];

    // covert morse sequence to binary: dash is one and dot is zero
    passArray.forEach(e => {
        let sequence = "";
        for (let c of Array.from(e)) {
            if (c === ".") sequence += "0";
            else sequence += "1";
        }
        pass_binary.push(sequence);
    })

    saltArray.forEach(e => {
        let sequence = "";
        for (let c of Array.from(e)) {
            if (c === ".") sequence += "0";
            else sequence += "1";
        }
        salt_binary.push(sequence);
    })
    // remove trailing space
    return [pass_binary, salt_binary];
}

function xorWithSalt(passArray, saltArray) {
    // password and salt are converted to base 10 from an array of binary strings
    let password = passArray.map(e => parseInt(e, 2));
    let salt = saltArray.map(e => parseInt(e, 2));

    let result = password.map( (e, i) => {
        return e ^ salt[i % 8];
    })

    return result;
}

function randomMult(password, maxMult = 255) {
    let multiplyBy = "";

    let result = password.map(e => {
        // pick a random number to multiply by
        let multiplier = Math.ceil((Math.random() * maxMult));
        // store the number in hex
        let hexMult = changeRadix(multiplier, 16, 10, 2);

        // store what was multiplied by
        multiplyBy += hexMult;

        // multiply and return in hexadecimal
        e *= multiplier;
        e = changeRadix(e, 16, 10, 4);
        return e;
    })
    return [result, multiplyBy]
}

module.exports = {
    validatePassword,
    capitalMap,
    generateSalt,
    salt,
    morse,
    morseToBinary,
    xorWithSalt,
    randomMult
}