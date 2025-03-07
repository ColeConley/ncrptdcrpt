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
    const { iv, encryptedMessage } = await encryptText(inputText1, key);
    const encryptedIVMessage = await combineIvMessage(iv, encryptedMessage);
    // Keyless
    const keylessMode = document.getElementById('keylessToggle').checked;
    const encryptedKeyIVMessage = await combineKeyIvMessage(base64Key, iv, encryptedMessage);

    document.getElementById("keyText1").value = base64Key;
    document.getElementById("outputText1").value = encryptedIVMessage;

    if (keylessMode) { // If keyless mode is toggle on 
        document.getElementById("outputText1").value = encryptedKeyIVMessage;
    } else { // If keyless mode is toggled off
        document.getElementById("keyText1").value = base64Key;
        document.getElementById("outputText1").value = encryptedIVMessage;
    }
}


// RUN DECRYPTION FUNCTION: Run the Decryption Flow
async function runDecryption() {
    const keylessMode = document.getElementById('keylessToggle').checked;

    //Keyless
    if(keylessMode) { // Keyless Mode Enabled
        const encryptedKeyIVMessage = document.getElementById("inputText2").value;
        const { key, iv, encryptedMessage } = await reverseCombineKeyIvMessage(encryptedKeyIVMessage);
        const base64Key = key;
        const importedKey = await importKeyFromBase64(base64Key);
        const decryptedMessage = await decryptText(encryptedMessage, iv, importedKey);

        document.getElementById("outputText2").value = decryptedMessage;
    } else { // Keyless Mode Disabled
        const encryptedIVMessage = document.getElementById("inputText2").value;
        const { iv, encryptedMessage } = await reverseCombineIvMessage(encryptedIVMessage);
        const base64Key = document.getElementById("keyText2").value;
        const importedKey = await importKeyFromBase64(base64Key);
        const decryptedMessage = await decryptText(encryptedMessage, iv, importedKey);

        document.getElementById("outputText2").value = decryptedMessage;
    }
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

// UTILITY FUNCTION: Base64 Decode the Encoded String of iv:message and then Split it by the Delimeter ":"
async function reverseCombineIvMessage(encryptedIVMessage) {
    const decodedIVMessage = atob(encryptedIVMessage);
    const [iv, encryptedMessage] = decodedIVMessage.split(":");
    return { iv, encryptedMessage };
}

// UTILITY FUNCTION: Combine Key, IV, and Encrypted Message and then Base64 Encode the result
async function combineKeyIvMessage(key, iv, message) {
    const combined = key + ":" + iv + ":" + message;
    const result = btoa(combined);
    return result;
}

// UTILITY FUNCTION: Base64 Decode the Encoded String of key:iv:message and then Split it by the Delimeter ":"
async function reverseCombineKeyIvMessage(encryptedKeyIVMessage) {
    const decodedIVMessage = atob(encryptedKeyIVMessage);
    const [key, iv, encryptedMessage] = decodedIVMessage.split(":");
    return {key, iv, encryptedMessage };
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

// UTILITY FUNCTION: Copy decryptedMessage (outputText2)

function copyDecryptedMessage(textAreaId) {
    let textArea = document.getElementById(textAreaId);

    if (!textArea) {
        console.error("No text to copy");
        return;
    }
    // Construct the formatted text
    let textToCopy = textArea.value;

    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            alert("Copied to clipboard!");
        })
        .catch(err => {
            console.error("Failed to copy: ", err);
        });
}

// UTILITY FUNCTION: Paste inputText1 into outputText1 
function pasteToOutput() {
    let inputText1 = document.getElementById("inputText1").value; // Get the value from the input textarea
    
    document.getElementById("outputText1").value = inputText1; // Set the value to the output textarea
}

// UTILITY FUNCTIONS: Keyless Toggle
// Add event listener for the keyless toggle
document.addEventListener('DOMContentLoaded', function() {
    const keylessToggle = document.getElementById('keylessToggle');
    if (keylessToggle) {
        keylessToggle.addEventListener('change', function() {
            toggleKeyVisibility(this.checked);
        });
    }
});

// Function to toggle key visibility
function toggleKeyVisibility(isKeyless) {
    const keyText1 = document.getElementById('keyText1');
    const keyText2 = document.getElementById('keyText2');
    
    if (isKeyless) {
        // Hide key textboxes when keyless is enabled
        if (keyText1) {
            keyText1.style.display = 'none';
            keyText1.setAttribute('data-keyless', 'true');
        }
        if (keyText2) {
            keyText2.style.display = 'none';    
            keyText2.setAttribute('data-keyless', 'true');
        }
    } else {
        // Show key textboxes when keyless is disabled
        if (keyText1) {
            keyText1.style.display = '';
            keyText1.removeAttribute('data-keyless');
        }
        if (keyText2) {
            keyText2.style.display = '';
            keyText2.removeAttribute('data-keyless');
        }
    }
}

// END Utility Functions Section
