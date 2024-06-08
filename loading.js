// Note:
// This JavaScript file is called from the loading.html file.
// Main function is to change the text displayed overtime on the loading page.

const loadingText = document.getElementById('loading-text');
const textsList = ['Scanning URL.', 'Scanning URL..', 'Scanning URL...'];

let index = 0;

function updateText() {
    loadingText.textContent = textsList[index];
    index = (index + 1) % 3;
}

setInterval(updateText, 500);