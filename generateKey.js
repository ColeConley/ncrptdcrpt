// Function to generate a random 32-character key
// function generateRandomKey(length = 32) {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let result = '';
//     for (let i = 0; i < length; i++) {
//         result += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     return result;
    
// }


// Function to generate a random 32-character key and Print it into the Key Textbox
function generateRandomKey(length = 32) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    document.getElementById("keyText1").value = result;
    
}


// let secretKey = generateRandomKey();

// let checkForKey = document.getElementById("keyText1").value
// let keyLength = checkForKey.length
// if (keyLength = "") {
//     let secretKey = generateRandomKey()
// } else if (keyLength < 32 || keyLength > 32) {
//     console.log("Key Needs to be 32 Characters")
// } else {
//     let secretKey = checkForKey
// }

