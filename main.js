// Author Cole Conley

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

// RUN ENCRYPTION FUNCTION: Run the Encryption Flow
async function runEncryption() {
    const key = await generateKey();
    const base64Key = await exportKeyToBase64(key);
    const inputText1 = document.getElementById("inputText1").value;
    const { encryptedMessage, iv } = await encryptText(inputText1, key);
    const encryptedIVMessage = await combineIvMessage(iv, encryptedMessage);


    document.getElementById("keyText1").value = base64Key;
    document.getElementById("outputText1").value = encryptedIVMessage;
}


// RUN DECRYPTION FUNCTION: Run the Decryption Flow
async function runDecryption() {
    const encryptedIVMessage = document.getElementById("inputText2").value;
    const { encryptedMessage, iv } = await reverseCombineIvMessage(encryptedIVMessage);
    const base64Key = document.getElementById("keyText2").value;
    const importedKey = await importKeyFromBase64(base64Key);
    const decryptedMessage = await decryptText(encryptedMessage, iv, importedKey);

    document.getElementById("outputText2").value = decryptedMessage;
}

// END Encryption and Decryption Flow Section


// START Utility Functions Section

// UTILITY FUNCTION: Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

// UTILITY FUNCTION: Convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i);
    }
    return buffer.buffer;
}


// UTILITY FUNCTION: Import Key from Base64
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
// UTILITY FUNCTION: Combine IV and Encrypted Message and then Base64 Encode the result
async function combineIvMessage(iv, message) {
    const combined = iv + ":" + message;
    const result = btoa(combined);
    return result;
}

// UTILITY FUNCTION: Base64 Decode the Encoded String and then Split it by the Delimeter :
async function reverseCombineIvMessage(encryptedIVMessage) {
    const decodedIVMessage = atob(encryptedIVMessage);
    const [iv, encryptedMessage] = decodedIVMessage.split(":");
    return { iv, encryptedMessage };
}

// Copy and Paste Functions
// UTILITY FUNCTION: Copy textAreaId and keyAreaId Function Updated since document.execCommand is Deprecated, Copies Encrypted Message and Key in a format to send
function copyToClipboard(textAreaId, keyAreaId) {
    let textArea = document.getElementById(textAreaId);
    let keyArea = document.getElementById(keyAreaId);

    if (!textArea || !keyArea) {
        console.error("Text area or key area not found");
        return;
    }

    // Construct the formatted text
    let textToCopy = `Message:\n${textArea.value}\n\nKey:\n${keyArea.value}`;

    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            alert("Copied to clipboard!");
        })
        .catch(err => {
            console.error("Failed to copy: ", err);
        });
}

// UTILITY FUNCTION: Paste inputText1 into outPutText1 
function pasteToOutput() {
    let inputText1 = document.getElementById("inputText1").value; // Get the value from the input textarea
    
    document.getElementById("outputText1").value = inputText1; // Set the value to the output textarea
}

// END Utility Functions Section


// START Matrix Background Effect Section

// Matrix background effect
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Characters to be used in the matrix
const characters = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ01010101';

const fontSize = 12;
const columns = canvas.width / fontSize;

// Array to store the y position of each character
const drops = [];

// Initialize the drops array
for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
}

function draw() {
    // Set a semi-transparent black background to create trailing effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f0';
    ctx.font = fontSize + 'px monospace';

    // Draw each character
    for (let i = 0; i < drops.length; i++) {
        // Get a random character from the characters string
        const text = characters.charAt(Math.floor(Math.random() * characters.length));

        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset the drop position if it's off the screen or randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        // Move the drop down
        drops[i]++;
    }
}

// Run the draw function at regular intervals
setInterval(draw, 33);

// Update canvas dimensions on resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Reset drops array
    for (let i = 0; i < canvas.width / fontSize; i++) {
        drops[i] = Math.random() * -100;
    }
});

// END Matrix Background Canvas Effects Section