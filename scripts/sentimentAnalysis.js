// Global word lists
let positiveWords = {};
let negativeWords = {};

let zeroCount = 0;
let fourCount = 0;

let apiBaseUrl = 'https://youtube.googleapis.com/youtube/v3';
let key = "AIzaSyBav8jQwmVNxRFk4Q2FcviOHnUwbJjM8cU";

function parseCSV(csvContent) {
    return Papa.parse(csvContent, {
        header: false,
        dynamicTyping: true,
        skipEmptyLines: true
    }).data;
}

async function getTrainingDataFromCsv(pathToCsv) {
    zeroCount = 0;
    fourCount = 0;

    return await fetch(pathToCsv)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(csvContent => {
            console.log("CSV Content Loaded Successfully");
            let allData = parseCSV(csvContent);
            console.log("Parsed Data:", allData);

            if (!allData || allData.length === 0) {
                throw new Error("Parsed CSV data is empty or undefined");
            }


            // Filter to only keep columns 0 and 5 (ensure enough columns in row)
            let filteredData = allData.map(row => [row[0], row[1]]);
            console.log('Filtered Data:', filteredData);

            let tableSize = filteredData.length;
            console.log('Number Of Data Entries:', tableSize);

            // Process each row and train the word lists
            for (let i = 0; i < tableSize; i++) {
                let label = parseInt(filteredData[i][0], 10);

                // Ignore invalid labels
                if (label !== 0 && label !== 4) continue;

                if (label === 0) zeroCount++;
                if (label === 4) fourCount++;

                // Convert label: 4 -> positive, 0 -> negative
                label = label === 4 ? 1 : 0;

                let text = filteredData[i][1];
                // Vectorize text and update positive or negative word lists
                vectorizeText(text, label);
            }

            console.log('Zero Count:', zeroCount);
            console.log('Four Count:', fourCount);

            console.log('Positive Words:', positiveWords);
            console.log('Negative Words:', negativeWords);
        })
        .catch(error => console.error('Error fetching CSV file:', error));
}

function vectorizeText(text, label) {
    const words = text.split(/\W+/);

    words.forEach(word => {
        word = word.toLowerCase(); // Normalize to lowercase
        if (label === 1) {
            // Positive sentiment
            if (positiveWords[word]) {
                positiveWords[word]++;
            } else {
                positiveWords[word] = 1;
            }
        } else if (label === 0) {
            // Negative sentiment
            if (negativeWords[word]) {
                negativeWords[word]++;
            } else {
                negativeWords[word] = 1;
            }
        }
    });
}

function analyzeSentiments(commentsArray) {
    let totalSentimentScore = 0;
    let sentimentCount = 0;

    commentsArray.forEach(commentThread => {
        const topLevelComment = commentThread.snippet.topLevelComment.snippet.textDisplay;

        // Manually perform sentiment analysis
        const sentimentScore = calculateSentimentScore(topLevelComment);

        // Accumulate sentiment scores
        totalSentimentScore += sentimentScore;
        sentimentCount++;
    });

    // Calculate average sentiment score
    const averageSentimentScore = totalSentimentScore / sentimentCount;

    // Determine overall sentiment based on average score
    let overallSentiment = 'Neutral';
    if (averageSentimentScore > 0) {
        overallSentiment = 'Positive';
    } else if (averageSentimentScore < 0) {
        overallSentiment = 'Negative';
    }

    // Calculate sentiment probability (absolute value of average score)
    const sentimentProbability = Math.abs(averageSentimentScore);

    return {
        overallSentiment,
        sentimentProbability
    };
}

function calculateSentimentScore(commentText) {
    let score = 0;
    const words = commentText.split(/\W+/);

    words.forEach(word => {
        word = word.toLowerCase();
        if (positiveWords[word]) {
            score += positiveWords[word]; // Add positive word count
        } else if (negativeWords[word]) {
            score -= negativeWords[word]; // Subtract negative word count
        }
    });

    return score;
}

function displayComments(commentsArray, overallSentiment, sentimentProbability) {
    const commentsList = document.querySelector('#commentsContainer');
    commentsList.innerHTML = '';

    // Display overall sentiment and probability
    const overallSentimentText = document.createElement('p');
    overallSentimentText.textContent = `Overall Sentiment: ${overallSentiment}`;
    const sentimentProbabilityText = document.createElement('p');
    sentimentProbabilityText.textContent = `Sentiment Probability: ${sentimentProbability.toFixed(2)}`;
    commentsList.appendChild(overallSentimentText);
    commentsList.appendChild(sentimentProbabilityText);

    if (commentsArray && Array.isArray(commentsArray)) {
        commentsArray.forEach(commentThread => {
            const topLevelComment = commentThread.snippet.topLevelComment.snippet;

            const li = document.createElement('li');
            li.innerHTML = `
                        <div class="comment">
                            <img src="${topLevelComment.authorProfileImageUrl}" alt="${topLevelComment.authorDisplayName}'s profile picture" class="author-image">
                            <div class="comment-body">
                                <a href="${topLevelComment.authorChannelUrl}" class="author-name">${topLevelComment.authorDisplayName}</a>
                                <p class="comment-text">${topLevelComment.textDisplay}</p>
                                <p class="comment-likes">👍 ${topLevelComment.likeCount}</p>
                                <p class="comment-date">${new Date(topLevelComment.publishedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    `;
            commentsList.appendChild(li);
        });
    } else {
        console.error('Invalid commentsArray or no comments available.');
    }
}

async function fetchYoutubeCommentsVideoId(inputVideoId) {
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
        const sentimentData = analyzeSentiments(totalCommentArray);
        displayComments(totalCommentArray, sentimentData.overallSentiment, sentimentData.sentimentProbability);
    });
}

// Train the word lists from the CSV training data first, then fetch YouTube comments
getTrainingDataFromCsv('trainingData/trainingData.csv').then(() => {
    fetchYoutubeCommentsVideoId("B8Ihv3xsWYs");
});