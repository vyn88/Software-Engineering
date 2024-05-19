// VirusTotal API
const apiKey = "<Enter your Personal VirusTotal API Key>";
const apiURL = "https://www.virustotal.com/api/v3/urls";

// Function to send URL for scanning.
async function scanURL(url) {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'x-apikey': apiKey,
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ url })
    };

    const response = await fetch(apiURL, options);
    const data = await response.json();
    return data.data.id;
}

// Function to request URL analysis.
async function analysisURL(analysisID) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-apikey': apiKey
        }
    };

    const response = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisID}`, options);
    const data = await response.json();
    return data.data.attributes.stats.malicious;
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.type === 'scan-url') {
        try {
            const analysisID = await scanURL(request.url);
            const maliciousCount = await analysisURL(analysisID);
            sendResponse({ maliciousCount });
        } catch (error) {
            console.error(error);
            sendResponse({ maliciousCount: 0 });
        }
    } else if (request.type === 'show-notification') {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'assets/icon128.png',
            title: 'Phishing Link Detector',
            message: 'Warning: The link is potentially dangerous.',
            buttons: [
                { title: 'Stay Here' },
                { title: 'Proceed Anyway' }
            ],
            priority: 2
        }, function(notificationId) {
            chrome.notifications.onButtonClicked.addListener(function(notifID, btnIdx) {
                if (notifId === notificationId) {
                    if (btnIdx === 0) {
                        chrome.tabs.update(sender.tab.id, { url: request.previousUrl });
                    } else if (btnIdx === 1) {
                        chrome.tabs.update(sender.tab.id, { url: request.url });
                    }
                }
            });
        });
    }
    return true;
})

// Reference:
// https://docs.virustotal.com/
