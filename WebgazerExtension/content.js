// content.js - This runs on webpages when the extension is active

// Status tracking
let isTrainingMode = false;
let isGameActive = false;
let gazeX = 0;
let gazeY = 0;
let gazeHistory = [];
const historyLength = 10; // For smoothing

// Create a visual indicator for calibration/training
const indicator = document.createElement("div");
indicator.style.position = "fixed";
indicator.style.width = "20px";
indicator.style.height = "20px";
indicator.style.borderRadius = "50%";
indicator.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
indicator.style.zIndex = "10000";
indicator.style.pointerEvents = "none"; // So it doesn't interfere with clicking
indicator.style.display = "none";
document.body.appendChild(indicator);

// Setup WebGazer
function initializeWebGazer() {
  // Load WebGazer if it's not already loaded
  if (typeof webgazer === "undefined") {
    console.error(
      "WebGazer not loaded. Make sure webgazer.js is properly included."
    );
    return;
  }

  // Initialize and configure WebGazer
  webgazer
    .setRegression("ridge")
    .setTracker("clmtrackr")
    .setGazeListener(handleGaze)
    .begin();

  console.log("WebGazer initialized");

  // Hide the WebGazer video feed and prediction points by default
  const videoElement = document.getElementById("webgazerVideoContainer");
  if (videoElement) {
    videoElement.style.display = "none";
  }
}

// Handle incoming gaze data
function handleGaze(data, elapsedTime) {
  if (data == null) {
    return;
  }

  // Add to history for smoothing
  gazeHistory.push({ x: data.x, y: data.y });

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
  if (isTrainingMode) {
    indicator.style.display = "block";
    indicator.style.left = gazeX - 10 + "px";
    indicator.style.top = gazeY - 10 + "px";
  } else {
    indicator.style.display = "none";
    // document.getElementById("webgazerFaceOverlay").style.display = "none"
  }

  // If game is active, find elements near gaze and move them
  if (isGameActive) {
    moveElementsAwayFromGaze();
  }
}

// Function to make elements run away from gaze
function moveElementsAwayFromGaze() {
  // Find elements near the gaze point
  const elements = document.elementsFromPoint(gazeX, gazeY);

  elements.forEach((element) => {
    // Skip body, html, and our indicator
    if (
      element === document.body ||
      element === document.documentElement ||
      element === indicator
    ) {
      return;
    }

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
    const normalizedDirX = directionX / length;
    const normalizedDirY = directionY / length;

    // Calculate movement distance (faster when closer to gaze)
    const distance = Math.min(100, 500 / length);

    // Calculate new position
    const moveX = normalizedDirX * distance;
    const moveY = normalizedDirY * distance;

    // Apply movement with transition for smoothness
    element.style.transition = "transform 0.3s ease-out";
    element.style.transform = `translate(${moveX}px, ${moveY}px)`;

    // Reset position after a delay (makes it more game-like)
    setTimeout(() => {
      element.style.transition = "transform 1s ease-in";
      element.style.transform = "translate(0, 0)";
    }, 1000);
  });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "startTraining") {
    isTrainingMode = true;
    isGameActive = false;
    initializeWebGazer();

    // Make webgazer video visible during training
    const videoElement = document.getElementById("webgazerVideoContainer");
    if (videoElement) {
      videoElement.style.display = "block";
      videoElement.style.position = "fixed";
      videoElement.style.top = "0";
      videoElement.style.left = "0";
      videoElement.style.zIndex = "9999";
    }

    // Enable click events for calibration
    webgazer.showPredictionPoints(true);
  } else if (request.action === "activateGame") {
    isTrainingMode = false;
    isGameActive = true;

    // Hide webgazer video when in game mode
    const videoElement = document.getElementById("webgazerVideoContainer");
    if (videoElement) {
      videoElement.style.display = "none";
    }

    webgazer.showPredictionPoints(false);
  } else if (request.action === "stopGame") {
    isTrainingMode = false;
    isGameActive = false;

    // Optional: Reset all moved elements
    const elements = document.querySelectorAll("*");
    elements.forEach((el) => {
      el.style.transform = "translate(0, 0)";
    });
  }
});

// CSS to add to the page for the indicator and to make sure WebGazer elements don't interfere
const style = document.createElement("style");
style.textContent = `
  .webgazerVideoContainer {
    z-index: 9999 !important;
  }
  
  /* Add a slight transition to all elements for smoother movement */
  * {
    transition: transform 0.3s ease-out;
  }
`;
document.head.appendChild(style);

console.log("Eye-Tracking Tag Game extension loaded");
