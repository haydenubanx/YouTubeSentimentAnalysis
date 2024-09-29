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
    if (request.action === 'startSentimentAnalysis') {
        startSentimentAnalysis();
    }
});

let lastVideoId = null;

// Function to start sentiment analysis when the video ID changes
function startSentimentAnalysis() {
    const videoId = getVideoIdFromUrl();
    if (videoId && videoId !== lastVideoId) {
        lastVideoId = videoId; // Update the last video ID
        console.log('Video ID found:', videoId);

        // Trigger the sentiment analysis using the retrieved video ID
        getTrainingDataFromCsv(chrome.runtime.getURL('trainingData/trainingData.csv')).then(() => {
            fetchYoutubeCommentsVideoId(videoId);
        }).catch(error => {
            console.error('Error fetching CSV file:', error);
        });
    }
}

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

// Function to start the sentiment analysis process
function startSentimentAnalysis() {
    const videoId = getVideoIdFromUrl();
    if (videoId) {
        console.log('Video ID found:', videoId);
        // Trigger the sentiment analysis using the retrieved video ID
        getTrainingDataFromCsv(chrome.runtime.getURL('trainingData/trainingData.csv')).then(() => {
            fetchYoutubeCommentsVideoId(videoId);
        }).catch(error => {
            console.error('Error fetching CSV file:', error);
        });
    } else {
        console.error('Unable to extract video ID from the URL.');
    }
}

// Function to extract video ID from YouTube URL
function getVideoIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("v");  // Extract the 'v' query parameter as the video ID
}

// Send video ID to the background script
const videoId = getVideoIdFromUrl();
if (videoId) {
    // Send message to background script to start sentiment analysis
    chrome.runtime.sendMessage({ action: 'getVideoId' }, (response) => {
        const videoId = response.videoId;
        if (videoId) {
            // Fetch the sentiment analysis and inject the data into the YouTube page
            getTrainingDataFromCsv(chrome.runtime.getURL('trainingData/trainingData.csv'))
                .then(() => {
                    fetchYoutubeCommentsVideoId(videoId).then((sentimentData) => {
                        const { overallSentiment, positivityPercentage, individualCommentData } = sentimentData;
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
} else {
    console.error('Unable to extract video ID from the URL.');
}

function retryFetchVideoId() {
    const videoId = getVideoIdFromUrl();

    if (videoId) {
        console.log('Video ID found:', videoId);
        sendVideoId(videoId);
        // Trigger the sentiment analysis using the retrieved video ID
        getTrainingDataFromCsv(chrome.runtime.getURL('trainingData/trainingData.csv')).then(() => {
            fetchYoutubeCommentsVideoId(videoId);
        }).catch(error => {
            console.error('Error fetching CSV file:', error);
        });
    } else {
        console.warn('Unable to extract video ID from the URL. Retrying in 1 second...');
        setTimeout(retryFetchVideoId, 1000);  // Retry after 1 seconds
    }
}

function sendVideoId(videoId) {
    chrome.runtime.sendMessage({ action: 'sendVideoId', videoId: videoId });
}



let allCommentsData = []; // Global variable to store all comments after sentiment analysis

// Function to display comments based on sentiment
function displayFilteredComments(comments) {
    const commentsContainer = document.getElementById('commentsContainer');
    const loadingMessage = document.getElementById('loading-message');

    // Hide the loading message and show the comments container
    loadingMessage.style.display = 'none';
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

        li.innerHTML = `
            <div class="comment">
                <p class="comment-text">${commentData.comment}</p>
                <p class="comment-sentiment">Sentiment: ${sentimentText}</p>
                <p class="comment-probability">Positivity: ${(commentData.probability * 100).toFixed(2)}%</p>
                <p class="comment-likes">👍 Likes: ${commentData.likes}</p>
            </div>
        `;
        commentsContainer.appendChild(li);
    });
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
        sentimentParagraph.innerHTML +=  `<span style="color:red;">Negative (${(overallSentimentProbability * 100).toFixed(2)}% positivity) 😡</span>`;
    } else {
        sentimentParagraph.innerHTML +=  `<span style="color:gray;">Neutral (${(overallSentimentProbability * 100).toFixed(2)}% positivity) 😐</span>`;
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
                    chrome.runtime.sendMessage({ action: 'getVideoId' }, (response) => {
                        const videoId = response.videoId;
                        if (videoId) {
                            getTrainingDataFromCsv(chrome.runtime.getURL('trainingData/trainingData.csv')).then(() => {
                                fetchYoutubeCommentsVideoId(videoId);
                                // Create an observer instance
                                const observer = new MutationObserver(observerCallback);

                                // Start observing
                                observer.observe(targetNode, observerConfig);
                            }).catch(error => {
                                console.error('Error fetching CSV file:', error);
                            });
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
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('filter-all').addEventListener('click', () => filterComments('all'));
    document.getElementById('filter-positive').addEventListener('click', () => filterComments('positive'));
    document.getElementById('filter-neutral').addEventListener('click', () => filterComments('neutral'));
    document.getElementById('filter-negative').addEventListener('click', () => filterComments('negative'));

    retryFetchVideoId();

    // Request the current video ID from the background script
    chrome.runtime.sendMessage({ action: 'getVideoId' }, (response) => {
        const videoId = response.videoId;
        if (videoId) {
            // Trigger the sentiment analysis using the retrieved video ID
            getTrainingDataFromCsv(chrome.runtime.getURL('trainingData/trainingData.csv')).then(() => {
                fetchYoutubeCommentsVideoId(videoId);
            }).catch(error => {
                console.error('Error fetching CSV file:', error);
            });
        } else {
            console.error('No video ID found in the response.');
        }
    });
});