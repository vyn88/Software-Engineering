document.addEventListener("DOMContentLoaded", function() {
    var toggle = document.getElementById("toggle");
    var message = document.getElementById("message");
    var status = document.getElementById("status");

    function saveToggle(state) {
        chrome.storage.local.set({ toggleState: state});
    }

    function getToggle(callback) {
        chrome.storage.local.get('toggleState', function(data) {
            var state = data.toggleState;
            if (state === undefined) {
                state = false;
            }
            callback(state);
        });
    }

    getToggle(function(state) {
        toggle.checked = state;
        updateStatus(state);
    });

    toggle.addEventListener("change", function() {
        var state = toggle.checked;
        saveToggle(state);
        updateStatus(state);
        if (toggle.checked) {
            console.log("Detector enabled, checking every link clicked.");
        } else {
            console.log("Detector disabled, links are not checked.");
        }
    });

    function updateStatus(state) {
        if (state) {
            status.textContent = "Currently enabled.";
        } else {
            status.textContent = "Currently disabled.";
        }
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.message) {
            message.textContent = request.message;
        }
    })
});