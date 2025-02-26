// First Setting Some Variables
// let inputText1 = document.getElementById("inputText1").value;
// let outputText1 = document.getElementById("outputText1").value;
// let keyText1 = document.getElementById("keyText1").value;
// let ivText1 = document.getElementById("ivText1").value;
// let inputText2 = document.getElementById("inputText2").value;
// let outputText2 = document.getElementById("outputText2").value;
// let keyText2 = document.getElementById("keyText2").value;
// let ivText2 = document.getElementById("ivText2").value;

// START Encryption and Decryption Flow Section
// Step 1: Generate AES-256 Key
async function generateKey() {
    const key = await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
    return key;
}

// Step 2: Convert CryptoKey to Base64
async function exportKeyToBase64(key) {
    const rawKey = await window.crypto.subtle.exportKey("raw", key);
    const buffer = new Uint8Array(rawKey);
    return btoa(String.fromCharCode(...buffer)); // Convert to Base64
}

// Step 3: Encrypt a Message
async function encryptText(plaintext, key) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Generate random IV

    const encryptedData = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        data
    );

    return {
        encryptedMessage: arrayBufferToBase64(encryptedData),
        iv: arrayBufferToBase64(iv)
    };
}

// Step 4: Decrypt a Message
async function decryptText(encryptedMessage, iv, key) {
    const encryptedData = base64ToArrayBuffer(encryptedMessage);
    const ivArray = base64ToArrayBuffer(iv);

    const decryptedData = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivArray },
        key,
        encryptedData
    );

    return new TextDecoder().decode(decryptedData);
}

// Utility: Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

// Utility: Convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i);
    }
    return buffer.buffer;
}

// 🔹 Full End-to-End Flow Encryption AND Decryption Together
async function runEncryptionDecryption() {
    const key = await generateKey();
    const base64Key = await exportKeyToBase64(key);

    const message = "This is a secret message!";
    const { encryptedMessage, iv } = await encryptText(message, key);

    // console.log("🔑 AES Key (Base64):", base64Key);
    // console.log("📡 IV (Base64):", iv);
    // console.log("🔒 Encrypted Message (Base64):", encryptedMessage);

    // Simulating the receiver decrypting the message
    const importedKey = await importKeyFromBase64(base64Key);
    const decryptedMessage = await decryptText(encryptedMessage, iv, importedKey);

    // console.log("✅ Decrypted Message:", decryptedMessage);
}

// Utility: Import Key from Base64
async function importKeyFromBase64(base64Key) {
    const rawKey = base64ToArrayBuffer(base64Key);
    return await window.crypto.subtle.importKey(
        "raw",
        rawKey,
        { name: "AES-GCM" },
        true,
        ["encrypt", "decrypt"]
    );
}

// Run the Encryption & Decryption Flow
runEncryptionDecryption();



// RUN ENCRYPTION FUNCTION: Run the Encryption Flow
async function runEncryption() {
    // set Variables for key and base64Key (base64Key is what we can show to the user)
    const key = await generateKey();
    const base64Key = await exportKeyToBase64(key);

    // Set Value of inputText1 to the user's input in inputText1 Text Box
    const inputText1 = document.getElementById("inputText1").value;
    
    // Set the value of cipertext and iv, which are the encrypted message and generated IV
    const { encryptedMessage, iv } = await encryptText(inputText1, key);

    // // Print out Key, IV and Encrypted Message in Console
    // console.log("🔑 AES Key (Base64):", base64Key);
    // console.log("📡 IV (Base64):", iv);
    // console.log("🔒 Encrypted Message (Base64):", encryptedMessage);

    // Set the value of keyText1, ivText1, and outputText1 with the Generated Key Generated IV and Encrypted Message
    document.getElementById("keyText1").value = base64Key;
    document.getElementById("ivText1").value = iv;
    document.getElementById("outputText1").value = encryptedMessage;
}


// RUN DECRYPTION FUNCTION: Run the Decryption Flow
async function runDecryption() {
    // Set Variables for (encryptedMessage, iv, and base64Key) as the user inputs for (inputText2, keyText2, and ivText2)
    const encryptedMessage = document.getElementById("inputText2").value;
    const base64Key = document.getElementById("keyText2").value;
    const iv = document.getElementById("ivText2").value;
    // Run importKeyFromBase64 Function and set result to importedKey
    const importedKey = await importKeyFromBase64(base64Key);
    // Run decryptText Function and set result to decryptedMessage
    const decryptedMessage = await decryptText(encryptedMessage, iv, importedKey);

    // console.log("✅ Decrypted Message:", decryptedMessage);

    // Set value of outputText2 to decryptedMessage
    document.getElementById("outputText2").value = decryptedMessage;
}

// END Encryption and Decryption Flow Section



// Copy and Paste Functions
// Copy textArea Function
function copyToClipboard(textAreaId) {
    let textArea = document.getElementById(textAreaId);
    textArea.removeAttribute("readonly"); // Temporarily make editable
    textArea.select();
    document.execCommand("copy"); // Copy to clipboard
    textArea.setAttribute("readonly", true); // Restore readonly state
    alert("Copied to clipboard!");
}
// Paste inputText1 into outPutText1 
function pasteToOutput() {
    // Get the value from the input textarea
    let inputText1 = document.getElementById("inputText1").value;
    
    // Set the value to the output textarea
    document.getElementById("outputText1").value = inputText1;
}