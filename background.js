let isModelTrained = false;

function trainModel() {
    // Logic to train the model (load CSV, process data, etc.)
    getTrainingDataFromCsv('path_to_your_csv').then(() => {
        isModelTrained = true;
        console.log("Model trained successfully.");
    }).catch(error => {
        console.error('Error during model training:', error);
    });
}

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed/updated, starting model training...");
    trainModel();  // Train model once during installation or update
});

chrome.runtime.onStartup.addListener(() => {
    console.log("Chrome started, training the model...");
    trainModel();  // Train model on Chrome startup
});

// Listener to respond to content scripts about model training status
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkModelTraining') {
        sendResponse({ modelTrained: isModelTrained });
    }

    if (message.action === 'trainModel') {
        if (!isModelTrained) {
            trainModel();  // If model isn't trained yet, start the training process
            sendResponse({ modelTrained: false });
        } else {
            sendResponse({ modelTrained: true });
        }
    }
});

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
    else if (message.action === 'trainModel' && !isModelTrained) {
        console.log("Training the model...");
        await getTrainingDataFromCsv(chrome.runtime.getURL('trainingData/trainingData.csv')).then(() => {
            isModelTrained = true;  // Mark the model as trained
            console.log("Model trained successfully.");
            sendResponse({ modelTrained: true });  // Respond after training
        }).catch(error => {
            console.error('Error during model training:', error);
            sendResponse({ modelTrained: false });
        });
        return true;  // Keep the message channel open until response is sent
    }
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