// Notifies on console log that service worker file is properly running.
console.log("Background script running...");

// Place private/public API key provided by VirusTotal API in the variable below.
const apiKey = "936803aa6044a28e800c277969dec53d51baf20d75d2fd4957a64b442ae9cb8f";

// Declared to be used by scanURL function.
let maliciousCount = -1;

// Takes URL as a parameter, then sends a Post request to VirusTotal API which returns a response
// containing an ID which is going to be used to determine how many vendors flagged URL as malicious.
function scanURL(linkTarget){
    const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'x-apikey': apiKey,
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({url: linkTarget})
      };
      
      fetch('https://www.virustotal.com/api/v3/urls', options)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            const analysisID = response.data.id;
            analysisURL(analysisID);
        })
        .catch(err => console.error(err));
}


// Takes analysis ID received from the scanURL function, sends a Get request to VirusTotal API
// then returns a response which contains number of vendors flagged malicious.
function analysisURL(analysisID){
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
            console.log('[+] Number of Vendors Flagged Malicious: ' + maliciousCount);
        })
        .catch(err => console.error(err));
}

// Everytime user clicks on a URL, they will be redirected to a loading page, where the extension
// needs to perform API calls before determining whether the URL visited is malicious or not.
// If URL is malicious (1 or more vendors marked as malicious), they will be redirected to a
// blocked page, notifying them that the URL is potentially harmful. If URL is safe, user will,
// continue to the URL as usual.
const navigationListen = (details) => {
    try {
        if (details.frameId === 0) {
            const url = new URL(details.url); // Create a URL object from the string
            maliciousCount = -1;
            console.log("Processing URL: " + details.url);
            chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL("loading.html") });

            scanURL(details.url);

            // Prevent infinite redirect loop by removing listener and adding it back
            // Sets a 3 second timer to let extension wait for VirusTotal's analysis result.
            setTimeout(() => {
                if (maliciousCount >= 1) {
                    console.log(`DANGER URL: ${details.url}`)
                    chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL("blocked.html") });
                } else {
                    chrome.webNavigation.onBeforeNavigate.removeListener(navigationListen);
                    chrome.tabs.update(details.tabId, { url: details.url });
                    chrome.webNavigation.onBeforeNavigate.addListener(navigationListen, { url: [{ schemes: ['http', 'https'] }] });
                }
                console.log("Finished Scanning. Results: " + maliciousCount + " vendors flagged as malicious.")
            }, 3000);
        }
    } catch (e) {
        console.error(`Error processing URL: ${details.url}`, e);
    }
}

// This line of code is executed once everytime the extension boots up.
// More detail of "navigationListen" function is available above.
chrome.webNavigation.onBeforeNavigate.addListener(navigationListen, { url: [{ schemes: ['http', 'https'] }] });
  
// Prints out every URL clicked on by the user on the console log.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        console.log(`Visited URL: ${tab.url}`);
    }
});

// References:
// - https://docs.virustotal.com/reference/scan-url
// - https://docs.virustotal.com/reference/analysis