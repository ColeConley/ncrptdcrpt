// Encryption Function
async function encryptWithStaticKey(plainText, secretKey) {
    // Convert the secret key to a Uint8Array (32 bytes, for AES-256)
    const keyBuffer = new TextEncoder().encode(secretKey); // Convert the string key to bytes
    const key = await crypto.subtle.importKey(
        "raw", keyBuffer, { name: "AES-CBC" }, false, ["encrypt", "decrypt"]
    );
    
    // Generate a random IV (Initialization Vector) for AES-CBC encryption
    const iv = crypto.getRandomValues(new Uint8Array(16)); // AES block size is 16 bytes
    
    // Convert the plain text to a Uint8Array
    const textBuffer = new TextEncoder().encode(plainText);
    
    // Perform AES-CBC encryption
    const encryptedBuffer = await crypto.subtle.encrypt(
        { name: "AES-CBC", iv: iv },
        key,
        textBuffer
    );
    
    // Return the IV and encrypted data in a combined form (Base64 encoded for easy transmission)
    const encryptedArray = new Uint8Array(encryptedBuffer);
    const encryptedBase64 = btoa(String.fromCharCode(...encryptedArray));
    const ivBase64 = btoa(String.fromCharCode(...iv));

    return { encryptedData: encryptedBase64, iv: ivBase64 };
}


async function exampleEncrypt() {
    const secretKey = "32CharacterLongStaticSecretKey1234"; // Static 32-character key
    const plainText = document.getElementById("inputText1").value;
    
    const { encryptedData, iv } = await encryptWithStaticKey(plainText, secretKey);
    console.log("Encrypted Data:", encryptedData);
    console.log("IV:", iv); // Save or send the IV along with the encrypted data
    
    // You would send `encryptedData` and `iv` to the recipient here
}