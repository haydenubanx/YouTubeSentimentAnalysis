let isModelTrained = false;
let lastVideoId = null;


async function sendCommentToDatabase(comment, sentiment) {
    const apiUrl = 'https://haydeneubanks.co.uk/includes/DbConnection/apiEndpoint.php';

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sentiment: sentiment === 'positive' ? 4 : 0,  // 4 for positive, 0 for negative
            comment: comment.comment,                    // Send comment text
        }),
    });

    const result = await response.json();
    if (result.success) {
        console.log('Comment saved successfully');
    } else {
        console.error('Failed to save comment:', result.error);
    }
}

// Wait for the model to be trained before proceeding with sentiment analysis
async function initializeModelAndStartSentiment() {
    return new Promise((resolve, reject) => {
        // Check if model is already trained to avoid redundant calls
        if (isModelTrained) {
            resolve(true);  // Resolve immediately if model is trained
            return;
        }

        // Request the background script to check the model training status
        // chrome.runtime.sendMessage({action: 'checkModelTraining'}, (response) => {
        //     if (response.modelTrained) {
        //         isModelTrained = true;  // Mark model as trained
        //         console.log("Model is already trained. Ready for sentiment analysis.");
        //         resolve(true);  // Resolve the promise
        //     } else {
        //         console.error('Model is not trained.');
        //         reject(false);  // Reject the promise if training fails
        //     }
        // });
    });
}

function trainModel() {
    // Logic to train the model (load CSV, process data, etc.)
    getTrainingDataFromCsvAndDatabase('trainingData/trainingData.csv').then(() => {
        isModelTrained = true;
        console.log("Model trained successfully.");
    }).catch(error => {
        console.error('Error during model training:', error);
    });
}

// Function to start sentiment analysis when the video ID changes
async function startSentimentAnalysis() {
    const videoId = getVideoIdFromUrl();
    if (videoId && isModelTrained) {
        console.log('Starting sentiment analysis for Video ID:', videoId);
        await fetchYoutubeCommentsVideoId(videoId);  // Proceed with sentiment analysis
    } else {
        console.error('Model is not trained or no valid video ID found.');
    }
}


// Function to inject sentiment score into the YouTube DOM
function injectSentimentIntoPage(overallSentiment, positivityPercentage, sentimentData) {
    const existingSentiment = document.getElementById('sentiment-analysis');
    if (existingSentiment) {
        // If already exists, update the content
        existingSentiment.remove();
    }

    // Create a new div to display sentiment analysis
    const sentimentDiv = document.createElement('div');
    sentimentDiv.id = 'sentiment-analysis';
    sentimentDiv.style.backgroundColor = '#ffeb3b';
    sentimentDiv.style.padding = '10px';
    sentimentDiv.style.margin = '10px 0';
    sentimentDiv.style.borderRadius = '5px';
    sentimentDiv.style.color = '#000';
    sentimentDiv.style.fontWeight = 'bold';
    sentimentDiv.style.textAlign = 'center';

    sentimentDiv.innerHTML = `
        <p>Overall Sentiment: ${overallSentiment}</p>
        <p>Positivity Percentage: ${positivityPercentage.toFixed(2)}%</p>
    `;

    // Inject this div above the comments section
    const target = document.querySelector('#comments');  // Inject above comments
    if (target) {
        target.insertAdjacentElement('beforebegin', sentimentDiv);
    } else {
        console.error('YouTube comments section not found.');
    }
}


// Listen for the message to start sentiment analysis
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startSentimentAnalysis' && isModelTrained) {
        startSentimentAnalysis(); // Perform sentiment analysis if the model is trained
    } else {
        console.error('Model is not trained yet.');
    }
});


// Function to detect URL changes (YouTube video changes) and trigger sentiment analysis
function observeUrlChanges() {
    // Override pushState and replaceState to detect navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    // Override history.pushState
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        startSentimentAnalysis();
    };

    // Override history.replaceState
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        startSentimentAnalysis();
    };

    // Listen for popstate events (e.g., browser back/forward button clicks)
    window.addEventListener('popstate', () => {
        startSentimentAnalysis();
    });
}

// Call this function when the content script loads
observeUrlChanges();


// Function to extract video ID from YouTube URL
function getVideoIdFromUrl() {
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    let videoId = urlParams.get("v");  // Extract the 'v' query parameter as the video ID

    if (!videoId) {
        // Try to extract the video ID using a regular expression for URLs without the 'v' parameter
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = currentUrl.match(regex);
        if (match && match[1]) {
            videoId = match[1];
        }
    }

    if (videoId) {
        console.log('Extracted video ID:', videoId);
        return videoId;
    } else {
        // console.error('Unable to extract video ID from the URL.');
        return null;
    }
}

