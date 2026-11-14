/* ============================================================
   BIOQUEST - Game 9: Digestive Journey (Enhanced Edition)
   Category: Human Physiology | GI Tract Voyage, Enzyme Digestion & Villi
   ============================================================ */

class DigestiveJourneyGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.level = 1;
    this.score = 0;
    this.currentStageIdx = 0;
    this.stomachPH = 4.0; // Target pH 1.5 - 2.0
    this.tutorialEngine = null;

    this.stages = [
      {
        id: 'mouth',
        name: 'Oral Cavity (Mouth)',
        actionLabel: 'Masticate & Secrete Amylase 🦷',
        enzyme: 'Salivary Amylase & Lingual Lipase',
        foodState: '🍎 Whole Food Bolus',
        phRange: 'pH 6.8 - 7.0',
        desc: 'Teeth mechanically grind food while salivary amylase hydrolyzes complex amylose starch into disaccharide maltose.',
        icon: '🍎'
      },
      {
        id: 'esophagus',
        name: 'Esophagus & Peristalsis',
        actionLabel: 'Trigger Peristaltic Wave 🌊',
        enzyme: 'Mucus Lubrication (Non-enzymatic)',
        foodState: '🥣 Lubricated Food Bolus',
        phRange: 'pH 7.0',
        desc: 'Coordinated involuntary circular and longitudinal smooth muscle contractions propel bolus through the thoracic cavity.',
        icon: '⬇️'
      },
      {
        id: 'stomach',
        name: 'Gastric Chamber (Stomach)',
        actionLabel: 'Churn Gastric Acid (HCl + Pepsin) 🥣',
        enzyme: 'Pepsin (from Pepsinogen) + Gastric Lipase',
        foodState: '🧪 Acidic Liquid Chyme',
        phRange: 'pH 1.5 - 2.0 (Hydrochloric Acid)',
        desc: 'Parietal cells pump H+ and Cl- to denature dietary proteins; active pepsin cleaves internal peptide bonds into oligopeptides.',
        icon: '🥣'
      },
      {
        id: 'small_intestine',
        name: 'Small Intestine (Duodenum/Jejunum)',
        actionLabel: 'Absorb Nutrients via Microvilli ✨',
        enzyme: 'Bile Salts, Pancreatic Lipase, Trypsin, Peptidases',
        foodState: '🧬 Soluble Monomers (Glucose, Amino Acids)',
        phRange: 'pH 7.5 - 8.0 (Bicarbonate Neutralized)',
        desc: 'Bile emulsifies fat droplets; villi and brush border microvilli actively transport monosaccharides and amino acids into mesenteric capillaries.',
        icon: '🧬'
      },
      {
        id: 'large_intestine',
        name: 'Large Intestine (Colon)',
        actionLabel: 'Reclaim H₂O & Electrolytes 💧',
        enzyme: 'Gut Microbiome Fermentation',
        foodState: '🔄 Compacted Fiber & Biomass',
        phRange: 'pH 6.5 - 7.0',
        desc: 'Reabsorbs over 90% of water and electrolytes, houses vitamin K-producing gut microbiota, and eliminates indigestible matter.',
        icon: '🔄'
      }
    ];

    this.levelConfigs = {
      1: {
        title: "Level 1: Upper Digestive Breakdown",
        stages: ['mouth', 'esophagus', 'stomach'],
        instruction: "Guide food from mechanical chewing in the mouth, through peristalsis, into the gastric chamber."
      },
      2: {
        title: "Level 2: Nutrient Absorption & Assimilation",
        stages: ['stomach', 'small_intestine', 'large_intestine'],
        instruction: "Chyme enters the duodenum for enzymatic digestion and microvilli nutrient transfer."
      },
      3: {
        title: "Level 3: Complete 5-Stage Gastrointestinal Voyage",
        stages: ['mouth', 'esophagus', 'stomach', 'small_intestine', 'large_intestine'],
        instruction: "Travel through the entire 30-foot human digestive tract without nutrient depletion!"
      }
    };
  }

  init(level = 1, isDemo = false) {
    this.level = level;
    this.score = 0;
    this.currentStageIdx = 0;
    this.stomachPH = 4.0;
    this.render();

    if (isDemo) {
      this.launchTutorial();
    }
  }

  render() {
    const config = this.levelConfigs[this.level];
    const activeStageList = this.stages.filter(s => config.stages.includes(s.id));
    const curStage = activeStageList[this.currentStageIdx] || activeStageList[0];

    this.container.innerHTML = `
      <div class="digestive-layout" style="display: grid; grid-template-columns: 1fr 350px; height: 100%; min-height: 560px; position: relative;">
        <!-- Left: GI Tract Journey Arena -->
        <div class="digestive-arena" style="background: radial-gradient(circle, #FFFDF8 0%, #F5F9FE 100%); padding: 28px; display: flex; flex-direction: column; align-items: center; justify-content: space-between;">
          
          <!-- Top Tracker -->
          <div style="background: #FFFFFF; border: 1.5px solid var(--border-light); border-radius: var(--radius-full); padding: 8px 24px; box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 14px;">
            <span class="badge badge-peach">GI Tract Milestone</span>
            <span style="font-size: 0.86rem; font-weight: 800; color: var(--text-main);">Current Organ: ${curStage.name}</span>
          </div>

          <!-- Central Animated Organ Chamber -->
          <div id="digestiveChamber" style="position: relative; width: 440px; height: 270px; background: #FFFFFF; border-radius: var(--radius-xl); border: 3px solid var(--accent-peach); box-shadow: 0 16px 40px rgba(255, 184, 155, 0.28); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; text-align: center; padding: 24px;">
            <div id="particleAvatar" style="font-size: 4.5rem; animation: pulseSubtle 1.8s infinite;">
              ${curStage.icon}
            </div>
            <div>
              <h4 style="font-size: 1.3rem; font-weight: 800; color: var(--text-main); margin-bottom: 4px;">${curStage.name}</h4>
              <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                <span style="font-size: 0.74rem; font-weight: 800; color: #C85D36; background: #FFF2EC; padding: 3px 12px; border-radius: 99px;">${curStage.enzyme}</span>
                <span style="font-size: 0.74rem; font-weight: 800; color: var(--primary); background: var(--primary-light); padding: 3px 12px; border-radius: 99px;">${curStage.phRange}</span>
              </div>
            </div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); background: var(--bg-surface-alt); padding: 4px 14px; border-radius: 99px;">
              Physical Form: <strong>${curStage.foodState}</strong>
            </div>
          </div>

          <!-- Action Button to Advance Stage -->
          <div style="display: flex; gap: 14px;">
            <button class="btn btn-primary btn-lg" id="btnDigestAction" style="box-shadow: 0 10px 28px rgba(255, 184, 155, 0.45); background: linear-gradient(135deg, var(--accent-peach) 0%, #E07A5F 100%);">
              ${curStage.actionLabel}
            </button>
          </div>
        </div>

        <!-- Right: Physiology Drawer -->
        <div class="digestive-drawer" style="background: #FFFFFF; border-left: 1.5px solid var(--border-light); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; overflow-y: auto;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="badge badge-peach">Physiology Step</span>
              <span style="font-size: 0.85rem; font-weight: 800; color: #C85D36;" id="digestStageCount">${this.currentStageIdx + 1} of ${activeStageList.length} Completed</span>
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">${config.title}</h4>
            <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 18px; line-height: 1.4;">${config.instruction}</p>

            <div id="digestIntelBox" style="background: var(--bg-surface-soft); border-radius: var(--radius-md); border-left: 4px solid var(--accent-peach); padding: 16px; margin-bottom: 16px;">
              <span style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; color: #C85D36;">Enzymatic Digestion</span>
              <h5 id="digestIntelTitle" style="font-size: 0.98rem; font-weight: 800; color: var(--text-main); margin: 6px 0;">${curStage.name}</h5>
              <p id="digestIntelDesc" style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.45;">${curStage.desc}</p>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 800; margin-bottom: 6px;">
              <span>Transit Completion</span>
              <span id="digestPercent" style="color: #C85D36;">0%</span>
            </div>
            <div style="width: 100%; height: 10px; background: var(--bg-surface-soft); border-radius: 99px; overflow: hidden; border: 1px solid var(--border-light);">
              <div id="digestFill" style="width: 0%; height: 100%; background: linear-gradient(90deg, var(--accent-peach) 0%, var(--primary) 100%); transition: width 0.4s ease;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const btn = document.getElementById('btnDigestAction');
    if (btn) {
      btn.onclick = () => this.advanceStage();
    }
  }

  advanceStage() {
    const config = this.levelConfigs[this.level];
    const activeStageList = this.stages.filter(s => config.stages.includes(s.id));

    this.score += 35;
    if (window.soundEngine) window.soundEngine.playCorrect();

    this.currentStageIdx++;
    const total = activeStageList.length;
    const percent = Math.min(100, Math.round((this.currentStageIdx / total) * 100));

    const countEl = document.getElementById('digestStageCount');
    const percentEl = document.getElementById('digestPercent');
    const fillEl = document.getElementById('digestFill');
    if (countEl) countEl.textContent = `${this.currentStageIdx} of ${total} Completed`;
    if (percentEl) percentEl.textContent = `${percent}%`;
    if (fillEl) fillEl.style.width = `${percent}%`;

    if (this.currentStageIdx >= total) {
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
      window.stateManager.recordGameCompletion('digestive_journey', this.level, this.score, stars);
    }

    if (window.showGameCompletionModal) {
      window.showGameCompletionModal({
        gameId: 'digestive_journey',
        gameTitle: 'Digestive Journey',
        level: this.level,
        score: this.score,
        stars: stars,
        learningTakeaway: "Digestive transit sequentially degrades ingested macronutrients through specialized microenvironments: acidic denaturation in the stomach followed by alkaline enzymatic hydrolysis and villous absorption in the duodenum and jejunum.",
        onReplay: () => this.init(this.level),
        onNext: this.level < 3 ? () => this.init(this.level + 1) : null
      });
    }
  }

  // Interactive Guided Tutorial
  launchTutorial() {
    const steps = [
      {
        title: "Welcome to Digestive Journey",
        instruction: "Follow food through the GI tract. Click Chew & Mix Saliva to start digestion in the mouth.",
        target: '#btnDigestAction',
        feedback: "Salivary amylase initiated! Starch breaking down.",
        onAction: () => {
          this.advanceStage();
        }
      },
      {
        title: "Peristalsis in the Esophagus",
        instruction: "Click Trigger Peristalsis Wave to push the food bolus into the stomach.",
        target: '#btnDigestAction',
        feedback: "Smooth muscles contracted! Bolus reached stomach.",
        onAction: () => {
          this.advanceStage();
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

window.DigestiveJourneyGame = DigestiveJourneyGame;
