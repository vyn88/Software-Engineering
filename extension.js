browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var activeTab = tabs[0];
    console.log(activeTab.url);
});

var toggle = document.getElementById("toggle");

toggle.addEventListener("change", function() {
    if (toggle.checked) {
        console.log("Detector enabled, checking every links clicked.");
    } else {
        console.log("Detector disabled, links are not checked.");
    }
});

// Reference:
// https://docs.virustotal.com/
