let isModelTrained = false;
let lastVideoId = null;
let retryInterval = 1000; // Retry every 1 second
let videoIdContentScript = "";

// Call this when content script starts
initializeModel().then(() => {
    observeUrlChanges();  // Start observing changes
}).catch(() => {
    console.log('Sentiment analysis disabled until the model is trained.');
});


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

// Function to disable filter buttons during loading
function disableFilterButtons() {
    const filterButtons = document.querySelectorAll('#filter-buttons .btn');
    filterButtons.forEach(button => {
        button.disabled = true;
        button.style.cursor = 'not-allowed';    // Change cursor to indicate non-clickable
    });
}

// Function to enable filter buttons after loading completes
function enableFilterButtons() {
    const filterButtons = document.querySelectorAll('#filter-buttons .btn');
    filterButtons.forEach(button => {
        button.disabled = false;
        button.style.backgroundColor = '';  // Restore button color
        button.style.cursor = 'pointer';    // Restore cursor to pointer
    });
}


// Function to initialize model training
async function initializeModel() {
    const trained = await checkModelTrainedStatus();
    if (trained) {
        console.log('Model is already trained.');
        return true;
    } else {
        console.log('Training the model...');
        return getTrainingDataFromCsvAndDatabase("trainingData/trainingData.csv", 'train').then(() => {
            isModelTrained = true;
            console.log('Model trained successfully.');
            return true;
        }).catch(error => {
            console.error('Error during model training:', error);
            return false;
        });
    }
}


function checkModelTrainedStatus() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({action: 'checkModelTrained'}, (response) => {
            if (response.isModelTrained) {
                isModelTrained = true;
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

// function trainModel() {
//     // Logic to train the model (load CSV, process data, etc.)
//     getTrainingDataFromCsvAndDatabase('trainingData/trainingData.csv').then(() => {
//         isModelTrained = true;
//         console.log("Model trained successfully.");
//     }).catch(error => {
//         console.error('Error during model training:', error);
//     });
// }

// Function to start sentiment analysis when the video ID changes
async function startSentimentAnalysis() {
    const videoId = getVideoIdFromUrl();
    if (videoId && isModelTrained) {
        console.log('Starting sentiment analysis for video ID:', videoId);
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

    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;

    sentimentData.forEach(commentData => {
        if (commentData.sentiment === 'Positive') {
            positiveCount++;
        } else if (commentData.sentiment === 'Negative') {
            negativeCount++;
        } else {
            neutralCount++;
        }
    });

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
        <p>Positive Comments: ${positiveCount}</p>
        <p>Neutral Comments: ${neutralCount}</p>
        <p>Negative Comments: ${negativeCount}</p>
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
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startSentimentAnalysis') {
        const videoId = getVideoIdFromUrl(); // Assuming this function extracts the video ID

        if (videoId) {
            console.log('Starting sentiment analysis for video ID:', videoId);
            // Proceed with sentiment analysis
        } else {
            console.error('No valid video ID found.');
        }
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
        return false;
    }
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startSentimentAnalysis') {
        const videoId = getVideoIdFromUrl();

        if (videoId) {
            console.log('Starting sentiment analysis for video ID:', videoId);
            // Proceed with sentiment analysis logic here
        } else {
            console.error('No valid video ID found.');
        }
    }
});

function retryFetchVideoId() {
    const videoId = getVideoIdFromUrl();

    if (videoId) {
        console.log('Valid video ID found:', videoId);
        sendVideoId(videoId);
    } else if (window.location.href.includes("youtube.com/watch")) {
        console.log('Retrying to fetch video ID...');
        setTimeout(retryFetchVideoId, retryInterval); // Retry after 1 second
    } else {
        console.log('Not a valid YouTube page. Stopping retries.');
    }
}

function sendVideoId(videoId) {
    chrome.storage.local.set({lastVideoId: videoId}, () => {
        console.log('Video ID stored successfully:', videoId);
    });
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
    disableFilterButtons();
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
        enableFilterButtons();
    });
}

