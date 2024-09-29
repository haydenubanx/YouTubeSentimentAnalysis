// Pre-populated negative words with associated weights
let negativeWords = {
    "abominable": 3.0, "abhorrent": 3.0, "abysmal": 2.5, "adverse": 2.0, "alarm": 2.5,
    "anger": 2.5, "annoy": 2.0, "atrocious": 3.0, "awful": 2.5, "bad": 2.0,
    "betray": 2.5, "bitter": 2.0, "boring": 1.5, "chaos": 2.5, "complain": 2.0,
    "corrupt": 3.0, "cruel": 3.0, "damage": 2.0, "danger": 2.5, "degrade": 2.0,
    "disgusting": 3.0, "dreadful": 3.0, "evil": 3.0, "fear": 2.5, "frightening": 2.5,
    "gloomy": 2.0, "greed": 2.0, "harm": 2.0, "hate": 3.0, "horrible": 3.0,
    "worthless": 2.5, "wreck": 2.0, "ugly": 2.0, "untrustworthy": 2.5, "vicious": 3.0,
    "abandon": 2.0, "agony": 2.5, "anguish": 3.0, "annoying": 2.0, "appalling": 3.0,
    "arrogant": 2.5, "ashamed": 2.5, "atrophy": 3.0, "avoid": 2.0,
    "backstab": 2.5, "baffling": 2.0, "bankrupt": 3.0, "barbaric": 3.0, "betrayed": 2.5,
    "bleak": 2.5, "blunder": 2.0, "brutal": 3.0, "bug": 1.5, "burden": 2.5,
    "callous": 2.5, "catastrophic": 3.0, "chaotic": 2.5, "clumsy": 2.0, "complaint": 2.0,
    "contempt": 3.0, "coward": 2.5, "creepy": 2.5,
    "crisis": 2.5, "criticize": 2.0, "cruelty": 3.0, "cry": 2.5, "cynical": 2.5,
    "dangerous": 2.5, "deadly": 3.0, "defeat": 2.5, "defective": 2.0, "deformed": 2.5,
    "depressing": 3.0, "despair": 3.0, "desperate": 2.5, "destruction": 3.0, "detest": 2.5,
    "devastating": 3.0, "disaster": 3.0, "disastrous": 3.0, "discomfort": 2.0, "disdain": 2.5,
    "disgust": 3.0, "dislike": 2.5, "dismal": 2.5, "distress": 2.5, "disturbing": 3.0,
    "doomed": 2.5, "dread": 2.5, "dull": 2.0, "dysfunction": 2.5, "embarrass": 2.5,
    "enemy": 3.0, "enraged": 3.0, "envious": 2.0, "erode": 2.5, "fail": 2.5,
    "fake": 2.5, "fatal": 3.0, "flaw": 2.0, "fool": 2.5, "fraud": 3.0,
    "frustration": 2.5, "furious": 3.0, "grief": 3.0, "gross": 2.5, "guilt": 2.5,
    "hardship": 2.5, "heartbreaking": 3.0, "helpless": 2.5, "hostile": 2.5, "humiliate": 3.0,
    "hypocrite": 3.0, "idiot": 2.5, "ignorant": 2.5, "immoral": 2.5, "impolite": 2.0,
    "incompetent": 2.5, "inconsistent": 2.0, "inept": 2.5, "infuriating": 3.0, "insult": 3.0,
    "intolerable": 3.0, "irritating": 2.5, "jealous": 2.5, "lament": 2.5, "lazy": 2.0,
    "liar": 3.0, "loathe": 3.0, "loser": 2.5, "lousy": 2.0, "malice": 3.0,
    "mediocre": 2.0, "mess": 2.0, "miserable": 3.0, "misfortune": 2.5, "mistake": 2.0,
    "moody": 2.0, "mourn": 2.5, "murder": 3.0, "nasty": 3.0, "neglect": 2.5,
    "nonsense": 2.5, "obnoxious": 2.5, "offensive": 2.5, "pain": 2.5, "pathetic": 3.0,
    "pessimistic": 2.5, "petty": 2.0, "pitiful": 2.5, "poison": 2.5, "prejudice": 2.5,
    "problem": 2.0, "regret": 2.5, "repulsive": 3.0, "resent": 2.5, "rotten": 2.5,
    "rude": 2.0, "ruin": 3.0, "sabotage": 2.5, "sad": 2.5, "selfish": 2.5,
    "shame": 2.5, "sick": 2.0, "sinister": 3.0, "skeptical": 2.0, "stupid": 2.5,
    "substandard": 2.0, "suffering": 3.0, "terrible": 3.0, "threat": 2.5,
    "tragic": 3.0, "trash": 2.5, "ugliness": 2.5, "unbearable": 2.5, "undesirable": 2.0,
    "unfortunate": 2.5, "unhappy": 2.0, "unpleasant": 2.0, "unreliable": 2.5, "upset": 2.5,
    "useless": 2.5, "victim": 2.0, "violent": 3.0, "vulgar": 2.5,
    "wicked": 3.0, "worried": 2.5,  "wrecked": 2.0, "wrong": 2.0,
    "cringey": 2.5, "troll": 2.0, "clown": 2.0, "dumb": 2.0, "salty": 2.0,
     "L": 2.0, "rage": 2.5, "noob": 2.0,
     "nuke": 2.5, "bot": 2.0, "hater": 2.5, "yikes": 2.0,
    "nerfed": 2.0, "sus": 2.0, "flame": 2.5, "burn": 2.0,
    "weak": 2.0, "washed": 2.0, "thirsty": 2.0, "toxic": 3.0, "triggered": 2.5,
    "ghosted": 2.0, "busted": 2.0, "cancel": 3.0, "flop": 2.0, "booted": 2.0,
    "camping": 1.5, "rekt": 2.5, "griefing": 2.0, "lag": 1.5, "smh": 2.0,
    "trashcan": 2.5, "cringe": 2.5, "ragequit": 2.5, "GG": 2.0, "cursed": 2.5,
    "scuffed": 2.0, "degen": 2.5, "karen": 2.5, "ratio": 2.0, "pwned": 2.0
};

