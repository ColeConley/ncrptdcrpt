function copyToClipboard(textAreaId) {
    let textArea = document.getElementById(textAreaId);
    textArea.removeAttribute("readonly"); // Temporarily make editable
    textArea.select();
    document.execCommand("copy"); // Copy to clipboard
    textArea.setAttribute("readonly", true); // Restore readonly state
    alert("Copied to clipboard!");
}

function pasteToOutput() {
    // Get the value from the input textarea
    let inputText = document.getElementById("inputText1").value;
    
    // Set the value to the output textarea
    document.getElementById("outputText1").value = inputText;
}

// Function to Decrypt Text using AES-256
async function decryptText() {
    if (!aesKey) {
        //alert("No encryption key found! Encrypt something first.");
        return;
    }

    let input = document.getElementById("inputText2").value;
    if (!input.includes(":")) {
        alert("Invalid encrypted format!");
        return;
    }

    // Split IV and encrypted data
    let [ivBase64, encryptedBase64] = input.split(":");

    // Convert Base64 to Uint8Array
    let iv = new Uint8Array(atob(ivBase64).split("").map(char => char.charCodeAt(0)));
    let encryptedData = new Uint8Array(atob(encryptedBase64).split("").map(char => char.charCodeAt(0)));

    try {
        let decrypted = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            aesKey,
            encryptedData
        );

        // Convert decrypted bytes to text
        let decoder = new TextDecoder();
        let decryptedText = decoder.decode(decrypted);

        // Display decrypted text in outputText2
        document.getElementById("outputText2").value = decryptedText;
    } catch (error) {
        alert("Decryption failed! Ensure the correct encrypted text is entered.");
    }
}



// Global Key Variable (Generated Once)
let aesKey;
    
// Function to Generate AES-256 Key
async function generateKey() {
    aesKey = await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

// Function to Encrypt Text using AES-256
async function encryptText() {
    if (!aesKey) {
        await generateKey(); // Ensure key is generated
    }

    let input = document.getElementById("inputText1").value;
    let encoder = new TextEncoder();
    let encodedData = encoder.encode(input);

    let iv = window.crypto.getRandomValues(new Uint8Array(12)); // AES-GCM IV

    let encrypted = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        aesKey,
        encodedData
    );

    // Convert Encrypted Data & IV to Base64
    let encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    let ivBase64 = btoa(String.fromCharCode(...iv));

    document.getElementById("outputText1").value = `${ivBase64}:${encryptedBase64}`;
}