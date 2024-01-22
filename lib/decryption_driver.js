const {changeRadix} = require("./driver.js");


const chars = "ABCDEFGHIJLMNOPQRSTUVWXYZabdcdefghijklmnopqrstuvwxyz1234567890!@#$%&*1234567890!@#$%&*";
const morseCharMap = {
    '.-':     'a',
    '-...':   'b',
    '-.-.':   'c',
    '-..':    'd',
    '.':      'e',
    '..-.':   'f',
    '--.':    'g',
    '....':   'h',
    '..':     'i',
    '.---':   'j',
    '-.-':    'k',
    '.-..':   'l',
    '--':     'm',
    '-.':     'n',
    '---':    'o',
    '.--.':   'p',
    '--.-':   'q',
    '.-.':    'r',
    '...':    's',
    '-':      't',
    '..-':    'u',
    '...-':   'v',
    '.--':    'w',
    '-..-':   'x',
    '-.--':   'y',
    '--..':   'z',
    '.----':  '1',
    '..---':  '2',
    '...--':  '3',
    '....-':  '4',
    '.....':  '5',
    '-....':  '6',
    '--...':  '7',
    '---..':  '8',
    '----.':  '9',
    '-----':  '0',
    '-.-.--': '!',
    '.--.-.': '@',
    '.-..--': '#',
    '...-..-': '$',
    '-.---.': '%',
    '.-...': '&',
    '-.--..': '*'
};

function splitBy(string, length) {
    let output = [];
    do{ output.push(string.substring(0, length)) }
    while( (string = string.substring(length, string.length)) !== "" );
    return output;
}

function unMult(password, multiplyBy) {
    password = changeRadix(password, 10, 16);
    multiplyBy = changeRadix(multiplyBy, 10, 16);

    password = password.map( (e, i) => {
        return e / multiplyBy[i];
    })
    return password;
}

function unXor(password, salt) {
    salt = salt.map(e => parseInt(e, 2))
    password = password.map( (e, i) => {
        return e ^ salt[i % 8];
    });
    return changeRadix(password, 2, 10, 8);
}

function unPad(password, paddingAmount) {
    password = password.map( (e, i) => {
        let unPadBy = paddingAmount[i];
        e = e.substring(unPadBy, e.length)
        return e;
    })
    return password;
}

function binaryToMorse(binary) {
    let morse = [];

    // covert morse sequence to binary: dash is one and dot is zero
    binary.forEach(e => {
        let sequence = "";
        for (let c of Array.from(e)) {
            if (c === "0") sequence += ".";
            else sequence += "-";
        }
        morse.push(sequence);
    })
    // remove trailing space
    return morse;
}

function unmorse(morse) {
    // return character corresponding to morse code
    morse = morse.map(e => {
        return morseCharMap[e].toString();
    })
    return morse;
}

module.exports = {
    splitBy,
    unMult,
    unXor,
    unPad,
    binaryToMorse,
    unmorse
}