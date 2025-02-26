// Utility Functions
function arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

// Step 1: Generate AES-256 Key
async function generateKey() {
    return await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

// Step 2: Encrypt Text
async function encryptText(plainText, aesKey) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);

    // Generate a random IV (12 bytes for AES-GCM)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the text
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        aesKey,
        data
    );

    // Return Base64 encoded IV and Ciphertext
    return {
        iv: arrayBufferToBase64(iv),
        ciphertext: arrayBufferToBase64(encryptedData)
    };
}

// Step 3: Decrypt Text
async function decryptText(base64Iv, base64Ciphertext, aesKey) {
    const iv = new Uint8Array(base64ToArrayBuffer(base64Iv));
    const encryptedData = base64ToArrayBuffer(base64Ciphertext);

    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        aesKey,
        encryptedData
    );

    // Convert decrypted ArrayBuffer to text
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
}

// Step 4: Full Workflow Execution
async function testEncryptionDecryption() {
    const aesKey = await generateKey(); // Generate AES Key

    const originalText = "Hello, this is a secret message!";
    console.log("Original Text:", originalText);

    // Encrypt
    const encrypted = await encryptText(originalText, aesKey);
    console.log("IV (Base64):", encrypted.iv);
    console.log("Ciphertext (Base64):", encrypted.ciphertext);

    // Decrypt
    const decryptedText = await decryptText(encrypted.iv, encrypted.ciphertext, aesKey);
    console.log("Decrypted Text:", decryptedText);
}

// Run the test
testEncryptionDecryption();
