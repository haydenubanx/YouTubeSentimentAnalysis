# YouTube Sentiment Analysis Chrome Extension

## Overview

This project is a **Chrome Extension** that performs **Sentiment Analysis** on YouTube video comments. The extension analyzes the comments on any YouTube video and classifies them into positive, neutral, or negative categories based on sentiment. The results are then displayed directly on the YouTube page above the comments section, along with detailed statistics on the overall sentiment of the video’s comments.

## Key Features

- **Sentiment Analysis**: Classifies YouTube comments as positive, negative, or neutral based on the content of each comment.
- **Real-time Analysis**: Automatically starts analyzing comments when a new video is loaded or when the video ID changes.
- **Customizable Sentiment Filters**: Users can filter the comments displayed based on their sentiment (positive, neutral, or negative).
- **User Feedback Integration**: Users can manually adjust the sentiment classification of individual comments, which helps fine-tune the model.
- **Sentiment Display**: Displays detailed sentiment statistics, including overall sentiment score, positivity percentage, and breakdown of positive, neutral, and negative comments.

## How It Works

This extension leverages a custom sentiment analysis model that is trained using a combination of pre-defined words, bigrams, and trigrams with associated sentiment scores. The model is stored in IndexedDB and can be re-trained using external datasets, including CSV files and database comments.

### Steps:
1. **Model Initialization**: When the extension is loaded, it checks if the model is trained. If not, it begins the training process.
2. **Sentiment Analysis**: When a YouTube video is loaded, the extension fetches the comments via the YouTube API and performs sentiment analysis.
3. **Real-Time Display**: Sentiment analysis results are injected into the YouTube DOM, showing overall sentiment and detailed statistics on comment sentiment.
4. **Manual Sentiment Adjustment**: Users can manually override the sentiment classification of individual comments to improve the accuracy of the model over time.

## Installation

To get started with this project:

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/your-username/youtube-sentiment-analysis-extension.git
    cd youtube-sentiment-analysis-extension
    ```

2. Load the extension in Chrome:
    - Open Chrome and navigate to `chrome://extensions/`.
    - Enable **Developer mode** in the top right.
    - Click on **Load unpacked** and select the directory where the extension is cloned.

3. The extension should now appear in your extensions list, and you can use it while browsing YouTube videos.

## Usage

1. Navigate to a YouTube video.
2. Once the video is loaded, the sentiment analysis will automatically start analyzing the comments.
3. Once complete, the extension will display:
    - The overall sentiment of the video comments.
    - The positivity percentage of the comments.
    - A breakdown of positive, neutral, and negative comments.

4. You can filter comments based on sentiment by using the filter buttons (Positive, Neutral, Negative, All).

### Custom Sentiment Re-training
If you wish to retrain the sentiment analysis model:

1. Upload a new CSV dataset or use the existing training data stored in the database.
2. Click the **Retrain** button in the extension popup.
3. The model will be retrained, and future sentiment analysis will use the newly updated model.

## Project Structure
```
├── /includes/             # Backend API to fetch and store comments and sentiment data
├── /scripts/              # Core JavaScript logic for sentiment analysis and Chrome extension
│   ├── background.js      # Background script for Chrome extension logic
│   ├── sentimentAnalysis.js  # Main sentiment analysis logic
│   ├── dbConnection.js    # Handles connection and operations with IndexedDB
│   └── uiController.js    # Manages UI updates and DOM manipulation
├── manifest.json          # Chrome extension configuration
└── README.md              # Project documentation
```


## APIs and Libraries Used

- **YouTube Data API**: Used to fetch comments from YouTube videos.
- **IndexedDB**: Local database for storing the sentiment model for offline use.
- **PapaParse**: A CSV parsing library used to import training data.
- **Chrome Extensions API**: Enables the core functionality of the Chrome extension.
- **Custom APIs**: Enable database interactions for adding/retrieving user marked comments

## Future Enhancements

- **Advanced Model Support**: Improve sentiment detection by incorporating more words and emojis with sentiment values.
- **User Sentiment Feedback**: Gain more user feedback to improve sentiment model accuracy.
- **Multi-language Support**: Extend the model to analyze comments in multiple languages.
- - **Inject Sentiment Values**: Inject the sentiment values passively directly into the YouTube page without needing to click extension.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes and test them.
4. Submit a pull request with a description of the changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to open issues or ask questions if you encounter any problems or need further clarification!

---

## Contact

Author: **Hayden Christopher Eubanks**  
LinkedIn: [Hayden Eubanks](https://www.linkedin.com/in/hayden-eubanks)  
Website: [haydeneubanks.co.uk](https://haydeneubanks.co.uk)

---