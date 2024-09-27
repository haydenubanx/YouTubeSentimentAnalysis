function parseCSV(csvContent) {
    return Papa.parse(csvContent, {
        header: false,
        dynamicTyping: true,
        skipEmptyLines: true
    }).data;
}

async function getTrainingDataFromCsv(pathToCsv) {
    await fetch(pathToCsv)
        .then(response => response.text())
        .then(csvContent => {
            let allData = parseCSV(csvContent);
            // Filter to only keep columns 0 and 5
            let filteredData = allData.map(row => [row[0], row[5]]);
            console.log('Filtered Data:', filteredData);

            let tableSize = filteredData.length;
            console.log('Number Of Data Entries:', tableSize);

            // Analyze sentiment for each text and count occurrences
            for (let i = 0; i < tableSize; i++) {
                switch (filteredData[i][0]) {
                    case 0:
                        zeroCount++;
                        break;
                    case 4:
                        fourCount++;
                        break;
                }



                // Analyze sentiment using compromise
                let text = filteredData[i][1];
                filteredData[i][1] = text.split(/\W+/);
                filteredData[i][2] = filteredData[i][1].length;
                // filteredData[i][3] = getSentimentAnalysis(text);
            }

            console.log('Zero Count:', zeroCount);
            console.log('Four Count:', fourCount);

            return filteredData;
        })
        .catch(error => console.error('Error fetching CSV file:', error));
}

// Use compromise for sentiment analysis
function getSentimentAnalysis(text) {
}


let zeroCount = 0;
let fourCount = 0;

let trainingTable = getTrainingDataFromCsv('trainingData/training.1600000.processed.noemoticon.csv');