// Pre-populated positive words with associated weights
let positiveWords = {
    "amazing": 3.0, "awesome": 3.0, "beautiful": 2.5, "bliss": 2.5, "brilliant": 3.0,
    "cheerful": 2.5, "delightful": 2.5, "ecstatic": 3.0, "elegant": 2.5, "excellent": 3.0,
    "fantastic": 3.0, "glad": 2.0, "graceful": 2.5, "happy": 3.0, "honest": 2.5,
    "incredible": 3.0, "joy": 2.5, "kind": 2.0, "love": 3.0, "lucky": 2.5,
    "marvelous": 3.0, "optimistic": 2.5, "peaceful": 2.0, "perfect": 3.0, "pleasant": 2.5,
    "wonderful": 3.0, "zealous": 2.0, "zest": 2.5, "vibrant": 2.5, "victorious": 3.0,
    "nice": 2.5, "thanks": 3.0, "good": 3.0, "great": 3.0, "lovely": 3.0,
    "admire": 3.0, "adorable": 2.5, "adventurous": 2.5, "affectionate": 3.0, "ambitious": 2.5,
    "appreciative": 2.5, "astounding": 3.0, "authentic": 2.5, "benevolent": 2.5, "blissful": 3.0,
    "calm": 2.0, "captivating": 3.0, "charming": 2.5, "compassionate": 2.5, "confident": 2.5,
    "courageous": 2.5, "creative": 2.5, "dazzling": 3.0, "dedicated": 2.5, "eager": 2.0,
    "enthusiastic": 2.5, "faithful": 2.5, "flourishing": 2.5, "friendly": 2.5, "generous": 2.5,
    "genius": 3.0, "grateful": 2.5, "harmonious": 2.5, "honorable": 2.5, "inspiring": 3.0,
    "intelligent": 3.0, "jubilant": 3.0, "lively": 2.5, "magical": 3.0, "motivated": 2.5,
    "outstanding": 3.0, "phenomenal": 3.0, "playful": 2.5, "positive": 2.5, "prosperous": 2.5,
    "radiant": 3.0, "refreshing": 2.5, "remarkable": 3.0, "resourceful": 2.5, "respected": 2.5,
    "rewarding": 2.5, "satisfying": 2.5, "spectacular": 3.0, "successful": 3.0, "supportive": 2.5,
    "thrilled": 3.0, "trustworthy": 2.5, "uplifting": 2.5, "visionary": 2.5, "warmhearted": 2.5,
    "worthy": 2.5, "youthful": 2.5,
    "fire": 3.0, "lit": 3.0, "savage": 2.5, "hype": 3.0,
    "goat": 3.0, "clutch": 3.0, "pog": 3.0, "wholesome": 3.0, "W": 3.0,
    "clean": 2.5, "based": 2.5, "dope": 3.0, "vibe": 2.5, "legend": 3.0,
    "finesse": 2.5, "valid": 2.5, "smooth": 2.5, "noice": 2.5, "blessed": 3.0
};

