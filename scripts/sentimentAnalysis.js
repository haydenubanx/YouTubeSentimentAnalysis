// Pre-populated negative words with associated weights
let negativeWords = {
    "abominable": 3.0, "abhorrent": 3.0, "abysmal": 2.5, "adverse": 2.0, "alarm": 2.5,
    "anger": 2.5, "annoy": 2.0, "atrocious": 3.0, "awful": 2.5, "bad": 2.0,
    "betray": 2.5, "bitter": 2.0, "boring": 1.5, "chaos": 2.5, "complain": 2.0,
    "corrupt": 3.0, "cruel": 3.0, "damage": 2.0, "danger": 2.5, "degrade": 2.0,
    "disgusting": 3.0, "dreadful": 3.0, "evil": 3.0, "fear": 2.5, "frightening": 2.5,
    "gloomy": 2.0, "greed": 2.0, "harm": 2.0, "hate": 3.0, "horrible": 3.0,
    "worthless": 2.5, "wreck": 2.0, "ugly": 2.0, "untrustworthy": 2.5, "vicious": 3.0,
    "frustrating": 3.0, "missing": 1.0, "error": 3.0, "confusing": 2.0
};

// Pre-populated positive words with associated weights
let positiveWords = {
    "amazing": 3.0, "awesome": 3.0, "beautiful": 2.5, "bliss": 2.5, "brilliant": 3.0,
    "cheerful": 2.5, "delightful": 2.5, "ecstatic": 3.0, "elegant": 2.5, "excellent": 3.0,
    "fantastic": 3.0, "glad": 2.0, "graceful": 2.5, "happy": 3.0, "honest": 2.5,
    "incredible": 3.0, "joy": 2.5, "kind": 2.0, "love": 3.0, "lucky": 2.5,
    "marvelous": 3.0, "optimistic": 2.5, "peaceful": 2.0, "perfect": 3.0, "pleasant": 2.5,
    "wonderful": 3.0, "zealous": 2.0, "zest": 2.5, "vibrant": 2.5, "victorious": 3.0, "well": 1.0,
    "nice" : 2.0
};

// Pre-populated neutral words with associated weights
let neutralWords = {
    "account": 1.0, "balance": 1.0, "book": 1.0, "chair": 1.0, "data": 1.0,
    "document": 1.0, "event": 1.0, "fact": 1.0, "general": 1.0, "group": 1.0,
    "information": 1.0, "item": 1.0, "list": 1.0, "number": 1.0, "object": 1.0,
    "place": 1.0, "reference": 1.0, "schedule": 1.0, "table": 1.0, "unit": 1.0,
    "window": 1.0, "year": 1.0, "zone": 1.0, "medium": 1.0, "overview": 1.0
};

let zeroCount = 0;
let fourCount = 0;

let apiBaseUrl = 'https://youtube.googleapis.com/youtube/v3';
let key = "AIzaSyBav8jQwmVNxRFk4Q2FcviOHnUwbJjM8cU";

function trainAndTuneModel(trainSet, testSet, enhancedTrainingSet, initialEpochs = 10, maxIterations = 10000, learningRate = 0.01) {
    let previousAccuracy = 0;
    let iteration = 0;
    let tuned = false;

    // Initial training phase
    trainNetwork(trainSet, initialEpochs, learningRate);

    // Test after initial training
    let currentAccuracy = testNetwork(testSet);

    console.log(`Initial accuracy after ${initialEpochs} epochs: ${currentAccuracy}%`);

    // Fine-tuning phase for max iterations
    while (iteration < maxIterations && currentAccuracy > previousAccuracy) {
        previousAccuracy = currentAccuracy;
        iteration++;

        console.log(`Iteration ${iteration}: Tuning model with enhanced training set...`);

        // Fine-tuning with enhanced training set
        trainNetwork(enhancedTrainingSet, 1, learningRate);

        // Test after each tuning iteration
        currentAccuracy = testNetwork(testSet);

        console.log(`Accuracy after iteration ${iteration}: ${currentAccuracy}%`);

        // Check if the accuracy has improved
        if (currentAccuracy <= previousAccuracy) {
            console.log(`Accuracy plateaued or reduced. Stopping further tuning.`);
            tuned = true;
            break;
        }
    }

    if (!tuned) {
        console.log(`Reached maximum iterations (${maxIterations}) for tuning.`);
    } else {
        console.log(`Model tuning completed successfully after ${iteration} iterations.`);
    }

    return currentAccuracy;
}

