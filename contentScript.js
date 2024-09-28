// Function to extract video ID from YouTube URL
function getVideoIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("v");  // Extract the 'v' query parameter as the video ID
}

// Send video ID to the background script
const videoId = getVideoIdFromUrl();
if (videoId) {
    chrome.runtime.sendMessage({ action: 'sendVideoId', videoId: videoId });
} else {
    console.error('Unable to extract video ID from the URL.');
}