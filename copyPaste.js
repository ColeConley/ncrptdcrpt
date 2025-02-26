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
    let inputText1 = document.getElementById("inputText1").value;
    
    // Set the value to the output textarea
    document.getElementById("outputText1").value = inputText1;
}