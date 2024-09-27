let apiBaseUrl  = 'https://developers.google.com/apis-explorer/#p/youtube/v3/youtube';


async function fetchYoutubeCommentsVideoId(inputVideoId) {
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': '',
            'Accept': 'application/json'
        }
    };

    let totalCommentArray = [];

    const response = await fetch(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${inputVideoId}&key=AIzaSyBav8jQwmVNxRFk4Q2FcviOHnUwbJjM8cU&maxResults=100`,
        options).catch(error => console.log(error));




    const record = await response.json().then(async responseJson => {

            let commentsArray = responseJson.items;
            let nextPage = responseJson.nextPageToken;
            console.log('Next Page ID', nextPage);

            for (let i = 0; i < commentsArray.length; i++) {

                totalCommentArray.push(commentsArray[i]);
                console.log(commentsArray[i]);

            }
            console.log('Record: ', responseJson);

            while (nextPage) {

                const innerResponse = await fetch(`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${inputVideoId}&pageToken=${nextPage}&key=AIzaSyBav8jQwmVNxRFk4Q2FcviOHnUwbJjM8cU&maxResults=100`,
                    options).catch(error => console.log(error));

                const record = await innerResponse.json().then(async nextResponseJson => {
                    commentsArray = nextResponseJson.items;
                    nextPage = nextResponseJson.nextPageToken;
                    console.log('Next Page ID ', nextPage);

                    for (let i = 0; i < commentsArray.length; i++) {

                        totalCommentArray.push(commentsArray[i]);
                        console.log(commentsArray[i]);

                    }
                    console.log('Record: ', nextResponseJson);
                });

            }
            console.log('Comment Count: ', totalCommentArray.length);
            displayComments(totalCommentArray);
        }
    );
}



function getCommentsForVideo(inputVideoId) {

    let apiUrl = apiBaseUrl + '.commentThreads.list?part=snippet,replies&videoId=' + inputVideoId;

    fetch(apiUrl)
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse the response data as JSON
            } else {
                throw new Error('API request failed');
            }
        })
        .then(data => {
            // Process the response data here
            console.log(data); // Example: Logging the data to the console
        })
        .catch(error => {
            // Handle any errors here
            console.error(error); // Example: Logging the error to the console
        });
}

function getCommentsForChannel() {

}



function displayComments(commentsArray) {
    // Select the container for the comments
    const commentsList = document.querySelector('#commentsContainer');

    // Clear existing comments if necessary
    commentsList.innerHTML = '';


    // Ensure commentsArray.items exists and is an array
    if (commentsArray && Array.isArray(commentsArray)) {
        // Iterate over each comment thread

        commentsArray.forEach(commentThread => {

            const topLevelComment = commentThread.snippet.topLevelComment.snippet;

            // Create an li element for each comment
            const li = document.createElement('li');

            // Populate the li with relevant data from the comment
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

            // Append the li to the comments list
            commentsList.appendChild(li);
        });
    } else {
        console.error('Invalid commentsArray or no comments available.');
    }
}

let commentSection = fetchYoutubeCommentsVideoId("B8Ihv3xsWYs");
console.log(commentSection);