// Send video ID to the background script
const videoId = getVideoIdFromUrl();
if (videoId) {
    // Send message to background script to start sentiment analysis
    chrome.runtime.sendMessage({action: 'getVideoId'}, (response) => {
        const videoId = response.videoId;
        if (videoId) {
            // Fetch the sentiment analysis and inject the data into the YouTube page
            getTrainingDataFromCsvAndDatabase(chrome.runtime.getURL('trainingData/trainingData.csv'))
                .then(() => {
                    fetchYoutubeCommentsVideoId(videoId).then((sentimentData) => {
                        const {overallSentiment, positivityPercentage, individualCommentData} = sentimentData;
                        injectSentimentIntoPage(overallSentiment, positivityPercentage, individualCommentData);
                    });
                })
                .catch(error => {
                    console.error('Error fetching CSV file:', error);
                });
        } else {
            console.error('No video ID found in the response.');
        }
    });
}

function retryFetchVideoId() {
    const videoId = getVideoIdFromUrl();

    if (videoId) {
        console.log('Video ID found:', videoId);
        sendVideoId(videoId);
        // Trigger the sentiment analysis using the retrieved video ID
        getTrainingDataFromCsvAndDatabase(chrome.runtime.getURL('trainingData/trainingData.csv')).then(() => {
            fetchYoutubeCommentsVideoId(videoId);
        }).catch(error => {
            console.error('Error fetching CSV file:', error);
        });
    } else {
        console.info('Unable to extract video ID from the URL. Retrying in 1 second...');
        setTimeout(retryFetchVideoId, 1000);  // Retry after 1 seconds
    }
}

function sendVideoId(videoId) {
    chrome.runtime.sendMessage({action: 'sendVideoId', videoId: videoId});
}


let allCommentsData = []; // Global variable to store all comments after sentiment analysis

// Function to display comments based on sentiment, with buttons to manually change sentiment
function displayFilteredComments(comments) {
    const commentsContainer = document.getElementById('commentsContainer');
    const loadingMessage = document.getElementById('loading-message');

    // Hide the loading message and show the comments container
    if (loadingMessage) {
        loadingMessage.style.display = 'none';
    }
    commentsContainer.style.display = 'block';

    commentsContainer.innerHTML = ''; // Clear existing comments

    comments.forEach(commentData => {
        const li = document.createElement('li');
        const sentimentColor = commentData.sentiment === 'Positive' ? 'green' :
            commentData.sentiment === 'Negative' ? 'red' : 'gray';

        let sentimentText = ``;

        if (commentData.sentiment === 'Positive') {
            sentimentText = `<span style="color:green;">Positive 😄</span>`;
        } else if (commentData.sentiment === 'Negative') {
            sentimentText = `<span style="color:red;">Negative 😡</span>`;
        } else {
            sentimentText = `<span style="color:gray;">Neutral 😐</span>`;
        }

        // Create buttons for user to manually update sentiment
        const positiveButton = document.createElement('button');
        positiveButton.textContent = 'Mark Positive';
        positiveButton.style.cssText = `
            background-color: #28a745;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            margin-right: 10px;
            cursor: pointer;
            transition: background-color 0.3s;
        `;
        positiveButton.onmouseover = () => {
            positiveButton.style.backgroundColor = '#218838'; // Darken on hover
        };
        positiveButton.onmouseout = () => {
            positiveButton.style.backgroundColor = '#28a745'; // Revert on mouse out
        };
        positiveButton.onclick = () => updateCommentSentiment(commentData, 'positive', li);

        const negativeButton = document.createElement('button');
        negativeButton.textContent = 'Mark Negative';
        negativeButton.style.cssText = `
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        `;
        negativeButton.onmouseover = () => {
            negativeButton.style.backgroundColor = '#c82333'; // Darken on hover
        };
        negativeButton.onmouseout = () => {
            negativeButton.style.backgroundColor = '#dc3545'; // Revert on mouse out
        };
        negativeButton.onclick = () => updateCommentSentiment(commentData, 'negative', li);

        li.innerHTML = `
            <div class="comment">
                <p class="comment-text">${commentData.comment}</p>
                <p class="comment-sentiment">Sentiment: ${sentimentText}</p>
                <p class="comment-probability">Positivity: ${(commentData.probability * 100).toFixed(2)}%</p>
                <p class="comment-likes">👍 Likes: ${commentData.likes}</p>
            </div>
        `;

        // Append buttons to the comment
        li.appendChild(positiveButton);
        li.appendChild(negativeButton);

        commentsContainer.appendChild(li);
    });
}

// Function to update comment sentiment and save it to the CSV

