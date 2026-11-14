/* ============================================================
   BIOQUEST - Hero 3D Biology World Canvas
   Interactive 3D Animated DNA, Floating Cells, Molecules & Microbes
   Supports WebGL / 3D Canvas with Parallax Mouse Interaction
   ============================================================ */

class Hero3DScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.time = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetRotX = 0;
    this.targetRotY = 0;
    this.rotX = 0;
    this.rotY = 0;

    this.particles = [];
    this.dnaBases = [];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse parallax tracking
    const parentCard = this.canvas.closest('.hero-canvas-card') || this.canvas;
    parentCard.addEventListener('mousemove', (e) => {
      const rect = parentCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      this.targetRotY = x * 0.8;
      this.targetRotX = -y * 0.8;
    });

    parentCard.addEventListener('mouseleave', () => {
      this.targetRotX = 0;
      this.targetRotY = 0;
    });

    // Generate DNA Double Helix 3D nodes
    const turns = 3.5;
    const basePairs = 48;
    for (let i = 0; i < basePairs; i++) {
      const t = (i / basePairs) * Math.PI * 2 * turns;
      const y = (i / basePairs - 0.5) * 380;
      const radius = 64;

      this.dnaBases.push({
        t: t,
        baseY: y,
        radius: radius,
        pairType: i % 2 === 0 ? 'AT' : 'GC',
        color1: i % 2 === 0 ? '#61C9A8' : '#B49AFF', // A / G
        color2: i % 2 === 0 ? '#74B9FF' : '#FFB89B'  // T / C
      });
    }

    // Generate floating microorganisms, cells & plant vesicles
    const types = ['cell', 'mitochondria', 'molecule', 'microbe', 'plant_spore'];
    for (let i = 0; i < 28; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * 360,
        y: (Math.random() - 0.5) * 360,
        z: (Math.random() - 0.5) * 250,
        radius: 6 + Math.random() * 16,
        type: types[i % types.length],
        speed: 0.4 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        color: ['#61C9A8', '#74B9FF', '#B49AFF', '#FFE28A', '#FFB89B'][i % 5]
      });
    }

    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  animate() {
    this.time += 0.02;

    // Smooth inertia interpolation
    this.rotX += (this.targetRotX - this.rotX) * 0.08;
    this.rotY += (this.targetRotY - this.rotY) * 0.08;

    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  // 3D Point Projection helper
  project(x, y, z) {
    // Rotate Y (DNA auto rotation + mouse interaction)
    const angleY = this.time * 0.8 + this.rotY;
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;

    // Rotate X
    const angleX = this.rotX + 0.15;
    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    // Perspective focal projection
    const fov = 400;
    const scale = fov / (fov + z2 + 200);
    const projX = this.width / 2 + x1 * scale;
    const projY = this.height / 2 + y2 * scale;

    return { x: projX, y: projY, z: z2, scale: scale };
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Subtle radial light gradient
    const grad = ctx.createRadialGradient(
      this.width / 2, this.height / 2, 40,
      this.width / 2, this.height / 2, Math.max(this.width, this.height) / 1.5
    );
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.7, 'rgba(240, 248, 255, 0.6)');
    grad.addColorStop(1, 'rgba(235, 245, 255, 0.2)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Collect all renderable elements for Z-sorting
    const renderList = [];

    // 1. DNA Rungs and Strands
    this.dnaBases.forEach(base => {
      const angle = base.t;
      // Strand 1
      const x1 = Math.cos(angle) * base.radius;
      const z1 = Math.sin(angle) * base.radius;
      const p1 = this.project(x1, base.baseY, z1);

      // Strand 2 (opposite side)
      const x2 = -Math.cos(angle) * base.radius;
      const z2 = -Math.sin(angle) * base.radius;
      const p2 = this.project(x2, base.baseY, z2);

      const avgZ = (p1.z + p2.z) / 2;

      renderList.push({
        type: 'dna_rung',
        z: avgZ,
        p1: p1,
        p2: p2,
        base: base
      });
    });

    // 2. Floating Biology Particles (Organelles, Microbes, ATP Molecules)
    this.particles.forEach(p => {
      const curY = p.y + Math.sin(this.time * p.speed + p.phase) * 18;
      const curX = p.x + Math.cos(this.time * 0.5 * p.speed + p.phase) * 12;
      const proj = this.project(curX, curY, p.z);

      renderList.push({
        type: 'particle',
        z: proj.z,
        proj: proj,
        particle: p
      });
    });

    // Sort by Z (painter's algorithm)
    renderList.sort((a, b) => b.z - a.z);

    // Draw sorted items
    renderList.forEach(item => {
      if (item.type === 'dna_rung') {
        const { p1, p2, base } = item;
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        // Base pair hydrogen bond connector
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = 'rgba(180, 200, 225, 0.45)';
        ctx.lineWidth = Math.max(1, 2.5 * ((p1.scale + p2.scale) / 2));
        ctx.stroke();

        // Base 1 Node
        ctx.beginPath();
        const r1 = Math.max(3, 7.5 * p1.scale);
        ctx.arc(p1.x, p1.y, r1, 0, Math.PI * 2);
        ctx.fillStyle = base.color1;
        ctx.shadowColor = base.color1;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Base 2 Node
        ctx.beginPath();
        const r2 = Math.max(3, 7.5 * p2.scale);
        ctx.arc(p2.x, p2.y, r2, 0, Math.PI * 2);
        ctx.fillStyle = base.color2;
        ctx.shadowColor = base.color2;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Central hydrogen bond dot
        ctx.beginPath();
        ctx.arc(midX, midY, Math.max(1.5, 3 * ((p1.scale + p2.scale) / 2)), 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

      } else if (item.type === 'particle') {
        const { proj, particle } = item;
        const r = Math.max(3, particle.radius * proj.scale);

        ctx.save();
        ctx.translate(proj.x, proj.y);

        if (particle.type === 'cell') {
          // Animal cell: membrane + nucleus
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(116, 185, 255, 0.35)';
          ctx.strokeStyle = '#74B9FF';
          ctx.lineWidth = 2 * proj.scale;
          ctx.fill();
          ctx.stroke();

          // Nucleus
          ctx.beginPath();
          ctx.arc(r * 0.2, -r * 0.2, r * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = '#61C9A8';
          ctx.fill();

        } else if (particle.type === 'mitochondria') {
          // Oval bean with cristae inner folds
          ctx.beginPath();
          ctx.ellipse(0, 0, r * 1.3, r * 0.7, 0.4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 184, 155, 0.6)';
          ctx.strokeStyle = '#FFB89B';
          ctx.lineWidth = 1.5 * proj.scale;
          ctx.fill();
          ctx.stroke();

        } else if (particle.type === 'microbe') {
          // Microorganism with flagellum tail
          ctx.beginPath();
          ctx.ellipse(0, 0, r, r * 0.6, 0.2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(180, 154, 255, 0.55)';
          ctx.fill();

          // Undulating tail
          ctx.beginPath();
          ctx.moveTo(-r, 0);
          const wave = Math.sin(this.time * 6 + particle.phase) * 6;
          ctx.quadraticCurveTo(-r - 12, wave, -r - 24, 0);
          ctx.strokeStyle = '#B49AFF';
          ctx.lineWidth = 2 * proj.scale;
          ctx.stroke();

        } else {
          // Nutrient / molecule particle
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = 10 * proj.scale;
          ctx.fill();
        }

        ctx.restore();
      }
    });
  }
}

window.Hero3DScene = Hero3DScene;
