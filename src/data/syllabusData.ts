import { TopicNode, RelationshipEdge, FolderItem } from '../types/knowledge';

export const INITIAL_FOLDERS: FolderItem[] = [
  { id: 'functional-materials', name: 'Functional Materials', order: 1 },
  { id: '01-oxides', name: '01 Oxides', parentId: 'functional-materials', order: 1 },
  { id: '02-polymers', name: '02 Polymers', parentId: 'functional-materials', order: 2 },
  { id: '03-conducting-polymers', name: '03 Conducting Polymers', parentId: 'functional-materials', order: 3 },
  { id: '04-nanomaterials', name: '04 Nanotechnology and Nanomaterials', parentId: 'functional-materials', order: 4 },
  { id: '05-synthesis-nanomaterials', name: '05 Synthesis of Nanomaterials', parentId: 'functional-materials', order: 5 },
  { id: '06-oleds', name: '06 OLEDs', parentId: 'functional-materials', order: 6 },
  { id: 'personal', name: 'Personal Notes', order: 2 },
  { id: 'unsorted', name: 'Unsorted Notes', order: 3 },
];

export const INITIAL_TOPICS: TopicNode[] = [
  // ==========================================
  // FOLDER 01 — OXIDES
  // ==========================================
  {
    id: 'oxides-definition',
    title: 'Definition and Classification of Oxides',
    folderId: '01-oxides',
    category: 'Oxides',
    topicType: 'definition',
    description: 'Chemical compounds formed by the combination of oxygen with other chemical elements (metals or non-metals).',
    content: `# Definition and Classification of Oxides

An **oxide** is a chemical compound that contains at least one oxygen atom and one other element in its chemical formula. Most of the Earth's crust consists of solid oxides resulting from elements being oxidized by oxygen in air or water.

## Fundamental Classifications Covered in Unit 1 A:
1. **AB-type Oxides**: Monoxides with 1:1 cation-to-anion stoichiometry (e.g., $MgO$, $NiO$, $FeO$).
2. **AB₂-type Oxides**: Dioxides with 1:2 stoichiometry (e.g., $TiO_2$, $ZrO_2$, $SiO_2$).
3. **ABO₃-type Oxides**: Ternary oxides containing two different metal cations ($A$ and $B$) coordinated with oxygen (e.g., $BaTiO_3$, $CaTiO_3$).
4. **[[Perovskite-type Oxides]]**: A crystallographic class within ABO₃ systems demonstrating exceptional ferroelectric, piezoelectric, and dielectric traits.

## General Physical & Chemical Characteristics
- High melting point and structural rigidity.
- Wide range of electrical conductivity: from insulating dielectric ceramics ($Al_2O_3$, $SiO_2$) to semiconductors ($ZnO$, $TiO_2$) and superconductors ($YBa_2Cu_3O_{7-\\delta}$).
- Oxidation state of oxygen is predominantly $-2$ ($O^{2-}$).

See also: [[AB-type Oxides]], [[AB2-type Oxides]], [[ABO3-type Oxides]], and [[Perovskite-type Oxides]].`,
    prerequisiteIds: [],
    relatedIds: ['ab-oxides', 'ab2-oxides', 'abo3-oxides', 'perovskite-oxides'],
    source: 'Unit 1 A Notes.pdf — Functional Materials (p. 1-2)',
  },
  {
    id: 'ab-oxides',
    title: 'AB-type Oxides',
    folderId: '01-oxides',
    category: 'Oxides',
    topicType: 'classification',
    description: 'Binary metal monoxides with rock-salt or zinc-blende crystal structures and 1:1 stoichiometry.',
    content: `# AB-type Oxides

**AB-type oxides** represent binary monoxide systems where the electropositive metal cation $A^{2+}$ balances the divalent oxide anion $O^{2-}$.

## Structural Characteristics
- Often crystallize in the face-centered cubic (FCC) **Rocksalt (NaCl) structure** with octahedral coordination (coordination number = 6 for both ions).
- Examples from course notes:
  - Magnesium Oxide ($MgO$): Refractory insulator with high melting point (~$2852^\\circ\\text{C}$).
  - Nickel Oxide ($NiO$): Wide bandgap p-type semiconductor exhibiting antiferromagnetism.
  - Cobalt Oxide ($CoO$) and Ferrous Oxide ($FeO$).

## Properties & Applications
- High chemical stability and refractory performance.
- Catalyst supports and barrier layers in microelectronics.
- Basicity: Dissolve in acids to form salts:
  $$MO + 2HCl \\rightarrow MCl_2 + H_2O$$

Directly connects to [[Definition and Classification of Oxides]].`,
    prerequisiteIds: ['oxides-definition'],
    relatedIds: ['ab2-oxides', 'abo3-oxides'],
    source: 'Unit 1 A Notes.pdf — Section 1.1',
  },
  {
    id: 'ab2-oxides',
    title: 'AB2-type Oxides',
    folderId: '01-oxides',
    category: 'Oxides',
    topicType: 'classification',
    description: 'Dioxides such as TiO2 and ZrO2 featuring rutile, anatase, or fluorite structures with optical and dielectric utility.',
    content: `# AB2-type Oxides

**AB₂-type oxides** are dioxide compounds where the tetravalent metal cation $A^{4+}$ is coordinated with two divalent oxide ions $O^{2-}$.

## Prominent Example: Titanium Dioxide ($TiO_2$)
Occurs naturally in three primary crystalline polymorphs:
1. **Rutile**: Tetragonal, thermodynamically stable at high temperatures, high refractive index ($n \\approx 2.7$).
2. **Anatase**: Tetragonal, photo-catalytically superior with an optical bandgap of $\\approx 3.2\\text{ eV}$.
3. **Brookite**: Orthorhombic, meta-stable.

## Crucial Reactions & Solid-State Role
$TiO_2$ acts as a principal precursor in synthesis of advanced ternary electroceramics:
- Precursor for [[Preparation of BaTiO3]] and [[Preparation of CaTiO3]].
- Used in UV-absorbers, white pigments, self-cleaning coatings, and photocatalysis.

Connected to: [[ABO3-type Oxides]] and [[Synthesis of Nanomaterials Overview]].`,
    prerequisiteIds: ['oxides-definition'],
    relatedIds: ['ab-oxides', 'abo3-oxides', 'batio3-prep', 'catio3-prep'],
    source: 'Unit 1 A Notes.pdf — Section 1.2',
  },
  {
    id: 'abo3-oxides',
    title: 'ABO3-type Oxides',
    folderId: '01-oxides',
    category: 'Oxides',
    topicType: 'classification',
    description: 'Ternary mixed-metal oxides with two distinct cation sites forming the foundation for perovskites.',
    content: `# ABO3-type Oxides

**ABO₃-type oxides** are ternary metal oxides consisting of two cations of substantially different sizes:
- **A-site cation**: Larger ionic radius, typically an alkali metal, alkaline earth metal, or rare earth (e.g., $Ba^{2+}$, $Ca^{2+}$, $Pb^{2+}$, $La^{3+}$).
- **B-site cation**: Smaller ionic radius with high charge, usually a transition metal occupying octahedral holes (e.g., $Ti^{4+}$, $Zr^{4+}$, $Fe^{3+}$, $Nb^{5+}$).
- **Oxygen anions ($O^{2-}$)**: Form close-packed corner-sharing $BO_6$ octahedra.

## Structural Stability: Goldschmidt Tolerance Factor ($t$)
The geometric stability of the cubic ABO₃ lattice is given by:
$$t = \\frac{r_A + r_O}{\\sqrt{2}(r_B + r_O)}$$
- For an ideal cubic lattice: $t \\approx 1.0$.
- For ferroelectric distortion (e.g. $BaTiO_3$ at room temperature): $t > 1.0$, allowing the $Ti^{4+}$ ion to displace off-center.

This class directly encompasses [[Perovskite-type Oxides]].`,
    prerequisiteIds: ['oxides-definition', 'ab2-oxides'],
    relatedIds: ['perovskite-oxides', 'batio3-prep', 'catio3-prep'],
    source: 'Unit 1 A Notes.pdf — Section 1.3',
  },
  {
    id: 'perovskite-oxides',
    title: 'Perovskite-type Oxides',
    folderId: '01-oxides',
    category: 'Oxides',
    topicType: 'material',
    description: 'Crystalline ternary oxides named after mineral CaTiO3 with corner-sharing BO6 octahedra exhibiting spontaneous polarization.',
    content: `# Perovskite-type Oxides

**Perovskites** are materials sharing the crystal structure of the mineral calcium titanate ($CaTiO_3$). The unit cell features the large $A$ cation at the cube corners (or body center), the small transition metal $B$ cation at the body center (surrounded by 6 oxygens in an octahedral cage), and oxygen ions at the face centers.

## Distinctive Physical Phenomena
Due to temperature-dependent structural phase transitions (cubic $\\rightarrow$ tetragonal $\\rightarrow$ orthorhombic $\\rightarrow$ rhombohedral), perovskites manifest:
1. [[Ferroelectric Properties]]: Spontaneous electric dipole moment reversible by an external electric field.
2. [[Piezoelectric Properties]]: Interconversion between mechanical stress and electrical charge.
3. [[High Dielectric Constant]]: Relative permittivity $\\kappa > 1000-10000$ near the Curie point.
4. [[Electrocaloric Behaviour]]: Adiabatic temperature shift under fluctuating electric fields.

## Core Prototype Compounds
- Barium Titanate ($BaTiO_3$): see [[Preparation of BaTiO3]]
- Calcium Titanate ($CaTiO_3$): see [[Preparation of CaTiO3]]`,
    prerequisiteIds: ['abo3-oxides'],
    relatedIds: ['batio3-prep', 'catio3-prep', 'ferroelectricity', 'piezoelectricity', 'high-dielectric-constant', 'electrocaloric-behaviour'],
    source: 'Unit 1 A Notes.pdf — Section 1.3 & Perovskite Summary',
  },
  {
    id: 'batio3-prep',
    title: 'Preparation of BaTiO3',
    folderId: '01-oxides',
    category: 'Oxides',
    topicType: 'process',
    description: 'High-temperature solid-state reaction and wet-chemical preparation of barium titanate electroceramics.',
    content: `# Preparation of Barium Titanate ($BaTiO_3$)

Barium titanate is synthesized through solid-state calcination or wet chemical routes as noted in the syllabus.

## 1. Classical Solid-State Synthesis (Solid Reaction)
Stoichiometric proportions of barium carbonate ($BaCO_3$) and titanium dioxide ($TiO_2$) are thoroughly mixed by ball milling and calcined at elevated temperatures:

$$BaCO_3(s) + TiO_2(s) \\xrightarrow{1100^\\circ\\text{C} - 1250^\\circ\\text{C}} BaTiO_3(s) + CO_2(g) \\uparrow$$

### Step-by-Step Mechanism:
1. **Raw Material Preparation**: High-purity $BaCO_3$ and rutile/anatase $TiO_2$.
2. **Homogenization**: Wet ball-milling in ethanol or water.
3. **Calcination**: Heat-treatment driving out $CO_2$.
4. **Sintering**: Compacting the milled powder into green pellets and sintering at $1300^\\circ\\text{C}-1400^\\circ\\text{C}$ to attain high density ceramic.

## 2. Chemical Wet Synthesis Route (Sol-Gel / Co-precipitation)
Preparation via barium hydroxide and titanium alkoxides ($Ti(OR)_4$) produces ultra-fine nanoscale $BaTiO_3$ powders with enhanced sintering reactivity. (See [[Sol-gel Condensation]]).

Leads to: [[Ferroelectric Properties]] and [[High Dielectric Constant]].`,
    prerequisiteIds: ['perovskite-oxides', 'ab2-oxides'],
    relatedIds: ['catio3-prep', 'ferroelectricity', 'piezoelectricity', 'sol-gel-condensation'],
    source: 'Unit 1 A Notes.pdf — Section 1.4: Synthesis of BaTiO3',
  },
  {
    id: 'catio3-prep',
    title: 'Preparation of CaTiO3',
    folderId: '01-oxides',
    category: 'Oxides',
    topicType: 'process',
    description: 'Synthesis of calcium titanate (perovskite) via solid-state reaction of CaCO3 and TiO2.',
    content: `# Preparation of Calcium Titanate ($CaTiO_3$)

Calcium titanate ($CaTiO_3$) is the eponymous parent mineral of the entire perovskite family, discovered by Gustav Rose in 1839 in the Ural Mountains.

## Solid-State Synthesis Reaction
Produced by high-temperature solid reaction between Calcium Carbonate ($CaCO_3$) and Titanium Dioxide ($TiO_2$):

$$CaCO_3(s) + TiO_2(s) \\xrightarrow{1150^\\circ\\text{C} - 1300^\\circ\\text{C}} CaTiO_3(s) + CO_2(g) \\uparrow$$

## Structural Distinctions compared to $BaTiO_3$
- Because the calcium ion ($Ca^{2+}$, radius $\\approx 1.00\\text{ \\AA}$) is smaller than the barium ion ($Ba^{2+}$, radius $\\approx 1.35\\text{ \\AA}$), the Goldschmidt tolerance factor is slightly lower ($t \\approx 0.96$).
- As a result, $CaTiO_3$ exhibits an **orthorhombically tilted** perovskite structure at room temperature (space group *Pbnm*), rather than the tetragonal ferroelectric phase of $BaTiO_3$.
- Used extensively as a microwave dielectric resonator, in Synroc nuclear waste immobilization, and as a biomedical coating for bone implants.`,
    prerequisiteIds: ['perovskite-oxides', 'ab2-oxides'],
    relatedIds: ['batio3-prep', 'perovskite-oxides'],
    source: 'Unit 1 A Notes.pdf — Section 1.4: Synthesis of CaTiO3',
  },
  {
    id: 'ferroelectricity',
    title: 'Ferroelectric Properties',
    folderId: '01-oxides',
    category: 'Oxides',
    topicType: 'property',
    description: 'Spontaneous electric polarization reversible by the application of an external electric field below the Curie temperature.',
    content: `# Ferroelectric Properties

**Ferroelectricity** is an electrical property analogous to ferromagnetism, wherein a dielectric material possesses a permanent, spontaneous electric polarization ($P_s$) in the absence of an applied electric field, and this polarization can be reversed by an external electric field.

## Key Physical Criteria:
- **Centrosymmetry Breaking**: Crystals must lack a center of inversion symmetry. In $BaTiO_3$ below $120^\\circ\\text{C}$ (Curie Temperature, $T_c$), the cubic structure elongates along the c-axis into a tetragonal phase, shifting $Ti^{4+}$ by $\\sim 0.05\\text{ \\AA}$ relative to $O^{2-}$.
- **P-E Hysteresis Loop**: As electric field ($E$) is cycled, polarization displays a hysteresis loop featuring:
  - *Saturation Polarization* ($P_{sat}$)
  - *Remanent Polarization* ($P_r$)
  - *Coercive Field* ($E_c$)
- **Curie-Weiss Law**: Above $T_c$, ferroelectric behavior vanishes into a paraelectric state:
  $$\\epsilon_r = \\frac{C}{T - T_0}$$

Directly associated with [[Piezoelectric Properties]], [[High Dielectric Constant]], and [[Electrocaloric Behaviour]].`,
    prerequisiteIds: ['perovskite-oxides', 'batio3-prep'],
    relatedIds: ['piezoelectricity', 'high-dielectric-constant', 'electrocaloric-behaviour'],
    source: 'Unit 1 A Notes.pdf — Section 1.5: Dielectric & Ferroelectric Behavior',
  },
  {
    id: 'piezoelectricity',
    title: 'Piezoelectric Properties',
    folderId: '01-oxides',
    category: 'Oxides',
    topicType: 'property',
    description: 'Electromechanical coupling where applied mechanical stress generates electrical polarization and vice versa.',
    content: `# Piezoelectric Properties

**Piezoelectricity** (from the Greek *piezein*, to press) is the linear electromechanical interaction between mechanical stress and electrical voltage in non-centrosymmetric crystalline materials.

## The Dual Effects:
1. **Direct Piezoelectric Effect**: Applying mechanical compression or tension displaces internal ionic centers of charge, generating a measurable surface electrical charge:
   $$P_i = d_{ijk} \\sigma_{jk}$$
   *(Used in sensors, pressure transducers, gas igniters, accelerometers).*
2. **Converse (Inverse) Piezoelectric Effect**: Applying an external electric voltage generates mechanical strain and dimensional deformation:
   $$S_{ij} = d_{kij} E_k$$
   *(Used in actuators, ultrasonic transducers, quartz resonators, scanning probe microscope positioners).*

## Relationship in Perovskites
All ferroelectric materials are inherently piezoelectric (since ferroelectricity requires non-centrosymmetric symmetry), but not all piezoelectrics are ferroelectric. In $BaTiO_3$, piezoelectric coefficients are exceptionally high after electric poling.`,
    prerequisiteIds: ['ferroelectricity'],
    relatedIds: ['high-dielectric-constant', 'batio3-prep'],
    source: 'Unit 1 A Notes.pdf — Section 1.5',
  },
  {
    id: 'high-dielectric-constant',
    title: 'High Dielectric Constant',
    folderId: '01-oxides',
    category: 'Oxides',
    topicType: 'property',
    description: 'Extraordinary relative permittivity (epsilon_r > 1,000 to 10,000) allowing huge electrostatic charge storage.',
    content: `# High Dielectric Constant

Dielectric ceramics in the perovskite family exhibit unusually high **relative permittivity** (dielectric constant, $\\epsilon_r$ or $\\kappa$), often ranging from $1,000$ to upwards of $10,000$ in polycrystalline ceramics.

## Underlying Mechanism:
1. **Ionic & Dipolar Polarization**: Easy displacement of the central $Ti^{4+}$ ion inside the $O_6$ octahedral cage under alternating electric fields.
2. **Domain Wall Motion**: Motion of ferroelectric domain boundaries amplifies the net dielectric displacement.
3. **Curie Peak**: Permittivity spikes sharply as temperature approaches the Curie point $T_c$ ($120^\\circ\\text{C}$ for $BaTiO_3$).

## Practical Applications:
- Multilayer Ceramic Capacitors (MLCCs): Essential for energy storage and noise filtering in smartphones, computers, and automotive control units.
- High-k gate dielectrics in semiconductor microelectronics.`,
    prerequisiteIds: ['perovskite-oxides', 'ferroelectricity'],
    relatedIds: ['electrocaloric-behaviour', 'batio3-prep'],
    source: 'Unit 1 A Notes.pdf — Section 1.5',
  },
  {
    id: 'electrocaloric-behaviour',
    title: 'Electrocaloric Behaviour',
    folderId: '01-oxides',
    category: 'Oxides',
    topicType: 'property',
    description: 'Reversible temperature and entropy change in polar dielectric materials upon the application and removal of an electric field.',
    content: `# Electrocaloric Behaviour

**Electrocaloric Effect (ECE)** is the reversible heating or cooling of an electrocaloric material when subjected to an adiabatic change in an applied electric field.

## Thermodynamic Description:
When an electric field $E$ is applied to an unpoled ferroelectric or paraelectric material near its phase boundary:
1. Electric dipoles align with the external field, causing dipolar order and reducing dipolar entropy ($\\Delta S$).
2. Under adiabatic conditions ($dQ = 0$), the lattice entropy must increase to compensate, resulting in a temperature rise:
   $$\\Delta T = - \\int \\frac{T}{\\rho C_p} \\left( \\frac{\\partial P}{\\partial T} \\right)_E dE$$
3. When the electric field is abruptly removed, dipoles randomize, absorbing heat and cooling the material.

## Note from Handwritten Course Source:
The handwritten notes highlight electrocaloric behavior in perovskite titanates ($BaTiO_3$ and doped derivatives) as solid-state, greenhouse-gas-free cooling alternatives to fluorocarbon compressor refrigeration.`,
    prerequisiteIds: ['ferroelectricity', 'high-dielectric-constant'],
    relatedIds: ['batio3-prep', 'perovskite-oxides'],
    source: 'Unit 1 A Notes.pdf — Section 1.6: Thermal & Electrocaloric Behavior',
  },

  // ==========================================
  // FOLDER 02 — POLYMERS
  // ==========================================
  {
    id: 'polymers-definition',
    title: 'Definition of Polymers and Repeating Units',
    folderId: '02-polymers',
    category: 'Polymers',
    topicType: 'definition',
    description: 'High molecular mass macromolecules constructed by covalent bonding of smaller repeating monomer units.',
    content: `# Definition of Polymers and Repeating Units

A **polymer** (Greek *poly* = many, *meros* = parts) is a high-molecular-weight macromolecule composed of repeating structural units called **monomers**, linked together by covalent bonds through a chemical process termed **polymerization**.

## Key Concepts from Course Notes:
- **Degree of Polymerization ($DP$ or $n$)**: The total number of repeating units in a polymer chain:
  $$\\text{Molecular Weight} = n \\times (\\text{Formula Weight of Monomer})$$
- **Functionality**: The number of reactive bonding sites on a monomer.
  - Bifunctional monomers $\\rightarrow$ Linear or branched chains (typically [[Thermoplastic Polymers]]).
  - Polyfunctional monomers ($>2$) $\\rightarrow$ 3D Cross-linked networks (typically [[Thermosetting Polymers]]).

Classifies into [[Thermoplastic Polymers]] and [[Thermosetting Polymers]].`,
    prerequisiteIds: [],
    relatedIds: ['thermoplastics', 'thermosetting', 'teflon', 'novolac-formation', 'bakelite-formation'],
    source: 'Unit 1 A Notes.pdf — Section 2.1: Polymer Chemistry',
  },
  {
    id: 'thermoplastics',
    title: 'Thermoplastic Polymers',
    folderId: '02-polymers',
    category: 'Polymers',
    topicType: 'classification',
    description: 'Linear or branched polymers that soften and flow upon heating and harden reversibly upon cooling.',
    content: `# Thermoplastic Polymers

**Thermoplastic polymers** are polymeric materials consisting of long linear or branched macromolecules held together by relatively weak intermolecular secondary forces (van der Waals interactions, dipole-dipole attractions, or hydrogen bonds) rather than permanent covalent cross-links.

## Distinctive Behavioral Traits:
- **Thermal Behavior**: Soften and melt upon heating, solidify reversibly upon cooling. The process can be repeated multiple times without chemical decomposition.
- **Solubility**: Soluble or swellable in compatible organic solvents.
- **Mechanical Character**: Flexible, ductile, can be reshaped by injection molding, extrusion, or blow molding.
- **Recyclability**: Highly recyclable due to reversible physical melting.

## Exemplary Representative from Syllabus:
- [[Teflon]] (Polytetrafluoroethylene, PTFE): Notable for thermal resistance and chemical inertness despite thermoplastic classification.
- Polyethylene (PE), Polypropylene (PP), Polystyrene (PS).

Contrasts sharply with [[Thermosetting Polymers]].`,
    prerequisiteIds: ['polymers-definition'],
    relatedIds: ['thermosetting', 'teflon'],
    source: 'Unit 1 A Notes.pdf — Section 2.2: Thermoplastics vs Thermosets',
  },
  {
    id: 'thermosetting',
    title: 'Thermosetting Polymers',
    folderId: '02-polymers',
    category: 'Polymers',
    topicType: 'classification',
    description: 'Cross-linked polymer networks that cure irreversibly through heat or catalyst and decompose without melting.',
    content: `# Thermosetting Polymers

**Thermosetting polymers** (or thermosets) are materials that, during the molding and curing process, undergo irreversible chemical cross-linking to establish a permanent three-dimensional covalent network.

## Distinctive Behavioral Traits:
- **Thermal Behavior**: Once cured, they do not melt or soften upon reheating; further excessive heating causes chemical degradation, charring, and thermal decomposition.
- **Cross-link Density**: High covalent bond density between neighboring polymer backbones gives immense dimensional rigidity, high modulus, and heat resistance.
- **Solubility**: Completely insoluble in all solvents; may only swell slightly.
- **Recyclability**: Cannot be remolded or thermally recycled.

## Prime Course Focus:
- [[Novolac Formation]] (intermediate prepolymer)
- [[Bakelite Formation]] (the archetypal commercial thermoset)
- [[Applications of Bakelite]]`,
    prerequisiteIds: ['polymers-definition'],
    relatedIds: ['thermoplastics', 'novolac-formation', 'bakelite-formation', 'bakelite-applications'],
    source: 'Unit 1 A Notes.pdf — Section 2.2: Thermoplastics vs Thermosets',
  },
  {
    id: 'teflon',
    title: 'Teflon (PTFE): Preparation, Properties & Applications',
    folderId: '02-polymers',
    category: 'Polymers',
    topicType: 'material',
    description: 'Polytetrafluoroethylene (PTFE) synthesized by free-radical polymerization of tetrafluoroethylene.',
    content: `# Teflon (Polytetrafluoroethylene / PTFE)

**Teflon** is a high-performance fluoropolymer synthesized through addition polymerization of tetrafluoroethylene ($F_2C=CF_2$).

## 1. Synthesis / Preparation Reaction
Tetrafluoroethylene is polymerized under high pressure in the presence of free-radical initiators such as benzoyl peroxide or ammonium persulfate:

$$n(CF_2=CF_2) \\xrightarrow[\\text{Pressure, Initiator}]{\\text{Peroxide catalyst}} -[-CF_2-CF_2-]_n-$$

The strong carbon-fluorine ($C-F$) bond energy ($\\sim 485\\text{ kJ/mol}$) and the complete sheath of electronegative fluorine atoms around the carbon backbone dictate its extreme chemical inertness.

## 2. Key Properties
- **Chemical Inertness**: Unattacked by concentrated boiling acids, alkalis, aqua regia, and aggressive organic solvents.
- **Ultra-low Coefficient of Friction**: One of the lowest known coefficients of kinetic friction against steel ($0.04-0.10$).
- **Thermal Stability**: Operates continuously up to $260^\\circ\\text{C}$ without degradation.
- **Excellent Dielectricity**: High dielectric breakdown strength and low dielectric loss.
- **Hydrophobicity**: Strongly non-wetting.

## 3. Applications
- Non-stick cookware coatings.
- Chemical plant gaskets, seals, valve packings, and reactive chemical tubing.
- High-frequency coaxial cables and insulating wire wraps.
- Self-lubricating dry bearings and biomedical vascular grafts.`,
    prerequisiteIds: ['thermoplastics'],
    relatedIds: ['polymers-definition', 'wettability'],
    source: 'Unit 1 A Notes.pdf — Section 2.3: Teflon Synthesis & Properties',
  },
  {
    id: 'novolac-formation',
    title: 'Novolac Formation',
    folderId: '02-polymers',
    category: 'Polymers',
    topicType: 'process',
    description: 'Acid-catalyzed condensation polymerization of phenol with formaldehyde using molar ratio < 1 yielding linear prepolymers.',
    content: `# Novolac Formation

**Novolac** is a linear thermoplastic prepolymer formed by the step-growth condensation reaction between **Phenol** ($C_6H_5OH$) and **Formaldehyde** ($HCHO$) under **acidic conditions** ($pH < 7$, using $HCl$ or oxalic acid catalyst) with an excess of phenol.

## Reaction Conditions:
- **Molar Ratio**: Phenol : Formaldehyde $> 1$ (Formaldehyde is the limiting reagent, typically $P/F \\approx 1 : 0.8$).
- **Catalyst**: Acidic ($H^+$).

## Mechanism:
1. Protonation of formaldehyde yields a hydroxymethyl carbocation:
   $$HCHO + H^+ \\rightleftharpoons ^+CH_2OH$$
2. Electrophilic aromatic substitution at *ortho-* and *para-* positions of phenol generates *o-* and *p-*hydroxybenzyl alcohols:
   $$C_6H_5OH + ^+CH_2OH \\rightarrow HOC_6H_4-CH_2OH + H^+$$
3. Further condensation with adjacent phenol rings through elimination of water produces linear methylene-bridged chains:
   $$n(C_6H_5OH) + (n-1)HCHO \\xrightarrow{H^+} \\text{Novolac} + (n-1)H_2O$$

Because formaldehyde is limiting, no 3D cross-linking can occur yet. Novolac remains meltable and soluble until cross-linked in [[Bakelite Formation]].`,
    prerequisiteIds: ['thermosetting'],
    relatedIds: ['bakelite-formation', 'bakelite-applications'],
    source: 'Unit 1 A Notes.pdf — Section 2.4: Phenol-Formaldehyde Resins',
  },
  {
    id: 'bakelite-formation',
    title: 'Bakelite Formation',
    folderId: '02-polymers',
    category: 'Polymers',
    topicType: 'process',
    description: 'Cross-linking of Novolac with hexamethylenetetramine or base catalyst into a rigid 3D infusible thermoset resin.',
    content: `# Bakelite Formation

**Bakelite** (Polyoxybenzylmethylenglycolanhydride), developed by Leo Baekeland in 1907, was the world's first synthetic thermosetting plastic.

## Cross-linking Process:
Novolac prepolymer is mixed with a cross-linking agent, typically **hexamethylenetetramine** (hexa, $(CH_2)_6N_4$) or additional formaldehyde in the presence of basic catalysts ($NaOH$ / $NH_4OH$), along with wood flour or asbestos filler, and heated under compression:

$$\\text{Linear Novolac} + \\text{Hexa} / \\text{Formaldehyde} \\xrightarrow[150^\\circ\\text{C}-180^\\circ\\text{C}]{\\text{Heat + Pressure}} \\text{Bakelite (3D Network)}$$

## Structural Features:
- Methylene bridges ($-CH_2-$) link all available *ortho-* and *para-* positions of the phenolic rings.
- Forms an intractable, infusible, hard, three-dimensional covalent lattice.
- Reaction is strictly irreversible once cured.

See details on practical uses: [[Applications of Bakelite]].`,
    prerequisiteIds: ['novolac-formation', 'thermosetting'],
    relatedIds: ['bakelite-applications'],
    source: 'Unit 1 A Notes.pdf — Section 2.4: Phenol-Formaldehyde Resins',
  },
  {
    id: 'bakelite-applications',
    title: 'Applications of Bakelite',
    folderId: '02-polymers',
    category: 'Polymers',
    topicType: 'application',
    description: 'Industrial and electrical uses of cured Bakelite based on its insulating, thermal, and mechanical durability.',
    content: `# Applications of Bakelite

Owing to its high dielectric breakdown resistance, rigid mechanical stability, resistance to moisture, and non-conductivity, Bakelite was historically heralded as "the material of a thousand uses".

## Major Uses Documented in Syllabus:
1. **Electrical Insulating Components**:
   - Electric switches, plugs, sockets, distributor caps, and circuit board bases.
2. **Thermal & Household Appliances**:
   - Heat-insulating handles for frying pans, pressure cookers, kettles, and irons.
3. **Mechanical and Automotive Hardware**:
   - Billiard balls, timing gears, brake linings, and telephone casings.
4. **Protective Coatings and Adhesives**:
   - Varnishes, binder resins for grinding wheels, and decorative laminates (Formica).

Directly connected to [[Bakelite Formation]] and [[Thermosetting Polymers]].`,
    prerequisiteIds: ['bakelite-formation'],
    relatedIds: ['bakelite-formation', 'thermosetting'],
    source: 'Unit 1 A Notes.pdf — Section 2.5: Bakelite Uses',
  },

  // ==========================================
  // FOLDER 03 — CONDUCTING POLYMERS
  // ==========================================
  {
    id: 'conducting-polymers-intro',
    title: 'Introduction to Conducting Polymers',
    folderId: '03-conducting-polymers',
    category: 'Conducting Polymers',
    topicType: 'definition',
    description: 'Organic macromolecules featuring delocalized pi-electrons capable of electrical conductivity upon chemical or electrochemical doping.',
    content: `# Introduction to Conducting Polymers

Traditionally, organic polymers were regarded as universal electrical insulators. In 1977, Alan Heeger, Alan MacDiarmid, and Hideki Shirakawa discovered that halogen vapor exposure increased the electrical conductivity of polyacetylene by over seven orders of magnitude (Nobel Prize in Chemistry 2000).

## Core Classification:
1. **[[Intrinsically Conducting Polymers]] (ICPs)**: Possess conjugated systems but intrinsically low conductivity until activated.
2. **[[Doped Conducting Polymers]]**: Drastically enhanced electrical conductivity via [[P-doping and Oxidative Doping]] or [[N-doping and Reductive Doping]].

## Requirement for Conduction:
Requires continuous overlap of $p_z$ orbitals yielding a [[Conjugated Pi-Electron Systems]] backbone.

Leads directly to [[Properties of Conducting Polymers]] and [[Applications of Conducting Polymers]].`,
    prerequisiteIds: ['polymers-definition', 'conjugated-pi-systems'],
    relatedIds: ['intrinsic-conducting-polymers', 'doped-conducting-polymers', 'conjugated-polymers-examples', 'conducting-polymers-properties', 'conducting-polymers-applications'],
    source: 'Unit 1 A Notes.pdf — Section 3.1: Conducting Polymers Intro',
  },
  {
    id: 'conjugated-pi-systems',
    title: 'Conjugated Pi-Electron Systems',
    folderId: '03-conducting-polymers',
    category: 'Conducting Polymers',
    topicType: 'structure',
    description: 'Alternating single (sigma) and double/triple (pi) bonds with sp2 hybridized carbons enabling continuous electron delocalization.',
    content: `# Conjugated Pi-Electron Systems

The absolute prerequisite for intrinsic conductivity in organic polymers is the presence of an extended **conjugated $\\pi$-electron system**.

## Structural Principle:
- Backbone carbon atoms undergo $sp^2$ hybridization.
- Three $sp^2$ hybrid orbitals form planar $\\sigma$-bonds (two along the polymer chain, one with hydrogen/side group) with $120^\\circ$ bond angles.
- The remaining unhybridized $p_z$ orbital is oriented perpendicular to the molecular plane.
- Overlap of neighboring parallel $p_z$ orbitals produces continuous delocalized bonding $\\pi$ (Valence Band / HOMO) and anti-bonding $\\pi^*$ (Conduction Band / LUMO) molecular orbitals.

## Peierls Distortion / Bandgap:
In polyacetylene ($-[-CH=CH-]_n-$), alternating single and double bond lengths (Peierls dimerization) creates an optical energy bandgap ($\\approx 1.5-1.8\\text{ eV}$), rendering pristine polymers semiconductors rather than metallic conductors without doping.

Connected to: [[Charge Behaviour in Conducting Polymer Chains]] and [[Doped Conducting Polymers]].`,
    prerequisiteIds: [],
    relatedIds: ['conducting-polymers-intro', 'charge-behaviour-polymer', 'conduction-valence-bands'],
    source: 'Unit 1 A Notes.pdf — Section 3.2: Conjugation & Pi Systems',
  },
  {
    id: 'intrinsic-conducting-polymers',
    title: 'Intrinsically Conducting Polymers',
    folderId: '03-conducting-polymers',
    category: 'Conducting Polymers',
    topicType: 'classification',
    description: 'Undoped conjugated polymers with inherent pi-electron systems possessing low baseline conductivity (10^-10 to 10^-5 S/cm).',
    content: `# Intrinsically Conducting Polymers (ICPs)

**Intrinsically conducting polymers** are conjugated polymers in their pristine, un-doped neutral state.

## Conductivity State:
- Because the energy gap ($E_g$) between the highest occupied molecular orbital (HOMO, analogous to valence band) and lowest unoccupied molecular orbital (LUMO, analogous to conduction band) is typically between $1.5\\text{ eV}$ and $3.0\\text{ eV}$, thermal excitation of electrons at room temperature is negligible.
- Baseline electrical conductivities range from $10^{-10}\\text{ S/cm}$ to $10^{-5}\\text{ S/cm}$ (insulators to weak semiconductors).

To elevate electrical conductivity into the metallic regime ($10^2 - 10^5\\text{ S/cm}$), they must undergo chemical or electrochemical doping as described in [[Doped Conducting Polymers]].`,
    prerequisiteIds: ['conducting-polymers-intro', 'conjugated-pi-systems'],
    relatedIds: ['doped-conducting-polymers', 'conjugated-polymers-examples'],
    source: 'Unit 1 A Notes.pdf — Section 3.2',
  },
  {
    id: 'doped-conducting-polymers',
    title: 'Doped Conducting Polymers',
    folderId: '03-conducting-polymers',
    category: 'Conducting Polymers',
    topicType: 'classification',
    description: 'Conjugated polymers whose conductivity is boosted by redox addition or removal of electrons.',
    content: `# Doped Conducting Polymers

Unlike inorganic semiconductors where doping involves substituting lattice atoms (e.g., $B$ or $P$ into $Si$ at parts-per-million levels), **doping in conducting polymers is a redox process** involving substantial charge transfer (typically $20-50\\text{ mol}\\%$ per repeat unit).

## Doping Pathways:
1. **[[P-doping and Oxidative Doping]]**: Partial oxidation (electron extraction from conjugated backbone).
2. **[[N-doping and Reductive Doping]]**: Partial reduction (electron injection into conjugated backbone).

Doping transforms the neutral conjugated backbone into localized mobile charge carriers: **polarons**, **bipolarons**, and **solitons** (see [[Charge Behaviour in Conducting Polymer Chains]]).`,
    prerequisiteIds: ['intrinsic-conducting-polymers'],
    relatedIds: ['p-doping-oxidative', 'n-doping-reductive', 'charge-behaviour-polymer'],
    source: 'Unit 1 A Notes.pdf — Section 3.3: Doping Mechanisms',
  },
  {
    id: 'conjugated-polymers-examples',
    title: 'Conjugated Polymers Examples',
    folderId: '03-conducting-polymers',
    category: 'Conducting Polymers',
    topicType: 'material',
    description: 'Polyacetylene, Polyaniline (PANI), Polypyrrole (PPy), and Polythiophene (PT) as core conducting polymer archetypes.',
    content: `# Conjugated Polymers Examples

The primary conjugated conducting polymers highlighted in the syllabus include:

## 1. Polyacetylene ($PA$)
- Formula: $-[-CH=CH-]_n-$
- The simplest conjugated polymer. Shows metallic conductivity when doped with iodine ($I_2$), but unstable in ambient air due to oxidative degradation.

## 2. Polyaniline ($PANI$)
- Exists in multiple oxidation states; the emeraldine salt form (doped with protonic acids like $HCl$) exhibits conductivity up to $100\\text{ S/cm}$ with excellent environmental stability.

## 3. Polypyrrole ($PPy$)
- High ambient stability and biocompatibility; widely applied in biosensors and neural electrode coatings.

## 4. Polythiophene ($PT$) / PEDOT
- High optical transparency in thin films; Poly(3,4-ethylenedioxythiophene) (PEDOT:PSS) serves as the industry standard hole transport layer in [[OLED Conductive Layer]]!

Connected to: [[OLED Conductive Layer]] and [[Applications of Conducting Polymers]].`,
    prerequisiteIds: ['conducting-polymers-intro'],
    relatedIds: ['oled-conductive-layer', 'conducting-polymers-applications'],
    source: 'Unit 1 A Notes.pdf — Section 3.3',
  },
  {
    id: 'p-doping-oxidative',
    title: 'P-doping and Oxidative Doping',
    folderId: '03-conducting-polymers',
    category: 'Conducting Polymers',
    topicType: 'process',
    description: 'Oxidation of polymer backbone by electron-accepting dopants (I2, FeCl3, AsF5) creating positive polarons.',
    content: `# P-doping and Oxidative Doping

**P-doping** is an oxidative process wherein an electron-acceptor reagent extracts $\\pi$-electrons from the conjugated polymer backbone, creating positive charge carriers (holes) along the chain balanced by inserted counter-anions.

## Chemical Reaction Example (Polyacetylene with Iodine):
$$(CH)_n + \\frac{3x}{2}I_2 \\rightarrow [(CH)^{x+}]_n + x I_3^-$$

## Common Oxidative Dopants:
- Halogens: $I_2$, $Br_2$
- Lewis acids: $FeCl_3$, $AsF_5$, $SbCl_5$
- Protonic acids (for PANI): $HCl$, camphorsulfonic acid ($CSA$)
- Electrochemical oxidation at an anode in electrolyte solution.

## Evolution of Charge:
Removal of one electron generates a radical cation (**polaron**). Removal of a second adjacent electron produces a dication (**bipolaron**), which moves down the chain. (See [[Charge Behaviour in Conducting Polymer Chains]]).`,
    prerequisiteIds: ['doped-conducting-polymers'],
    relatedIds: ['n-doping-reductive', 'charge-behaviour-polymer', 'band-diagrams-p-n'],
    source: 'Unit 1 A Notes.pdf — Section 3.4: P-doping',
  },
  {
    id: 'n-doping-reductive',
    title: 'N-doping and Reductive Doping',
    folderId: '03-conducting-polymers',
    category: 'Conducting Polymers',
    topicType: 'process',
    description: 'Reduction of conjugated polymer backbone by electron-donating dopants (Na, K, naphthalenide) injecting electrons.',
    content: `# N-doping and Reductive Doping

**N-doping** is a reductive process wherein a strong electron-donating reagent injects electrons into the LUMO ($\\pi^*$-conduction band) of the conjugated polymer chain, balanced by inserted counter-cations.

## Chemical Reaction Example (Polyacetylene with Sodium Naphthalenide):
$$(CH)_n + x \\text{Na}^+\\text{(Naph)}^\\bullet- \\rightarrow [(CH)^{x-}]_n + x \\text{Na}^+ + x \\text{Naph}$$

## Characteristics & Sensitivity:
- Alkali metal dopants: Sodium ($Na$), Potassium ($K$), Lithium ($Li$).
- Electrochemical reduction at a cathode.
- **Environmental Sensitivity**: N-doped polymers generally possess high energy electrons in $\\pi^*$ states, making them extremely vulnerable to spontaneous reaction with atmospheric oxygen and water vapor.

Leads to: [[Charge Behaviour in Conducting Polymer Chains]].`,
    prerequisiteIds: ['doped-conducting-polymers'],
    relatedIds: ['p-doping-oxidative', 'charge-behaviour-polymer', 'band-diagrams-p-n'],
    source: 'Unit 1 A Notes.pdf — Section 3.4: N-doping',
  },
  {
    id: 'charge-behaviour-polymer',
    title: 'Charge Behaviour in Conducting Polymer Chains',
    folderId: '03-conducting-polymers',
    category: 'Conducting Polymers',
    topicType: 'property',
    description: 'Conduction via quasiparticles: polarons, bipolarons, and solitons accompanied by local lattice relaxation.',
    content: `# Charge Behaviour in Conducting Polymer Chains

Unlike rigid inorganic crystals where charge carriers are free electrons or holes in parabolic bands, organic conjugated polymer chains are flexible. Adding or removing an electron induces **local structural lattice distortion (relaxation)**.

## Quasiparticle Species:
1. **Polaron**: A bound radical-ion system (spin $S = 1/2$, charge $q = \\pm e$). Formed at low doping levels. Introduces localized localized energy levels within the energy band gap.
2. **Bipolaron**: A bound pair of like charges (spin $S = 0$, charge $q = \\pm 2e$) with overlapping structural distortions. Thermodynamically more stable than two separate polarons in non-degenerate ground state polymers like polythiophene or polypyrrole.
3. **Soliton**: Topological domain walls present specifically in degenerate ground state polymers like *trans*-polyacetylene.

## Conduction Mechanism:
Macroscopic electrical conduction occurs via:
- **Intra-chain transport**: Movement of polarons/bipolarons along the polymer backbone.
- **Inter-chain hopping**: Variable range hopping (VRH) of carriers jumping between adjacent packed polymer chains.`,
    prerequisiteIds: ['p-doping-oxidative', 'n-doping-reductive'],
    relatedIds: ['conducting-polymers-properties', 'band-diagrams-p-n'],
    source: 'Unit 1 A Notes.pdf — Section 3.5: Solitons & Polarons',
  },
  {
    id: 'conducting-polymers-properties',
    title: 'Properties of Conducting Polymers',
    folderId: '03-conducting-polymers',
    category: 'Conducting Polymers',
    topicType: 'property',
    description: 'Unique combination of metal-like electronic conductivity with the mechanical flexibility and lightweight character of plastics.',
    content: `# Properties of Conducting Polymers

Conducting polymers merge physical attributes previously considered mutually exclusive in classical materials science:

## 1. Electrical & Electronic Attributes:
- Tunable electrical conductivity spanning $10^{-10}\\text{ S/cm}$ (insulator) up to $> 10^5\\text{ S/cm}$ (approaching copper).
- High electrochemical reversibility upon cycling between doped and neutral states.
- Electrochromism: Reversible color change dependent on oxidation state.

## 2. Mechanical & Physical Attributes:
- Low mass density ($\\approx 1.0 - 1.4\\text{ g/cm}^3$) compared to copper ($8.9\\text{ g/cm}^3$).
- Mechanical bendability, elastic compliance, and suitability for solution-processing into flexible thin films.
- Corrosion resistance in acidic chemical environments.

Connects to: [[Applications of Conducting Polymers]].`,
    prerequisiteIds: ['conducting-polymers-intro', 'charge-behaviour-polymer'],
    relatedIds: ['conducting-polymers-applications'],
    source: 'Unit 1 A Notes.pdf — Section 3.6',
  },
  {
    id: 'conducting-polymers-applications',
    title: 'Applications of Conducting Polymers',
    folderId: '03-conducting-polymers',
    category: 'Conducting Polymers',
    topicType: 'application',
    description: 'Antistatic shielding, supercapacitors, flexible displays, biosensors, and corrosion inhibitors.',
    content: `# Applications of Conducting Polymers

## Syllabus Highlighted Applications:
1. **Optoelectronics & Display Technology**:
   - Transparent conductive coatings (PEDOT:PSS) as anode and hole transport in [[OLED Conductive Layer]].
   - Flexible electrochromic smart windows.
2. **Energy Storage Devices**:
   - Pseudocapacitive electrodes in high-energy-density supercapacitors and flexible organic batteries.
3. **Electromagnetic Shielding & Antistatic Packaging**:
   - Dissipation of static charge on electronic components, aircraft canopies, and cleanroom garments.
4. **Bioelectronics & Chemical Sensors**:
   - Neural interface electrodes with low impedance; enzyme biosensors for glucose monitoring.
5. **Corrosion Protection**:
   - Passivating conductive primer coatings for stainless steel and aluminum.`,
    prerequisiteIds: ['conducting-polymers-properties'],
    relatedIds: ['oled-conductive-layer', 'oled-intro'],
    source: 'Unit 1 A Notes.pdf — Section 3.7: Applications',
  },
  {
    id: 'band-diagrams-p-n',
    title: 'P-type and N-type Band Diagrams in Source Notes',
    folderId: '03-conducting-polymers',
    category: 'Conducting Polymers',
    topicType: 'structure',
    description: 'Schematic band representations included in handwritten notes depicting carrier levels and band modifications.',
    content: `# P-type and N-type Band Diagrams

The handwritten course notes include schematic band diagrams illustrating energy levels for p-type and n-type conducting polymer systems.

> **Academic Review Flag:** The source notes transpose classical semiconductor band terminology (conduction band, valence band, acceptor and donor levels) directly onto doped polymer states. While pedagogical, in conducting polymers these levels actually correspond to localized polaron and bipolaron sub-gap states rather than rigid hydrogenic impurity levels in a fixed band structure.

## Content from Handwritten Source:
- **P-type state**: Depicts extraction of electrons from the valence band edge, creating vacant states (polaron levels) situated slightly above the valence band.
- **N-type state**: Depicts injection of electrons into states situated just below the conduction band edge.
- Illustrates Fermi level ($E_F$) shift towards the valence band in p-doped polymers and toward the conduction band in n-doped polymers.`,
    prerequisiteIds: ['charge-behaviour-polymer', 'conduction-valence-bands'],
    relatedIds: ['p-doping-oxidative', 'n-doping-reductive'],
    reviewFlag: {
      flagged: true,
      reason: 'Semiconductor band analogy is used in handwritten notes; in actual conducting polymers, energy bands deform dynamically into localized polaronic/bipolaronic states upon doping.',
    },
    source: 'Unit 1 A Notes.pdf — Section 3.8: Band Diagrams (Marked for Review)',
  },

  // ==========================================
  // FOLDER 04 — NANOTECHNOLOGY AND NANOMATERIALS
  // ==========================================
  {
    id: 'nanotechnology-definition',
    title: 'Definition of Nanotechnology',
    folderId: '04-nanomaterials',
    category: 'Nanomaterials',
    topicType: 'definition',
    description: 'Design, synthesis, characterization, and application of materials and devices by controlling matter at the 1 to 100 nm scale.',
    content: `# Definition of Nanotechnology

**Nanotechnology** is the understanding and control of matter at dimensions between approximately **1 and 100 nanometers ($10^{-9}\\text{ m}$)**, where unique physical, chemical, and biological phenomena enable novel applications.

## Key Dimensions from Notes:
- $1\\text{ nm} = 10^{-9}\\text{ m} = 10\\text{ \\AA} = 0.001\\text{ }\\mu\\text{m}$.
- A single strand of human DNA is $\\approx 2.5\\text{ nm}$ in diameter.
- A sheet of paper is $\\approx 100,000\\text{ nm}$ thick.

At this critical scale, classical bulk physics gives way to **quantum confinement** and dominant **surface energetic effects**, giving rise to [[Size-dependent Properties]].`,
    prerequisiteIds: [],
    relatedIds: ['nanomaterials-definition', 'size-dependent-properties', 'surface-area-to-volume'],
    source: 'Unit 1 A Notes.pdf — Section 4.1: Intro to Nanotechnology',
  },
  {
    id: 'nanomaterials-definition',
    title: 'Definition of Nanomaterials',
    folderId: '04-nanomaterials',
    category: 'Nanomaterials',
    topicType: 'definition',
    description: 'Materials having at least one external dimension or internal structure in the nanoscale regime (1-100 nm).',
    content: `# Definition of Nanomaterials

**Nanomaterials** are defined as solid substances possessing at least one characteristic dimension confined to the nanoscale ($1-100\\text{ nm}$).

## Dimensional Classification (from Course Notes):
1. **0D Nanomaterials (All 3 dimensions nanoscale)**:
   - Nanoparticles, quantum dots, nanoclusters.
2. **1D Nanomaterials (2 dimensions nanoscale, 1 macro)**:
   - Nanowires, nanotubes (e.g., carbon nanotubes), nanorods.
3. **2D Nanomaterials (1 dimension nanoscale, 2 macro)**:
   - Nanosheets, graphene, ultra-thin films, quantum wells.
4. **3D Nanomaterials**:
   - Bulk nanostructured materials composed of equiaxed nanograins.

Directly exhibits [[Size-dependent Properties]]. Synthesized via [[Synthesis of Nanomaterials Overview]].`,
    prerequisiteIds: ['nanotechnology-definition'],
    relatedIds: ['size-dependent-properties', 'nanomaterial-synthesis-overview'],
    source: 'Unit 1 A Notes.pdf — Section 4.1: Nanomaterials Classification',
  },
  {
    id: 'size-dependent-properties',
    title: 'Size-dependent Properties',
    folderId: '04-nanomaterials',
    category: 'Nanomaterials',
    topicType: 'property',
    description: 'Divergence of physical, chemical, optical, and electrical properties from bulk counterparts as dimension shrinks below 100 nm.',
    content: `# Size-dependent Properties

When material dimensions approach atomic scales, their behavior changes fundamentally compared to bulk equivalents.

## Two Primary Physical Drivers:
1. **Quantum Confinement Effect**: As spatial dimensions become comparable to the de Broglie wavelength of electrons, continuous electronic bands split into discrete, quantized energy levels (altering [[Energy Band Gap]] and [[Optical Properties and Colour]]).
2. **Surface Phenomenon**: Enormous increase in the [[Surface-area-to-volume Ratio]], leaving a large fraction of constituent atoms uncoordinated at the surface (governing [[Chemical Reactivity]], [[Melting Point Depression]], and [[Wettability]]).

See individual property notes:
- [[Electrical Properties of Nanomaterials]]
- [[Energy Band Gap]]
- [[Size-dependent Behaviour of Semiconductors]]
- [[Optical Properties and Colour]]
- [[Chemical Reactivity]]
- [[Surface-area-to-volume Ratio]]
- [[Melting Point Depression]]
- [[Wettability]]`,
    prerequisiteIds: ['nanomaterials-definition'],
    relatedIds: ['surface-area-to-volume', 'energy-band-gap', 'optical-properties-colour', 'chemical-reactivity', 'melting-point-depression', 'wettability'],
    source: 'Unit 1 A Notes.pdf — Section 4.2',
  },
  {
    id: 'conduction-valence-bands',
    title: 'Conduction Band and Valence Band',
    folderId: '04-nanomaterials',
    category: 'Nanomaterials',
    topicType: 'structure',
    description: 'Highest filled electronic energy band (valence) and lowest unfilled band (conduction) separated by the band gap.',
    content: `# Conduction Band and Valence Band

In condensed matter physics:
- **Valence Band (VB)**: The highest occupied electronic energy band consisting of electrons tightly bound in covalent or ionic bonds at absolute zero ($0\\text{ K}$).
- **Conduction Band (CB)**: The lowest unoccupied (or partially occupied) energy band where electrons have sufficient energy to move freely across the lattice under an external potential.
- **Energy Band Gap ($E_g$)**: The forbidden energy interval separating the top of the valence band ($E_v$) and the bottom of the conduction band ($E_c$):
  $$E_g = E_c - E_v$$

In nanoscale structures, the continuum of states inside both bands collapses into discrete quantized states, directly modulating the effective [[Energy Band Gap]].`,
    prerequisiteIds: [],
    relatedIds: ['energy-band-gap', 'size-dependent-behaviour-semiconductors', 'band-diagrams-p-n'],
    source: 'Unit 1 A Notes.pdf — Section 4.3: Band Theory',
  },
  {
    id: 'energy-band-gap',
    title: 'Energy Band Gap',
    folderId: '04-nanomaterials',
    category: 'Nanomaterials',
    topicType: 'property',
    description: 'Quantum confinement induces a blue shift and widening of the band gap as nanoparticle diameter drops below the Bohr radius.',
    content: `# Energy Band Gap in Nanomaterials

As the physical diameter of a semiconductor particle ($d = 2R$) shrinks below the **exciton Bohr radius** ($a_B$), the electronic bandgap expands according to the **Brus Equation**:

$$\\Delta E_g(R) = E_g(\\text{bulk}) + \\frac{\\hbar^2 \\pi^2}{2 m_0^* R^2} - \\frac{1.8 e^2}{4\\pi \\epsilon_0 \\epsilon_r R}$$

Where:
- $\\frac{1}{m_0^*} = \\frac{1}{m_e^*} + \\frac{1}{m_h^*}$ is the reduced effective mass of the electron-hole pair.
- The kinetic energy confinement term scales inversely with radius squared ($\\propto 1/R^2$).
- The Coulomb attraction term scales as $-1/R$.

Consequence: Smaller nanoparticles possess significantly **larger bandgaps**, causing a pronounced blue-shift in absorption and emission spectra (see [[Size-dependent Behaviour of Semiconductors]]).`,
    prerequisiteIds: ['conduction-valence-bands', 'size-dependent-properties'],
    relatedIds: ['size-dependent-behaviour-semiconductors', 'optical-properties-colour', 'electrical-properties-nano'],
    source: 'Unit 1 A Notes.pdf — Section 4.3: Band Gap Alterations',
  },
  {
    id: 'electrical-properties-nano',
    title: 'Electrical Properties of Nanomaterials',
    folderId: '04-nanomaterials',
    category: 'Nanomaterials',
    topicType: 'property',
    description: 'Quantized conductance, Coulomb blockade, and electron mean free path limitations in nanoscale conductors.',
    content: `# Electrical Properties of Nanomaterials

The electrical conductivity of nanomaterials deviates strongly from Ohm's Law and bulk classical Drude conductivity:

## Key Phenomena from Notes:
1. **Mean Free Path Limitation**: When particle or grain diameter is smaller than the electron mean free path ($\\approx 10-40\\text{ nm}$ in metals), boundary electron scattering drastically elevates electrical resistivity in thin films/nanowires.
2. **Quantized Conductance**: In 1D nanowires and quantum point contacts, conductance is quantized in integer steps of $G_0$:
   $$G_0 = \\frac{2e^2}{h} \\approx 77.48\\text{ }\\mu\\text{S}$$
3. **Coulomb Blockade**: In quantum dots, the electrostatic energy required to add a single electron ($E_C = e^2 / 2C$) surpasses thermal energy $k_B T$, allowing single-electron tunneling control.

Connected to: [[Energy Band Gap]] and [[Size-dependent Behaviour of Semiconductors]].`,
    prerequisiteIds: ['energy-band-gap'],
    relatedIds: ['size-dependent-properties', 'conduction-valence-bands'],
    source: 'Unit 1 A Notes.pdf — Section 4.4: Electrical Properties',
  },
  {
    id: 'size-dependent-behaviour-semiconductors',
    title: 'Size-dependent Behaviour of Semiconductors',
    folderId: '04-nanomaterials',
    category: 'Nanomaterials',
    topicType: 'property',
    description: 'Semiconductor quantum dots showing tunable light emission across the full spectrum simply by altering particle size.',
    content: `# Size-dependent Behaviour of Semiconductors

Semiconductors exhibit the most dramatically visible quantum confinement effects at the nanoscale.

## Quantum Dots (0D Semiconductors):
- Cadmium selenide ($CdSe$), Lead sulfide ($PbS$), and Zinc sulfide ($ZnS$).
- By solely tuning diameter from $2\\text{ nm}$ to $6\\text{ nm}$, the emission wavelength sweeps from blue to deep red:
  - $2\\text{ nm}$ particle $\\rightarrow$ Wide bandgap $\\rightarrow$ Emits Blue light.
  - $3.5\\text{ nm}$ particle $\\rightarrow$ Intermediate bandgap $\\rightarrow$ Emits Green light.
  - $6\\text{ nm}$ particle $\\rightarrow$ Smaller bandgap $\\rightarrow$ Emits Red light.

Directly links to [[Optical Properties and Colour]] and [[OLED Emissive Layer]].`,
    prerequisiteIds: ['energy-band-gap'],
    relatedIds: ['optical-properties-colour', 'oled-emissive-layer'],
    source: 'Unit 1 A Notes.pdf — Section 4.4: Semiconductor Quantum Size Effects',
  },
  {
    id: 'optical-properties-colour',
    title: 'Optical Properties and Colour',
    folderId: '04-nanomaterials',
    category: 'Nanomaterials',
    topicType: 'property',
    description: 'Surface Plasmon Resonance (SPR) and absorption shift causing size-dictated color in gold, silver, and quantum dots.',
    content: `# Optical Properties and Colour in Nanomaterials

In the bulk state, metals like gold ($Au$) appear shiny yellow, and silver ($Ag$) appears shiny grey. At the nanoscale, optical properties transform completely:

## Surface Plasmon Resonance (SPR):
- In metallic nanoparticles, the conduction electrons oscillate collectively in resonance with incident light electromagnetic waves.
- **Gold Nanoparticles ($Au$ NPs)**:
  - $20\\text{ nm}$ spherical particles $\\rightarrow$ Absorb green light, appear vibrant Ruby Red (used in Roman Lycurgus cup and stained glass windows).
  - $50-80\\text{ nm}$ particles $\\rightarrow$ Shift toward purple and violet.
  - Nanorods with high aspect ratio $\\rightarrow$ Absorb in near-infrared.
- **Silver Nanoparticles ($Ag$ NPs)**:
  - Exhibit intense yellowish to grey-blue plasmon absorption band around $400-420\\text{ nm}$.

Coupled to: [[Size-dependent Properties]] and [[Surface-area-to-volume Ratio]].`,
    prerequisiteIds: ['size-dependent-properties'],
    relatedIds: ['surface-area-to-volume', 'size-dependent-behaviour-semiconductors'],
    source: 'Unit 1 A Notes.pdf — Section 4.5: Optical Traits & Color',
  },
  {
    id: 'chemical-reactivity',
    title: 'Chemical Reactivity of Nanomaterials',
    folderId: '04-nanomaterials',
    category: 'Nanomaterials',
    topicType: 'property',
    description: 'Vastly accelerated reaction rates and catalytic activity due to exposed high-energy surface facets and uncoordinated atoms.',
    content: `# Chemical Reactivity of Nanomaterials

The chemical reactivity of nanomaterials is magnified by several orders of magnitude relative to their coarse-grained counterparts:

## Thermodynamic Origin:
1. **Dangling Bonds**: Surface atoms lack full neighbor coordination, leaving active unsatisfied valence bonds possessing high surface Gibbs free energy.
2. **Defects & Steps**: Nanoparticle surfaces feature high concentrations of edges, kinks, and atomic vacancies that serve as catalytic active sites.
3. Examples:
   - Bulk Gold is chemically inert and noble; nanoscale gold particles ($<5\\text{ nm}$) on oxide supports become extraordinarily active catalysts for low-temperature $CO$ oxidation ($2CO + O_2 \\rightarrow 2CO_2$).
   - Aluminum nanopowder oxidizes so rapidly that it is pyrophoric and used in solid rocket propellants.

Directly dictated by [[Surface-area-to-volume Ratio]].`,
    prerequisiteIds: ['surface-area-to-volume'],
    relatedIds: ['surface-area-to-volume', 'melting-point-depression'],
    source: 'Unit 1 A Notes.pdf — Section 4.5: Catalysis & Reactivity',
  },
  {
    id: 'surface-area-to-volume',
    title: 'Surface-area-to-volume Ratio',
    folderId: '04-nanomaterials',
    category: 'Nanomaterials',
    topicType: 'property',
    description: 'Geometrical scaling law where specific surface area is inversely proportional to particle radius (S/V = 3/r).',
    content: `# Surface-area-to-volume Ratio

The **surface-area-to-volume ratio ($S/V$)** is the fundamental geometric catalyst behind all surface-driven nanoscale phenomena.

## Mathematical Formulation:
For a spherical nanoparticle of radius $r$:
- Surface Area: $S = 4\\pi r^2$
- Volume: $V = \\frac{4}{3}\\pi r^3$
$$\\frac{S}{V} = \\frac{4\\pi r^2}{\\frac{4}{3}\\pi r^3} = \\frac{3}{r}$$

## Numerical Demonstration from Course Notes:
- Consider a solid cube of $1\\text{ cm}$ side length:
  - Volume = $1\\text{ cm}^3$, Surface Area = $6\\text{ cm}^2$.
- Subdividing that cube into $1\\text{ nm}$ nanocubes:
  - Total number of nanocubes = $10^{21}$.
  - Total combined Surface Area = $60,000,000\\text{ cm}^2 = 6,000\\text{ m}^2$ (roughly equivalent to a soccer field!).
- Percentage of surface atoms rises from $<0.1\\%$ in a $10\\text{ }\\mu\\text{m}$ particle to over **$50\\%$** in a $3\\text{ nm}$ particle.

Governs [[Chemical Reactivity]], [[Melting Point Depression]], and [[Wettability]].`,
    prerequisiteIds: ['nanotechnology-definition'],
    relatedIds: ['chemical-reactivity', 'melting-point-depression', 'wettability'],
    source: 'Unit 1 A Notes.pdf — Section 4.6: Geometric Scaling Laws',
  },
  {
    id: 'melting-point-depression',
    title: 'Melting Point Depression at Nanoscale',
    folderId: '04-nanomaterials',
    category: 'Nanomaterials',
    topicType: 'property',
    description: 'Dramatic lowering of solid melting temperature in nanoparticles due to excess surface free energy (Gibbs-Thomson effect).',
    content: `# Melting Point Depression at Nanoscale

In bulk thermodynamics, the melting point of a pure element is an invariant constant (e.g., Bulk Gold melts at $1064^\\circ\\text{C}$). At the nanoscale, **melting temperature drops drastically**.

## Gibbs-Thomson Effect:
Because a large percentage of atoms reside at the surface with reduced coordination number and lower cohesive energy, the thermal energy required to trigger surface pre-melting is diminished:

$$T_m(r) = T_{m,\\text{bulk}} \\left( 1 - \\frac{2\\gamma_{sl}}{\\rho_s L_f r} \\right)$$

Where:
- $\\gamma_{sl}$ = solid-liquid interfacial energy
- $\\rho_s$ = density of solid
- $L_f$ = latent heat of fusion
- $r$ = particle radius

## Experimental Example from Source:
- Bulk Gold ($Au$): $T_m = 1064^\\circ\\text{C}$.
- Gold nanoparticles of $d = 2.5\\text{ nm}$: Melts at $\\approx 300^\\circ\\text{C}$!
- Enables low-temperature sintering of conductive inks in flexible printed electronics without scorching plastic substrates.`,
    prerequisiteIds: ['surface-area-to-volume'],
    relatedIds: ['surface-area-to-volume', 'chemical-reactivity'],
    source: 'Unit 1 A Notes.pdf — Section 4.7: Thermodynamic Properties',
  },
  {
    id: 'wettability',
    title: 'Wettability and Nanostructured Surfaces',
    folderId: '04-nanomaterials',
    category: 'Nanomaterials',
    topicType: 'property',
    description: 'Control of surface liquid contact angle via nanoscale surface roughness mimicking the superhydrophobic Lotus Effect.',
    content: `# Wettability and Nanostructured Surfaces

**Wettability** describes the ability of a liquid to maintain contact with a solid substrate, quantified by the **equilibrium contact angle ($\\theta$)** at the triple phase boundary:
- $\\theta < 90^\\circ$: Hydrophilic (wetting).
- $\\theta > 90^\\circ$: Hydrophobic (non-wetting).
- $\\theta > 150^\\circ$: **Superhydrophobic** (roll-off water droplets).

## Cassie-Baxter & Wenzel Models on Nanotextures:
Nanoscale surface texturing traps pockets of air beneath water droplets, dramatically reducing liquid-solid contact area:
- **The Lotus Effect**: The sacred lotus (*Nelumbo nucifera*) leaf utilizes micro-papillae covered with nanoscale wax tubules to yield contact angles $> 160^\\circ$, enabling self-cleaning as rain droplets roll off carrying dirt particulates.
- Synthetic applications: Anti-fogging mirrors, anti-icing aircraft wings, stain-resistant fabrics, and drag-reduction coatings on marine vessels.

Connected to: [[Teflon]] and [[Surface-area-to-volume Ratio]].`,
    prerequisiteIds: ['surface-area-to-volume'],
    relatedIds: ['teflon', 'surface-area-to-volume'],
    source: 'Unit 1 A Notes.pdf — Section 4.8: Surface Wettability',
  },

  // ==========================================
  // FOLDER 05 — SYNTHESIS OF NANOMATERIALS
  // ==========================================
  {
    id: 'nanomaterial-synthesis-overview',
    title: 'Overview of Nanomaterial Synthesis',
    folderId: '05-synthesis-nanomaterials',
    category: 'Synthesis of Nanomaterials',
    topicType: 'definition',
    description: 'Fundamental division into Top-Down (physical mechanical breakdown) and Bottom-Up (atomic/molecular self-assembly) methodologies.',
    content: `# Overview of Nanomaterial Synthesis

Fabrication of nanostructured materials is universally classified into two complementary philosophical and technological methodologies:

## 1. [[Top-down Approach]]:
- Starts with bulk macroscopic precursor materials.
- Progressively breaks down, thins, carves, or etches material down to nanoscale dimensions.
- Characterized by physical and mechanical attrition techniques:
  - [[Ball Milling]]
  - [[Erosion, Etching, and Abrasion]]
  - [[Lithography]]

## 2. [[Bottom-up Approach]]:
- Starts at the atomic, molecular, or ionic level.
- Nucleates and self-assembles precursors into clusters and nanoparticles.
- Characterized by chemical and vapor deposition techniques:
  - [[Organometallic Chemical Routes]]
  - [[Cluster-beam Evaporation]]
  - [[Sol-gel Condensation]]
  - [[Colloidal Precipitation]]

Leads directly to [[Top-down Approach]] and [[Bottom-up Approach]].`,
    prerequisiteIds: ['nanomaterials-definition'],
    relatedIds: ['top-down-approach', 'bottom-up-approach'],
    source: 'Unit 1 A Notes.pdf — Section 5.1: Synthesis Methodologies',
  },
  {
    id: 'top-down-approach',
    title: 'Top-down Approach',
    folderId: '05-synthesis-nanomaterials',
    category: 'Synthesis of Nanomaterials',
    topicType: 'classification',
    description: 'Physical breakdown of bulk macro-scale materials into nanoscale fragments through mechanical forces or lithographic etching.',
    content: `# Top-down Approach

The **top-down approach** begins with macroscopic bulk solid materials and employs external physical energy (mechanical impact, electrical discharge, optical radiation, or chemical etching) to fragment, mill, or pattern the substance down into nanostructures.

## Advantages:
- Capable of large-tonnage industrial production (e.g. ball-milled nanocomposites).
- High macroscopic alignment and deterministic patterning on planar substrates.

## Disadvantages & Limitations:
- Wide particle size distributions and irregular particle morphology.
- Significant internal lattice strain, crystal defects, and dislocations.
- Inevitable contamination from milling media and chemicals.

Subdivided into:
- [[Ball Milling]]
- [[Erosion, Etching, and Abrasion]]
- [[Lithography]]`,
    prerequisiteIds: ['nanomaterial-synthesis-overview'],
    relatedIds: ['bottom-up-approach', 'ball-milling', 'erosion-etching-abrasion', 'lithography'],
    source: 'Unit 1 A Notes.pdf — Section 5.2: Top-Down Methods',
  },
  {
    id: 'ball-milling',
    title: 'Ball Milling (Mechanical Attrition)',
    folderId: '05-synthesis-nanomaterials',
    category: 'Synthesis of Nanomaterials',
    topicType: 'process',
    description: 'High-energy mechanical attrition where kinetic collisions of hardened balls pulverize powder into nanocrystalline grains.',
    content: `# Ball Milling (Mechanical Attrition)

**High-Energy Ball Milling** is a classical physical top-down method for producing nanocrystalline powders and metallic alloys.

## Working Mechanism:
1. Powder particles are placed in a hardened milling vial along with grinding balls (made of tungsten carbide, agate, or stainless steel).
2. The vial is rotated or vibrated at high angular velocity (planetary ball mill, vibratory shaker mill).
3. The powder charges are repeatedly subjected to intense kinetic collisions:
   - **Severe Plastic Deformation**: Dislocations pile up into dense shear bands.
   - **Fracture & Cold Welding**: Particle grains fragment continuously.
   - **Grain Refinement**: Grain boundaries evolve into nanometer-sized subgrains ($5-20\\text{ nm}$).

## Course Notes Remarks:
- Common route to prepare oxide precursors (see [[Preparation of BaTiO3]]).
- Limitations: Contamination from milling tools and structural defect generation.`,
    prerequisiteIds: ['top-down-approach'],
    relatedIds: ['erosion-etching-abrasion', 'batio3-prep'],
    source: 'Unit 1 A Notes.pdf — Section 5.2.1: Ball Milling',
  },
  {
    id: 'erosion-etching-abrasion',
    title: 'Erosion, Etching, and Abrasion',
    folderId: '05-synthesis-nanomaterials',
    category: 'Synthesis of Nanomaterials',
    topicType: 'process',
    description: 'Chemical dissolution and physical sputtering techniques to selectively strip material from bulk surfaces.',
    content: `# Erosion, Etching, and Abrasion

These top-down subtractive techniques rely on controlled surface atom removal:

## 1. Chemical Wet Etching
Immersing bulk material in reactive liquid etchants (e.g., $HF / HNO_3$ for silicon) where isotropic or anisotropic dissolution removes selective crystallographic planes, generating porous silicon nanostructures.

## 2. Dry Etching (Reactive Ion Etching / RIE)
High-energy reactive plasma ions (e.g., $CF_4$, $Cl_2$) bombard the substrate under radio-frequency electric fields, combining chemical reaction and physical sputtering to etch vertical nanoscale trenches.

## 3. Physical Sputtering & Abrasion
Bombardment by accelerated inert argon ($Ar^+$) ions physically displaces surface atoms via momentum transfer.

Used hand-in-hand with [[Lithography]].`,
    prerequisiteIds: ['top-down-approach'],
    relatedIds: ['lithography', 'ball-milling'],
    source: 'Unit 1 A Notes.pdf — Section 5.2.2: Etching & Abrasion',
  },
  {
    id: 'lithography',
    title: 'Lithography',
    folderId: '05-synthesis-nanomaterials',
    category: 'Synthesis of Nanomaterials',
    topicType: 'process',
    description: 'Patterning technology (Photolithography, E-beam lithography) projecting nanoscale geometric blueprints onto photoresist films.',
    content: `# Lithography

**Lithography** (from Greek *lithos* = stone, *graphein* = to write) is the cornerstone top-down fabrication process utilized throughout the semiconductor microprocessor industry.

## Key Lithographic Variants:
1. **Photolithography / Extreme UV (EUV)**:
   - Deep UV light (e.g., $\\lambda = 13.5\\text{ nm}$ EUV) passes through an optical photomask to expose light-sensitive photoresist polymer layers on silicon wafers.
2. **Electron Beam Lithography (EBL)**:
   - Directly rasters a focused beam of high-energy electrons with sub-nanometer spot size; overcomes diffraction limits, achieving resolution down to $< 5\\text{ nm}$.
3. **Nanoimprint Lithography (NIL)**:
   - Mechanically stamps a rigid relief nanostructured mold into a thermoplastic polymer resist.

Coupled with [[Erosion, Etching, and Abrasion]] to fabricate integrated circuits and OLED electrode grids.`,
    prerequisiteIds: ['top-down-approach'],
    relatedIds: ['erosion-etching-abrasion', 'oled-structure'],
    source: 'Unit 1 A Notes.pdf — Section 5.2.3: Lithography',
  },
  {
    id: 'bottom-up-approach',
    title: 'Bottom-up Approach',
    folderId: '05-synthesis-nanomaterials',
    category: 'Synthesis of Nanomaterials',
    topicType: 'classification',
    description: 'Building nanostructures from the ground up: atoms, ions, and molecules assembling via chemical and thermodynamic forces.',
    content: `# Bottom-up Approach

The **bottom-up approach** (also called molecular nanotechnology or self-assembly) starts from atomic or molecular precursors and orchestrates their aggregation and growth into defined nanoscale architectures.

## Distinct Advantages over Top-down:
- Exceptional control over chemical stoichiometry and atomic crystal perfection.
- Near-monodisperse particle size distributions and uniform shapes (spheres, rods, sheets).
- Minimal structural lattice defects and ultra-low mechanical strain.
- Energy efficient synthesis under mild temperature conditions.

Key methods covered in Unit 1 A:
- [[Organometallic Chemical Routes]]
- [[Cluster-beam Evaporation]]
- [[Sol-gel Condensation]]
- [[Colloidal Precipitation]]`,
    prerequisiteIds: ['nanomaterial-synthesis-overview'],
    relatedIds: ['top-down-approach', 'organometallic-routes', 'cluster-beam-evaporation', 'sol-gel-condensation', 'colloidal-precipitation'],
    source: 'Unit 1 A Notes.pdf — Section 5.3: Bottom-Up Methods',
  },
  {
    id: 'organometallic-routes',
    title: 'Organometallic Chemical Routes',
    folderId: '05-synthesis-nanomaterials',
    category: 'Synthesis of Nanomaterials',
    topicType: 'process',
    description: 'High-temperature thermal decomposition of organometallic precursors in non-coordinating coordinating coordinating solvents.',
    content: `# Organometallic Chemical Routes

In **organometallic synthesis** (such as the hot-injection technique), volatile organometallic complexes undergo controlled thermal decomposition in high-boiling coordinating solvents.

## Mechanism:
1. **Precursor Injection**: Rapid injection of metal alkyl or carbonyl precursors (e.g., dimethylcadmium $Cd(CH_3)_2$ or iron pentacarbonyl $Fe(CO)_5$) into a hot coordinating solvent containing surfactant ligands (e.g., trioctylphosphine oxide, TOPO) at $200-350^\\circ\\text{C}$.
2. **Nucleation Burst**: Sudden supersaturation triggers homogeneous nucleation over a split second.
3. **Controlled Growth & Passivation**: Lowering the temperature halts nucleation while remaining monomers contribute to steady, focused nanoparticle growth; organic ligands coordinate to particle surfaces, preventing agglomeration.

Produces high-purity semiconductor quantum dots (see [[Size-dependent Behaviour of Semiconductors]]).`,
    prerequisiteIds: ['bottom-up-approach'],
    relatedIds: ['colloidal-precipitation', 'size-dependent-behaviour-semiconductors'],
    source: 'Unit 1 A Notes.pdf — Section 5.3.1: Organometallic Routes',
  },
  {
    id: 'cluster-beam-evaporation',
    title: 'Cluster-beam Evaporation',
    folderId: '05-synthesis-nanomaterials',
    category: 'Synthesis of Nanomaterials',
    topicType: 'process',
    description: 'Laser ablation or thermal vaporization of target metal in inert carrier gas condensing into atomic clusters.',
    content: `# Cluster-beam Evaporation

**Cluster-beam evaporation** is a physical bottom-up vapor-phase technique for producing clean, size-selected atomic clusters and nanoparticles.

## Operating Principles:
1. **Vaporization**: A high-power pulsed laser beam or electric arc vaporizes the solid target material into an atomic vapor plume.
2. **Supersonic Expansion & Condensation**: A pulse of cold high-pressure inert carrier gas (Helium or Argon) sweeps the atomic vapor through a supersonic nozzle.
3. **Rapid Cooling**: Adiabatic expansion rapidly cools the gas, supersaturating the vapor and causing atoms to condense into small atomic clusters ($M_n$, where $n = 10 - 10^4$ atoms).
4. **Mass Filtering**: The cluster beam passes through a time-of-flight or quadrupole mass filter, allowing deposition of precisely size-selected nanoparticles onto substrates under ultra-high vacuum.`,
    prerequisiteIds: ['bottom-up-approach'],
    relatedIds: ['organometallic-routes', 'sol-gel-condensation'],
    source: 'Unit 1 A Notes.pdf — Section 5.3.2: Cluster Beam Synthesis',
  },
  {
    id: 'sol-gel-condensation',
    title: 'Sol-gel Condensation',
    folderId: '05-synthesis-nanomaterials',
    category: 'Synthesis of Nanomaterials',
    topicType: 'process',
    description: 'Wet-chemical transformation of a colloidal solution (sol) into an integrated 3D liquid-filled network (gel).',
    content: `# Sol-gel Condensation

The **Sol-Gel process** is a wet-chemical methodology widely applied to synthesize high-purity ceramic oxide nanomaterials, especially perovskite titanates.

## Step-by-Step Chemistry:
1. **Sol Formation**: Metal alkoxide precursors $M(OR)_n$ (e.g., Titanium isopropoxide $Ti(OiPr)_4$) are dissolved in alcohol.
2. **Hydrolysis**: Water hydrolyzes alkoxide ligands into reactive hydroxyl groups:
   $$M-OR + H_2O \\rightarrow M-OH + ROH$$
3. **Condensation (Polycondensation)**: Hydroxyl groups condense via water or alcohol elimination:
   - Water condensation: $M-OH + M-OH \\rightarrow M-O-M + H_2O$
   - Alcohol condensation: $M-OH + M-OR \\rightarrow M-O-M + ROH$
4. **Gelation**: Polycondensation forms a 3D interconnected solid skeleton entrapping liquid—the **Gel**.
5. **Drying & Calcination**:
   - Supercritical drying yields ultra-porous **Aerogels**.
   - Evaporative drying yields dense **Xerogels**.
   - Calcination yields nanocrystalline powders (e.g. [[Preparation of BaTiO3]]).`,
    prerequisiteIds: ['bottom-up-approach'],
    relatedIds: ['batio3-prep', 'perovskite-oxides', 'colloidal-precipitation'],
    source: 'Unit 1 A Notes.pdf — Section 5.3.3: Sol-Gel Method',
  },
  {
    id: 'colloidal-precipitation',
    title: 'Colloidal Precipitation',
    folderId: '05-synthesis-nanomaterials',
    category: 'Synthesis of Nanomaterials',
    topicType: 'process',
    description: 'Chemical precipitation of nanoparticles from liquid solution regulated by surfactants preventing coalescence.',
    content: `# Colloidal Precipitation

**Colloidal precipitation** is a liquid-phase synthesis wherein dissolved precursor salts are mixed with precipitants in the presence of capping agents to generate stable colloidal dispersions of nanoparticles.

## Controlling Nucleation vs Growth:
- **LaMer Model**:
  1. Monomer concentration increases until it exceeds the critical nucleation threshold ($C_{min}$).
  2. Rapid burst of homogeneous nucleation abruptly consumes monomers, dropping concentration below $C_{min}$.
  3. Subsequent slow diffusional growth occurs on existing nuclei without forming new ones, guaranteeing narrow particle size distribution.
- **Capping Agents / Surfactants**: Organic molecules (citrate, PVP, oleic acid) adsorb onto emerging nanoparticle facets, providing steric or electrostatic repulsion that prevents irreversible agglomeration and sedimentation.

Connected to: [[Size-dependent Properties]] and [[Bottom-up Approach]].`,
    prerequisiteIds: ['bottom-up-approach'],
    relatedIds: ['sol-gel-condensation', 'organometallic-routes'],
    source: 'Unit 1 A Notes.pdf — Section 5.3.4: Colloidal Synthesis',
  },

  // ==========================================
  // FOLDER 06 — OLEDS
  // ==========================================
  {
    id: 'oled-intro',
    title: 'Organic Light-Emitting Diodes (OLEDs)',
    folderId: '06-oleds',
    category: 'OLEDs',
    topicType: 'definition',
    description: 'Solid-state semiconductor devices where organic electroluminescent thin films emit light in response to an electric current.',
    content: `# Organic Light-Emitting Diodes (OLEDs)

An **Organic Light-Emitting Diode (OLED)** is a solid-state optoelectronic device comprising thin films of organic semiconducting materials sandwiched between two electrodes, at least one of which is optically transparent. When an electric potential is applied, holes and electrons are injected, migrate, and recombine to emit light (electroluminescence).

## Key Advantages over Conventional LEDs and LCDs:
- **Self-emissive**: Does not require a bulky backlight unit; displays achieve true infinite contrast ratio ($> 1,000,000 : 1$) and perfect pitch-black states.
- **Ultra-thin and lightweight**: Thickness can be $< 1\\text{ mm}$.
- **Mechanical Flexibility**: Can be deposited onto flexible plastic substrates, enabling foldable smartphones and rollable displays.
- **Wide Viewing Angle**: $> 170^\\circ$ without color shift or contrast degradation.

Core architectural components:
- [[OLED Structure]]
- [[OLED Working Principle]]
- [[OLED Properties]]
- [[Applications of OLEDs]]`,
    prerequisiteIds: ['conducting-polymers-intro'],
    relatedIds: ['oled-structure', 'oled-working-principle', 'oled-properties', 'oled-applications'],
    source: 'Unit 1 A Notes.pdf — Section 6.1: Intro to OLEDs',
  },
  {
    id: 'oled-structure',
    title: 'OLED Structure and Layers',
    folderId: '06-oleds',
    category: 'OLEDs',
    topicType: 'structure',
    description: 'Multi-layer architecture: Glass Substrate, Anode (ITO), Conductive/Hole Transport Layer, Emissive Layer, and Cathode.',
    content: `# OLED Structure and Layers

According to the schematic layer diagram in the course notes, an efficient OLED is structured as a multi-layer thin-film stack:

\`\`\`
[ Metallic Cathode (Al / Mg:Ag / Ca) ]    <-- Injects Electrons
[ Electron Transport Layer (ETL)     ]
[ Emissive Layer (EML)               ]    <-- Exciton Recombination & Light Emission
[ Conductive / Hole Transport (HTL)  ]    <-- Injects & Transports Holes (PEDOT:PSS)
[ Transparent Anode (ITO)            ]    <-- High work function, extracts holes
[ Glass or Flexible Polymer Substrate]
\`\`\`

## Layer Breakdown:
1. **[[Anode and Cathode in OLEDs]]**: Indium Tin Oxide transparent anode and low-work-function metal cathode.
2. **[[OLED Conductive Layer]] (Hole Transport Layer / HTL)**: Facilitates hole transit from anode to emissive interface.
3. **[[OLED Emissive Layer]] (EML)**: Contains organic dye or conjugated polymer where photons are generated.

Governs the [[OLED Working Principle]].`,
    prerequisiteIds: ['oled-intro'],
    relatedIds: ['anode-cathode', 'oled-conductive-layer', 'oled-emissive-layer', 'oled-working-principle'],
    source: 'Unit 1 A Notes.pdf — Section 6.2: Structural Layers',
  },
  {
    id: 'anode-cathode',
    title: 'Anode and Cathode in OLEDs',
    folderId: '06-oleds',
    category: 'OLEDs',
    topicType: 'structure',
    description: 'Indium Tin Oxide (ITO) high work-function transparent anode and low work-function metallic cathode (Al, Ca, Mg).',
    content: `# Anode and Cathode in OLEDs

The electrical electrodes in an OLED must satisfy strict electronic band alignment and optical transmission conditions:

## 1. Transparent Anode:
- **Material**: Indium Tin Oxide ($ITO$, typically $In_2O_3 : SnO_2$).
- **Function**: Injects positive charge carriers (holes) into the organic stack.
- **Key Parameters**:
  - High work function ($\\Phi \\approx 4.7 - 5.0\\text{ eV}$), providing favorable alignment with HOMO levels of organic transport molecules.
  - High optical transmission ($> 85-90\\%$ in the visible spectrum).
  - Low sheet resistance ($10-20\\text{ }\\Omega/\\text{sq}$).

## 2. Metallic Cathode:
- **Material**: Low work function metals like Aluminum ($Al$, $\\Phi \\approx 4.3\\text{ eV}$), Calcium ($Ca$, $\\Phi \\approx 2.9\\text{ eV}$), or Magnesium-Silver alloy ($Mg:Ag$).
- **Function**: Injects electrons into the organic stack LUMO levels.
- An ultrathin buffer layer of Lithium Fluoride ($LiF$, $\\approx 1\\text{ nm}$) is frequently inserted to lower the effective barrier for electron injection.

Connects to: [[OLED Structure]] and [[OLED Working Principle]].`,
    prerequisiteIds: ['oled-structure'],
    relatedIds: ['oled-conductive-layer', 'oled-emissive-layer'],
    source: 'Unit 1 A Notes.pdf — Section 6.2: Electrode Specifications',
  },
  {
    id: 'oled-conductive-layer',
    title: 'OLED Conductive Layer (Hole Transport)',
    folderId: '06-oleds',
    category: 'OLEDs',
    topicType: 'material',
    description: 'Hole-transporting organic film made of aromatic amines or conducting polymers (e.g. PEDOT:PSS) mediating charge transit.',
    content: `# OLED Conductive Layer (Hole Transport Layer)

The **conductive layer** (or Hole Injection/Transport Layer, HIL/HTL) sits directly between the transparent ITO anode and the emissive layer.

## Function in the Device:
- Acts as an energetic bridge reducing the barrier for hole injection from the ITO anode.
- Efficiently transports positive holes toward the emissive layer while blocking electrons from leaking toward the anode.

## Materials from Notes:
- **Polymeric conducting systems**: [[Conjugated Polymers Examples]] like **PEDOT:PSS** (Poly(3,4-ethylenedioxythiophene) poly(styrenesulfonate)).
- **Small molecules**: TPD ($N,N'$-diphenyl-$N,N'$-bis(3-methylphenyl)-$1,1'$-biphenyl-$4,4'$-diamine) or NPB.

Direct connection to [[Introduction to Conducting Polymers]].`,
    prerequisiteIds: ['oled-structure', 'conducting-polymers-intro'],
    relatedIds: ['conducting-polymers-intro', 'conjugated-polymers-examples', 'oled-emissive-layer'],
    source: 'Unit 1 A Notes.pdf — Section 6.2: Transport Layers',
  },
  {
    id: 'oled-emissive-layer',
    title: 'OLED Emissive Layer (EML)',
    folderId: '06-oleds',
    category: 'OLEDs',
    topicType: 'material',
    description: 'Organic electroluminescent core where injected electrons and holes recombine radiatively to emit photons.',
    content: `# OLED Emissive Layer (EML)

The **emissive layer** is the functional core of the OLED where electrical energy is directly converted into light.

## Electroluminescent Process:
1. Injected electrons (from cathode/ETL) and holes (from anode/HTL) meet inside the emissive host matrix.
2. Coulombic attraction binds an electron-hole pair into a localized neutral quasi-particle called an **exciton**.
3. **Radiative Decay**: The exciton relaxes from its excited state to the ground state, emitting a photon with energy:
   $$E = h\\nu = \\frac{hc}{\\lambda} \\approx E_g(\\text{EML})$$

## Emission Color Control:
The emission color is dictated by the HOMO-LUMO bandgap of the organic emitter:
- Green: $Alq_3$ (Tris(8-hydroxyquinolinato)aluminium)
- Red and Blue: Phosphorescent organometallic complexes (Iridium $Ir(ppy)_3$ or Platinum $Pt$ chelates) utilizing singlet and triplet harvesting to achieve theoretical $100\\%$ internal quantum efficiency.

Detailed in: [[OLED Working Principle]].`,
    prerequisiteIds: ['oled-structure'],
    relatedIds: ['oled-working-principle', 'oled-properties', 'size-dependent-behaviour-semiconductors'],
    source: 'Unit 1 A Notes.pdf — Section 6.2: Emissive Layer Dynamics',
  },
  {
    id: 'oled-working-principle',
    title: 'OLED Working Principle',
    folderId: '06-oleds',
    category: 'OLEDs',
    topicType: 'process',
    description: 'Four-stage operational sequence: charge injection, transport, exciton formation, and radiative recombination.',
    content: `# OLED Working Principle

When an external DC forward voltage bias (typically $3-8\\text{ V}$) is applied across the OLED terminals:

## The 4 Sequential Steps Documented in Syllabus:
1. **Charge Injection**:
   - The positive terminal (Anode) injects holes into the conductive layer.
   - The negative terminal (Cathode) injects electrons into the electron transport layer.
2. **Charge Transport**:
   - Under the applied electric field ($E \\approx 10^5 - 10^6\\text{ V/cm}$), holes migrate across the HTL, and electrons hop across the ETL toward the internal junction.
3. **Exciton Formation**:
   - Opposite charges capture each other in the emissive layer to form neutral excitons (electron-hole bound states).
4. **Radiative Recombination & Light Emission**:
   - Excitons decay radiatively, releasing photon energy corresponding to the energy bandgap:
     $$h\\nu = E_g$$
   - Light exits through the transparent ITO anode and glass substrate.

See: [[OLED Properties]] and [[Applications of OLEDs]].`,
    prerequisiteIds: ['oled-structure', 'anode-cathode', 'oled-conductive-layer', 'oled-emissive-layer'],
    relatedIds: ['oled-properties', 'oled-applications'],
    source: 'Unit 1 A Notes.pdf — Section 6.3: Working Mechanism',
  },
  {
    id: 'oled-properties',
    title: 'Properties of OLEDs',
    folderId: '06-oleds',
    category: 'OLEDs',
    topicType: 'property',
    description: 'High contrast ratio, wide viewing angles, millisecond response times, low power consumption, and mechanical flexibility.',
    content: `# Properties of OLEDs

## Key Performance Characteristics from Syllabus:
1. **Infinite Contrast Ratio**: Black pixels are completely powered off ($0\\text{ cd/m}^2$), eliminating light leakage seen in liquid crystal panels.
2. **Broad Viewing Angles**: Uniform color and luminance across $> 170^\\circ$.
3. **Ultrafast Response Times**: Sub-microsecond response speeds ($< 0.01\\text{ ms}$), virtually eliminating motion blur in high-frame-rate video.
4. **Energy Efficiency**: Consumes power only for illuminated pixels, saving energy on dark interfaces.
5. **Flexibility and Thin Profile**: No backlight required, allowing bendable, rollable, and transparent form factors.

Connects to: [[Applications of OLEDs]].`,
    prerequisiteIds: ['oled-working-principle'],
    relatedIds: ['oled-applications'],
    source: 'Unit 1 A Notes.pdf — Section 6.4: Properties',
  },
  {
    id: 'oled-applications',
    title: 'Applications of OLEDs',
    folderId: '06-oleds',
    category: 'OLEDs',
    topicType: 'application',
    description: 'Consumer electronics displays, smartphones, automotive dashboards, solid-state lighting, and wearable screens.',
    content: `# Applications of OLEDs

OLED technology has revolutionized the consumer display and lighting landscape:

## Primary Applications Listed in Syllabus:
1. **Smartphone and Smartwatch Displays**:
   - High-resolution, daylight-readable, flexible AMOLED panels.
2. **Television and Monitor Screens**:
   - Large-format cinematic screens with true-black depth and HDR capability.
3. **Wearable and Foldable Consumer Devices**:
   - Rollable TVs, foldable phones, and smart clothing sensors.
4. **Automotive Lighting and Instrument Clusters**:
   - Thin, customizable rear tail lights and curved digital cockpit displays.
5. **Architectural Solid-State Lighting**:
   - Diffuse, glare-free, cool-to-touch surface-emitting ceiling and wall light panels.`,
    prerequisiteIds: ['oled-properties'],
    relatedIds: ['oled-intro', 'oled-properties'],
    source: 'Unit 1 A Notes.pdf — Section 6.5: Applications',
  },
];

