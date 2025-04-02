// main.js - This script runs in the page context

// Status tracking
let isTrainingMode = false;
let isGameActive = false;
let gazeX = 0;
let gazeY = 0;
let gazeHistory = [];
const historyLength = 10;  // For smoothing

// Get our UI elements
function getElements() {
  return {
    indicator: document.getElementById('eye-tracker-indicator'),
    status: document.getElementById('eye-tracker-status')
  };
}

// Initialize WebGazer
function initializeWebGazer() {
  console.log("Initializing WebGazer...");
  
  try {
    // Make sure WebGazer exists
    if (typeof webgazer === 'undefined') {
      console.error('WebGazer not properly loaded!');
      updateStatus('Error: WebGazer not loaded', 'error');
      return false;
    }
    
    // Initialize and configure WebGazer
    webgazer.setRegression('ridge')
      .setTracker('clmtrackr')
      .setGazeListener(handleGaze)
      .begin();
      
    console.log("WebGazer initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing WebGazer:", error);
    updateStatus('Error initializing eye tracker', 'error');
    return false;
  }
}

// Handle incoming gaze data
function handleGaze(data, elapsedTime) {
  if (data == null) {
    return;
  }
  
  // Add to history for smoothing
  gazeHistory.push({x: data.x, y: data.y});
  
  // Keep history at desired length
  if (gazeHistory.length > historyLength) {
    gazeHistory.shift();
  }
  
  // Calculate smoothed coordinates
  let sumX = 0;
  let sumY = 0;
  
  for (let point of gazeHistory) {
    sumX += point.x;
    sumY += point.y;
  }
  
  gazeX = sumX / gazeHistory.length;
  gazeY = sumY / gazeHistory.length;
  
  // Update the indicator position if in training mode
  const elements = getElements();
  if (isTrainingMode && elements.indicator) {
    elements.indicator.style.display = 'block';
    elements.indicator.style.left = gazeX + 'px';
    elements.indicator.style.top = gazeY + 'px';
  }
  
  // If game is active, find elements near gaze and move them
  if (isGameActive) {
    moveElementsAwayFromGaze();
  }
}

// Function to make elements run away from gaze
function moveElementsAwayFromGaze() {
  try {
    // Find elements near the gaze point
    const elements = document.elementsFromPoint(gazeX, gazeY);
    
    elements.forEach(element => {
      // Skip certain elements
      if (element === document.body || 
          element === document.documentElement || 
          element.id === 'eye-tracker-indicator' ||
          element.id === 'eye-tracker-status' ||
          element.id === 'webgazerVideoContainer') {
        return;
      }
      
      // Add a class to indicate this element is movable
      element.classList.add('eye-tracker-movable');
      
      // Get element position and dimensions
      const rect = element.getBoundingClientRect();
      
      // Calculate center of the element
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate direction to move (away from gaze)
      const directionX = centerX - gazeX;
      const directionY = centerY - gazeY;
      
      // Normalize direction
      const length = Math.sqrt(directionX * directionX + directionY * directionY);
      
      // Skip if too far away
      if (length > 150) return;
      
      const normalizedDirX = directionX / length;
      const normalizedDirY = directionY / length;
      
      // Calculate movement distance (faster when closer to gaze)
      const distance = Math.min(100, 500 / length);
      
      // Calculate new position
      const moveX = normalizedDirX * distance;
      const moveY = normalizedDirY * distance;
      
      // Apply movement with transition for smoothness
      element.style.transition = 'transform 0.3s ease-out';
      element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      
      // Reset position after a delay (makes it more game-like)
      setTimeout(() => {
        element.style.transition = 'transform 1s ease-in';
        element.style.transform = 'translate(0, 0)';
      }, 1000);
    });
  } catch (error) {
    console.error("Error moving elements:", error);
  }
}

// Update status display
function updateStatus(message, type = 'info') {
  const elements = getElements();
  if (!elements.status) return;
  
  elements.status.textContent = message;
  elements.status.style.display = 'block';
  
  // Style based on type
  switch (type) {
    case 'error':
      elements.status.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
      break;
    case 'success':
      elements.status.style.backgroundColor = 'rgba(0, 128, 0, 0.7)';
      break;
    case 'warning':
      elements.status.style.backgroundColor = 'rgba(255, 165, 0, 0.7)';
      break;
    default:
      elements.status.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  }
}

