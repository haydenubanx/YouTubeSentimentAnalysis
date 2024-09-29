
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes("youtube.com/watch")) {
        // Extract the video ID from the tab URL
        const videoId = new URLSearchParams(new URL(tab.url).search).get('v');

        if (videoId) {
            // Send the video ID to the content script
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: (id) => window.videoIdFromServiceWorker = id,
                args: [videoId]
            });

            // Store the video ID in the background script
            currentVideoId = videoId;
        }
    }
});

let currentVideoId = null; // Global variable to store the current video ID

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'getVideoId') {
        sendResponse({ videoId: currentVideoId });
    } else if (message.action === 'sendVideoId' && message.videoId) {
        currentVideoId = message.videoId;  // Update video ID
    }
    // Handle model training
    else if (message.action === 'trainModel') {
                console.log('Training data loaded:', trainingData);
                sendResponse({ modelTrained: true })
            .catch(error => {
                console.error('Error loading training data:', error);
                sendResponse({ modelTrained: false });
            });
    }
    return true;   // Keep the message channel open until response is sent
});

// Detect when a tab becomes active and check if it's a YouTube video tab
chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url && tab.url.includes("youtube.com/watch")) {
            const videoId = new URLSearchParams(new URL(tab.url).search).get('v');

            if (videoId) {
                // Store the new video ID if it's a YouTube video
                currentVideoId = videoId;
                chrome.scripting.executeScript({
                    target: { tabId: activeInfo.tabId },
                    function: (id) => window.videoIdFromServiceWorker = id,
                    args: [videoId]
                });
            }
        }
    });
});

// chrome.runtime.onInstalled.addListener(() => {
//     let csvUrl = chrome.runtime.getURL('trainingData/trainingData.csv');
//     fetch(csvUrl)
//         .then(response => response.text())
//         .then(csvContent => {
//             chrome.storage.local.set({ csvData: csvContent }, () => {
//                 console.log('CSV data loaded into local storage.');
//             });
//         })
//         .catch(error => console.error('Error loading CSV:', error));
// });


// Run sentiment analysis when the extension button is clicked
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: startSentimentAnalysis
    });
});

// Function to start sentiment analysis in the content script
function startSentimentAnalysis() {
    chrome.runtime.sendMessage({ action: 'startSentimentAnalysis' });
}

// Load the CSV data on installation
chrome.runtime.onInstalled.addListener(() => {
    let csvUrl = chrome.runtime.getURL('trainingData/trainingData.csv');
    fetch(csvUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        // .then(csvContent => {
        //     chrome.storage.local.set({ csvData: csvContent }, () => {
        //         console.log('CSV data loaded into local storage.');
        //     });
        // })
        .catch(error => {
            console.error('Error loading CSV:', error);
        });
});