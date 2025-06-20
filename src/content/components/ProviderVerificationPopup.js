// TODO: Implement HTML structure and basic styling for the popup.
// The popup should match the design in the provided image.
// It needs:
// - A container for the entire popup, positioned at the bottom left.
// - Sections for:
//   - Source (e.g., "Emirates")
//   - Credential Type (e.g., "Skywards")
//   - Data Required (e.g., "Membership Status / Tier")
//   - "How it works" section with two steps
//   - A "Verify" button (initially disabled)
// - Placeholders for dynamic data.

// Basic styling will be added here or in a linked CSS file. 

// Create and manage the verification popup UI with status indicators
// Shows various states: initial, loading, success, error, etc.

export function createProviderVerificationPopup(providerName, description, dataRequired) {
    // Inject CSS styles directly instead of importing them
    injectStyles();
    
    const popup = document.createElement('div');
    popup.id = 'reclaim-protocol-popup';
    popup.className = 'reclaim-popup';
    popup.style.animation = 'reclaim-appear 0.3s ease-out';

    // Track the state of claim generation
    const state = {
        totalClaims: 0,
        completedClaims: 0,
        proofSubmitted: false,
        inProgress: false,
        error: null
    };

    // Create initial HTML content
    renderInitialContent();

    // Function to inject CSS styles directly
    function injectStyles() {
        // Check if styles are already injected
        if (document.getElementById('reclaim-popup-styles')) {
            return;
        }
        
        const styleEl = document.createElement('style');
        styleEl.id = 'reclaim-popup-styles';
        styleEl.textContent = `
            .reclaim-popup {
              position: fixed;
              bottom: 20px;
              right: 20px;
              width: 350px;
              background-color: #2C2C2E;
              color: #FFFFFF;
              border-radius: 12px;
              padding: 20px;
              font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              z-index: 9999;
              box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.25);
              font-size: 14px;
              opacity: 1;
              transform: translateY(0);
              /* Reduce layout thrashing by using transform instead of changing dimensions */
              will-change: transform, opacity;
              /* Disable backdrop filter to reduce ResizeObserver triggers */
              /* backdrop-filter: blur(10px); */
              /* -webkit-backdrop-filter: blur(10px); */
            }
            
            .reclaim-popup-header {
              display: flex;
              align-items: center;
              margin-bottom: 15px;
            }
            
            .reclaim-popup-logo {
              width: 24px;
              height: 24px;
              margin-right: 10px;
            }
            
            .reclaim-popup-title {
              margin: 0;
              font-size: 16px;
              font-weight: 600;
            }
            
            .reclaim-popup-section {
              margin-bottom: 15px;
            }
            
            .reclaim-popup-label {
              margin: 0 0 5px 0;
              color: #A0A0A5;
              font-size: 12px;
            }
            
            .reclaim-popup-value {
              margin: 0;
              font-size: 16px;
              font-weight: 500;
            }
            
            .reclaim-steps-container {
              margin-top: 20px;
              padding-top: 15px;
              border-top: 1px solid #3A3A3C;
              /* Use transform instead of max-height for better performance */
              transform: translateY(0);
              opacity: 1;
              will-change: transform, opacity;
            }
            
            .reclaim-steps-container.hidden {
              transform: translateY(-10px);
              opacity: 0;
              pointer-events: none;
            }
            
            .reclaim-steps-title {
              font-size: 14px;
              font-weight: 600;
              margin-bottom: 12px;
            }
            
            .reclaim-step {
              display: flex;
              align-items: flex-start;
              margin-bottom: 12px;
            }
            
            .reclaim-step-number {
              background-color: #0A84FF;
              color: white;
              border-radius: 50%;
              width: 22px;
              height: 22px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              margin-right: 10px;
              flex-shrink: 0;
            }
            
            .reclaim-step-text {
              font-size: 14px;
              line-height: 1.4;
            }
            
            .reclaim-status-container {
              margin-top: 15px;
              /* Use transform instead of max-height transitions */
              transform: translateY(10px);
              opacity: 0;
              will-change: transform, opacity;
              transition: transform 0.3s ease, opacity 0.3s ease;
            }
            
            .reclaim-status-container.visible {
              transform: translateY(0);
              opacity: 1;
            }
            
            .reclaim-status-progress {
              display: flex;
              flex-direction: column;
              margin-bottom: 15px;
            }
            
            .reclaim-progress-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            
            .reclaim-status-text {
              font-size: 14px;
              color: #E0E0E5;
            }
            
            .reclaim-progress-counter {
              font-size: 14px;
              color: #E0E0E5;
            }
            
            .reclaim-progress-bar-container {
              height: 4px;
              width: 100%;
              background-color: #3A3A3C;
              border-radius: 2px;
              overflow: hidden;
            }
            
            .reclaim-progress-bar {
              height: 100%;
              width: 0%;
              background-color: #0A84FF;
              border-radius: 2px;
              /* Use transform instead of width for better performance */
              transform: scaleX(0);
              transform-origin: left;
              will-change: transform;
              transition: transform 0.3s ease;
            }
            
            .reclaim-progress-bar.success {
              background-color: #30D158;
            }
            
            .reclaim-progress-bar.error {
              background-color: #FF453A;
            }
            
            .reclaim-status-message {
              margin-top: 10px;
              font-size: 14px;
              color: #E0E0E5;
            }
            
            .reclaim-status-icon {
              display: flex;
              justify-content: center;
              margin: 15px 0;
            }
            
            .reclaim-icon-circle {
              background-color: #30D158;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              transition: all 0.3s ease;
            }
            
            .reclaim-icon-circle.error {
              background-color: #FF453A;
            }
            
            .reclaim-circular-loader {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 20px 0;
            }
            
            .reclaim-circular-loader svg {
              width: 48px;
              height: 48px;
              animation: reclaim-rotate 2s linear infinite;
            }
            
            .reclaim-circular-loader circle {
              stroke: #0A84FF;
              stroke-width: 4;
              stroke-dasharray: 150, 200;
              stroke-dashoffset: -10;
              stroke-linecap: round;
              fill: none;
              animation: reclaim-dash 1.5s ease-in-out infinite;
            }
            
            @keyframes reclaim-rotate {
              100% {
                transform: rotate(360deg);
              }
            }
            
            @keyframes reclaim-dash {
              0% {
                stroke-dasharray: 1, 200;
                stroke-dashoffset: 0;
              }
              50% {
                stroke-dasharray: 89, 200;
                stroke-dashoffset: -35;
              }
              100% {
                stroke-dasharray: 89, 200;
                stroke-dashoffset: -124;
              }
            }
            
            /* Reduce animation intensity to prevent ResizeObserver loops */
            @keyframes reclaim-progress-pulse {
              0% { opacity: 1; }
              50% { opacity: 0.8; }
              100% { opacity: 1; }
            }
            
            @keyframes reclaim-appear {
              0% { 
                opacity: 0;
                transform: translateY(20px);
              }
              100% { 
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes reclaim-success-checkmark {
              0% {
                stroke-dashoffset: 24;
              }
              100% {
                stroke-dashoffset: 0;
              }
            }
            
            .reclaim-success-checkmark {
              stroke-dasharray: 24;
              stroke-dashoffset: 24;
              animation: reclaim-success-checkmark 0.5s ease forwards;
            }
            
            /* For small screens */
            @media (max-width: 480px) {
              .reclaim-popup {
                width: calc(100% - 40px);
                bottom: 10px;
                right: 10px;
                left: 10px;
                max-width: 100%;
              }
            }
        `;
        
        // Handle document.head not being available yet
        const appendStyle = () => {
            if (document.head) {
                document.head.appendChild(styleEl);
            } else if (document.body) {
                document.body.appendChild(styleEl);
            } else {
                // If neither head nor body is available, try again later
                setTimeout(appendStyle, 10);
            }
        };
        
        appendStyle();
    }

    // Function to render the initial content
    function renderInitialContent() {
        popup.innerHTML = `
            <div class="reclaim-popup-header">
                <img class="reclaim-popup-logo" src="${chrome.runtime.getURL('assets/img/logo.png')}" alt="Reclaim Protocol">
                <h3 class="reclaim-popup-title">Reclaim Protocol</h3>
            </div>

            <div class="reclaim-popup-section">
                <p class="reclaim-popup-label">Source</p>
                <p class="reclaim-popup-value">${providerName}</p>
            </div>

            <div class="reclaim-popup-section">
                <p class="reclaim-popup-label">Description</p>
                <p class="reclaim-popup-value">${description}</p>
            </div>

            <div class="reclaim-popup-section">
                <p class="reclaim-popup-label">Data Required</p>
                <p class="reclaim-popup-value">${dataRequired}</p>
            </div>

            <div id="reclaim-steps-container" class="reclaim-steps-container">
                <p class="reclaim-steps-title">How it works</p>
                <div class="reclaim-step">
                    <div class="reclaim-step-number">1</div>
                    <div class="reclaim-step-text">Log in to your ${providerName} account.</div>
                </div>
                <div class="reclaim-step">
                    <div class="reclaim-step-number">2</div>
                    <div class="reclaim-step-text">Navigate to the Dashboard</div>
                </div>
            </div>

            <div id="reclaim-status-container" class="reclaim-status-container">
                <div id="reclaim-circular-loader" class="reclaim-circular-loader" style="display: none;">
                    <svg viewBox="25 25 50 50">
                        <circle cx="50" cy="50" r="20"></circle>
                    </svg>
                </div>
                <div id="reclaim-status-progress" class="reclaim-status-progress" style="display: none;">
                    <div class="reclaim-progress-row">
                        <span id="reclaim-status-text" class="reclaim-status-text">Preparing verification...</span>
                        <span id="reclaim-progress-counter" class="reclaim-progress-counter"></span>
                    </div>
                    <div class="reclaim-progress-bar-container">
                        <div id="reclaim-progress-bar" class="reclaim-progress-bar"></div>
                    </div>
                </div>
                <div id="reclaim-status-message" class="reclaim-status-message"></div>
            </div>
        `;
    }

    // Function to show loader
    function showLoader(message = "Generating verification proof...") {
        const stepsContainer = popup.querySelector('#reclaim-steps-container');
        const statusContainer = popup.querySelector('#reclaim-status-container');
        const circularLoader = popup.querySelector('#reclaim-circular-loader');
        const progressContainer = popup.querySelector('#reclaim-status-progress');
        const statusText = popup.querySelector('#reclaim-status-text');
        
        // Hide the steps using CSS classes instead of style manipulation
        if (stepsContainer) {
            stepsContainer.classList.add('hidden');
        }
        
        // Show the status container using CSS classes
        statusContainer.classList.add('visible');
        circularLoader.style.display = 'flex';
        progressContainer.style.display = 'block';
        statusText.textContent = message;
        
        state.inProgress = true;
        updateProgressBar();
    }

    // Function to update the progress bar
    function updateProgressBar() {
        const progressBar = popup.querySelector('#reclaim-progress-bar');
        const progressCounter = popup.querySelector('#reclaim-progress-counter');
        
        if (state.totalClaims > 0) {
            const percentage = (state.completedClaims / state.totalClaims);
            // Use transform instead of width to avoid layout recalculations
            progressBar.style.transform = `scaleX(${percentage})`;
            progressCounter.textContent = `${state.completedClaims}/${state.totalClaims}`;
        } else {
            progressBar.style.transform = 'scaleX(1)';
            progressBar.style.animation = 'reclaim-progress-pulse 2s infinite';
            progressCounter.textContent = '';
        }
    }

    // Function to update status message
    function updateStatusMessage(message, isError = false) {
        const statusMessage = popup.querySelector('#reclaim-status-message');
        statusMessage.textContent = message;
        statusMessage.style.color = isError ? '#FF453A' : '#E0E0E5';
    }

    // Function to show success state
    function showSuccess() {
        const stepsContainer = popup.querySelector('#reclaim-steps-container');
        const statusContainer = popup.querySelector('#reclaim-status-container');
        const circularLoader = popup.querySelector('#reclaim-circular-loader');
        const progressContainer = popup.querySelector('#reclaim-status-progress');
        const statusText = popup.querySelector('#reclaim-status-text');
        const progressBar = popup.querySelector('#reclaim-progress-bar');
        const progressCounter = popup.querySelector('#reclaim-progress-counter');
        
        // Hide the steps using CSS classes
        if (stepsContainer) {
            stepsContainer.classList.add('hidden');
        }
        
        // Hide circular loader
        circularLoader.style.display = 'none';
        
        // Show success UI
        statusContainer.classList.add('visible');
        progressContainer.style.display = 'block';
        statusText.textContent = "Verification complete!";
        
        // Ensure progress bar is fully filled - use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
            progressBar.style.width = '100%';
            progressBar.style.transform = 'scaleX(1)';
            progressBar.classList.add('success');
            progressBar.style.animation = 'none';
        });
        
        // Update progress counter to show completion
        if (state.totalClaims > 0) {
            progressCounter.textContent = `${state.totalClaims}/${state.totalClaims}`;
        } else {
            progressCounter.textContent = '100%';
        }
        
        updateStatusMessage("You will be redirected to the original page shortly.");
        
        // Add success animation if not already present
        if (!popup.querySelector('.reclaim-status-icon')) {
            const successIndicator = document.createElement('div');
            successIndicator.className = 'reclaim-status-icon';
            successIndicator.innerHTML = `
                <div class="reclaim-icon-circle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="reclaim-success-checkmark" d="M5 13L9 17L19 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            `;
            
            statusContainer.insertBefore(successIndicator, statusContainer.firstChild);
        }
    }

    // Function to show error state
    function showError(errorMessage) {
        const stepsContainer = popup.querySelector('#reclaim-steps-container');
        const statusContainer = popup.querySelector('#reclaim-status-container');
        const circularLoader = popup.querySelector('#reclaim-circular-loader');
        const progressContainer = popup.querySelector('#reclaim-status-progress');
        const statusText = popup.querySelector('#reclaim-status-text');
        const progressBar = popup.querySelector('#reclaim-progress-bar');
        
        // Hide the steps using CSS classes
        if (stepsContainer) {
            stepsContainer.classList.add('hidden');
        }
        
        // Hide circular loader
        circularLoader.style.display = 'none';
        
        // Show error UI
        statusContainer.classList.add('visible');
        progressContainer.style.display = 'block';
        statusText.textContent = "Verification failed";
        progressBar.style.transform = 'scaleX(1)';
        progressBar.classList.add('error');
        progressBar.style.animation = 'none';
        
        updateStatusMessage(errorMessage, true);
        
        // Add error icon if not already present
        if (!popup.querySelector('.reclaim-status-icon')) {
            const errorIndicator = document.createElement('div');
            errorIndicator.className = 'reclaim-status-icon';
            errorIndicator.innerHTML = `
                <div class="reclaim-icon-circle error">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            `;
            
            statusContainer.insertBefore(errorIndicator, statusContainer.firstChild);
        }
    }

    // Function to increment the total claims count
    function incrementTotalClaims() {
        state.totalClaims += 1;
        updateProgressBar();
    }

    // Function to increment the completed claims count
    function incrementCompletedClaims() {
        state.completedClaims += 1;
        updateProgressBar();
    }

    // Expose the public API for the popup
    return {
        element: popup,
        showLoader,
        updateStatusMessage,
        showSuccess,
        showError,
        incrementTotalClaims,
        incrementCompletedClaims,
        
        // Handle various status updates from background
        handleClaimCreationRequested: (requestHash) => {
            incrementTotalClaims();
            showLoader("Creating verification claim...");
        },
        
        handleClaimCreationSuccess: (requestHash) => {
            updateStatusMessage("Claim created successfully. Generating proof...");
        },
        
        handleClaimCreationFailed: (requestHash) => {
            showError("Failed to create claim. Please try again.");
        },
        
        handleProofGenerationStarted: (requestHash) => {
            updateStatusMessage("Generating cryptographic proof...");
        },
        
        handleProofGenerationSuccess: (requestHash) => {
            incrementCompletedClaims();
            updateStatusMessage(`Proof generated (${state.completedClaims}/${state.totalClaims})`);
        },
        
        handleProofGenerationFailed: (requestHash) => {
            showError("Failed to generate proof. Please try again.");
        },
        
        handleProofSubmitted: () => {
            state.proofSubmitted = true;
            showSuccess();
        },
        
        handleProofSubmissionFailed: (error) => {
            showError(`Failed to submit proof: ${error}`);
        }
    };
}

// Example usage (for testing - remove later):
/*
if (typeof document !== 'undefined') { // Basic check for browser environment
    const examplePopup = createProviderVerificationPopup('Emirates', 'Skywards', 'Membership Status / Tier');
    document.body.appendChild(examplePopup);
    // To test enabling the button:
    // setTimeout(() => examplePopup.enableVerifyButton(), 2000);
    // To test loader:
    // setTimeout(() => { examplePopup.showLoader(); examplePopup.updateProgress("Generating proof..."); }, 4000);
    // To test success:
    // setTimeout(() => examplePopup.showSuccess(), 6000);
}
*/ 