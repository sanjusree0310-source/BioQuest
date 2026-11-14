/* ============================================================
   BIOQUEST - Game 4: Germ Busters (Enhanced Edition)
   Category: Immunology | Microscopic Immune Defense & Phagocytosis
   ============================================================ */

class GermBustersGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.level = 1;
    this.score = 0;
    this.selectedDefender = null;
    this.pathogens = [];
    this.animTimer = null;
    this.tutorialEngine = null;

    this.defendersData = {
      macrophage: {
        id: 'macrophage',
        name: 'Macrophage',
        type: 'Innate Phagocyte',
        target: 'bacteria',
        actionVerb: 'Engulf & Digest',
        desc: 'Large mononuclear phagocyte that extends pseudopodia around foreign bacteria, forming a phagosome fused with acidic lysosomes.',
        icon: '🦠',
        color: '#61C9A8'
      },
      antibody: {
        id: 'antibody',
        name: 'Y-Antibody (IgG)',
        type: 'Adaptive Neutralizer',
        target: 'virus',
        actionVerb: 'Agglutinate & Neutralize',
        desc: 'Y-shaped immunoglobulins produced by plasma B-cells whose hypervariable Fab regions bind specifically to viral surface epitopes.',
        icon: '🛡️',
        color: '#74B9FF'
      },
      tcell: {
        id: 'tcell',
        name: 'Cytotoxic T-Lymphocyte',
        type: 'Cell-Mediated Immunity',
        target: 'infected_cell',
        actionVerb: 'Perforin Apoptosis',
        desc: 'Binds viral peptides on MHC Class I molecules of infected cells, releasing perforin pore-forming proteins and granzymes to trigger apoptosis.',
        icon: '⚡',
        color: '#B49AFF'
      }
    };

    this.levelConfigs = {
      1: {
        title: "Level 1: Innate Phagocytosis Defense",
        instruction: "Deploy Macrophages to engulf and enzymatically digest the invading bacterial colonies.",
        pathogens: [
          { id: 1, type: 'bacteria', name: 'Streptococcus Bacterium', x: 100, y: 130, vx: 0.4, vy: 0.3, neutralized: false },
          { id: 2, type: 'bacteria', name: 'Escherichia Coli Rod', x: 260, y: 80, vx: -0.3, vy: 0.5, neutralized: false },
          { id: 3, type: 'bacteria', name: 'Staphylococcus Cluster', x: 380, y: 180, vx: 0.2, vy: -0.4, neutralized: false }
        ]
      },
      2: {
        title: "Level 2: Adaptive Antigen Neutralization",
        instruction: "Deploy Y-shaped Antibodies to bind viral spike antigens and block cellular entry.",
        pathogens: [
          { id: 1, type: 'virus', name: 'Influenza A Virion', x: 120, y: 110, vx: 0.5, vy: -0.2, neutralized: false },
          { id: 2, type: 'virus', name: 'Rhinovirus Capsid', x: 270, y: 200, vx: -0.4, vy: 0.3, neutralized: false },
          { id: 3, type: 'virus', name: 'Adenovirus Spike', x: 390, y: 90, vx: 0.3, vy: 0.4, neutralized: false }
        ]
      },
      3: {
        title: "Level 3: Full Coordinated Immune Battle",
        instruction: "Coordinate Innate Macrophages, Humoral Antibodies, and Cell-Mediated T-Cells against a multi-threat invasion!",
        pathogens: [
          { id: 1, type: 'bacteria', name: 'Salmonella Flagellated Rod', x: 90, y: 170, vx: 0.4, vy: 0.3, neutralized: false },
          { id: 2, type: 'virus', name: 'Coronavirus Spike Virion', x: 220, y: 70, vx: -0.3, vy: 0.4, neutralized: false },
          { id: 3, type: 'infected_cell', name: 'Infected Epithelial Host Cell', x: 330, y: 220, vx: 0.2, vy: -0.3, neutralized: false },
          { id: 4, type: 'bacteria', name: 'Pseudomonas Biofilm Invader', x: 420, y: 110, vx: -0.5, vy: 0.2, neutralized: false }
        ]
      }
    };
  }

  init(level = 1, isDemo = false) {
    this.level = level;
    this.score = 0;
    this.selectedDefender = 'macrophage';
    if (this.animTimer) clearInterval(this.animTimer);
    this.pathogens = JSON.parse(JSON.stringify(this.levelConfigs[this.level].pathogens));
    this.render();

    if (isDemo) {
      this.launchTutorial();
    }
  }

  render() {
    const config = this.levelConfigs[this.level];
    this.container.innerHTML = `
      <div class="germ-layout" style="display: grid; grid-template-columns: 1fr 340px; height: 100%; min-height: 560px; position: relative;">
        <!-- Left: Microscopic Bloodstream Arena -->
        <div class="microscope-arena" style="background: radial-gradient(circle, #FFFDF8 0%, #F5F9FE 100%); padding: 24px; position: relative; overflow: hidden; display: flex; flex-direction: column;">
          
          <!-- Top Telemetry -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; z-index: 5;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge badge-mint">Innate & Adaptive Immune Axis</span>
              <span style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted);">Microscopic Field 1000x</span>
            </div>
            <div style="font-size: 0.88rem; font-weight: 800; color: var(--primary);" id="germScore">Neutralized: 0 / ${this.pathogens.length}</div>
          </div>

          <!-- Microscopic Battle Field Canvas/Container -->
          <div id="germBattleCanvas" style="flex: 1; position: relative; border-radius: var(--radius-xl); border: 2.5px solid var(--border-light); background: #FFFFFF; box-shadow: var(--shadow-sm); overflow: hidden; min-height: 380px;">
            <!-- Ambient blood cell floaters -->
            <div style="position: absolute; top: 30px; left: 50px; width: 45px; height: 45px; border-radius: 50%; background: rgba(255, 107, 107, 0.12); pointer-events: none;"></div>
            <div style="position: absolute; bottom: 50px; right: 70px; width: 55px; height: 55px; border-radius: 50%; background: rgba(255, 107, 107, 0.1); pointer-events: none;"></div>

            <!-- Pathogens -->
            ${this.pathogens.map(p => `
              <div class="pathogen-node" id="pathogen_${p.id}" data-id="${p.id}" data-type="${p.type}" style="position: absolute; top: ${p.y}px; left: ${p.x}px; padding: 12px 18px; border-radius: var(--radius-full); background: #FFF1F0; border: 2px solid #FFA59B; box-shadow: 0 6px 18px rgba(255, 107, 107, 0.22); cursor: pointer; transition: transform 0.2s; display: flex; align-items: center; gap: 10px; user-select: none;">
                <span style="font-size: 1.6rem;">${p.type === 'bacteria' ? '🧫' : (p.type === 'virus' ? '🦠' : '🛑')}</span>
                <div>
                  <h6 style="font-size: 0.86rem; font-weight: 800; color: #B52C1F;">${p.name}</h6>
                  <span style="font-size: 0.7rem; color: #E57373; font-weight: 700;">Pathogenic Invader</span>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Defender Action Palette -->
          <div style="margin-top: 20px; display: flex; align-items: center; justify-content: center; gap: 14px;">
            <span style="font-size: 0.84rem; font-weight: 800; color: var(--text-main);">Active Defense Cell:</span>
            <div style="display: flex; gap: 12px;">
              ${Object.values(this.defendersData).map(d => `
                <button class="btn-defender-picker ${d.id === this.selectedDefender ? 'active-defender' : ''}" id="pick_${d.id}" data-defender="${d.id}" style="display: flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: var(--radius-full); background: ${d.id === this.selectedDefender ? d.color : '#FFFFFF'}; border: 2px solid ${d.color}; color: ${d.id === this.selectedDefender ? '#FFFFFF' : 'var(--text-main)'}; font-weight: 800; font-size: 0.86rem; cursor: pointer; transition: all 0.2s; box-shadow: var(--shadow-sm);">
                  <span>${d.icon}</span>
                  <span>${d.name}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right: Immunology Intelligence Brief -->
        <div class="germ-drawer" style="background: #FFFFFF; border-left: 1.5px solid var(--border-light); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; overflow-y: auto;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="badge badge-peach">Immunological Intel</span>
              <span style="font-size: 0.82rem; font-weight: 800; color: #C85D36;">Host Viability 100%</span>
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">${config.title}</h4>
            <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 18px; line-height: 1.4;">${config.instruction}</p>

            <div id="germIntelBox" style="background: var(--bg-surface-soft); border-radius: var(--radius-md); border-left: 4px solid var(--primary); padding: 16px; margin-bottom: 16px;">
              <span style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; color: var(--primary);">Defense Mechanism</span>
              <h5 id="germIntelTitle" style="font-size: 0.98rem; font-weight: 800; color: var(--text-main); margin: 6px 0;">Macrophage Phagocyte</h5>
              <p id="germIntelDesc" style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.45;">Macrophages engulf bacteria into phagosomes that fuse with lysosomes, utilizing reactive oxygen species (ROS) to lyse microbial membranes.</p>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 800; margin-bottom: 6px;">
              <span>Infection Clearance</span>
              <span id="clearancePercent" style="color: var(--primary);">0%</span>
            </div>
            <div style="width: 100%; height: 10px; background: var(--bg-surface-soft); border-radius: 99px; overflow: hidden; border: 1px solid var(--border-light);">
              <div id="clearanceFill" style="width: 0%; height: 100%; background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%); transition: width 0.4s ease;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
    this.startMotionLoop();
  }

  attachEvents() {
    this.container.querySelectorAll('.btn-defender-picker').forEach(btn => {
      btn.onclick = () => {
        const defId = btn.getAttribute('data-defender');
        this.selectDefender(defId);
      };
    });

    this.container.querySelectorAll('.pathogen-node').forEach(node => {
      node.onclick = () => {
        const id = parseInt(node.getAttribute('data-id'));
        this.attackPathogen(id);
      };
    });

    this.selectDefender('macrophage');
  }

  startMotionLoop() {
    this.animTimer = setInterval(() => {
      const arena = document.getElementById('germBattleCanvas');
      if (!arena) return;

      const maxX = arena.clientWidth - 160;
      const maxY = arena.clientHeight - 60;

      this.pathogens.forEach(p => {
        if (p.neutralized) return;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 10 || p.x > maxX) p.vx *= -1;
        if (p.y < 10 || p.y > maxY) p.vy *= -1;

        const node = document.getElementById(`pathogen_${p.id}`);
        if (node) {
          node.style.left = `${p.x}px`;
          node.style.top = `${p.y}px`;
        }
      });
    }, 40);
  }

  selectDefender(defId) {
    this.selectedDefender = defId;
    const def = this.defendersData[defId];

    this.container.querySelectorAll('.btn-defender-picker').forEach(btn => {
      const active = btn.getAttribute('data-defender') === defId;
      btn.style.background = active ? def.color : '#FFFFFF';
      btn.style.color = active ? '#FFFFFF' : 'var(--text-main)';
      btn.style.transform = active ? 'scale(1.06)' : 'scale(1)';
    });

    const titleEl = document.getElementById('germIntelTitle');
    const descEl = document.getElementById('germIntelDesc');
    const boxEl = document.getElementById('germIntelBox');
    if (titleEl && descEl && def) {
      titleEl.innerHTML = `${def.icon} ${def.name} <span style="font-size: 0.74rem; color: ${def.color};">(${def.type})</span>`;
      descEl.textContent = `${def.desc} Specialized target: ${def.target.replace('_', ' ').toUpperCase()}.`;
      if (boxEl) boxEl.style.borderLeftColor = def.color;
    }

    if (window.soundEngine) window.soundEngine.playClick();
  }

  attackPathogen(id) {
    const pathogen = this.pathogens.find(p => p.id === id);
    if (!pathogen || pathogen.neutralized) return;

    const defender = this.defendersData[this.selectedDefender];

    if (defender.target === pathogen.type) {
      // Successful Neutralization!
      pathogen.neutralized = true;
      this.score += 35;
      if (window.soundEngine) window.soundEngine.playCorrect();

      const nodeEl = document.getElementById(`pathogen_${id}`);
      if (nodeEl) {
        nodeEl.style.background = 'var(--primary-light)';
        nodeEl.style.borderColor = 'var(--primary)';
        nodeEl.style.boxShadow = '0 0 16px rgba(97, 201, 168, 0.5)';
        nodeEl.style.transform = 'scale(0.92)';
        nodeEl.querySelector('span:last-child').textContent = `✓ ${defender.actionVerb}`;
        nodeEl.querySelector('span:last-child').style.color = 'var(--primary)';
        nodeEl.style.pointerEvents = 'none';
      }

      const count = this.pathogens.filter(p => p.neutralized).length;
      const total = this.pathogens.length;
      const percent = Math.round((count / total) * 100);

      document.getElementById('germScore').textContent = `Neutralized: ${count} / ${total}`;
      document.getElementById('clearancePercent').textContent = `${percent}%`;
      document.getElementById('clearanceFill').style.width = `${percent}%`;

      if (count >= total) {
        if (this.animTimer) clearInterval(this.animTimer);
        setTimeout(() => this.completeLevel(), 600);
      }
    } else {
      // Ineffective Defender Match
      if (window.soundEngine) window.soundEngine.playWrong();
      const nodeEl = document.getElementById(`pathogen_${id}`);
      if (nodeEl) {
        nodeEl.style.borderColor = '#FF3D00';
        setTimeout(() => nodeEl.style.borderColor = '#FFA59B', 400);
      }

      const descEl = document.getElementById('germIntelDesc');
      if (descEl) {
        descEl.innerHTML = `<span style="color: #C62828; font-weight: 800;">Target Immunity Mismatch:</span> ${defender.name} cannot neutralize ${pathogen.name}. Deploy a ${pathogen.type === 'bacteria' ? 'Macrophage' : (pathogen.type === 'virus' ? 'Y-Antibody' : 'Killer T-Cell')}!`;
      }
    }
  }

  completeLevel() {
    if (this.animTimer) clearInterval(this.animTimer);
    if (window.soundEngine) window.soundEngine.playFanfare();
    if (window.triggerConfetti) window.triggerConfetti();

    const stars = 3;
    if (window.stateManager) {
      window.stateManager.recordGameCompletion('germ_busters', this.level, this.score, stars);
    }

    if (window.showGameCompletionModal) {
      window.showGameCompletionModal({
        gameId: 'germ_busters',
        gameTitle: 'Germ Busters',
        level: this.level,
        score: this.score,
        stars: stars,
        learningTakeaway: "Innate immunity (macrophage phagocytosis) serves as the rapid first line of defense, while adaptive immunity (B-cell antibodies and T-cell cytotoxicity) generates specific immunological memory.",
        onReplay: () => this.init(this.level),
        onNext: this.level < 3 ? () => this.init(this.level + 1) : null
      });
    }
  }

  // Interactive Guided Tutorial
  launchTutorial() {
    const steps = [
      {
        title: "Welcome to Germ Busters",
        instruction: "Microscopic pathogens are invading the blood vessel. First, select the Macrophage phagocyte unit.",
        target: '#pick_macrophage',
        feedback: "Selected! Macrophages are large phagocytic cells of the innate immune system.",
        onAction: () => {
          this.selectDefender('macrophage');
        }
      },
      {
        title: "Engulf the Bacterium",
        instruction: "Now click on the invading bacterium to perform phagocytosis and neutralize it.",
        target: '#pathogen_1',
        feedback: "Awesome! The pathogen has been engulfed and digested.",
        onAction: () => {
          this.attackPathogen(1);
        }
      }
    ];

    this.tutorialEngine = new TutorialEngine(this, steps, () => {
      this.init(1, false);
    });
    this.tutorialEngine.start();
  }

  resetGame() {
    if (this.animTimer) clearInterval(this.animTimer);
    this.init(this.level, false);
  }
}

window.GermBustersGame = GermBustersGame;
