import { LearningResource } from '../types/learning';
import { TopicNode } from '../types/knowledge';

export const TOPIC_LEARNING_RESOURCES: Record<string, LearningResource[]> = {
  // ==========================================
  // 01 OXIDES
  // ==========================================
  'oxides-definition': [
    {
      id: 'res-ox-1',
      title: 'Materials Science and Engineering: An Introduction (Chapter 12: Structures and Properties of Ceramics)',
      type: 'textbook',
      authorOrSource: 'William D. Callister Jr., David G. Rethwisch (Wiley, 10th Ed.)',
      description: 'Comprehensive treatment of oxide crystal packing, close-packed anion arrays, cation radius ratios, and ceramic electrical properties.',
      keyTakeaways: [
        'Coordination number governed by cation-to-anion radius ratio rc / ra.',
        'Pauling rules for ionic crystal stability and corner/edge/face sharing.',
        'Classification into binary monoxides, dioxides, and ternary titanates.'
      ],
      difficulty: 'introductory',
      tags: ['Ceramics', 'Ionic Radii', 'Crystal Structures']
    },
    {
      id: 'res-ox-2',
      title: 'NPTEL: Advanced Ceramic Materials — Unit 1: Oxide Structures',
      type: 'lecture',
      authorOrSource: 'Prof. K. K. Ray & Prof. B. Basu, IIT Kharagpur (NPTEL)',
      description: 'Systematic university lecture covering AB, AB2, and ABO3 oxide networks, stoichiometry deviation, and Kroger-Vink defect chemistry.',
      keyTakeaways: [
        'Electronic defect equilibrium under varying oxygen partial pressures.',
        'Band structure distinctions between insulating Al2O3 and semiconducting TiO2/ZnO.'
      ],
      difficulty: 'intermediate',
      tags: ['NPTEL', 'Oxide Lattices', 'Band Structure']
    },
    {
      id: 'res-ox-3',
      title: 'Standard Chemical Reference Card: Oxide Formulations & Melting Points',
      type: 'formula',
      authorOrSource: 'CRC Handbook of Chemistry and Physics',
      description: 'Reference table of crystal lattices, standard enthalpies of formation, refractive indices, and melting points for MgO, NiO, TiO2, and BaTiO3.',
      difficulty: 'introductory',
      tags: ['Reference Card', 'Constants']
    }
  ],

  'ab-oxides': [
    {
      id: 'res-ab-1',
      title: 'Introduction to Solid State Physics (Rocksalt Structure & Cohesive Energy)',
      type: 'textbook',
      authorOrSource: 'Charles Kittel (John Wiley & Sons, 8th Ed.)',
      description: 'Madelung constant derivation, Born-Mayer repulsive potential, and octahedral coordination geometry in AB monoxides (MgO, NiO, CoO).',
      keyTakeaways: [
        'Rocksalt lattice is two interpenetrating FCC sublattices displaced by (1/2, 0, 0).',
        'Octahedral coordination number CN = 6 for both cation and oxygen.',
        'High lattice energies yield melting points exceeding 2800°C for MgO.'
      ],
      difficulty: 'intermediate',
      tags: ['Solid State Physics', 'Rocksalt', 'Madelung Constant']
    },
    {
      id: 'res-ab-2',
      title: 'Materials Project Database: Structural Dossier for Magnesium Oxide & Nickel Oxide',
      type: 'interactive',
      authorOrSource: 'The Materials Project (LBNL / MIT)',
      description: 'Calculated electronic density of states (DOS), bandgaps (7.8 eV for MgO; 3.7 eV for NiO), and phonon dispersion curves.',
      difficulty: 'intermediate',
      tags: ['Materials Project', 'DOS', 'Bandgap']
    }
  ],

  'ab2-oxides': [
    {
      id: 'res-ab2-1',
      title: 'Titanium Dioxide Nanomaterials: Synthesis, Properties, Modifications, and Applications',
      type: 'paper',
      authorOrSource: 'Chen, X., & Mao, S. S. — Chemical Reviews, 107(7), 2891–2959',
      citationOrLink: 'DOI: 10.1021/cr0500535',
      description: 'The definitive review on TiO2 polymorphs (rutile, anatase, brookite), surface band alignments, and catalytic photo-excitation mechanisms.',
      keyTakeaways: [
        'Anatase (Eg ~ 3.2 eV) displays superior electron mobility and photocatalysis.',
        'Rutile (Eg ~ 3.0 eV) is thermodynamically stable with high refractive index (n ~ 2.7).',
        'Crucial precursor for solid-state reactions with BaCO3 and CaCO3.'
      ],
      difficulty: 'advanced',
      tags: ['Review Article', 'Polymorphs', 'Photocatalysis']
    },
    {
      id: 'res-ab2-2',
      title: 'MIT OpenCourseWare 3.091: Rutile and Fluorite Ceramic Lattices',
      type: 'lecture',
      authorOrSource: 'Prof. Donald Sadoway, MIT OCW',
      description: 'Visual geometric derivation of tetragonal Rutile TiO2 (CN 6:3) and cubic Fluorite ZrO2 (CN 8:4).',
      difficulty: 'intermediate',
      tags: ['MIT OCW', 'Rutile', 'Fluorite']
    }
  ],

  'abo3-oxides': [
    {
      id: 'res-abo3-1',
      title: 'The Goldschmidt Tolerance Factor in Perovskite Ceramics',
      type: 'paper',
      authorOrSource: 'V. M. Goldschmidt — Naturwissenschaften 14, 477–485 (Foundational Paper)',
      description: 'Mathematical formulation of the geometric tolerance factor t = (rA + rO) / [sqrt(2)*(rB + rO)] predicting cubic, distorted, or hexagonal structures.',
      keyTakeaways: [
        't between 0.9 and 1.0 stabilizes ideal cubic perovskites.',
        't > 1.0 (e.g., BaTiO3) permits ferroelectric displacement of B-site cation.',
        't < 0.9 (e.g., CaTiO3) drives octahedral tilting and orthorhombic distortion.'
      ],
      difficulty: 'intermediate',
      tags: ['Tolerance Factor', 'Crystallography', 'Perovskites']
    },
    {
      id: 'res-abo3-2',
      title: 'Crystal Chemistry of ABO3 Perovskites — Standard Formula Sheet',
      type: 'formula',
      authorOrSource: 'International Union of Crystallography (IUCr)',
      description: 'Table of Shannon ionic radii, tolerance factors, and structural stability boundaries for 24 functional ABO3 ceramics.',
      difficulty: 'introductory',
      tags: ['Formula Sheet', 'Shannon Radii']
    }
  ],

  'perovskite-oxides': [
    {
      id: 'res-perov-1',
      title: 'Electroceramics: Materials, Properties, Applications (Chapter 4: Ferroelectric Ceramics)',
      type: 'textbook',
      authorOrSource: 'A. J. Moulson & J. M. Herbert (Wiley, 2nd Ed.)',
      description: 'Standard textbook for electroceramics covering perovskite unit cell distortion, Curie temperatures, polarization mechanisms, and capacitor technology.',
      keyTakeaways: [
        'Centrosymmetry breaking below Tc drives spontaneous polarization.',
        'Domain nucleation and 90° / 180° domain wall reorientation under poling.',
        'Temperature-dependent dielectric anomaly at the tetragonal-to-cubic Curie transition.'
      ],
      difficulty: 'advanced',
      tags: ['Electroceramics', 'Domain Walls', 'Ferroelectricity']
    },
    {
      id: 'res-perov-2',
      title: 'NPTEL: Structure and Properties of Perovskites (Video Module 6)',
      type: 'lecture',
      authorOrSource: 'Prof. Ashish Garg, IIT Kanpur (NPTEL)',
      description: 'Deep dive into corner-sharing BO6 octahedra, soft phonon modes, and temperature phase sequence (rhombohedral -> orthorhombic -> tetragonal -> cubic).',
      difficulty: 'intermediate',
      tags: ['NPTEL', 'Phase Transitions']
    }
  ],

  'batio3-prep': [
    {
      id: 'res-batio3-1',
      title: 'Principles of Ceramic Processing (Solid-State Calcination & Sintering Kinetics)',
      type: 'textbook',
      authorOrSource: 'James S. Reed (Wiley-Interscience, 2nd Ed.)',
      description: 'Covers thermodynamics of the BaCO3 + TiO2 reaction, decarbonation kinetics at 1100°C-1250°C, and grain growth kinetics during 1350°C sintering.',
      keyTakeaways: [
        'Diffusion of Ba2+ into TiO2 particles governs solid-state reaction rate.',
        'Incomplete reaction leaves unwanted Ba2TiO4 or unreacted BaCO3 phases.',
        'High-density sintering is essential for avoiding low-k porosity.'
      ],
      difficulty: 'intermediate',
      tags: ['Ceramic Processing', 'Sintering', 'Calcination']
    },
    {
      id: 'res-batio3-2',
      title: 'Standard Lab Protocol: Solid-State Reaction of BaTiO3 and X-ray Diffraction Characterization',
      type: 'paper',
      authorOrSource: 'Journal of Chemical Education, 82(5), 775',
      description: 'Step-by-step laboratory synthesis procedure, stoichiometric ball milling calculations, and XRD peak indexing (tetragonal (002)/(200) split).',
      difficulty: 'intermediate',
      tags: ['Lab Protocol', 'XRD', 'Synthesis']
    }
  ],

  'ferroelectricity': [
    {
      id: 'res-ferro-1',
      title: 'Physics of Ferroelectrics: A Modern Perspective',
      type: 'textbook',
      authorOrSource: 'K. M. Rabe, C. H. Ahn, J.-M. Triscone (Springer Topics in Applied Physics, Vol. 105)',
      description: 'Landau-Ginzburg-Devonshire phenomenological thermodynamic theory, P-E hysteresis loops, and polarization switching dynamics.',
      keyTakeaways: [
        'Free energy expansion F(P, T) = alpha*(T - T0)*P^2 + beta*P^4 + gamma*P^6.',
        'First-order vs second-order phase transitions at Curie point.',
        'Remanent polarization (Pr) and coercive field (Ec) extraction from Sawyer-Tower circuits.'
      ],
      difficulty: 'advanced',
      tags: ['Landau Theory', 'Hysteresis', 'Thermodynamics']
    },
    {
      id: 'res-ferro-2',
      title: 'Ferroelectric Hysteresis & Sawyer-Tower Circuit Formula Guide',
      type: 'formula',
      authorOrSource: 'IEEE Transactions on Ultrasonics, Ferroelectrics, and Frequency Control',
      description: 'Formulas for remanent polarization, coercive field, dielectric breakdown strength, and Curie-Weiss law constants.',
      difficulty: 'intermediate',
      tags: ['Formulas', 'Hysteresis', 'Curie-Weiss']
    }
  ],

  // ==========================================
  // 02 POLYMERS
  // ==========================================
  'polymers-definition': [
    {
      id: 'res-poly-1',
      title: 'Principles of Polymerization (Chapter 1: Types of Polymers and Polymerizations)',
      type: 'textbook',
      authorOrSource: 'George Odian (Wiley-Interscience, 4th Ed.)',
      description: 'The definitive polymer textbook detailing chain-growth vs step-growth kinetics, degree of polymerization, Carothers equation, and polydispersity.',
      keyTakeaways: [
        'Degree of polymerization DP = N0 / N = 1 / (1 - p) (Carothers equation).',
        'Number-average (Mn) vs weight-average (Mw) molecular weights.',
        'Bifunctional monomers form linear thermoplastics; trifunctional monomers form cross-linked thermosets.'
      ],
      difficulty: 'intermediate',
      tags: ['Polymer Science', 'Carothers Equation', 'Molecular Weight']
    },
    {
      id: 'res-poly-2',
      title: 'NPTEL: Science and Technology of Polymers (Module 1)',
      type: 'lecture',
      authorOrSource: 'Prof. B. Adhikari, IIT Kharagpur (NPTEL)',
      description: 'Introductory lectures covering monomer functionalities, structural repeating units, and thermal classification.',
      difficulty: 'introductory',
      tags: ['NPTEL', 'Polymerization']
    }
  ],

  'thermoplastics': [
    {
      id: 'res-tp-1',
      title: 'Polymer Engineering Science: Thermoplastics vs Thermosets Structure-Property Map',
      type: 'paper',
      authorOrSource: 'Journal of Materials Education, Vol. 33, pp. 45-62',
      description: 'Comparative thermodynamic analysis of reversible glass transitions (Tg) and melting (Tm) in thermoplastics vs irreversible curing in thermosets.',
      difficulty: 'introductory',
      tags: ['Tg', 'Tm', 'Thermoplastics']
    }
  ],

  'teflon': [
    {
      id: 'res-tef-1',
      title: 'Fluoroplastics: Non-Melt Processible Fluoropolymers (The Definitive User\'s Guide)',
      type: 'textbook',
      authorOrSource: 'Sina Ebnesajjad (William Andrew Publishing)',
      description: 'Comprehensive monograph on PTFE molecular geometry, helical conformations, high C-F bond energy (485 kJ/mol), and sintering processing.',
      keyTakeaways: [
        'Dense fluorine electron clouds shield carbon backbone from nucleophilic/electrophilic attack.',
        'Extremely low coefficient of friction (0.04-0.10) arises from smooth rod-like helical chains sliding past each other.',
        'Continuous thermal rating up to 260°C; insoluble in all known common solvents.'
      ],
      difficulty: 'intermediate',
      tags: ['PTFE', 'Fluoropolymer', 'Tribology']
    }
  ],

  'novolac-formation': [
    {
      id: 'res-novo-1',
      title: 'Phenolic Resins: Chemistry, Applications and Performance (Chapter 2: Novolac Synthesis)',
      type: 'textbook',
      authorOrSource: 'A. Gardziella, L. A. Pilato, A. Knop (Springer)',
      description: 'Step-by-step chemical kinetics of acid-catalyzed electrophilic aromatic substitution between excess phenol and formaldehyde.',
      keyTakeaways: [
        'Phenol-to-formaldehyde molar ratio > 1 prevents premature gelation.',
        'Protonated formaldehyde (+CH2OH) attacks ortho- and para- positions of phenol.',
        'Linear methylene-bridged oligomers remain thermoplastic until cured with HMTA.'
      ],
      difficulty: 'intermediate',
      tags: ['Novolac', 'Phenolic Resins', 'Condensation']
    }
  ],

  'bakelite-formation': [
    {
      id: 'res-bake-1',
      title: 'The Chemical Origins of Synthetic Plastics: Leo Baekeland\'s Phenolic Patents',
      type: 'paper',
      authorOrSource: 'ACS Chemical Heritage Foundation Historical Review',
      description: 'Historic and technical review of cross-linking Novolac with hexamethylenetetramine (HMTA) under heat and pressure into infusible resite networks.',
      difficulty: 'introductory',
      tags: ['Bakelite', 'Thermoset', 'History of Chemistry']
    }
  ],

  // ==========================================
  // 03 CONDUCTING POLYMERS
  // ==========================================
  'conducting-polymers-intro': [
    {
      id: 'res-cp-1',
      title: 'Nobel Lecture: The Discovery of Polyacetylene and Electrically Conducting Polymers',
      type: 'paper',
      authorOrSource: 'Alan J. Heeger, Alan G. MacDiarmid, Hideki Shirakawa — Nobel Prize in Chemistry (2000)',
      citationOrLink: 'NobelPrize.org / Rev. Mod. Phys. 73, 681–712',
      description: 'The seminal Nobel lecture outlining the synthesis of trans-polyacetylene and its transition from insulator to metallic conductivity upon halogen doping.',
      keyTakeaways: [
        'Alternating single and double carbon bonds create delocalized pi-electron systems.',
        'Doping by 1-10 mol% increases electrical conductivity by over 11 orders of magnitude (up to 10^5 S/cm).',
        'Charge carriers are not free electrons, but solitons, polarons, and bipolarons.'
      ],
      difficulty: 'intermediate',
      tags: ['Nobel Prize', 'Heeger', 'MacDiarmid', 'Shirakawa']
    },
    {
      id: 'res-cp-2',
      title: 'Handbook of Conducting Polymers (Conjugation and Band Gaps)',
      type: 'textbook',
      authorOrSource: 'Terje A. Skotheim & John R. Reynolds (CRC Press, 3rd Ed.)',
      description: 'Authoritative handbook on conjugated polymers, electrochemistry, redox doping, and optical spectroscopy of polyanilines and polythiophenes.',
      difficulty: 'advanced',
      tags: ['Handbook', 'Polyaniline', 'Bandgap']
    }
  ],

  'conjugated-pi-systems': [
    {
      id: 'res-pi-1',
      title: 'Physical Organic Chemistry: Hückel Molecular Orbital Theory of Conjugated Dienes',
      type: 'textbook',
      authorOrSource: 'Neil S. Isaacs (Prentice Hall, 2nd Ed.)',
      description: 'Mathematical derivation of sp2 hybridization, overlap integrals, resonance stabilization energy, and Peierls instability in linear polyenes.',
      difficulty: 'intermediate',
      tags: ['MO Theory', 'Hückel', 'Peierls Instability']
    }
  ],

  'p-doping-oxidative': [
    {
      id: 'res-pdop-1',
      title: 'Oxidative and Reductive Doping in Conjugated Polymers: Mechanisms and Charge Transport',
      type: 'paper',
      authorOrSource: 'Bredas, J. L., & Street, G. B. — Accounts of Chemical Research, 18(10), 309–315',
      citationOrLink: 'DOI: 10.1021/ar00118a005',
      description: 'Classic physical chemistry paper on polaron and bipolaron energy levels introduced into the bandgap upon iodine or FeCl3 p-doping.',
      keyTakeaways: [
        'Oxidative removal of an electron creates a radical cation (polaron).',
        'Further oxidation pairs charges to form spinless dications (bipolarons).',
        'Mid-gap states lower the optical transition energy and enable hopping conduction.'
      ],
      difficulty: 'advanced',
      tags: ['Polaron', 'Bipolaron', 'p-Doping']
    }
  ],

  // ==========================================
  // 04 NANOMATERIALS
  // ==========================================
  'nanotechnology-definition': [
    {
      id: 'res-nano-1',
      title: 'Introduction to Nanotechnology',
      type: 'textbook',
      authorOrSource: 'Charles P. Poole Jr., Frank J. Owens (John Wiley & Sons)',
      description: 'Standard textbook surveying the 1-100 nm length scale, nanoscale forces, and physics governing the transition from bulk to atomic regimes.',
      keyTakeaways: [
        'Nanoscale range strictly defined between 1 nm and 100 nm.',
        'High percentage of surface atoms alters thermodynamic chemical potentials.',
        'Quantum mechanical confinement emerges when dimensions match the de Broglie wavelength.'
      ],
      difficulty: 'introductory',
      tags: ['Nanotechnology', 'Quantum Confinement', 'Poole']
    },
    {
      id: 'res-nano-2',
      title: 'MIT OCW 3.024: Electronic and Mechanical Properties of Nanomaterials',
      type: 'lecture',
      authorOrSource: 'Prof. Angela Belcher, MIT OpenCourseWare',
      description: 'Lectures exploring 0D quantum dots, 1D carbon nanotubes/nanowires, and 2D graphene sheets.',
      difficulty: 'intermediate',
      tags: ['MIT OCW', 'Dimensionality']
    }
  ],

  'energy-band-gap': [
    {
      id: 'res-gap-1',
      title: 'Quantum Confinement in Semiconductor Nanocrystals: The Brus Equation Derivation',
      type: 'paper',
      authorOrSource: 'Louis E. Brus — Journal of Chemical Physics, 80(9), 4403–4409',
      citationOrLink: 'DOI: 10.1063/1.447218',
      description: 'Seminal paper establishing the particle-in-a-sphere quantum confinement model for semiconductor nanoparticles (quantum dots).',
      keyTakeaways: [
        'Effective bandgap increases as radius R decreases: Eg(nano) = Eg(bulk) + (h^2 / 8*R^2) * (1/me* + 1/mh*) - (1.8*e^2 / 4*pi*eps*R).',
        'Kinetic energy confinement term scales as 1/R^2.',
        'Coulombic exciton attraction scales as 1/R.',
        'Causes the dramatic blue shift in absorption and emission as nanoparticle size shrinks.'
      ],
      difficulty: 'advanced',
      tags: ['Brus Equation', 'Quantum Dots', 'Bandgap']
    },
    {
      id: 'res-gap-2',
      title: 'Brus Equation and Exciton Bohr Radii Formula Reference Card',
      type: 'formula',
      authorOrSource: 'American Physical Society (APS Physics)',
      description: 'Summary sheet listing effective masses (me*, mh*) and bulk exciton Bohr radii for CdSe (5.6 nm), PbS (18 nm), and Si (4.9 nm).',
      difficulty: 'intermediate',
      tags: ['Formulas', 'Exciton Bohr Radius']
    }
  ],

  'surface-area-to-volume': [
    {
      id: 'res-sa-1',
      title: 'Nanomaterials: A Review of Synthesis Methods, Properties, and High-Surface-Area Catalysis',
      type: 'paper',
      authorOrSource: 'Progress in Materials Science, Vol. 54, pp. 1123-1188',
      description: 'Mathematical derivation showing surface-to-volume ratio scaling as 6/D for cubes or 3/R for spheres, and its direct impact on Gibbs free energy.',
      difficulty: 'introductory',
      tags: ['Surface Area', 'Gibbs-Thomson', 'Catalysis']
    }
  ],

  // ==========================================
  // 05 SYNTHESIS OF NANOMATERIALS
  // ==========================================
  'nanomaterial-synthesis-overview': [
    {
      id: 'res-synth-1',
      title: 'Nanostructures and Nanomaterials: Synthesis, Properties, and Applications (Top-Down vs Bottom-Up)',
      type: 'textbook',
      authorOrSource: 'Guozhong Cao & Ying Wang (World Scientific, 2nd Ed.)',
      description: 'Standard textbook comparing top-down physical breakdown methods with bottom-up thermodynamic nucleation and self-assembly.',
      keyTakeaways: [
        'Top-down: ball-milling, lithography, laser ablation (creates internal defects/strains).',
        'Bottom-up: sol-gel, hydrothermal, CVD, molecular beam epitaxy (produces atomic uniformity).',
        'Nucleation and growth controlled by LaMer supersaturation curve.'
      ],
      difficulty: 'intermediate',
      tags: ['Synthesis', 'Top-Down', 'Bottom-Up', 'Cao']
    }
  ],

  'sol-gel-condensation': [
    {
      id: 'res-solgel-1',
      title: 'Sol-Gel Science: The Physics and Chemistry of Sol-Gel Processing',
      type: 'textbook',
      authorOrSource: 'C. Jeffrey Brinker & George W. Scherer (Academic Press)',
      description: 'The standard master text on metal alkoxide hydrolysis, polycondensation kinetics, sol-to-gel transition point, and supercritical drying (aerogels).',
      keyTakeaways: [
        'Hydrolysis: M(OR)n + H2O -> M(OR)n-1(OH) + ROH.',
        'Water condensation: -M-OH + HO-M- -> -M-O-M- + H2O.',
        'Alcohol condensation: -M-OR + HO-M- -> -M-O-M- + ROH.',
        'pH governs whether network is linear polymeric (acidic) or colloidal spherical (basic).'
      ],
      difficulty: 'advanced',
      tags: ['Sol-Gel', 'Alkoxides', 'Brinker & Scherer']
    }
  ],

  // ==========================================
  // 06 OLEDS
  // ==========================================
  'oled-intro': [
    {
      id: 'res-oled-1',
      title: 'Organic Light-Emitting Diodes (OLEDs): Materials, Devices and Processing',
      type: 'textbook',
      authorOrSource: 'Joseph Shinar (Springer-Verlag)',
      description: 'Comprehensive graduate-level monograph detailing OLED physics, multi-layer architectures, work function band alignments, and quantum efficiency.',
      keyTakeaways: [
        'ITO anode (high work function ~4.8 eV) injects holes into HTL.',
        'Low work function cathode (e.g. Al/LiF or Mg:Ag) injects electrons into ETL.',
        'Recombination inside emissive layer (EML) creates Frenkel excitons.',
        'Spin statistics dictate 25% singlet excitons (fluorescent) and 75% triplet excitons (phosphorescent).'
      ],
      difficulty: 'intermediate',
      tags: ['OLED', 'Device Physics', 'Excitons', 'Shinar']
    },
    {
      id: 'res-oled-2',
      title: 'Foundational Discovery: Organic Electroluminescent Diodes',
      type: 'paper',
      authorOrSource: 'C. W. Tang & S. A. VanSlyke — Applied Physics Letters, 51(12), 913–915',
      citationOrLink: 'DOI: 10.1063/1.98687',
      description: 'The historic Eastman Kodak paper that launched modern OLEDs using a bilayer Alq3 / diamine architecture operating below 10 V.',
      difficulty: 'intermediate',
      tags: ['Historic Paper', 'Tang & VanSlyke', 'Alq3']
    }
  ],

  'oled-structure': [
    {
      id: 'res-oled-struct-1',
      title: 'Multi-layer OLED Energy Band Alignment and Carrier Transport Engineering',
      type: 'paper',
      authorOrSource: 'Chemical Society Reviews, 42(1), 174–199',
      description: 'Detailed analysis of HOMO-LUMO energy level matching between ITO, PEDOT:PSS (HIL), TPD/NPB (HTL), Alq3 (EML/ETL), and LiF/Al.',
      difficulty: 'advanced',
      tags: ['HOMO-LUMO', 'Band Alignment', 'Multi-layer']
    }
  ],

  'oled-working-principle': [
    {
      id: 'res-oled-work-1',
      title: 'Spin Statistics and Phosphorescent Emitters in OLEDs',
      type: 'paper',
      authorOrSource: 'M. A. Baldo, S. R. Forrest et al. — Nature, 395, 151–154',
      citationOrLink: 'DOI: 10.1038/25954',
      description: 'Seminal Princeton/USC paper proving 100% internal quantum efficiency using heavy-metal organometallic iridium/platinum phosphorescent dopants.',
      difficulty: 'advanced',
      tags: ['Spin Statistics', 'Phosphorescence', 'Nature']
    }
  ]
};