function testNetwork(testSet) {
    let correctPredictions = 0;

    testSet.forEach(({ input, label }) => {
        let predictions = forwardPropagation(input);
        let predictedLabel = predictions.indexOf(Math.max(...predictions));
        let actualLabel = label.indexOf(Math.max(...label));

        if (predictedLabel === actualLabel) {
            correctPredictions++;
        }
    });

    let accuracy = (correctPredictions / testSet.length) * 100;
    console.log(`Test Accuracy: ${accuracy.toFixed(2)}%`);
    return accuracy;
}

function splitDatasetForEnhancedTraining(data, testRatio, enhancedTrainingRatio) {
    const totalSize = data.length;

    // Calculate the sizes of the test and enhanced training sets
    const testSize = Math.floor(totalSize * testRatio);
    const enhancedTrainingSize = Math.floor(totalSize * enhancedTrainingRatio);

    // Select the test set from the middle of the dataset
    const testSet = data.slice(Math.floor((totalSize - testSize) / 2), Math.floor((totalSize + testSize) / 2));

    // Select the enhanced training set from both ends of the dataset
    const enhancedTrainingSet = [
        ...data.slice(0, enhancedTrainingSize / 2),         // First part from the start
        ...data.slice(totalSize - enhancedTrainingSize / 2) // Last part from the end
    ];

    // The remaining data is the normal training set
    const trainSet = [
        ...data.slice(enhancedTrainingSize / 2, Math.floor((totalSize - testSize) / 2)),
        ...data.slice(Math.floor((totalSize + testSize) / 2), totalSize - enhancedTrainingSize / 2)
    ];

    return { trainSet, testSet, enhancedTrainingSet };
}

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

            // After parsing the CSV, segregate for enhanced training
            const { trainSet, testSet, enhancedTrainingSet } = splitDatasetForEnhancedTraining(filteredData, 0.2, 0.1);
            console.log('Train Set Size:', trainSet.length);
            console.log('Test Set Size:', testSet.length);
            console.log('Enhanced Training Set Size:', enhancedTrainingSet.length);

            // Train the model and tune it with 10,000 iterations
            const finalAccuracy = trainAndTuneModel(trainSet, testSet, enhancedTrainingSet);
            console.log(`Final accuracy after tuning: ${finalAccuracy}%`);
        })
        .catch(error => console.error('Error fetching CSV file:', error));
}

function vectorizeText(text, label) {
    // Remove extra whitespace and punctuation, lowercasing everything for consistency
    const words = text
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .toLowerCase()           // Normalize to lowercase
        .split(/\s+/);           // Split on any whitespace

    words.forEach(word => {
        if (label === 1) {
            // If the word is already in the positive list, increase its weight moderately
            positiveWords[word] = (positiveWords[word] || 1.0) + 0.7; // Increased weight for positive words
        } else if (label === 0) {
            // If the word is in the negative list, increase its weight significantly
            negativeWords[word] = (negativeWords[word] || 1.0) + 1.5; // Stronger impact for negative words
        } else {
            // Neutral words get a very small weight increase
            neutralWords[word] = (neutralWords[word] || 1.0) + 0.3; // Minimal weight for neutral words
        }
    });
}

function analyzeSentiments(commentsArray) {
    let totalSentimentScore = 0;
    let sentimentCount = 0;
    let positiveCount = 0;
    let negativeCount = 0;
    let individualCommentData = [];

    commentsArray.forEach(commentThread => {
        const topLevelComment = commentThread.snippet.topLevelComment.snippet.textDisplay;
        const likeCount = commentThread.snippet.topLevelComment.snippet.likeCount || 0; // Default to 0 if no likes

        // Manually perform sentiment analysis
        const sentimentScore = calculateSentimentScore(topLevelComment);

        // Weight the sentiment score by 1 + logarithmic likes, but with a damping factor
        const weightedSentimentScore = sentimentScore * (1 + 0.3 * Math.log1p(likeCount));

        // Apply sigmoid to sentiment score for smoother probability mapping
        const sentimentProbability = sigmoid(weightedSentimentScore);

        // Determine sentiment category based on score
        let commentSentiment = 'Neutral';
        if (weightedSentimentScore > 0.5) {
            commentSentiment = 'Positive';
            positiveCount++; // Increment positive count
        } else if (weightedSentimentScore < -0.5) {
            commentSentiment = 'Negative';
            negativeCount++; // Increment negative count
        }

        individualCommentData.push({
            comment: topLevelComment,
            likes: likeCount,
            sentiment: commentSentiment,
            probability: sentimentProbability
        });

        // Accumulate weighted sentiment scores
        totalSentimentScore += weightedSentimentScore;

        // Accumulate the number of comments (even with no likes)
        sentimentCount += (1 + likeCount);
    });

    // Calculate average sentiment score
    const averageSentimentScore = totalSentimentScore / sentimentCount;

    // Use sigmoid for overall sentiment probability to smooth it out
    const overallSentimentProbability = sigmoid(averageSentimentScore);

    // Determine overall sentiment based on average score
    let overallSentiment = 'Neutral';
    if (averageSentimentScore > 0.5) {
        overallSentiment = 'Positive';
    } else if (averageSentimentScore < -0.5) {
        overallSentiment = 'Negative';
    }

    // Calculate positivity percentage (only considering positive and negative comments)
    const totalPosNegComments = positiveCount + negativeCount;
    const positivityPercentage = totalPosNegComments > 0
        ? (positiveCount / totalPosNegComments) * 100
        : 0;

    return {
        overallSentiment,
        overallSentimentProbability,
        positivityPercentage,
        individualCommentData
    };
}


