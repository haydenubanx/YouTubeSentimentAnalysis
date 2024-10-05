
let isModelTrained2 = false;
let currentVideoId = null;

async function initializeModel2() {

    isModelTrained2 = true;

    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const activeTab = tabs[0];
                // Ensure that the active tab is a valid URL
                if (!activeTab.url.startsWith('chrome://') && !activeTab.url.startsWith('about://')) {
                    // Send a message to the content script to trigger the model training
                    chrome.runtime.sendMessage({ action: 'trainModelFromBackground' }, (response) => {
                        if (chrome.runtime.lastError) {
                            console.error('Error sending message to content script:', chrome.runtime.lastError.message);
                            reject(false);  // Reject the promise if there's an error in message sending
                        } else if (response && response.success) {
                            console.log('Model trained successfully.');
                            resolve(true);  // Resolve the promise when the content script finishes training
                        } else {
                            console.error('Model training failed in content script.');
                            reject(false);  // Reject if training fails
                        }
                    });
                } else {
                    // console.error('Cannot inject content script into restricted URL:', activeTab.url);
                    // reject(false);  // Reject the promise if the URL is restricted
                }
            } else {
                console.error('No active tab found.');
                reject(false);  // Reject the promise if no active tab is found
            }
        });
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkModelTrained') {
        sendResponse({ isModelTrained: isModelTrained2 });
    }
    return true;
});


// Function to trigger model training daily
function trainModelDaily() {
    return new Promise((resolve, reject) => {
        isModelTrained2 = false;

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const activeTab = tabs[0];
                if (!activeTab.url.startsWith('chrome://') && !activeTab.url.startsWith('about://')) {
                    initializeModel2()
                        .then(() => {
                            resolve(true);  // Resolve the Promise
                        })
                        .catch((error) => {
                            console.error('Training failed:', error);
                            reject(false);  // Reject the Promise
                        });
                } else {
                    // console.error('Cannot inject content script into restricted URL:', activeTab.url);
                    // reject(false);
                }
            } else {
                console.error('No active tab found.');
                // reject(false);
            }
        });
    });
}

// On initial installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed. Training model...');
    trainModelDaily();
    return true;
});

// Setup an alarm to train daily at 3:00 AM
chrome.alarms.create('dailyModelTraining', {
    when: Date.now(),
    periodInMinutes: 1440 // 1440 minutes = 24 hours
});

// Listen for the alarm to trigger training at 3:00 AM
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'dailyModelTraining') {
        const currentTime = new Date();
        if (currentTime.getHours() === 3) {
            console.log('Running daily model training at 3:00 AM...');
            trainModelDaily();
        }
    }

    return true;
});

// // Listen for the message to trigger model training
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === 'trainModel') {
//         trainModelDaily()
//             .then(() => {
//                 isModelTrained2 = true;
//                 sendResponse({ isModelTrained: isModelTrained2 });
//             })
//             .catch((error) => {
//                 isModelTrained2 = false;
//                 sendResponse({ isModelTrained: isModelTrained2 });
//             });
//
//         return true; // Keep the message channel open until response is sent
//     }
// });

// Listen for clicks on the extension button
chrome.action.onClicked.addListener((tab) => {
    // Ensure that sentiment analysis only starts once the model is trained
    trainModelDaily()
        .then((trained) => {
            if (isModelTrained2) {
                sendResponse({ isModelTrained: isModelTrained2 });
                console.log('Model was trained, starting sentiment analysis...');
            } else {
                sendResponse({ isModelTrained: isModelTrained2 });
                console.log('Model was already trained, proceeding with sentiment analysis...');
            }
            // Now that the model is trained, inject and start sentiment analysis
            // chrome.scripting.executeScript({
            //     target: { tabId: tab.id },
            //     function: startSentimentAnalysis // This function runs in the content script
            // });
        })
        .catch((error) => {
            console.error('Error training the model or starting sentiment analysis:', error);
        });

    return true;
});


// Sentiment analysis when extension action is clicked
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: startSentimentAnalysis
    });
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



chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'getVideoId') {
        sendResponse({ videoId: currentVideoId });
    } else if (message.action === 'sendVideoId' && message.videoId) {
        currentVideoId = message.videoId;  // Update video ID
    }
    return true;
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'trainModel') {
        let timeoutId = setTimeout(() => {
            sendResponse({ error: 'Timeout' });  // Timeout response
        }, 60000);  // Timeout after 60 seconds

        trainModelDaily()
            .then(() => {
                clearTimeout(timeoutId);
                sendResponse({isModelTrained: isModelTrained2});
            })
            .catch(error => {
                console.error('Error Performing Retraining:', error);
                sendResponse({isModelTrained: isModelTrained2});
            });

        return true;
    }
});