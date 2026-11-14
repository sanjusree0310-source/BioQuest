/* ============================================================
   BIOQUEST - Game 8: Brain Maze (Enhanced Edition)
   Category: Neuroscience | Action Potential Oscilloscope & Synaptic Labyrinth
   ============================================================ */

class BrainMazeGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.level = 1;
    this.score = 0;
    this.currentCheckpoint = 0;
    this.tutorialEngine = null;

    this.levelConfigs = {
      1: {
        title: "Level 1: The Spinal Reflex Arc",
        instruction: "Transmit the action potential: 1. Sensory Receptor ➔ 2. Spinal Interneuron ➔ 3. Motor Effector.",
        checkpoints: [
          { id: 1, name: "Sensory Dendrite Receptor", type: "Generator Potential", neurotransmitter: "Glutamate", voltage: "-55 mV (Threshold)", reached: false },
          { id: 2, name: "Spinal Interneuron Synapse", type: "Chemical Relay", neurotransmitter: "Acetylcholine", voltage: "+30 mV (Peak)", reached: false },
          { id: 3, name: "Motor Neuromuscular Junction", type: "Muscle Effector", neurotransmitter: "Acetylcholine", voltage: "+20 mV (Depolarized)", reached: false }
        ]
      },
      2: {
        title: "Level 2: Synaptic Cleft Neurotransmission",
        instruction: "Navigate action potential across myelinated Nodes of Ranvier and trigger neurotransmitter exocytosis.",
        checkpoints: [
          { id: 1, name: "Axon Hillock (Na+ Influx)", type: "Voltage-Gated Na+ Channel", neurotransmitter: "Voltage", voltage: "+35 mV", reached: false },
          { id: 2, name: "Node of Ranvier (Saltatory Hop)", type: "Myelinated Axon Propagation", neurotransmitter: "Schwann Lipid", voltage: "+30 mV", reached: false },
          { id: 3, name: "Presynaptic Bouton (Ca²⁺ Influx)", type: "Vesicle Exocytosis", neurotransmitter: "SNARE Complex", voltage: "+10 mV", reached: false },
          { id: 4, name: "Postsynaptic Ligand Receptor", type: "Receptor Docking", neurotransmitter: "Dopamine", voltage: "-70 mV (Resting)", reached: false }
        ]
      },
      3: {
        title: "Level 3: Cerebral Cortical Network",
        instruction: "Connect associative pathways through Frontal, Parietal, and Occipital lobes to activate working memory.",
        checkpoints: [
          { id: 1, name: "Occipital Visual Cortex (V1)", type: "Visual Stimulus", neurotransmitter: "Glutamate", voltage: "+30 mV", reached: false },
          { id: 2, name: "Parietal Somatosensory Gyrus", type: "Multimodal Integration", neurotransmitter: "Serotonin", voltage: "+25 mV", reached: false },
          { id: 3, name: "Hippocampus CA1 Synapse", type: "Long-Term Potentiation (LTP)", neurotransmitter: "NMDA / AMPA", voltage: "+35 mV", reached: false },
          { id: 4, name: "Prefrontal Decision Cortex", type: "Executive Cognitive Output", neurotransmitter: "Dopamine", voltage: "-70 mV (Consolidated)", reached: false }
        ]
      }
    };
  }

  init(level = 1, isDemo = false) {
    this.level = level;
    this.score = 0;
    this.currentCheckpoint = 0;
    this.checkpoints = JSON.parse(JSON.stringify(this.levelConfigs[this.level].checkpoints));
    this.render();

    if (isDemo) {
      this.launchTutorial();
    }
  }

  render() {
    const config = this.levelConfigs[this.level];
    this.container.innerHTML = `
      <div class="brain-layout" style="display: grid; grid-template-columns: 1fr 340px; height: 100%; min-height: 560px; position: relative;">
        <!-- Left: Neural Maze Pathway Grid -->
        <div class="brain-arena" style="background: radial-gradient(circle, #F9F7FE 0%, #F1EDFC 100%); padding: 28px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; position: relative;">
          
          <!-- Oscilloscope Voltage Header -->
          <div style="width: 100%; max-width: 520px; background: #FFFFFF; border-radius: var(--radius-lg); border: 1.5px solid var(--border-light); padding: 12px 20px; box-shadow: var(--shadow-sm); display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: var(--accent-lavender);" class="animate-pulse-subtle"></span>
              <span style="font-size: 0.82rem; font-weight: 800; color: var(--text-main);">Electrophysiology Trace:</span>
            </div>
            <span style="font-size: 0.82rem; font-weight: 800; color: var(--accent-lavender);" id="voltageTraceBadge">-70 mV (Resting Potential)</span>
          </div>

          <!-- Neural Checkpoints Track -->
          <div class="neural-pathway-track" style="display: flex; flex-direction: column; gap: 20px; width: 100%; max-width: 520px; position: relative; z-index: 5;">
            ${this.checkpoints.map((cp, idx) => {
              const isCurrent = this.currentCheckpoint === idx;
              const isPast = this.currentCheckpoint > idx;

              return `
                <div class="neural-node-card" id="cp_node_${idx}" data-idx="${idx}" style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-radius: var(--radius-lg); background: ${isPast ? 'var(--primary-light)' : (isCurrent ? '#FFFFFF' : 'var(--bg-surface-alt)')}; border: 2.5px solid ${isPast ? 'var(--primary)' : (isCurrent ? 'var(--accent-lavender)' : 'var(--border-light)')}; box-shadow: ${isCurrent ? '0 10px 28px rgba(180, 154, 255, 0.3)' : 'var(--shadow-sm)'}; cursor: pointer; transition: all 0.3s;">
                  <div style="display: flex; align-items: center; gap: 14px;">
                    <div style="width: 44px; height: 44px; border-radius: 50%; background: ${isPast ? 'var(--primary)' : (isCurrent ? 'var(--accent-lavender)' : '#D6DFEC')}; color: #FFFFFF; font-weight: 800; font-size: 1.15rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.12);">
                      ${isPast ? '✓' : (idx + 1)}
                    </div>
                    <div>
                      <h5 style="font-size: 0.95rem; font-weight: 800; color: var(--text-main);">${cp.name}</h5>
                      <span style="font-size: 0.74rem; font-weight: 700; color: ${isPast ? 'var(--primary)' : 'var(--accent-lavender)'};">${cp.type} • Transmitter: ${cp.neurotransmitter}</span>
                    </div>
                  </div>
                  <button class="btn btn-sm ${isCurrent ? 'btn-accent' : (isPast ? 'btn-outline' : 'btn-outline')}" style="pointer-events: none; font-size: 0.78rem;">
                    ${isPast ? 'Depolarized ⚡' : (isCurrent ? 'Fire Impulse ➔' : 'Polarized')}
                  </button>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Bottom Nav Tip -->
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted);">
            ⚡ Propagate depolarization sequentially through the axonal synaptic circuit
          </span>
        </div>

        <!-- Right: Neuroscience Intelligence Drawer -->
        <div class="brain-drawer" style="background: #FFFFFF; border-left: 1.5px solid var(--border-light); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; overflow-y: auto;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="badge badge-lavender">Synaptic Transmission</span>
              <span style="font-size: 0.85rem; font-weight: 800; color: var(--accent-lavender);" id="synapseCounter">${this.currentCheckpoint} / ${this.checkpoints.length} Relayed</span>
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">${config.title}</h4>
            <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 18px; line-height: 1.4;">${config.instruction}</p>

            <div id="brainIntelBox" style="background: var(--bg-surface-soft); border-radius: var(--radius-md); border-left: 4px solid var(--accent-lavender); padding: 16px; margin-bottom: 16px;">
              <span style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; color: var(--accent-lavender);">Nerve Signal Physics</span>
              <h5 id="brainIntelTitle" style="font-size: 0.98rem; font-weight: 800; color: var(--text-main); margin: 6px 0;">All-or-None Law</h5>
              <p id="brainIntelDesc" style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.45;">If stimulus depolarization crosses threshold (-55 mV), voltage-gated Na+ channels rapidly open, spiking the membrane to +35 mV before potassium repolarization.</p>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 800; margin-bottom: 6px;">
              <span>Action Potential Progress</span>
              <span id="brainPercent" style="color: var(--accent-lavender);">0%</span>
            </div>
            <div style="width: 100%; height: 10px; background: var(--bg-surface-soft); border-radius: 99px; overflow: hidden; border: 1px solid var(--border-light);">
              <div id="brainFill" style="width: 0%; height: 100%; background: linear-gradient(90deg, var(--accent-lavender) 0%, var(--primary) 100%); transition: width 0.4s ease;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    this.container.querySelectorAll('.neural-node-card').forEach(card => {
      card.onclick = () => {
        const idx = parseInt(card.getAttribute('data-idx'));
        if (idx === this.currentCheckpoint) {
          this.advanceCheckpoint();
        }
      };
    });
  }

  advanceCheckpoint() {
    this.score += 35;
    if (window.soundEngine) window.soundEngine.playCorrect();

    const cp = this.checkpoints[this.currentCheckpoint];
    this.currentCheckpoint++;

    const total = this.checkpoints.length;
    const percent = Math.round((this.currentCheckpoint / total) * 100);

    const countEl = document.getElementById('synapseCounter');
    const percentEl = document.getElementById('brainPercent');
    const fillEl = document.getElementById('brainFill');
    const badgeEl = document.getElementById('voltageTraceBadge');
    if (countEl) countEl.textContent = `${this.currentCheckpoint} / ${total} Relayed`;
    if (percentEl) percentEl.textContent = `${percent}%`;
    if (fillEl) fillEl.style.width = `${percent}%`;
    if (badgeEl && cp) badgeEl.textContent = `${cp.voltage} (Active Signal)`;

    if (this.currentCheckpoint >= total) {
      setTimeout(() => this.completeLevel(), 500);
    } else {
      this.render();
    }
  }

  completeLevel() {
    if (window.soundEngine) window.soundEngine.playFanfare();
    if (window.triggerConfetti) window.triggerConfetti();

    const stars = 3;
    if (window.stateManager) {
      window.stateManager.recordGameCompletion('brain_maze', this.level, this.score, stars);
    }

    if (window.showGameCompletionModal) {
      window.showGameCompletionModal({
        gameId: 'brain_maze',
        gameTitle: 'Brain Maze',
        level: this.level,
        score: this.score,
        stars: stars,
        learningTakeaway: "Neurons convert electrical action potentials into chemical neurotransmitter diffusion across synaptic clefts, executing reflex arcs and cognitive computations.",
        onReplay: () => this.init(this.level),
        onNext: this.level < 3 ? () => this.init(this.level + 1) : null
      });
    }
  }

  // Interactive Guided Tutorial
  launchTutorial() {
    const steps = [
      {
        title: "Welcome to Brain Maze",
        instruction: "Transmit an electrical nerve impulse down the reflex arc. Click Checkpoint 1 (Sensory Dendrite).",
        target: '#cp_node_0',
        feedback: "Impulse initiated! Threshold potential reached.",
        onAction: () => {
          this.advanceCheckpoint();
        }
      },
      {
        title: "Cross the Synapse",
        instruction: "Click on Spinal Interneuron to release Acetylcholine and propagate the signal.",
        target: '#cp_node_1',
        feedback: "Signal propagated! Synaptic cleft bridged.",
        onAction: () => {
          this.advanceCheckpoint();
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

window.BrainMazeGame = BrainMazeGame;