// Pre-populated neutral words with associated weights
let neutralWords = {
    "account": 1.0, "balance": 1.0, "book": 1.0, "chair": 1.0, "data": 1.0,
    "document": 1.0, "event": 1.0, "fact": 1.0, "general": 1.0, "group": 1.0,
    "information": 1.0, "item": 1.0, "list": 1.0, "number": 1.0, "object": 1.0,
    "place": 1.0, "reference": 1.0, "schedule": 1.0, "table": 1.0, "unit": 1.0,
    "window": 1.0, "year": 1.0, "zone": 1.0, "medium": 1.0, "overview": 1.0,
    "analysis": 1.0, "application": 1.0, "article": 1.0, "asset": 1.0, "baseline": 1.0,
    "category": 1.0, "center": 1.0, "collection": 1.0, "component": 1.0, "concept": 1.0,
    "connection": 1.0, "context": 1.0, "definition": 1.0, "device": 1.0, "element": 1.0,
    "feature": 1.0, "framework": 1.0, "goal": 1.0, "instance": 1.0, "layer": 1.0,
    "layout": 1.0, "machine": 1.0, "mechanism": 1.0, "method": 1.0, "module": 1.0,
    "operation": 1.0, "parameter": 1.0, "process": 1.0, "program": 1.0,
    "project": 1.0, "protocol": 1.0, "report": 1.0, "response": 1.0, "role": 1.0,
    "section": 1.0, "session": 1.0, "specification": 1.0, "structure": 1.0, "system": 1.0,
    "task": 1.0, "tool": 1.0, "transaction": 1.0, "user": 1.0, "utility": 1.0,
    "value": 1.0, "variable": 1.0, "version": 1.0, "workflow": 1.0,
    "update": 1.0, "refresh": 1.0, "install": 1.0, "load": 1.0, "server": 1.0,
    "status": 1.0, "ping": 1.0, "AFK": 1.0, "drop": 1.0, "backup": 1.0,
    "frame": 1.0, "gameplay": 1.0, "screen": 1.0, "video": 1.0, "clip": 1.0
};

let emojiSentiment = {
    // Positive emojis
    "😊": 3.0, "😄": 3.0, "😍": 3.0, "🤩": 3.0, "👍": 2.5, "❤": 3.0, "😇": 3.0,
    "🎉": 3.0, "🎊": 3.0, "💖": 3.0, "🌟": 3.0, "👏": 2.5, "✨": 3.0, "🎈": 3.0,
    "🙌": 3.0, "🤗": 3.0, "💪": 2.5, "👑": 3.0, "💫": 3.0, "🥳": 3.0, "😎": 3.0,
    "😻": 3.0, "🔥": 3.0, "💯": 3.0, "🤙": 2.5, "🤑": 2.5, "🤝": 2.5, "🙏": 3.0,
    "😋": 2.5, "⭐": 3.0, "🌈": 3.0, "🍀": 2.5, "🏆": 3.0, "🥇": 3.0,
    "🎁": 3.0, "💎": 3.0, "🧡": 3.0, "😌": 2.5, "🤟": 2.5,

    // Negative emojis
    "😢": -3.0, "😡": -3.0, "👎": -2.5, "😭": -3.0, "😓": -2.0, "😕": -3.0,
    "💔": -3.0, "😣": -3.0, "😞": -2.5, "🤬": -3.0, "😨": -2.0, "😫": -3.0,
    "😱": -2.5, "😖": -3.0, "😔": -2.5, "😤": -2.5, "💢": -2.5, "🤢": -3.0, "🤮": -3.0,
    "😒": -2.5, "👿": -3.0, "🖕": -3.0, "🤯": -2.0, "😧": -2.5, "😬": -2.0, "😷": -2.0,
    "😟": -2.5, "💀": -2.5, "🤕": -2.5, "🤧": -2.0, "😠": -2.5, "💣": -2.5, "⚠️": -2.0,

    // Neutral emojis
    "😐": 0.0, "🤔": 0.0, "🧐": 0.0, "😑": 0.0, "🤨": 0.0, "😶": 0.0,
    "📝": 0.0, "📄": 0.0, "💼": 0.0, "📊": 0.0, "📈": 0.0, "📉": 0.0, "👀": 0.0,
    "🤖": 0.0, "🛑": 0.0, "🚶": 0.0, "🤷‍♂️": 0.0, "🤷‍♀️": 0.0, "✋": 0.0,
    "💡": 0.0, "⚙️": 0.0, "🛠": 0.0, "📌": 0.0, "🖋": 0.0, "⌛": 0.0, "⏳": 0.0,
    "💭": 0.0, "🔍": 0.0, "📂": 0.0, "🛒": 0.0, "🔐": 0.0, "🔧": 0.0
};

