// Gets element from HTML to tell if checkbox is enabled or disabled.
var toggle = document.getElementById("toggle");

// VirusTotal API
const apiKey = "";
const apiURL = "";
let scanURL = "";

// Checks Active Tab
function activeTab(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        scanURL = changeInfo.url;
        console.log('Tab URL updated to:', scanURL);
    }
}

// If else statement which acts according to web extension's checkbox.
toggle.addEventListener("change", function() {
    if (toggle.checked) {
        browser.tabs.onUpdated.addListener(activeTab);
        console.log("Detector enabled, checking every links clicked.");
    } else {
        console.log("Detector disabled, links are not checked.");
        browser.tabs.onUpdated.removeListener(activeTab);
    }
});

// Reference:
// https://docs.virustotal.com/
