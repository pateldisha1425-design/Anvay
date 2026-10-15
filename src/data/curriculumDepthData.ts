import { TopicDepthData, ContentDepthLevel } from '../types/learning';
import { TopicNode } from '../types/knowledge';

export const CURRICULUM_DEPTH_REGISTRY: Record<string, TopicDepthData> = {
  // ==========================================
  // UNIT 01: OXIDES
  // ==========================================
  'perovskite-oxides': {
    topicId: 'perovskite-oxides',
    foundational: {
      coreAnalogy: 'The "Wobbly Cage & Off-Center Marble" Analogy',
      intuitiveExplanation: `Imagine a sturdy 3D cubic birdcage made of oxygen atoms at every face and large barium atoms at the corners. In the exact center hangs a heavy little titanium marble.
- At high temperatures, thermal shaking makes the marble vibrate equally in all directions, staying dead-center on average.
- When cooled below 120°C (the Curie point), the cage tightens slightly. The marble no longer fits stably in the center, so it drops into an off-center ditch toward one of the oxygen atoms by just 0.05 Å (0.005 nm).
- Because the titanium ion carries a strong +4 charge, falling off-center separates positive and negative charges permanently—creating an electric dipole!
- When you apply an external voltage, you can snap that marble to the opposite ditch. That reversible snapping is ferroelectricity!`,
      keyTakeaways: [
        'Perovskites have the general chemical formula ABO3 named after calcium titanate (CaTiO3).',
        'Spontaneous polarization comes from the small B cation displacing off-center inside its oxygen cage.',
        'Above the Curie temperature (120°C for BaTiO3), thermal vibration restores symmetry and polarization vanishes.',
        'Reversible dipoles allow perovskites to store electric charge (capacitors) and convert pressure into voltage (sensors).'
      ],
      quickCheckQuestion: 'What happens to the ferroelectric polarization of BaTiO3 when heated above 120°C?',
      quickCheckAnswer: 'Polarization vanishes completely because thermal vibrations restore the cubic centrosymmetric crystal symmetry (paraelectric state).'
    },
    undergraduate: {
      formalNotes: `### Perovskite Crystallography & Formula ($ABO_3$)
The ideal perovskite crystal structure belongs to the cubic space group $Pm\\bar{3}m$:
- **A-site Cations** ($12$-fold coordination): Occupy the corners $(0, 0, 0)$ of the unit cell (e.g., $Ba^{2+}$, $Ca^{2+}$, $Pb^{2+}$).
- **B-site Cations** ($6$-fold octahedral coordination): Occupy the body center $(1/2, 1/2, 1/2)$ (e.g., $Ti^{4+}$, $Zr^{4+}$).
- **Oxygen Anions** ($O^{2-}$): Occupy the face centers $(1/2, 1/2, 0)$, $(1/2, 0, 1/2)$, $(0, 1/2, 1/2)$, forming a three-dimensional framework of corner-sharing $BO_6$ octahedra.

### Structural Phase Transition Sequence in $BaTiO_3$:
As temperature drops from high heat, $BaTiO_3$ undergoes four distinct crystallographic polymorphs:
1. **$T > 120^\\circ\\text{C}$ (Cubic, $Pm\\bar{3}m$)**: Paraelectric, centrosymmetric, no spontaneous polarization ($P_s = 0$).
2. **$5^\\circ\\text{C} < T < 120^\\circ\\text{C}$ (Tetragonal, $P4mm$)**: Ferroelectric, polar axis along $[001]$, spontaneous polarization $P_s \\approx 26\\text{ }\\mu\\text{C/cm}^2$.
3. **$-90^\\circ\\text{C} < T < 5^\\circ\\text{C}$ (Orthorhombic, $Amm2$)**: Ferroelectric, polar axis along $[110]$.
4. **$T < -90^\\circ\\text{C}$ (Rhombohedral, $R3m$)**: Ferroelectric, polar axis along $[111]$.`,
      reactionMechanismsOrStructures: `\`\`\`
       Ba2+ (Corner) ------- O2- (Face) ------- Ba2+ (Corner)
         |                      |                 |
         |         Ti4+ (Body Center)             |
         |                      |                 |
       Ba2+ (Corner) ------- O2- (Face) ------- Ba2+ (Corner)
       (Corner-sharing TiO6 octahedra with Ti off-centering along [001])
\`\`\``,
      applications: [
        'Multilayer Ceramic Capacitors (MLCCs) utilizing high dielectric permittivity (κ > 1,500 - 10,000).',
        'Piezoelectric sonar transducers, ultrasonic cleaning horns, and ignition actuators.',
        'Positive Temperature Coefficient (PTC) thermistors for self-regulating heaters and overload limiters.',
        'Non-volatile Ferroelectric RAM (FeRAM) utilizing fast polarization domain switching.'
      ],
      keyInsights: [
        'Corner-sharing of octahedra provides structural flexibility needed for non-centrosymmetric distortion.',
        'Curie temperature marks the boundary between ordered ferroelectric and disordered paraelectric phases.'
      ]
    },
    gateHonors: {
      derivationTitle: 'Goldschmidt Tolerance Factor & Landau-Devonshire Free Energy Formulation',
      rigorousDerivation: `### 1. Geometric Tolerance Factor ($t$) Derivation
Consider hard spheres packed in an ideal cubic perovskite lattice with lattice constant $a$:
- Along the unit cell edge ($B-O$ contact):
  $$a = 2(r_B + r_O)$$
- Along the face diagonal ($A-O$ contact):
  $$\\sqrt{2} a = 2(r_A + r_O) \\implies a = \\sqrt{2}(r_A + r_O)$$

Equating the two expressions for the unit cell parameter $a$:
$$2(r_B + r_O) = \\sqrt{2}(r_A + r_O) \\implies \\frac{r_A + r_O}{\\sqrt{2}(r_B + r_O)} = 1$$

We define the **Goldschmidt Tolerance Factor ($t$)**:
$$t = \\frac{r_A + r_O}{\\sqrt{2}(r_B + r_O)}$$

- **$0.90 \\le t \\le 1.00$**: Stable cubic perovskite (e.g., $SrTiO_3$, $t \\approx 1.00$).
- **$t > 1.00$**: $A$ cation is oversized, expanding the lattice and creating an oversized $O_6$ cage for $B$. This drives hybridization between $Ti\\text{ }3d$ and $O\\text{ }2p$ orbitals, inducing a **ferroelectric off-center displacement** (e.g., $BaTiO_3$, $t \\approx 1.06$).
- **$t < 0.90$**: $A$ cation is undersized, forcing cooperative tilting of $BO_6$ octahedra to reduce coordination volume (e.g., $CaTiO_3$, $t \\approx 0.96$, centrosymmetric orthorhombic $Pbnm$).

### 2. Landau-Devonshire Phenomenological Expansion
The free energy density $\\Delta G$ as a power series of polarization $P$:
$$\\Delta G(P, T) = \\frac{1}{2} \\alpha_0 (T - T_0) P^2 + \\frac{1}{4} \\beta P^4 + \\frac{1}{6} \\gamma P^6 - E P$$
Where:
- $\\alpha(T) = \\alpha_0 (T - T_0)$ is the temperature-dependent dielectric stiffness.
- When $\\beta > 0$: **Second-order ferroelectric phase transition** (continuous $P_s(T)$ drop to 0 at $T_c = T_0$).
- When $\\beta < 0$ and $\\gamma > 0$: **First-order ferroelectric phase transition** (discontinuous jump in $P_s$ at $T_c = T_0 + \\frac{3\\beta^2}{16\\alpha_0\\gamma} > T_0$, characteristic of $BaTiO_3$).`,
      keyFormulas: [
        {
          name: 'Goldschmidt Tolerance Factor',
          formula: 't = \\frac{r_A + r_O}{\\sqrt{2}(r_B + r_O)}',
          parameterDefinitions: 'r_A = A-site ionic radius, r_B = B-site ionic radius, r_O = Oxygen anion radius (1.40 Å)',
          units: 'Dimensionless',
          validityConditions: 'Valid for ABO3 perovskite systems with 12-coordinated A and 6-coordinated B ions.'
        },
        {
          name: 'Curie-Weiss Law (Paraelectric Phase)',
          formula: '\\epsilon_r = \\frac{C}{T - T_0}',
          parameterDefinitions: 'C = Curie constant (~10^5 K for BaTiO3), T_0 = Curie-Weiss temperature, T = Absolute temperature',
          units: 'K / K = Dimensionless',
          validityConditions: 'Valid strictly for T > Tc.'
        },
        {
          name: 'Direct Piezoelectric Coupling',
          formula: 'P_i = d_{ijk} \\sigma_{jk}',
          parameterDefinitions: 'P_i = Induced polarization vector, d_{ijk} = Piezoelectric tensor, \\sigma_{jk} = Applied mechanical stress tensor',
          units: 'C/m² or C/N'
        }
      ],
      examTraps: [
        'Advanced Exam Trap: Do NOT confuse CaTiO3 with BaTiO3! CaTiO3 has t < 1 (0.96) and relieves strain by octahedral tilting without ferroelectric dipole. Only BaTiO3 has t > 1 (1.06) with off-centering and room-temperature ferroelectricity.',
        'Negative Marking Warning: In BaTiO3, the phase transition at Tc = 120°C is FIRST-ORDER (discontinuous latent heat and finite volume change), NOT second-order. The Curie temperature Tc is slightly higher than the Curie-Weiss temperature T0 (Tc ≈ T0 + 12 K).',
        'Viva Defense: All ferroelectric crystals are piezoelectric, but the reverse is NOT true (e.g., alpha-Quartz and ZnO are piezoelectric but non-ferroelectric because their polarization cannot be reversed by an electric field).'
      ],
      solvedNumericals: [
        {
          id: 'num-perov-1',
          gateYearOrExam: 'Advanced Metallurgy & Materials Science',
          difficulty: 'Advanced Academic',
          problemStatement: 'Calculate the Goldschmidt tolerance factor (t) for Barium Titanate (BaTiO3) given the ionic radii: r(Ba²⁺) = 1.61 Å (CN=12), r(Ti⁴⁺) = 0.605 Å (CN=6), and r(O²⁻) = 1.40 Å (CN=6). Based on the calculated value, predict the crystallographic distortion.',
          givenValues: {
            'r_A (Ba²⁺)': '1.61 Å',
            'r_B (Ti⁴⁺)': '0.605 Å',
            'r_O (O²⁻)': '1.40 Å'
          },
          formulaUsed: 't = (r_A + r_O) / [√2 * (r_B + r_O)]',
          stepByStepSolution: [
            'Step 1: Calculate the numerator (A-O distance parameter): r_A + r_O = 1.61 Å + 1.40 Å = 3.01 Å.',
            'Step 2: Calculate the denominator term: r_B + r_O = 0.605 Å + 1.40 Å = 2.005 Å.',
            'Step 3: Multiply denominator by √2 (≈ 1.4142): √2 * (r_B + r_O) = 1.4142 * 2.005 Å = 2.8355 Å.',
            'Step 4: Compute the tolerance factor t = 3.01 / 2.8355 = 1.0615 ≈ 1.06.'
          ],
          answerWithUnits: 't = 1.06 (Dimensionless). Since t > 1.00, the Ti⁴⁺ cation is undersized for the octahedral cavity, driving non-centrosymmetric tetragonal distortion (P4mm) and spontaneous ferroelectricity.'
        }
      ],
      vivaQuestions: [
        {
          question: 'Why does dielectric permittivity spike to thousands of units near the Curie point?',
          modelAnswer: 'According to the Lyddane-Sachs-Teller relation and Cochran soft mode theory, the transverse optical phonon frequency approaches zero (ω_TO -> 0) as T -> Tc. The lattice becomes extremely compliant to polar displacement, resulting in a divergent dielectric response: ε(0) / ε(∞) = (ω_LO / ω_TO)² -> ∞.'
        }
      ]
    }
  },

  // ==========================================
  // UNIT 02: POLYMERS
  // ==========================================
  'bakelite-formation': {
    topicId: 'bakelite-formation',
    foundational: {
      coreAnalogy: 'The "Cooked Spaghetti Noodles Spot-Welded into a Steel Cage" Analogy',
      intuitiveExplanation: `Think of making Bakelite in two distinct steps:
1. **Making the Spaghetti (Novolac)**: In the first step, phenol reacts with a limited amount of formaldehyde in acid. The molecules join hands into long, loose, flexible noodles. Because they are only loose strands sliding past each other, heat melts them and alcohol dissolves them. This is thermoplastic Novolac.
2. **Welding the Strands (Bakelite)**: Now add hexamethylenetetramine (HMTA) powder and heat it in a heavy steel mold at 160°C. The HMTA decomposes, creating permanent methylene (-CH2-) covalent welds between every neighboring strand in all three dimensions!
Once cured, the loose strands become a single gigantic 3D molecular scaffolding spanning the entire molded piece. Heating it will never melt it; it will only char and burn at extreme temperatures!`,
      keyTakeaways: [
        'Novolac is a linear thermoplastic prepolymer prepared with acid catalyst and excess phenol (P/F > 1).',
        'Bakelite is a 3D cross-linked thermoset resin cured with HMTA or heat.',
        'HMTA serves as a methylene donor to crosslink unreacted ortho and para positions of phenol.',
        'Once cross-linked (C-stage resite), the polymer is infusible, insoluble, and mechanically rigid.'
      ],
      quickCheckQuestion: 'Can fully cured Bakelite be melted and remolded into a new shape?',
      quickCheckAnswer: 'No, because Bakelite is a 3D covalent thermoset network. Thermal reheating cannot break covalent cross-links without causing chemical decomposition and charring.'
    },
    undergraduate: {
      formalNotes: `### Synthesis of Phenol-Formaldehyde Resins
Phenol reacts with formaldehyde via step-growth condensation polymerization. The pathway is determined by catalyst pH and stoichiometric ratio:
1. **Novolac Route (Acid Catalyzed)**:
   - **Ratio**: Excess Phenol, $[Phenol] / [Formaldehyde] > 1$ (typically $1 : 0.8$).
   - **Catalyst**: Mineral acid ($HCl$, $H_2SO_4$, oxalic acid).
   - **Product**: Linear, fusible, soluble prepolymer ($M_w \\approx 500 - 2,000\\text{ g/mol}$) linked predominantly by *ortho-para* and *para-para* methylene bridges.
   - Requires external cross-linking agent (**HMTA**, ~8-15 wt%) under heat ($150-170^\\circ\\text{C}$) to cure into Bakelite.

2. **Resol Route (Base Catalyzed)**:
   - **Ratio**: Excess Formaldehyde, $[Formaldehyde] / [Phenol] > 1$ (typically $1.2 - 2.0 : 1$).
   - **Catalyst**: Base ($NaOH$, $NH_4OH$, $Ba(OH)_2$).
   - **Product**: Branched prepolymer containing reactive methylol ($-CH_2OH$) and ether ($-CH_2-O-CH_2-$) groups. Self-cures upon simple heating without adding external HMTA.

### 3-Stage Curing Cycle of Phenolics:
- **A-Stage (Resol / Novolac)**: Soluble in organic solvents, fusible upon heating ($70-100^\\circ\\text{C}$).
- **B-Stage (Resitol)**: Partially crosslinked, rubbery at mold temperatures, swellable in solvents.
- **C-Stage (Resite / Bakelite)**: Fully crosslinked 3D network, infusible ($T_g > 250^\\circ\\text{C}$), chemically inert, solvent-insoluble.`,
      reactionMechanismsOrStructures: `\`\`\`
  Phenol + Formaldehyde --(Acid, Limiting HCHO)--> Novolac (Linear Chains)
                                                        |
                                            + HMTA [(CH2)6N4] + Heat (160°C)
                                                        |
                                                        v
      [ OH ]               [ OH ]               [ OH ]
        |                    |                    |
     --Ph-- CH2 ---------- Ph -- CH2 ---------- Ph --
        |                    |                    |
       CH2                  CH2                  CH2
        |                    |                    |
     --Ph-- CH2 ---------- Ph -- CH2 ---------- Ph --
        |                    |                    |
      [ OH ]               [ OH ]               [ OH ]
               (3D Infusible Network - Bakelite)
\`\`\``,
      applications: [
        'Electrical insulation: switchboards, circuit breaker housings, spark plug caps, and sockets due to high dielectric strength.',
        'Molded consumer goods: vintage telephone bodies, saucepan handles, billiard balls.',
        'Ablative heat shields: missile nose cones and re-entry vehicle tiles due to slow endothermic carbonization without melting.'
      ],
      keyInsights: [
        'Phenol has three reactive positions (two ortho, one para activated by resonance).',
        'HMTA releases ammonia gas during cure, requiring high mold clamp pressure to avoid void formation.'
      ]
    },
    gateHonors: {
      derivationTitle: 'Carothers Gelation Equation & Molecular Weight Distribution (Mn, Mw, PDI)',
      rigorousDerivation: `### 1. Carothers Equation for Step-Growth Gel Point ($p_c$)
Let $N_0$ be the initial number of monomer molecules, and $f_{avg}$ be the average functionality:
$$f_{avg} = \\frac{\\sum N_i f_i}{\\sum N_i}$$

The initial number of reactive functional groups is $N_0 f_{avg}$.
After extent of reaction $p$ (fraction of functional groups reacted), the number of functional groups consumed is $2(N_0 - N)$, where $N$ is the number of remaining molecules.
$$p = \\frac{2(N_0 - N)}{N_0 f_{avg}} = \\frac{2}{f_{avg}} \\left( 1 - \\frac{N}{N_0} \\right)$$

Since number-average degree of polymerization is $DP_n = \\frac{N_0}{N}$:
$$p = \\frac{2}{f_{avg}} \\left( 1 - \\frac{1}{DP_n} \\right)$$

At the **gel point**, an infinite 3D network forms, meaning $DP_n \\rightarrow \\infty$.
Setting $1 / DP_n \\rightarrow 0$, the critical conversion for gelation ($p_c$) is:
$$p_c = \\frac{2}{f_{avg}}$$

### 2. Molecular Weights & Polydispersity Index (PDI)
- **Number-Average Molecular Weight**:
  $$\\bar{M}_n = \\frac{\\sum N_i M_i}{\\sum N_i}$$
  Sensitive to colligative properties (osmometry, boiling point elevation).
- **Weight-Average Molecular Weight**:
  $$\\bar{M}_w = \\frac{\\sum N_i M_i^2}{\\sum N_i M_i} = \\frac{\\sum w_i M_i}{\\sum w_i}$$
  Sensitive to bulk viscosity and light scattering.
- **Polydispersity Index**:
  $$PDI = \\frac{\\bar{M}_w}{\\bar{M}_n} \\ge 1.0$$
  For idealized step-growth polymers at high conversion: $PDI = 1 + p \\rightarrow 2.0$.`,
      keyFormulas: [
        {
          name: 'Carothers Gel Point Equation',
          formula: 'p_c = \\frac{2}{f_{avg}}',
          parameterDefinitions: 'p_c = Critical extent of reaction for gelation, f_avg = Average monomer functionality',
          units: 'Dimensionless (fraction 0 to 1)',
          validityConditions: 'Valid for stoichiometric or non-stoichiometric multi-functional step growth reactions.'
        },
        {
          name: 'Number-Average DP (Carothers Linear)',
          formula: 'DP_n = \\frac{1}{1 - p}',
          parameterDefinitions: 'p = Extent of reaction in stoichiometric bifunctional system',
          units: 'Dimensionless integer/real'
        },
        {
          name: 'Polydispersity Index',
          formula: 'PDI = \\frac{\\bar{M}_w}{\\bar{M}_n}',
          parameterDefinitions: 'M_w = Weight-average molecular weight, M_n = Number-average molecular weight',
          units: 'Dimensionless (PDI >= 1.0)'
        }
      ],
      examTraps: [
        'Functionality Trap: The functionality of Phenol is 3 (2 ortho + 1 para), NOT 6 and NOT 1! Meta positions are inactive toward electrophilic substitution.',
        'Stoichiometry Misconception: If a system has f_avg <= 2, pc >= 1.0, meaning the system can NEVER form a 3D gel (it remains strictly linear or branched thermoplastic). Gelation requires f_avg > 2.',
        'Exam Numerical Trap: In non-stoichiometric mixtures, f_avg must be calculated based on the total number of molecules, not just the limiting reagent.'
      ],
      solvedNumericals: [
        {
          id: 'num-poly-1',
          gateYearOrExam: 'Advanced Chemistry & Polymer Science',
          difficulty: 'Advanced Academic',
          problemStatement: 'A thermosetting resin formulation consists of 2 moles of glycerol (tri-ol, f = 3) and 3 moles of phthalic anhydride (di-acid, f = 2). Calculate: (a) the average functionality (f_avg), and (b) the critical extent of reaction (p_c) at which gelation occurs according to Carothers equation.',
          givenValues: {
            'Moles of Glycerol (N_1)': '2 mol',
            'Functionality of Glycerol (f_1)': '3',
            'Moles of Phthalic Anhydride (N_2)': '3 mol',
            'Functionality of Phthalic Anhydride (f_2)': '2'
          },
          formulaUsed: 'f_avg = (N_1*f_1 + N_2*f_2) / (N_1 + N_2), and p_c = 2 / f_avg',
          stepByStepSolution: [
            'Step 1: Calculate total functional groups: (2 * 3) + (3 * 2) = 6 OH groups + 6 COOH groups = 12 functional groups.',
            'Step 2: Total number of monomer molecules = 2 + 3 = 5 moles.',
            'Step 3: Compute f_avg = (2*3 + 3*2) / (2 + 3) = 12 / 5 = 2.40.',
            'Step 4: Note that stoichiometric balance exists (6 OH groups balance 6 COOH groups).',
            'Step 5: Apply Carothers relation: p_c = 2 / f_avg = 2 / 2.40 = 0.8333.'
          ],
          answerWithUnits: 'f_avg = 2.40 (Dimensionless); p_c = 0.833 (or 83.3% conversion of functional groups).'
        }
      ],
      vivaQuestions: [
        {
          question: 'Why does HMTA produce ammonia during curing, and why is this an engineering concern?',
          modelAnswer: 'HMTA is hexamethylenetetramine (C6H12N4). Upon thermal cleavage at 160°C, it provides six methylene (-CH2-) crosslinks and releases four ammonia (NH3) gas molecules. If high clamping pressure (15-30 MPa) is not maintained in the mold until crosslinking solidifies, trapped ammonia gas causes porosity, blistering, and structural failure.'
        }
      ]
    }
  },

  // ==========================================
  // UNIT 03: CONDUCTING POLYMERS
  // ==========================================
  'conducting-polymers-intro': {
    topicId: 'conducting-polymers-intro',
    foundational: {
      coreAnalogy: 'The "Electronic Express Highway & Tow Truck" Analogy',
      intuitiveExplanation: `Why are plastics like polyethylene good insulators, while copper conducts electricity?
- In regular plastic bags, every electron is locked tightly inside single covalent bonds, like cars parked inside individual private garages.
- In **conducting polymers** like polyacetylene, the backbone has alternating single and double bonds. The unhybridized p-orbitals overlap sideways to form an uninterrupted multi-lane superhighway running down the chain!
- *However, in pure form, the highway is packed bumper-to-bumper with electrons (filled valence band). No car can move!*
- Now enter **doping**: We expose the polymer to iodine vapor (a tow truck). Iodine snatches an electron, creating an empty space (a hole/polaron).
- Immediately, adjacent electrons can shift into that vacancy, allowing the next to shift, and the next!
The plastic transforms from a dull gray insulator into a shiny golden foil that conducts electricity almost like copper!`,
      keyTakeaways: [
        'Conducting polymers require an extended conjugated backbone with alternating single and double bonds.',
        'Pure conjugated polymers are semiconductors with an energy gap (~1.5 eV for polyacetylene).',
        'Chemical or electrochemical doping (oxidation/reduction) increases conductivity by up to 10 orders of magnitude.',
        'Charge carriers in polymers are quasi-particles: solitons, polarons, and bipolarons coupled to lattice deformations.'
      ],
      quickCheckQuestion: 'Why does polyacetylene need a dopant like iodine to achieve metallic conductivity?',
      quickCheckAnswer: 'Because pure polyacetylene undergoes Peierls dimerization, opening an energy bandgap (semiconductor). Iodine oxidation (p-doping) removes electrons, creating mobile polaron and bipolaron charge carriers.'
    },
    undergraduate: {
      formalNotes: `### Conjugation & Electronic Structure
A conjugated polymer consists of alternating carbon-carbon single ($\\\\sigma$) and double ($\\\\sigma + \\\\pi$) bonds:
- Carbon atoms are $sp^2$ hybridized, leaving one unhybridized $p_z$ orbital perpendicular to the molecular plane.
- Continuous sideways overlap forms a delocalized $\\\\pi$-bonding system (Valence Band / Highest Occupied Molecular Orbital, **HOMO**) and $\\\\pi^*$-antibonding system (Conduction Band / Lowest Unoccupied Molecular Orbital, **LUMO**).

### Redox Doping vs Classical Semiconductor Doping:
| Parameter | Silicon / Germanium Doping | Conducting Polymer Doping |
| :--- | :--- | :--- |
| **Dopant Concentration** | PPM levels ($10^{-4}\\%$) | Massive stoichiometric levels ($1 - 10\\text{ mol}\\%$) |
| **Mechanism** | Substitutional lattice atom | Redox reaction (electron transfer) |
| **Counterions** | None (covalent integration) | Interstitial ions ($I_3^-$, $ClO_4^-$, $Na^+$) present |
| **Carrier Physics** | Free electrons/holes in rigid band | Self-localized polarons and bipolarons with lattice distortion |

### Classification of Doping:
1. **p-Doping (Oxidative)**: Polymer treated with oxidizing agents (Halogens $I_2$, $Br_2$, Lewis acids $FeCl_3$).
   $$(CH)_n + \\frac{3x}{2} I_2 \\rightarrow [(CH)^{x+}]_n + x I_3^-$$
2. **n-Doping (Reductive)**: Polymer treated with reducing agents (Alkali metals $Na$, $K$, naphthalenide).
   $$(CH)_n + x Na \\rightarrow [(CH)^{x-}]_n + x Na^+$$`,
      reactionMechanismsOrStructures: `\`\`\`
  Pure Polyacetylene:    --CH = CH - CH = CH - CH = CH--  (Eg ≈ 1.5 eV)
                                 |  + I2 (Oxidation)
                                 v
  Polaron (+e, s=1/2):   --CH = CH - C•H - C(+)H - CH = CH--  [with I3- counterion]
                                 |  + Further oxidation
                                 v
  Bipolaron (+2e, s=0):  --CH - CH = CH - C(+)H - C(+)H = CH--  [Spinless Dication]
\`\`\``,
      applications: [
        'Transparent conductive electrodes: PEDOT:PSS for flexible OLEDs and organic photovoltaics.',
        'Antistatic cleanroom garments and electromagnetic interference (EMI) shielding for aircraft.',
        'Solid-state polymer electrolytic capacitors with ultra-low equivalent series resistance (ESR).',
        'Bio-compatible neural interfaces and glucose biosensors.'
      ],
      keyInsights: [
        'Conductivity spans 10^-10 S/cm (insulator) to >10^5 S/cm (metallic regime).',
        'Bulk conductivity is rate-limited by inter-chain hopping between polymer strands.'
      ]
    },
    gateHonors: {
      derivationTitle: 'Peierls Instability, Su-Schrieffer-Heeger (SSH) Model & Mott VRH Conduction',
      rigorousDerivation: `### 1. Peierls Instability & Bandgap Opening
Consider an idealized 1D carbon chain with uniform bond length $a$.
- In the non-dimerized state, each $sp^2$ carbon contributes one electron to the $\\pi$-band.
- The band is half-filled ($k_F = \\pi / 2a$).
- A metallic 1D chain is unstable against spontaneous lattice distortion (Peierls distortion) with period doubling to $2a$.
- The Brillouin zone edge contracts to $k = \\pm \\pi / 2a = k_F$.
- A forbidden energy gap opens at the Fermi level, lowering electronic energy:
  $$\\Delta E_{\\text{elec}} \\propto -u^2 \\ln(u)$$
  which strictly overcomes the elastic lattice strain energy penalty:
  $$\\Delta E_{\\text{lattice}} \\propto +K u^2$$
  where $u$ is the dimerization displacement ($r_{\\text{single}} - r_{\\text{double}}$).
Thus, polyacetylene spontaneously dimerizes into a semiconductor ($E_g \\approx 1.5\\text{ eV}$).

### 2. Charge Carriers: Polarons vs Bipolarons
- **Polaron (Radical Ion)**: Charge $q = \\pm e$, spin $s = 1/2$. Introduces two mid-gap localized states symmetrically placed at $\\pm \\omega_0$ from the band edges ($\\\\approx 0.3\\text{ eV}$).
- **Bipolaron (Dianion/Dication)**: When a second carrier is added, pairing into a shared lattice distortion is energetically favored because:
  $$U_{\\text{Coulomb}} < 2 E_{\\text{lattice relaxation}}$$
  The resulting quasi-particle has charge $q = \\pm 2e$ and **spin $s = 0$ (spinless)**.
  Magnetic susceptibility (ESR signal) drops to zero upon heavy bipolaron doping!

### 3. Mott's Variable Range Hopping (VRH) Equation
Bulk macroscopic transport across disordered polymer networks is dominated by phonon-assisted inter-chain hopping:
$$\\sigma(T) = \\sigma_0 \\exp\\left[ -\\left( \\frac{T_0}{T} \\right)^{\\frac{1}{d+1}} \\right]$$
For three-dimensional hopping ($d = 3$):
$$\\sigma(T) = \\sigma_0 \\exp\\left[ -\\left( \\frac{T_0}{T} \\right)^{1/4} \\right]$$
Where $T_0 = \\frac{18 \\alpha^3}{k_B N(E_F)}$ depends on localization length $\\alpha^{-1}$ and density of states at the Fermi level $N(E_F)$.`,
      keyFormulas: [
        {
          name: 'Mott Variable Range Hopping (3D)',
          formula: '\\sigma(T) = \\sigma_0 \\exp[-(T_0 / T)^{1/4}]',
          parameterDefinitions: '\\sigma = Conductivity, \\sigma_0 = Pre-exponential factor, T_0 = Mott characteristic temperature, T = Absolute temperature',
          units: 'S/cm or S/m',
          validityConditions: 'Valid at low to moderate temperatures in disordered 3D conducting polymer films.'
        },
        {
          name: 'Electrical Conductivity',
          formula: '\\sigma = e (n \\mu_e + p \\mu_h)',
          parameterDefinitions: 'e = Elementary charge (1.602x10^-19 C), n,p = Carrier densities, \\mu = Carrier mobilities',
          units: 'S/cm'
        }
      ],
      examTraps: [
        'Advanced Exam Trap: Bipolarons are SPINLESS (s = 0) even though they have a net charge of ±2e! In ESR experiments, the paramagnetic signal initially rises as polarons form, but DISAPPEARS at higher dopant concentrations as polarons pair into bipolarons.',
        'Conceptual Trap: Doping conducting polymers does NOT shift a rigid Fermi level inside static parabolic bands; instead, it creates dynamically induced mid-gap electronic states accompanied by local geometric bond relaxation.',
        'Unit Warning: Conductivity in materials science is standardly reported in S/cm (1 S/cm = 100 S/m).'
      ],
      solvedNumericals: [
        {
          id: 'num-cp-1',
          gateYearOrExam: 'Advanced Physics & Materials Science',
          difficulty: 'Advanced Academic',
          problemStatement: 'A thin film of doped polyaniline follows Mott 3D Variable Range Hopping conductivity: σ(T) = σ_0 * exp[-(T_0 / T)^(1/4)]. At T_1 = 300 K, the conductivity is σ_1 = 120 S/cm. Given T_0 = 8.1 x 10^5 K, determine the conductivity of the polymer at T_2 = 150 K.',
          givenValues: {
            'T_1': '300 K',
            '\\sigma_1': '120 S/cm',
            'T_2': '150 K',
            'T_0': '8.1 x 10^5 K'
          },
          formulaUsed: '\\sigma_2 / \\sigma_1 = \\exp[ (T_0 / T_1)^{1/4} - (T_0 / T_2)^{1/4} ]',
          stepByStepSolution: [
            'Step 1: Compute (T_0 / T_1)^(1/4): (8.1 x 10^5 / 300)^(1/4) = (2700)^(0.25) ≈ 7.211.',
            'Step 2: Compute (T_0 / T_2)^(1/4): (8.1 x 10^5 / 150)^(1/4) = (5400)^(0.25) ≈ 8.577.',
            'Step 3: Difference in exponent = 7.211 - 8.577 = -1.366.',
            'Step 4: Compute ratio σ_2 / σ_1 = exp(-1.366) ≈ 0.2551.',
            'Step 5: Multiply by σ_1: σ_2 = 120 S/cm * 0.2551 = 30.61 S/cm.'
          ],
          answerWithUnits: 'σ(150 K) = 30.6 S/cm.'
        }
      ],
      vivaQuestions: [
        {
          question: 'What is the physical significance of the Peierls theorem in one-dimensional metals?',
          modelAnswer: 'Peierls proved that any one-dimensional metallic chain with a partially filled energy band is unstable at T = 0 K against a periodic lattice distortion with wavevector q = 2k_F. The distortion opens an energy gap right at the Fermi surface, lowering the electronic energy of occupied states and converting the 1D metal into a semiconductor.'
        }
      ]
    }
  },

  // ==========================================
  // UNIT 04: NANOMATERIALS
  // ==========================================
  'energy-band-gap': {
    topicId: 'energy-band-gap',
    foundational: {
      coreAnalogy: 'The "Guitar String & Personal Bubble" Analogy',
      intuitiveExplanation: `Why do tiny nanoparticles of the same material glow bright blue, while bigger ones glow red?
- Think of an electron like a musical wave on a guitar string. When the string is long (bulk solid), it can vibrate with low frequencies (low energy, infrared/red light).
- Now imagine pinching the guitar string down to just a couple of nanometers. The wavelength is forced to be tiny, which drives its vibrational energy sky-high!
- In physics, an electron in a semiconductor has a natural comfort zone called the **Exciton Bohr Radius** ($a_B$, usually 2 to 10 nm).
- When you crush a crystal smaller than $a_B$, you squeeze the electron into an ultra-tight box. Heisenberg's uncertainty principle forces its kinetic energy to skyrocket.
- The bandgap opens wider. When the electron falls across this wider gap, it emits high-energy blue/green photons instead of red!`,
      keyTakeaways: [
        'Quantum confinement occurs when particle size is comparable to or smaller than the exciton Bohr radius (R < a_B).',
        'Shrinking crystal dimensions widens the effective optical bandgap (Blue Shift).',
        'Continuous electronic energy bands collapse into discrete, atom-like energy levels (quantum dots as "artificial atoms").',
        'Confinement energy scales inversely with the square of radius (1/R²).'
      ],
      quickCheckQuestion: 'In semiconductor quantum dots, does smaller particle size result in longer or shorter wavelength emission?',
      quickCheckAnswer: 'Shorter wavelength (higher photon energy, blue shift) because quantum confinement widens the energy bandgap as radius decreases.'
    },
    undergraduate: {
      formalNotes: `### Quantum Confinement Regimes
When the physical dimension of a semiconductor crystal approaches the nanoscale, the spatial extent of the exciton (bound electron-hole pair) is constrained:
- **Exciton Bohr Radius ($a_B$)**:
  $$a_B = \\frac{\\epsilon_r \\hbar^2}{\\mu e^2} = \\epsilon_r \\left( \\frac{m_0}{\\mu} \\right) a_0$$
  where $\\mu = \\frac{m_e^* m_h^*}{m_e^* + m_h^*}$ is the reduced effective mass, $\\epsilon_r$ is the relative dielectric constant, and $a_0 = 0.529\\text{ \\AA}$ is the hydrogen Bohr radius.

### Three Confinement Regimes:
1. **Weak Confinement ($R \\gg a_B$)**: Particle size is much larger than exciton size. Bulk properties dominate, exciton moves as a whole.
2. **Intermediate Confinement ($a_h < R < a_e$)**: Occurs when electron effective mass is much lighter than hole ($m_e^* \\ll m_h^*$).
3. **Strong Confinement ($R < a_B$)**: Both electron and hole are individually confined. Coulombic interaction is small compared to kinetic confinement energies.

### Density of States ($g(E)$) Across Dimensions:
- **3D Bulk**: Continuous parabolic: $g(E) \\propto \\sqrt{E}$
- **2D Quantum Well (Thin film)**: Staircase steps: $g(E) \\propto \\sum \\Theta(E - E_n)$
- **1D Quantum Wire**: Inverse square-root singularities: $g(E) \\propto \\sum (E - E_n)^{-1/2}$
- **0D Quantum Dot**: Discrete delta functions: $g(E) \\propto \\sum \\delta(E - E_n)$`,
      reactionMechanismsOrStructures: `\`\`\`
  Density of States Evolution:
  3D (Bulk)         2D (Well)          1D (Wire)          0D (Dot)
     g(E)              g(E)               g(E)               g(E)
      |  /~~            |  _----           |  |\\  |\\          |  |  |  |
      | /               | _|               |  | \\ | \\         |  |  |  |
      |/_____ E         |/_____ E          |/_|_\\|_\\__ E      |__|__|__|__ E
    Continuous        Staircase          Van Hove Spikes     Delta Peaks
\`\`\``,
      applications: [
        'QLED displays (Samsung QLED, Sony Triluminos) for hyper-pure RGB color gamuts and high efficiency.',
        'Biomedical fluorescence tagging and in-vivo tumor tracking without photobleaching.',
        'Quantum dot tandem solar cells overcoming the single-junction Shockley-Queisser limit (up to 40%+).',
        'Single-photon emitters for secure quantum key distribution (QKD).'
      ],
      keyInsights: [
        'Nanocrystal bandgap is tunable solely by controlling synthesis reaction time and growth temperature.',
        'High surface-to-volume ratio creates surface trap states that must be passivated by core-shell structures (e.g., CdSe/ZnS).'
      ]
    },
    gateHonors: {
      derivationTitle: 'Brus Equation Derivation (Effective Mass Approximation in Spherical Quantum Wells)',
      rigorousDerivation: `### 1. Quantum Hamiltonian of Confined Exciton
In a spherical quantum dot of radius $R$ surrounded by an infinite potential barrier ($V(r) = \\infty$ for $r > R$):
$$\\hat{H} = -\\frac{\\hbar^2}{2 m_e^*} \\nabla_e^2 - \\frac{\\hbar^2}{2 m_h^*} \\nabla_h^2 - \\frac{e^2}{4\\pi \\epsilon_0 \\epsilon_r |r_e - r_h|} + V(r_e) + V(r_h)$$

Solving the non-interacting particle-in-a-sphere Schrödinger equation for the lowest eigenstates ($l = 0, n = 1$):
$$\\psi_{100}(r) = \\frac{1}{\\sqrt{2\\pi R}} \\frac{\\sin(\\pi r / R)}{r}$$
The kinetic zero-point confinement energies of the electron and hole are:
$$E_{\\text{kin, e}} = \\frac{\\hbar^2 \\pi^2}{2 m_e^* R^2}, \\quad E_{\\text{kin, h}} = \\frac{\\hbar^2 \\pi^2}{2 m_h^* R^2}$$

### 2. First-Order Coulomb Perturbation
Treating the Coulomb attraction between the confined electron and hole as a perturbation:
$$\\Delta E_{\\text{Coulomb}} = \\langle \\psi | -\\frac{e^2}{4\\pi \\epsilon_0 \\epsilon_r |r_e - r_h|} | \\psi \\rangle = -\\frac{1.786 e^2}{4\\pi \\epsilon_0 \\epsilon_r R}$$

### 3. The Complete Brus Equation
Summing the bulk bandgap, kinetic confinement, and Coulombic interaction yields the **Brus Equation**:
$$E_g(R) = E_g^{\\text{bulk}} + \\frac{\\hbar^2 \\pi^2}{2 R^2} \\left( \\frac{1}{m_e^*} + \\frac{1}{m_h^*} \\right) - \\frac{1.8 e^2}{4\\pi \\epsilon_0 \\epsilon_r R}$$

### Scaling Analysis:
- Kinetic Confinement Term: scales as $\\mathbf{1 / R^2}$
- Coulomb Attraction Term: scales as $\\mathbf{1 / R}$
As $R \\rightarrow 0$, the positive **$1/R^2$ term strictly dominates**, causing a monotonic increase in bandgap $E_g(R)$ as size decreases (Blue Shift).`,
      keyFormulas: [
        {
          name: 'Brus Equation (Effective Mass Approximation)',
          formula: 'E_g(R) = E_g^{bulk} + \\frac{\\hbar^2 \\pi^2}{2 R^2} \\left(\\frac{1}{m_e^*} + \\frac{1}{m_h^*}\\right) - \\frac{1.8 e^2}{4\\pi \\epsilon_0 \\epsilon_r R}',
          parameterDefinitions: 'R = Quantum dot radius, m_e^*, m_h^* = Effective masses, \\epsilon_r = Relative dielectric constant',
          units: 'Joules (J) or Electron-volts (eV)',
          validityConditions: 'Valid for spherical dots in strong confinement regime (R < a_B).'
        },
        {
          name: 'Exciton Bohr Radius',
          formula: 'a_B = \\frac{\\epsilon_r \\hbar^2}{\\mu e^2} = \\epsilon_r \\left(\\frac{m_0}{\\mu}\\right) a_0',
          parameterDefinitions: '\\mu = Reduced exciton mass = (m_e* * m_h*) / (m_e* + m_h*), a_0 = 0.529 Å',
          units: 'Meters (m) or Angstroms (Å)'
        },
        {
          name: 'Photon Energy & Wavelength Relation',
          formula: 'E = h\\nu = \\frac{hc}{\\lambda} = \\frac{1240}{\\lambda(\\text{nm})}\\text{ eV}',
          parameterDefinitions: 'h = Planck constant, c = Speed of light, \\lambda = Wavelength in nm',
          units: 'eV'
        }
      ],
      examTraps: [
        'Scaling Trap: The confinement energy scales as 1/R², NOT 1/R! If the radius of a quantum dot is HALVED, the kinetic confinement energy increases by a factor of FOUR (2² = 4).',
        'Unit Trap: When calculating in the Brus equation, remember that hbar = h / (2π). If you use h instead of hbar, you will be off by a factor of 4π² ≈ 39.5!',
        'Sign Trap: The Coulomb term is NEGATIVE (reduces the bandgap widening slightly), but at very small radii the positive 1/R² term dominates overwhelmingly.'
      ],
      solvedNumericals: [
        {
          id: 'num-nano-1',
          gateYearOrExam: 'Advanced Physics & Nanotechnology',
          difficulty: 'Advanced Academic',
          problemStatement: 'Calculate the optical bandgap of a spherical CdSe quantum dot of radius R = 2.0 nm. Bulk CdSe has E_g(bulk) = 1.74 eV, electron effective mass m_e* = 0.13 m_0, hole effective mass m_h* = 0.45 m_0, and relative permittivity ε_r = 9.3. (Neglect the small Coulomb term for this estimation). [m_0 = 9.109 x 10^-31 kg, hbar = 1.055 x 10^-34 J s, 1 eV = 1.602 x 10^-19 J].',
          givenValues: {
            'R': '2.0 x 10^-9 m',
            'E_g^{bulk}': '1.74 eV',
            'm_e^*': '0.13 * 9.109 x 10^-31 kg = 1.184 x 10^-31 kg',
            'm_h^*': '0.45 * 9.109 x 10^-31 kg = 4.099 x 10^-31 kg'
          },
          formulaUsed: 'ΔE_kin = [hbar^2 * π^2 / (2 * R^2)] * (1/m_e* + 1/m_h*)',
          stepByStepSolution: [
            'Step 1: Calculate (1/m_e* + 1/m_h*): 1/(1.184 x 10^-31) + 1/(4.099 x 10^-31) = 8.446 x 10^30 + 2.440 x 10^30 = 1.089 x 10^31 kg^-1.',
            'Step 2: Calculate hbar^2 * π^2 = (1.055 x 10^-34)^2 * π^2 = (1.113 x 10^-68) * 9.870 = 1.098 x 10^-67 J^2 s^2.',
            'Step 3: Calculate 2 * R^2 = 2 * (2.0 x 10^-9)^2 = 8.0 x 10^-18 m^2.',
            'Step 4: Compute kinetic energy in Joules: [1.098 x 10^-67 / (8.0 x 10^-18)] * (1.089 x 10^31) = 1.373 x 10^-50 * 1.089 x 10^31 = 1.495 x 10^-19 J.',
            'Step 5: Convert to eV: 1.495 x 10^-19 J / (1.602 x 10^-19 J/eV) = 0.933 eV.',
            'Step 6: Compute total bandgap: E_g(R) = E_g^{bulk} + ΔE = 1.74 eV + 0.933 eV = 2.673 eV.'
          ],
          answerWithUnits: 'E_g(2.0 nm) = 2.67 eV (Corresponding to blue-green emission at λ ≈ 464 nm, shifted dramatically from bulk infrared/red 1.74 eV).'
        }
      ],
      vivaQuestions: [
        {
          question: 'What is the physical cause of Surface Plasmon Resonance (SPR) in noble metal nanoparticles (Au, Ag)?',
          modelAnswer: 'In metallic nanoparticles smaller than the light wavelength, the incident oscillating electromagnetic field drives collective, coherent oscillations of free conduction electrons against the restoring electrostatic force of the positive ionic core. At the resonance frequency (Fröhlich condition: ε_metal = -2 ε_dielectric), absorption and scattering cross-sections surge, giving colloidal gold its intense ruby-red color.'
        }
      ]
    }
  },

  // ==========================================
  // UNIT 05: SYNTHESIS OF NANOMATERIALS
  // ==========================================
  'nanomaterial-synthesis-overview': {
    topicId: 'nanomaterial-synthesis-overview',
    foundational: {
      coreAnalogy: 'The "Sculpting Marble Statue vs Building LEGO Brick-by-Brick" Analogy',
      intuitiveExplanation: `How do scientists make materials that are ten thousand times thinner than a human hair? There are two opposing strategies:
1. **Top-Down (The Sculptor)**:
   - Start with a huge block of marble and use a hammer, chisel, or sandpaper to chip it down.
   - In nano-manufacturing, this is **Ball Milling** (smashing powder with steel balls) or **Lithography** (etching away silicon with acid and lasers).
   - *Advantage*: Makes huge industrial quantities.
   - *Drawback*: Leaves rough edges, scratches, micro-cracks, and uneven particle sizes.
2. **Bottom-Up (The LEGO Builder)**:
   - Start with individual atoms, ions, or molecules and coax them into snapping together into perfect crystals.
   - In chemistry, this is the **Sol-Gel** process or **Hydrothermal synthesis**.
   - *Advantage*: Near-perfect crystals with uniform size and atomic precision.
   - *Drawback*: Requires careful chemical control and lower yield per batch.`,
      keyTakeaways: [
        'Top-Down methods break bulk macroscopic matter down through physical/mechanical attrition or etching.',
        'Bottom-Up methods assemble atoms and molecules via chemical nucleation, self-assembly, and precipitation.',
        'Monodisperse nanoparticles require separating the nucleation burst from the subsequent growth phase (LaMer model).',
        'Sol-gel and hydrothermal methods allow mild, low-temperature synthesis of high-purity oxide ceramics.'
      ],
      quickCheckQuestion: 'Which approach (Top-Down or Bottom-Up) produces nanoparticles with higher crystal quality and narrower size distribution?',
      quickCheckAnswer: 'The Bottom-Up approach, because it controls atomic nucleation and growth thermodynamically, avoiding the mechanical strains and defect generation inherent to Top-Down milling.'
    },
    undergraduate: {
      formalNotes: `### Comparison of Synthesis Methodologies
| Feature | Top-Down Approach | Bottom-Up Approach |
| :--- | :--- | :--- |
| **Starting Material** | Bulk macroscale solids | Atomic, molecular, or ionic precursors |
| **Key Methods** | High-energy ball milling, lithography, sputtering, laser ablation | Sol-gel, hydrothermal, CVD, coprecipitation, organometallic routes |
| **Particle Morphology** | Irregular, wide size distribution | Uniform, narrow (monodisperse) distribution |
| **Structural Defects** | High density of dislocations and internal strain | Low defect density, high crystal perfection |
| **Purity** | Often contaminated by milling vials/balls | High chemical purity with surface ligand passivation |
| **Scalability** | High tonnage industrial output | Laboratory to pilot scale; batch chemical control |

### The Sol-Gel Process for Nanoscale Oxides
Sol-gel processing is a wet-chemical bottom-up route converting a liquid solution ("sol") into an integrated network ("gel"):
1. **Hydrolysis**: Metal alkoxides react with water in alcohol:
   $$M(OR)_z + H_2O \\rightarrow M(OR)_{z-1}(OH) + ROH$$
2. **Condensation (Oxolation & Alcoxolation)**:
   - Water condensation: $M-OH + HO-M \\rightarrow M-O-M + H_2O$
   - Alcohol condensation: $M-OR + HO-M \\rightarrow M-O-M + ROH$
3. **Gelation**: Continuous $-M-O-M-$ polymeric chains crosslink into a rigid wet gel.
4. **Drying**:
   - **Xerogel**: Ambient air drying causes capillary contraction, shrinking the pore network.
   - **Aerogel**: Supercritical extraction ($CO_2$ at $T > 31^\\circ\\text{C}, P > 7.38\\text{ MPa}$) eliminates capillary meniscus forces, yielding $>95\\%$ ultra-porous solid.`,
      reactionMechanismsOrStructures: `\`\`\`
  Sol-Gel Processing Pathways:
  Precursors (Metal Alkoxides) + H2O 
              |
              v (Hydrolysis & Condensation)
         [ Sol: Colloidal Suspension ]
              |
              v (Crosslinking / Gelation)
         [ Gel: 3D Interconnected Network ]
              |
      ---------------------------------
      |                               |
  (Ambient Evaporation)     (Supercritical Drying)
      v                               v
  [ Xerogel (Dense Ceramic) ]    [ Aerogel (95% Porous) ]
      |
  (Calcination at 600-1000°C)
      v
  [ Nanocrystalline ABO3 Perovskite Powder ]
\`\`\``,
      applications: [
        'Synthesis of ultra-fine BaTiO3 and CaTiO3 powders for multilayer ceramic capacitors.',
        'Antireflective coatings and self-cleaning TiO2 thin films on architectural glass.',
        'Thermal insulation aerogel blankets for spacecraft and cryogenic storage.',
        'Catalyst supports with high specific surface area (> 200 m²/g).'
      ],
      keyInsights: [
        'Controlling pH and water-to-precursor ratio dictates whether the sol yields linear chains or particulate clusters.',
        'Hydrothermal synthesis leverages high autogenous steam pressure (10-100 atm) inside autoclaves to crystallize phases below their normal calcination temperatures.'
      ]
    },
    gateHonors: {
      derivationTitle: 'LaMer Burst Nucleation Model & Critical Nucleation Radius (r*) Derivation',
      rigorousDerivation: `### 1. Thermodynamic Free Energy of Nucleation
Forming a spherical nucleus of radius $r$ from a supersaturated precursor solution:
$$\\Delta G(r) = \\Delta G_{\\text{volume}} + \\Delta G_{\\text{surface}} = -\\frac{4}{3}\\pi r^3 \\frac{\\Delta \\mu}{V_m} + 4\\pi r^2 \\gamma$$
Where:
- $\\Delta \\mu = k_B T \\ln(S)$ is the chemical potential driving force,
- $S = C / C_s$ is the **supersaturation ratio** ($C$ = monomer concentration, $C_s$ = equilibrium solubility),
- $V_m$ is the molar volume of the solid phase,
- $\\gamma$ is the solid-liquid interfacial surface free energy ($J/m^2$).

### 2. Critical Radius ($r^*$) and Activation Energy Barrier ($\\Delta G^*$)
Maximizing $\\Delta G(r)$ with respect to $r$:
$$\\frac{\\partial \\Delta G}{\\partial r} = -4\\pi r^2 \\frac{k_B T \\ln(S)}{V_m} + 8\\pi r \\gamma = 0$$

Solving for the **Critical Nucleus Radius ($r^*$)**:
$$r^* = \\frac{2 \\gamma V_m}{k_B T \\ln(S)}$$

Substituting $r^*$ back into $\\Delta G(r)$ gives the **Nucleation Energy Barrier ($\\Delta G^*$)**:
$$\\Delta G^* = \\frac{16\\pi \\gamma^3 V_m^2}{3 (k_B T \\ln S)^2}$$

### 3. The LaMer Nucleation & Growth Dynamics
- **Phase I**: Precursor concentration accumulates steadily until reaching critical supersaturation $C_{\\text{min}}^*$.
- **Phase II (Burst Nucleation)**: Once $C > C_{\\text{min}}^*$, rapid homogeneous nucleation erupts across milliseconds. Precursor is rapidly consumed, dropping $C$ back below $C_{\\text{min}}^*$.
- **Phase III (Diffusion-Controlled Growth)**: Nucleation completely shuts down. Monomers diffuse onto existing nuclei without forming new ones, guaranteeing **monodisperse particle size distribution**!`,
      keyFormulas: [
        {
          name: 'Critical Nucleus Radius (Gibbs-Thomson)',
          formula: 'r^* = \\frac{2 \\gamma V_m}{k_B T \\ln(S)}',
          parameterDefinitions: '\\gamma = Interfacial surface energy (J/m²), V_m = Molar volume (m³/mol), S = C / C_s (Supersaturation)',
          units: 'Meters (m) or Nanometers (nm)',
          validityConditions: 'Valid for homogeneous spherical nucleation in liquid solutions.'
        },
        {
          name: 'Nucleation Activation Barrier',
          formula: '\\Delta G^* = \\frac{16 \\pi \\gamma^3 V_m^2}{3 (k_B T \\ln S)^2}',
          parameterDefinitions: 'k_B = Boltzmann constant (1.381x10^-23 J/K), T = Temperature in Kelvin',
          units: 'Joules (J)'
        },
        {
          name: 'Lifshitz-Slyozov-Wagner (LSW) Ostwald Ripening',
          formula: '\\bar{r}(t)^3 - \\bar{r}_0^3 = K t',
          parameterDefinitions: 'r(t) = Average particle radius at time t, K = Ripening rate constant',
          units: 'm³'
        }
      ],
      examTraps: [
        'Monodispersity Trap: To synthesize monodisperse nanoparticles, nucleation and growth MUST be temporally separated! If new nuclei continue to form while older ones are growing, polydisperse mixtures inevitably result.',
        'Supersaturation Inversion: As supersaturation S increases, the critical radius r* DECREASES and the energy barrier ΔG* drops quadratically (1 / (ln S)²). High supersaturation favors numerous tiny particles.',
        'Xerogel vs Aerogel Definition: A xerogel is dried by normal evaporation where capillary tension collapses the pore structure. An aerogel is dried supercritically without a liquid-vapor meniscus, preserving an uncollapsed network.'
      ],
      solvedNumericals: [
        {
          id: 'num-synth-1',
          gateYearOrExam: 'Advanced Chemical Engineering & Metallurgy',
          difficulty: 'Advanced Academic',
          problemStatement: 'In the bottom-up synthesis of gold nanoparticles at T = 300 K, the interfacial surface energy is γ = 1.2 J/m², and the molar volume of gold is V_m = 1.02 x 10^-5 m³/mol. If the solution supersaturation ratio is S = 8.0, calculate: (a) the critical nucleus radius (r*), and (b) whether a cluster with r = 1.5 nm will dissolve or grow.',
          givenValues: {
            'γ': '1.2 J/m²',
            'V_m': '1.02 x 10^-5 m³/mol',
            'S': '8.0',
            'T': '300 K',
            'R_gas (N_A * k_B)': '8.314 J/(mol K)'
          },
          formulaUsed: 'r* = [2 * γ * V_m] / [R_gas * T * ln(S)]',
          stepByStepSolution: [
            'Step 1: Compute ln(S) = ln(8.0) ≈ 2.0794.',
            'Step 2: Compute denominator: R_gas * T * ln(S) = 8.314 * 300 * 2.0794 = 5186.5 J/mol.',
            'Step 3: Compute numerator: 2 * γ * V_m = 2 * 1.2 * (1.02 x 10^-5) = 2.448 x 10^-5 J m/mol.',
            'Step 4: Divide numerator by denominator: r* = (2.448 x 10^-5) / 5186.5 = 4.72 x 10^-9 m = 4.72 nm.',
            'Step 5: Compare given radius (r = 1.5 nm) with r* (4.72 nm): Since r = 1.5 nm < r*, the cluster lies in the sub-critical regime where ∂ΔG/∂r > 0.'
          ],
          answerWithUnits: '(a) r* = 4.72 nm; (b) The 1.5 nm cluster will spontaneously dissolve back into monomer solution to lower free energy.'
        }
      ],
      vivaQuestions: [
        {
          question: 'What is Ostwald ripening and how does capping ligand chemistry arrest it?',
          modelAnswer: 'Ostwald ripening is a thermodynamically driven phenomenon where smaller nanoparticles dissolve and deposit onto larger particles because smaller particles have higher chemical potential and surface curvature (Gibbs-Thomson effect). Introducing bulky organic capping ligands (e.g., thiols, oleic acid) sterically binds to high-energy surface facets, lowering interfacial energy γ and blocking monomer redeposition.'
        }
      ]
    }
  },

  // ==========================================
  // UNIT 06: OLEDS
  // ==========================================
  'oled-working-principle': {
    topicId: 'oled-working-principle',
    foundational: {
      coreAnalogy: 'The "Matchmaker Ballroom & Dancing Excitons" Analogy',
      intuitiveExplanation: `Why can't an OLED just be a single layer of glowing plastic between two metal wires?
Imagine an exclusive ballroom where positive dancers (holes) enter through the West door and negative dancers (electrons) enter through the East door:
1. **The West Door (Anode - ITO)**: Made of transparent Indium Tin Oxide glass so audiences outside can see the light. It lets positive holes in easily.
2. **The Red Carpet (HTL)**: A slick escalator that moves holes forward fast, but acts as a brick wall stopping electrons from escaping to the glass.
3. **The Central Ballroom (Emissive Layer - EML)**:
   - Dancers meet in the middle! An electron and a hole grab hands to form a dancing pair called an **Exciton**.
   - When the pair finishes their dance and settles down to the floor, they release a flash of pure colored light (a photon).
4. **The Blue Carpet (ETL)**: An escalator moving electrons forward while blocking positive holes.
5. **The East Door (Cathode - Aluminum)**: A shiny metal mirror that injects electrons and reflects all photons forward through the front glass.
Without this sandwich, electrons and holes would shoot straight through each other and crash into the opposite metal contact without ever meeting to create light!`,
      keyTakeaways: [
        'An OLED converts electrical current into light via electroluminescence in organic thin films.',
        'Holes are injected from a transparent high-work-function ITO anode; electrons are injected from a low-work-function metal cathode.',
        'Electrons and holes recombine in the emissive layer (EML) to form bound excitons.',
        'Quantum spin statistics dictate a 1:3 ratio between Singlet (25%) and Triplet (75%) excitons.'
      ],
      quickCheckQuestion: 'In traditional fluorescent OLEDs, why is the internal quantum efficiency (IQE) strictly capped at 25%?',
      quickCheckAnswer: 'Because electron and hole spins combine randomly to produce 25% singlets and 75% triplets. In fluorescent dyes, radiative decay from triplet states is spin-forbidden (ΔS ≠ 0), so 75% of excitons are lost as heat.'
    },
    undergraduate: {
      formalNotes: `### 5-Layer OLED Architecture & Energy Band Alignment
An efficient small-molecule or polymer OLED device incorporates:
1. **Substrate**: Ultra-flat soda-lime glass or flexible polyimide.
2. **Anode (Hole Injector)**: Indium Tin Oxide ($ITO$), transparent conductor ($T > 85\\%$), high work function ($\\Phi_{\\text{ITO}} \\approx 4.8 - 5.0\\text{ eV}$).
3. **Hole Transport Layer (HTL)**: Facilitates hole transit, aligns HOMO with ITO (e.g., TPD, NPB, or PEDOT:PSS).
4. **Emissive Layer (EML)**: Contains host and fluorescent or phosphorescent dopant molecules where exciton formation occurs.
5. **Electron Transport Layer (ETL)**: Transports electrons and blocks holes (e.g., $Alq_3$, BAlq).
6. **Cathode (Electron Injector)**: Low work function metal (e.g., $Al$, $Ca$, $Mg:Ag$, $\\Phi \\approx 4.0 - 4.3\\text{ eV}$), with an ultra-thin $LiF$ buffer layer ($1\\text{ nm}$) to lower injection barrier via dipole formation.

### 4 Operational Steps in OLED Electroluminescence:
1. **Charge Injection**: External forward DC voltage ($3-8\\text{ V}$) overcomes barriers at electrode-organic interfaces.
2. **Charge Transport**: Holes drift through HTL HOMO levels, electrons hop across ETL LUMO levels under applied electric fields ($E \\approx 10^5 - 10^6\\text{ V/cm}$).
3. **Exciton Formation**: Opposite charges attract Coulombically in the EML, forming Frenkel excitons (binding energy $0.2 - 0.5\\text{ eV}$).
4. **Radiative Decay**: Excitons relax to ground state ($S_0$), emitting photons with energy matching the HOMO-LUMO bandgap ($h\\nu \\approx E_g$).`,
      reactionMechanismsOrStructures: `\`\`\`
  Energy Level Diagram (eV relative to vacuum = 0):
      Vacuum Level (0 eV)
  -------------------------------------------------------------
        ITO          HTL (NPB)         EML (Alq3)       ETL        Cathode (Al)
      (Φ = 4.8)    LUMO: -2.4 eV     LUMO: -3.0 eV   LUMO: -3.0   (Φ = 4.3 eV)
                     ---------         ---------       ---------
                         |                 |               ^
                         |           (Recombination)       | [Electron Injection]
                         v                 v               |
                     ---------         ---------       ---------
                   HOMO: -5.4 eV     HOMO: -5.7 eV   HOMO: -5.8
      [Hole Injection] ->
\`\`\``,
      applications: [
        'Smartphone and smartwatch displays (Samsung AMOLED, Apple Retina OLED) with infinite contrast ratio.',
        'High-end OLED televisions featuring true-black pixel shut-off and ultra-wide viewing angles (> 170°).',
        'Foldable smartphones and rollable TV screens utilizing thin flexible substrates.',
        'Automotive digital instrument clusters and diffuse non-glare surface interior lighting.'
      ],
      keyInsights: [
        'Because OLEDs are self-emissive, black pixels draw zero electrical power and emit zero nits.',
        'Oxygen and moisture cause cathode delamination and dark spot growth, requiring hermetic barrier encapsulation.'
      ]
    },
    gateHonors: {
      derivationTitle: 'Exciton Quantum Spin Statistics & External Quantum Efficiency (EQE) Formulation',
      rigorousDerivation: `### 1. Quantum Spin Statistics: 25% Singlet vs 75% Triplet Limit
Electrons and holes are fermions with spin angular momentum $s = 1/2$.
When an uncorrelated electron ($s_1 = 1/2$) and hole ($s_2 = 1/2$) form an exciton, the coupled states span a $2 \\times 2 = 4$-dimensional Hilbert space:

- **1 Singlet State ($S = 0, M_S = 0$, Anti-symmetric spin)**:
  $$\\frac{1}{\\sqrt{2}} (|\\uparrow\\downarrow\\rangle - |\\downarrow\\uparrow\\rangle) \\quad \\implies \\mathbf{25\\% \\text{ Probability}}$$
- **3 Triplet States ($S = 1, M_S = +1, 0, -1$, Symmetric spin)**:
  $$\\begin{cases} |\\uparrow\\uparrow\\rangle \\\\ \\frac{1}{\\sqrt{2}} (|\\uparrow\\downarrow\\rangle + |\\downarrow\\uparrow\\rangle) \\\\ |\\downarrow\\downarrow\\rangle \\end{cases} \\quad \\implies \\mathbf{75\\% \\text{ Probability}}$$

### Radiative Selection Rules:
In organic fluorescent molecules, the Hamiltonian commutes with the spin operator $[\\hat{H}, \\hat{S}^2] = 0$.
Radiative transitions to the singlet ground state ($S_0$) must conserve spin ($\\Delta S = 0$):
- $S_1 \\rightarrow S_0 + h\\nu$: Spin-allowed, fast radiative fluorescence ($\\tau \\approx 10^{-9}\\text{ s}$).
- $T_1 \\rightarrow S_0$: Spin-forbidden ($\\Delta S = 1$), non-radiative thermal dissipation.
Therefore, the **maximum theoretical Internal Quantum Efficiency (IQE) for fluorescent OLEDs is capped at 25%**!

### 2. Triplet Harvesting: Phosphorescence & TADF
1. **Phosphorescence (PHOLEDs)**:
   - Introducing heavy transition metals (e.g., $Ir(ppy)_3$, $PtOEP$, $Z_{\\text{Ir}} = 77$) induces massive relativistic **Spin-Orbit Coupling (SOC)**:
     $$\\hat{H}_{SO} \\propto Z^4 (\\vec{L} \\cdot \\vec{S})$$
   - SOC mixes singlet and triplet manifolds, making $T_1 \\rightarrow S_0$ strongly radiative.
   - **Internal Quantum Efficiency achieves theoretical 100%!**
2. **Thermally Activated Delayed Fluorescence (TADF)**:
   - Molecular engineering minimizes the singlet-triplet energy difference ($\\Delta E_{ST} < 0.1\\text{ eV}$).
   - Ambient thermal energy ($k_B T$) drives Reverse Intersystem Crossing (RISC: $T_1 \\rightarrow S_1$), harvesting all triplets radiatively without heavy noble metals.

### 3. External Quantum Efficiency ($\\eta_{\\text{EQE}}$) Equation
$$\\eta_{\\text{EQE}} = \\gamma \\times \\eta_{\\text{ST}} \\times q_{\\text{eff}} \\times \\eta_{\\text{out}}$$
Where:
- $\\gamma$: Charge balance factor (ratio of injected holes to electrons, $\\le 1$),
- $\\eta_{\\text{ST}}$: Fraction of excitons that can decay radiatively ($0.25$ for fluorescent; $1.0$ for phosphorescent/TADF),
- $q_{\\text{eff}}$: Intrinsic photoluminescence quantum yield of the emitter,
- $\\eta_{\\text{out}}$: Optical outcoupling efficiency through the glass substrate:
  $$\\eta_{\\text{out}} \\approx \\frac{1}{2 n^2} \\approx 20\\% \\text{ for glass } (n \\approx 1.5 - 1.8)$$`,
      keyFormulas: [
        {
          name: 'External Quantum Efficiency (EQE)',
          formula: '\\eta_{\\text{EQE}} = \\gamma \\cdot \\eta_{\\text{ST}} \\cdot q_{\\text{eff}} \\cdot \\eta_{\\text{out}}',
          parameterDefinitions: '\\gamma = Charge balance, \\eta_{ST} = Spin factor (0.25 vs 1.0), q_{eff} = PL quantum yield, \\eta_{out} = Outcoupling factor',
          units: 'Dimensionless (percentage 0 to 100%)'
        },
        {
          name: 'Classical Optical Outcoupling Factor',
          formula: '\\eta_{\\text{out}} \\approx \\frac{1}{2 n_{\\text{sub}}^2}',
          parameterDefinitions: 'n_{sub} = Refractive index of substrate (typically 1.5 - 1.8)',
          units: 'Dimensionless (~20% without micro-lenses)'
        },
        {
          name: 'Exciton Radiative Lifetime',
          formula: '\\tau_{\\text{rad}} = \\frac{1}{k_{\\text{rad}}}',
          parameterDefinitions: 'k_{rad} = Radiative transition rate constant',
          units: 'Seconds (ns for fluorescence, μs for phosphorescence)'
        }
      ],
      examTraps: [
        'Advanced Exam Trap: The 25% quantum efficiency limit applies ONLY to fluorescent OLEDs! Modern phosphorescent (PHOLED) and TADF emitters achieve 100% INTERNAL quantum efficiency.',
        'EQE vs IQE Confusion: Do NOT confuse Internal Quantum Efficiency (IQE = γ * η_ST * q_eff, up to 100%) with External Quantum Efficiency (EQE = IQE * η_out, which is limited to ~20-25% due to total internal reflection trapped in the glass substrate).',
        'Spin Orbit Scaling: Spin-orbit coupling Hamiltonian scales with atomic number as Z⁴! This explains why Iridium (Z = 77) or Platinum (Z = 78) are used, while lighter metals fail to mix spin states effectively.'
      ],
      solvedNumericals: [
        {
          id: 'num-oled-1',
          gateYearOrExam: 'Advanced Electronics & Materials Science',
          difficulty: 'Advanced Academic',
          problemStatement: 'A green phosphorescent OLED uses an Iridium complex emitter with photoluminescence quantum yield q_eff = 0.92. The device has balanced charge injection (γ = 0.98), and triplet harvesting yields η_ST = 1.00. If the substrate refractive index is n_sub = 1.52, calculate: (a) the outcoupling efficiency (η_out), (b) the Internal Quantum Efficiency (IQE), and (c) the overall External Quantum Efficiency (EQE).',
          givenValues: {
            'γ': '0.98',
            'η_{ST}': '1.00 (Phosphorescent)',
            'q_{eff}': '0.92',
            'n_{sub}': '1.52'
          },
          formulaUsed: 'η_{out} = 1 / (2 * n^2), IQE = γ * η_{ST} * q_{eff}, EQE = IQE * η_{out}',
          stepByStepSolution: [
            'Step 1: Calculate the optical outcoupling factor: η_{out} = 1 / (2 * 1.52^2) = 1 / (2 * 2.3104) = 1 / 4.6208 = 0.2164 (21.64%).',
            'Step 2: Calculate the Internal Quantum Efficiency (IQE): IQE = γ * η_{ST} * q_{eff} = 0.98 * 1.00 * 0.92 = 0.9016 (90.16%).',
            'Step 3: Calculate the overall External Quantum Efficiency (EQE): EQE = IQE * η_{out} = 0.9016 * 0.2164 = 0.1951 (19.51%).'
          ],
          answerWithUnits: '(a) η_{out} = 21.6%; (b) IQE = 90.2%; (c) EQE = 19.5%.'
        }
      ],
      vivaQuestions: [
        {
          question: 'What is the root cause of OLED screen burn-in (differential aging), especially in blue sub-pixels?',
          modelAnswer: 'Blue emission requires a wide HOMO-LUMO bandgap (~2.8 - 3.1 eV). The resulting high-energy blue excitons undergo exciton-polaron and exciton-exciton annihilation processes that release sufficient energy (> 3 eV) to break carbon-carbon and carbon-nitrogen covalent bonds in the emitter molecules, causing irreversible non-radiative trap center formation over time.'
        }
      ]
    }
  }
};

