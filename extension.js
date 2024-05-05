// Gets element from HTML to tell if checkbox is enabled or disabled.
var toggle = document.getElementById("toggle");

// VirusTotal API
const apiKey = "";
const apiURL = "";
let scanURL = "";

// Checks and gets active tab URL.
browser.tabs.query({ active: true, currentWindow: true }, function(tabs){
    var activeTab = tabs[0];
    scanURL = activeTab.url;
    console.log("URL of Active Tab: ", activeTab.url);
});

toggle.addEventListener("change", function() {
    if (toggle.checked) {
        console.log("Detector enabled, checking every links clicked.");
    } else {
        console.log("Detector disabled, links are not checked.");
    }
});

// Reference:
// https://docs.virustotal.com/
