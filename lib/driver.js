function changeRadix(numbers, toRadix = 16, fromRadix = 10, minLength = 0) {
    if (typeof numbers === "string") {
        numbers = numbers.split(" ")
        numbers = numbers.map(e => {
            e = parseInt(e, fromRadix).toString(toRadix);
            if (minLength > 0) while (e.length < minLength) e = "0" + e;
            return e;
        })
        return numbers.join(" ")
    }
    else if (typeof numbers === "object") {
        numbers = numbers.map(e => {
            e = parseInt(e, fromRadix).toString(toRadix);
            if (minLength > 0) while (e.length < minLength) e = "0" + e;
            return e;
        })
        return numbers;
    }
    else if (typeof numbers === "number") {
        numbers = parseInt(numbers, fromRadix).toString(toRadix);
        if (minLength > 0) while (numbers.length < minLength) numbers = "0" + numbers;
        return numbers;
    }
    else numbers = -1;
    return numbers;
}

function shiftBinary(binaryArray, direction, amount) {
    binaryArray = binaryArray.map(e => {
        let length = e.length;
        let cut = length - amount;

        if (direction === "right") {
            return e.substring(cut, length) + e.substring(0, cut);
        } else if (direction === "left") {
            return e.substring(amount, length) + e.substring(0, amount)
        } else {
            throw "Bad Direction!";
        }
    });
    return binaryArray;
}

// standardizes all binary to a length of 8 bits
function binTo8Bit(binaryArray) {
    let paddingAmount = "";
    binaryArray = binaryArray.map(e => {
        let amount = 0;
        while (e.length < 8) {
            amount += 1;
            e = "0" + e;
        }
        paddingAmount += amount.toString();
        return e;
    });
    return [binaryArray, paddingAmount];
}

module.exports = {
    changeRadix,
    shiftBinary,
    binTo8Bit
}