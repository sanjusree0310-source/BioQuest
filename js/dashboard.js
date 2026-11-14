/* ============================================================
   BIOQUEST - Player Dashboard & Progress Tracker
   Comprehensive Analytics, Achievements Showcase & Save State
   ============================================================ */

class PlayerDashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;
    const state = window.stateManager ? window.stateManager.state : { player: {}, games: {}, achievements: {}, history: [] };
    const player = state.player || { username: 'BioAdventurer', avatar: '🧬', xp: 0, level: 1, title: 'Biology Beginner' };
    const lvlInfo = window.stateManager ? window.stateManager.getLevelInfo(player.xp) : { minXP: 0, maxXP: 100, level: 1, name: 'Biology Beginner' };

    // Calculations
    const gamesPlayedKeys = Object.keys(state.games || {});
    const gamesPlayedCount = gamesPlayedKeys.length;
    let completedGamesCount = 0;
    let totalScoreSum = 0;

    gamesPlayedKeys.forEach(k => {
      const g = state.games[k];
      if (g.levelsUnlocked >= 3 && (g.stars[3] || 0) > 0) {
        completedGamesCount++;
      }
      totalScoreSum += (g.bestScore || 0);
    });

    const avgScore = gamesPlayedCount > 0 ? Math.round(totalScoreSum / gamesPlayedCount) : 0;
    const achievementsCount = Object.keys(state.achievements || {}).length;

    // XP Progress within current level
    const xpInLevel = player.xp - lvlInfo.minXP;
    const levelSpan = Math.max(1, lvlInfo.maxXP - lvlInfo.minXP);
    const progressPercent = Math.min(100, Math.round((xpInLevel / levelSpan) * 100));

    this.container.innerHTML = `
      <div class="dashboard-view">
        <div class="container">
          <!-- Profile Card -->
          <div class="profile-banner-card">
            <div class="profile-main-left">
              <div class="profile-avatar-large" id="avatarSelectorBtn" title="Click to change avatar">
                <span id="profileAvatarDisplay">${player.avatar}</span>
                <div class="avatar-edit-badge">✏️</div>
              </div>
              <div class="profile-title-col">
                <div class="profile-name-row">
                  <input type="text" class="profile-username-input" id="inputUsername" value="${player.username}" maxlength="16" title="Click to edit username">
                  <span class="badge badge-yellow">Level ${player.level}</span>
                </div>
                <span class="profile-rank-title">${player.title}</span>
              </div>
            </div>

            <!-- Level Progression Box -->
            <div class="profile-level-progression">
              <div class="level-meta-row">
                <span>XP: ${player.xp} / ${lvlInfo.maxXP === 99999 ? 'MAX' : lvlInfo.maxXP}</span>
                <span>${progressPercent}% to next rank</span>
              </div>
              <div class="level-bar-shell">
                <div class="level-bar-progress" style="width: ${progressPercent}%;"></div>
              </div>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="dashboard-stats-grid">
            <div class="metric-card">
              <div class="metric-icon-box" style="background: var(--primary-light); color: var(--primary);">🎮</div>
              <div class="metric-data">
                <span class="metric-val">${gamesPlayedCount}</span>
                <span class="metric-label">Games Played</span>
              </div>
            </div>

            <div class="metric-card">
              <div class="metric-icon-box" style="background: var(--secondary-light); color: var(--secondary);">🏆</div>
              <div class="metric-data">
                <span class="metric-val">${completedGamesCount}</span>
                <span class="metric-label">Completed Games</span>
              </div>
            </div>

            <div class="metric-card">
              <div class="metric-icon-box" style="background: #FFF9E5; color: #D4A517;">⭐</div>
              <div class="metric-data">
                <span class="metric-val">${avgScore}</span>
                <span class="metric-label">Average High Score</span>
              </div>
            </div>

            <div class="metric-card">
              <div class="metric-icon-box" style="background: #F4EFFF; color: var(--accent-lavender);">🎖️</div>
              <div class="metric-data">
                <span class="metric-val">${achievementsCount} / 8</span>
                <span class="metric-label">Achievements Unlocked</span>
              </div>
            </div>
          </div>

          <!-- Two Column Content Split -->
          <div class="dashboard-content-split">
            <!-- Left: Achievements Showcase -->
            <div class="achievements-card">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--text-main);">Achievement Badges</h3>
                <span class="badge badge-lavender">${achievementsCount} of 8 Unlocked</span>
              </div>
              <div class="achievements-grid">
                ${ACHIEVEMENTS_DATA.map(ach => {
                  const unlocked = state.achievements && state.achievements[ach.id];
                  return `
                    <div class="achievement-item ${unlocked ? 'unlocked' : ''}">
                      <div class="achievement-icon">${ach.icon}</div>
                      <div class="achievement-info">
                        <h6 class="achievement-title">${ach.title}</h6>
                        <span class="achievement-desc">${ach.desc}</span>
                        ${unlocked ? `<span style="font-size: 0.65rem; color: var(--primary); font-weight: 800; margin-top: 3px;">✓ Unlocked</span>` : `<span style="font-size: 0.65rem; color: var(--text-light); font-weight: 700; margin-top: 3px;">🔒 Locked</span>`}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Right: Recent Game Activity History -->
            <div class="activity-card">
              <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--text-main);">Recent Activity Log</h3>
              <div class="activity-list">
                ${(state.history && state.history.length > 0) ? state.history.slice(0, 6).map(h => `
                  <div class="activity-row">
                    <div class="activity-left">
                      <div class="activity-icon-badge">🧬</div>
                      <div class="activity-meta">
                        <h5>${h.gameId.replace('_', ' ').toUpperCase()} (Lvl ${h.level})</h5>
                        <span>${h.date} • Rating: ${'⭐'.repeat(h.stars)}</span>
                      </div>
                    </div>
                    <span class="activity-score-badge">+${h.score} Pts</span>
                  </div>
                `).join('') : `
                  <div style="text-align: center; padding: 32px 0; color: var(--text-muted); font-size: 0.9rem;">
                    No game history yet. Head over to <strong>Explore Games</strong> to embark on your first adventure!
                  </div>
                `}
              </div>
            </div>
          </div>

          <!-- Bottom Management Bar: Reset Data Option -->
          <div class="dashboard-bottom-bar">
            <div>
              <h5 style="font-size: 0.95rem; font-weight: 800; color: var(--text-main);">Demo Reset Controls</h5>
              <p style="font-size: 0.8rem; color: var(--text-muted);">Reset player XP, level progress and unlocked badges for a fresh college demonstration.</p>
            </div>
            <button class="btn-danger-outline" id="btnResetProgress">Reset All Data 🗑️</button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    // Edit username
    const usernameInput = document.getElementById('inputUsername');
    if (usernameInput) {
      usernameInput.onchange = (e) => {
        const newName = e.target.value.trim();
        if (newName && window.stateManager) {
          window.stateManager.updateProfile(newName, null);
          if (window.soundEngine) window.soundEngine.playClick();
        }
      };
    }

    // Avatar picker modal
    const avatarBtn = document.getElementById('avatarSelectorBtn');
    if (avatarBtn) {
      avatarBtn.onclick = () => {
        const avatars = ['🧬', '🌿', '🔬', '🧠', '🧫', '🫀', '🦠', '🦅', '🦊'];
        const chosen = prompt(`Choose an avatar emoji:\n${avatars.join('  ')}`, '🧬');
        if (chosen && window.stateManager) {
          window.stateManager.updateProfile(null, chosen.trim());
          this.render();
          if (window.soundEngine) window.soundEngine.playClick();
        }
      };
    }

    // Reset progress button
    const resetBtn = document.getElementById('btnResetProgress');
    if (resetBtn) {
      resetBtn.onclick = () => {
        if (confirm("Are you sure you want to reset all game data and start over from Level 1?")) {
          if (window.stateManager) {
            window.stateManager.resetProgress();
            this.render();
          }
        }
      };
    }
  }
}

window.PlayerDashboard = PlayerDashboard;
