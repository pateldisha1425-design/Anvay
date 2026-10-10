import { TopicQuiz } from '../types/learning';
import { TopicNode } from '../types/knowledge';

export const TOPIC_QUIZZES: Record<string, TopicQuiz> = {
  // ==========================================
  // 01 OXIDES
  // ==========================================
  'oxides-definition': {
    topicId: 'oxides-definition',
    title: 'Oxides Classification & Fundamentals Mastery',
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-ox-1',
        question: 'Which of the following correctly pairs an oxide chemical formula with its classification category in Functional Materials Unit 1?',
        options: [
          'MgO is an ABO3-type oxide',
          'TiO2 is an AB2-type oxide, and BaTiO3 is an ABO3-type oxide',
          'BaTiO3 is an AB2-type oxide',
          'NiO is an ABO3-type oxide'
        ],
        correctIndex: 1,
        explanation: 'TiO2 has a 1:2 stoichiometry (AB2-type dioxide), while BaTiO3 contains two metal cations coordinated with oxygen in a ternary 1:1:3 ratio (ABO3-type). MgO and NiO are AB-type monoxides.',
        hint: 'Count the cation-to-anion stoichiometry in the chemical formula.'
      },
      {
        id: 'q-ox-2',
        question: 'What is the standard oxidation state of oxygen in solid metal oxides like MgO and TiO2?',
        options: [
          '-1 (Peroxide)',
          '-2 (Oxide ion, O2-)',
          '-1/2 (Superoxide)',
          '+2'
        ],
        correctIndex: 1,
        explanation: 'In normal metal oxides, oxygen possesses an oxidation state of -2, existing as the divalent O2- anion balancing metal cations.',
        hint: 'Think of the valence state required to balance Mg2+ in MgO.'
      },
      {
        id: 'q-ox-3',
        question: 'Which electrical conductivity range is observed across the broad spectrum of metal oxides?',
        options: [
          'Exclusively electrical insulators with zero exceptions',
          'Exclusively metallic conductors',
          'Spans from dielectric insulators (Al2O3) to wide-gap semiconductors (TiO2, ZnO) and high-Tc superconductors (YBCO)',
          'Only liquid electrolytes at room temperature'
        ],
        correctIndex: 2,
        explanation: 'Metal oxides exhibit the widest electrical diversity of any material class: Al2O3 and SiO2 are insulating dielectrics, ZnO and TiO2 are semiconductors, and YBa2Cu3O7-d is a high-temperature superconductor.',
        hint: 'Think about why ceramics are used as both high-voltage insulators and in solar cell semiconductors.'
      }
    ]
  },

  'ab-oxides': {
    topicId: 'ab-oxides',
    title: 'AB-type Monoxides Mastery',
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-ab-1',
        question: 'What is the prevailing crystal structure and coordination number for AB monoxides such as Magnesium Oxide (MgO)?',
        options: [
          'Fluorite structure with CN = 8:4',
          'Rocksalt (NaCl) face-centered cubic structure with CN = 6:6',
          'Hexagonal wurtzite with CN = 4:4',
          'Perovskite structure with CN = 12:6'
        ],
        correctIndex: 1,
        explanation: 'MgO, NiO, and FeO crystallize in the Rocksalt (FCC) structure where both cations and oxide anions have an octahedral coordination number of 6.',
        hint: 'It is identical to table salt (NaCl) geometry.',
        prerequisiteTopicId: 'oxides-definition'
      },
      {
        id: 'q-ab-2',
        question: 'Why does Magnesium Oxide (MgO) possess an extraordinarily high melting point (~2852°C)?',
        options: [
          'Weak van der Waals forces that easily vibrate',
          'Very high lattice energy resulting from divalent ions (Mg2+ and O2-) in close proximity',
          'Delocalized metallic electrons forming a sea around ions',
          'Extensive hydrogen bonding networks'
        ],
        correctIndex: 1,
        explanation: 'Lattice energy scales with the product of ionic charges (|q1 * q2| = 2 * 2 = 4). The divalent charges of Mg2+ and O2- generate massive electrostatic attraction compared to monovalent salts like NaCl (|1 * 1| = 1).',
        hint: 'Recall Coulomb\'s law: Force is proportional to q1 * q2.',
        prerequisiteTopicId: 'oxides-definition'
      }
    ]
  },

  'ab2-oxides': {
    topicId: 'ab2-oxides',
    title: 'AB2-type Dioxides Mastery',
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-ab2-1',
        question: 'Titanium dioxide (TiO2) exists in three crystalline polymorphs. Which polymorph is thermodynamically most stable at elevated temperatures and has a high refractive index (~2.7)?',
        options: [
          'Brookite',
          'Anatase',
          'Rutile',
          'Perovskite'
        ],
        correctIndex: 2,
        explanation: 'Rutile is the thermodynamically stable high-temperature tetragonal polymorph of TiO2. Anatase is metastable and converts irreversibly to rutile above ~600°C.',
        hint: 'It is the most common white pigment polymorph.',
        prerequisiteTopicId: 'oxides-definition'
      },
      {
        id: 'q-ab2-2',
        question: 'In the high-temperature solid-state synthesis of barium titanate (BaTiO3), what role does TiO2 play?',
        options: [
          'A volatile solvent that evaporates during calcination',
          'The tetravalent titanium dioxide precursor that reacts with BaCO3',
          'An inert crucible material',
          'A reducing agent supplying electrons'
        ],
        correctIndex: 1,
        explanation: 'Solid-state calcination reacts stoichiometric BaCO3 with TiO2 powder at 1100°C-1250°C to form BaTiO3 with CO2 gas release.',
        hint: 'Look at the solid-state reaction equation for BaTiO3.',
        prerequisiteTopicId: 'oxides-definition'
      }
    ]
  },

  'abo3-oxides': {
    topicId: 'abo3-oxides',
    title: 'ABO3-type Oxides & Tolerance Factor Mastery',
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-abo3-1',
        formulaSnippet: 't = (r_A + r_O) / [√2 * (r_B + r_O)]',
        question: 'In the Goldschmidt tolerance factor equation for ABO3 perovskites, what structural consequence typically occurs when t > 1.0 (such as in BaTiO3 at room temperature)?',
        options: [
          'The crystal decomposes into metallic alloys',
          'The B-site cation has excess room in its BO6 octahedron, permitting off-center ferroelectric displacement',
          'The material becomes a liquid at room temperature',
          'The crystal is forced to adopt a flat 2D graphene-like monolayer'
        ],
        correctIndex: 1,
        explanation: 'When t > 1.0, the A-cation expands the cube framework, leaving the central B-site (Ti4+) cation in an oversized cavity. Below Tc, it displaces off-center, producing spontaneous ferroelectric polarization.',
        hint: 'Think about why BaTiO3 is ferroelectric while ideal cubic SrTiO3 (t ~ 1.0) is not.',
        prerequisiteTopicId: 'ab2-oxides'
      },
      {
        id: 'q-abo3-2',
        question: 'In the ABO3 perovskite formula, what are the characteristic coordination numbers of the A and B cations with oxygen?',
        options: [
          'A is 12-coordinate; B is 6-coordinate (octahedral)',
          'A is 4-coordinate (tetrahedral); B is 12-coordinate',
          'A is 6-coordinate; B is 6-coordinate',
          'Both A and B are 2-coordinate linear'
        ],
        correctIndex: 0,
        explanation: 'The large A cation sits in the cuboctahedral interstice coordinated by 12 oxygen anions, while the smaller transition metal B cation sits in octahedral coordination (CN = 6) surrounded by corner-sharing BO6 octahedra.',
        hint: 'Corner-sharing octahedra mean 6 oxygens around the central B ion.',
        prerequisiteTopicId: 'ab-oxides'
      }
    ]
  },

  'perovskite-oxides': {
    topicId: 'perovskite-oxides',
    title: 'Perovskites & Ferroelectricity Mastery',
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-perov-1',
        question: 'What fundamental symmetry requirement must a crystal satisfy to exhibit ferroelectric and piezoelectric behavior?',
        options: [
          'Must possess a center of inversion symmetry (centrosymmetric)',
          'Must lack a center of inversion symmetry (non-centrosymmetric)',
          'Must be completely amorphous without long-range crystal order',
          'Must contain at least 50% carbon atoms'
        ],
        correctIndex: 1,
        explanation: 'Piezoelectricity and ferroelectricity can only occur in non-centrosymmetric crystal classes (20 of the 21 non-centrosymmetric point groups). Inversion symmetry would cancel out any macroscopic dipole moment.',
        hint: 'If every atom at (x, y, z) has an identical atom at (-x, -y, -z), can a net dipole exist?',
        prerequisiteTopicId: 'abo3-oxides'
      },
      {
        id: 'q-perov-2',
        question: 'Above the Curie temperature (Tc = 120°C for BaTiO3), what phase transition occurs and what happens to ferroelectricity?',
        options: [
          'The material melts into a liquid',
          'The crystal shifts from tetragonal to cubic (Pm-3m), and ferroelectricity disappears into a paraelectric state',
          'The crystal becomes superconducting',
          'Spontaneous polarization increases tenfold'
        ],
        correctIndex: 1,
        explanation: 'At Tc = 120°C, thermal agitation overcomes off-center Ti displacement. BaTiO3 transitions from polar tetragonal (P4mm) to centrosymmetric cubic (Pm-3m), losing spontaneous polarization and becoming paraelectric.',
        hint: 'Remember the Curie point marks the loss of permanent dipoles.',
        prerequisiteTopicId: 'abo3-oxides'
      },
      {
        id: 'q-perov-3',
        question: 'How do BaTiO3 and CaTiO3 compare at room temperature?',
        options: [
          'BaTiO3 is tetragonal and ferroelectric; CaTiO3 has tilted octahedra and is orthorhombic non-ferroelectric',
          'Both are completely identical liquids',
          'CaTiO3 is strongly ferroelectric while BaTiO3 is an electrical conductor',
          'Neither contains titanium'
        ],
        correctIndex: 0,
        explanation: 'Because Ca2+ is smaller than Ba2+, the tolerance factor of CaTiO3 is t ~ 0.96 (< 1), causing the TiO6 octahedra to tilt into an orthorhombic centrosymmetric lattice (Pbnm). BaTiO3 has t ~ 1.06, stabilizing the polar tetragonal phase.',
        hint: 'Consider ionic radius of Ca2+ vs Ba2+.',
        prerequisiteTopicId: 'abo3-oxides'
      }
    ]
  },

  'batio3-prep': {
    topicId: 'batio3-prep',
    title: 'Preparation of BaTiO3 Mastery',
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-bat-1',
        question: 'In the solid-state calcination of BaTiO3 from BaCO3 and TiO2, what byproduct gas is evolved at 1100°C-1250°C?',
        options: [
          'Oxygen (O2)',
          'Carbon dioxide (CO2)',
          'Methane (CH4)',
          'Chlorine gas (Cl2)'
        ],
        correctIndex: 1,
        explanation: 'The reaction is BaCO3(s) + TiO2(s) -> BaTiO3(s) + CO2(g) ^. Carbon dioxide gas is driven off during high-temperature calcination.',
        hint: 'What gas comes from thermal decomposition of carbonates?',
        prerequisiteTopicId: 'perovskite-oxides'
      },
      {
        id: 'q-bat-2',
        question: 'Why must the stoichiometric molar ratio of BaCO3 to TiO2 be strictly maintained at 1:1 during synthesis?',
        options: [
          'Any slight deviation causes the furnace to extinguish',
          'Excess Ba or Ti forms secondary dielectric-degrading phases like Ba2TiO4 or BaTi4O9',
          'Stoichiometry does not matter in ceramic processing',
          'Excess TiO2 turns the ceramic into a transparent liquid'
        ],
        correctIndex: 1,
        explanation: 'Deviation from 1:1 stoichiometry precipitates second phases such as orthotitanate (Ba2TiO4) or polytitanates (BaTi4O9), which drastically decrease dielectric permittivity and cause dielectric breakdown.',
        hint: 'Phase diagram boundary lines require pure single-phase perovskite.',
        prerequisiteTopicId: 'ab2-oxides'
      }
    ]
  },

  'ferroelectricity': {
    topicId: 'ferroelectricity',
    title: 'Ferroelectric Properties Mastery',
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-ferro-1',
        question: 'On a ferroelectric P-E hysteresis loop, what does the "Remanent Polarization (Pr)" represent?',
        options: [
          'The maximum electric field applied before dielectric breakdown',
          'The residual electric polarization remaining in the material when the external electric field is reduced to zero',
          'The electric field required to reduce polarization back to zero',
          'The frequency of the AC measurement signal'
        ],
        correctIndex: 1,
        explanation: 'Remanent Polarization (Pr) is the value of polarization retained by the ferroelectric material when the applied electric field E is brought to 0. Coercive field (Ec) is the reverse field needed to zero the polarization.',
        hint: 'Remanent = remaining at E = 0.',
        prerequisiteTopicId: 'perovskite-oxides'
      },
      {
        id: 'q-ferro-2',
        question: 'Which law describes the temperature dependence of relative permittivity (dielectric constant) above the Curie temperature?',
        options: [
          'Hooke\'s Law',
          'Curie-Weiss Law: εr = C / (T - T0)',
          'Bragg\'s Law',
          'Ohm\'s Law'
        ],
        correctIndex: 1,
        explanation: 'Above Tc in the paraelectric regime, permittivity diverges near the Curie temperature following the Curie-Weiss Law: eps_r = C / (T - T0), where C is the Curie constant and T0 is the Curie-Weiss temperature.',
        hint: 'Permittivity spikes dramatically as temperature approaches the Curie point.',
        prerequisiteTopicId: 'perovskite-oxides'
      }
    ]
  },

  // ==========================================
  // 02 POLYMERS
  // ==========================================
  'polymers-definition': {
    topicId: 'polymers-definition',
    title: 'Polymer Fundamentals & Classification Mastery',
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-poly-1',
        question: 'What is the primary structural distinction between thermoplastic and thermosetting polymers?',
        options: [
          'Thermoplastics are held by weak secondary forces and melt reversibly; thermosets contain permanent 3D covalent cross-links that cannot be remelted',
          'Thermoplastics contain only metals; thermosets contain only ceramics',
          'Thermoplastics cannot be molded; thermosets can be remelted infinitely',
          'There is no chemical difference between them'
        ],
        correctIndex: 0,
        explanation: 'Thermoplastics consist of linear or branched chains held by secondary van der Waals/hydrogen bonds that soften upon heating and solidify upon cooling. Thermosets form irreversible 3D covalent cross-linked networks that degrade rather than melt.',
        hint: 'Think about whether you can reheat and reshape the material.'
      },
      {
        id: 'q-poly-2',
        question: 'If a monomer possesses a functionality f = 2 (bifunctional), what type of polymer architecture will it predominantly produce?',
        options: [
          'A densely cross-linked 3D network',
          'Linear or slightly branched polymer chains',
          'A single spherical fullerene cage',
          'An inorganic diamond crystal'
        ],
        correctIndex: 1,
        explanation: 'Bifunctional monomers can only link hands in two directions (linear chains). A functionality f > 2 (e.g. trifunctional phenol) is required to form 3D cross-linked networks.',
        hint: 'Two hands can only link into a chain, not a 3D web.'
      }
    ]
  },

  'teflon': {
    topicId: 'teflon',
    title: 'Teflon (PTFE) Properties & Synthesis Mastery',
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-tef-1',
        question: 'What fundamental chemical bond gives Teflon (PTFE) its extraordinary chemical inertness and high continuous operating temperature (260°C)?',
        options: [
          'Weak hydrogen bonds',
          'Exceptionally strong Carbon-Fluorine (C-F) covalent bonds (~485 kJ/mol) with dense fluorine electron shielding',
          'Ionic bonds between carbon and sodium',
          'Metallic bonds with delocalized electrons'
        ],
        correctIndex: 1,
        explanation: 'The C-F bond is one of the strongest single bonds in organic chemistry (~485 kJ/mol). Furthermore, the highly electronegative fluorine atoms form a dense protective electronic sheath around the carbon backbone, resisting chemical attack.',
        hint: 'Consider the bond energy between Carbon and Fluorine.',
        prerequisiteTopicId: 'polymers-definition'
      },
      {
        id: 'q-tef-2',
        question: 'Why does Teflon exhibit one of the lowest known coefficients of kinetic friction (0.04-0.10)?',
        options: [
          'It is constantly covered in a layer of liquid oil',
          'Smooth helical macromolecular rods with low surface energy and unreactive fluorine sheaths slide past each other easily',
          'It has a jagged abrasive diamond surface',
          'It conducts high electrical current that repels contact surfaces'
        ],
        correctIndex: 1,
        explanation: 'PTFE chains adopt smooth, cylindrical helical conformations. The lack of bulky side groups and low intermolecular cohesive forces between non-polar fluorocarbon sheaths allow chains to glide past each other under shear stress with minimal resistance.',
        hint: 'Non-stick pans and unreactive helical fluorocarbon chains.',
        prerequisiteTopicId: 'polymers-definition'
      }
    ]
  },

  'novolac-formation': {
    topicId: 'novolac-formation',
    title: 'Novolac Synthesis Mastery',
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-novo-1',
        question: 'Under what chemical reaction conditions is linear Novolac prepolymer prepared from phenol and formaldehyde?',
        options: [
          'Strong basic conditions (NaOH) with excess formaldehyde',
          'Acidic conditions (pH < 7, HCl or oxalic acid) with excess phenol (Phenol / Formaldehyde molar ratio > 1)',
          'Neutral pure water at 0°C without any catalyst',
          'Under high vacuum with a platinum metal catalyst'
        ],
        correctIndex: 1,
        explanation: 'Novolac requires an acid catalyst and limiting formaldehyde (P/F ratio ~ 1 : 0.8). Because formaldehyde is limiting, all links remain linear methylene-bridged chains without premature 3D gelation.',
        hint: 'Remember the contrast: Novolac = Acid + Excess Phenol; Resol = Base + Excess Formaldehyde.',
        prerequisiteTopicId: 'polymers-definition'
      },
      {
        id: 'q-novo-2',
        question: 'Why is Novolac a thermoplastic resin that can melt and dissolve in acetone, rather than an infusible thermoset?',
        options: [
          'It contains no carbon atoms',
          'It consists of linear methylene-bridged phenolic chains with open unreacted ortho/para sites, lacking a 3D cross-linked network',
          'It has already undergone complete irreversible cross-linking',
          'It is a metal alloy'
        ],
        correctIndex: 1,
        explanation: 'Because formaldehyde was the limiting reagent during synthesis, the chains are only 1D linear oligomers. They require an external cross-linker (such as HMTA) to form the 3D Bakelite thermoset.',
        hint: 'Limiting reagent prevents 3D network formation.',
        prerequisiteTopicId: 'polymers-definition'
      }
    ]
  },

  'bakelite-formation': {
    topicId: 'bakelite-formation',
    title: 'Bakelite Formation & Curing Mastery',
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-bake-1',
        question: 'What is the role of hexamethylenetetramine (HMTA) in converting Novolac into Bakelite?',
        options: [
          'It acts as an inert dye to color the plastic black',
          'It acts as a cross-linking curing agent, supplying methylene (-CH2-) bridges under heat and pressure while releasing ammonia',
          'It dissolves the polymer into a liquid lubricant',
          'It neutralizes all chemical bonds into elemental carbon'
        ],
        correctIndex: 1,
        explanation: 'HMTA ((CH2)6N4) thermally decomposes at 150°C-170°C in the mold, donating active methylene (-CH2-) units that cross-link the open ortho and para positions of Novolac chains into a permanent 3D infusible resite network.',
        hint: 'Novolac lacks sufficient formaldehyde; HMTA provides the missing methylene links.',
        prerequisiteTopicId: 'novolac-formation'
      },
      {
        id: 'q-bake-2',
        question: 'What is the reactive functionality (f) of phenol towards formaldehyde electrophilic aromatic substitution?',
        options: [
          'f = 1 (only the -OH group reacts)',
          'f = 3 (the two ortho positions and one para position are activated by the -OH group)',
          'f = 6 (all six ring carbons are equally reactive)',
          'f = 0 (phenol is unreactive)'
        ],
        correctIndex: 1,
        explanation: 'The hydroxyl (-OH) group is a strong ortho/para-directing activating group via +M resonance. It activates the 2-ortho and 1-para positions, giving phenol an effective functionality of 3 in network polymerizations.',
        hint: 'Count the active positions on the benzene ring activated by -OH.',
        prerequisiteTopicId: 'polymers-definition'
      }
    ]
  },

  // ==========================================
  // 03 CONDUCTING POLYMERS
  // ==========================================
  'conducting-polymers-intro': {
    topicId: 'conducting-polymers-intro',
    title: 'Conducting Polymers & Doping Mastery',
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-cp-1',
        question: 'What fundamental structural feature is mandatory for an organic polymer to conduct electricity?',
        options: [
          'Complete saturation with single sigma bonds only',
          'An extended conjugated pi-electron backbone with alternating single and double bonds',
          'Inclusion of heavy radioactive isotopes',
          'A liquid crystalline state at room temperature'
        ],
        correctIndex: 1,
        explanation: 'Electrical conduction requires an extended conjugated pi-electron system (alternating single and double carbon bonds) providing delocalized p-orbitals along the polymer chain.',
        hint: 'Think of polyacetylene: -[CH=CH]n-.',
        prerequisiteTopicId: 'polymers-definition'
      },
      {
        id: 'q-cp-2',
        question: 'How does doping a conducting polymer (e.g. polyacetylene with iodine) differ fundamentally from semiconductor doping in Silicon?',
        options: [
          'Semiconductors are doped at ppm levels; conducting polymers undergo massive redox reactions at 1-10 mol% levels',
          'Semiconductors become insulators when doped; polymers do not change',
          'Silicon doping requires liquid water; polymer doping requires liquid nitrogen',
          'They are completely identical physical mechanisms'
        ],
        correctIndex: 0,
        explanation: 'Silicon doping involves substitutional incorporation at parts-per-million (ppm) levels without lattice distortion. Conducting polymer doping is a chemical REDOX reaction at massive levels (1-10 mol%), inserting counterions (I3-) and producing polarons.',
        hint: 'Look at the dopant concentration percentage: ppm vs 1-10 mol%.',
        prerequisiteTopicId: 'polymers-definition'
      },
      {
        id: 'q-cp-3',
        question: 'What are the localized charge carriers responsible for electrical transport in doped conjugated polymers?',
        options: [
          'Neutrons and alpha particles',
          'Solitons, polarons (radical ions), and bipolarons (dications/dianions) accompanied by local lattice relaxation',
          'Free valence electrons traveling in a vacuum',
          'Positrons emitted by beta decay'
        ],
        correctIndex: 1,
        explanation: 'Due to strong electron-phonon coupling and Peierls dimerization, charges in conjugated polymers distort the surrounding lattice, forming quasiparticles: solitons, polarons, and bipolarons.',
        hint: 'Coupled charge and lattice distortion.',
        prerequisiteTopicId: 'polymers-definition'
      }
    ]
  },

  // ==========================================
  // 04 NANOMATERIALS
  // ==========================================
  'nanotechnology-definition': {
    topicId: 'nanotechnology-definition',
    title: 'Nanotechnology Length Scales & Dimensionality Mastery',
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-nano-1',
        question: 'By standard scientific convention, what is the length scale defining nanomaterials?',
        options: [
          'Between 1 millimeter and 10 centimeters',
          'At least one dimension between 1 nanometer and 100 nanometers',
          'Strictly smaller than a single proton (< 10^-15 m)',
          'Any material visible under an optical microscope'
        ],
        correctIndex: 1,
        explanation: 'By international standard definition (ISO/TS 80004), nanomaterials possess at least one external or internal dimension in the nanoscale range of 1 nm to 100 nm.',
        hint: '1 nm to 100 nm.',
        prerequisiteTopicId: 'polymers-definition'
      },
      {
        id: 'q-nano-2',
        question: 'A quantum dot has all three spatial dimensions confined below 100 nm. What is its dimensionality classification?',
        options: [
          '0D (Zero-dimensional)',
          '1D (One-dimensional)',
          '2D (Two-dimensional)',
          '3D (Three-dimensional bulk)'
        ],
        correctIndex: 0,
        explanation: 'Nanomaterials are classified by degrees of freedom: 0D = confined in all 3 dimensions (nanoparticles, quantum dots); 1D = confined in 2 dimensions (nanowires, CNTs); 2D = confined in 1 dimension (graphene, nanosheets).',
        hint: 'Zero dimensions of free macroscopic motion.',
        prerequisiteTopicId: 'polymers-definition'
      }
    ]
  },

  'energy-band-gap': {
    topicId: 'energy-band-gap',
    title: 'Quantum Confinement & Brus Equation Mastery',
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-gap-1',
        formulaSnippet: 'ΔE ~ ħ²π² / [2 R² * μ]',
        question: 'According to the Brus equation for quantum dots, how does the kinetic confinement energy scale with nanoparticle radius (R)?',
        options: [
          'Directly proportional to radius (scales as R)',
          'Inversely proportional to radius squared (scales as 1 / R²)',
          'Independent of particle radius',
          'Directly proportional to R³'
        ],
        correctIndex: 1,
        explanation: 'Quantum confinement energy derives from the particle-in-a-box Hamiltonian, where kinetic energy E_k = h^2 / (8 m L^2), scaling inversely with radius squared (1 / R^2). Halving the radius quadruples confinement energy.',
        hint: 'Recall the particle-in-a-box energy formula: En ~ n² h² / (8 m L²).',
        prerequisiteTopicId: 'nanotechnology-definition'
      },
      {
        id: 'q-gap-2',
        question: 'What optical effect occurs when the size of a semiconductor nanoparticle shrinks below its exciton Bohr radius?',
        options: [
          'Red shift (emission moves to longer wavelengths and lower photon energies)',
          'Blue shift (absorption/emission shifts to shorter wavelengths and higher photon energies)',
          'Total loss of all optical absorption',
          'Emission becomes continuous white light regardless of composition'
        ],
        correctIndex: 1,
        explanation: 'As particle radius decreases, the bandgap widens due to quantum confinement (E = hc / lambda). Higher transition energy corresponds to shorter wavelengths, shifting optical emission towards blue (the Blue Shift).',
        hint: 'Smaller particle = wider bandgap = higher photon energy = shorter wavelength.',
        prerequisiteTopicId: 'nanotechnology-definition'
      }
    ]
  },

  // ==========================================
  // 06 OLEDS
  // ==========================================
  'oled-working-principle': {
    topicId: 'oled-working-principle',
    title: 'OLED Device Physics & Quantum Efficiency Mastery',
    passingScorePercent: 70,
    questions: [
      {
        id: 'q-oled-1',
        question: 'In an OLED device stack, what transparent conductive oxide is universally used as the anode to inject holes into the Hole Transport Layer (HTL)?',
        options: [
          'Aluminum (Al)',
          'Indium Tin Oxide (ITO)',
          'Magnesium-Silver alloy (Mg:Ag)',
          'Teflon (PTFE)'
        ],
        correctIndex: 1,
        explanation: 'Indium Tin Oxide (ITO) is transparent to visible light (>85% transmission) and possesses a high work function (~4.8 eV), perfectly matched for hole injection into organic HTL materials like NPB or PEDOT:PSS.',
        hint: 'A transparent oxide conductor coated on glass substrates.',
        prerequisiteTopicId: 'conducting-polymers-intro'
      },
      {
        id: 'q-oled-2',
        question: 'Why is the internal quantum efficiency (IQE) of purely organic fluorescent OLEDs theoretically limited to 25%?',
        options: [
          '75% of electrons evaporate into the atmosphere',
          'Quantum spin statistics dictate that electron-hole recombination produces 25% singlets and 75% triplets; triplet decay is spin-forbidden in fluorescent molecules',
          'Glass substrates absorb 75% of all emitted light',
          'The battery only operates at 25% duty cycle'
        ],
        correctIndex: 1,
        explanation: 'Fermion spin combination yields 1 singlet state (S=0, 25%) and 3 triplet states (S=1, 75%). In fluorescent emitters, decay from triplet states violates spin conservation (delta S = 1) and dissipates non-radiatively as heat.',
        hint: 'Spin multiplicity: 1 singlet : 3 triplets.',
        prerequisiteTopicId: 'conducting-polymers-intro'
      },
      {
        id: 'q-oled-3',
        question: 'How do phosphorescent OLEDs (PHOLEDs) achieve up to 100% internal quantum efficiency?',
        options: [
          'By removing all electrons from the device',
          'By doping with heavy metal complexes (e.g. Iridium Ir(ppy)3 or Platinum) whose strong spin-orbit coupling permits radiative triplet decay',
          'By operating at liquid helium temperatures only',
          'By increasing the operating voltage to 10,000 Volts'
        ],
        correctIndex: 1,
        explanation: 'Heavy transition metal complexes introduce strong Spin-Orbit Coupling, mixing singlet and triplet quantum states. This allows both the 25% singlets and 75% triplets to emit light radiatively, achieving 100% internal quantum efficiency.',
        hint: 'Heavy atoms (Ir, Pt) promote spin-orbit coupling.',
        prerequisiteTopicId: 'conducting-polymers-intro'
      }
    ]
  }
};

