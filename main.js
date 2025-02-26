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
        ciphertext: arrayBufferToBase64(encryptedData),
        iv: arrayBufferToBase64(iv)
    };
}

// Step 4: Decrypt a Message
async function decryptText(ciphertext, iv, key) {
    const encryptedData = base64ToArrayBuffer(ciphertext);
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

// 🔹 Full End-to-End Flow
async function runEncryptionDecryption() {
    const key = await generateKey();
    const base64Key = await exportKeyToBase64(key);

    const message = "This is a secret message!";
    const { ciphertext, iv } = await encryptText(message, key);

    console.log("🔑 AES Key (Base64):", base64Key);
    console.log("📡 IV (Base64):", iv);
    console.log("🔒 Encrypted Message (Base64):", ciphertext);

    // Simulating the receiver decrypting the message
    const importedKey = await importKeyFromBase64(base64Key);
    const decryptedMessage = await decryptText(ciphertext, iv, importedKey);

    console.log("✅ Decrypted Message:", decryptedMessage);
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
