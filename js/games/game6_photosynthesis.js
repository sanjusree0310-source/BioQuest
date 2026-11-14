/* ============================================================
   BIOQUEST - Game 6: Photosynthesis Factory (Enhanced Edition)
   Category: Plant Biology | Interactive Chloroplast & Calvin Cycle Reactor
   ============================================================ */

class PhotosynthesisGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.level = 1;
    this.score = 0;
    this.inputs = { sun: 35, water: 40, co2: 30 };
    this.glucoseYield = 0;
    this.o2Released = 0;
    this.stomataOpen = true;
    this.timer = null;
    this.tutorialEngine = null;

    this.levelConfigs = {
      1: {
        title: "Level 1: Chloroplast Reagent Calibration",
        instruction: "Calibrate Sunlight (>60%), Water (>60%), and CO2 (>50%) into their optimal reaction zones to trigger photosynthesis.",
        targetYield: 50
      },
      2: {
        title: "Level 2: Light & Dark Reaction Coupling",
        instruction: "Maintain photon irradiance and water photolysis to drive ATP/NADPH synthesis for the Calvin Cycle.",
        targetYield: 80
      },
      3: {
        title: "Level 3: Maximum Glucose Harvest Reactor",
        instruction: "Operate the chloroplast factory under fluctuating sunlight and transpiration to synthesize 120g of Glucose!",
        targetYield: 120
      }
    };
  }

  init(level = 1, isDemo = false) {
    this.level = level;
    this.score = 0;
    this.inputs = { sun: 35, water: 40, co2: 30 };
    this.glucoseYield = 0;
    this.o2Released = 0;
    if (this.timer) clearInterval(this.timer);
    this.render();

    if (isDemo) {
      this.launchTutorial();
    }
  }

  render() {
    const config = this.levelConfigs[this.level];
    this.container.innerHTML = `
      <div class="photo-layout" style="display: grid; grid-template-columns: 1fr 340px; height: 100%; min-height: 560px; position: relative;">
        <!-- Left: Animated Chloroplast Simulation Chamber -->
        <div class="photo-chamber" style="background: radial-gradient(circle, #F6FDF9 0%, #EAF7EE 100%); padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: space-between;">
          
          <!-- Top Chemical Equation Banner -->
          <div style="background: #FFFFFF; border: 1.5px solid var(--border-light); border-radius: var(--radius-full); padding: 8px 24px; box-shadow: var(--shadow-sm); font-size: 0.88rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
            <span>6 CO₂ + 6 H₂O + <span style="color: #D4A517;">Photons (Light)</span> ➔ <span style="color: var(--primary);">C₆H₁₂O₆ (Glucose)</span> + 6 O₂ ↑</span>
          </div>

          <!-- Chloroplast Graphic Vessel -->
          <div style="position: relative; width: 480px; height: 270px; background: #FFFFFF; border-radius: 130px; border: 4px solid var(--primary); box-shadow: 0 16px 45px rgba(97, 201, 168, 0.28); display: flex; align-items: center; justify-content: space-around; padding: 20px; overflow: hidden;">
            
            <!-- Sunlight Ray Beam Animation -->
            <div style="position: absolute; top: -10px; left: 60px; width: 60px; height: 120px; background: linear-gradient(180deg, rgba(255, 226, 138, 0.6) 0%, transparent 100%); transform: rotate(25deg); pointer-events: none;"></div>

            <!-- Thylakoid Grana (Light Reactions) -->
            <div id="thylakoidVessel" style="width: 160px; height: 180px; border-radius: var(--radius-lg); background: var(--primary-light); border: 2.5px solid var(--primary); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; text-align: center; padding: 12px; box-shadow: var(--shadow-sm); z-index: 5;">
              <span style="font-size: 2.2rem;">🥞</span>
              <h6 style="font-size: 0.86rem; font-weight: 800; color: #1F7C5F;">Thylakoid Grana</h6>
              <span style="font-size: 0.72rem; color: #3CA889; font-weight: 700;">H₂O Photolysis ➔ O₂ Released</span>
              <span id="lightActiveBadge" style="font-size: 0.68rem; font-weight: 800; padding: 3px 10px; border-radius: 99px; background: #D1F2E8; color: #1B664E;">Exciting Electrons</span>
            </div>

            <!-- Rotary ATP Synthase Turbine -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; z-index: 5;">
              <span style="font-size: 1.8rem; animation: spinSlow 3s linear infinite;" id="turbineIcon">⚙️</span>
              <span style="font-size: 0.68rem; font-weight: 800; color: #D4A517;">ATP Synthase</span>
            </div>

            <!-- Stroma Matrix (Calvin Cycle) -->
            <div id="stromaVessel" style="width: 170px; height: 180px; border-radius: var(--radius-lg); background: #FFF9E5; border: 2.5px solid #FFE28A; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; text-align: center; padding: 12px; box-shadow: var(--shadow-sm); z-index: 5;">
              <span style="font-size: 2.2rem; animation: pulseSubtle 2s infinite;">🔄</span>
              <h6 style="font-size: 0.86rem; font-weight: 800; color: #8C6400;">Stroma Matrix</h6>
              <span style="font-size: 0.72rem; color: #9C7400; font-weight: 700;">Rubisco CO₂ Fixation</span>
              <span id="calvinActiveBadge" style="font-size: 0.68rem; font-weight: 800; padding: 3px 10px; border-radius: 99px; background: #FFF0C2; color: #8C6400;">Synthesizing G3P</span>
            </div>
          </div>

          <!-- Controls: Sunlight, Water, CO2 Sliders -->
          <div style="background: #FFFFFF; border-radius: var(--radius-xl); border: 1.5px solid var(--border-light); padding: 18px 24px; width: 100%; max-width: 600px; box-shadow: var(--shadow-sm); display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
            <!-- Sunlight Slider -->
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 800;">
                <span style="color: #D4A517;">☀️ Sunlight Photons</span>
                <span id="val_sun">${this.inputs.sun}%</span>
              </div>
              <input type="range" id="slider_sun" min="0" max="100" value="${this.inputs.sun}" style="accent-color: #FFE28A;">
            </div>

            <!-- Water H2O Slider -->
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 800;">
                <span style="color: var(--secondary);">💧 Root Water (H₂O)</span>
                <span id="val_water">${this.inputs.water}%</span>
              </div>
              <input type="range" id="slider_water" min="0" max="100" value="${this.inputs.water}" style="accent-color: var(--secondary);">
            </div>

            <!-- CO2 Slider -->
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 800;">
                <span style="color: var(--accent-lavender);">💨 Stomata (CO₂)</span>
                <span id="val_co2">${this.inputs.co2}%</span>
              </div>
              <input type="range" id="slider_co2" min="0" max="100" value="${this.inputs.co2}" style="accent-color: var(--accent-lavender);">
            </div>
          </div>
        </div>

        <!-- Right: Glucose Yield Telemetry -->
        <div class="photo-drawer" style="background: #FFFFFF; border-left: 1.5px solid var(--border-light); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; overflow-y: auto;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="badge badge-mint">Biochemical Output</span>
              <span style="font-size: 0.85rem; font-weight: 800; color: var(--primary);" id="yieldCounter">Yield: 0g / ${config.targetYield}g</span>
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">${config.title}</h4>
            <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 18px; line-height: 1.4;">${config.instruction}</p>

            <div id="photoIntelBox" style="background: var(--bg-surface-soft); border-radius: var(--radius-md); border-left: 4px solid var(--primary); padding: 16px; margin-bottom: 16px;">
              <span style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; color: var(--primary);">Biochemical Pathway</span>
              <h5 id="photoIntelTitle" style="font-size: 0.98rem; font-weight: 800; color: var(--text-main); margin: 6px 0;">Photolysis & Calvin Cycle</h5>
              <p id="photoIntelDesc" style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.45;">Chlorophyll pigments in photosystems absorb light energy to excite electrons, splitting water into protons and releasing oxygen gas.</p>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 800; margin-bottom: 6px;">
              <span>Glucose Synthesis Progress</span>
              <span id="photoPercent" style="color: var(--primary);">0%</span>
            </div>
            <div style="width: 100%; height: 10px; background: var(--bg-surface-soft); border-radius: 99px; overflow: hidden; border: 1px solid var(--border-light);">
              <div id="photoFill" style="width: 0%; height: 100%; background: linear-gradient(90deg, var(--primary) 0%, #FFE28A 100%); transition: width 0.3s ease;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
    this.startReactorLoop();
  }

  attachEvents() {
    const bindSlider = (id, key) => {
      const el = document.getElementById(`slider_${id}`);
      if (el) {
        el.oninput = (e) => {
          this.inputs[key] = parseInt(e.target.value);
          document.getElementById(`val_${id}`).textContent = `${this.inputs[key]}%`;
        };
      }
    };

    bindSlider('sun', 'sun');
    bindSlider('water', 'water');
    bindSlider('co2', 'co2');
  }

  startReactorLoop() {
    const config = this.levelConfigs[this.level];

    this.timer = setInterval(() => {
      // Liebig's Law of the Minimum: Rate governed by lowest reagent
      const limiting = Math.min(this.inputs.sun, this.inputs.water, this.inputs.co2);

      if (limiting >= 45) {
        const increment = (limiting / 24);
        this.glucoseYield = Math.min(config.targetYield, this.glucoseYield + increment);
        this.o2Released += increment * 1.2;
        this.score += 2;

        const percent = Math.min(100, Math.round((this.glucoseYield / config.targetYield) * 100));
        const yieldEl = document.getElementById('yieldCounter');
        const percentEl = document.getElementById('photoPercent');
        const fillEl = document.getElementById('photoFill');
        if (yieldEl) yieldEl.textContent = `Yield: ${Math.round(this.glucoseYield)}g / ${config.targetYield}g`;
        if (percentEl) percentEl.textContent = `${percent}%`;
        if (fillEl) fillEl.style.width = `${percent}%`;

        if (this.glucoseYield >= config.targetYield) {
          clearInterval(this.timer);
          setTimeout(() => this.completeLevel(), 400);
        }
      }
    }, 380);
  }

  completeLevel() {
    if (this.timer) clearInterval(this.timer);
    if (window.soundEngine) window.soundEngine.playFanfare();
    if (window.triggerConfetti) window.triggerConfetti();

    const stars = 3;
    if (window.stateManager) {
      window.stateManager.recordGameCompletion('photosynthesis', this.level, this.score, stars);
    }

    if (window.showGameCompletionModal) {
      window.showGameCompletionModal({
        gameId: 'photosynthesis',
        gameTitle: 'Photosynthesis Factory',
        level: this.level,
        score: this.score,
        stars: stars,
        learningTakeaway: "Photosynthesis couples light reactions (ATP & NADPH synthesis via water photolysis) with dark Calvin reactions (Rubisco carbon fixation into glucose).",
        onReplay: () => this.init(this.level),
        onNext: this.level < 3 ? () => this.init(this.level + 1) : null
      });
    }
  }

  // Interactive Guided Tutorial
  launchTutorial() {
    const steps = [
      {
        title: "Welcome to Photosynthesis Factory",
        instruction: "Chloroplasts require Sunlight, Water, and CO2. Slide the Sunlight slider up to 80%!",
        target: '#slider_sun',
        feedback: "Photons detected! Thylakoid chlorophyll excited.",
        onAction: () => {
          this.inputs.sun = 80;
          const s = document.getElementById('slider_sun');
          if (s) s.value = 80;
          document.getElementById('val_sun').textContent = '80%';
        }
      },
      {
        title: "Pump Water from Roots",
        instruction: "Slide the Water (H2O) intake up to 80% to supply hydrogen ions and electrons.",
        target: '#slider_water',
        feedback: "Water photolysis initiated! Oxygen gas byproduct releasing.",
        onAction: () => {
          this.inputs.water = 80;
          const w = document.getElementById('slider_water');
          if (w) w.value = 80;
          document.getElementById('val_water').textContent = '80%';
        }
      },
      {
        title: "Open Leaf Stomata for CO2",
        instruction: "Increase Carbon Dioxide (CO2) to 75% to fuel the Calvin Cycle.",
        target: '#slider_co2',
        feedback: "Full synthesis underway! Glucose C6H12O6 accumulating.",
        onAction: () => {
          this.inputs.co2 = 75;
          const c = document.getElementById('slider_co2');
          if (c) c.value = 75;
          document.getElementById('val_co2').textContent = '75%';
        }
      }
    ];

    this.tutorialEngine = new TutorialEngine(this, steps, () => {
      this.init(1, false);
    });
    this.tutorialEngine.start();
  }

  resetGame() {
    if (this.timer) clearInterval(this.timer);
    this.init(this.level, false);
  }
}

window.PhotosynthesisGame = PhotosynthesisGame;
