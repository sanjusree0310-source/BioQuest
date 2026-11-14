/* ============================================================
   BIOQUEST - Game 2: Body Builder Challenge (Enhanced Edition)
   Category: Human Anatomy | Interactive Organ Snapping & Animated Physiology
   ============================================================ */

class BodyBuilderGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.level = 1;
    this.score = 0;
    this.selectedOrgan = null;
    this.placedOrgans = new Set();
    this.tutorialEngine = null;

    this.organsData = {
      brain: {
        id: 'brain',
        name: 'Brain (Cerebrum & Cerebellum)',
        cavity: 'Cranial Cavity',
        slot: 'slot_head',
        desc: 'Protected by the cranium; 86 billion neurons coordinating sensory perception, motor control, and homeostasis.',
        icon: '🧠',
        color: '#FFB89B',
        sound: 'brain'
      },
      heart: {
        id: 'heart',
        name: 'Heart (Myocardium)',
        cavity: 'Mediastinum (Thoracic)',
        slot: 'slot_heart',
        desc: 'Four-chambered muscular pump maintaining pulmonary (lungs) and systemic (tissues) circulation at ~72 BPM.',
        icon: '🫀',
        color: '#FF6B6B',
        sound: 'heart'
      },
      lungs: {
        id: 'lungs',
        name: 'Lungs (Left & Right Pleura)',
        cavity: 'Pleural Cavity (Thoracic)',
        slot: 'slot_lungs',
        desc: 'Bronchial tree ending in 300 million alveoli, executing passive diffusion of O2 into blood and CO2 elimination.',
        icon: '🫁',
        color: '#74B9FF',
        sound: 'lung'
      },
      liver: {
        id: 'liver',
        name: 'Liver (Hepatic Lobes)',
        cavity: 'Right Upper Abdominal',
        slot: 'slot_liver',
        desc: 'Largest metabolic organ; synthesizes bile salts for lipid digestion, stores glycogen, and detoxifies xenobiotics.',
        icon: '🤎',
        color: '#C67D5A',
        sound: 'click'
      },
      stomach: {
        id: 'stomach',
        name: 'Stomach (Gastric Chamber)',
        cavity: 'Left Upper Abdominal',
        slot: 'slot_stomach',
        desc: 'Rugae-lined muscular pouch secreting HCl (pH 1.5 - 2.0) and pepsinogen to digest protein into acidic chyme.',
        icon: '🥣',
        color: '#FFE28A',
        sound: 'click'
      },
      kidneys: {
        id: 'kidneys',
        name: 'Kidneys (Renal Cortex & Medulla)',
        cavity: 'Retroperitoneal Abdominal',
        slot: 'slot_kidneys',
        desc: 'Contains 2 million nephrons filtering 180 liters of blood plasma daily to maintain fluid balance and excrete urea.',
        icon: '🫘',
        color: '#A06CD5',
        sound: 'click'
      },
      intestines: {
        id: 'intestines',
        name: 'Small & Large Intestines',
        cavity: 'Lower Abdominal & Pelvic',
        slot: 'slot_intestines',
        desc: 'Duodenum, jejunum, and ileum absorb amino acids and glucose via villi; colon reclaims water and electrolytes.',
        icon: '🥨',
        color: '#61C9A8',
        sound: 'click'
      }
    };

    this.levelObjectives = {
      1: {
        title: "Level 1: The Vital Core",
        targetOrgans: ['brain', 'heart', 'lungs'],
        instruction: "Position the Brain in the cranial skull, then dock Heart and Lungs inside the protective ribcage."
      },
      2: {
        title: "Level 2: Digestive & Metabolic Core",
        targetOrgans: ['liver', 'stomach', 'intestines'],
        instruction: "Position the Liver, Stomach, and Intestines inside the peritoneal abdominal cavity."
      },
      3: {
        title: "Level 3: Full Anatomy Integration",
        targetOrgans: ['brain', 'heart', 'lungs', 'liver', 'stomach', 'kidneys', 'intestines'],
        instruction: "Assemble all 7 primary human internal organs in sequence to awaken the living physiological system!"
      }
    };
  }

  init(level = 1, isDemo = false) {
    this.level = level;
    this.score = 0;
    this.selectedOrgan = null;
    this.placedOrgans = new Set();
    this.render();

    if (isDemo) {
      this.launchTutorial();
    }
  }

  render() {
    const curObj = this.levelObjectives[this.level];
    this.container.innerHTML = `
      <div class="anatomy-layout" style="display: grid; grid-template-columns: 290px 1fr 330px; height: 100%; min-height: 560px; position: relative;">
        <!-- Left: Organ Tray / Palette -->
        <div class="anatomy-tray" style="background: #FFFFFF; border-right: 1.5px solid var(--border-light); padding: 22px; display: flex; flex-direction: column;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">Available Organs</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 16px;">Select an organ card, then click its corresponding cavity on the body silhouette.</p>

          <div class="organ-items-grid" id="organTrayList" style="display: flex; flex-direction: column; gap: 10px; overflow-y: auto; flex: 1;">
            ${curObj.targetOrgans.map(id => {
              const organ = this.organsData[id];
              return `
                <div class="organ-drag-card" id="card_${id}" draggable="true" data-organ="${id}" style="display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--bg-surface-alt); border: 2px dashed var(--border-light); border-radius: var(--radius-md); cursor: pointer; transition: all 0.25s; user-select: none;">
                  <span style="font-size: 1.8rem;">${organ.icon}</span>
                  <div>
                    <h5 style="font-size: 0.88rem; font-weight: 800; color: var(--text-main);">${organ.name}</h5>
                    <span style="font-size: 0.72rem; color: var(--primary); font-weight: 700;">Target: ${organ.cavity}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Center: Interactive Human Body Anatomy Silhouette -->
        <div class="anatomy-body-viewport" style="display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; background: radial-gradient(circle, #FAFCFF 0%, #EEF4FD 100%); padding: 16px;">
          <div style="position: relative; width: 440px; height: 500px; background: #FFFFFF; border-radius: var(--radius-xl); border: 1.5px solid var(--border-light); box-shadow: var(--shadow-sm); overflow: hidden;">
            
            <!-- Anatomical Silhouette SVG -->
            <svg viewBox="0 0 440 500" style="position: absolute; width: 100%; height: 100%; pointer-events: none;">
              <!-- Skull Cranium -->
              <ellipse cx="220" cy="55" rx="44" ry="52" fill="#E8F1FC" stroke="#CFDCED" stroke-width="2.5"/>
              <ellipse cx="220" cy="55" rx="36" ry="42" fill="none" stroke="#DCE8F7" stroke-width="1.5" stroke-dasharray="4,4"/>
              
              <!-- Neck & Clavicle line -->
              <rect x="205" y="98" width="30" height="22" fill="#E8F1FC" stroke="#CFDCED" stroke-width="2"/>
              <path d="M 160 118 Q 220 128 280 118" stroke="#B4C4D8" stroke-width="2" fill="none"/>

              <!-- Torso Body -->
              <path d="M 140 120 Q 220 105 300 120 Q 310 230 290 360 Q 220 380 150 360 Q 130 230 140 120 Z" fill="#EEF4FC" stroke="#CFDCED" stroke-width="2.5"/>
              
              <!-- Translucent Ribcage outlines -->
              <path d="M 160 145 Q 220 160 280 145" stroke="#D3E2F4" stroke-width="3" fill="none"/>
              <path d="M 155 170 Q 220 185 285 170" stroke="#D3E2F4" stroke-width="3" fill="none"/>
              <path d="M 155 195 Q 220 210 285 195" stroke="#D3E2F4" stroke-width="3" fill="none"/>
              <path d="M 160 220 Q 220 235 280 220" stroke="#D3E2F4" stroke-width="3" fill="none"/>

              <!-- Sternum bone center -->
              <line x1="220" y1="130" x2="220" y2="225" stroke="#C5D9F2" stroke-width="4" stroke-linecap="round"/>

              <!-- Pelvic Pelvis hints -->
              <path d="M 155 350 Q 220 375 285 350" stroke="#B4C4D8" stroke-width="3" fill="none"/>
            </svg>

            <!-- Target Anatomical Slots -->
            <div id="slotsContainer" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;">
              <!-- Slot Head (Brain) -->
              <div class="anatomy-slot" id="slot_head" data-slot="brain" style="position: absolute; top: 22px; left: 185px; width: 70px; height: 65px; border-radius: 50%; border: 2.5px dashed #B4C4D8; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800; color: #9EA8BA; cursor: pointer; transition: all 0.25s; background: rgba(255,255,255,0.6);">
                Cranial
              </div>

              <!-- Slot Lungs -->
              <div class="anatomy-slot" id="slot_lungs" data-slot="lungs" style="position: absolute; top: 130px; left: 160px; width: 120px; height: 75px; border-radius: var(--radius-md); border: 2.5px dashed #B4C4D8; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800; color: #9EA8BA; cursor: pointer; transition: all 0.25s; background: rgba(255,255,255,0.5);">
                Pleural Cavity
              </div>

              <!-- Slot Heart -->
              <div class="anatomy-slot" id="slot_heart" data-slot="heart" style="position: absolute; top: 142px; left: 195px; width: 50px; height: 50px; border-radius: 50%; border: 2.5px dashed #B4C4D8; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800; color: #9EA8BA; cursor: pointer; z-index: 5; background: rgba(255,255,255,0.7); transition: all 0.25s;">
                Heart
              </div>

              <!-- Slot Liver -->
              <div class="anatomy-slot" id="slot_liver" data-slot="liver" style="position: absolute; top: 215px; left: 162px; width: 58px; height: 46px; border-radius: var(--radius-sm); border: 2.5px dashed #B4C4D8; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800; color: #9EA8BA; cursor: pointer; transition: all 0.25s; background: rgba(255,255,255,0.5);">
                Liver
              </div>

              <!-- Slot Stomach -->
              <div class="anatomy-slot" id="slot_stomach" data-slot="stomach" style="position: absolute; top: 215px; left: 226px; width: 54px; height: 46px; border-radius: var(--radius-sm); border: 2.5px dashed #B4C4D8; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800; color: #9EA8BA; cursor: pointer; transition: all 0.25s; background: rgba(255,255,255,0.5);">
                Stomach
              </div>

              <!-- Slot Kidneys -->
              <div class="anatomy-slot" id="slot_kidneys" data-slot="kidneys" style="position: absolute; top: 268px; left: 172px; width: 96px; height: 38px; border-radius: var(--radius-sm); border: 2.5px dashed #B4C4D8; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800; color: #9EA8BA; cursor: pointer; transition: all 0.25s; background: rgba(255,255,255,0.5);">
                Kidneys (Retroperitoneal)
              </div>

              <!-- Slot Intestines -->
              <div class="anatomy-slot" id="slot_intestines" data-slot="intestines" style="position: absolute; top: 312px; left: 176px; width: 88px; height: 66px; border-radius: var(--radius-md); border: 2.5px dashed #B4C4D8; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800; color: #9EA8BA; cursor: pointer; transition: all 0.25s; background: rgba(255,255,255,0.5);">
                Abdominal Intestines
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Organ Insight Card & Progress -->
        <div class="anatomy-insights" style="background: #FFFFFF; border-left: 1.5px solid var(--border-light); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; overflow-y: auto;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="badge badge-blue">Anatomy Mission</span>
              <span style="font-size: 0.85rem; font-weight: 800; color: var(--secondary);" id="anatomyCounter">0 / ${curObj.targetOrgans.length} Placed</span>
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">${curObj.title}</h4>
            <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 18px; line-height: 1.4;">${curObj.instruction}</p>

            <div id="organInfoCard" style="background: var(--bg-surface-soft); border-radius: var(--radius-md); border-left: 4px solid var(--secondary); padding: 16px; margin-bottom: 16px;">
              <span style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; color: var(--secondary);">Physiology Brief</span>
              <h5 id="anatomyDetailTitle" style="font-size: 0.98rem; font-weight: 800; color: var(--text-main); margin: 6px 0;">Select an organ to inspect</h5>
              <p id="anatomyDetailDesc" style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.45;">Proper organ placement allows biological systems (nervous, respiratory, circulatory, digestive) to synchronize metabolic functions.</p>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 800; margin-bottom: 6px;">
              <span>System Completion</span>
              <span id="anatomyPercent" style="color: var(--secondary);">0%</span>
            </div>
            <div style="width: 100%; height: 10px; background: var(--bg-surface-soft); border-radius: 99px; overflow: hidden; border: 1px solid var(--border-light);">
              <div id="anatomyFill" style="width: 0%; height: 100%; background: linear-gradient(90deg, var(--secondary) 0%, var(--primary) 100%); transition: width 0.4s ease;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const curObj = this.levelObjectives[this.level];

    // Card selections
    const cards = this.container.querySelectorAll('.organ-drag-card');
    cards.forEach(card => {
      card.onclick = () => {
        const organId = card.getAttribute('data-organ');
        this.selectOrgan(organId);
      };

      card.ondragstart = (e) => {
        const organId = card.getAttribute('data-organ');
        this.selectOrgan(organId);
        e.dataTransfer.setData('text/plain', organId);
      };
    });

    const slots = this.container.querySelectorAll('.anatomy-slot');
    slots.forEach(slot => {
      slot.onclick = () => {
        const targetSlot = slot.getAttribute('data-slot');
        if (this.selectedOrgan) {
          this.attemptPlacement(this.selectedOrgan, targetSlot);
        } else {
          slot.style.borderColor = '#FFB89B';
          setTimeout(() => slot.style.borderColor = '#B4C4D8', 400);
        }
      };

      slot.ondragover = (e) => {
        e.preventDefault();
        slot.style.borderColor = 'var(--primary)';
        slot.style.background = 'rgba(97, 201, 168, 0.2)';
      };

      slot.ondragleave = () => {
        slot.style.borderColor = '#B4C4D8';
        slot.style.background = 'rgba(255,255,255,0.5)';
      };

      slot.ondrop = (e) => {
        e.preventDefault();
        slot.style.borderColor = '#B4C4D8';
        slot.style.background = 'rgba(255,255,255,0.5)';
        const organId = e.dataTransfer.getData('text/plain') || this.selectedOrgan;
        const targetSlot = slot.getAttribute('data-slot');
        this.attemptPlacement(organId, targetSlot);
      };
    });
  }

  selectOrgan(organId) {
    if (this.placedOrgans.has(organId)) return;
    this.selectedOrgan = organId;
    const organ = this.organsData[organId];

    this.container.querySelectorAll('.organ-drag-card').forEach(c => {
      const isSelected = c.getAttribute('data-organ') === organId;
      c.style.borderColor = isSelected ? 'var(--primary)' : 'var(--border-light)';
      c.style.background = isSelected ? 'var(--primary-light)' : 'var(--bg-surface-alt)';
      c.style.transform = isSelected ? 'scale(1.03)' : 'scale(1)';
    });

    const titleEl = document.getElementById('anatomyDetailTitle');
    const descEl = document.getElementById('anatomyDetailDesc');
    if (titleEl && descEl && organ) {
      titleEl.innerHTML = `${organ.icon} ${organ.name} <span style="font-size: 0.72rem; color: var(--secondary); font-weight: 800;">(${organ.cavity})</span>`;
      descEl.textContent = organ.desc;
    }

    if (window.soundEngine) window.soundEngine.playClick();
  }

  attemptPlacement(organId, targetSlot) {
    if (!organId || this.placedOrgans.has(organId)) return;
    const curObj = this.levelObjectives[this.level];
    const organ = this.organsData[organId];

    if (organId === targetSlot) {
      // Correct Docking!
      this.placedOrgans.add(organId);
      this.score += 35;
      if (window.soundEngine) window.soundEngine.playCorrect();

      // Update Slot with Animated Physiological Icons
      const slotEl = this.container.querySelector(`.anatomy-slot[data-slot="${targetSlot}"]`);
      if (slotEl) {
        slotEl.style.border = '2.5px solid var(--primary)';
        slotEl.style.background = 'rgba(97, 201, 168, 0.25)';
        slotEl.style.boxShadow = '0 0 16px rgba(97, 201, 168, 0.5)';

        let extraClass = '';
        if (organId === 'heart') extraClass = 'animate-heartbeat';
        if (organId === 'lungs') extraClass = 'animate-breathe';
        if (organId === 'brain') extraClass = 'animate-brainpulse';

        slotEl.innerHTML = `<span style="font-size: 2rem;" class="${extraClass}">${organ.icon}</span>`;
      }

      // Hide / strike card in tray
      const cardEl = document.getElementById(`card_${organId}`);
      if (cardEl) {
        cardEl.style.opacity = '0.45';
        cardEl.style.pointerEvents = 'none';
        cardEl.style.borderColor = 'var(--primary)';
        cardEl.style.background = 'var(--bg-surface-alt)';
        cardEl.querySelector('span:last-child').textContent = '✓ Docked in Cavity';
        cardEl.querySelector('span:last-child').style.color = 'var(--primary)';
      }

      this.selectedOrgan = null;

      // Update progress
      const targetCount = curObj.targetOrgans.length;
      const count = this.placedOrgans.size;
      const percent = Math.round((count / targetCount) * 100);

      document.getElementById('anatomyCounter').textContent = `${count} / ${targetCount} Placed`;
      document.getElementById('anatomyPercent').textContent = `${percent}%`;
      document.getElementById('anatomyFill').style.width = `${percent}%`;

      if (count >= targetCount) {
        setTimeout(() => this.completeLevel(), 600);
      }
    } else {
      // Incorrect Placement
      if (window.soundEngine) window.soundEngine.playWrong();
      const slotEl = this.container.querySelector(`.anatomy-slot[data-slot="${targetSlot}"]`);
      if (slotEl) {
        slotEl.style.borderColor = '#FF8A80';
        slotEl.style.background = '#FFEAEA';
        setTimeout(() => {
          slotEl.style.borderColor = '#B4C4D8';
          slotEl.style.background = 'rgba(255,255,255,0.5)';
        }, 500);
      }

      const descEl = document.getElementById('anatomyDetailDesc');
      if (descEl) {
        descEl.innerHTML = `<span style="color: #C62828; font-weight: 800;">Anatomical Cavity Mismatch:</span> ${organ.name} belongs strictly in the <strong>${organ.cavity}</strong>!`;
      }
    }
  }

  completeLevel() {
    if (window.soundEngine) window.soundEngine.playFanfare();
    if (window.triggerConfetti) window.triggerConfetti();

    const stars = 3;
    if (window.stateManager) {
      window.stateManager.recordGameCompletion('body_builder', this.level, this.score, stars);
    }

    if (window.showGameCompletionModal) {
      window.showGameCompletionModal({
        gameId: 'body_builder',
        gameTitle: 'Body Builder Challenge',
        level: this.level,
        score: this.score,
        stars: stars,
        learningTakeaway: "Body cavities isolate and protect delicate internal organs: the cranial cavity encloses the brain, the pleural/pericardial thoracic cavity protects lungs and heart, and the peritoneal cavity houses digestion.",
        onReplay: () => this.init(this.level),
        onNext: this.level < 3 ? () => this.init(this.level + 1) : null
      });
    }
  }

  // Interactive Guided Tutorial
  launchTutorial() {
    const steps = [
      {
        title: "Welcome to Body Builder",
        instruction: "Assemble the vital human organs into their anatomical positions. First, select the Brain card from the tray.",
        target: '#card_brain',
        feedback: "Great! The Brain is the command center of the central nervous system.",
        onAction: () => {
          this.selectOrgan('brain');
        }
      },
      {
        title: "Place Brain in Cranial Cavity",
        instruction: "Now click on the Cranial Cavity slot at the top of the body silhouette.",
        target: '#slot_head',
        feedback: "Correct! The skull protects the brain.",
        onAction: () => {
          this.attemptPlacement('brain', 'brain');
        }
      },
      {
        title: "Select the Heart",
        instruction: "Click on the Heart card to prepare it for thoracic docking.",
        target: '#card_heart',
        feedback: "Selected! The Heart pumps blood via the systemic circuit.",
        onAction: () => {
          this.selectOrgan('heart');
        }
      },
      {
        title: "Position the Heart",
        instruction: "Click on the Heart slot inside the chest area.",
        target: '#slot_heart',
        feedback: "Perfect! Heart docked securely and beating at 72 BPM.",
        onAction: () => {
          this.attemptPlacement('heart', 'heart');
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

window.BodyBuilderGame = BodyBuilderGame;
