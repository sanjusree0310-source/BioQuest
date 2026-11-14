/* ============================================================
   BIOQUEST - Learning Zone Hub
   9 Biology Learning Categories with Interactive Diagrams & Quizzes
   ============================================================ */

const LEARNING_TOPICS = {
  cell_biology: {
    id: 'cell_biology',
    title: 'Cell Biology',
    icon: '🔬',
    tag: 'Cellular Foundation',
    gameId: 'cell_explorer',
    gameName: 'Cell Explorer',
    overview: 'The cell is the basic structural, functional, and biological unit of all known organisms. Cells are often called the building blocks of life.',
    points: [
      'Prokaryotes (bacteria) lack membrane-bound nuclei; Eukaryotes (animals, plants, fungi) possess distinct compartmentalized organelles.',
      'The nucleus houses the genome and directs ribosomal RNA transcription inside the nucleolus.',
      'Mitochondria generate adenosine triphosphate (ATP) via aerobic cellular respiration on folded inner cristae membranes.',
      'The plasma membrane consists of a phospholipid bilayer with fluid-mosaic embedded transport proteins.'
    ],
    svg: `
      <svg viewBox="0 0 280 240" class="learning-diagram-svg">
        <circle cx="140" cy="120" r="95" fill="#EBF9F3" stroke="#61C9A8" stroke-width="4"/>
        <!-- Nucleus -->
        <circle cx="140" cy="120" r="38" fill="#61C9A8" stroke="#3CA889" stroke-width="2"/>
        <circle cx="140" cy="120" r="14" fill="#FFFFFF"/>
        <!-- Mitochondria -->
        <ellipse cx="80" cy="90" rx="22" ry="12" fill="#FFB89B" stroke="#E07A5F" stroke-width="2"/>
        <ellipse cx="200" cy="150" rx="22" ry="12" fill="#FFB89B" stroke="#E07A5F" stroke-width="2"/>
        <!-- Golgi -->
        <path d="M 175 75 Q 195 85 185 95" stroke="#B49AFF" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M 180 80 Q 200 90 190 100" stroke="#B49AFF" stroke-width="4" fill="none" stroke-linecap="round"/>
      </svg>
    `,
    quiz: {
      question: "Which organelle generates the majority of cellular ATP via cellular respiration?",
      options: ["Golgi Apparatus", "Mitochondria", "Lysosome", "Ribosome"],
      correctIdx: 1,
      explanation: "Mitochondria synthesize ATP through the citric acid cycle and oxidative phosphorylation on the inner mitochondrial membrane."
    }
  },

  human_anatomy: {
    id: 'human_anatomy',
    title: 'Human Anatomy',
    icon: '🫀',
    tag: 'Organ Systems',
    gameId: 'body_builder',
    gameName: 'Body Builder Challenge',
    overview: 'Human anatomy studies the physical structure and organization of human tissues, organs, and integrated biological systems.',
    points: [
      'The thoracic cavity houses the heart and lungs, protected by the bony rib cage and muscular diaphragm.',
      'The human heart operates as a double-pump system: pulmonary circuit (to lungs) and systemic circuit (to body tissues).',
      'The liver performs over 500 vital functions including bile secretion, glycogen storage, and detoxification.',
      'The brain is protected by three meningeal layers and the cerebrospinal fluid (CSF) buffer.'
    ],
    svg: `
      <svg viewBox="0 0 280 240" class="learning-diagram-svg">
        <!-- Body outline -->
        <ellipse cx="140" cy="40" rx="26" ry="30" fill="#EEF4FD" stroke="#74B9FF" stroke-width="2"/>
        <rect x="130" y="65" width="20" height="15" fill="#EEF4FD"/>
        <path d="M 100 80 Q 140 70 180 80 L 175 190 Q 140 200 105 190 Z" fill="#EEF4FD" stroke="#74B9FF" stroke-width="2"/>
        <!-- Heart & Lungs -->
        <circle cx="140" cy="110" r="14" fill="#FF6B6B"/>
        <ellipse cx="120" cy="105" rx="14" ry="20" fill="rgba(116, 185, 255, 0.4)"/>
        <ellipse cx="160" cy="105" rx="14" ry="20" fill="rgba(116, 185, 255, 0.4)"/>
        <!-- Stomach -->
        <ellipse cx="150" cy="150" rx="16" ry="12" fill="#FFE28A"/>
      </svg>
    `,
    quiz: {
      question: "Which cavity contains the heart and lungs?",
      options: ["Abdominal cavity", "Cranial cavity", "Thoracic cavity", "Pelvic cavity"],
      correctIdx: 2,
      explanation: "The thoracic cavity is enclosed by the ribs, vertebral column, and sternum, containing the pleural cavities (lungs) and mediastinum (heart)."
    }
  },

  genetics: {
    id: 'genetics',
    title: 'Genetics',
    icon: '🧬',
    tag: 'Molecular Code',
    gameId: 'dna_codebreaker',
    gameName: 'DNA Code Breaker',
    overview: 'Genetics investigates genes, genetic variation, and heredity in organisms, focusing on the chemical structure of DNA and RNA.',
    points: [
      'DNA consists of two antiparallel polynucleotide chains wound into a right-handed double helix.',
      'Chargaffs base pairing rules: Adenine (A) pairs with Thymine (T) via 2 hydrogen bonds; Guanine (G) pairs with Cytosine (C) via 3 hydrogen bonds.',
      'The central dogma of molecular biology: DNA is transcribed into mRNA, which is translated into polypeptide proteins.',
      'A codon consists of three consecutive nucleotide bases encoding a specific amino acid.'
    ],
    svg: `
      <svg viewBox="0 0 280 240" class="learning-diagram-svg">
        <!-- DNA Strands -->
        <path d="M 90 20 Q 140 70 190 120 Q 140 170 90 220" stroke="#61C9A8" stroke-width="4" fill="none"/>
        <path d="M 190 20 Q 140 70 90 120 Q 140 170 190 220" stroke="#74B9FF" stroke-width="4" fill="none"/>
        <!-- Rungs -->
        <line x1="105" y1="45" x2="175" y2="45" stroke="#B49AFF" stroke-width="3"/>
        <line x1="125" y1="80" x2="155" y2="80" stroke="#FFB89B" stroke-width="3"/>
        <line x1="125" y1="160" x2="155" y2="160" stroke="#FFE28A" stroke-width="3"/>
        <line x1="105" y1="195" x2="175" y2="195" stroke="#61C9A8" stroke-width="3"/>
      </svg>
    `,
    quiz: {
      question: "In double-stranded DNA, which nucleotide base pairs with Guanine (G)?",
      options: ["Adenine (A)", "Thymine (T)", "Cytosine (C)", "Uracil (U)"],
      correctIdx: 2,
      explanation: "Guanine forms three hydrogen bonds specifically with Cytosine, ensuring strict fidelity during replication."
    }
  },

  immunology: {
    id: 'immunology',
    title: 'Immunology',
    icon: '🛡️',
    tag: 'Host Defense',
    gameId: 'germ_busters',
    gameName: 'Germ Busters',
    overview: 'Immunology explores the biological mechanisms that protect an organism from pathogenic bacteria, viruses, fungi, and toxins.',
    points: [
      'Innate immunity provides immediate, non-specific barrier defenses (skin, mucous membranes, macrophage phagocytes).',
      'Adaptive immunity provides highly specific antigen recognition mediated by B-lymphocytes and T-lymphocytes.',
      'Antibodies (immunoglobulins) are Y-shaped proteins that neutralize pathogens and flag them for destruction.',
      'Immunological memory allows the host to mount rapid, vigorous responses upon secondary pathogen exposure.'
    ],
    svg: `
      <svg viewBox="0 0 280 240" class="learning-diagram-svg">
        <!-- Y-shaped antibody -->
        <path d="M 140 190 L 140 120 L 95 65" stroke="#74B9FF" stroke-width="8" stroke-linecap="round" fill="none"/>
        <path d="M 140 120 L 185 65" stroke="#74B9FF" stroke-width="8" stroke-linecap="round" fill="none"/>
        <!-- Antigen binding tips -->
        <circle cx="95" cy="65" r="10" fill="#61C9A8"/>
        <circle cx="185" cy="65" r="10" fill="#61C9A8"/>
      </svg>
    `,
    quiz: {
      question: "Which white blood cells are responsible for producing pathogen-neutralizing antibodies?",
      options: ["Erythrocytes", "Plasma B-Cells", "Platelets", "Basophils"],
      correctIdx: 1,
      explanation: "Activated B-lymphocytes differentiate into plasma cells, which secrete large volumes of antibodies tailored to specific antigens."
    }
  },

  ecology: {
    id: 'ecology',
    title: 'Ecology',
    icon: '🌍',
    tag: 'Ecosystems & Energy',
    gameId: 'eco_world',
    gameName: 'Eco World – Save the Planet',
    overview: 'Ecology examines the interactions among living organisms and their biophysical environment, tracking energy flux and nutrient cycles.',
    points: [
      'Trophic levels classify organisms by their feeding position: Primary Producers ➔ Herbivores ➔ Carnivores ➔ Decomposers.',
      'Lindemans 10% Law: On average, only 10% of energy is transferred from one trophic level to the next.',
      'Producers (autotrophs) fix solar or chemical energy into organic molecules supporting the food web.',
      'Biodiversity enhances ecosystem stability, carrying capacity, and resilience against environmental disturbances.'
    ],
    svg: `
      <svg viewBox="0 0 280 240" class="learning-diagram-svg">
        <!-- Trophic Pyramid -->
        <polygon points="140,40 60,200 220,200" fill="#EBF9F3" stroke="#61C9A8" stroke-width="3"/>
        <line x1="85" y1="150" x2="195" y2="150" stroke="#61C9A8" stroke-width="2"/>
        <line x1="110" y1="100" x2="170" y2="100" stroke="#61C9A8" stroke-width="2"/>
        <text x="140" y="85" font-size="12" font-weight="bold" fill="#26334A" text-anchor="middle">Apex</text>
        <text x="140" y="135" font-size="12" font-weight="bold" fill="#26334A" text-anchor="middle">Herbivores</text>
        <text x="140" y="185" font-size="12" font-weight="bold" fill="#26334A" text-anchor="middle">Producers</text>
      </svg>
    `,
    quiz: {
      question: "According to the ecological 10% rule, if producers generate 10,000 J of energy, how much reaches primary consumers?",
      options: ["10,000 J", "5,000 J", "1,000 J", "100 J"],
      correctIdx: 2,
      explanation: "10% of 10,000 J is 1,000 J. The remaining 90% is lost as metabolic heat and waste during respiration."
    }
  },

  plant_biology: {
    id: 'plant_biology',
    title: 'Plant Biology',
    icon: '🌿',
    tag: 'Autotrophic Energy',
    gameId: 'photosynthesis',
    gameName: 'Photosynthesis Factory',
    overview: 'Plant biology focuses on the biochemistry, physiology, structure, and ecology of photosynthetic flora.',
    points: [
      'Photosynthesis converts water, carbon dioxide, and sunlight into glucose and oxygen gas (6CO2 + 6H2O ➔ C6H12O6 + 6O2).',
      'Light reactions occur in thylakoid membranes, generating ATP and NADPH while releasing O2 from water photolysis.',
      'The Calvin cycle (light-independent) takes place in the stroma, utilizing Rubisco enzyme for carbon fixation.',
      'Vascular xylem transports water and minerals upward from roots; phloem translocates sucrose and amino acids.'
    ],
    svg: `
      <svg viewBox="0 0 280 240" class="learning-diagram-svg">
        <path d="M 60 180 Q 140 20 220 180 Q 140 150 60 180 Z" fill="#E8F9F3" stroke="#61C9A8" stroke-width="3"/>
        <line x1="140" y1="160" x2="140" y2="70" stroke="#3CA889" stroke-width="3"/>
        <path d="M 140 110 Q 165 95 185 105" stroke="#3CA889" stroke-width="2" fill="none"/>
        <path d="M 140 130 Q 115 115 95 125" stroke="#3CA889" stroke-width="2" fill="none"/>
      </svg>
    `,
    quiz: {
      question: "In which chloroplast structure do the light-dependent reactions of photosynthesis take place?",
      options: ["Stroma", "Thylakoid Membrane", "Outer Envelope", "Stomata"],
      correctIdx: 1,
      explanation: "Thylakoid membranes contain chlorophyll photosystems that absorb sunlight and synthesize ATP and NADPH."
    }
  },

  microbiology: {
    id: 'microbiology',
    title: 'Microbiology',
    icon: '🧫',
    tag: 'Microscopic Life',
    gameId: 'microbe_detective',
    gameName: 'Microbe Detective',
    overview: 'Microbiology studies microscopic organisms including bacteria, viruses, fungi, and single-celled protozoa.',
    points: [
      'Bacteria are categorized by morphology into bacilli (rods), cocci (spheres), and spirilla (spirals).',
      'The Gram stain differentiates bacteria based on cell wall peptidoglycan thickness: Gram-positive (purple) vs Gram-negative (pink).',
      'Viruses are obligate intracellular parasites consisting of nucleic acid enclosed in a protein capsid.',
      'Yeasts are unicellular fungi that ferment carbohydrates into ethanol and carbon dioxide.'
    ],
    svg: `
      <svg viewBox="0 0 280 240" class="learning-diagram-svg">
        <!-- Petri Dish -->
        <circle cx="140" cy="120" r="85" fill="#FFFFFF" stroke="#B49AFF" stroke-width="4"/>
        <circle cx="140" cy="120" r="75" fill="#FAF7FF"/>
        <!-- Bacterial colonies -->
        <circle cx="110" cy="100" r="14" fill="#61C9A8"/>
        <circle cx="165" cy="115" r="18" fill="#FFB89B"/>
        <circle cx="130" cy="150" r="10" fill="#74B9FF"/>
      </svg>
    `,
    quiz: {
      question: "What color do Gram-negative bacteria appear following successful Gram staining?",
      options: ["Dark Purple", "Pink / Red", "Bright Green", "Colorless"],
      correctIdx: 1,
      explanation: "Gram-negative bacteria have thin peptidoglycan walls and an outer lipopolysaccharide membrane that decolorizes and takes up pink safranin counterstain."
    }
  },

  neuroscience: {
    id: 'neuroscience',
    title: 'Neuroscience',
    icon: '🧠',
    tag: 'Neural Networks',
    gameId: 'brain_maze',
    gameName: 'Brain Maze',
    overview: 'Neuroscience investigates the nervous system, neuronal signaling, brain anatomy, and cognitive physiological functions.',
    points: [
      'Neurons consist of dendrites (signal reception), a soma (cell body), and an axon (signal propagation).',
      'Action potentials propagate via voltage-gated sodium (Na+) influx followed by potassium (K+) efflux.',
      'Myelin sheaths formed by Schwann cells or oligodendrocytes enable saltatory conduction, greatly increasing conduction velocity.',
      'Synaptic transmission occurs when calcium triggers neurotransmitter exocytosis across the synaptic cleft.'
    ],
    svg: `
      <svg viewBox="0 0 280 240" class="learning-diagram-svg">
        <!-- Neuron soma & axon -->
        <circle cx="85" cy="120" r="28" fill="#F4EFFF" stroke="#B49AFF" stroke-width="3"/>
        <line x1="113" y1="120" x2="220" y2="120" stroke="#B49AFF" stroke-width="4"/>
        <!-- Myelin sheaths -->
        <rect x="125" y="112" width="22" height="16" rx="4" fill="#FFE28A"/>
        <rect x="155" y="112" width="22" height="16" rx="4" fill="#FFE28A"/>
        <rect x="185" y="112" width="22" height="16" rx="4" fill="#FFE28A"/>
      </svg>
    `,
    quiz: {
      question: "What ion influx is primarily responsible for depolarizing the neuronal membrane during an action potential?",
      options: ["Potassium (K+)", "Sodium (Na+)", "Chloride (Cl-)", "Magnesium (Mg2+)"],
      correctIdx: 1,
      explanation: "Opening of voltage-gated sodium channels permits rapid inward diffusion of Na+, shifting membrane potential from -70 mV toward +30 mV."
    }
  },

  human_physiology: {
    id: 'human_physiology',
    title: 'Human Physiology',
    icon: '🥨',
    tag: 'Digestive & Circulatory Systems',
    gameId: 'digestive_journey',
    gameName: 'Digestive Journey',
    overview: 'Human physiology studies how organ systems coordinate to maintain internal homeostatic equilibrium.',
    points: [
      'The digestive tract mechanically and enzymatically breaks macromolecules into absorbable nutrients.',
      'The stomach secretes hydrochloric acid (HCl) creating a low pH environment optimal for pepsin protease activity.',
      'Small intestinal microvilli dramatically amplify surface area for active and passive nutrient transport.',
      'The circulatory system transports oxygenated erythrocytes and regulates systemic blood pressure.'
    ],
    svg: `
      <svg viewBox="0 0 280 240" class="learning-diagram-svg">
        <!-- Stomach J-shape -->
        <path d="M 120 40 L 120 70 Q 120 160 170 160 Q 190 160 190 120 Q 190 90 140 85" stroke="#FFB89B" stroke-width="8" stroke-linecap="round" fill="none"/>
      </svg>
    `,
    quiz: {
      question: "Which enzyme in the stomach initiates protein degradation in acidic conditions?",
      options: ["Pepsin", "Amylase", "Lipase", "Maltase"],
      correctIdx: 0,
      explanation: "Pepsin is activated from pepsinogen by hydrochloric acid in the stomach lumen to cleave peptide bonds."
    }
  }
};