/**
 * Returns a mastery quiz for any topic, generating a contextual fallback quiz if not explicitly curated
 */
export function getQuizForTopic(topic: TopicNode): TopicQuiz {
  if (TOPIC_QUIZZES[topic.id]) {
    return TOPIC_QUIZZES[topic.id];
  }

  // Dynamic quiz generator for other syllabus topics or custom user notes
  return {
    topicId: topic.id,
    title: `${topic.title} Mastery Quiz`,
    passingScorePercent: 70,
    questions: [
      {
        id: `gen-q1-${topic.id}`,
        question: `What is the core functional classification and significance of ${topic.title} in the ${topic.category} unit?`,
        options: [
          `${topic.description}`,
          `An unrelated industrial waste byproduct with no academic utility`,
          `A purely theoretical concept disproven in modern materials physics`,
          `A mechanical fastener used strictly in structural civil engineering`
        ],
        correctIndex: 0,
        explanation: `${topic.description} This represents the defined syllabus foundation in ${topic.category}.`,
        hint: `Recall the primary definition from course notes: ${topic.title}.`,
        prerequisiteTopicId: topic.prerequisiteIds[0]
      },
      {
        id: `gen-q2-${topic.id}`,
        question: `Which prerequisite relationship is essential to master before studying ${topic.title}?`,
        options: [
          topic.prerequisiteIds.length > 0 
            ? `Understanding foundational concepts including [[${topic.prerequisiteIds[0]}]]` 
            : `Foundational introductory concepts of ${topic.category}`,
          'No prior knowledge of chemistry or materials is required',
          'Relativity and astrophysics exclusively',
          'Ancient metallurgical alchemy'
        ],
        correctIndex: 0,
        explanation: topic.prerequisiteIds.length > 0 
          ? `Mastering ${topic.prerequisiteIds.join(', ')} is critical for complete comprehension.`
          : `Understanding foundational definitions in ${topic.category} is necessary.`,
        hint: `Look at the prerequisite tree for ${topic.title}.`,
        prerequisiteTopicId: topic.prerequisiteIds[0]
      },
      {
        id: `gen-q3-${topic.id}`,
        question: `In practical device engineering, what primary physical or chemical property is dictated by ${topic.title}?`,
        options: [
          `Electronic, dielectric, or macromolecular performance governed by microstructural arrangement in ${topic.category}`,
          'Arbitrary random behavior with zero correlation to microstructure',
          'Only gravitational mass changes',
          'Instantaneous radioactive decay'
        ],
        correctIndex: 0,
        explanation: `In functional materials science, the microstructural arrangement of ${topic.title} directly governs macroscale electronic, optical, or mechanical properties.`,
        hint: `Structure-property relationship in ${topic.category}.`,
        prerequisiteTopicId: topic.prerequisiteIds[0]
      }
    ]
  };
}
