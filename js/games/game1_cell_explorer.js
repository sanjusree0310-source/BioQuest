/* ============================================================
   BIOQUEST - Game 1: Cell Explorer – The Lost Organelles (Enhanced Edition)
   Category: Cell Biology | Interactive 3D Cell Restoration & Cytoplasmic Sonar
   ============================================================ */

class CellExplorerGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.level = 1;
    this.score = 0;
    this.foundOrganelles = new Set();
    this.activeOrganelle = null;
    this.rotation = 0;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.tutorialEngine = null;
    this.pulseAngle = 0;
    this.scannerActive = true;
    this.particles = [];

    this.organellesData = {
      nucleus: {
        id: 'nucleus',
        name: 'Nucleus & Nucleolus',
        role: 'Genetic Command Center',
        desc: 'Stores cellular DNA chromatin, directs transcription, and synthesizes ribosomal RNA (rRNA) inside the dense nucleolus.',
        color: '#61C9A8',
        accent: '#23785D',
        x: 0, y: 0, radius: 52,
        atpImpact: '+20% Regulation',
        icon: '🧬'
      },
      mitochondria: {
        id: 'mitochondria',
        name: 'Mitochondria (Powerhouse)',
        role: 'Cellular ATP Aerobic Respiration',
        desc: 'Possesses its own mtDNA and double membrane. Generates 36-38 ATP per glucose molecule via Krebs cycle and oxidative phosphorylation.',
        color: '#FFB89B',
        accent: '#D9534F',
        x: -110, y: -50, radius: 30,
        atpImpact: '+50% Cellular ATP',
        icon: '⚡'
      },
      ribosomes: {
        id: 'ribosomes',
        name: 'Ribosomes (70S/80S)',
        role: 'Peptide Translation Factory',
        desc: 'Composed of large (60S) and small (40S) subunits that translate mRNA codon sequences into structural and enzymatic polypeptide chains.',
        color: '#FFE28A',
        accent: '#C79200',
        x: 75, y: -85, radius: 22,
        atpImpact: '+25% Protein Synthesis',
        icon: '🧱'
      },
      golgi: {
        id: 'golgi',
        name: 'Golgi Apparatus',
        role: 'Macromolecule Packaging & Sorting',
        desc: 'Flattened stacked cisternae with cis and trans faces that perform post-translational protein glycosylation and vesicle shipping.',
        color: '#B49AFF',
        accent: '#7E57C2',
        x: 105, y: 65, radius: 32,
        atpImpact: '+30% Secretion',
        icon: '📦'
      },
      er: {
        id: 'er',
        name: 'Endoplasmic Reticulum',
        role: 'Rough & Smooth Biosynthesis',
        desc: 'Rough ER folds nascent proteins; Smooth ER synthesizes steroid lipids, phospholipids, and regulates calcium ion storage.',
        color: '#74B9FF',
        accent: '#1976D2',
        x: -50, y: 95, radius: 34,
        atpImpact: '+25% Membrane Lipids',
        icon: '🔄'
      },
      lysosomes: {
        id: 'lysosomes',
        name: 'Lysosome Hydrolase Sacs',
        role: 'Autophagy & Waste Degradation',
        desc: 'Maintains an acidic internal pH (4.5 - 5.0) containing acid hydrolases that digest damaged organelles and phagocytosed bacteria.',
        color: '#FF8A80',
        accent: '#C62828',
        x: -125, y: 40, radius: 24,
        atpImpact: '+20% Autophagy',
        icon: '♻️'
      },
      membrane: {
        id: 'membrane',
        name: 'Plasma Membrane Bilayer',
        role: 'Fluid Mosaic Semi-Permeable Boundary',
        desc: 'Amphipathic phospholipids with cholesterol and transmembrane ion transport channels regulating electrochemical gradients.',
        color: '#48BB78',
        accent: '#276749',
        x: 0, y: 0, radius: 200,
        isMembrane: true,
        atpImpact: '+35% Osmotic Shield',
        icon: '🛡️'
      }
    };

    this.levelObjectives = {
      1: {
        title: "Level 1: The Core Life Organelles",
        targetOrganelles: ['nucleus', 'mitochondria', 'membrane'],
        instruction: "Use the Cytoplasmic Sonar to locate and restore the 3 primary organelles needed for survival: Nucleus, Mitochondria, and Membrane."
      },
      2: {
        title: "Level 2: The Endomembrane Network",
        targetOrganelles: ['ribosomes', 'er', 'golgi'],
        instruction: "Restore the cellular protein manufacturing and shipping line: Ribosomes, Endoplasmic Reticulum, and Golgi Apparatus."
      },
      3: {
        title: "Level 3: Full Cell Restoration",
        targetOrganelles: ['nucleus', 'mitochondria', 'ribosomes', 'er', 'golgi', 'lysosomes', 'membrane'],
        instruction: "Restore all 7 organelles to achieve 100% Cellular Homeostasis before the cytoplasm runs out of ATP!"
      }
    };

    // Ambient floating particles
    for (let i = 0; i < 35; i++) {
      this.particles.push({
        angle: Math.random() * Math.PI * 2,
        dist: 30 + Math.random() * 160,
        speed: 0.005 + Math.random() * 0.015,
        size: 1.5 + Math.random() * 3,
        color: ['#61C9A8', '#74B9FF', '#FFE28A', '#B49AFF'][i % 4]
      });
    }
  }

  init(level = 1, isDemo = false) {
    this.level = level;
    this.score = 0;
    this.foundOrganelles = new Set();
    this.activeOrganelle = null;
    this.render();
    this.initCanvas();

    if (isDemo) {
      this.launchTutorial();
    }
  }

  render() {
    const curObj = this.levelObjectives[this.level];
    this.container.innerHTML = `
      <div class="cell-game-layout" style="display: grid; grid-template-columns: 1fr 360px; height: 100%; min-height: 560px; position: relative;">
        <!-- Left: Interactive 3D Cell Viewport -->
        <div class="cell-viewport" style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(circle, #FAFCFF 0%, #EDF4FD 100%); overflow: hidden; padding: 16px;">
          
          <!-- Scan HUD Overlay -->
          <div style="position: absolute; top: 16px; left: 20px; right: 20px; display: flex; justify-content: space-between; align-items: center; z-index: 10;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-main); background: rgba(255,255,255,0.92); backdrop-filter: blur(8px); padding: 6px 14px; border-radius: 20px; border: 1.5px solid var(--border-light); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 8px var(--primary);" class="animate-pulse-subtle"></span>
              <span>Drag to rotate • Click glowing organelles to restore</span>
            </div>

            <div style="display: flex; gap: 8px;">
              <button class="btn btn-sm btn-outline" id="btnSonarPing" style="background: rgba(255,255,255,0.9);">
                📡 Sonar Scan
              </button>
            </div>
          </div>

          <!-- Canvas -->
          <canvas id="cellCanvas" width="600" height="480" style="max-width: 100%; cursor: grab;"></canvas>

          <!-- Rotation & Zoom Controls -->
          <div style="position: absolute; bottom: 16px; display: flex; gap: 8px; z-index: 10;">
            <button class="btn btn-sm btn-outline" id="btnRotateLeft" style="background: rgba(255,255,255,0.9);">⟲ Rotate Left</button>
            <button class="btn btn-sm btn-outline" id="btnRotateRight" style="background: rgba(255,255,255,0.9);">⟳ Rotate Right</button>
            <button class="btn btn-sm btn-outline" id="btnRecenter" style="background: rgba(255,255,255,0.9);">⌖ Recenter</button>
          </div>
        </div>

        <!-- Right: Organelle Inspector & Mission Drawer -->
        <div class="cell-drawer" style="background: #FFFFFF; border-left: 1.5px solid var(--border-light); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; overflow-y: auto;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="badge badge-mint">Cellular Mission</span>
              <span style="font-size: 0.85rem; font-weight: 800; color: var(--primary);" id="organelleCounter">0 / ${curObj.targetOrganelles.length} Restored</span>
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">${curObj.title}</h4>
            <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 18px; line-height: 1.4;">${curObj.instruction}</p>

            <!-- Organelle Targets Checklist -->
            <div class="organelle-target-list" id="organelleTargetList" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px;">
              ${curObj.targetOrganelles.map(id => {
                const org = this.organellesData[id];
                return `
                  <div class="organelle-check-item" id="chk_${id}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: var(--radius-md); background: var(--bg-surface-alt); border: 1.5px solid var(--border-light); transition: all 0.25s;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="font-size: 1.2rem;">${org.icon}</span>
                      <div>
                        <div style="font-size: 0.86rem; font-weight: 800; color: var(--text-main);">${org.name}</div>
                        <span style="font-size: 0.7rem; color: var(--text-muted);">${org.atpImpact}</span>
                      </div>
                    </div>
                    <span class="status-indicator" style="font-size: 0.74rem; font-weight: 800; color: #9EA8BA; background: #FFFFFF; padding: 2px 8px; border-radius: 99px; border: 1px solid var(--border-light);">Scattered</span>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Organelle Information Card (Dynamic) -->
            <div id="organelleDetailCard" style="background: var(--bg-surface-soft); border-radius: var(--radius-md); border-left: 4px solid var(--primary); padding: 16px; margin-bottom: 16px; transition: all 0.2s;">
              <span style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; color: var(--primary);">Organelle Telemetry</span>
              <h5 id="detailTitle" style="font-size: 0.98rem; font-weight: 800; color: var(--text-main); margin: 6px 0;">Click an organelle to inspect</h5>
              <p id="detailDesc" style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.45;">Rotate the 3D cell and select highlighted organelles to restore vitality to the cell structure.</p>
            </div>
          </div>

          <!-- Cellular ATP & Homeostasis Health Bars -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 800; margin-bottom: 6px;">
              <span>Cellular Homeostasis</span>
              <span id="healthPercent" style="color: var(--primary);">0%</span>
            </div>
            <div style="width: 100%; height: 10px; background: var(--bg-surface-soft); border-radius: 99px; overflow: hidden; border: 1px solid var(--border-light);">
              <div id="healthFill" style="width: 0%; height: 100%; background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%); transition: width 0.4s ease;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Rotate button bindings
    document.getElementById('btnRotateLeft').onclick = () => { this.rotation -= 0.35; if (window.soundEngine) window.soundEngine.playClick(); };
    document.getElementById('btnRotateRight').onclick = () => { this.rotation += 0.35; if (window.soundEngine) window.soundEngine.playClick(); };
    document.getElementById('btnRecenter').onclick = () => { this.rotation = 0; if (window.soundEngine) window.soundEngine.playClick(); };
    document.getElementById('btnSonarPing').onclick = () => {
      this.pulseAngle = 0;
      if (window.soundEngine) window.soundEngine.playCorrect();
    };
  }

  initCanvas() {
    this.canvas = document.getElementById('cellCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Drag to rotate
    this.canvas.onmousedown = (e) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.canvas.style.cursor = 'grabbing';
    };

    window.onmousemove = (e) => {
      if (this.isDragging) {
        const delta = e.clientX - this.lastMouseX;
        this.rotation += delta * 0.008;
        this.lastMouseX = e.clientX;
      }
    };

    window.onmouseup = () => {
      this.isDragging = false;
      if (this.canvas) this.canvas.style.cursor = 'grab';
    };

    // Canvas click detection for organelle discovery
    this.canvas.onclick = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - this.canvas.width / 2;
      const mouseY = e.clientY - rect.top - this.canvas.height / 2;
      this.handleCellClick(mouseX, mouseY);
    };

    this.startAnimationLoop();
  }

  startAnimationLoop() {
    const renderFrame = () => {
      if (!this.canvas || !document.getElementById('cellCanvas')) return;
      this.pulseAngle += 0.035;
      this.drawCell();
      requestAnimationFrame(renderFrame);
    };
    renderFrame();
  }

  drawCell() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w / 2, h / 2);

    const membraneRadius = 195;

    // 1. Cytoplasm Gel fill
    const cytoGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, membraneRadius);
    cytoGrad.addColorStop(0, '#FFFFFF');
    cytoGrad.addColorStop(0.65, '#F0F7FE');
    cytoGrad.addColorStop(1, '#E1EFFD');
    ctx.beginPath();
    ctx.arc(0, 0, membraneRadius, 0, Math.PI * 2);
    ctx.fillStyle = cytoGrad;
    ctx.fill();

    // 2. Cytoplasmic Sonar radar wave
    const pulseRad = (this.pulseAngle * 45) % membraneRadius;
    ctx.beginPath();
    ctx.arc(0, 0, pulseRad, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(97, 201, 168, ${Math.max(0, 0.4 - pulseRad / membraneRadius)})`;
    ctx.lineWidth = 3;
    ctx.stroke();

    // 3. Floating Cytoplasm Granules (Cytosol)
    this.particles.forEach(p => {
      p.angle += p.speed;
      const px = Math.cos(p.angle + this.rotation) * p.dist;
      const py = Math.sin(p.angle + this.rotation) * p.dist;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    // 4. Outer Cell Membrane (Lipid Bilayer with proteins)
    ctx.beginPath();
    ctx.arc(0, 0, membraneRadius, 0, Math.PI * 2);
    ctx.lineWidth = 10;
    ctx.strokeStyle = this.foundOrganelles.has('membrane') ? '#61C9A8' : 'rgba(116, 185, 255, 0.55)';
    ctx.stroke();

    // Transmembrane Protein Channels
    for (let a = 0; a < Math.PI * 2; a += 0.22) {
      const px = Math.cos(a + this.rotation) * membraneRadius;
      const py = Math.sin(a + this.rotation) * membraneRadius;
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = (Math.sin(a * 4) > 0) ? '#74B9FF' : '#FFB89B';
      ctx.fill();
    }

    // 5. Draw Organelles with rich biological detail
    const curObj = this.levelObjectives[this.level];

    Object.values(this.organellesData).forEach(org => {
      if (org.isMembrane) return;

      // Coordinate rotation
      const cosR = Math.cos(this.rotation);
      const sinR = Math.sin(this.rotation);
      const rx = org.x * cosR - org.y * sinR;
      const ry = org.x * sinR + org.y * cosR;

      const isTarget = curObj.targetOrganelles.includes(org.id);
      const isFound = this.foundOrganelles.has(org.id);

      ctx.save();
      ctx.translate(rx, ry);

      if (org.id === 'nucleus') {
        // Outer Nuclear Envelope
        ctx.beginPath();
        ctx.arc(0, 0, org.radius, 0, Math.PI * 2);
        ctx.fillStyle = isFound ? '#61C9A8' : 'rgba(97, 201, 168, 0.45)';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#23785D';
        ctx.stroke();

        // Chromatin threads
        ctx.beginPath();
        ctx.arc(0, 0, org.radius * 0.7, 0, Math.PI * 1.5);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Dense Nucleolus center
        ctx.beginPath();
        ctx.arc(org.radius * 0.15, -org.radius * 0.15, org.radius * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

      } else if (org.id === 'mitochondria') {
        // Outer Mitochondrial Membrane
        ctx.beginPath();
        ctx.ellipse(0, 0, org.radius * 1.35, org.radius * 0.8, 0.35, 0, Math.PI * 2);
        ctx.fillStyle = isFound ? '#FFB89B' : 'rgba(255, 184, 155, 0.5)';
        ctx.fill();
        ctx.strokeStyle = '#D9534F';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Winding Inner Cristae Folds
        ctx.beginPath();
        ctx.moveTo(-org.radius * 0.8, -org.radius * 0.1);
        ctx.lineTo(-org.radius * 0.3, org.radius * 0.3);
        ctx.lineTo(0, -org.radius * 0.3);
        ctx.lineTo(org.radius * 0.4, org.radius * 0.3);
        ctx.lineTo(org.radius * 0.8, 0);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.5;
        ctx.stroke();

      } else if (org.id === 'golgi') {
        // Stacked Cisternae with Secretory Vesicles
        for (let c = -2; c <= 2; c++) {
          ctx.beginPath();
          ctx.ellipse(0, c * 8, org.radius * 0.95, 5, 0.15, 0, Math.PI * 2);
          ctx.fillStyle = isFound ? '#B49AFF' : 'rgba(180, 154, 255, 0.5)';
          ctx.fill();
        }
        // Budding vesicles
        ctx.beginPath();
        ctx.arc(org.radius * 0.8, -12, 4, 0, Math.PI * 2);
        ctx.arc(-org.radius * 0.8, 14, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#B49AFF';
        ctx.fill();

      } else if (org.id === 'er') {
        // Endoplasmic Reticulum interconnected ribbons
        ctx.beginPath();
        ctx.arc(0, 0, org.radius * 0.85, 0.2, Math.PI * 1.6);
        ctx.lineWidth = 6;
        ctx.strokeStyle = isFound ? '#74B9FF' : 'rgba(116, 185, 255, 0.5)';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, org.radius * 0.5, 0.5, Math.PI * 1.8);
        ctx.lineWidth = 5;
        ctx.strokeStyle = isFound ? '#5A9EE8' : 'rgba(116, 185, 255, 0.35)';
        ctx.stroke();

      } else if (org.id === 'lysosomes') {
        // Spherical hydrolase container
        ctx.beginPath();
        ctx.arc(0, 0, org.radius, 0, Math.PI * 2);
        ctx.fillStyle = isFound ? '#FF8A80' : 'rgba(255, 138, 128, 0.5)';
        ctx.fill();
        ctx.strokeStyle = '#C62828';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Enzymes inside
        for (let d = -1; d <= 1; d++) {
          ctx.beginPath();
          ctx.arc(d * 6, d * 4, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        }

      } else if (org.id === 'ribosomes') {
        // Clustered macromolecular ribosome complexes
        for (let d = 0; d < 6; d++) {
          const dx = (d % 3 - 1) * 11;
          const dy = Math.floor(d / 3) * 11 - 5;
          ctx.beginPath();
          ctx.arc(dx, dy, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = isFound ? '#FFE28A' : 'rgba(255, 226, 138, 0.6)';
          ctx.fill();
          ctx.strokeStyle = '#C79200';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Glowing pulsing highlight ring if active target and not yet restored
      if (isTarget && !isFound) {
        const glow = 6 + Math.sin(this.pulseAngle * 2) * 3;
        ctx.beginPath();
        ctx.arc(0, 0, org.radius + glow, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(97, 201, 168, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.restore();
    });

    ctx.restore();
  }

  handleCellClick(clickX, clickY) {
    const curObj = this.levelObjectives[this.level];
    let detected = null;

    Object.values(this.organellesData).forEach(org => {
      if (org.isMembrane) {
        const distFromCenter = Math.sqrt(clickX * clickX + clickY * clickY);
        if (Math.abs(distFromCenter - 195) < 30) {
          detected = org;
        }
        return;
      }

      const cosR = Math.cos(this.rotation);
      const sinR = Math.sin(this.rotation);
      const rx = org.x * cosR - org.y * sinR;
      const ry = org.x * sinR + org.y * cosR;

      const dist = Math.hypot(clickX - rx, clickY - ry);
      if (dist <= org.radius + 12) {
        detected = org;
      }
    });

    if (detected) {
      this.selectOrganelle(detected);
    }
  }

  selectOrganelle(org) {
    const curObj = this.levelObjectives[this.level];
    const isTarget = curObj.targetOrganelles.includes(org.id);

    // Update Detail Card
    const titleEl = document.getElementById('detailTitle');
    const descEl = document.getElementById('detailDesc');
    const cardEl = document.getElementById('organelleDetailCard');
    if (titleEl && descEl && cardEl) {
      titleEl.innerHTML = `${org.icon} ${org.name} <span style="font-size: 0.74rem; color: var(--primary); font-weight: 800;">(${org.role})</span>`;
      descEl.textContent = org.desc;
      cardEl.style.borderLeftColor = org.color;
    }

    if (isTarget && !this.foundOrganelles.has(org.id)) {
      this.foundOrganelles.add(org.id);
      this.score += 35;
      if (window.soundEngine) window.soundEngine.playCorrect();

      // Update checklist item
      const chk = document.getElementById(`chk_${org.id}`);
      if (chk) {
        chk.style.background = 'var(--primary-light)';
        chk.style.borderColor = 'var(--primary)';
        const ind = chk.querySelector('.status-indicator');
        if (ind) {
          ind.textContent = '✓ Restored';
          ind.style.color = 'var(--primary)';
          ind.style.borderColor = 'var(--primary)';
        }
      }

      // Update Health
      const targetCount = curObj.targetOrganelles.length;
      const foundCount = this.foundOrganelles.size;
      const percent = Math.round((foundCount / targetCount) * 100);

      const counterEl = document.getElementById('organelleCounter');
      const healthPercent = document.getElementById('healthPercent');
      const healthFill = document.getElementById('healthFill');
      if (counterEl) counterEl.textContent = `${foundCount} / ${targetCount} Restored`;
      if (healthPercent) healthPercent.textContent = `${percent}%`;
      if (healthFill) healthFill.style.width = `${percent}%`;

      // Check win condition
      if (foundCount >= targetCount) {
        setTimeout(() => this.completeLevel(), 500);
      }
    } else {
      if (window.soundEngine) window.soundEngine.playClick();
    }
  }

  completeLevel() {
    if (window.soundEngine) window.soundEngine.playFanfare();
    if (window.triggerConfetti) window.triggerConfetti();

    const stars = 3;
    if (window.stateManager) {
      window.stateManager.recordGameCompletion('cell_explorer', this.level, this.score, stars);
    }

    if (window.showGameCompletionModal) {
      window.showGameCompletionModal({
        gameId: 'cell_explorer',
        gameTitle: 'Cell Explorer – The Lost Organelles',
        level: this.level,
        score: this.score,
        stars: stars,
        learningTakeaway: "Eukaryotic cellular compartmentalization separates incompatible metabolic processes (e.g. digestive acid hydrolases inside lysosomes versus ATP synthesis in mitochondria).",
        onReplay: () => this.init(this.level),
        onNext: this.level < 3 ? () => this.init(this.level + 1) : null
      });
    }
  }

  // Interactive Guided Tutorial
  launchTutorial() {
    const steps = [
      {
        title: "Welcome to Cell Explorer",
        instruction: "You have entered a giant virtual animal cell. Drag anywhere on the cytoplasm to rotate the cell in 3D.",
        target: '#cellCanvas',
        feedback: "Great! Rotating lets you locate hidden organelles from all angles.",
        onAction: () => { this.rotation += 0.5; }
      },
      {
        title: "Locate the Nucleus",
        instruction: "Notice the central genetic hub. Click the glowing Nucleus to inspect and restore it.",
        target: '#cellCanvas',
        feedback: "Excellent! The Nucleus is now restored and directing protein assembly.",
        onAction: () => {
          this.selectOrganelle(this.organellesData.nucleus);
        }
      },
      {
        title: "Restore the Mitochondria",
        instruction: "Next, locate the bean-shaped powerhouse. Tap Mitochondria to generate vital ATP.",
        target: '#cellCanvas',
        feedback: "Superb! Mitochondria cellular respiration is now generating vital ATP.",
        onAction: () => {
          this.selectOrganelle(this.organellesData.mitochondria);
        }
      },
      {
        title: "Inspect Plasma Membrane",
        instruction: "Click on the outer protective phospholipid membrane to complete the cell boundary.",
        target: '#cellCanvas',
        feedback: "Fantastic! Cell barrier established.",
        onAction: () => {
          this.selectOrganelle(this.organellesData.membrane);
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

window.CellExplorerGame = CellExplorerGame;
