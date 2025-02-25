# EncryptionDecryption

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text Encryption</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="box">
            <h2>Encrypt</h2>
            <textarea id="inputText1" placeholder="Enter your message..."></textarea>
            <br>
            <button onclick="encryptText('inputText1', 'outputText1')">Submit</button>
            <h2>Encrypted Data</h2>
            <textarea id="outputText1" readonly></textarea>
        </div>
        
        <div class="box">
            <h2>Decrypt</h2>
            <textarea id="inputText2" placeholder="Enter your message..."></textarea>
            <br>
            <button onclick="encryptText('inputText2', 'outputText2')">Submit</button>
            <h2>Decrypted Data</h2>
            <textarea id="outputText2" readonly></textarea>
        </div>
    </div>

    <script>
        function encryptText(inputId, outputId) {
            let input = document.getElementById(inputId).value;
            let encrypted = btoa(input); // Base64 encoding
            document.getElementById(outputId).value = encrypted;
        }
    </script>
</body>
</html>
