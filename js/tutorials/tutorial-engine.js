/* ============================================================
   BIOQUEST - Interactive Guided Tutorial Demo Engine
   Powers "WATCH DEMO" for All 10 Games with Live Guided Actions
   ============================================================ */

class TutorialEngine {
  constructor(gameInstance, steps = [], onComplete = null) {
    this.game = gameInstance;
    this.steps = steps;
    this.onComplete = onComplete;
    this.currentStepIdx = 0;
    this.isActive = false;

    this.overlay = null;
    this.spotlight = null;
    this.handCursor = null;
    this.guidanceCard = null;
    this.feedbackPill = null;
    this.finishDialog = null;

    this.activeTargetEl = null;
    this.boundInteractionHandler = null;

    this.initDOM();
  }

  initDOM() {
    let overlay = document.getElementById('tutorialOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'tutorialOverlay';
      overlay.className = 'tutorial-overlay';
      document.getElementById('gameArenaBoard').appendChild(overlay);
    }
    this.overlay = overlay;

    this.overlay.innerHTML = `
      <!-- Tutorial HUD -->
      <div class="tutorial-hud-bar">
        <span class="tutorial-mode-badge">
          <span>🎓</span> Interactive Guided Demo
        </span>
        <span class="tutorial-step-counter" id="tutStepCounter">Step 1 of ${this.steps.length}</span>
        <div class="tutorial-hud-actions">
          <button class="btn btn-sm btn-outline" id="tutRestartBtn">Restart Demo</button>
          <button class="btn btn-sm btn-secondary" id="tutSkipBtn">Skip Tutorial</button>
        </div>
      </div>

      <!-- Spotlight Ring -->
      <div class="tutorial-spotlight-ring" id="tutSpotlight"></div>

      <!-- Animated Hand Cursor -->
      <div class="tutorial-hand-cursor" id="tutHandCursor">👆</div>

      <!-- Guidance Bottom Card -->
      <div class="tutorial-guidance-card" id="tutGuidanceCard">
        <div class="guidance-left">
          <div class="guidance-icon">💡</div>
          <div class="guidance-text">
            <h4 id="tutStepTitle">Explore the Area</h4>
            <p id="tutStepDesc">Click on the highlighted element to continue.</p>
          </div>
        </div>
        <button class="btn btn-sm btn-outline" id="tutActionHintBtn">Perform Action</button>
      </div>

      <!-- Action Feedback Toast -->
      <div class="tutorial-feedback-pill" id="tutFeedbackPill" style="display: none;">
        <span>✨</span> <span id="tutFeedbackText">Great job!</span>
      </div>

      <!-- Tutorial Completed Banner -->
      <div class="tutorial-finish-dialog" id="tutFinishDialog">
        <div class="tutorial-finish-icon">🏆</div>
        <h3>Tutorial Completed!</h3>
        <p>You have mastered the controls and biological principles for this adventure. Ready to take on the mission?</p>
        <div class="tutorial-finish-actions">
          <button class="btn btn-outline" id="tutReplayDemoBtn">Replay Demo</button>
          <button class="btn btn-primary btn-lg" id="tutPlayNowBtn">PLAY GAME NOW 🚀</button>
        </div>
      </div>
    `;

    this.spotlight = this.overlay.querySelector('#tutSpotlight');
    this.handCursor = this.overlay.querySelector('#tutHandCursor');
    this.guidanceCard = this.overlay.querySelector('#tutGuidanceCard');
    this.feedbackPill = this.overlay.querySelector('#tutFeedbackPill');
    this.finishDialog = this.overlay.querySelector('#tutFinishDialog');

    // Attach controls
    this.overlay.querySelector('#tutRestartBtn').onclick = () => this.restart();
    this.overlay.querySelector('#tutSkipBtn').onclick = () => this.complete();
    this.overlay.querySelector('#tutReplayDemoBtn').onclick = () => this.restart();
    this.overlay.querySelector('#tutPlayNowBtn').onclick = () => this.complete();

    // Auto perform action if student needs help
    this.overlay.querySelector('#tutActionHintBtn').onclick = () => {
      if (this.activeTargetEl) {
        this.activeTargetEl.click();
      }
    };
  }

