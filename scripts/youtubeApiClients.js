// import { positiveWords, negativeWords } from './sentimentAnalysis.js';
//
// let apiBaseUrl = 'https://developers.google.com/apis-explorer/#p/youtube/v3/youtube';
// let key = "AIzaSyBav8jQwmVNxRFk4Q2FcviOHnUwbJjM8cU";
//
//
// async function fetchYoutubeCommentsVideoId(inputVideoId) {
//     const options = {
//         method: 'GET',
//         headers: {
//             'User-Agent': '',
//             'Accept': 'application/json'
//         }
//     };
//
//     let totalCommentArray = [];
//
//     const response = await fetch(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${inputVideoId}&key=${key}&maxResults=100`, options)
//         .catch(error => console.log(error));
//
//     const record = await response.json().then(async responseJson => {
//         let commentsArray = responseJson.items;
//         let nextPage = responseJson.nextPageToken;
//
//         // Collect all comments
//         for (let i = 0; i < commentsArray.length; i++) {
//             totalCommentArray.push(commentsArray[i]);
//         }
//
//         while (nextPage) {
//             const innerResponse = await fetch(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${inputVideoId}&pageToken=${nextPage}&key=${key}&maxResults=100`, options)
//                 .catch(error => console.log(error));
//
//             const nextResponseJson = await innerResponse.json();
//             commentsArray = nextResponseJson.items;
//             nextPage = nextResponseJson.nextPageToken;
//
//             for (let i = 0; i < commentsArray.length; i++) {
//                 totalCommentArray.push(commentsArray[i]);
//             }
//         }
//
//         console.log('Comment Count: ', totalCommentArray.length);
//         const sentimentData = analyzeSentiments(totalCommentArray);
//         displayComments(totalCommentArray, sentimentData.overallSentiment, sentimentData.sentimentProbability);
//     });
// }
//
// // function analyzeSentiments(commentsArray) {
// //     let totalSentimentScore = 0;
// //     let sentimentCount = 0;
// //
// //     commentsArray.forEach(commentThread => {
// //         const topLevelComment = commentThread.snippet.topLevelComment.snippet.textDisplay;
// //
// //         // Manually perform sentiment analysis based on the word lists
// //         const sentimentScore = calculateSentimentScore(topLevelComment);
// //
// //         // Accumulate sentiment scores
// //         totalSentimentScore += sentimentScore;
// //         sentimentCount++;
// //     });
// //
// //     // Calculate average sentiment score
// //     const averageSentimentScore = totalSentimentScore / sentimentCount;
// //
// //     // Determine overall sentiment based on average score
// //     let overallSentiment = 'Neutral';
// //     if (averageSentimentScore > 0) {
// //         overallSentiment = 'Positive';
// //     } else if (averageSentimentScore < 0) {
// //         overallSentiment = 'Negative';
// //     }
// //
// //     // Calculate sentiment probability
// //     const sentimentProbability = Math.abs(averageSentimentScore);
// //
// //     return {
// //         overallSentiment,
// //         sentimentProbability
// //     };
// // }
// //
// // function calculateSentimentScore(commentText) {
// //     let score = 0;
// //     const words = commentText.split(/\W+/);
// //
// //     words.forEach(word => {
// //         word = word.toLowerCase();
// //         if (positiveWords[word]) {
// //             score += positiveWords[word]; // Add positive word count
// //         } else if (negativeWords[word]) {
// //             score -= negativeWords[word]; // Subtract negative word count
// //         }
// //     });
// //
// //     return score;
// // }
// //
// // function displayComments(commentsArray, overallSentiment, sentimentProbability) {
// //     const commentsList = document.querySelector('#commentsContainer');
// //     commentsList.innerHTML = '';
// //
// //     // Display overall sentiment and probability
// //     const overallSentimentText = document.createElement('p');
// //     overallSentimentText.textContent = `Overall Sentiment: ${overallSentiment}`;
// //     const sentimentProbabilityText = document.createElement('p');
// //     sentimentProbabilityText.textContent = `Sentiment Probability: ${sentimentProbability.toFixed(2)}`;
// //     commentsList.appendChild(overallSentimentText);
// //     commentsList.appendChild(sentimentProbabilityText);
// //
// //     if (commentsArray && Array.isArray(commentsArray)) {
// //         commentsArray.forEach(commentThread => {
// //             const topLevelComment = commentThread.snippet.topLevelComment.snippet;
// //
// //             const li = document.createElement('li');
// //             li.innerHTML = `
// //                         <div class="comment">
// //                             <img src="${topLevelComment.authorProfileImageUrl}" alt="${topLevelComment.authorDisplayName}'s profile picture" class="author-image">
// //                             <div class="comment-body">
// //                                 <a href="${topLevelComment.authorChannelUrl}" class="author-name">${topLevelComment.authorDisplayName}</a>
// //                                 <p class="comment-text">${topLevelComment.textDisplay}</p>
// //                                 <p class="comment-likes">👍 ${topLevelComment.likeCount}</p>
// //                                 <p class="comment-date">${new Date(topLevelComment.publishedAt).toLocaleDateString()}</p>
// //                             </div>
// //                         </div>
// //                     `;
// //             commentsList.appendChild(li);
// //         });
// //     } else {
// //         console.error('Invalid commentsArray or no comments available.');
// //     }
// // }
//
// fetchYoutubeCommentsVideoId("B8Ihv3xsWYs");