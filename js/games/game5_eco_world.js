/* ============================================================
   BIOQUEST - Game 5: Eco World – Save the Planet
   Category: Ecology | Interactive Ecosystem Builder & Food Webs
   ============================================================ */

class EcoWorldGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.level = 1;
    this.score = 0;
    this.slots = {
      producer: null,
      herbivore: null,
      carnivore: null,
      decomposer: null
    };
    this.env = { sun: 50, rain: 50, pollution: 10 };
    this.tutorialEngine = null;

    this.organisms = {
      grass: { id: 'grass', name: 'Prairie Grass', trophic: 'producer', icon: '🌾', desc: 'Primary producer converting solar irradiance into glucose via photosynthesis.' },
      tree: { id: 'tree', name: 'Oak Canopy', trophic: 'producer', icon: '🌳', desc: 'Forest producer sequestering carbon and providing habitat canopy.' },
      rabbit: { id: 'rabbit', name: 'Cottontail Herbivore', trophic: 'herbivore', icon: '🐇', desc: 'Primary consumer feeding exclusively on plant cellulose.' },
      deer: { id: 'deer', name: 'Whitetail Grazer', trophic: 'herbivore', icon: '🦌', desc: 'Herbivore consumer regulating plant community density.' },
      fox: { id: 'fox', name: 'Red Fox', trophic: 'carnivore', icon: '🦊', desc: 'Secondary consumer preying on small herbivores to prevent overgrazing.' },
      hawk: { id: 'hawk', name: 'Red-Tailed Hawk', trophic: 'carnivore', icon: '🦅', desc: 'Apex raptor maintaining population balance in the food web.' },
      fungi: { id: 'fungi', name: 'Mycelium Fungi', trophic: 'decomposer', icon: '🍄', desc: 'Recycles dead biomass into nitrogen and bioavailable phosphorus.' }
    };

    this.levelConfigs = {
      1: {
        title: "Level 1: 3-Tier Grassland Food Chain",
        required: ['producer', 'herbivore', 'carnivore'],
        instruction: "Establish a direct energy flow: Producer -> Primary Consumer (Herbivore) -> Secondary Consumer (Carnivore)."
      },
      2: {
        title: "Level 2: Closed-Loop Nutrient Cycling",
        required: ['producer', 'herbivore', 'carnivore', 'decomposer'],
        instruction: "Include Decomposers to recycle dead biomass back into the soil mineral pool."
      },
      3: {
        title: "Level 3: Ecological Equilibrium Under Stress",
        required: ['producer', 'herbivore', 'carnivore', 'decomposer'],
        instruction: "Tune environmental rainfall and sun levels to maintain biodiversity without collapse."
      }
    };
  }

  init(level = 1, isDemo = false) {
    this.level = level;
    this.score = 0;
    this.slots = { producer: null, herbivore: null, carnivore: null, decomposer: null };
    this.env = { sun: 50, rain: 50, pollution: 10 };
    this.render();

    if (isDemo) {
      this.launchTutorial();
    }
  }

  render() {
    const config = this.levelConfigs[this.level];
    this.container.innerHTML = `
      <div class="eco-layout" style="display: grid; grid-template-columns: 260px 1fr 300px; height: 100%; min-height: 540px; position: relative;">
        <!-- Left: Organisms Tray -->
        <div class="eco-tray" style="background: #FFFFFF; border-right: 1.5px solid var(--border-light); padding: 20px; display: flex; flex-direction: column;">
          <h4 style="font-size: 1rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">Available Species</h4>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 16px;">Click a species, then select its corresponding trophic level slot.</p>

          <div class="eco-species-list" style="display: flex; flex-direction: column; gap: 8px; overflow-y: auto; flex: 1;">
            ${Object.values(this.organisms).map(org => `
              <div class="eco-species-card" id="sp_${org.id}" data-id="${org.id}" data-trophic="${org.trophic}" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--bg-surface-alt); border: 1.5px solid var(--border-light); border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s;">
                <span style="font-size: 1.4rem;">${org.icon}</span>
                <div>
                  <h6 style="font-size: 0.85rem; font-weight: 800; color: var(--text-main);">${org.name}</h6>
                  <span style="font-size: 0.7rem; font-weight: 700; color: var(--primary);">${org.trophic.toUpperCase()}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Center: Interactive Food Web Pyramid -->
        <div class="eco-arena" style="background: radial-gradient(circle, #F4FAF7 0%, #EEF7F2 100%); padding: 28px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
          <!-- Trophic Slots -->
          <div class="trophic-pyramid" style="display: flex; flex-direction: column; align-items: center; gap: 14px; width: 100%; max-width: 480px;">
            <!-- Apex Slot -->
            <div class="trophic-tier-slot" id="slot_carnivore" data-trophic="carnivore" style="width: 220px; padding: 14px 20px; border-radius: var(--radius-lg); background: #FFFFFF; border: 2px dashed #B4C4D8; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: all 0.2s; box-shadow: var(--shadow-sm);">
              <span style="font-size: 1.4rem;" id="icon_carnivore">🦅</span>
              <div style="text-align: center;">
                <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-main);" id="label_carnivore">Secondary / Apex Predator</div>
                <span style="font-size: 0.68rem; color: var(--text-muted);">Trophic Level 3</span>
              </div>
            </div>

            <!-- Herbivore Slot -->
            <div class="trophic-tier-slot" id="slot_herbivore" data-trophic="herbivore" style="width: 320px; padding: 14px 20px; border-radius: var(--radius-lg); background: #FFFFFF; border: 2px dashed #B4C4D8; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: all 0.2s; box-shadow: var(--shadow-sm);">
              <span style="font-size: 1.4rem;" id="icon_herbivore">🐇</span>
              <div style="text-align: center;">
                <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-main);" id="label_herbivore">Primary Consumer (Herbivore)</div>
                <span style="font-size: 0.68rem; color: var(--text-muted);">Trophic Level 2 (10% Energy Transfer)</span>
              </div>
            </div>

            <!-- Producer Slot -->
            <div class="trophic-tier-slot" id="slot_producer" data-trophic="producer" style="width: 420px; padding: 14px 20px; border-radius: var(--radius-lg); background: #FFFFFF; border: 2px dashed #B4C4D8; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: all 0.2s; box-shadow: var(--shadow-sm);">
              <span style="font-size: 1.4rem;" id="icon_producer">🌱</span>
              <div style="text-align: center;">
                <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-main);" id="label_producer">Primary Producer (Autotroph)</div>
                <span style="font-size: 0.68rem; color: var(--text-muted);">Trophic Level 1 (100% Solar Energy Base)</span>
              </div>
            </div>

            <!-- Decomposer Slot -->
            ${config.required.includes('decomposer') ? `
              <div class="trophic-tier-slot" id="slot_decomposer" data-trophic="decomposer" style="width: 360px; padding: 12px 20px; border-radius: var(--radius-lg); background: #FAF7F2; border: 2px dashed #B4C4D8; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: all 0.2s; margin-top: 6px;">
                <span style="font-size: 1.4rem;" id="icon_decomposer">🍄</span>
                <div style="text-align: center;">
                  <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-main);" id="label_decomposer">Decomposer / Nutrient Recycler</div>
                  <span style="font-size: 0.68rem; color: var(--text-muted);">Mineral & Soil Bioremediation</span>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Environmental Controls (Level 3) -->
          ${this.level === 3 ? `
            <div style="margin-top: 24px; background: #FFFFFF; padding: 14px 20px; border-radius: var(--radius-md); border: 1px solid var(--border-light); width: 100%; max-width: 480px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.78rem; font-weight: 700;">Rainfall Index:</span>
              <input type="range" id="rainSlider" min="10" max="100" value="50" style="width: 140px; accent-color: var(--secondary);">
              <span id="rainVal" style="font-size: 0.78rem; font-weight: 800; color: var(--secondary);">50 mm</span>
            </div>
          ` : ''}
        </div>

        <!-- Right: Ecology Balance Telemetry -->
        <div class="eco-drawer" style="background: #FFFFFF; border-left: 1.5px solid var(--border-light); padding: 24px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="badge badge-mint">Biosphere Health</span>
              <span style="font-size: 0.82rem; font-weight: 800; color: var(--primary);" id="ecoStatus">Equilibrium: 0%</span>
            </div>
            <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin-bottom: 8px;">${config.title}</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">${config.instruction}</p>

            <div id="ecoIntelBox" style="background: var(--bg-surface-soft); border-radius: var(--radius-md); border-left: 4px solid var(--primary); padding: 16px;">
              <span style="font-size: 0.76rem; font-weight: 800; text-transform: uppercase; color: var(--primary);">Lindeman's 10% Law</span>
              <h5 id="ecoIntelTitle" style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); margin: 6px 0;">Energy Transfer</h5>
              <p id="ecoIntelDesc" style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">Only about 10% of the energy stored as biomass in one trophic level is transferred to the next level. The remaining 90% is dissipated as metabolic heat.</p>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 700; margin-bottom: 6px;">
              <span>Carrying Capacity Balance</span>
              <span id="ecoPercent" style="color: var(--primary);">0%</span>
            </div>
            <div style="width: 100%; height: 8px; background: var(--bg-surface-soft); border-radius: 99px; overflow: hidden;">
              <div id="ecoFill" style="width: 0%; height: 100%; background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%); transition: width 0.4s ease;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    let selectedSpecies = null;

    this.container.querySelectorAll('.eco-species-card').forEach(card => {
      card.onclick = () => {
        const id = card.getAttribute('data-id');
        selectedSpecies = this.organisms[id];

        this.container.querySelectorAll('.eco-species-card').forEach(c => {
          c.style.borderColor = c.getAttribute('data-id') === id ? 'var(--primary)' : 'var(--border-light)';
          c.style.background = c.getAttribute('data-id') === id ? 'var(--primary-light)' : 'var(--bg-surface-alt)';
        });

        const titleEl = document.getElementById('ecoIntelTitle');
        const descEl = document.getElementById('ecoIntelDesc');
        if (titleEl && descEl && selectedSpecies) {
          titleEl.innerHTML = `${selectedSpecies.icon} ${selectedSpecies.name}`;
          descEl.textContent = selectedSpecies.desc;
        }

        if (window.soundEngine) window.soundEngine.playClick();
      };
    });

    this.container.querySelectorAll('.trophic-tier-slot').forEach(slot => {
      slot.onclick = () => {
        const targetTrophic = slot.getAttribute('data-trophic');
        if (selectedSpecies) {
          this.placeSpecies(selectedSpecies, targetTrophic);
        }
      };
    });
  }

  placeSpecies(species, targetTrophic) {
    const config = this.levelConfigs[this.level];

    if (species.trophic === targetTrophic) {
      // Correct trophic assignment
      this.slots[targetTrophic] = species;
      this.score += 25;
      if (window.soundEngine) window.soundEngine.playCorrect();

      const slotEl = document.getElementById(`slot_${targetTrophic}`);
      if (slotEl) {
        slotEl.style.borderColor = 'var(--primary)';
        slotEl.style.background = 'var(--primary-light)';
        document.getElementById(`icon_${targetTrophic}`).textContent = species.icon;
        document.getElementById(`label_${targetTrophic}`).textContent = `${species.name} (Active)`;
      }

      // Check overall trophic completion
      const filledCount = config.required.filter(t => this.slots[t] !== null).length;
      const totalCount = config.required.length;
      const percent = Math.round((filledCount / totalCount) * 100);

      document.getElementById('ecoStatus').textContent = `Equilibrium: ${percent}%`;
      document.getElementById('ecoPercent').textContent = `${percent}%`;
      document.getElementById('ecoFill').style.width = `${percent}%`;

      if (filledCount >= totalCount) {
        setTimeout(() => this.completeLevel(), 500);
      }
    } else {
      // Trophic Level Mismatch
      if (window.soundEngine) window.soundEngine.playWrong();
      const slotEl = document.getElementById(`slot_${targetTrophic}`);
      if (slotEl) {
        slotEl.style.borderColor = '#FF8A80';
        setTimeout(() => slotEl.style.borderColor = '#B4C4D8', 400);
      }

      const descEl = document.getElementById('ecoIntelDesc');
      if (descEl) {
        descEl.innerHTML = `<span style="color: #C62828; font-weight: 700;">Trophic Level Mismatch:</span> ${species.name} is a ${species.trophic.toUpperCase()}, not a ${targetTrophic.toUpperCase()}!`;
      }
    }
  }

  completeLevel() {
    if (window.soundEngine) window.soundEngine.playFanfare();
    if (window.triggerConfetti) window.triggerConfetti();

    const stars = 3;
    if (window.stateManager) {
      window.stateManager.recordGameCompletion('eco_world', this.level, this.score, stars);
    }

    if (window.showGameCompletionModal) {
      window.showGameCompletionModal({
        gameId: 'eco_world',
        gameTitle: 'Eco World – Save the Planet',
        level: this.level,
        score: this.score,
        stars: stars,
        learningTakeaway: "Ecosystems rely on unbroken trophic pyramids: primary producers harness solar energy, consumers transfer nutrients, and decomposers recycle minerals.",
        onReplay: () => this.init(this.level),
        onNext: this.level < 3 ? () => this.init(this.level + 1) : null
      });
    }
  }

  // Interactive Guided Tutorial
  launchTutorial() {
    const steps = [
      {
        title: "Welcome to Eco World",
        instruction: "Build a stable ecological food pyramid. First, select Prairie Grass from the species tray.",
        target: '#sp_grass',
        feedback: "Selected! Prairie Grass is an autotrophic primary producer.",
        onAction: () => {
          this.placeSpecies(this.organisms.grass, 'producer');
        }
      },
      {
        title: "Slot Producer at Pyramid Base",
        instruction: "Click on the bottom Trophic Level 1 slot to establish the primary biomass foundation.",
        target: '#slot_producer',
        feedback: "Great! 100% solar energy base established.",
        onAction: () => {
          this.placeSpecies(this.organisms.grass, 'producer');
        }
      },
      {
        title: "Add Primary Consumer Herbivore",
        instruction: "Now select Cottontail Rabbit to feed on the grass.",
        target: '#sp_rabbit',
        feedback: "Herbivore added! Transmits 10% energy to Level 2.",
        onAction: () => {
          this.placeSpecies(this.organisms.rabbit, 'herbivore');
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

window.EcoWorldGame = EcoWorldGame;
