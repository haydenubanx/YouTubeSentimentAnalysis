function getGradient(weights, inputs, labels, predictions) {
    let gradient = [];

    // Calculate the gradient for each weight
    for (let i = 0; i < weights.length; i++) {
        let gradientSum = 0;

        // Gradient for a single weight across all training samples
        for (let j = 0; j < inputs.length; j++) {
            gradientSum += (predictions[j] - labels[j]) * inputs[j][i];
        }

        // Normalize the gradient by the number of samples
        gradient.push(gradientSum / inputs.length);
    }

    return gradient;
}

function calculateLoss(predictions, labels) {
    let loss = 0;

    // Binary cross-entropy loss for each prediction
    for (let i = 0; i < predictions.length; i++) {
        let predicted = predictions[i];
        let actual = labels[i];
        loss += -actual * Math.log(predicted) - (1 - actual) * Math.log(1 - predicted);
    }

    // Return the average loss over all examples
    return loss / predictions.length;
}

function trainModel(inputs, labels, learningRate = 0.01, epochs = 1000) {
    let weights = Array(inputs[0].length).fill(0);  // Initialize weights to zero
    let predictions = [];

    // Iterate through epochs to train the model
    for (let epoch = 0; epoch < epochs; epoch++) {
        // Forward pass: Calculate predictions (sigmoid function for logistic regression)
        predictions = inputs.map(input => sigmoid(dotProduct(input, weights)));

        // Calculate the loss
        let loss = calculateLoss(predictions, labels);

        // Get the gradients for all weights
        let gradient = getGradient(weights, inputs, labels, predictions);

        // Update the weights based on the gradient
        for (let i = 0; i < weights.length; i++) {
            weights[i] -= learningRate * gradient[i];
        }

        // Log the loss every 100 epochs
        if (epoch % 100 === 0) {
            console.log(`Epoch: ${epoch}, Loss: ${loss}`);
        }
    }

    // Return the final weights after training
    return weights;
}

// Helper function to calculate the dot product of inputs and weights
function dotProduct(a, b) {
    return a.reduce((sum, value, i) => sum + value * b[i], 0);
}

// Sigmoid function for logistic regression
function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
}