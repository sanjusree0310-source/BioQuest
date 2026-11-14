/* ============================================================
   BIOQUEST - Main Application Orchestrator & Game Registry
   Connects UI, Router, 10 Games, Daily Challenge & Audio
   ============================================================ */

const GAME_CATALOG = [
  {
    id: "cell_explorer",
    title: "Cell Explorer – The Lost Organelles",
    category: "Cell Biology",
    difficulty: "Beginner to Advanced",
    time: "5-8 min",
    desc: "Enter a giant virtual cell. Locate and restore scattered organelles (Nucleus, Mitochondria, Golgi) to achieve homeostasis.",
    icon: "🔬",
    gradient: "linear-gradient(135deg, #EBF9F3 0%, #D4F4E7 100%)",
    classRef: 'CellExplorerGame'
  },
  {
    id: "body_builder",
    title: "Body Builder Challenge",
    category: "Human Anatomy",
    difficulty: "Beginner to Advanced",
    time: "4-6 min",
    desc: "Assemble separated organs (Heart, Lungs, Brain, Liver, Stomach) into their anatomically correct physiological cavities.",
    icon: "🫀",
    gradient: "linear-gradient(135deg, #EEF4FD 0%, #DBEAFE 100%)",
    classRef: 'BodyBuilderGame'
  },
  {
    id: "dna_codebreaker",
    title: "DNA Code Breaker",
    category: "Genetics",
    difficulty: "Beginner to Advanced",
    time: "4-7 min",
    desc: "Crack genomic puzzles! Match complementary nucleotide bases (A-T, G-C) to repair incomplete strands and translate codons.",
    icon: "🧬",
    gradient: "linear-gradient(135deg, #FAF7FF 0%, #EDE5FF 100%)",
    classRef: 'DNACodeBreakerGame'
  },
  {
    id: "germ_busters",
    title: "Germ Busters",
    category: "Immunology",
    difficulty: "Intermediate",
    time: "5-8 min",
    desc: "Deploy macrophages for phagocytosis, Y-shaped antibodies for antigen neutralization, and killer T-cells against infections.",
    icon: "🛡️",
    gradient: "linear-gradient(135deg, #FFF2EC 0%, #FFE2D4 100%)",
    classRef: 'GermBustersGame'
  },
  {
    id: "eco_world",
    title: "Eco World – Save the Planet",
    category: "Ecology",
    difficulty: "Beginner to Advanced",
    time: "6-9 min",
    desc: "Design food webs across grassland, pond, and forest biomes. Balance producers, herbivores, carnivores, and decomposers.",
    icon: "🌍",
    gradient: "linear-gradient(135deg, #F3FAF6 0%, #DCF2E6 100%)",
    classRef: 'EcoWorldGame'
  },
  {
    id: "photosynthesis",
    title: "Photosynthesis Factory",
    category: "Plant Biology",
    difficulty: "Beginner to Intermediate",
    time: "4-6 min",
    desc: "Operate a virtual chloroplast factory. Regulate sunlight photons, water photolysis, and CO2 stomata intake to harvest glucose.",
    icon: "🌿",
    gradient: "linear-gradient(135deg, #F5FAF0 0%, #E2F5D8 100%)",
    classRef: 'PhotosynthesisGame'
  },
  {
    id: "microbe_detective",
    title: "Microbe Detective",
    category: "Microbiology",
    difficulty: "Intermediate",
    time: "5-7 min",
    desc: "Investigate mystery cultures under a virtual microscope. Adjust magnification, tune focus, and identify bacteria, fungi, and protozoa.",
    icon: "🧫",
    gradient: "linear-gradient(135deg, #F9F5FF 0%, #ECE0FD 100%)",
    classRef: 'MicrobeDetectiveGame'
  },
  {
    id: "brain_maze",
    title: "Brain Maze",
    category: "Neuroscience",
    difficulty: "Intermediate",
    time: "5-8 min",
    desc: "Navigate an electrical action potential down axons, cross synaptic junctions, and release neurotransmitters along neural circuits.",
    icon: "🧠",
    gradient: "linear-gradient(135deg, #F7F5FE 0%, #E8E0FD 100%)",
    classRef: 'BrainMazeGame'
  },
  {
    id: "digestive_journey",
    title: "Digestive Journey",
    category: "Human Physiology",
    difficulty: "Beginner",
    time: "4-6 min",
    desc: "Follow food through the mouth, esophagus, stomach acid, and intestinal villi as macro-nutrients break down for assimilation.",
    icon: "🥨",
    gradient: "linear-gradient(135deg, #FFF9F2 0%, #FFEEDD 100%)",
    classRef: 'DigestiveJourneyGame'
  },
  {
    id: "bloodstream_delivery",
    title: "Bloodstream Delivery Mission",
    category: "Human Physiology",
    difficulty: "Intermediate",
    time: "5-8 min",
    desc: "Pilot erythrocytes to bind oxygen in the lungs, perfuse muscle tissues, and deploy thrombocyte platelets to clot damaged vessels.",
    icon: "🩸",
    gradient: "linear-gradient(135deg, #FFF5F5 0%, #FFE0E0 100%)",
    classRef: 'BloodstreamDeliveryGame'
  }
];