class LearningZoneHub {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.activeTopicKey = 'cell_biology';
  }

  init() {
    this.render();
  }

  render() {
    if (!this.container) return;
    const topic = LEARNING_TOPICS[this.activeTopicKey];

    this.container.innerHTML = `
      <div class="learning-zone-view">
        <div class="container">
          <!-- Banner -->
          <div class="learning-hero-banner">
            <div class="learning-hero-text">
              <span class="badge badge-blue">Knowledge Academy</span>
              <h1>Biology Learning Zone</h1>
              <p>Explore fundamental concepts of life sciences through clear explanations, structural diagrams, and instant knowledge checks.</p>
            </div>
            <div class="learning-hero-icon">📖</div>
          </div>

          <!-- Category Navigation Tabs -->
          <div class="learning-tabs-nav">
            ${Object.values(LEARNING_TOPICS).map(t => `
              <button class="learning-tab-btn ${t.id === this.activeTopicKey ? 'active' : ''}" data-topic="${t.id}">
                <span>${t.icon}</span>
                <span>${t.title}</span>
              </button>
            `).join('')}
          </div>

          <!-- Main Topic Card -->
          <div class="learning-card">
            <div class="learning-card-grid">
              <!-- Visual Diagram -->
              <div class="learning-diagram-box">
                ${topic.svg}
                <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-top: 12px;">
                  Interactive Structural Model: ${topic.title}
                </div>
              </div>

              <!-- Content Breakdown -->
              <div class="learning-info-box">
                <div class="learning-tag-row">
                  <span class="badge badge-mint">${topic.tag}</span>
                </div>
                <h2 class="learning-topic-title">${topic.title}</h2>
                <p class="learning-overview-text">${topic.overview}</p>

                <!-- Key Concepts -->
                <div class="learning-key-points">
                  ${topic.points.map(pt => `
                    <div class="learning-point-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>${pt}</span>
                    </div>
                  `).join('')}
                </div>

                <!-- Related Game Action Link -->
                <div class="learning-related-game-row">
                  <div>
                    <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Reinforce with Interactive Game</span>
                    <h5 class="related-game-title">${topic.gameName}</h5>
                  </div>
                  <button class="btn btn-sm btn-primary" id="btnLaunchRelatedGame" data-game="${topic.gameId}">
                    Play Game ➔
                  </button>
                </div>
              </div>
            </div>

            <!-- Quick Knowledge Check Widget -->
            <div class="knowledge-check-card">
              <div class="check-header">
                <span class="check-badge">⚡ Quick Knowledge Check (+10 XP)</span>
              </div>
              <h4 class="check-question">${topic.quiz.question}</h4>
              <div class="check-options-grid">
                ${topic.quiz.options.map((opt, idx) => `
                  <button class="check-option-btn" data-idx="${idx}">
                    ${opt}
                  </button>
                `).join('')}
              </div>
              <div class="check-feedback-box" id="quizFeedbackBox"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    // Tab switching
    this.container.querySelectorAll('.learning-tab-btn').forEach(btn => {
      btn.onclick = () => {
        this.activeTopicKey = btn.getAttribute('data-topic');
        if (window.soundEngine) window.soundEngine.playClick();
        this.render();
      };
    });

    // Launch related game
    const btnRelated = document.getElementById('btnLaunchRelatedGame');
    if (btnRelated) {
      btnRelated.onclick = () => {
        const gameId = btnRelated.getAttribute('data-game');
        if (window.launchGame) {
          window.launchGame(gameId, 1, false);
        }
      };
    }

    // Knowledge check answers
    const topic = LEARNING_TOPICS[this.activeTopicKey];
    this.container.querySelectorAll('.check-option-btn').forEach(btn => {
      btn.onclick = () => {
        const selectedIdx = parseInt(btn.getAttribute('data-idx'));
        const feedbackBox = document.getElementById('quizFeedbackBox');

        if (selectedIdx === topic.quiz.correctIdx) {
          btn.className = 'check-option-btn correct';
          if (window.soundEngine) window.soundEngine.playCorrect();

          // Award +10 XP without duplicate abuse
          const quizKey = `quiz_${topic.id}`;
          if (window.stateManager) {
            window.stateManager.claimReward(quizKey, 10, "Knowledge Check");
          }

          if (feedbackBox) {
            feedbackBox.className = 'check-feedback-box show correct';
            feedbackBox.innerHTML = `<strong>Correct!</strong> ${topic.quiz.explanation}`;
          }
        } else {
          btn.className = 'check-option-btn wrong';
          if (window.soundEngine) window.soundEngine.playWrong();

          if (feedbackBox) {
            feedbackBox.className = 'check-feedback-box show wrong';
            feedbackBox.innerHTML = `<strong>Incorrect.</strong> Review the core points above and try again!`;
          }
        }
      };
    });
  }
}

window.LearningZoneHub = LearningZoneHub;
