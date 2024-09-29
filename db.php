<?php
// Database connection details
$hostname = "o0i.h.filess.io";
$database = "SentimentAnalysis_facingwent";
$port = 3307;
$username = "SentimentAnalysis_facingwent";
$password = "5fd4719c1fc36d0e9439458916ab87bbefab578e";

// Create connection
$conn = new mysqli($hostname, $username, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die(json_encode(array('success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error)));
}

// Check if the request is POST and has the correct content type
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_SERVER['CONTENT_TYPE']) && $_SERVER['CONTENT_TYPE'] === 'application/json') {
    // Get the raw POST data
    $postData = file_get_contents('php://input');
    $data = json_decode($postData, true);

    // Check if sentiment and comment are provided
    if (isset($data['sentiment']) && isset($data['comment'])) {
        $sentiment = (int)$data['sentiment'];
        $comment = $conn->real_escape_string($data['comment']); // Sanitize the input to prevent SQL injection

        // Prepare the SQL insert statement
        $sql = "INSERT INTO youtube_comments (sentiment, comment_text) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('is', $sentiment, $comment);

        // Execute the query
        if ($stmt->execute()) {
            echo json_encode(array('success' => true, 'message' => 'Comment saved successfully'));
        } else {
            echo json_encode(array('success' => false, 'error' => 'Failed to insert comment: ' . $stmt->error));
        }

        // Close the statement
        $stmt->close();
    } else {
        echo json_encode(array('success' => false, 'error' => 'Invalid input data'));
    }
} else {
    echo json_encode(array('success' => false, 'error' => 'Invalid request method or content type'));
}

// Close the database connection
$conn->close();
?>