function calculateSentimentScore(commentText) {
    let score = 0;
    // Split the comment into words and filter out numbers
    const words = commentText.split(/\W+/).filter(word => isNaN(word)); // Exclude numbers
    const totalWords = words.length;

    // If no words remain after filtering or if the original comment had no words, treat as neutral
    const originalHasNoWords = commentText.trim().length === 0;
    if (totalWords === 0 || originalHasNoWords) {
        return 0; // Neutral score
    }

    // Calculate sentiment score for non-numeric words
    words.forEach(word => {
        word = word.toLowerCase();
        if (positiveWords[word]) {
            score += Math.min(positiveWords[word], 2); // Cap the max contribution of positive words
        } else if (negativeWords[word]) {
            score -= negativeWords[word] * 2; // Amplify negative words' impact
        } else if (neutralWords[word]) {
            score += 0.3; // Slight contribution for neutral words
        }
    });

    // Normalize score by total words to avoid skew
    return totalWords > 0 ? score / totalWords : 0;
}

function displayComments(commentsArray, overallSentiment, overallSentimentProbability, positivityPercentage, individualCommentData) {
    const commentsList = document.querySelector('#commentsContainer');
    commentsList.innerHTML = '';

    // Convert overall sentiment probability to a percentage without rounding
    const overallSentimentProbabilityPercentage = Math.floor(overallSentimentProbability * 100 * 100) / 100;
    const positivityPercentageRounded = Math.floor(positivityPercentage * 100) / 100;

    // Display overall sentiment, probability, and positivity percentage
    const overallSentimentText = document.createElement('p');
    overallSentimentText.textContent = `Overall Sentiment: ${overallSentiment}`;
    const overallSentimentProbabilityText = document.createElement('p');
    overallSentimentProbabilityText.textContent = `Overall Probability: ${overallSentimentProbabilityPercentage}%`;
    const positivityPercentageText = document.createElement('p');
    positivityPercentageText.textContent = `Overall Positivity Percentage: ${positivityPercentageRounded}%`;
    commentsList.appendChild(overallSentimentText);
    commentsList.appendChild(overallSentimentProbabilityText);
    commentsList.appendChild(positivityPercentageText);

    // Display individual comments with their sentiment and probability
    individualCommentData.forEach(commentData => {
        // Convert sentiment probability to a percentage without rounding
        const sentimentProbabilityPercentage = Math.floor(commentData.probability * 100 * 100) / 100;

        // Add emoji and color based on sentiment
        let sentimentText = '';
        if (commentData.sentiment === 'Positive') {
            sentimentText = `<span style="color:green;">Positive 😄</span>`;
        } else if (commentData.sentiment === 'Negative') {
            sentimentText = `<span style="color:red;">Negative ☹️</span>`;
        } else {
            sentimentText = `<span style="color:gray;">Neutral 😐</span>`;
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="comment">
                <p class="comment-text">${commentData.comment}</p>
                <p class="comment-sentiment">Sentiment: ${sentimentText}</p>
                <p class="comment-probability">Probability: ${sentimentProbabilityPercentage}%</p>
                <p class="comment-likes">👍 Likes: ${commentData.likes}</p>
            </div>
        `;
        commentsList.appendChild(li);
    });
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
        displayComments(totalCommentArray, sentimentData.overallSentiment, sentimentData.overallSentimentProbability, sentimentData.positivityPercentage, sentimentData.individualCommentData);
    });
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x)); // A smooth curve that maps sentiment to a range of 0 to 1
}


document.addEventListener('DOMContentLoaded', function () {
    // Your logic to modify the DOM here
    const commentsList = document.getElementById('commentsContainer');
    if (commentsList) {
        // Modify innerHTML or other properties here
    } else {
        console.error('commentsContainer not found');
    }
});

document.addEventListener('DOMContentLoaded', function () {
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