async function modifyCommentSection(overallSentiment, overallSentimentProbability, positivityPercentage) {
    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;

    // Count the number of positive, neutral, and negative comments
    allCommentsData.forEach(commentData => {
        if (commentData.sentiment === 'Positive') {
            positiveCount++;
        } else if (commentData.sentiment === 'Negative') {
            negativeCount++;
        } else {
            neutralCount++;
        }
    });

    // Check if the sentimentParagraph already exists
    let sentimentParagraph = document.querySelector('.sentimentParagraph');

    if (sentimentParagraph) {
        // If it exists, update the content with new stats
        sentimentParagraph.innerHTML = `<span style="color:white;">Overall Comment Sentiment: </span>`;

        if (overallSentiment.includes('Positive')) {
            sentimentParagraph.innerHTML += `<span style="color:green;">${overallSentiment} (${(overallSentimentProbability).toFixed(2)}% positivity rating) 😄</span>`;
        } else if (overallSentiment.includes('Negative')) {
            sentimentParagraph.innerHTML += `<span style="color:red;">${overallSentiment} (${(overallSentimentProbability).toFixed(2)}% positivity rating) 😡</span>`;
        } else {
            sentimentParagraph.innerHTML += `<span style="color:gray;">${overallSentiment} (${(overallSentimentProbability).toFixed(2)}% positivity rating) 😐</span>`;
        }

        sentimentParagraph.innerHTML += `
            <div style="font-size: 14px; color: #ccc; margin-top: 8px;">
            <p>Positive Comments: ${positiveCount}</p>
            <p>Neutral Comments: ${neutralCount}</p>
            <p>Negative Comments: ${negativeCount}</p>
            </div>
        `;
    } else {
        // If it doesn't exist, create a new paragraph element
        sentimentParagraph = document.createElement('p');
        sentimentParagraph.id = 'sentimentParagraph';
        sentimentParagraph.className = 'sentimentParagraph';

        sentimentParagraph.innerHTML = `<span style="color:white;">Overall Comment Sentiment: </span>`;

        if (overallSentiment.includes('Positive')) {
            sentimentParagraph.innerHTML += `<span style="color:green;">${overallSentiment} (${(overallSentimentProbability).toFixed(2)}% positivity rating) 😄</span>`;
        } else if (overallSentiment.includes('Negative')) {
            sentimentParagraph.innerHTML += `<span style="color:red;">${overallSentiment} (${(overallSentimentProbability).toFixed(2)}% positivity rating) 😡</span>`;
        } else {
            sentimentParagraph.innerHTML += `<span style="color:gray;">${overallSentiment} (${(overallSentimentProbability).toFixed(2)}% positivity rating) 😐</span>`;
        }

        sentimentParagraph.innerHTML += `
            <div style="font-size: 14px; color: #ccc; margin-top: 8px;">
            <p>Positive Comments: ${positiveCount}</p>
            <p>Neutral Comments: ${neutralCount}</p>
            <p>Negative Comments: ${negativeCount}</p>
            </div>
        `;

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

        // Insert the new paragraph at the top of the page (before the first child of the body)
        const body = document.querySelector('.container');
        body.insertBefore(sentimentParagraph, body.firstChild);
    }
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
                        videoIdContentScript = response.videoId;
                        if (videoIdContentScript) {
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


    retryFetchVideoId();


    observeUrlChanges();


    // Request the current video ID from the background script
    chrome.runtime.sendMessage({action: 'getVideoId'}, (response) => {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            videoIdContentScript = response.videoId;
            if (videoIdContentScript) {
                if (request.action === 'startSentimentAnalysis') {
                    fetchYoutubeCommentsVideoId(videoIdContentScript)

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


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'trainModelFromBackground') {

        isModelTrained = false;

        console.log('Received message to train the model.');

        // Train the model and send a response
        getTrainingDataFromCsvAndDatabase('trainingData/trainingData.csv', 're-train')
            .then(() => {
                isModelTrained = true;
                console.log('Model trained successfully.');
                sendResponse({success: isModelTrained});
            })
            .catch((error) => {
                console.error('Error during model training:', error);
                sendResponse({success: isModelTrained});
            });

        return true;  // Keep the message channel open until response is sent
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const retrainButton = document.getElementById('retrain-button');
    const filterButtons = document.querySelectorAll('.btn'); // Assuming all buttons have the class 'btn'
    const loadingMessage = document.getElementById('loading-message');
    const commentsContainer = document.getElementById('commentsContainer');

    // Function to disable buttons and show the loading message
    function disableButtonsAndShowLoading() {
        filterButtons.forEach(button => {
            button.disabled = true;
            // button.style.backgroundColor = '#ccc'; // Grey out the buttons
            button.style.cursor = 'not-allowed';   // Change cursor to indicate non-clickable
        });
        loadingMessage.style.display = 'block';  // Show loading message
        commentsContainer.style.display = 'none'; // Hide comments during loading
    }

    // Function to enable buttons and hide the loading message
    function enableButtonsAndHideLoading() {
        filterButtons.forEach(button => {
            button.disabled = false;
            button.style.backgroundColor = '';    // Restore the original button color
            button.style.cursor = 'pointer';      // Restore pointer cursor
        });
        loadingMessage.style.display = 'none';   // Hide loading message
        commentsContainer.style.display = 'block'; // Show comments after loading
    }

    // Event listener for retraining model
    retrainButton.addEventListener('click', () => {
        disableButtonsAndShowLoading();  // Disable buttons and show loading

        // Send a message to trigger model retraining
        chrome.runtime.sendMessage({action: 'trainModel'}, (response) => {
            if (response.isModelTrained) {
                console.log('Model retrained successfully.');
                observeUrlChanges();

                // Once retraining is done, fetch comments again
                chrome.runtime.sendMessage({action: 'getVideoId'}, (response) => {
                    if (videoIdContentScript) {
                        fetchYoutubeCommentsVideoId(videoIdContentScript)
                            .then(() => {
                                enableButtonsAndHideLoading();  // Re-enable buttons and hide loading
                            })
                            .catch(error => {
                                console.error('Error fetching comments:', error);
                                enableButtonsAndHideLoading();  // Re-enable buttons even on error
                            });
                    } else {
                        console.error('No video ID found.');
                        enableButtonsAndHideLoading();  // Re-enable buttons even if no video ID is found
                    }
                });
            } else {
                console.error('Model retraining failed.');
                enableButtonsAndHideLoading();  // Re-enable buttons even if retraining failed
            }
        });
    });
});