class BioQuestApp {
  constructor() {
    this.currentView = 'home';
    this.activeGameInstance = null;
    this.activeGameId = null;
    this.selectedCategory = 'All';
    this.selectedDifficulty = 'All';
    this.searchQuery = '';
    this.learningHub = null;
    this.dashboard = null;
    this.leaderboard = null;
  }

  init() {
    this.setupNavigation();
    this.setupSoundControls();
    this.setupSearchAndFilters();
    this.setupDailyChallenge();
    this.initHeroScene();

    this.learningHub = new LearningZoneHub('learningZoneMount');
    this.dashboard = new PlayerDashboard('dashboardMount');
    this.leaderboard = new LeaderboardPage('leaderboardMount');

    // Subscribe to state changes for UI synchronization
    if (window.stateManager) {
      window.stateManager.subscribe(() => this.updatePlayerNav());
      this.updatePlayerNav();
    }

    this.renderFeaturedGames();
    this.renderGamesLibrary();
    this.renderContinuePlayingCard();

    // Check hash for initial routing
    const initialRoute = window.location.hash.replace('#', '') || 'home';
    this.switchView(initialRoute);
  }

  setupNavigation() {
    document.querySelectorAll('[data-route]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const route = el.getAttribute('data-route');
        this.switchView(route);
        if (window.soundEngine) window.soundEngine.playClick();
      });
    });

    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobileMenuToggle');
    const drawer = document.getElementById('mobileNavDrawer');
    if (mobileBtn && drawer) {
      mobileBtn.onclick = () => {
        drawer.classList.toggle('open');
        if (window.soundEngine) window.soundEngine.playClick();
      };

      drawer.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = () => drawer.classList.remove('open');
      });
    }

    // Hash change event
    window.addEventListener('hashchange', () => {
      const route = window.location.hash.replace('#', '') || 'home';
      this.switchView(route, false);
    });
  }

  switchView(route, updateHash = true) {
    if (route === 'game_arena') return; // Handled separately
    this.currentView = route;
    if (updateHash) window.location.hash = route;

    // Update nav links active class
    document.querySelectorAll('.nav-link').forEach(link => {
      const target = link.getAttribute('data-route');
      if (target === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Hide all view containers
    document.querySelectorAll('.app-view').forEach(view => {
      view.style.display = 'none';
    });

    // Close game arena if open
    const arena = document.getElementById('gameArenaView');
    if (arena) arena.classList.remove('active');

    // Show target view
    const targetEl = document.getElementById(`view_${route}`);
    if (targetEl) {
      targetEl.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Trigger component renders
    if (route === 'learning' && this.learningHub) {
      this.learningHub.init();
    } else if (route === 'progress' && this.dashboard) {
      this.dashboard.init();
    } else if (route === 'leaderboard' && this.leaderboard) {
      this.leaderboard.init();
    } else if (route === 'explore') {
      this.renderGamesLibrary();
    } else if (route === 'home') {
      this.renderFeaturedGames();
      this.renderContinuePlayingCard();
    }
  }

  setupSoundControls() {
    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn && window.soundEngine) {
      const updateIcon = () => {
        const isMuted = window.soundEngine.isMuted();
        soundBtn.innerHTML = isMuted ? '🔇' : '🔊';
        soundBtn.className = isMuted ? 'btn-sound-toggle muted' : 'btn-sound-toggle';
        soundBtn.title = isMuted ? "Unmute Sound Effects" : "Mute Sound Effects";
      };

      updateIcon();
      soundBtn.onclick = () => {
        window.soundEngine.toggleMute();
        updateIcon();
        if (!window.soundEngine.isMuted()) {
          window.soundEngine.playClick();
        }
      };
    }
  }

  updatePlayerNav() {
    const state = window.stateManager ? window.stateManager.state : null;
    if (!state) return;

    const usernameEl = document.getElementById('navUsername');
    const levelBadge = document.getElementById('navLevelBadge');
    const xpCounter = document.getElementById('navXpCounter');
    const avatarEl = document.getElementById('navAvatar');

    if (usernameEl) usernameEl.textContent = state.player.username;
    if (levelBadge) levelBadge.textContent = `Lvl ${state.player.level}`;
    if (xpCounter) xpCounter.innerHTML = `✨ ${state.player.xp} XP`;
    if (avatarEl) avatarEl.textContent = state.player.avatar;

    // Journey Dashboard on Home
    const jXP = document.getElementById('journeyXP');
    const jLvl = document.getElementById('journeyLevel');
    const jGames = document.getElementById('journeyGamesDone');
    const jAch = document.getElementById('journeyAchievements');

    if (jXP) jXP.textContent = state.player.xp;
    if (jLvl) jLvl.textContent = state.player.level;
    if (jGames) {
      const completed = Object.values(state.games || {}).filter(g => (g.stars[3] || 0) > 0).length;
      jGames.textContent = completed;
    }
    if (jAch) {
      jAch.textContent = Object.keys(state.achievements || {}).length;
    }
  }

  initHeroScene() {
    if (window.Hero3DScene) {
      new window.Hero3DScene('hero3dCanvas');
    }
  }

  renderFeaturedGames() {
    const mount = document.getElementById('featuredGamesGrid');
    if (!mount) return;

    // Feature top 3 engaging games
    const featured = GAME_CATALOG.slice(0, 3);
    mount.innerHTML = featured.map(g => this.createGameCardHtml(g)).join('');
    this.attachGameCardActions(mount);
  }

  renderContinuePlayingCard() {
    const mount = document.getElementById('continuePlayingMount');
    if (!mount) return;

    const state = window.stateManager ? window.stateManager.state : null;
    let latestGame = null;

    if (state && state.games) {
      const keys = Object.keys(state.games);
      if (keys.length > 0) {
        // Pick most recently played
        const sorted = keys.map(k => ({ id: k, ...state.games[k] }))
          .sort((a, b) => new Date(b.lastPlayed || 0) - new Date(a.lastPlayed || 0));
        const found = GAME_CATALOG.find(g => g.id === sorted[0].id);
        if (found) latestGame = { meta: found, prog: sorted[0] };
      }
    }

    if (latestGame) {
      const starsCount = (latestGame.prog.stars[1] ? 1 : 0) + (latestGame.prog.stars[2] ? 1 : 0) + (latestGame.prog.stars[3] ? 1 : 0);
      const percent = Math.round((starsCount / 3) * 100);

      mount.innerHTML = `
        <div class="continue-card">
          <div class="continue-left">
            <div class="continue-thumb">${latestGame.meta.icon}</div>
            <div class="continue-info">
              <span class="badge badge-mint">Resume Adventure</span>
              <h4 class="continue-title">${latestGame.meta.title}</h4>
              <span class="continue-meta">Level ${latestGame.prog.levelsUnlocked} of 3 Unlocked • High Score: ${latestGame.prog.bestScore}</span>
            </div>
          </div>
          <div class="continue-progress-box">
            <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 700;">
              <span>Mastery</span>
              <span>${percent}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${percent}%;"></div>
            </div>
          </div>
          <button class="btn btn-primary" onclick="window.launchGame('${latestGame.meta.id}', ${latestGame.prog.levelsUnlocked}, false)">
            RESUME PLAYING ➔
          </button>
        </div>
      `;
    } else {
      mount.innerHTML = `
        <div class="continue-card">
          <div class="continue-left">
            <div class="continue-thumb">🔬</div>
            <div class="continue-info">
              <span class="badge badge-blue">Ready for Takeoff</span>
              <h4 class="continue-title">Start your first biology mission: Cell Explorer</h4>
              <span class="continue-meta">Explore animal cell organelles in interactive 3D</span>
            </div>
          </div>
          <button class="btn btn-primary" onclick="window.launchGame('cell_explorer', 1, false)">
            START GAME ➔
          </button>
        </div>
      `;
    }
  }

  setupSearchAndFilters() {
    const searchInput = document.getElementById('gameSearchInput');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderGamesLibrary();
      };
    }

    // Category Tabs Scroll
    const catContainer = document.getElementById('categoryTabsScroll');
    if (catContainer) {
      const categories = [
        "All", "Cell Biology", "Human Anatomy", "Genetics", "Immunology",
        "Ecology", "Plant Biology", "Microbiology", "Neuroscience", "Human Physiology"
      ];

      catContainer.innerHTML = categories.map(cat => `
        <button class="category-tab-btn ${cat === this.selectedCategory ? 'active' : ''}" data-cat="${cat}">
          ${cat}
        </button>
      `).join('');

      catContainer.querySelectorAll('.category-tab-btn').forEach(btn => {
        btn.onclick = () => {
          this.selectedCategory = btn.getAttribute('data-cat');
          catContainer.querySelectorAll('.category-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (window.soundEngine) window.soundEngine.playClick();
          this.renderGamesLibrary();
        };
      });
    }

    // Difficulty Pills
    document.querySelectorAll('.difficulty-pill-group .filter-pill').forEach(pill => {
      pill.onclick = () => {
        this.selectedDifficulty = pill.getAttribute('data-diff');
        document.querySelectorAll('.difficulty-pill-group .filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        if (window.soundEngine) window.soundEngine.playClick();
        this.renderGamesLibrary();
      };
    });
  }

  renderGamesLibrary() {
    const mount = document.getElementById('gamesLibraryGrid');
    if (!mount) return;

    let filtered = GAME_CATALOG.filter(game => {
      // Category match
      const matchCat = this.selectedCategory === 'All' || game.category.toLowerCase() === this.selectedCategory.toLowerCase();
      // Difficulty match
      const matchDiff = this.selectedDifficulty === 'All' || game.difficulty.toLowerCase().includes(this.selectedDifficulty.toLowerCase());
      // Search match
      const matchSearch = this.searchQuery === '' ||
        game.title.toLowerCase().includes(this.searchQuery) ||
        game.desc.toLowerCase().includes(this.searchQuery) ||
        game.category.toLowerCase().includes(this.searchQuery);

      return matchCat && matchDiff && matchSearch;
    });

    if (filtered.length === 0) {
      mount.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 0;">
          <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
          <h4 style="font-size: 1.2rem; font-weight: 800; color: var(--text-main);">No matching games found</h4>
          <p style="font-size: 0.9rem; color: var(--text-muted);">Try clearing your search query or choosing another category filter.</p>
        </div>
      `;
      return;
    }

    mount.innerHTML = filtered.map(g => this.createGameCardHtml(g)).join('');
    this.attachGameCardActions(mount);
  }

  createGameCardHtml(game) {
    const state = window.stateManager ? window.stateManager.state : null;
    const progress = state && state.games ? state.games[game.id] : null;

    const stars = progress ? (progress.stars || {}) : {};
    const starTotal = (stars[1] ? 1 : 0) + (stars[2] ? 1 : 0) + (stars[3] ? 1 : 0);
    const bestScore = progress ? (progress.bestScore || 0) : 0;

    return `
      <div class="game-card" data-game="${game.id}">
        <!-- Visual Banner with SVG Illustration -->
        <div class="game-card-visual" style="background: ${game.gradient};">
          <div style="font-size: 4.8rem; filter: drop-shadow(0 6px 14px rgba(0,0,0,0.1));">
            ${game.icon}
          </div>
          <div class="game-card-badges">
            <span class="badge badge-mint">${game.category}</span>
            <span class="game-time-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${game.time}
            </span>
          </div>
        </div>

        <!-- Body -->
        <div class="game-card-body">
          <div class="game-card-cat-row">
            <span class="badge badge-blue">${game.difficulty}</span>
          </div>
          <h3 class="game-card-title">${game.title}</h3>
          <p class="game-card-desc">${game.desc}</p>

          <!-- Star & Progress Badge if played -->
          <div class="game-card-progress">
            <div class="game-card-stars">
              <span class="${starTotal >= 1 ? 'star-active' : ''}">★</span>
              <span class="${starTotal >= 2 ? 'star-active' : ''}">★</span>
              <span class="${starTotal >= 3 ? 'star-active' : ''}">★</span>
            </div>
            <span class="game-card-best-score">Best: ${bestScore} pts</span>
          </div>

          <!-- Actions -->
          <div class="game-card-actions">
            <button class="btn btn-demo btn-watch-demo" data-game="${game.id}">
              <span>🎓</span> WATCH DEMO
            </button>
            <button class="btn btn-primary btn-play-game" data-game="${game.id}">
              <span>▶</span> PLAY NOW
            </button>
          </div>
        </div>
      </div>
    `;
  }

  attachGameCardActions(container) {
    container.querySelectorAll('.btn-watch-demo').forEach(btn => {
      btn.onclick = () => {
        const gameId = btn.getAttribute('data-game');
        if (window.soundEngine) window.soundEngine.playClick();
        this.launchGame(gameId, 1, true);
      };
    });

    container.querySelectorAll('.btn-play-game').forEach(btn => {
      btn.onclick = () => {
        const gameId = btn.getAttribute('data-game');
        if (window.soundEngine) window.soundEngine.playClick();
        this.launchGame(gameId, 1, false);
      };
    });
  }

  launchGame(gameId, level = 1, isDemo = false) {
    const gameMeta = GAME_CATALOG.find(g => g.id === gameId);
    if (!gameMeta) return;

    this.activeGameId = gameId;

    const arena = document.getElementById('gameArenaView');
    const titleEl = document.getElementById('arenaGameTitle');
    const catEl = document.getElementById('arenaGameCategory');
    const mount = document.getElementById('gameArenaBoard');

    if (titleEl) titleEl.textContent = gameMeta.title;
    if (catEl) catEl.textContent = `${gameMeta.category} • ${gameMeta.difficulty}`;

    // Render level progression tabs
    this.renderArenaLevelTabs(gameId, level);

    arena.classList.add('active');

    // Instantiate corresponding game engine class
    const className = gameMeta.classRef;
    if (window[className]) {
      this.activeGameInstance = new window[className]('gameArenaBoard');
      this.activeGameInstance.init(level, isDemo);
    }
  }

  renderArenaLevelTabs(gameId, currentLevel) {
    const mount = document.getElementById('arenaLevelTabsMount');
    if (!mount) return;

    const state = window.stateManager ? window.stateManager.state : null;
    const progress = state && state.games ? state.games[gameId] : null;
    const unlocked = progress ? (progress.levelsUnlocked || 1) : 1;

    mount.innerHTML = [1, 2, 3].map(lvl => {
      const isUnlocked = lvl <= unlocked;
      const isActive = lvl === currentLevel;
      return `
        <button class="level-tab-btn ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}" data-lvl="${lvl}">
          ${!isUnlocked ? '🔒' : '⭐'} Level ${lvl}
        </button>
      `;
    }).join('');

    mount.querySelectorAll('.level-tab-btn').forEach(btn => {
      btn.onclick = () => {
        const lvl = parseInt(btn.getAttribute('data-lvl'));
        if (lvl <= unlocked) {
          if (window.soundEngine) window.soundEngine.playClick();
          this.launchGame(gameId, lvl, false);
        }
      };
    });
  }

  closeGameArena() {
    const arena = document.getElementById('gameArenaView');
    if (arena) arena.classList.remove('active');
    this.activeGameInstance = null;
    this.activeGameId = null;

    // Refresh views
    this.renderGamesLibrary();
    this.renderFeaturedGames();
    this.renderContinuePlayingCard();
  }

  setupDailyChallenge() {
    const startBtn = document.getElementById('btnStartDailyChallenge');
    const state = window.stateManager ? window.stateManager.state : null;
    const today = new Date().toDateString();

    const checkStatus = () => {
      if (state && state.dailyChallenge && state.dailyChallenge.completedDate === today) {
        if (startBtn) {
          startBtn.textContent = "✓ Completed Today (+25 XP)";
          startBtn.className = "btn btn-outline";
          startBtn.disabled = true;
        }
      }
    };
    checkStatus();

    if (startBtn) {
      startBtn.onclick = () => {
        // Daily Challenge popup question
        const q = {
          text: "Daily Science Challenge: What is the primary structural carbohydrate in plant cell walls that humans cannot digest without specialized cellulase?",
          answer: "Cellulose"
        };

        const response = prompt(`${q.text}\n\nType your answer:`, "Cellulose");
        if (response && response.trim().toLowerCase() === "cellulose") {
          if (window.soundEngine) window.soundEngine.playFanfare();
          if (window.triggerConfetti) window.triggerConfetti();

          if (window.stateManager) {
            window.stateManager.claimReward(`daily_${today}`, 25, "Daily Biology Challenge");
            state.dailyChallenge.completedDate = today;
            window.stateManager.saveState();
          }
          alert("🎉 Outstanding! Cellulose is an unbranched polymer of beta-glucose forming rigid plant microfibrils. +25 XP awarded!");
          checkStatus();
        } else if (response !== null) {
          if (window.soundEngine) window.soundEngine.playWrong();
          alert("Not quite! Hint: It starts with 'C' and is an insoluble fiber polymer of beta-glucose.");
        }
      };
    }
  }
}

// Global Launch Game helper
window.launchGame = (gameId, level = 1, isDemo = false) => {
  if (window.bioQuestApp) {
    window.bioQuestApp.launchGame(gameId, level, isDemo);
  }
};

// Global Game Completion Modal
window.showGameCompletionModal = ({ gameId, gameTitle, level, score, stars = 3, learningTakeaway, onReplay, onNext }) => {
  let modal = document.getElementById('completionModalBackdrop');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'completionModalBackdrop';
    modal.className = 'modal-backdrop';
    document.body.appendChild(modal);
  }

  const bonusXP = stars === 3 ? 50 : 0;
  const levelXP = 30;
  const fullGameBonus = level === 3 ? 100 : 0;
  const totalEarned = levelXP + bonusXP + fullGameBonus;

  modal.innerHTML = `
    <div class="completion-modal-card">
      <div class="modal-crown">👑</div>
      <h3 class="modal-title">Mission Accomplished!</h3>
      <p class="modal-subtitle">${gameTitle} • Level ${level} Cleared</p>

      <!-- 3-Star Rating -->
      <div class="modal-stars-row">
        <span class="star ${stars >= 1 ? 'earned' : ''}">★</span>
        <span class="star ${stars >= 2 ? 'earned' : ''}">★</span>
        <span class="star ${stars >= 3 ? 'earned' : ''}">★</span>
      </div>

      <!-- XP Breakdown -->
      <div class="reward-breakdown-box">
        <div class="reward-row">
          <span>Mission Level Completion</span>
          <span class="val">+${levelXP} XP</span>
        </div>
        ${level === 3 ? `
          <div class="reward-row">
            <span>Full Game Mastery (Level 3)</span>
            <span class="val">+100 XP</span>
          </div>
        ` : ''}
        ${bonusXP > 0 ? `
          <div class="reward-row">
            <span>Perfect 3-Star Bonus</span>
            <span class="val">+${bonusXP} XP</span>
          </div>
        ` : ''}
        <div class="reward-row total-row">
          <span>Total XP Earned</span>
          <span class="val">+${totalEarned} XP</span>
        </div>
      </div>

      <!-- Biology Takeaway -->
      <div class="modal-learning-tip">
        <strong>💡 Biological Insight:</strong><br>${learningTakeaway}
      </div>

      <!-- Action Buttons -->
      <div class="modal-actions-row">
        <button class="btn btn-outline" id="modalBtnReplay">↺ Replay Level</button>
        ${onNext ? `
          <button class="btn btn-primary" id="modalBtnNext">Next Level ➔</button>
        ` : `
          <button class="btn btn-primary" id="modalBtnLibrary">Explore More ➔</button>
        `}
      </div>
    </div>
  `;

  modal.classList.add('open');

  document.getElementById('modalBtnReplay').onclick = () => {
    modal.classList.remove('open');
    if (onReplay) onReplay();
  };

  const nextBtn = document.getElementById('modalBtnNext');
  if (nextBtn && onNext) {
    nextBtn.onclick = () => {
      modal.classList.remove('open');
      onNext();
    };
  }

  const libBtn = document.getElementById('modalBtnLibrary');
  if (libBtn) {
    libBtn.onclick = () => {
      modal.classList.remove('open');
      if (window.bioQuestApp) {
        window.bioQuestApp.closeGameArena();
        window.bioQuestApp.switchView('explore');
      }
    };
  }
};

// Canvas Confetti Celebration
window.triggerConfetti = () => {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#61C9A8', '#74B9FF', '#B49AFF', '#FFE28A', '#FFB89B', '#FF6B6B'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.7) * 18,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 10
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // Gravity
      p.alpha -= 0.015;
      p.rotation += p.spin;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (alive) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  animate();
};

// Bootstrap application on window load
window.addEventListener('DOMContentLoaded', () => {
  window.bioQuestApp = new BioQuestApp();
  window.bioQuestApp.init();

  // Arena Back Button
  const backBtn = document.getElementById('btnArenaBack');
  if (backBtn) {
    backBtn.onclick = () => {
      window.bioQuestApp.closeGameArena();
    };
  }
});
