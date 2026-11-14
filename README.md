# BIOQUEST – The Ultimate Biology Adventure

> **Learn Biology. Play Adventures. Discover Life.**

BIOQUEST is a premier Biology educational gaming platform engineered for college and high school students. It transforms complex biological phenomena into playable adventures, interactive 3D simulations, molecular puzzles, and forensic laboratory investigations.

---

## 🌟 Key Highlights

- **10 Distinct Playable Biology Games:** Every single game features custom mechanics, interactive canvas/SVG graphics, real-time feedback, and progressive 3-level challenges.
- **Interactive Guided Demo System (WATCH DEMO):** Every game features a live, step-by-step interactive tutorial with animated hand pointers, spotlight highlights, and hands-on validation.
- **Pure Light Theme Aesthetic:** Built strictly adhering to the warm pastel palette: Warm white (`#FAFCFF`), Mint green (`#61C9A8`), Sky blue (`#74B9FF`), Lavender (`#B49AFF`), Peach (`#FFB89B`), and Soft yellow (`#FFE28A`).
- **Interactive 3D Biomolecular Engine:** The landing page features a live 3D canvas rendering rotating DNA double helices, animated cell organelles, and floating vesicles with smooth mouse parallax interaction.
- **Comprehensive Learning Zone:** 9 core biology topics featuring interactive conceptual models, structured study notes, and Quick Knowledge Checks with XP awards.
- **Gamification & Reward Architecture:** Full XP progression, 5 rank tiers (*Biology Beginner* to *Biology Master*), 8 unlockable achievements, and duplicate claim prevention.
- **Web Audio API Synthesizer:** Real-time synthesized chimes, fanfare chords, and UI feedback with zero external MP3 dependencies, running 100% offline.
- **Zero Broken External Dependencies:** Self-contained SVG illustrations, local canvas animations, and reliable browser storage.

---

## 🚀 How to Run BIOQUEST

You can run BIOQUEST in any modern web browser (Chrome, Edge, Firefox, Safari) using either of the following methods:

### Method 1: Direct File Open
Double-click or open [`index.html`](file:///C:/Users/gowta/bioquest/index.html) directly in your browser.

### Method 2: Local Python Server (Recommended for College Presentations)
Open PowerShell or your terminal in `C:\Users\gowta\bioquest` and run:

```bash
python -m http.server 8080
```

Then navigate to:
```
http://localhost:8080
```

---

## 🎮 Game Library (10 Playable Games)

| # | Game Title | Category | Mechanics & Biological Core | Levels |
|---|------------|----------|-----------------------------|--------|
| **1** | **Cell Explorer – The Lost Organelles** | Cell Biology | 3D rotating animal cell viewport. Locate and restore Nucleus, Mitochondria, Golgi, Ribosomes, and Endoplasmic Reticulum. | L1: Core Vitals<br>L2: Endomembrane<br>L3: Full Restoration |
| **2** | **Body Builder Challenge** | Human Anatomy | Drag-and-drop / click-to-slot anatomical assembly into cranial, thoracic, and abdominal cavities with error guidance. | L1: Vitals (Brain/Heart/Lungs)<br>L2: Metabolic (Liver/Stomach)<br>L3: Full Anatomy |
| **3** | **DNA Code Breaker** | Genetics | Interactive double helix strand repair. Apply Chargaff's rules to pair Adenine (A)=Thymine (T) and Guanine (G)≡Cytosine (C). | L1: 6-Base Pairs<br>L2: mRNA Codons<br>L3: Genomic Repair |
| **4** | **Germ Busters** | Immunology | Microscopic immune defense. Deploy Macrophages for bacterial phagocytosis, Antibodies for viral neutralization, and T-cells. | L1: Innate Phagocytosis<br>L2: Adaptive Antibodies<br>L3: Coordinated Battle |
| **5** | **Eco World – Save the Planet** | Ecology | Construct multi-tier trophic pyramids (Producers, Herbivores, Carnivores, Decomposers) balancing Lindeman's 10% energy law. | L1: Grassland Chain<br>L2: Closed-Loop Pond<br>L3: Environmental Stress |
| **6** | **Photosynthesis Factory** | Plant Biology | Regulate sunlight photon intensity, water intake from roots, and stomatal CO2 to drive thylakoid photolysis and Calvin cycle. | L1: Reagent Balancing<br>L2: Stage Sequencing<br>L3: 100g Glucose Harvest |
| **7** | **Microbe Detective** | Microbiology | Virtual laboratory microscope with focus knob and 100x/400x/1000x oil immersion to identify unknown pathogens and protozoa. | L1: Pond Paramecium<br>L2: Clinical E. Coli<br>L3: Industrial Yeast |
| **8** | **Brain Maze** | Neuroscience | Guide electrical action potential depolarization down myelinated axons and trigger calcium exocytosis across synapses. | L1: Spinal Reflex Arc<br>L2: Synaptic Cleft<br>L3: Cortical Network |
| **9** | **Digestive Journey** | Human Physiology | Follow food particles through mastication, peristalsis waves, gastric hydrochloric acid churning, and small intestine microvilli absorption. | L1: Upper GI Tract<br>L2: Villi Absorption<br>L3: Complete Voyage |
| **10** | **Bloodstream Delivery Mission** | Human Physiology | Navigate red blood cells carrying oxyhemoglobin, deliver O2 to muscle tissues, and deploy thrombocytes to clot vascular ruptures. | L1: Hemoglobin Shuttle<br>L2: Endothelial Clotting<br>L3: Circulatory Marathon |

---

## 🎓 Interactive Guided Demo System

Every game includes two primary launch actions:
1. **PLAY NOW:** Immediately drops the player into the challenge arena with active scoring and level progression.
2. **WATCH DEMO:** Launches the custom `TutorialEngine` with:
   - Dynamic spotlight ring highlighting the target interactive element.
   - Animated hand cursor demonstrating the required action.
   - Action verification ensuring the user performs the task before advancing.
   - Step progress counter (`Step X of Y`), `Restart Demo`, `Skip Tutorial`, and a celebratory transition into `PLAY GAME NOW`.

---

## 🏆 Gamification & Reward Architecture

### Experience Point (XP) Values:
- **Correct Interaction:** +10 to +25 XP
- **Completed Level Mission:** +30 XP
- **Full Game Completion (Level 3):** +100 XP
- **Perfect 3-Star Score:** +50 Bonus XP
- **Daily Biology Challenge:** +25 XP
- **Knowledge Check Quiz:** +10 XP

### Level Tiers:
1. **Level 1:** Biology Beginner (0 – 99 XP)
2. **Level 2:** Cell Explorer (100 – 299 XP)
3. **Level 3:** Life Discoverer (300 – 599 XP)
4. **Level 4:** Science Adventurer (600 – 999 XP)
5. **Level 5:** Biology Master (1000+ XP)

### Achievements:
- 🚀 **First Adventure:** Launch your first game
- 🔬 **Cell Detective:** Complete Cell Explorer
- 🫀 **Body Builder:** Assemble human organs in Body Builder
- 🧬 **DNA Decoder:** Solve base pairing in DNA Code Breaker
- 🛡️ **Germ Expert:** Defeat pathogens in Germ Busters
- 🌍 **Eco Guardian:** Balance trophic webs in Eco World
- ⭐ **Perfect Score:** Earn 3 stars on any level
- 👑 **Master Explorer:** Attain Level 5 Biology Master

---

## 📁 Project Directory Structure

```
C:\Users\gowta\bioquest\
├── index.html                           # Main entry point & single-page application shell
├── README.md                            # Comprehensive project & curriculum documentation
├── css/
│   ├── theme.css                        # Design tokens, color palette, badges, modals, fonts
│   ├── navbar.css                       # Responsive sticky navigation, player pill, sound toggle
│   ├── home.css                         # Hero section, 3D canvas wrapper, featured games, journey
│   ├── games.css                        # Game library grid, search, categories & difficulty filters
│   ├── game-engine.css                  # Arena HUD, level progression tabs, scoring, completion modal
│   ├── tutorial.css                     # Guided demo spotlight, animated hand cursor, step dialogs
│   ├── learning-zone.css                # 9 biology categories, interactive diagrams, quiz widgets
│   ├── dashboard.css                    # My Progress, editable profile, stats metrics, achievements
│   └── leaderboard.css                  # Top 3 podium, sample student cards, user dynamic rank
└── js/
    ├── audio.js                         # Web Audio API sound synthesizer (zero external mp3s)
    ├── state.js                         # Central state manager, XP, levels, achievements, local storage
    ├── hero3d.js                        # 3D canvas biomolecular animation with mouse parallax
    ├── learning_zone.js                 # Learning Zone hub with 9 categories & interactive mini-quizzes
    ├── dashboard.js                     # Player dashboard & progress analytics
    ├── leaderboard.js                   # Leaderboard with transparent sample classmate indicators
    ├── app.js                           # App orchestrator, game catalog registry, daily challenge
    ├── tutorials/
    │   └── tutorial-engine.js           # Reusable interactive guided tutorial demo engine
    └── games/
        ├── game1_cell_explorer.js       # Game 1: Cell Explorer (3D cell & organelle restoration)
        ├── game2_body_builder.js        # Game 2: Body Builder Challenge (drag-and-drop anatomy)
        ├── game3_dna_codebreaker.js     # Game 3: DNA Code Breaker (A-T, G-C base pairing)
        ├── game4_germ_busters.js        # Game 4: Germ Busters (macrophages & antibodies)
        ├── game5_eco_world.js           # Game 5: Eco World (trophic pyramid & food web)
        ├── game6_photosynthesis.js      # Game 6: Photosynthesis Factory (chloroplast reactor)
        ├── game7_microbe_detective.js   # Game 7: Microbe Detective (virtual microscope)
        ├── game8_brain_maze.js          # Game 8: Brain Maze (action potentials & synapses)
        ├── game9_digestive_journey.js   # Game 9: Digestive Journey (GI tract peristalsis & villi)
        └── game10_bloodstream_delivery.js # Game 10: Bloodstream Delivery (erythrocytes & platelets)
```

---

## 🔬 Scientific & Pedagogical Rigor

All gameplay mechanics adhere strictly to modern biological science:
- **Organelle functions** match eukaryotic cell biology (mitochondrial ATP synthase, rough ER translation, golgi sorting).
- **DNA pairing** mirrors Chargaff's rules (purine-to-pyrimidine complementary hydrogen bonding).
- **Immune mechanisms** distinguish non-specific macrophage phagocytosis from B-cell humoral antibody neutralization.
- **Trophic efficiency** reflects Raymond Lindeman's 10% ecological energy transfer principle.
- **Photosynthetic stoichiometry** demonstrates both light-dependent thylakoid photolysis ($6\text{H}_2\text{O} \to 6\text{O}_2$) and stroma Calvin cycle carbon fixation ($6\text{CO}_2 \to \text{C}_6\text{H}_{12}\text{O}_6$).

---

## 🎓 College Demonstration Guide

1. **Open the Home Page:** Observe the interactive 3D biomolecular canvas. Hover your mouse over the canvas to see real-time 3D parallax rotation.
2. **Launch a Guided Tutorial:** Click **WATCH DEMO** on *Cell Explorer* or *Body Builder*. Observe the animated hand cursor, spotlight ring, and step-by-step instructions.
3. **Play Through Levels:** Complete Level 1, verify instant score and XP updates, earn 3 stars, and view the celebration modal with confetti.
4. **Inspect the Learning Zone:** Navigate to **Learning Zone**, review topics, test the interactive structural models, and answer a Quick Knowledge Check for +10 XP.
5. **Check Your Progress & Leaderboard:** Open **My Progress** to see your live XP progression, rank badge, and unlocked achievements. View **Leaderboard** to see your dynamic ranking among classmates!
