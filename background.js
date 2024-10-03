

// Function to trigger model training daily
function trainModelDaily() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('lastTrainingDate', (result) => {
            const today = new Date();
            const lastTrainingDate = new Date(result.lastTrainingDate || 0);

            // Check if the model was not trained today
            if (today.getDate() !== lastTrainingDate.getDate()) {
                console.log("Training model...");

                // Get the active tab
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs.length > 0) {
                        const activeTab = tabs[0];

                        // Ensure the URL is valid (not chrome:// or about://)
                        if (!activeTab.url.startsWith('chrome://') && !activeTab.url.startsWith('about://')) {
                            // Inject the content script into the active tab
                                // Send a message to the content script to start training the model
                                chrome.tabs.sendMessage(activeTab.id, { action: 'trainModel' }, (response) => {
                                    if (chrome.runtime.lastError) {
                                        console.error('Error sending message:', chrome.runtime.lastError.message);
                                        reject('Error sending message to train model.');
                                        return;
                                    }

                                    // Check if model training was successful
                                    if (response && response.modelTrained) {
                                        chrome.storage.local.set({ lastTrainingDate: today.toISOString() }, () => {
                                            console.log('Model trained successfully and date updated.');
                                            resolve(true); // Resolve successfully after training
                                        });
                                    } else {
                                        console.error('Error training the model.');
                                        reject('Model training failed.');
                                    }
                                });
                        } else {
                            // console.error('Cannot inject content script into restricted URL:', activeTab.url);
                            // reject('Cannot inject content script into restricted URL.');
                        }
                    } else {
                        console.error('No active tab found.');
                        reject('No active tab found.');
                    }
                });
            } else {
                console.log('Model already trained today. No need to train again.');
                resolve(false); // Resolve with false if no training needed
            }
        });
    });
}

// On initial installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed. Training model...');
    trainModelDaily();
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
});

// Listen for the message to trigger model training
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'trainModel') {
        trainModelDaily()
            .then(() => {
                sendResponse({ modelTrained: true });
            })
            .catch((error) => {
                sendResponse({ modelTrained: false, error: error });
            });

        return true; // Keep the message channel open until response is sent
    }
});

// Listen for clicks on the extension button
chrome.action.onClicked.addListener((tab) => {
    // Ensure that sentiment analysis only starts once the model is trained
    trainModelDaily()
        .then((trained) => {
            if (trained) {
                console.log('Model was trained, starting sentiment analysis...');
            } else {
                console.log('Model was already trained, proceeding with sentiment analysis...');
            }
            // Now that the model is trained, inject and start sentiment analysis
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: startSentimentAnalysis // This function runs in the content script
            });
        })
        .catch((error) => {
            console.error('Error training the model or starting sentiment analysis:', error);
        });
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

let currentVideoId = null; // Global variable to store the current video ID

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'getVideoId') {
        sendResponse({ videoId: currentVideoId });
    } else if (message.action === 'sendVideoId' && message.videoId) {
        currentVideoId = message.videoId;  // Update video ID
    }
    // // Handle model training
    // else if (message.action === 'trainModel') {
    //             console.log('Training data loaded:', trainingData);
    //             sendResponse({ modelTrained: true })
    //         .catch(error => {
    //             console.error('Error loading training data:', error);
    //             sendResponse({ modelTrained: false });
    //         });
    // }
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
// chrome.runtime.onInstalled.addListener(() => {
//     let csvUrl = chrome.runtime.getURL('trainingData/trainingData.csv');
//     fetch(csvUrl)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response.text();
//         })
//         // .then(csvContent => {
//         //     chrome.storage.local.set({ csvData: csvContent }, () => {
//         //         console.log('CSV data loaded into local storage.');
//         //     });
//         // })
//         .catch(error => {
//             console.error('Error loading CSV:', error);
//         });
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'trainModel') {
        let timeoutId = setTimeout(() => {
            sendResponse({ error: 'Timeout' });  // Timeout response
        }, 60000);  // Timeout after 60 seconds

        trainModelDaily()
            .then(() => {
                clearTimeout(timeoutId);  // Clear the timeout
                sendResponse({ modelTrained: true });
            })
            .catch(error => {
                clearTimeout(timeoutId);  // Clear the timeout
                sendResponse({ modelTrained: false });
            });

        return true;
    }
});