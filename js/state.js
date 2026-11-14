/* ============================================================
   BIOQUEST - State Manager & Progression Engine
   Handles Player XP, Levels, Achievements, Persistence & Stats
   ============================================================ */

const LEVEL_THRESHOLDS = [
  { level: 1, name: "Biology Beginner", minXP: 0, maxXP: 100 },
  { level: 2, name: "Cell Explorer", minXP: 100, maxXP: 300 },
  { level: 3, name: "Life Discoverer", minXP: 300, maxXP: 600 },
  { level: 4, name: "Science Adventurer", minXP: 600, maxXP: 1000 },
  { level: 5, name: "Biology Master", minXP: 1000, maxXP: 99999 }
];

const ACHIEVEMENTS_DATA = [
  { id: "first_adventure", title: "First Adventure", desc: "Launch and play your first Biology game", icon: "🚀" },
  { id: "cell_detective", title: "Cell Detective", desc: "Successfully restore all organelles in Cell Explorer", icon: "🔬" },
  { id: "body_builder", title: "Body Builder", desc: "Assemble human organs in Body Builder Challenge", icon: "🫀" },
  { id: "dna_decoder", title: "DNA Decoder", desc: "Solve complementary base pairs in DNA Code Breaker", icon: "🧬" },
  { id: "germ_expert", title: "Germ Expert", desc: "Defend against pathogens in Germ Busters", icon: "🛡️" },
  { id: "eco_guardian", title: "Eco Guardian", desc: "Balance the food web in Eco World", icon: "🌍" },
  { id: "perfect_score", title: "Perfect Score", desc: "Earn a maximum 3-star rating on any level", icon: "⭐" },
  { id: "master_explorer", title: "Master Explorer", desc: "Reach Level 5: Biology Master", icon: "👑" }
];

class StateManager {
  constructor() {
    this.storageKey = 'bioquest_state_v1';
    this.listeners = [];
    this.state = this.loadState();
  }