let zeroCount = 0;
let fourCount = 0;
let trainingIterations = 4;

let apiBaseUrl = 'https://youtube.googleapis.com/youtube/v3';
let key = "AIzaSyBav8jQwmVNxRFk4Q2FcviOHnUwbJjM8cU";

function parseCSV(csvContent) {
    return Papa.parse(csvContent, {
        header: false,
        dynamicTyping: true,
        skipEmptyLines: true
    }).data;
}


async function fetchCommentsFromDatabase() {
    const apiUrl = 'https://haydeneubanks.co.uk/includes/DbConnection/apiGetComments.php';

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch database comments. Status: ${response.status}`);
            }
            return response.json();  // Parse JSON response
        })
        .then(data => {
            // Ensure the database data has the correct format (array of [sentiment, comment])
            return data.map(comment => [parseInt(comment.sentiment, 10), comment.comment_text]);
        })
        .catch(error => {
            console.error('Error fetching database comments:', error);
            return [];  // Return empty array in case of error
        });
}

async function getTrainingDataFromCsvAndDatabase(pathToCsv) {
    zeroCount = 0;
    fourCount = 0;

    // Fetch CSV data
    const csvDataPromise = fetch(pathToCsv)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(csvContent => {
            console.log("CSV Content Loaded Successfully");
            let allData = parseCSV(csvContent); // Parse CSV data
            return allData.map(row => [parseInt(row[0], 10), row[1]]); // Ensure column 0 (label) is integer
        });

    // Fetch database comments
    const dbDataPromise = fetchCommentsFromDatabase();

    // Wait for both CSV and database data to be ready
    return Promise.all([csvDataPromise, dbDataPromise])
        .then(([csvData, dbData]) => {
            let allTrainingData = [...csvData, ...dbData];  // Merge CSV and DB data
            console.log('Combined CSV and Database Data:', allTrainingData);

            // Split the data into training and test sets (85% for training, 15% for testing)
            let trainDataSize = Math.floor(0.85 * allTrainingData.length);
            let trainingData = [];
            let testData = [];

            for (let i = 0; i < allTrainingData.length; i++) {
                // Evenly pick from both ends
                if (i % 7 === 0) {
                    testData.push(allTrainingData[i]);
                } else {
                    trainingData.push(allTrainingData[i]);
                }
            }

            // Process each row in the training data and train the word lists
            trainingData.forEach((row, index) => {
                let label = parseInt(row[0], 10);

                // Ignore invalid labels
                if (label !== 0 && label !== 4) return;

                if (label === 0) zeroCount++;
                if (label === 4) fourCount++;

                // Convert label: 4 -> positive, 0 -> negative
                label = label === 4 ? 1 : 0;

                let text = row[1];
                // Vectorize text and update positive or negative word lists
                vectorizeText(text, label);
            });

            console.log('Zero Count:', zeroCount);
            console.log('Four Count:', fourCount);
            console.log('Positive Words:', positiveWords);
            console.log('Negative Words:', negativeWords);

            // After training, test the model on the remaining 15%
            for (let i = 0; i < trainingIterations; i++) {
                testModel(testData);
            }
        })
        .catch(error => console.error('Error fetching training data:', error));
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

            // Evenly split the data: 85% for training, 15% for testing
            let trainDataSize = Math.floor(0.85 * tableSize);
            let trainingData = [];
            let testData = [];

            for (let i = 0; i < tableSize; i++) {
                // Evenly pick from both ends
                if (i % 7 === 0) {
                    testData.push(filteredData[i]);
                } else {
                    trainingData.push(filteredData[i]);
                }
            }

            console.log('Training Data Size:', trainingData.length);
            console.log('Test Data Size:', testData.length);

            // Process each row in the training data and train the word lists
            trainingData.forEach((row, index) => {
                let label = parseInt(row[0], 10);

                // Ignore invalid labels
                if (label !== 0 && label !== 4) return;

                if (label === 0) zeroCount++;
                if (label === 4) fourCount++;

                // Convert label: 4 -> positive, 0 -> negative
                label = label === 4 ? 1 : 0;

                let text = row[1];
                // Vectorize text and update positive or negative word lists
                vectorizeText(text, label);
            });

            console.log('Zero Count:', zeroCount);
            console.log('Four Count:', fourCount);

            console.log('Positive Words:', positiveWords);
            console.log('Negative Words:', negativeWords);

            // After training, test the model on the remaining 15%
            for(let i = 0; i < trainingIterations; i++) {
                testModel(testData);
            }

        })
        .catch(error => console.error('Error fetching CSV file:', error));
}

function testModel(testData) {
    console.log('Testing the model on the remaining 15% of the data...');

    let correctPredictions = 0;
    let totalPredictions = 0;

    testData.forEach(row => {
        let trueLabel = parseInt(row[0], 10);

        // Convert label: 4 -> positive, 0 -> negative
        trueLabel = trueLabel === 4 ? 1 : 0;

        let text = row[1];
        let predictedSentimentScore = calculateSentimentScore(text);

        // Classify the comment based on the sentiment score
        let predictedLabel = predictedSentimentScore > 0 ? 1 : 0;

        // Check if the predicted label matches the true label
        if (predictedLabel === trueLabel) {
            correctPredictions++;
        } else {
            // Tune the model by adjusting word weights based on incorrect predictions
            tuneModel(text, trueLabel);
        }

        totalPredictions++;
    });

    const accuracy = (correctPredictions / totalPredictions) * 100;
    console.log(`Model accuracy on the test data: ${accuracy.toFixed(2)}%`);
}

function tuneModel(text, trueLabel) {
    // Remove extra whitespace and punctuation, lowercasing everything for consistency
    const words = text
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .toLowerCase()           // Normalize to lowercase
        .split(/\s+/);           // Split on any whitespace

    words.forEach(word => {
        if (trueLabel === 1) {
            // If the true label is positive, increase the weight of positive words and decrease the weight of negative ones
            if (positiveWords[word]) {
                positiveWords[word] += 0.5; // Increase weight slightly for positive words
            }
            if (negativeWords[word]) {
                negativeWords[word] = Math.max(negativeWords[word] - 0.5, 0); // Decrease weight for negative words, not below 0
            }
        } else if (trueLabel === 0) {
            // If the true label is negative, increase the weight of negative words and decrease the weight of positive ones
            if (negativeWords[word]) {
                negativeWords[word] += 0.5; // Increase weight slightly for negative words
            }
            if (positiveWords[word]) {
                positiveWords[word] = Math.max(positiveWords[word] - 0.5, 0); // Decrease weight for positive words, not below 0
            }
        }
    });

    console.log('Model tuned for this incorrect prediction');
}

function vectorizeText(text, label) {
    // Remove extra whitespace and punctuation, lowercasing everything for consistency
    const words = text
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .toLowerCase()           // Normalize to lowercase
        .split(/\s+/);           // Split on any whitespace

    words.forEach(word => {
        if (label === 1) {
            // Make positive words have an equal or slightly larger weight
            positiveWords[word] = (positiveWords[word] || 1.0) + 1.5; // Adjusted to 1.0 for balance
        } else if (label === 0) {
            // Reduce the impact of negative words to make it less biased
            negativeWords[word] = (negativeWords[word] || 1.0) + 0.7; // Adjusted to 1.0 for balance
        } else {
            // Slight increase for neutral words
            neutralWords[word] = (neutralWords[word] || 1.0) + 0.5; // Small neutral boost
        }
    });
}

function analyzeSentiments(commentsArray) {
    let totalSentimentScore = 0;
    let totalSentimentProbability = 0;
    let sentimentCount = 0;
    let positiveCount = 0;
    let negativeCount = 0;
    let individualCommentData = [];

    commentsArray.forEach(commentThread => {
        const topLevelComment = commentThread.snippet.topLevelComment.snippet.textDisplay;
        const likeCount = commentThread.snippet.topLevelComment.snippet.likeCount || 0; // Default to 0 if no likes

        // Perform sentiment analysis with emoji support
        const sentimentScore = calculateSentimentScore(topLevelComment);

        // Weight the sentiment score by 1 + logarithmic likes, but with a damping factor
        // const weightedSentimentScore = sentimentScore * (1 + 0.3 * Math.log1p(likeCount));
        const weightedSentimentScore = sentimentScore * (1 + 0.15 * likeCount);

        // Apply sigmoid to sentiment score for smoother probability mapping
        const sentimentProbability = sigmoid(weightedSentimentScore);

        // Determine sentiment category based on score
        let commentSentiment = 'Neutral';
        if (weightedSentimentScore > 0.5) {
            commentSentiment = 'Positive';
            positiveCount += (1 + likeCount);
        } else if (weightedSentimentScore < -0.5) {
            commentSentiment = 'Negative';
            negativeCount += (1 + likeCount);
        }

        individualCommentData.push({
            comment: topLevelComment,
            likes: likeCount,
            sentiment: commentSentiment,
            probability: sentimentProbability
        });

        totalSentimentProbability += sentimentProbability * (1 + 0.15 * likeCount);
        sentimentCount += (1 + 0.15 * likeCount);
    });

    const averageSentimentProbability = (totalSentimentProbability / sentimentCount);
    const overallSentimentProbability = sigmoid(averageSentimentProbability);

    let overallSentiment = 'Neutral';
    if (averageSentimentProbability > 0.8) {
        overallSentiment = 'Overwhelmingly Positive';
    } else if (averageSentimentProbability > 0.5) {
        overallSentiment = 'Positive';
    } else if (averageSentimentProbability < -0.5 && averageSentimentProbability > -0.2) {
        overallSentiment = 'Negative';
    } else if (averageSentimentProbability < -0.2) {
        overallSentiment = 'Overwhelmingly Negative';
    }

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
    const negationWords = ["not", "never", "no", "none"];
    const emojiRegex = /[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}]/gu;
    let negate = false; // Track if negation should be applied

    // Remove numbers from the comment text
    commentText = commentText.replace(/\d+/g, '');
    const words = commentText.split(/\W+/).filter(word => isNaN(word));
    const emojis = commentText.match(emojiRegex) || [];
    const totalWords = words.length + emojis.length;

    if (totalWords === 0) {
        return 0;
    }

    words.forEach((word, index) => {
        word = word.toLowerCase();

        if (negationWords.includes(word)) {
            negate = true; // Negate the following words
            return; // Skip negation words from sentiment
        }

        if (positiveWords[word]) {
            score += negate ? Math.min(-positiveWords[word], 2) : Math.min(positiveWords[word], 2);
        } else if (negativeWords[word]) {
            score += negate ? Math.min(negativeWords[word], 1.5) : Math.min(-negativeWords[word], 1.5);
        } else if (neutralWords[word]) {
            score += 0;
        }

        negate = false; // Reset after each word
    });

    // Boost emoji impact if emojis dominate the comment
    const emojiBoostFactor = emojis.length > words.length ? 1.5 : 1.0;
    emojis.forEach(emoji => {
        if (emojiSentiment[emoji]) {
            score += emojiSentiment[emoji] * emojiBoostFactor;
        }
    });

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
    chrome.runtime.sendMessage({action: 'getVideoId'}, (response) => {
        const videoId = response.videoId;
        if (videoId) {
            // Trigger the sentiment analysis using the retrieved video ID
            getTrainingDataFromCsvAndDatabase(chrome.runtime.getURL('trainingData/trainingData.csv')).then(() => {
                fetchYoutubeCommentsVideoId(videoId);
            }).catch(error => {
                console.error('Error fetching CSV file:', error);
            });
        } else {
            console.error('No video ID found in the response.');
        }
    });
});