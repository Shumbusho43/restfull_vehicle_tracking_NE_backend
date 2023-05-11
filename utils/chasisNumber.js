function generateChassisNumber() {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const positions = [8, 3, 7, 10, 9, 4, 2, 5, 1, 6, 7, 2, 10, 0, 4, 5, 1];
    let chassisNumber = '';

    // Generate a random character for each position in the VIN
    for (let i = 0; i < 17; i++) {
        let charIndex = Math.floor(Math.random() * characters.length);
        chassisNumber += characters.charAt(charIndex);
    }

    // Calculate the check digit
    let sum = 0;
    for (let i = 0; i < 17; i++) {
        let charValue = characters.indexOf(chassisNumber.charAt(i));
        sum += charValue * positions[i];
    }
    let checkDigit = sum % 11;
    if (checkDigit === 10) {
        checkDigit = 'X';
    }
    chassisNumber += checkDigit;

    return chassisNumber;
}
module.exports.generateChassisNumber = generateChassisNumber;