  getDefaultState() {
    return {
      player: {
        username: "BioAdventurer",
        avatar: "🧬",
        xp: 0,
        level: 1,
        title: "Biology Beginner"
      },
      games: {
        // Will store: { [gameId]: { levelsUnlocked: 1, stars: { 1: 0, 2: 0, 3: 0 }, bestScore: 0, timesPlayed: 0, lastPlayed: null } }
      },
      achievements: {}, // { [id]: unlockTimestamp }
      claimedRewards: {}, // Prevent duplicate XP: { [rewardId]: true }
      dailyChallenge: {
        completedDate: null,
        xpEarned: 0
      },
      knowledgeChecks: {}, // { [topicId]: true }
      history: [] // [{ gameId, level, score, stars, date }]
    };
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...this.getDefaultState(), ...parsed };
      }
    } catch (e) {
      console.warn("Could not load bioquest state, using defaults:", e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      this.notifyListeners();
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try { cb(this.state); } catch (e) { console.error(e); }
    });
  }

  // XP & Level calculations
  getLevelInfo(xp = this.state.player.xp) {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_THRESHOLDS[i].minXP) {
        return LEVEL_THRESHOLDS[i];
      }
    }
    return LEVEL_THRESHOLDS[0];
  }

  addXP(amount, reason = "Game Action") {
    if (amount <= 0) return;
    const oldLevel = this.getLevelInfo(this.state.player.xp).level;
    this.state.player.xp += amount;
    
    const newLvlInfo = this.getLevelInfo(this.state.player.xp);
    this.state.player.level = newLvlInfo.level;
    this.state.player.title = newLvlInfo.name;

    this.saveState();

    // Check level up event
    if (newLvlInfo.level > oldLevel) {
      if (window.soundEngine) window.soundEngine.playLevelUp();
      this.showToast(`Level Up! You are now a ${newLvlInfo.name}!`, "toast-level", "🎉");
      if (newLvlInfo.level >= 5) {
        this.unlockAchievement("master_explorer");
      }
    } else {
      this.showToast(`+${amount} XP (${reason})`, "toast-xp", "✨");
    }

    return {
      totalXP: this.state.player.xp,
      level: newLvlInfo.level,
      levelName: newLvlInfo.name,
      leveledUp: newLvlInfo.level > oldLevel
    };
  }

  // Prevent duplicate XP rewards
  claimReward(rewardId, amount, reason) {
    if (this.state.claimedRewards[rewardId]) {
      return false; // Already claimed
    }
    this.state.claimedRewards[rewardId] = true;
    this.addXP(amount, reason);
    return true;
  }

  // Record completed game level
  recordGameCompletion(gameId, level, score, stars = 3) {
    if (!this.state.games[gameId]) {
      this.state.games[gameId] = {
        levelsUnlocked: 1,
        stars: { 1: 0, 2: 0, 3: 0 },
        bestScore: 0,
        timesPlayed: 0,
        lastPlayed: null
      };
    }

    const g = this.state.games[gameId];
    g.timesPlayed += 1;
    g.lastPlayed = new Date().toISOString();
    if (score > g.bestScore) g.bestScore = score;
    if (stars > (g.stars[level] || 0)) g.stars[level] = stars;

    // Unlock next level if currently on highest
    if (level >= g.levelsUnlocked && level < 3) {
      g.levelsUnlocked = level + 1;
    }

    // Record history entry
    this.state.history.unshift({
      gameId,
      level,
      score,
      stars,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    });
    if (this.state.history.length > 20) {
      this.state.history.pop();
    }

    // Award XP
    // Answer / action XP: 10 * correct items
    // Completed level mission: 30 XP
    const missionRewardId = `${gameId}_lvl_${level}_mission`;
    this.claimReward(missionRewardId, 30, `Mission Completed`);

    // Completed full game (Level 3): 100 XP
    if (level === 3) {
      const fullGameRewardId = `${gameId}_full_completion`;
      this.claimReward(fullGameRewardId, 100, `Completed Game`);
    }

    // Perfect game bonus (3 stars): 50 bonus XP
    if (stars === 3) {
      const perfectRewardId = `${gameId}_lvl_${level}_perfect`;
      this.claimReward(perfectRewardId, 50, `Perfect Score Bonus`);
      this.unlockAchievement("perfect_score");
    }

    // Check specific achievements
    this.unlockAchievement("first_adventure");
    if (gameId === "cell_explorer") this.unlockAchievement("cell_detective");
    if (gameId === "body_builder") this.unlockAchievement("body_builder");
    if (gameId === "dna_codebreaker") this.unlockAchievement("dna_decoder");
    if (gameId === "germ_busters") this.unlockAchievement("germ_expert");
    if (gameId === "eco_world") this.unlockAchievement("eco_guardian");

    this.saveState();
  }

  unlockAchievement(id) {
    if (this.state.achievements[id]) return; // already unlocked
    const ach = ACHIEVEMENTS_DATA.find(a => a.id === id);
    if (!ach) return;

    this.state.achievements[id] = new Date().toISOString();
    this.saveState();

    if (window.soundEngine) window.soundEngine.playAchievement();
    this.showToast(`Achievement Unlocked: ${ach.title}!`, "toast-achievement", ach.icon);
  }

  // Update Username or Avatar
  updateProfile(username, avatar) {
    if (username) this.state.player.username = username.trim().slice(0, 18);
    if (avatar) this.state.player.avatar = avatar;
    this.saveState();
  }

  // Reset all progress (testing / restart)
  resetProgress() {
    this.state = this.getDefaultState();
    localStorage.removeItem(this.storageKey);
    this.saveState();
  }

  // Toast UI notification popup
  showToast(message, extraClass = "", icon = "✨") {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${extraClass}`;
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-body">
        <div class="toast-title">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }
}

// Global state instance
window.stateManager = new StateManager();