export const INITIAL_EDGES: RelationshipEdge[] = [
  // ==========================================
  // OXIDES RELATIONSHIPS
  // ==========================================
  { id: 'e-ox-ab', source: 'oxides-definition', target: 'ab-oxides', type: 'part_of', label: 'Classification' },
  { id: 'e-ox-ab2', source: 'oxides-definition', target: 'ab2-oxides', type: 'part_of', label: 'Classification' },
  { id: 'e-ox-abo3', source: 'oxides-definition', target: 'abo3-oxides', type: 'part_of', label: 'Classification' },
  { id: 'e-abo3-perov', source: 'abo3-oxides', target: 'perovskite-oxides', type: 'part_of', label: 'Crystallographic subset' },
  { id: 'e-perov-ba', source: 'perovskite-oxides', target: 'batio3-prep', type: 'preparation_of', label: 'Example synthesis' },
  { id: 'e-perov-ca', source: 'perovskite-oxides', target: 'catio3-prep', type: 'preparation_of', label: 'Example synthesis' },
  { id: 'e-ab2-ba', source: 'ab2-oxides', target: 'batio3-prep', type: 'preparation_of', label: 'Precursor (TiO2)' },
  { id: 'e-ab2-ca', source: 'ab2-oxides', target: 'catio3-prep', type: 'preparation_of', label: 'Precursor (TiO2)' },
  { id: 'e-ba-ferro', source: 'batio3-prep', target: 'ferroelectricity', type: 'application_of', label: 'Exhibits property' },
  { id: 'e-perov-ferro', source: 'perovskite-oxides', target: 'ferroelectricity', type: 'part_of', label: 'Intrinsic property' },
  { id: 'e-ferro-piezo', source: 'ferroelectricity', target: 'piezoelectricity', type: 'prerequisite', label: 'Prerequisite condition' },
  { id: 'e-ferro-dielec', source: 'ferroelectricity', target: 'high-dielectric-constant', type: 'related', label: 'Dielectric polarization' },
  { id: 'e-ferro-electro', source: 'ferroelectricity', target: 'electrocaloric-behaviour', type: 'related', label: 'Field-induced entropy' },
  { id: 'e-dielec-electro', source: 'high-dielectric-constant', target: 'electrocaloric-behaviour', type: 'related', label: 'Dipolar response' },

  // ==========================================
  // POLYMERS RELATIONSHIPS
  // ==========================================
  { id: 'e-poly-thermop', source: 'polymers-definition', target: 'thermoplastics', type: 'part_of', label: 'Classification' },
  { id: 'e-poly-thermos', source: 'polymers-definition', target: 'thermosetting', type: 'part_of', label: 'Classification' },
  { id: 'e-thermop-teflon', source: 'thermoplastics', target: 'teflon', type: 'part_of', label: 'Specific polymer' },
  { id: 'e-thermos-novo', source: 'thermosetting', target: 'novolac-formation', type: 'prerequisite', label: 'Prepolymer formation' },
  { id: 'e-novo-bake', source: 'novolac-formation', target: 'bakelite-formation', type: 'preparation_of', label: 'Cross-linking synthesis' },
  { id: 'e-bake-app', source: 'bakelite-formation', target: 'bakelite-applications', type: 'application_of', label: 'Industrial uses' },
  { id: 'e-thermos-bake', source: 'thermosetting', target: 'bakelite-formation', type: 'part_of', label: 'Archetypal thermoset' },

  // ==========================================
  // CONDUCTING POLYMERS RELATIONSHIPS
  // ==========================================
  { id: 'e-poly-cp', source: 'polymers-definition', target: 'conducting-polymers-intro', type: 'related', label: 'Conjugated branch' },
  { id: 'e-conj-cp', source: 'conjugated-pi-systems', target: 'conducting-polymers-intro', type: 'prerequisite', label: 'Prerequisite requirement' },
  { id: 'e-cp-icp', source: 'conducting-polymers-intro', target: 'intrinsic-conducting-polymers', type: 'part_of', label: 'Category' },
  { id: 'e-icp-dcp', source: 'intrinsic-conducting-polymers', target: 'doped-conducting-polymers', type: 'preparation_of', label: 'Doping process' },
  { id: 'e-cp-examples', source: 'conducting-polymers-intro', target: 'conjugated-polymers-examples', type: 'part_of', label: 'Representative systems' },
  { id: 'e-dcp-pdoping', source: 'doped-conducting-polymers', target: 'p-doping-oxidative', type: 'part_of', label: 'Oxidative mechanism' },
  { id: 'e-dcp-ndoping', source: 'doped-conducting-polymers', target: 'n-doping-reductive', type: 'part_of', label: 'Reductive mechanism' },
  { id: 'e-pdoping-charge', source: 'p-doping-oxidative', target: 'charge-behaviour-polymer', type: 'related', label: 'Polaron formation' },
  { id: 'e-ndoping-charge', source: 'n-doping-reductive', target: 'charge-behaviour-polymer', type: 'related', label: 'Polaron formation' },
  { id: 'e-charge-props', source: 'charge-behaviour-polymer', target: 'conducting-polymers-properties', type: 'related', label: 'Governs conduction' },
  { id: 'e-cp-props', source: 'conducting-polymers-intro', target: 'conducting-polymers-properties', type: 'part_of', label: 'Properties' },
  { id: 'e-props-apps', source: 'conducting-polymers-properties', target: 'conducting-polymers-applications', type: 'application_of', label: 'Practical uses' },
  { id: 'e-band-cp', source: 'band-diagrams-p-n', target: 'charge-behaviour-polymer', type: 'related', label: 'Energy model' },

  // ==========================================
  // NANOTECHNOLOGY AND NANOMATERIALS RELATIONSHIPS
  // ==========================================
  { id: 'e-nano-nanomat', source: 'nanotechnology-definition', target: 'nanomaterials-definition', type: 'prerequisite', label: 'Material manifestation' },
  { id: 'e-nanomat-sizedep', source: 'nanomaterials-definition', target: 'size-dependent-properties', type: 'part_of', label: 'Governing phenomenon' },
  { id: 'e-sizedep-sv', source: 'size-dependent-properties', target: 'surface-area-to-volume', type: 'prerequisite', label: 'Primary geometric cause' },
  { id: 'e-sv-react', source: 'surface-area-to-volume', target: 'chemical-reactivity', type: 'related', label: 'Drives surface reaction' },
  { id: 'e-sv-melt', source: 'surface-area-to-volume', target: 'melting-point-depression', type: 'related', label: 'Gibbs-Thomson depression' },
  { id: 'e-sv-wet', source: 'surface-area-to-volume', target: 'wettability', type: 'related', label: 'Nanotexture effect' },
  { id: 'e-bands-gap', source: 'conduction-valence-bands', target: 'energy-band-gap', type: 'prerequisite', label: 'Band theory base' },
  { id: 'e-sizedep-gap', source: 'size-dependent-properties', target: 'energy-band-gap', type: 'related', label: 'Quantum confinement' },
  { id: 'e-gap-semicond', source: 'energy-band-gap', target: 'size-dependent-behaviour-semiconductors', type: 'related', label: 'Blue shift' },
  { id: 'e-semicond-opt', source: 'size-dependent-behaviour-semiconductors', target: 'optical-properties-colour', type: 'related', label: 'Size-tunable emission' },
  { id: 'e-sizedep-elec', source: 'size-dependent-properties', target: 'electrical-properties-nano', type: 'part_of', label: 'Quantized transport' },

  // ==========================================
  // SYNTHESIS OF NANOMATERIALS RELATIONSHIPS
  // ==========================================
  { id: 'e-nanomat-synth', source: 'nanomaterials-definition', target: 'nanomaterial-synthesis-overview', type: 'related', label: 'Fabrication routes' },
  { id: 'e-synth-top', source: 'nanomaterial-synthesis-overview', target: 'top-down-approach', type: 'part_of', label: 'Methodology' },
  { id: 'e-synth-bot', source: 'nanomaterial-synthesis-overview', target: 'bottom-up-approach', type: 'part_of', label: 'Methodology' },
  { id: 'e-top-ball', source: 'top-down-approach', target: 'ball-milling', type: 'part_of', label: 'Mechanical route' },
  { id: 'e-top-etch', source: 'top-down-approach', target: 'erosion-etching-abrasion', type: 'part_of', label: 'Subtractive route' },
  { id: 'e-top-litho', source: 'top-down-approach', target: 'lithography', type: 'part_of', label: 'Patterning route' },
  { id: 'e-bot-organo', source: 'bottom-up-approach', target: 'organometallic-routes', type: 'part_of', label: 'Chemical route' },
  { id: 'e-bot-cluster', source: 'bottom-up-approach', target: 'cluster-beam-evaporation', type: 'part_of', label: 'Vapor route' },
  { id: 'e-bot-solgel', source: 'bottom-up-approach', target: 'sol-gel-condensation', type: 'part_of', label: 'Wet-chemical route' },
  { id: 'e-bot-colloid', source: 'bottom-up-approach', target: 'colloidal-precipitation', type: 'part_of', label: 'Solution route' },

  // ==========================================
  // OLEDS RELATIONSHIPS
  // ==========================================
  { id: 'e-oled-struct', source: 'oled-intro', target: 'oled-structure', type: 'part_of', label: 'Device architecture' },
  { id: 'e-struct-elec', source: 'oled-structure', target: 'anode-cathode', type: 'part_of', label: 'Electrodes' },
  { id: 'e-struct-cond', source: 'oled-structure', target: 'oled-conductive-layer', type: 'part_of', label: 'HTL Layer' },
  { id: 'e-struct-emiss', source: 'oled-structure', target: 'oled-emissive-layer', type: 'part_of', label: 'EML Layer' },
  { id: 'e-oled-work', source: 'oled-intro', target: 'oled-working-principle', type: 'part_of', label: 'Operating physics' },
  { id: 'e-struct-work', source: 'oled-structure', target: 'oled-working-principle', type: 'prerequisite', label: 'Layer interaction' },
  { id: 'e-work-props', source: 'oled-working-principle', target: 'oled-properties', type: 'related', label: 'Performance determinants' },
  { id: 'e-props-oledapps', source: 'oled-properties', target: 'oled-applications', type: 'application_of', label: 'Display & lighting' },

  // ==========================================
  // CROSS-FOLDER CONCEPTUAL CONNECTIONS
  // ==========================================
  { id: 'e-cross-cp-oled', source: 'conjugated-polymers-examples', target: 'oled-conductive-layer', type: 'application_of', label: 'PEDOT:PSS in HTL' },
  { id: 'e-cross-solgel-ba', source: 'sol-gel-condensation', target: 'batio3-prep', type: 'preparation_of', label: 'Wet synthesis of BaTiO3' },
  { id: 'e-cross-teflon-wet', source: 'teflon', target: 'wettability', type: 'related', label: 'Superhydrophobic comparison' },
  { id: 'e-cross-quantum-emiss', source: 'size-dependent-behaviour-semiconductors', target: 'oled-emissive-layer', type: 'related', label: 'Quantum dot emitters' },
  { id: 'e-cross-ball-ba', source: 'ball-milling', target: 'batio3-prep', type: 'preparation_of', label: 'Solid-state powder mixing' },
  { id: 'e-cross-bands-pndia', source: 'conduction-valence-bands', target: 'band-diagrams-p-n', type: 'related', label: 'Band theory alignment' }
];