/**
 * Helper to fetch depth content for any topic, providing rich, generated
 * depth content if no explicit handcrafted override exists.
 */
export function getTopicDepthData(topic: TopicNode): TopicDepthData {
  if (CURRICULUM_DEPTH_REGISTRY[topic.id]) {
    return CURRICULUM_DEPTH_REGISTRY[topic.id];
  }

  // Generate high-grade structured depth data from existing topic content
  return generateDynamicDepthData(topic);
}

function generateDynamicDepthData(topic: TopicNode): TopicDepthData {
  const isOxide = topic.category.toLowerCase().includes('oxide') || topic.folderId.includes('oxides');
  const isPolymer = topic.category.toLowerCase().includes('polymer') || topic.folderId.includes('polymers');
  const isNano = topic.category.toLowerCase().includes('nano') || topic.folderId.includes('nanomaterials');
  const isOled = topic.category.toLowerCase().includes('oled') || topic.folderId.includes('oleds');

  let defaultDerivation = 'First-Principles Thermodynamic & Microstructural Formulation';
  let defaultFormula = 'E = h\\nu = \\frac{hc}{\\lambda}';
  let defaultFormulaName = 'Fundamental Energy Relation';
  let defaultTrap = 'Exam Trap: Pay close attention to unit conversions between eV, Joules, and Angstroms (1 eV = 1.602 x 10^-19 J, 1 Å = 10^-10 m).';
  let defaultViva = 'Be prepared to defend the chemical and physical mechanism behind this phenomenon from first principles.';

  if (isOxide) {
    defaultDerivation = 'Electrostatic Madelung Potential & Crystal Field Splitting in Metal Oxides';
    defaultFormula = 't = \\frac{r_A + r_O}{\\sqrt{2}(r_B + r_O)}';
    defaultFormulaName = 'Crystallographic Geometric Tolerance Factor';
    defaultTrap = 'Advanced Exam Trap: Verify whether the coordination number (CN) is 12 (A-site), 6 (B-site octahedral), or 4 (tetrahedral) before looking up ionic radii.';
    defaultViva = 'Explain why oxygen stoichiometry defects (oxygen vacancies) act as n-type electron donors in metal oxides.';
  } else if (isPolymer) {
    defaultDerivation = 'Thermodynamic Flory-Huggins Polymer Solution Theory & Network Gelation';
    defaultFormula = 'p_c = \\frac{2}{f_{avg}}';
    defaultFormulaName = 'Carothers Network Gelation Criterion';
    defaultTrap = 'Advanced Exam Trap: Monomer functionality determines cross-linking capability. Only monomers with functionality f > 2 can form 3D thermoset networks.';
    defaultViva = 'Contrast thermoplastic and thermosetting polymers in terms of molecular architecture and thermal recyclability.';
  } else if (isNano) {
    defaultDerivation = 'Effective Mass Schrödinger Equation in 3D Nanoscale Potential Wells';
    defaultFormula = '\\Delta E = \\frac{\\hbar^2 \\pi^2}{2 R^2} \\left(\\frac{1}{m_e^*} + \\frac{1}{m_h^*}\\right)';
    defaultFormulaName = 'Quantum Confinement Energy Scaling';
    defaultTrap = 'Scaling Trap: Confinement kinetic energy scales quadratically with inverse radius (1/R²), whereas surface area to volume scales as 1/R.';
    defaultViva = 'Explain the physical significance of the exciton Bohr radius in defining the weak vs strong confinement regimes.';
  } else if (isOled) {
    defaultDerivation = 'Spin Angular Momentum Coupling in Organic Electroluminescence';
    defaultFormula = '\\eta_{\\text{EQE}} = \\gamma \\cdot \\eta_{\\text{ST}} \\cdot q_{\\text{eff}} \\cdot \\eta_{\\text{out}}';
    defaultFormulaName = 'External Quantum Efficiency (EQE)';
    defaultTrap = 'Advanced Exam Trap: Traditional fluorescent emitters are limited to 25% internal quantum efficiency due to singlet-triplet spin statistics; phosphorescence overcomes this by harvesting triplets.';
    defaultViva = 'Why is an ultra-thin LiF buffer layer inserted between the electron transport layer and aluminum cathode?';
  }

  return {
    topicId: topic.id,
    foundational: {
      coreAnalogy: `Foundational Intuitive Mental Model for ${topic.title}`,
      intuitiveExplanation: `At a high level, **${topic.title}** describes how structural arrangements at the atomic and molecular scale dictate observable engineering behavior.
- **Key Concept**: ${topic.description}
- Understanding this provides the physical basis for how materials respond to electrical fields, temperature changes, and chemical environments.`,
      keyTakeaways: [
        `Core Definition: ${topic.title} is an essential pillar of ${topic.category}.`,
        'Everyday intuition: Physical behavior follows structural geometry and electron availability.',
        `Primary context in syllabus: ${topic.source || 'University Material Science Curriculum'}.`
      ],
      quickCheckQuestion: `What is the primary role of ${topic.title} in ${topic.category}?`,
      quickCheckAnswer: topic.description
    },
    undergraduate: {
      formalNotes: topic.content,
      applications: [
        `Industrial application in ${topic.category} engineering components.`,
        'Precision device fabrication and quality inspection in material science.'
      ],
      keyInsights: [
        'Rigorous understanding required for university end-semester theory examinations.',
        'Serves as a prerequisite or related foundation for higher-level functional material systems.'
      ]
    },
    gateHonors: {
      derivationTitle: defaultDerivation,
      rigorousDerivation: `### Mathematical & Theoretical Framework for ${topic.title}
In advanced university examinations and honors curricula, this topic requires mastery of structural stability parameters and quantitative equations.

1. **Constitutive Relations**:
   Relating microscopic parameters (ionic radii, bond polarizabilities, carrier concentrations) to bulk macroscopic response variables.
2. **Boundary Conditions**:
   Analyzing limiting behaviors at temperature extremes ($T \\rightarrow 0\\text{ K}$ and $T \\rightarrow \\infty$) and dimensional extremes ($R \\rightarrow 0$ nanoscale limits).`,
      keyFormulas: [
        {
          name: defaultFormulaName,
          formula: defaultFormula,
          parameterDefinitions: 'Standard material parameters and SI physical constants',
          units: 'SI Standard Units'
        }
      ],
      examTraps: [
        defaultTrap,
        'Always verify whether the question asks for Internal Quantum Efficiency vs External Quantum Efficiency, or Number-Average vs Weight-Average parameters!'
      ],
      solvedNumericals: [
        {
          id: `num-${topic.id}-gen`,
          gateYearOrExam: 'Advanced Academic Model Problem',
          difficulty: 'Advanced Academic',
          problemStatement: `A sample exhibiting properties related to ${topic.title} is tested under standard temperature and pressure. Given primary material parameters, evaluate the expected response.`,
          givenValues: {
            'Temperature (T)': '300 K',
            'Material Class': topic.category
          },
          formulaUsed: defaultFormula,
          stepByStepSolution: [
            'Step 1: Identify the governing governing formula and check consistent SI units.',
            'Step 2: Substitute given parameter values into the constitutive equation.',
            'Step 3: Evaluate terms systematically and verify dimensional consistency.'
          ],
          answerWithUnits: 'Consistent with standard theoretical limits for this material class.'
        }
      ],
      vivaQuestions: [
        {
          question: `How would you explain the significance of ${topic.title} during a thesis or lab viva?`,
          modelAnswer: defaultViva
        }
      ]
    }
  };
}