// Function to update comment sentiment and save it to the CSV
function updateCommentSentiment(commentData, newSentiment, commentElement) {
    const label = newSentiment === 'positive' ? 4 : 0;
    const maxPositivity = newSentiment === 'positive' ? 1.0 : 0.0; // Max or min positivity based on sentiment
    const updatedSentimentText = newSentiment === 'positive' ? `<span style="color:green;">Positive 😄</span>` : `<span style="color:red;">Negative 😡</span>`;

    // Update the sentiment text and positivity on the page
    commentElement.querySelector('.comment-sentiment').innerHTML = `Sentiment: ${updatedSentimentText}`;
    commentElement.querySelector('.comment-probability').innerHTML = `Positivity: ${(maxPositivity * 100).toFixed(2)}%`;

    // Update the underlying comment data (allCommentsData)
    updateCommentData(commentData, newSentiment, maxPositivity);

    // Send the updated comment to the MySQL database
    sendCommentToDatabase(commentData, newSentiment);
}

// Function to update the underlying comment data
function updateCommentData(commentData, newSentiment, maxPositivity) {
    commentData.sentiment = newSentiment === 'positive' ? 'Positive' : 'Negative';
    commentData.probability = maxPositivity;

    const commentIndex = allCommentsData.findIndex(c => c.comment === commentData.comment);
    if (commentIndex !== -1) {
        allCommentsData[commentIndex].sentiment = commentData.sentiment;
        allCommentsData[commentIndex].probability = commentData.probability;
    }
}


// Function to filter comments based on sentiment
function filterComments(filter) {
    let filteredComments = [];

    if (filter === 'all') {
        // Show all comments
        filteredComments = allCommentsData;
    } else {
        // Convert the filter to the appropriate sentiment type (capitalize first letter)
        let filterSentiment = filter.charAt(0).toUpperCase() + filter.slice(1);

        // Filter comments that match the sentiment
        filteredComments = allCommentsData.filter(comment => comment.sentiment === filterSentiment);
    }

    // Sort comments by probability in descending order
    filteredComments.sort((a, b) => b.probability - a.probability);

    // Display the sorted comments
    displayFilteredComments(filteredComments);
}

function getCsvData() {
    chrome.storage.local.get(['csvData'], (result) => {
        if (result.csvData) {
            console.log('CSV Data:', result.csvData);
        } else {
            console.log('No CSV data found in storage.');
        }
    });
}

// Fetch YouTube comments, analyze them, and display sentiment
async function fetchYoutubeCommentsVideoId(inputVideoId) {
    const commentsContainer = document.getElementById('commentsContainer');
    const loadingMessage = document.getElementById('loading-message');

    // Ensure the loading message is visible and the container is hidden initially
    loadingMessage.style.display = 'block';
    commentsContainer.style.display = 'none';

    const options = {
        method: 'GET',
        headers: {
            'User-Agent': '',
            'Accept': 'application/json'
        }
    };

    let totalCommentArray = [];

    const response = await fetch(`${apiBaseUrl}/commentThreads?part=snippet%2Creplies&videoId=${inputVideoId}&key=${key}&maxResults=100`, options)
        .catch(error => console.log(error));

    const record = await response.json().then(async responseJson => {
        let commentsArray = responseJson.items;
        let nextPage = responseJson.nextPageToken;

        // Collect all comments
        for (let i = 0; i < commentsArray.length; i++) {
            totalCommentArray.push(commentsArray[i]);
        }

        while (nextPage) {
            const innerResponse = await fetch(`${apiBaseUrl}/commentThreads?part=snippet%2Creplies&videoId=${inputVideoId}&pageToken=${nextPage}&key=${key}&maxResults=100`, options)
                .catch(error => console.log(error));

            const nextResponseJson = await innerResponse.json();
            commentsArray = nextResponseJson.items;
            nextPage = nextResponseJson.nextPageToken;

            for (let i = 0; i < commentsArray.length; i++) {
                totalCommentArray.push(commentsArray[i]);
            }
        }

        console.log('Comment Count: ', totalCommentArray.length);
        const sentimentData = analyzeSentiments(totalCommentArray); // Perform sentiment analysis
        allCommentsData = sentimentData.individualCommentData; // Store the analyzed comments globally

        await modifyCommentSection(
            sentimentData.overallSentiment,
            sentimentData.overallSentimentProbability,
            sentimentData.positivityPercentage
        );

        allCommentsData.sort((a, b) => b.probability - a.probability);

        // Initially display all comments
        displayFilteredComments(allCommentsData);
    });
}