// Start training mode
function startTraining() {
  isTrainingMode = true;
  isGameActive = false;
  
  if (!initializeWebGazer()) {
    return;
  }
  
  // Configure WebGazer for training
  webgazer.showPredictionPoints(true);
  
  // Add a class to the body for CSS rules
  document.body.classList.add('eye-tracker-training');
  document.body.classList.remove('eye-tracker-active');
  
  // Show video feed
  const videoElement = document.getElementById('webgazerVideoContainer');
  if (videoElement) {
    videoElement.style.display = 'block';
  }
  
  // Show face overlay
  const faceOverlay = document.getElementById('webgazerFaceOverlay');
  if (faceOverlay) {
    faceOverlay.style.display = 'block';
  }
  
  // Show face feedback box
  const faceFeedbackBox = document.getElementById('webgazerFaceFeedbackBox');
  if (faceFeedbackBox) {
    faceFeedbackBox.style.display = 'block';
  }

  const videoFeed = document.getElementById("webgazerVideoFeed");
  if (videoFeed) {
    videoFeed.style.display = "block";
  }
  
  // Show any other WebGazer elements
  document.querySelectorAll('.webgazer-element').forEach(el => {
    el.style.display = 'block';
  });
  
  updateStatus('Training Mode: Look at elements and click to calibrate', 'info');
  console.log("Eye tracker training mode activated");
}

// Activate game mode
function activateGame() {
  isTrainingMode = false;
  isGameActive = true;
  
  // Configure WebGazer for gameplay
  webgazer.showPredictionPoints(false);
  
  // Hide indicator
  const elements = getElements();
  if (elements.indicator) {
    elements.indicator.style.display = 'none';
  }
  
  // Hide video feed and all related WebGazer UI elements
  const videoElement = document.getElementById('webgazerVideoContainer');
  if (videoElement) {
    videoElement.style.display = 'none';
  }
  
  // Hide face overlay
  const faceOverlay = document.getElementById('webgazerFaceOverlay');
  if (faceOverlay) {
    faceOverlay.style.display = 'none';
  }
  
  // Hide face feedback box
  const faceFeedbackBox = document.getElementById('webgazerFaceFeedbackBox');
  if (faceFeedbackBox) {
    faceFeedbackBox.style.display = 'none';
  }

  const videoFeed = document.getElementById("webgazerVideoFeed");
  if (videoFeed) {
    videoFeed.style.display = "none";
  }
  
  // Hide any other WebGazer elements
  document.querySelectorAll('.webgazer-element').forEach(el => {
    el.style.display = 'none';
  });
  
  // Add a class to the body for CSS rules
  document.body.classList.remove('eye-tracker-training');
  document.body.classList.add('eye-tracker-active');
  
  updateStatus('Game Active: Elements will dodge your gaze', 'success');
  console.log("Eye tracker game mode activated");
}

// Stop the game
function stopGame() {
  isTrainingMode = false;
  isGameActive = false;
  
  // Hide UI elements
  const elements = getElements();
  if (elements.indicator) elements.indicator.style.display = 'none';
  if (elements.status) elements.status.style.display = 'none';
  
  // Remove classes
  document.body.classList.remove('eye-tracker-training');
  document.body.classList.remove('eye-tracker-active');
  
  // Reset all moved elements
  document.querySelectorAll('.eye-tracker-movable').forEach(el => {
    el.style.transform = 'translate(0, 0)';
    el.classList.remove('eye-tracker-movable');
  });
  
  // Pause WebGazer (don't stop it completely to preserve calibration)
  if (typeof webgazer !== 'undefined') {
    webgazer.pause();
  }
  
  console.log("Eye tracker game stopped");
}

// Listen for messages from the extension
window.addEventListener('eyeTrackerExtensionMessage', function(event) {
  const request = event.detail;
  
  console.log("Received message:", request);
  
  if (request.action === "startTraining") {
    startTraining();
  }
  else if (request.action === "activateGame") {
    activateGame();
  }
  else if (request.action === "stopGame") {
    stopGame();
  }
});

console.log("Eye-Tracking Tag Game main script loaded");