  start() {
    this.isActive = true;
    this.currentStepIdx = 0;
    this.overlay.classList.add('active');
    this.finishDialog.classList.remove('active');
    this.renderCurrentStep();
  }

  renderCurrentStep() {
    if (this.currentStepIdx >= this.steps.length) {
      this.showFinishScreen();
      return;
    }

    const step = this.steps[this.currentStepIdx];
    this.overlay.querySelector('#tutStepCounter').textContent = `Step ${this.currentStepIdx + 1} of ${this.steps.length}`;
    this.overlay.querySelector('#tutStepTitle').textContent = step.title;
    this.overlay.querySelector('#tutStepDesc').textContent = step.instruction;

    // Remove previous listeners
    if (this.activeTargetEl && this.boundInteractionHandler) {
      this.activeTargetEl.removeEventListener('click', this.boundInteractionHandler);
    }

    // Locate target DOM element
    setTimeout(() => {
      let targetEl = null;
      if (typeof step.target === 'function') {
        targetEl = step.target();
      } else if (typeof step.target === 'string') {
        targetEl = document.querySelector(step.target);
      }

      this.activeTargetEl = targetEl;

      if (targetEl) {
        const boardRect = document.getElementById('gameArenaBoard').getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        const top = targetRect.top - boardRect.top;
        const left = targetRect.left - boardRect.left;
        const width = targetRect.width;
        const height = targetRect.height;

        // Position spotlight
        this.spotlight.style.display = 'block';
        this.spotlight.style.top = `${top - 6}px`;
        this.spotlight.style.left = `${left - 6}px`;
        this.spotlight.style.width = `${width + 12}px`;
        this.spotlight.style.height = `${height + 12}px`;

        // Position hand cursor
        this.handCursor.style.display = 'block';
        this.handCursor.style.top = `${top + height / 2 + 10}px`;
        this.handCursor.style.left = `${left + width / 2 - 10}px`;

        // Interaction listener
        this.boundInteractionHandler = (e) => {
          this.handleStepSuccess(step);
        };
        targetEl.addEventListener('click', this.boundInteractionHandler, { once: true });
      } else {
        // Target is visual / informational, click anywhere on guidance card to advance
        this.spotlight.style.display = 'none';
        this.handCursor.style.display = 'none';
        this.boundInteractionHandler = () => this.handleStepSuccess(step);
        this.guidanceCard.addEventListener('click', this.boundInteractionHandler, { once: true });
      }
    }, 150);
  }

  handleStepSuccess(step) {
    if (window.soundEngine) window.soundEngine.playCorrect();

    // Show feedback toast
    this.feedbackPill.style.display = 'flex';
    this.overlay.querySelector('#tutFeedbackText').textContent = step.feedback || "Excellent move!";

    // Trigger any game action needed for this demo step
    if (step.onAction) {
      try { step.onAction(); } catch (e) { console.error(e); }
    }

    setTimeout(() => {
      this.feedbackPill.style.display = 'none';
      this.currentStepIdx++;
      this.renderCurrentStep();
    }, 1200);
  }

  showFinishScreen() {
    this.spotlight.style.display = 'none';
    this.handCursor.style.display = 'none';
    this.guidanceCard.style.display = 'none';
    this.finishDialog.classList.add('active');
    if (window.soundEngine) window.soundEngine.playFanfare();
  }

  restart() {
    this.finishDialog.classList.remove('active');
    this.guidanceCard.style.display = 'flex';
    if (this.game && typeof this.game.resetGame === 'function') {
      this.game.resetGame();
    }
    this.currentStepIdx = 0;
    this.renderCurrentStep();
  }

  complete() {
    this.isActive = false;
    this.overlay.classList.remove('active');
    this.finishDialog.classList.remove('active');

    if (this.activeTargetEl && this.boundInteractionHandler) {
      this.activeTargetEl.removeEventListener('click', this.boundInteractionHandler);
    }

    if (this.onComplete) {
      this.onComplete();
    }
  }
}

window.TutorialEngine = TutorialEngine;
