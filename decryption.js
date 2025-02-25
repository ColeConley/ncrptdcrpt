// Decryption Function
async function decryptWithStaticKey(encryptedData, secretKey, ivBase64) {
    // Convert the secret key to a Uint8Array (32 bytes, for AES-256)
    const keyBuffer = new TextEncoder().encode(secretKey); // Convert the string key to bytes
    const key = await crypto.subtle.importKey(
        "raw", keyBuffer, { name: "AES-CBC" }, false, ["encrypt", "decrypt"]
    );
    
    // Decode the IV and the encrypted data from Base64
    const iv = new Uint8Array(atob(ivBase64).split("").map(char => char.charCodeAt(0)));
    const encryptedArray = new Uint8Array(atob(encryptedData).split("").map(char => char.charCodeAt(0)));
    
    // Perform AES-CBC decryption
    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv: iv },
        key,
        encryptedArray
    );
    
    // Convert the decrypted buffer back to a string
    const decryptedText = new TextDecoder().decode(decryptedBuffer);
    return decryptedText;
}


async function exampleDecrypt() {
    const secretKey = "32CharacterLongStaticSecretKey1234"; // Static 32-character key
    const encryptedData = "EncryptedStringHere"; // Replace with actual encrypted data
    const iv = "IVstringHere"; // Replace with the actual IV
    
    const decryptedText = await decryptWithStaticKey(encryptedData, secretKey, iv);
    console.log("Decrypted Text:", decryptedText);
}