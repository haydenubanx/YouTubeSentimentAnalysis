chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes("youtube.com/watch")) {
        // Extract the video ID from the tab URL
        const videoId = new URLSearchParams(new URL(tab.url).search).get('v');

        // Send the video ID to the content script
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            function: (id) => window.videoIdFromServiceWorker = id,
            args: [videoId]
        });
    }
});

// Function to inject the video ID into the content script
function injectVideoId(videoId) {
    window.videoIdFromServiceWorker = videoId;
    console.log("Injected Video ID:", videoId);
}

let currentVideoId = null;

// Listener to store video ID sent from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'sendVideoId' && message.videoId) {
        currentVideoId = message.videoId;  // Store the current video ID
    }
});

// Respond to the popup with the current video ID
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getVideoId') {
        sendResponse({ videoId: currentVideoId });
    }
});