/* ============================================================
   BIOQUEST - Game 10: Bloodstream Delivery Mission (Enhanced Edition)
   Category: Human Physiology | Circulatory Perfusion, SpO2 & Hemostasis
   ============================================================ */

class BloodstreamDeliveryGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.level = 1;
    this.score = 0;
    this.oxygenLoaded = false;
    this.deliveredCount = 0;
    this.clotFormed = false;
    this.bloodVolume = 100;
    this.timer = null;
    this.tutorialEngine = null;

    this.levelConfigs = {
      1: {
        title: "Level 1: Oxyhemoglobin Shuttling",
        targetDeliveries: 3,
        instruction: "1. Dock Erythrocyte at Lungs to bind O₂ (HbO₂) ➔ 2. Deliver O₂ to hypoxic skeletal muscle."
      },
      2: {
        title: "Level 2: Vascular Hemostasis Emergency",
        targetDeliveries: 4,
        instruction: "Vessel tear detected! Deploy Thrombocytes (Platelets) to form a fibrin clot before blood volume drops."
      },
      3: {
        title: "Level 3: Full Circulatory Perfusion Marathon",
        targetDeliveries: 5,
        instruction: "Balance oxygen delivery to myocardial tissue while maintaining blood pressure homeostasis!"
      }
    };
  }

  init(level = 1, isDemo = false) {
    this.level = level;
    this.score = 0;
    this.oxygenLoaded = false;
    this.deliveredCount = 0;
    this.clotFormed = false;
    this.bloodVolume = 100;
    if (this.timer) clearInterval(this.timer);
    this.render();

    if (isDemo) {
      this.launchTutorial();
    }
  }

  render() {
    const config = this.levelConfigs[this.level];
    this.container.innerHTML = `
      <div class="blood-layout" style="display: grid; grid-template-columns: 1fr 350px; height: 100%; min-height: 560px; position: relative;">
        <!-- Left: Blood Vessel Flow Arena -->
        <div class="blood-arena" style="background: radial-gradient(circle, #FFF8F8 0%, #FEEFEF 100%); padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; position: relative;">
          
          <!-- Top Telemetry Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 660px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge badge-peach">Perfusion SpO₂</span>
              <span style="font-size: 0.82rem; font-weight: 800; color: #C62828;" id="spO2Badge">${this.oxygenLoaded ? '99% SpO₂ (Oxygenated)' : '75% SpO₂ (Deoxygenated)'}</span>
            </div>
            <div style="font-size: 0.85rem; font-weight: 800; color: #C62828;" id="bloodDeliveryCount">
              Delivered: ${this.deliveredCount} / ${config.targetDeliveries}
            </div>
          </div>

          <!-- Bloodstream Tube -->
          <div style="position: relative; width: 100%; max-width: 660px; height: 280px; background: #FFFFFF; border-radius: var(--radius-xl); border: 3px solid #FFCDD2; box-shadow: 0 14px 38px rgba(255, 107, 107, 0.22); overflow: hidden; display: flex; align-items: center; justify-content: space-between; padding: 20px 30px;">
            
            <!-- Left Station: Pulmonary Alveoli (Lungs) -->
            <div id="stationLungs" style="width: 140px; height: 190px; border-radius: var(--radius-lg); background: var(--secondary-light); border: 2.5px solid var(--secondary); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; text-align: center; cursor: pointer; transition: all 0.2s; box-shadow: var(--shadow-sm); z-index: 5;">
              <span style="font-size: 2.5rem;">🫁</span>
              <h6 style="font-size: 0.86rem; font-weight: 800; color: #1F558E;">Pulmonary Capillary</h6>
              <span style="font-size: 0.7rem; font-weight: 700; color: var(--secondary);">High Partial O₂ Pressure</span>
              <button class="btn btn-sm btn-secondary" id="btnLoadO2" style="font-size: 0.74rem; padding: 5px 12px; margin-top: 4px;">Bind O₂ ➔</button>
            </div>

            <!-- Central Flowing RBC -->
            <div id="activeRBC" style="display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 5;">
              <div style="width: 76px; height: 76px; border-radius: 50%; background: ${this.oxygenLoaded ? '#E53935' : '#8E0000'}; border: 4px solid #FFFFFF; box-shadow: 0 8px 24px rgba(229, 57, 53, 0.45); display: flex; align-items: center; justify-content: center; font-size: 2.2rem; color: #FFFFFF; animation: pulseSubtle 1.4s infinite; transition: all 0.3s;">
                ${this.oxygenLoaded ? '✨' : '🩸'}
              </div>
              <span id="rbcStatusBadge" style="font-size: 0.74rem; font-weight: 800; color: #C62828;">${this.oxygenLoaded ? 'Oxyhemoglobin (HbO₂)' : 'Deoxyhemoglobin (Hb)'}</span>
            </div>

            <!-- Right Station: Working Muscle Tissue -->
            <div id="stationTissue" style="width: 140px; height: 190px; border-radius: var(--radius-lg); background: #FFF2EC; border: 2.5px solid var(--accent-peach); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; text-align: center; cursor: pointer; transition: all 0.2s; box-shadow: var(--shadow-sm); z-index: 5;">
              <span style="font-size: 2.5rem;">💪</span>
              <h6 style="font-size: 0.86rem; font-weight: 800; color: #B2532E;">Systemic Capillary</h6>
              <span style="font-size: 0.7rem; font-weight: 700; color: var(--accent-peach);">Aerobic Muscle Demand</span>
              <button class="btn btn-sm btn-outline" id="btnDeliverO2" style="font-size: 0.74rem; padding: 5px 12px; margin-top: 4px;">Release O₂ ➔</button>
            </div>

            <!-- Tear / Clotting Site for Level 2 & 3 -->
            ${this.level >= 2 ? `
              <div id="vesselTearSite" style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); background: ${this.clotFormed ? 'var(--primary-light)' : '#FFEAEA'}; border: 2px dashed ${this.clotFormed ? 'var(--primary)' : '#E53935'}; border-radius: var(--radius-md); padding: 4px 14px; font-size: 0.72rem; font-weight: 800; color: ${this.clotFormed ? 'var(--primary)' : '#C62828'}; cursor: pointer; z-index: 10;">
                ${this.clotFormed ? '✓ Fibrin Mesh Sealed' : '⚠️ Vessel Tear: Click to Clot with Platelets!'}
              </div>
            ` : ''}
          </div>

          <!-- Component Action Dock -->
          <div style="display: flex; gap: 14px; margin-top: 14px; flex-wrap: wrap; justify-content: center;">
            <div style="display: flex; align-items: center; gap: 8px; background: #FFFFFF; border-radius: var(--radius-full); padding: 8px 18px; border: 1.5px solid var(--border-light); font-size: 0.82rem; font-weight: 700;">
              <span>🩸 Erythrocyte: Transports O₂ via Hemoglobin Fe²⁺</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; background: #FFFFFF; border-radius: var(--radius-full); padding: 8px 18px; border: 1.5px solid var(--border-light); font-size: 0.82rem; font-weight: 700;">
              <span>🩹 Platelet (Thrombocyte): Synthesizes Fibrin Clot</span>
            </div>
          </div>
        </div>

        <!-- Right: Telemetry & Physiology Brief -->
        <div class="blood-drawer" style="background: #FFFFFF; border-left: 1.5px solid var(--border-light); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; overflow-y: auto;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="badge badge-peach">Perfusion Intel</span>
              <span style="font-size: 0.82rem; font-weight: 800; color: #C62828;">Cardiac Cycle Active</span>
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">${config.title}</h4>
            <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 18px; line-height: 1.4;">${config.instruction}</p>

            <div id="bloodIntelBox" style="background: var(--bg-surface-soft); border-radius: var(--radius-md); border-left: 4px solid #E53935; padding: 16px; margin-bottom: 16px;">
              <span style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; color: #E53935;">Hemoglobin Biophysics</span>
              <h5 id="bloodIntelTitle" style="font-size: 0.98rem; font-weight: 800; color: var(--text-main); margin: 6px 0;">Cooperative Allosteric Binding</h5>
              <p id="bloodIntelDesc" style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.45;">Binding of the first oxygen molecule induces conformational shift in the tetramer, exponentially increasing affinity for subsequent O₂ molecules.</p>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 800; margin-bottom: 6px;">
              <span>Tissue Perfusion Progress</span>
              <span id="bloodPercent" style="color: #C62828;">0%</span>
            </div>
            <div style="width: 100%; height: 10px; background: var(--bg-surface-soft); border-radius: 99px; overflow: hidden; border: 1px solid var(--border-light);">
              <div id="bloodFill" style="width: 0%; height: 100%; background: linear-gradient(90deg, #E53935 0%, var(--primary) 100%); transition: width 0.4s ease;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const btnLoad = document.getElementById('btnLoadO2');
    const btnDeliver = document.getElementById('btnDeliverO2');
    const tearSite = document.getElementById('vesselTearSite');

    if (btnLoad) {
      btnLoad.onclick = () => {
        if (!this.oxygenLoaded) {
          this.oxygenLoaded = true;
          this.score += 20;
          if (window.soundEngine) window.soundEngine.playCorrect();
          this.updateRBCVisuals();
        }
      };
    }

    if (btnDeliver) {
      btnDeliver.onclick = () => {
        if (this.oxygenLoaded) {
          this.oxygenLoaded = false;
          this.deliveredCount++;
          this.score += 30;
          if (window.soundEngine) window.soundEngine.playCorrect();
          this.updateRBCVisuals();
          this.checkCompletion();
        } else {
          if (window.soundEngine) window.soundEngine.playWrong();
          const desc = document.getElementById('bloodIntelDesc');
          if (desc) desc.textContent = "Erythrocyte is deoxygenated! Return to the pulmonary capillary to bind O₂ first.";
        }
      };
    }

    if (tearSite) {
      tearSite.onclick = () => {
        if (!this.clotFormed) {
          this.clotFormed = true;
          this.score += 40;
          if (window.soundEngine) window.soundEngine.playCorrect();
          tearSite.textContent = "✓ Fibrin Mesh Sealed (Thrombosis)";
          tearSite.style.background = "var(--primary-light)";
          tearSite.style.borderColor = "var(--primary)";
          tearSite.style.color = "var(--primary)";
          this.checkCompletion();
        }
      };
    }
  }

  updateRBCVisuals() {
    const rbc = document.getElementById('activeRBC');
    const badge = document.getElementById('rbcStatusBadge');
    const spO2 = document.getElementById('spO2Badge');
    if (!rbc || !badge) return;

    if (this.oxygenLoaded) {
      rbc.querySelector('div').style.background = '#E53935';
      rbc.querySelector('div').innerHTML = '✨';
      badge.textContent = 'Oxyhemoglobin (HbO₂)';
      badge.style.color = '#E53935';
      if (spO2) {
        spO2.textContent = '99% SpO₂ (Oxygenated)';
        spO2.style.color = 'var(--primary)';
      }
    } else {
      rbc.querySelector('div').style.background = '#8E0000';
      rbc.querySelector('div').innerHTML = '🩸';
      badge.textContent = 'Deoxyhemoglobin (Hb)';
      badge.style.color = '#8E0000';
      if (spO2) {
        spO2.textContent = '75% SpO₂ (Deoxygenated)';
        spO2.style.color = '#C62828';
      }
    }
  }

  checkCompletion() {
    const config = this.levelConfigs[this.level];
    const total = config.targetDeliveries;
    const percent = Math.min(100, Math.round((this.deliveredCount / total) * 100));

    const countEl = document.getElementById('bloodDeliveryCount');
    const percentEl = document.getElementById('bloodPercent');
    const fillEl = document.getElementById('bloodFill');
    if (countEl) countEl.textContent = `Delivered: ${this.deliveredCount} / ${total}`;
    if (percentEl) percentEl.textContent = `${percent}%`;
    if (fillEl) fillEl.style.width = `${percent}%`;

    const requiresClot = this.level >= 2;
    const clotSatisfied = !requiresClot || this.clotFormed;

    if (this.deliveredCount >= total && clotSatisfied) {
      setTimeout(() => this.completeLevel(), 500);
    }
  }

  completeLevel() {
    if (window.soundEngine) window.soundEngine.playFanfare();
    if (window.triggerConfetti) window.triggerConfetti();

    const stars = 3;
    if (window.stateManager) {
      window.stateManager.recordGameCompletion('bloodstream_delivery', this.level, this.score, stars);
    }

    if (window.showGameCompletionModal) {
      window.showGameCompletionModal({
        gameId: 'bloodstream_delivery',
        gameTitle: 'Bloodstream Delivery Mission',
        level: this.level,
        score: this.score,
        stars: stars,
        learningTakeaway: "Blood components coordinate critical functions: Erythrocytes transport O2 and CO2 via hemoglobin, leukocytes provide immune surveillance, and platelets trigger the clotting cascade with fibrin polymerization.",
        onReplay: () => this.init(this.level),
        onNext: this.level < 3 ? () => this.init(this.level + 1) : null
      });
    }
  }

  // Interactive Guided Tutorial
  launchTutorial() {
    const steps = [
      {
        title: "Welcome to Bloodstream Delivery",
        instruction: "Become a blood cell explorer! Click Bind O₂ at the Pulmonary Capillary to load oxygen onto hemoglobin.",
        target: '#btnLoadO2',
        feedback: "Oxyhemoglobin formed! Iron binds oxygen.",
        onAction: () => {
          this.oxygenLoaded = true;
          this.updateRBCVisuals();
        }
      },
      {
        title: "Deliver Oxygen to Muscle Tissue",
        instruction: "Now deliver oxygen to the working muscle tissue by clicking Release O₂.",
        target: '#btnDeliverO2',
        feedback: "Tissue perfused! Aerobic cellular respiration sustained.",
        onAction: () => {
          this.oxygenLoaded = false;
          this.deliveredCount++;
          this.updateRBCVisuals();
          this.checkCompletion();
        }
      }
    ];

    this.tutorialEngine = new TutorialEngine(this, steps, () => {
      this.init(1, false);
    });
    this.tutorialEngine.start();
  }

  resetGame() {
    this.init(this.level, false);
  }
}

window.BloodstreamDeliveryGame = BloodstreamDeliveryGame;
