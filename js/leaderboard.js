/* ============================================================
   BIOQUEST - Leaderboard Component
   Top 3 Podium, Transparent Sample Classmates & Dynamic User Ranking
   ============================================================ */

class LeaderboardPage {
  constructor(containerId) {
    this.container = document.getElementById(containerId);

    // Initial demonstration roster of sample student classmates
    this.sampleStudents = [
      { id: 's1', username: 'Aria Chen', xp: 1450, level: 5, games: 10, avatar: '🔬', isSample: true },
      { id: 's2', username: 'Lucas Silva', xp: 1120, level: 5, games: 9, avatar: '🧬', isSample: true },
      { id: 's3', username: 'Priya Sharma', xp: 880, level: 4, games: 7, avatar: '🌿', isSample: true },
      { id: 's4', username: 'Ethan Brooks', xp: 620, level: 4, games: 5, avatar: '🧠', isSample: true },
      { id: 's5', username: 'Maya Patel', xp: 480, level: 3, games: 4, avatar: '🧫', isSample: true },
      { id: 's6', username: 'David Kim', xp: 260, level: 2, games: 3, avatar: '🫀', isSample: true }
    ];
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;
    const state = window.stateManager ? window.stateManager.state : { player: {}, games: {} };
    const user = state.player || { username: 'BioAdventurer', avatar: '🧬', xp: 0, level: 1 };

    // Calculate completed games for user
    const completedGames = Object.values(state.games || {}).filter(g => (g.stars[3] || 0) > 0).length;

    // Combine user with sample student roster and sort by XP descending
    const combined = [
      ...this.sampleStudents,
      {
        id: 'current_user',
        username: user.username,
        xp: user.xp,
        level: user.level,
        games: completedGames,
        avatar: user.avatar,
        isUser: true,
        isSample: false
      }
    ];

    combined.sort((a, b) => b.xp - a.xp);

    const top1 = combined[0];
    const top2 = combined[1];
    const top3 = combined[2];

    this.container.innerHTML = `
      <div class="leaderboard-view">
        <div class="container">
          <!-- Hero Header -->
          <div class="leaderboard-hero">
            <span class="badge badge-mint">Global Standings</span>
            <h1>Biology Adventurers Leaderboard</h1>
            <p>Compete with fellow biology students, earn experience points by solving missions, and climb the ranking tiers.</p>
            <div class="sample-notice-banner">
              <span>ℹ️ Demonstration Notice: Classmate entries are simulated sample data for classroom testing.</span>
            </div>
          </div>

          <!-- Top 3 Podium -->
          <div class="podium-container">
            <!-- Rank 2: Silver -->
            <div class="podium-card rank-2">
              <span class="podium-crown">🥈</span>
              <div class="podium-avatar">${top2.avatar}</div>
              <h4 class="podium-name">${top2.username}</h4>
              <span class="podium-role-tag">${top2.isUser ? 'You' : 'Sample Student'}</span>
              <span class="podium-xp-badge">${top2.xp} XP</span>
            </div>

            <!-- Rank 1: Gold -->
            <div class="podium-card rank-1">
              <span class="podium-crown">👑</span>
              <div class="podium-avatar">${top1.avatar}</div>
              <h4 class="podium-name">${top1.username}</h4>
              <span class="podium-role-tag">${top1.isUser ? 'You' : 'Sample Student'}</span>
              <span class="podium-xp-badge">${top1.xp} XP</span>
            </div>

            <!-- Rank 3: Bronze -->
            <div class="podium-card rank-3">
              <span class="podium-crown">🥉</span>
              <div class="podium-avatar">${top3.avatar}</div>
              <h4 class="podium-name">${top3.username}</h4>
              <span class="podium-role-tag">${top3.isUser ? 'You' : 'Sample Student'}</span>
              <span class="podium-xp-badge">${top3.xp} XP</span>
            </div>
          </div>

          <!-- Full Leaderboard Table -->
          <div class="leaderboard-table-card">
            <!-- Table Header -->
            <div class="leaderboard-row header-row">
              <span>Rank</span>
              <span>Student</span>
              <span>XP Points</span>
              <span class="col-level">Level</span>
              <span class="col-games" style="text-align: right;">Games Done</span>
            </div>

            <!-- Rows -->
            ${combined.map((player, idx) => `
              <div class="leaderboard-row ${player.isUser ? 'user-row' : ''}">
                <span class="rank-num">#${idx + 1}</span>
                <div class="leaderboard-player-cell">
                  <div class="player-table-avatar">${player.avatar}</div>
                  <div class="player-table-name">
                    <span>${player.username}</span>
                    ${player.isUser ? `<span class="you-tag">YOU</span>` : `<span class="sample-tag">Sample Classmate</span>`}
                  </div>
                </div>
                <span class="player-table-xp">${player.xp} XP</span>
                <span class="player-table-level col-level">Lvl ${player.level}</span>
                <span class="player-table-games col-games">${player.games} Games</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
}

window.LeaderboardPage = LeaderboardPage;