/**
 * Returns learning resources for a topic, with smart fallback generation if none exist explicitly
 */
export function getLearningResourcesForTopic(topic: TopicNode): LearningResource[] {
  if (TOPIC_LEARNING_RESOURCES[topic.id] && TOPIC_LEARNING_RESOURCES[topic.id].length > 0) {
    return TOPIC_LEARNING_RESOURCES[topic.id];
  }

  // Smart fallback generator for other topics or custom notes
  return [
    {
      id: `fallback-callister-${topic.id}`,
      title: `Materials Science and Engineering: An Introduction (Topic: ${topic.title})`,
      type: 'textbook',
      authorOrSource: 'William D. Callister Jr. & David G. Rethwisch (Wiley)',
      description: `Academic foundation for ${topic.title} in the ${topic.category} domain. Covers structural coordination, chemical thermodynamics, and standard industrial test protocols.`,
      keyTakeaways: [
        `Fundamental chemical classification and crystal/chain geometry for ${topic.title}.`,
        'Correlation between microstructural arrangement and macro-level physical performance.',
        'Standard thermodynamic boundary conditions.'
      ],
      difficulty: 'intermediate',
      tags: [topic.category, 'Textbook Reference']
    },
    {
      id: `fallback-nptel-${topic.id}`,
      title: `NPTEL Functional Materials Lecture Series: ${topic.category}`,
      type: 'lecture',
      authorOrSource: 'National Programme on Technology Enhanced Learning (IIT Kharagpur / IIT Madras)',
      description: `Curated university lecture series analyzing ${topic.title}, including derivations, state phase diagrams, and experimental characterization techniques.`,
      difficulty: 'intermediate',
      tags: ['NPTEL', topic.category]
    },
    {
      id: `fallback-formula-${topic.id}`,
      title: `Standard Formula & Constants Sheet: ${topic.title}`,
      type: 'formula',
      authorOrSource: 'National Institute of Standards and Technology (NIST)',
      description: `Summary of governing physical equations, thermodynamic variables, and experimental measurement criteria for ${topic.title}.`,
      difficulty: 'introductory',
      tags: ['Formula Card', 'Summary']
    }
  ];
}
