function generatePlateNumber() {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let plateNumber = '';
  
    // Generate the first three letters
    for (let i = 0; i < 3; i++) {
      let charIndex = Math.floor(Math.random() * 26);
      plateNumber += String.fromCharCode('A'.charCodeAt(0) + charIndex);
    }
  
    // Generate the three numbers
    for (let i = 0; i < 3; i++) {
      let charIndex = Math.floor(Math.random() * 10);
      plateNumber += characters.charAt(charIndex);
    }
  
    // Generate the final letter
    let charIndex = Math.floor(Math.random() * 26);
    plateNumber += String.fromCharCode('A'.charCodeAt(0) + charIndex);
  
    return plateNumber;
  }
  
module.exports.generateBusPlateNumber=generatePlateNumber;