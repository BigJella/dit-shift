// MBOE
const encrypt = require("./lib/encryption_driver");
const decrypt = require("./lib/decryption_driver");
const driver = require("./lib/driver");
const prompt = require("prompt-sync")({sigint: true});

function encryptor(password) {
    // validates entered password
    encrypt.validatePassword(password)

    // preserve map of uppercase letters before they are lost
    let capitalMap = encrypt.capitalMap(password);

    // generate a salt
    let salt = encrypt.generateSalt();

    // covert characters to morse code
    [password, salt] = encrypt.morse(password, salt);

    // covert morse code to binary: dash is one and dot is zero
    [password, salt] = encrypt.morseToBinary(password, salt);

    // add padding to make it 8 bits
    let paddingAmount;
    [password, paddingAmount] = driver.binTo8Bit(password);

    [salt] = driver.binTo8Bit(salt);

    // shift binary right by 3
    password = driver.shiftBinary(password, "right", 3);
    salt = driver.shiftBinary(salt, "right", 3);

    // xor password with the salt
    password = encrypt.xorWithSalt(password, salt);

    // convert salt to hexadecimal
    salt = driver.changeRadix(salt, 16, 2, 2);
    salt = salt.join("");

    // multiply password with random numbers
    let multiplyBy;
    [password, multiplyBy] = encrypt.randomMult(password);

    // combine password and create decryption key
    password = password.join("")
    let decryptionKey = `${salt}:${capitalMap}:${paddingAmount}:${multiplyBy}`;

    return [password, decryptionKey];
}

function decryptor(password, decryptionKey) {
    // split decryption key into individual parts
    let [salt, capitalMap, paddingAmount, multiplyBy] = decryptionKey.split(":");
    password = decrypt.splitBy(password, 4);
    salt = decrypt.splitBy(salt, 2);
    multiplyBy = decrypt.splitBy(multiplyBy, 2);

    // remove the random multiplication and convert salt to binary in preparation for XOR operation
    password = decrypt.unMult(password, multiplyBy);
    salt = driver.changeRadix(salt, 2, 16, 8);

    // reverses the XOR with the salt performed in the encryption process
    password = decrypt.unXor(password, salt);

    // reverses the binary shift performed during encryption
    password = driver.shiftBinary(password, "left", 3);

    // removes the padding previously applied to the binary to make it 8 bits
    password = decrypt.unPad(password, paddingAmount);

    // converts the binary back into morse code
    password = decrypt.binaryToMorse(password);

    // converts morse code back into the appropriate characters
    password = decrypt.unmorse(password)

    // recover capitalization from saved capitalMap
    password = password.map( (e, i) => {
        if (capitalMap[i] === "1") e = e.toUpperCase();
        return e;
    })
    // put the array back together into the original password
    password = password.join("");

    return password;
}

console.log("It's cryptography time!");

while (true) {
    const input = prompt("Do you want to (e)ncrypt, (d)ecrypt, or (q)uit?: ");
    if (input === "e" || input === "encrypt") {
        const password = prompt("What are you encrypting?: ");
        const [result, decryptionKey] = encryptor(password);
        console.log("Your encrypted password is:", result);
        console.log("Use the following decryption key to decrypt it later:", decryptionKey);
    } else if (input === "d" || input === "decrypt") {
        const encrypted = prompt("What is your encrypted password?: ")
        const key = prompt("What is the decryption key?: ")
        const result = decryptor(encrypted, key);
        console.log("Your original password was:", result);
    } else if (input === "q" || input === "quit") {
        break;
    } else {
        console.log("Invalid Selection")
    }
}

console.log("OK GOODBYE!")