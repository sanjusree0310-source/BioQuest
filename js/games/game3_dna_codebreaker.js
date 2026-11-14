/* ============================================================
   BIOQUEST - Game 3: DNA Code Breaker (Enhanced Edition)
   Category: Genetics | Complementary Base Pairing, Codons & Mutation Repair
   ============================================================ */

class DNACodeBreakerGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.level = 1;
    this.score = 0;
    this.activeSlotIdx = null;
    this.sequence = [];
    this.tutorialEngine = null;

    this.bases = {
      A: { code: 'A', name: 'Adenine', pair: 'T', color: '#61C9A8', bonds: 2, ring: 'Purine (2 Rings)', desc: 'Purine base pairing strictly with Thymine via 2 hydrogen bonds.' },
      T: { code: 'T', name: 'Thymine', pair: 'A', color: '#74B9FF', bonds: 2, ring: 'Pyrimidine (1 Ring)', desc: 'Pyrimidine base pairing strictly with Adenine via 2 hydrogen bonds.' },
      G: { code: 'G', name: 'Guanine', pair: 'C', color: '#B49AFF', bonds: 3, ring: 'Purine (2 Rings)', desc: 'Purine base pairing strictly with Cytosine via 3 hydrogen bonds.' },
      C: { code: 'C', name: 'Cytosine', pair: 'G', color: '#FFB89B', bonds: 3, ring: 'Pyrimidine (1 Ring)', desc: 'Pyrimidine base pairing strictly with Guanine via 3 hydrogen bonds.' }
    };

    this.codonMap = {
      "AUG": "Met (Start)",
      "UUU": "Phe", "UUC": "Phe",
      "UUA": "Leu", "UUG": "Leu",
      "GGC": "Gly", "GGA": "Gly",
      "AAA": "Lys", "AAG": "Lys",
      "CCU": "Pro", "CCC": "Pro",
      "UAA": "Stop", "UAG": "Stop"
    };

    this.levelConfigs = {
      1: {
        title: "Level 1: Base Pairing Fundamentals",
        length: 6,
        missingCount: 3,
        instruction: "Match complementary bases: Adenine (A) = Thymine (T) [2 H-Bonds]; Guanine (G) ≡ Cytosine (C) [3 H-Bonds]."
      },
      2: {
        title: "Level 2: Codon Translation Sequencing",
        length: 9,
        missingCount: 5,
        instruction: "Complete 3 genetic codons and observe real-time translation into polypeptide amino acids!"
      },
      3: {
        title: "Level 3: Genetic Mutation Excision Repair",
        length: 12,
        missingCount: 7,
        instruction: "Repair damaged genomic DNA strand segments across 12 base pairs before replication fork collapse!"
      }
    };
  }

  init(level = 1, isDemo = false) {
    this.level = level;
    this.score = 0;
    this.generateSequence();
    this.render();

    if (isDemo) {
      this.launchTutorial();
    }
  }

  generateSequence() {
    const config = this.levelConfigs[this.level];
    const baseKeys = ['A', 'T', 'G', 'C'];
    this.sequence = [];

    for (let i = 0; i < config.length; i++) {
      const topBase = baseKeys[Math.floor(Math.random() * baseKeys.length)];
      const correctBottom = this.bases[topBase].pair;
      this.sequence.push({
        top: topBase,
        correctBottom: correctBottom,
        currentBottom: null,
        isMissing: false
      });
    }

    // Mark missing slots randomly
    const indices = Array.from({ length: config.length }, (_, i) => i);
    indices.sort(() => Math.random() - 0.5);
    for (let i = 0; i < config.missingCount; i++) {
      this.sequence[indices[i]].isMissing = true;
    }

    // Set first missing slot as active
    const firstMissing = this.sequence.findIndex(s => s.isMissing);
    this.activeSlotIdx = firstMissing !== -1 ? firstMissing : 0;
  }

  render() {
    const config = this.levelConfigs[this.level];
    this.container.innerHTML = `
      <div class="dna-game-layout" style="display: grid; grid-template-columns: 1fr 340px; height: 100%; min-height: 560px; position: relative;">
        <!-- Left: Double Helix Strand Sequence Viewer -->
        <div class="dna-viewport" style="background: radial-gradient(circle, #FAFCFF 0%, #F1F6FE 100%); padding: 32px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; position: relative;">
          
          <!-- Hydrogen Bond Rule Reminder Banner -->
          <div style="display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;">
            <div style="padding: 8px 18px; background: #FFFFFF; border-radius: var(--radius-full); border: 1.5px solid var(--border-light); font-size: 0.82rem; font-weight: 800; color: var(--text-main); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 8px;">
              <span>🧬</span> <span style="color: #61C9A8;">A</span> = <span style="color: #74B9FF;">T</span> (2 Hydrogen Bonds • Purine + Pyrimidine)
            </div>
            <div style="padding: 8px 18px; background: #FFFFFF; border-radius: var(--radius-full); border: 1.5px solid var(--border-light); font-size: 0.82rem; font-weight: 800; color: var(--text-main); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 8px;">
              <span>🧬</span> <span style="color: #B49AFF;">G</span> ≡ <span style="color: #FFB89B;">C</span> (3 Hydrogen Bonds • Purine + Pyrimidine)
            </div>
          </div>

          <!-- Interactive DNA Double Helix Ladder -->
          <div class="dna-ladder-scroll" style="width: 100%; max-width: 760px; overflow-x: auto; padding: 24px 0;">
            <div class="dna-ladder-track" style="display: flex; gap: 18px; align-items: center; justify-content: center;">
              ${this.sequence.map((item, idx) => {
                const topInfo = this.bases[item.top];
                const isSelected = this.activeSlotIdx === idx;
                const bottomFilled = item.currentBottom !== null;
                const bottomInfo = bottomFilled ? this.bases[item.currentBottom] : null;

                return `
                  <div class="dna-rungs-pair" data-idx="${idx}" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <!-- Codon Triplet Label above every 3rd base -->
                    <span style="font-size: 0.65rem; font-weight: 800; color: #9EA8BA;">${idx % 3 === 0 ? `Codon ${Math.floor(idx/3) + 1}` : ''}</span>

                    <!-- Top Strand Base (5' -> 3' Sense Strand) -->
                    <div class="dna-base-node" style="width: 52px; height: 52px; border-radius: 50%; background: ${topInfo.color}; color: #FFFFFF; font-weight: 800; font-size: 1.3rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.12);">
                      ${item.top}
                    </div>

                    <!-- Hydrogen Bonds Bridge Connector -->
                    <div class="h-bonds-bridge" style="display: flex; flex-direction: column; gap: 4px; height: 34px; justify-content: center;">
                      <div style="width: 22px; height: 2px; background: ${bottomFilled ? 'var(--primary)' : '#CFDCED'};"></div>
                      <div style="width: 22px; height: 2px; background: ${bottomFilled ? 'var(--primary)' : '#CFDCED'};"></div>
                      ${topInfo.bonds === 3 ? `<div style="width: 22px; height: 2px; background: ${bottomFilled ? 'var(--primary)' : '#CFDCED'};"></div>` : ''}
                    </div>

                    <!-- Bottom Strand Base Slot (3' -> 5' Antisense Strand) -->
                    <div class="dna-base-slot ${isSelected ? 'active-slot' : ''}" id="dna_slot_${idx}" data-idx="${idx}" style="width: 52px; height: 52px; border-radius: 50%; ${item.isMissing && !bottomFilled ? 'border: 2.5px dashed var(--secondary); background: #FFFFFF;' : `background: ${bottomInfo ? bottomInfo.color : topInfo.color}; color: #FFFFFF;`} font-weight: 800; font-size: 1.3rem; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.25s; box-shadow: ${isSelected ? '0 0 0 4px rgba(116, 185, 255, 0.45)' : 'none'};">
                      ${bottomFilled ? item.currentBottom : (item.isMissing ? '?' : item.correctBottom)}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Base Selector Palette -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
            <span style="font-size: 0.84rem; font-weight: 800; color: var(--text-main);">Select Complementary Nucleotide Base:</span>
            <div style="display: flex; gap: 14px;">
              ${Object.values(this.bases).map(b => `
                <button class="btn-base-picker" id="btn_pick_${b.code}" data-base="${b.code}" style="width: 66px; height: 66px; border-radius: var(--radius-md); background: #FFFFFF; border: 2.5px solid ${b.color}; color: ${b.color}; font-size: 1.5rem; font-weight: 800; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; box-shadow: var(--shadow-sm);">
                  <span>${b.code}</span>
                  <span style="font-size: 0.62rem; font-weight: 800; color: var(--text-muted);">${b.name}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right: DNA Drawer Info -->
        <div class="dna-drawer" style="background: #FFFFFF; border-left: 1.5px solid var(--border-light); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; overflow-y: auto;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="badge badge-lavender">Genetics Decryption</span>
              <span style="font-size: 0.85rem; font-weight: 800; color: var(--accent-lavender);" id="dnaProgressCount">0 / ${config.missingCount} Matched</span>
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">${config.title}</h4>
            <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 18px; line-height: 1.4;">${config.instruction}</p>

            <div id="baseDetailBox" style="background: var(--bg-surface-soft); border-radius: var(--radius-md); border-left: 4px solid var(--accent-lavender); padding: 16px; margin-bottom: 16px;">
              <span style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; color: var(--accent-lavender);">Codon Telemetry</span>
              <h5 id="baseDetailTitle" style="font-size: 0.98rem; font-weight: 800; color: var(--text-main); margin: 6px 0;">Chargaff's Equivalence Rule</h5>
              <p id="baseDetailDesc" style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.45;">In double-stranded DNA, the ratio of purines (A+G) to pyrimidines (T+C) is strictly 1:1. Adenine forms 2 hydrogen bonds with Thymine; Guanine forms 3 with Cytosine.</p>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 800; margin-bottom: 6px;">
              <span>Double Helix Stability</span>
              <span id="helixPercent" style="color: var(--accent-lavender);">0%</span>
            </div>
            <div style="width: 100%; height: 10px; background: var(--bg-surface-soft); border-radius: 99px; overflow: hidden; border: 1px solid var(--border-light);">
              <div id="helixFill" style="width: 0%; height: 100%; background: linear-gradient(90deg, var(--accent-lavender) 0%, var(--primary) 100%); transition: width 0.4s ease;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    this.container.querySelectorAll('.dna-base-slot').forEach(slot => {
      slot.onclick = () => {
        const idx = parseInt(slot.getAttribute('data-idx'));
        if (this.sequence[idx].isMissing) {
          this.activeSlotIdx = idx;
          this.highlightActiveSlot();
          if (window.soundEngine) window.soundEngine.playClick();
        }
      };
    });

    this.container.querySelectorAll('.btn-base-picker').forEach(btn => {
      btn.onclick = () => {
        const base = btn.getAttribute('data-base');
        this.attemptMatch(base);
      };
    });

    this.highlightActiveSlot();
  }

  highlightActiveSlot() {
    this.container.querySelectorAll('.dna-base-slot').forEach(slot => {
      const idx = parseInt(slot.getAttribute('data-idx'));
      if (idx === this.activeSlotIdx) {
        slot.style.boxShadow = '0 0 0 4px rgba(116, 185, 255, 0.6)';
        slot.style.transform = 'scale(1.12)';
      } else {
        slot.style.boxShadow = 'none';
        slot.style.transform = 'scale(1)';
      }
    });

    if (this.activeSlotIdx !== null) {
      const target = this.sequence[this.activeSlotIdx];
      const topInfo = this.bases[target.top];
      const titleEl = document.getElementById('baseDetailTitle');
      const descEl = document.getElementById('baseDetailDesc');
      if (titleEl && descEl) {
        titleEl.textContent = `Target Strand: ${target.top} (${topInfo.name})`;
        descEl.textContent = `${topInfo.name} is a ${topInfo.ring}. Select the matching base to form ${topInfo.bonds} hydrogen bonds.`;
      }
    }
  }

  attemptMatch(chosenBase) {
    if (this.activeSlotIdx === null) return;
    const target = this.sequence[this.activeSlotIdx];

    if (chosenBase === target.correctBottom) {
      // Correct Match!
      target.currentBottom = chosenBase;
      target.isMissing = false;
      this.score += 30;
      if (window.soundEngine) window.soundEngine.playCorrect();

      // Update slot DOM
      const slotEl = document.getElementById(`dna_slot_${this.activeSlotIdx}`);
      const baseInfo = this.bases[chosenBase];
      if (slotEl) {
        slotEl.textContent = chosenBase;
        slotEl.style.background = baseInfo.color;
        slotEl.style.color = '#FFFFFF';
        slotEl.style.border = 'none';
        slotEl.style.boxShadow = `0 4px 14px ${baseInfo.color}88`;
      }

      // Next missing slot
      const nextMissing = this.sequence.findIndex(s => s.isMissing && s.currentBottom === null);
      this.activeSlotIdx = nextMissing !== -1 ? nextMissing : null;
      this.highlightActiveSlot();

      // Check progress
      const config = this.levelConfigs[this.level];
      const filledCount = this.sequence.filter(s => s.currentBottom !== null).length;
      const percent = Math.round((filledCount / config.missingCount) * 100);

      const countEl = document.getElementById('dnaProgressCount');
      const helixPercent = document.getElementById('helixPercent');
      const helixFill = document.getElementById('helixFill');
      if (countEl) countEl.textContent = `${filledCount} / ${config.missingCount} Matched`;
      if (helixPercent) helixPercent.textContent = `${percent}%`;
      if (helixFill) helixFill.style.width = `${percent}%`;

      if (filledCount >= config.missingCount) {
        setTimeout(() => this.completeLevel(), 500);
      }
    } else {
      // Wrong Base Mismatch
      if (window.soundEngine) window.soundEngine.playWrong();
      const slotEl = document.getElementById(`dna_slot_${this.activeSlotIdx}`);
      if (slotEl) {
        slotEl.style.borderColor = '#FF8A80';
        slotEl.style.background = '#FFEAEA';
        setTimeout(() => {
          slotEl.style.borderColor = 'var(--secondary)';
          slotEl.style.background = '#FFFFFF';
        }, 400);
      }
    }
  }

  completeLevel() {
    if (window.soundEngine) window.soundEngine.playFanfare();
    if (window.triggerConfetti) window.triggerConfetti();

    const stars = 3;
    if (window.stateManager) {
      window.stateManager.recordGameCompletion('dna_codebreaker', this.level, this.score, stars);
    }

    if (window.showGameCompletionModal) {
      window.showGameCompletionModal({
        gameId: 'dna_codebreaker',
        gameTitle: 'DNA Code Breaker',
        level: this.level,
        score: this.score,
        stars: stars,
        learningTakeaway: "Hydrogen bonding between complementary base pairs (A=T and G≡C) maintains the stable antiparallel double helix geometry essential for high-fidelity DNA replication.",
        onReplay: () => this.init(this.level),
        onNext: this.level < 3 ? () => this.init(this.level + 1) : null
      });
    }
  }

  // Interactive Guided Tutorial
  launchTutorial() {
    const steps = [
      {
        title: "Welcome to DNA Code Breaker",
        instruction: "Notice the DNA double helix rungs. Top strand bases must pair with their complementary partner below.",
        target: '#dna_slot_0',
        feedback: "Awesome! Slot selected.",
        onAction: () => {
          this.activeSlotIdx = 0;
          this.highlightActiveSlot();
        }
      },
      {
        title: "Identify Complementary Base",
        instruction: `Look at the top base (${this.sequence[0].top}). Click the corresponding complementary base below!`,
        target: `#btn_pick_${this.sequence[0].correctBottom}`,
        feedback: "Magnificent! A-T and G-C base pairing locks the double helix together.",
        onAction: () => {
          this.attemptMatch(this.sequence[0].correctBottom);
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

window.DNACodeBreakerGame = DNACodeBreakerGame;