async function modifyCommentSection(overallSentiment, overallSentimentProbability, positivityPercentage) {
    // Create a new paragraph element to display overall sentiment
    if (document.querySelector('#sentimentParagraph')) {
        return;
    }

    // Create a new paragraph element to display overall sentiment
    const sentimentParagraph = document.createElement('p');
    sentimentParagraph.id = 'sentimentParagraph';

    sentimentParagraph.innerHTML = `<span style="color:white;">Overall Comment Sentiment: </span>`;

    if (overallSentiment === 'Positive') {
        sentimentParagraph.innerHTML += `<span style="color:green;">Positive (${(overallSentimentProbability * 100).toFixed(2)}% positivity) 😄</span>`;
    } else if (overallSentiment === 'Negative') {
        sentimentParagraph.innerHTML += `<span style="color:red;">Negative (${(overallSentimentProbability * 100).toFixed(2)}% positivity) 😡</span>`;
    } else {
        sentimentParagraph.innerHTML += `<span style="color:gray;">Neutral (${(overallSentimentProbability * 100).toFixed(2)}% positivity) 😐</span>`;
    }


    // Style the paragraph (optional)
    sentimentParagraph.style.fontSize = '20px';
    sentimentParagraph.style.color = overallSentiment === 'Positive' ? 'green' : overallSentiment === 'Negative' ? 'red' : 'gray';
    sentimentParagraph.style.fontWeight = 'bold';
    sentimentParagraph.style.margin = '10px 0';
    sentimentParagraph.style.textAlign = 'center';
    sentimentParagraph.style.backgroundColor = '#333';
    sentimentParagraph.style.padding = '15px';
    sentimentParagraph.style.margin = '20px 0';
    sentimentParagraph.style.borderRadius = '8px';
    sentimentParagraph.style.color = '#ffa500'; // Orange text for consistency
    sentimentParagraph.style.fontWeight = 'bold';
    sentimentParagraph.style.textAlign = 'center';
    sentimentParagraph.style.fontSize = '18px';
    sentimentParagraph.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';


    // Insert the paragraph at the top of the page (before the first child of the body)
    const body = document.querySelector('.container');
    body.insertBefore(sentimentParagraph, body.firstChild);
}

//Function to observe the loading of the comments section (optional)
let isSentimentAdded = false; // Global flag to prevent multiple injections

// Function to observe the loading of the comments section
function observeComments() {
    const targetNode = document.body; // We observe changes in the body element

    const observerConfig = {
        childList: true, // Look for addition or removal of child nodes
        subtree: true    // Observe all descendants, not just direct children
    };

    const observerCallback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Only modify the comment section once
                if (!isSentimentAdded) {
                    // Check if sentiment data is available and inject it
                    chrome.runtime.sendMessage({action: 'getVideoId'}, (response) => {
                        const videoId = response.videoId;
                        if (videoId) {
                            fetchYoutubeCommentsVideoId(videoId);
                            // Create an observer instance
                            const observer = new MutationObserver(observerCallback);

                            // Start observing
                            observer.observe(targetNode, observerConfig);

                        } else {
                            console.error('No video ID found in the response.');
                        }
                    });

                    // Set the flag to true to prevent future injections
                    isSentimentAdded = true;
                }
            }
        }
    };


}

// Start observing when the page is loaded
// window.addEventListener('refresh', observeComments);

// Add event listeners to the filter buttons
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('filter-all').addEventListener('click', () => filterComments('all'));
    document.getElementById('filter-positive').addEventListener('click', () => filterComments('positive'));
    document.getElementById('filter-neutral').addEventListener('click', () => filterComments('neutral'));
    document.getElementById('filter-negative').addEventListener('click', () => filterComments('negative'));


    initializeModelAndStartSentiment();

    retryFetchVideoId();


    // Request the current video ID from the background script
    chrome.runtime.sendMessage({action: 'getVideoId'}, (response) => {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            const videoId = response.videoId;
            if (videoId) {
                if (request.action === 'startSentimentAnalysis') {
                    fetchYoutubeCommentsVideoId(videoId)

                        .catch(error => {
                            console.error('Error Performing Analysis:', error);
                        });
                }
            } else {
                console.error('No video ID found in the response.');
            }
        });
    });
});


chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed/updated, starting model training...");
    trainModel();  // Train model once during installation or update
});

// chrome.runtime.onStartup.addListener(() => {
//     console.log("Chrome started, training the model...");
//     trainModel();  // Train model on Chrome startup
// });

// Listener to respond to content scripts about model training status
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkModelTraining') {
        sendResponse({modelTrained: isModelTrained});
    }

    if (message.action === 'trainModel') {
        if (!isModelTrained) {
            trainModel();  // If model isn't trained yet, start the training process
            sendResponse({modelTrained: false});
        } else {
            sendResponse({modelTrained: true});
        }
    }
});


