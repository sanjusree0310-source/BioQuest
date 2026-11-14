/* ============================================================
   BIOQUEST - Game 7: Microbe Detective (Enhanced Edition)
   Category: Microbiology | Virtual Microscope Forensic Lab & Differential Staining
   ============================================================ */

class MicrobeDetectiveGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.level = 1;
    this.score = 0;
    this.focus = 35; // 0 to 100 (crisp at 75-85)
    this.zoom = '400x';
    this.stainApplied = null;
    this.tutorialEngine = null;

    this.cases = {
      1: {
        id: 1,
        caseNo: "CASE #101: POND WATER ECOSYSTEM",
        sampleSource: "Stagnant Freshwater Pond Culture",
        correctId: "paramecium",
        expectedStain: "none",
        clues: [
          "Single-celled eukaryotic protozoan measuring ~180-250 μm in length",
          "Propels rapidly via rhythmic metachronal waves of thousands of hair-like pellicle cilia",
          "Contains distinct anterior and posterior contractile vacuoles for active osmoregulation"
        ],
        suspects: [
          { id: 'paramecium', name: 'Paramecium caudatum', type: 'Ciliated Protozoan', icon: '🥿', correct: true },
          { id: 'amoeba', name: 'Amoeba proteus', type: 'Pseudopod Protozoan', icon: '🫧', correct: false },
          { id: 'spirillum', name: 'Spirillum volutans', type: 'Spiral Bacterium', icon: '➰', correct: false }
        ]
      },
      2: {
        id: 2,
        caseNo: "CASE #102: CLINICAL ISOLATE CULTURE",
        sampleSource: "Patient Gastrointestinal Biopsy",
        correctId: "ecoli",
        expectedStain: "gram",
        clues: [
          "Gram-negative rod-shaped bacillus appearing pink under safranin counterstain",
          "Facultative anaerobe equipped with peritrichous flagella conferring tumbling motility",
          "Ferments lactose with gas production on MacConkey agar"
        ],
        suspects: [
          { id: 'ecoli', name: 'Escherichia coli (O157:H7)', type: 'Gram-negative Bacillus', icon: '💊', correct: true },
          { id: 'streptococcus', name: 'Streptococcus pneumoniae', type: 'Gram-positive Cocci', icon: '📿', correct: false },
          { id: 'bacteriophage', name: 'T4 Enterobacteria Phage', type: 'Myoviridae Virus', icon: '🤖', correct: false }
        ]
      },
      3: {
        id: 3,
        caseNo: "CASE #103: BIOETHANOL FERMENTER",
        sampleSource: "Industrial Brewing & Baking Vat",
        correctId: "yeast",
        expectedStain: "methylene",
        clues: [
          "Single-celled fungal ascomycete eukaryote with rigid chitinous cell wall",
          "Asexual reproduction through asymmetrical budding forming characteristic bud scars",
          "Converts simple hexose sugars into ethanol and carbon dioxide via alcoholic fermentation"
        ],
        suspects: [
          { id: 'yeast', name: 'Saccharomyces cerevisiae', type: 'Budding Yeast Fungus', icon: '🍞', correct: true },
          { id: 'penicillium', name: 'Penicillium chrysogenum', type: 'Filamentous Ascomycete', icon: '🌿', correct: false },
          { id: 'bacillus', name: 'Bacillus subtilis', type: 'Endospore Rod', icon: '🥢', correct: false }
        ]
      }
    };
  }

  init(level = 1, isDemo = false) {
    this.level = level;
    this.score = 0;
    this.focus = 35;
    this.zoom = '400x';
    this.stainApplied = null;
    this.render();

    if (isDemo) {
      this.launchTutorial();
    }
  }

  render() {
    const curCase = this.cases[this.level];
    this.container.innerHTML = `
      <div class="microbe-layout" style="display: grid; grid-template-columns: 1fr 360px; height: 100%; min-height: 560px; position: relative;">
        <!-- Left: Virtual Microscope Eyepiece Viewport -->
        <div class="microscope-viewport" style="background: radial-gradient(circle, #F8FAFD 0%, #EBF3FC 100%); padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: space-between;">
          
          <!-- Case Identifier Pill -->
          <div style="background: #FFFFFF; border: 1.5px solid var(--border-light); border-radius: var(--radius-full); padding: 8px 24px; box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 14px;">
            <span class="badge badge-lavender">${curCase.caseNo}</span>
            <span style="font-size: 0.85rem; font-weight: 800; color: var(--text-main);">Sample: ${curCase.sampleSource}</span>
          </div>

          <!-- Circular Eyepiece Field of View -->
          <div id="microscopeLens" style="position: relative; width: 330px; height: 330px; border-radius: 50%; background: #FFFFFF; border: 10px solid #26334A; box-shadow: 0 16px 45px rgba(38, 51, 74, 0.25); overflow: hidden; display: flex; align-items: center; justify-content: center;">
            
            <!-- Specimen Graphic with dynamic blur filter based on focus knob -->
            <div id="specimenTarget" style="display: flex; flex-direction: column; align-items: center; justify-content: center; transition: filter 0.2s; filter: blur(6px); user-select: none;">
              <span id="specimenIcon" style="font-size: 5.5rem;">${curCase.id === 1 ? '🥿' : (curCase.id === 2 ? '💊' : '🍞')}</span>
              <span id="stainLabel" style="font-size: 0.76rem; font-weight: 800; color: var(--primary); background: rgba(255,255,255,0.85); padding: 2px 10px; border-radius: 99px;">Unidentified Microbe</span>
            </div>

            <!-- Optical Reticle Crosshairs & Scale Bar -->
            <div style="position: absolute; width: 100%; height: 1px; background: rgba(38, 51, 74, 0.2); pointer-events: none;"></div>
            <div style="position: absolute; height: 100%; width: 1px; background: rgba(38, 51, 74, 0.2); pointer-events: none;"></div>
            
            <!-- Scale Bar Overlay -->
            <div style="position: absolute; bottom: 20px; right: 28px; background: rgba(255,255,255,0.85); padding: 2px 8px; border-radius: 4px; font-size: 0.65rem; font-weight: 800; color: #26334A; border: 1px solid var(--border-light);">
              ⎯⎯ 50 μm
            </div>
          </div>

          <!-- Microscope Controls: Objective Turret & Fine Focus Slider -->
          <div style="background: #FFFFFF; border-radius: var(--radius-xl); border: 1.5px solid var(--border-light); padding: 16px 24px; width: 100%; max-width: 560px; display: flex; align-items: center; justify-content: space-between; gap: 20px; box-shadow: var(--shadow-sm);">
            
            <!-- Magnification Lens Selector -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.78rem; font-weight: 800; color: var(--text-muted);">Lens:</span>
              <button class="btn btn-sm btn-outline mag-btn" data-mag="100x">100x</button>
              <button class="btn btn-sm btn-primary mag-btn" data-mag="400x">400x</button>
              <button class="btn btn-sm btn-outline mag-btn" data-mag="1000x">1000x Oil</button>
            </div>

            <!-- Fine Focus Knob Slider -->
            <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
              <span style="font-size: 0.78rem; font-weight: 800; color: var(--text-muted);">Focus:</span>
              <input type="range" id="focusSlider" min="0" max="100" value="${this.focus}" style="flex: 1; accent-color: var(--primary);">
              <span id="focusQualityBadge" style="font-size: 0.74rem; font-weight: 800; color: #E57373;">Blurry</span>
            </div>
          </div>
        </div>

        <!-- Right: Case Clues & Suspect Identification Drawer -->
        <div class="microbe-drawer" style="background: #FFFFFF; border-left: 1.5px solid var(--border-light); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; overflow-y: auto;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="badge badge-mint">Microbial Clues</span>
              <span style="font-size: 0.85rem; font-weight: 800; color: var(--primary);">Lab Active</span>
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">Forensic Observations</h4>

            <!-- Clues list -->
            <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px;">
              ${curCase.clues.map((clue, idx) => `
                <div style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.82rem; color: var(--text-main); line-height: 1.4; background: var(--bg-surface-soft); padding: 8px 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--secondary);">
                  <span style="color: var(--secondary); font-weight: 800;">${idx + 1}.</span>
                  <span>${clue}</span>
                </div>
              `).join('')}
            </div>

            <!-- Suspect Line-up -->
            <h5 style="font-size: 0.88rem; font-weight: 800; color: var(--text-main); margin-bottom: 10px;">Select Identified Microorganism:</h5>
            <div style="display: flex; flex-direction: column; gap: 8px;" id="suspectsList">
              ${curCase.suspects.map(s => `
                <button class="suspect-choice-card" id="suspect_${s.id}" data-id="${s.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border-radius: var(--radius-md); background: #FFFFFF; border: 1.5px solid var(--border-light); cursor: pointer; transition: all 0.2s; text-align: left;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.6rem;">${s.icon}</span>
                    <div>
                      <h6 style="font-size: 0.88rem; font-weight: 800; color: var(--text-main);">${s.name}</h6>
                      <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">${s.type}</span>
                    </div>
                  </div>
                  <span style="font-size: 0.85rem; color: var(--primary); font-weight: 800;">ID ➔</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div style="margin-top: 16px;">
            <div id="verdictFeedback" style="padding: 10px 14px; border-radius: var(--radius-md); font-size: 0.84rem; font-weight: 700; display: none;"></div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const slider = document.getElementById('focusSlider');
    if (slider) {
      slider.oninput = (e) => {
        this.focus = parseInt(e.target.value);
        this.updateFocusVisuals();
      };
    }

    this.container.querySelectorAll('.mag-btn').forEach(btn => {
      btn.onclick = () => {
        this.zoom = btn.getAttribute('data-mag');
        this.container.querySelectorAll('.mag-btn').forEach(b => {
          b.className = 'btn btn-sm btn-outline mag-btn';
        });
        btn.className = 'btn btn-sm btn-primary mag-btn';
        if (window.soundEngine) window.soundEngine.playClick();
      };
    });

    this.container.querySelectorAll('.suspect-choice-card').forEach(card => {
      card.onclick = () => {
        const suspectId = card.getAttribute('data-id');
        this.submitIdentification(suspectId);
      };
    });

    this.updateFocusVisuals();
  }

  updateFocusVisuals() {
    const specimen = document.getElementById('specimenTarget');
    const badge = document.getElementById('focusQualityBadge');
    if (!specimen || !badge) return;

    // Ideal focus is around 80
    const diff = Math.abs(this.focus - 80);
    const blurPx = Math.max(0, (diff / 6)).toFixed(1);

    specimen.style.filter = `blur(${blurPx}px)`;

    if (diff <= 8) {
      badge.textContent = "Crisp Focus ✨";
      badge.style.color = 'var(--primary)';
    } else if (diff <= 20) {
      badge.textContent = "Near Focus";
      badge.style.color = '#FFA000';
    } else {
      badge.textContent = "Blurry";
      badge.style.color = '#E57373';
    }
  }

  submitIdentification(suspectId) {
    const curCase = this.cases[this.level];
    const feedbackBox = document.getElementById('verdictFeedback');

    if (suspectId === curCase.correctId) {
      // Solved
      this.score += 40;
      if (window.soundEngine) window.soundEngine.playCorrect();

      const card = document.getElementById(`suspect_${suspectId}`);
      if (card) {
        card.style.background = 'var(--primary-light)';
        card.style.borderColor = 'var(--primary)';
        card.querySelector('span:last-child').textContent = '✓ Correct ID';
        card.querySelector('span:last-child').style.color = 'var(--primary)';
      }

      if (feedbackBox) {
        feedbackBox.style.display = 'block';
        feedbackBox.style.background = 'var(--primary-light)';
        feedbackBox.style.color = '#1F7C5F';
        feedbackBox.textContent = `Case Solved! Correctly identified ${curCase.suspects.find(s => s.id === suspectId).name}.`;
      }

      setTimeout(() => this.completeLevel(), 600);
    } else {
      // Wrong ID
      if (window.soundEngine) window.soundEngine.playWrong();
      const card = document.getElementById(`suspect_${suspectId}`);
      if (card) {
        card.style.background = '#FFF1F0';
        card.style.borderColor = '#FFA59B';
        setTimeout(() => {
          card.style.background = '#FFFFFF';
          card.style.borderColor = 'var(--border-light)';
        }, 500);
      }

      if (feedbackBox) {
        feedbackBox.style.display = 'block';
        feedbackBox.style.background = '#FFF1F0';
        feedbackBox.style.color = '#C62828';
        feedbackBox.textContent = "Morphological mismatch! Review the clues and check the focus.";
      }
    }
  }

  completeLevel() {
    if (window.soundEngine) window.soundEngine.playFanfare();
    if (window.triggerConfetti) window.triggerConfetti();

    const stars = 3;
    if (window.stateManager) {
      window.stateManager.recordGameCompletion('microbe_detective', this.level, this.score, stars);
    }

    if (window.showGameCompletionModal) {
      window.showGameCompletionModal({
        gameId: 'microbe_detective',
        gameTitle: 'Microbe Detective',
        level: this.level,
        score: this.score,
        stars: stars,
        learningTakeaway: "Microbial identification utilizes morphological criteria (shape, dimensions, motility via cilia/flagella) coupled with optical light microscopy resolving cellular organelles.",
        onReplay: () => this.init(this.level),
        onNext: this.level < 3 ? () => this.init(this.level + 1) : null
      });
    }
  }

  // Interactive Guided Tutorial
  launchTutorial() {
    const steps = [
      {
        title: "Welcome to Microbe Detective",
        instruction: "Inspect the virtual microscope ocular. Drag the Focus Slider to 80 to bring the specimen into sharp focus.",
        target: '#focusSlider',
        feedback: "Crisp focus achieved! Cell cilia and vacuoles are now visible.",
        onAction: () => {
          this.focus = 80;
          const s = document.getElementById('focusSlider');
          if (s) s.value = 80;
          this.updateFocusVisuals();
        }
      },
      {
        title: "Identify Paramecium",
        instruction: "Notice the hair-like cilia propelling the organism. Select Paramecium caudatum from the suspect line-up!",
        target: '#suspect_paramecium',
        feedback: "Case Solved! Paramecium caudatum verified.",
        onAction: () => {
          this.submitIdentification('paramecium');
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

window.MicrobeDetectiveGame = MicrobeDetectiveGame;
