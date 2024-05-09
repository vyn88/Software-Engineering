// Gets element from HTML to tell if checkbox is enabled or disabled.
var toggle = document.getElementById("toggle");

// Displays message on the web extension depending on the link.
var message = document.getElementById("message");
message.textContent = "This text will display the result of the analysis."

// VirusTotal API
const apiKey = "";
const apiURL = "";
let targetURL = "";
let analysisID = "";
let maliciousCount = 0;

// Function to send URL for scanning.
function scanURL() {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'x-apikey': apiKey,
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            url: targetURL
        })
    };

    fetch(apiURL, options)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            analysisID = response.data.id;
            analysisURL(analysisID);
        })
        .catch(err => console.error(err));
}

// Function to request URL analysis.
function analysisURL(analysisID) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-apikey': apiKey
        }
    };

    fetch('https://www.virustotal.com/api/v3/analyses/' + analysisID, options)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            maliciousCount = response.data.attributes.stats.malicious;
            decider(maliciousCount, targetURL);
        })
        .catch(err => console.error(err));
}

// Gives a response based on the analysis result.
function decider(maliciousCount, targetURL) {
    if (maliciousCount >= 1) {
        message.textContent = "Warning: This link is potentially dangerous. Returning to previous page in a moment...";
        const delayInSeconds = 10;
        setTimeout(() => {
            window.history.back();
        }, delayInSeconds * 1000);
    } else {
        message.textContent = "This link appears to be safe.";
        window.location.href = targetURL;
    }
}

// Checks Active Tab
function activeTab(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        targetURL = changeInfo.url;
        console.log('Tab URL updated to:', targetURL);
        if (toggle.checked) {
            scanURL();
        }
    }
}

// If else statement which acts according to web extension's checkbox.
toggle.addEventListener("change", function() {
    if (toggle.checked) {
        browser.tabs.onUpdated.addListener(activeTab);
        console.log("Detector enabled, checking every links clicked.");
    } else {
        browser.tabs.onUpdated.removeListener(activeTab);
        console.log("Detector disabled, links are not checked.");
    }
});

// Detects if user clicks on a URL to pause it.
document.addEventListener('click', function(event) {
    if (event.target.tagName === 'A') {
        event.preventDefault();
        const url = event.target.href;
        handleURLClick(url);
    }
});

// Function to handle the URL click event
function handleURLClick(url) {
    console.log('Clicked URL:', url);
    targetURL = url;
}

// Reference:
// https://docs.virustotal.com/
