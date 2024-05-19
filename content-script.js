chrome.storage.local.get('toggleState', function(data) {
    if (data.toggleState) {
        document.addEventListener('click', function(event) {
            if (event.target.tagName === 'A' || event.target.closest('a')) {
                const link = event.target.closest('a');
                if (link && link.href) {
                    event.preventDefault();
                    const url = link.href;
                    const previousURL = window.location.href;

                    chrome.runtime.sendMessage({ type: 'scan-url', url}, function(response) {
                        if (response.maliciousCount >= 1) {
                            chrome.runtime.sendMessage({
                                type: 'show-notification',
                                url: url,
                                previousURL: previousURL
                            });
                        } else {
                            window.location.href = url;
                        }
                    });
                }
            }
        });
    }
});
