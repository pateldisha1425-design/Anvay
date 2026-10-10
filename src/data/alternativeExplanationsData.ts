import { AlternativeExplanation, ExplanationMode } from '../types/learning';
import { TopicNode } from '../types/knowledge';

export const TOPIC_ALTERNATIVE_EXPLANATIONS: Record<string, Record<ExplanationMode, AlternativeExplanation>> = {
  // ==========================================
  // 01 OXIDES: PEROVSKITES & FERROELECTRICS
  // ==========================================
  'perovskite-oxides': {
    standard: {
      mode: 'standard',
      modeLabel: 'Standard Academic',
      title: 'Perovskite Crystallography & Polarization',
      subtitle: 'Course notes textbook explanation',
      content: 'Perovskites are ternary oxides ($ABO_3$) characterized by corner-sharing $BO_6$ octahedra surrounding a large 12-coordinate $A$ cation. Spontaneous polarization arises from non-centrosymmetric displacement of the central transition metal $B$ cation below the Curie transition temperature.',
      keyInsight: 'Corner-sharing BO6 octahedral framework allows reversible off-center cation displacement.',
      cognitiveAnchor: 'Corner-sharing cage with a rattling central transition metal ion.'
    },
    intuitive: {
      mode: 'intuitive',
      modeLabel: '💡 Intuitive Analogy',
      title: 'The "Wobbly Cage & Off-Center Marble" Analogy',
      subtitle: 'Mental model for understanding perovskite polarization',
      content: `Imagine an open architectural cube made of sturdy corner scaffolding:
- At the eight corners sits a large sphere (**A cation**, e.g., $Ba^{2+}$).
- In the exact center of every face sits an oxygen ion ($O^{2-}$), forming a hollow 3D diamond/octahedron cage.
- Inside that cage sits a small, highly charged metal ion (**B cation**, e.g., $Ti^{4+}$).

### Why does it polarize?
When the temperature is high (> $120^\\circ\\text{C}$), thermal vibration makes the central titanium marble bounce equally in all directions — on average, it stays dead center (symmetric, no dipole).

**Below $120^\\circ\\text{C}$ (Curie point):**
The cage shrinks slightly. The titanium ion is too small to stay happily in the exact center without feeling strong repulsive and attractive electronic forces. It "chooses" to drop into an off-center ditch towards one of the oxygen atoms by just $0.05\\text{ \\AA}$ ($0.005\\text{ nm}$).

Because the titanium ion has a strong $+4$ charge, nudging it off-center creates a permanent separation of positive and negative charges — **a spontaneous electric dipole**! When you apply an external electric voltage, you force that marble to snap to the opposite ditch — that is why it is reversible and ferroelectric!`,
      keyInsight: 'The Ti4+ ion is slightly too small for its octahedral cage at low temperatures, so it falls off-center, creating a permanent dipole.',
      cognitiveAnchor: 'A marble trapped in a double-well bowl snapping between two stable states.'
    },
    rigorous: {
      mode: 'rigorous',
      modeLabel: '📐 First-Principles & Equations',
      title: 'Goldschmidt Tolerance Factor & Soft Phonon Mode',
      subtitle: 'Thermodynamics and Landau phenomenological theory',
      content: `### 1. Geometric Tolerance Factor Derivation
In an ideal hard-sphere cubic perovskite ($Pm\\bar{3}m$), the unit cell parameter $a$ satisfies:
$$a = 2(r_B + r_O) = \\sqrt{2}(r_A + r_O)$$

Equating these gives the **Goldschmidt Tolerance Factor ($t$)**:
$$t = \\frac{r_A + r_O}{\\sqrt{2}(r_B + r_O)}$$

- **$t = 1.00$**: Ideal close packing (e.g. cubic $SrTiO_3$).
- **$t > 1.00$** (e.g. $BaTiO_3$, $t \\approx 1.06$): The $A$ site ($Ba^{2+}$, $r_A = 1.61\\text{ \\AA}$) expands the unit cell, leaving the $Ti^{4+}$ ($r_B = 0.605\\text{ \\AA}$) in an oversized octahedral cavity. This drives hybridization between $Ti\\text{ }3d$ and $O\\text{ }2p$ orbitals (Jahn-Teller-like second-order instability), lowering symmetry to tetragonal ($P4mm$).
- **$t < 0.96$** (e.g. $CaTiO_3$, $t \\approx 0.96$): The $A$ cation is too small, forcing the $TiO_6$ octahedra to tilt cooperatively (Glazer tilting notation $a^-a^-c^+$) to reduce coordination volume, yielding an orthorhombic lattice ($Pbnm$).

### 2. Landau-Devonshire Free Energy
The thermodynamic potential $\\Delta G$ as a function of polarization $P$:
$$\\Delta G = \\frac{1}{2} \\alpha_0 (T - T_0) P^2 + \\frac{1}{4} \\beta P^4 + \\frac{1}{6} \\gamma P^6 - E P$$
When $\\beta < 0$ and $\\gamma > 0$, the system undergoes a **first-order ferroelectric transition** at $T_c > T_0$.`,
      keyInsight: 'Hybridization between Ti 3d and O 2p states overcomes short-range Born repulsive forces below the Curie temperature.',
      cognitiveAnchor: 'Tolerance factor t > 1 creates second-order Jahn-Teller distortion.'
    },
    mechanism: {
      mode: 'mechanism',
      modeLabel: '⚙️ Physical Mechanism',
      title: 'Temperature-Dependent Phase Sequence & Domain Switching',
      subtitle: 'Step-by-step crystallographic transformation mechanism',
      content: `### The 4-Stage Thermal Phase Sequence in $BaTiO_3$:
1. **$T > 120^\\circ\\text{C}$ (Paraelectric Cubic, $Pm\\bar{3}m$):**
   - Ti sits symmetrically at $(0.5, 0.5, 0.5)$. No spontaneous dipole. $\\epsilon_r$ follows Curie-Weiss law: $\\epsilon_r = C / (T - T_0)$.
2. **$120^\\circ\\text{C} \\rightarrow 5^\\circ\\text{C}$ (Ferroelectric Tetragonal, $P4mm$):**
   - Elongation along the $[001]$ c-axis ($c/a \\approx 1.01$). $Ti^{4+}$ displaces $+0.05\\text{ \\AA}$ along $[001]$. Spontaneous polarization $P_s \\approx 26\\text{ }\\mu\\text{C/cm}^2$.
3. **$5^\\circ\\text{C} \\rightarrow -90^\\circ\\text{C}$ (Orthorhombic, $Amm2$):**
   - Polarization shifts along face diagonals $[110]$.
4. **$T < -90^\\circ\\text{C}$ (Rhombohedral, $R3m$):**
   - Polarization shifts along body diagonals $[111]$.

### Domain Reorientation Under Applied Electric Field ($E$):
- **Unpoled state**: Polycrystalline ceramic contains random $90^\\circ$ and $180^\\circ$ ferroelectric domains; net macroscopic polarization is zero.
- **Electric poling ($E > E_c$)**: Domain walls nucleate and sweep across grains until dipoles align with the external field, yielding high remanent polarization ($P_r$).`,
      keyInsight: 'Domain wall motion across grain boundaries allows polycrystalline ceramics to be permanently poled into macroscopic piezoelectrics.',
      cognitiveAnchor: 'Cubic -> Tetragonal -> Orthorhombic -> Rhombohedral cascade.'
    },
    exam_viva: {
      mode: 'exam_viva',
      modeLabel: '📝 Exam & Viva Cheat Sheet',
      title: 'High-Yield Exam Traps, Formulas & Viva Q&A',
      subtitle: 'Guaranteed exam questions and precise answer phrasing',
      content: `### Top 3 Exam Questions & Model Answers:
**Q1: Why is $BaTiO_3$ ferroelectric at room temperature, but $CaTiO_3$ is not?**
> *Model Answer*: Barium ($Ba^{2+}$, $r = 1.35\\text{ \\AA}$) gives a Goldschmidt tolerance factor $t > 1.0$ ($t \\approx 1.06$), creating an oversized $O_6$ cage that lets $Ti^{4+}$ shift off-center into a polar tetragonal phase ($P4mm$). Calcium ($Ca^{2+}$, $r = 1.00\\text{ \\AA}$) gives $t < 1.0$ ($t \\approx 0.96$), which relieves stress through **cooperative octahedral tilting** without generating a polar off-center dipole, remaining centrosymmetric orthorhombic ($Pbnm$).

**Q2: What is the relationship between piezoelectricity and ferroelectricity?**
> *Model Answer*: All ferroelectric materials are piezoelectric, but not all piezoelectric materials are ferroelectric (e.g. Quartz is piezoelectric but not ferroelectric). Ferroelectricity requires that the polar state can be reversed by an electric field ($E$).

### Common Pitfalls to Avoid:
- ❌ **Do not say**: "Perovskite is a single chemical compound." Perovskite is a **crystal structure family** ($ABO_3$) named after the mineral $CaTiO_3$.
- ❌ **Do not forget**: Curie temperature $T_c = 120^\\circ\\text{C}$ for $BaTiO_3$. Above $120^\\circ\\text{C}$, it is cubic and paraelectric!`,
      keyInsight: 'Remember: t > 1 = polar off-center shift (BaTiO3); t < 1 = octahedral tilting (CaTiO3).',
      cognitiveAnchor: 'Tc = 120°C; All ferroelectrics are piezoelectrics, but not vice-versa.'
    }
  },

  // ==========================================
  // 02 POLYMERS: NOVOLAC & BAKELITE
  // ==========================================
  'bakelite-formation': {
    standard: {
      mode: 'standard',
      modeLabel: 'Standard Academic',
      title: 'Cross-Linking of Novolac into Bakelite Resin',
      subtitle: 'Syllabus course note formulation',
      content: 'Bakelite is a 3D cross-linked thermosetting phenol-formaldehyde resin produced by heating linear Novolac prepolymer with a methylene donor such as hexamethylenetetramine (HMTA) under heat and pressure.',
      keyInsight: 'HMTA acts as a formal methylene cross-linker turning linear prepolymers into an infusible 3D network.',
      cognitiveAnchor: 'Phenol + Formaldehyde condensation cured with HMTA.'
    },
    intuitive: {
      mode: 'intuitive',
      modeLabel: '💡 Intuitive Analogy',
      title: 'The "Cooked Spaghetti to Steel Scaffolding" Analogy',
      subtitle: 'Understanding why thermosets cannot be remelted',
      content: `Think of making Bakelite like making structural composite concrete:

1. **Phase 1: Cooking the Spaghetti (Novolac)**
   - When you react phenol with an **insufficient amount of formaldehyde** in acid, the molecules link hands in long, flexible strands (like boiled spaghetti noodles).
   - Because they are only chains sliding past each other, you can melt them with heat, dissolve them in alcohol, and reshape them. This is **Novolac** (a thermoplastic prepolymer).

2. **Phase 2: Spot-Welding the Mesh (Bakelite)**
   - Now add "molecular spot-welder powder": **Hexamethylenetetramine (HMTA)**, along with wood flour (filler).
   - Pour it into a heated steel mold and clamp it down at $150^\\circ\\text{C}-170^\\circ\\text{C}$.
   - HMTA decomposes, releasing ammonia and bridging $—CH_2—$ methylene links across every open spot on adjacent phenol rings.
   - The flexible spaghetti noodles are now welded into a single gigantic, continuous 3D molecule spanning the entire object!

Once cured, trying to melt Bakelite is like trying to melt a welded steel girder: it won't melt, it will only char and burn at extreme temperatures.`,
      keyInsight: 'Novolac has open reactive ortho/para sites; HMTA supplies the missing methylene bridges to weld chains into an infusible 3D cage.',
      cognitiveAnchor: 'Spaghetti noodles spot-welded into a permanent 3D cage.'
    },
    rigorous: {
      mode: 'rigorous',
      modeLabel: '📐 First-Principles & Equations',
      title: 'Carothers Gel Point & Functionality Derivation',
      subtitle: 'Mathematical stoichiometry of network gelation',
      content: `### 1. Monomer Functionality & Carothers Gelation Equation
- **Phenol ($C_6H_5OH$)**: Functionality $f_{phenol} = 3$ (two ortho positions and one para position are activated by the $+M$ resonance of the $—OH$ group).
- **Formaldehyde ($HCHO$)**: Functionality $f_{ald} = 2$ (bifunctional $—CH_2—$ bridging unit).

Average functionality $f_{avg}$:
$$f_{avg} = \\frac{2 \\cdot N_{phenol} \\cdot 3 + 2 \\cdot N_{ald} \\cdot 2}{N_{phenol} + N_{ald}}$$

According to the **Carothers equation**, the critical extent of reaction $p_c$ at which infinite network gelation (infusible resite formation) occurs is:
$$p_c = \\frac{2}{f_{avg}}$$

In Novolac preparation, by keeping the molar ratio $[Formaldehyde] / [Phenol] \\le 0.8 < 1.0$, the conversion $p$ never reaches $p_c$, strictly preventing premature cross-linking.

### 2. HMTA Thermal Cleavage Mechanism
When Novolac is mixed with hexamethylenetetramine ($C_6H_{12}N_4$, HMTA, ~8-15 wt%) and heated to $160^\\circ\\text{C}$:
$$(CH_2)_6N_4 + \\text{heat} \\rightarrow 6[-CH_2-] + 4 NH_3 \\uparrow$$
Methylene fragments covalently bind the unreacted ortho/para carbons, driving the gel conversion past $p_c = 0.67$.`,
      keyInsight: 'Controlling molar ratio below 1:1 prevents reaching the Carothers critical gel conversion pc during storage and handling.',
      cognitiveAnchor: 'Carothers gel equation: pc = 2 / favg.'
    },
    mechanism: {
      mode: 'mechanism',
      modeLabel: '⚙️ Physical Mechanism',
      title: '3-Stage Industrial Curing Sequence (A-Stage to C-Stage)',
      subtitle: 'Step-by-step chemical progression of phenolic resins',
      content: `### 1. A-Stage (Resol / Initial Novolac):
- Linear or low-branched oligomers ($M_w \\approx 500 - 2000\\text{ g/mol}$).
- Soluble in acetone/ethanol; meltable at $70^\\circ\\text{C}-100^\\circ\\text{C}$.

### 2. B-Stage (Resitol):
- Partial cross-linking underway.
- Swellable in solvents but no longer freely soluble; rubbery and malleable when heated under high pressure in the mold.

### 3. C-Stage (Resite / Final Bakelite):
- Full 3D cross-linked covalent network.
- High glass transition temperature ($T_g > 250^\\circ\\text{C}$); complete insolubility in all acids and organic solvents.
- Decomposition temperature $> 300^\\circ\\text{C}$.`,
      keyInsight: 'The B-stage allows industrial molding into precise electrical switchboards and telephone casings before permanent C-stage cure.',
      cognitiveAnchor: 'Resol (A) -> Resitol (B) -> Resite (C).'
    },
    exam_viva: {
      mode: 'exam_viva',
      modeLabel: '📝 Exam & Viva Cheat Sheet',
      title: 'High-Yield Exam Traps & Viva Questions',
      subtitle: 'Exact questions asked in end-semester exams and vivas',
      content: `### Top Viva Questions & Precise Answers:
**Q1: What is the exact role of Hexamethylenetetramine (HMTA) in Bakelite synthesis?**
> *Model Answer*: HMTA acts as a cross-linking agent and methylene donor. It thermally decomposes in the mold to furnish $—CH_2—$ cross-links between unreacted ortho/para positions on Novolac chains, while evolving ammonia gas ($NH_3$).

**Q2: Contrast Novolac and Resol in terms of catalyst and stoichiometry.**
> *Model Answer*:
> - **Novolac**: Synthesized using **Acid catalyst** ($HCl$, oxalic acid) with **excess phenol** ($P/F > 1$). Thermoplastic and requires external curing agent.
> - **Resol**: Synthesized using **Base catalyst** ($NaOH$, $NH_4OH$) with **excess formaldehyde** ($F/P > 1$). Self-curing upon simple heating without adding HMTA.

### Marks Loss Warning:
- ⚠️ Mention that phenol has a functionality of **3** (ortho, ortho, para), NOT 1 or 6! The meta positions are de-activated by the resonance effect of the $—OH$ group.`,
      keyInsight: 'Novolac = Acid + Excess Phenol + Needs HMTA. Resol = Base + Excess Formaldehyde + Self-curing.',
      cognitiveAnchor: 'Phenol functionality = 3 (ortho, ortho, para).'
    }
  },

  // ==========================================
  // 03 CONDUCTING POLYMERS: DOPING & POLARONS
  // ==========================================
  'conducting-polymers-intro': {
    standard: {
      mode: 'standard',
      modeLabel: 'Standard Academic',
      title: 'Conduction in Conjugated Polymers & Doping',
      subtitle: 'Delocalized pi-systems and redox doping',
      content: 'Conducting polymers possess an extended conjugated backbone with alternating single and double bonds. Doping via oxidation (p-doping) or reduction (n-doping) creates localized charge carriers (solitons, polarons, bipolarons) that transport charge along and between chains.',
      keyInsight: 'Alternating double bonds provide delocalized pi electrons; chemical doping introduces mobile charge carriers.',
      cognitiveAnchor: 'Conjugated backbone + Redox dopant counterions.'
    },
    intuitive: {
      mode: 'intuitive',
      modeLabel: '💡 Intuitive Analogy',
      title: 'The "Bucket Brigade on an Express Highway" Analogy',
      subtitle: 'Why plastics are normally insulators and how doping turns them into metals',
      content: `### Why is normal plastic an insulator?
In normal plastics like Polyethylene ($-[-CH_2-CH_2-]_n-$), every electron is locked tightly inside single $\\sigma$-bonds, like cars parked in locked garages. An electric field cannot move them.

### Step 1: Building the Highway (Conjugation)
In **Polyacetylene** ($-[-CH=CH-]_n-$), every second bond is a $\\pi$-bond. Carbon atoms are $sp^2$ hybridized, leaving one unhybridized $p_z$ electron pointing upwards. These orbitals overlap sideways into an uninterrupted electronic highway running down the spine of the chain.

*However, the highway is completely packed with cars bumper-to-bumper (filled valence band). No car can move!*

### Step 2: The Tow Truck (p-Doping)
Expose the polyacetylene film to **Iodine vapor ($I_2$)**:
- Iodine is greedy for electrons (oxidizing agent). It snatches an electron off the polymer chain, becoming $I_3^-$.
- This leaves a positive hole on the polymer highway.
- Immediately, adjacent electrons can shift into that empty space, which lets the next electron shift, and the next!

The plastic film shifts from silvery-dull insulator to **metallic golden foil with copper-like electrical conductivity**!`,
      keyInsight: 'Conjugation creates the delocalized highway; redox dopants pull electrons out to create vacancies that allow conduction.',
      cognitiveAnchor: 'Bumper-to-bumper cars until iodine tow-truck removes an electron.'
    },
    rigorous: {
      mode: 'rigorous',
      modeLabel: '📐 First-Principles & Equations',
      title: 'Peierls Instability, Polarons and Bipolarons',
      subtitle: 'Quantum field energy levels and mid-gap states',
      content: `### 1. Peierls Instability & Bandgap Opening
In an idealized 1D carbon chain with equal bond lengths ($a$), the highest occupied band would be half-filled, predicting metallic behavior.
However, a 1D metallic chain is thermodynamically unstable against spontaneous lattice dimerization (Peierls distortion), doubling the unit cell periodicity to $2a$.

This splits the band at the Fermi surface ($k = \\pm \\pi / 2a$), opening a semiconductor bandgap ($E_g \\approx 1.5\\text{ eV}$ for trans-polyacetylene).

### 2. Polarons and Bipolarons Formulation
When an electron is oxidatively removed (p-doping):
1. **Polaron (Radical Cation)**:
   - A local lattice relaxation creates a combination of a charge ($+e$) and a spin ($s = 1/2$).
   - Introduces two localized electronic levels in the gap: $\\omega_0$ and $-\\omega_0$, situated at $\\approx 0.3\\text{ eV}$ from band edges.
2. **Bipolaron (Dication)**:
   - Upon heavier doping ($> 2-5\\text{ mol%}$), removing a second electron is energetically favorable to form a spinless pair of positive charges ($+2e$, $s = 0$) sharing the same local lattice distortion.
   - The mid-gap states move deeper into the bandgap ($0.6\\text{ eV}$), eventually overlapping into a continuous bipolaron conduction band.

$$\\sigma = e (n \\mu_e + p \\mu_h)$$
Conductivity increases from $10^{-10}\\text{ S/cm}$ to $> 10^5\\text{ S/cm}$.`,
      keyInsight: 'Lattice deformation couples with charge to form polarons and spinless bipolarons rather than standard free electrons.',
      cognitiveAnchor: 'Peierls dimerization opens gap; doping introduces mid-gap polaron levels.'
    },
    mechanism: {
      mode: 'mechanism',
      modeLabel: '⚙️ Physical Mechanism',
      title: 'Intra-Chain vs Inter-Chain Conduction Mechanisms',
      subtitle: 'Variable-range hopping and inter-chain tunneling',
      content: `### Conduction is Limited by Two Distinct Regimes:
1. **Intra-chain Transport (Along the single polymer backbone):**
   - High mobility (quasi-1D ballistic transport along conjugated double bonds).
   - Speed limited by defect kinks, cis-trans boundaries, and chemical impurities.

2. **Inter-chain Hopping (Between neighboring polymer backbones):**
   - The primary bottleneck in macroscopic bulk materials!
   - Electrons must hop between separate chains via phonon-assisted **Variable Range Hopping (Mott's VRH model)**:
   $$\\sigma(T) = \\sigma_0 \\exp\\left[ -\\left( \\frac{T_0}{T} \\right)^{\\frac{1}{d+1}} \\right]$$
   where $d = 3$ for three-dimensional disordered polymer networks.

Counterions (e.g., $Cl^-$, $ClO_4^-$, $I_3^-$) sit between chains, maintaining electrical neutrality while modulating inter-chain distance.`,
      keyInsight: 'Overall bulk conductivity is governed by inter-chain hopping, which is why stretching/aligning polymer fibers dramatically boosts conductivity.',
      cognitiveAnchor: 'Intra-chain ballistic flow + Inter-chain Mott hopping.'
    },
    exam_viva: {
      mode: 'exam_viva',
      modeLabel: '📝 Exam & Viva Cheat Sheet',
      title: 'Conducting Polymers Exam Essentials',
      subtitle: 'Key distinctions and viva defense points',
      content: `### Key Viva Questions & Bulletproof Answers:
**Q1: How does doping a conducting polymer differ from doping Silicon?**
> *Model Answer*:
> 1. **Dopant Concentration**: In Silicon, doping is parts-per-million (ppm, $10^{-4}\\%$). In conducting polymers, doping is **massive** ($1$ to $10\\text{ mol}\\%$).
> 2. **Mechanism**: In Silicon, dopants substitute lattice atoms without moving. In polymers, doping is a **redox reaction** (oxidation/reduction) where dopants insert into interstitials as counterions ($I_3^-$, $Na^+$).
> 3. **Structure**: In polymers, the polymer backbone physically deforms, creating polarons and bipolarons.

**Q2: What is the difference between p-doping and n-doping in polymers?**
> *Model Answer*:
> - **p-doping (Oxidative)**: Polymer treated with oxidizing agents (Halogens $I_2$, $Br_2$, Lewis acids $FeCl_3$). Electrons removed, creating positive holes/polarons.
> - **n-doping (Reductive)**: Polymer treated with reducing agents (Alkali metals $Na$, $Li$, naphthalenide). Electrons injected into polymer, creating negative radical anions.`,
      keyInsight: 'Doping in polymers is REDOX chemistry at high mol%, not substitutional semiconductor doping!',
      cognitiveAnchor: 'Silicon doping = ppm substitution; Polymer doping = 10% redox addition.'
    }
  },

  // ==========================================
  // 04 NANOMATERIALS: QUANTUM CONFINEMENT
  // ==========================================
  'energy-band-gap': {
    standard: {
      mode: 'standard',
      modeLabel: 'Standard Academic',
      title: 'Quantum Confinement & Band Gap Widening',
      subtitle: 'Nanoscale size-dependent bandgap modification',
      content: 'When the physical dimensions of a semiconductor crystal approach or become smaller than the exciton Bohr radius, spatial confinement of electron-hole pairs widens the optical bandgap according to the Brus equation.',
      keyInsight: 'Spatial confinement quantizes energy levels and increases bandgap inversely with radius squared (1/R²).',
      cognitiveAnchor: 'Particle in a box scaling with 1/R².'
    },
    intuitive: {
      mode: 'intuitive',
      modeLabel: '💡 Intuitive Analogy',
      title: 'The "Guitar String & Tightening Room" Analogy',
      subtitle: 'Why smaller nanoparticles glow blue and larger ones glow red',
      content: `### The Musical Box Analogy:
Think of an electron in a solid like a musical wave on a guitar string:
- If the string is very long (bulk semiconductor material), it vibrates at low, deep frequencies with thousands of closely spaced overtones that blend into a continuous band.
- If you shorten the guitar string with your finger (shrinking particle size down to $2-5\\text{ nm}$), the wavelength is forced to be tiny.
- A tiny wavelength means **immense vibrational energy** ($E = h \\cdot f = h \\cdot c / \\lambda$).

### The Quantum Dot Rainbow:
In a semiconductor crystal, an electron normally wants a certain amount of "personal space" called the **Exciton Bohr Radius** ($a_B$, typically $2-10\\text{ nm}$).
- **Bulk material**: The room is huge ($> 100\\text{ nm}$). The electron can spread out comfortably. Bandgap is fixed (e.g. CdSe emits infrared/red).
- **Nanoparticle**: You crush the room down to $2\\text{ nm}$, squeezing the electron into a tight box.
- By Heisenberg's uncertainty principle ($\\Delta x \\cdot \\Delta p \\ge \\hbar / 2$), restricting position forces kinetic energy to skyrocket!

The bandgap opens up wide. Now when the electron falls across the gap to emit light, it releases high-energy **blue/green light** instead of red light!`,
      keyInsight: 'Squeezing an electron into a space smaller than its natural wave packet forces its kinetic energy to rise, widening the bandgap.',
      cognitiveAnchor: 'Shorter guitar string = higher pitch; smaller quantum dot = bluer light.'
    },
    rigorous: {
      mode: 'rigorous',
      modeLabel: '📐 First-Principles & Equations',
      title: 'The Brus Equation Derivation (Particle in a Sphere)',
      subtitle: 'Schrodinger equation for confined electron-hole pairs',
      content: `### The Brus Equation (Effective Mass Approximation):
Treating a spherical quantum dot of radius $R$ and dielectric constant $\\epsilon_r$:

$$E_g(R) = E_g^{\\text{bulk}} + \\frac{\\hbar^2 \\pi^2}{2 R^2} \\left( \\frac{1}{m_e^*} + \\frac{1}{m_h^*} \\right) - \\frac{1.8 e^2}{4 \\pi \\epsilon_0 \\epsilon_r R}$$

### Term-by-Term Physical Interpretation:
1. **$E_g^{\\text{bulk}}$**: Standard macroscopic bandgap of the infinite crystal.
2. **$\\frac{\\hbar^2 \\pi^2}{2 R^2} \\left( \\frac{1}{m_e^*} + \\frac{1}{m_h^*} \\right)$**:
   - **Kinetic Quantum Confinement Energy**:
   - Solved from the 3D spherical infinite potential well (particle in a sphere).
   - Note the **$\\frac{1}{R^2}$** dependence: as radius is halved, confinement energy quadruples!
3. **$- \\frac{1.8 e^2}{4 \\pi \\epsilon_0 \\epsilon_r R}$**:
   - **Coulombic Exciton Attraction**:
   - Electrostatic attraction between the confined electron and hole, scaling as **$\\frac{1}{R}$**.

Because the positive confinement term ($1/R^2$) dominates over the negative Coulomb term ($1/R$) at very small radii ($R < a_B$), **$E_g(R)$ always increases as $R$ decreases** (Blue Shift).`,
      keyInsight: 'The 1/R² kinetic term mathematically dominates over the 1/R Coulomb term, guaranteeing bandgap widening as size shrinks.',
      cognitiveAnchor: 'Brus equation: ΔE ~ 1/R² (kinetic) - 1/R (Coulomb).'
    },
    mechanism: {
      mode: 'mechanism',
      modeLabel: '⚙️ Physical Mechanism',
      title: 'Density of States (DOS) Transition Across Dimensions',
      subtitle: 'From continuous 3D parabolic bands to discrete 0D atomic delta functions',
      content: `### Evolution of Density of States $g(E)$:
1. **3D Bulk**: Continuous parabolic curve:
   $$g(E) \\propto \\sqrt{E - E_c}$$
2. **2D Quantum Well (Thin Films, Graphene)**: Staircase step function:
   $$g(E) \\propto \\sum \\Theta(E - E_n)$$
3. **1D Quantum Wire (Nanowires, Carbon Nanotubes)**: Spiky Van Hove singularities:
   $$g(E) \\propto \\frac{1}{\\sqrt{E - E_n}}$$
4. **0D Quantum Dot (Nanoparticles)**: Fully discrete delta functions (atom-like):
   $$g(E) = \\sum 2 \\delta(E - E_n)$$

This explains why quantum dots are called **"artificial atoms"** — continuous valence and conduction bands collapse into discrete energy levels.`,
      keyInsight: 'In 0D nanoparticles, continuous energy bands collapse into discrete delta functions like an isolated atom.',
      cognitiveAnchor: '3D parabola -> 2D staircase -> 1D inverse root spikes -> 0D delta spikes.'
    },
    exam_viva: {
      mode: 'exam_viva',
      modeLabel: '📝 Exam & Viva Cheat Sheet',
      title: 'Nanomaterials Exam Traps & Formula Practice',
      subtitle: 'Most frequent exam numericals and conceptual questions',
      content: `### High-Yield Exam Questions:
**Q1: What is the "Blue Shift" in nanomaterials, and what causes it?**
> *Model Answer*: The blue shift is the displacement of the optical absorption and emission spectra towards shorter wavelengths (higher photon energies, towards blue light) when nanoparticle size is reduced below the exciton Bohr radius. It is caused by **quantum confinement**, where spatial restriction increases the electron and hole zero-point kinetic energies ($E \\propto 1/R^2$), widening the effective energy bandgap.

**Q2: Define Exciton Bohr Radius.**
> *Model Answer*: The average spatial separation distance between a photo-excited electron in the conduction band and its corresponding hole in the valence band in a bulk semiconductor:
$$a_B = \\frac{\\epsilon_r \\hbar^2}{\\mu e^2} = \\epsilon_r \\left( \\frac{m_0}{\\mu} \\right) a_0$$
where $\\mu = (m_e^* m_h^*) / (m_e^* + m_h^*)$ is the reduced exciton mass.`,
      keyInsight: 'Blue shift = higher energy = shorter wavelength = smaller nanoparticle size.',
      cognitiveAnchor: 'R < aB defines the strong quantum confinement regime.'
    }
  },

  // ==========================================
  // 06 OLEDS: WORKING PRINCIPLE & EXCITONS
  // ==========================================
  'oled-working-principle': {
    standard: {
      mode: 'standard',
      modeLabel: 'Standard Academic',
      title: 'OLED Electroluminescence & Multi-layer Recombination',
      subtitle: 'Charge injection, transport, and radiative exciton decay',
      content: 'An Organic Light-Emitting Diode generates light by injecting holes from a transparent ITO anode and electrons from a low work function cathode. Carriers migrate through transport layers into the emissive layer to form excitons that decay radiatively.',
      keyInsight: 'Electroluminescence requires balanced hole and electron injection into the central emissive layer.',
      cognitiveAnchor: 'Anode/HTL -> EML <- ETL/Cathode.'
    },
    intuitive: {
      mode: 'intuitive',
      modeLabel: '💡 Intuitive Analogy',
      title: 'The "Matchmaker Ballroom" Analogy',
      subtitle: 'Understanding the 5-layer OLED stack without getting lost',
      content: `Imagine an exclusive ballroom dance where positive dancers (holes) enter through the West door and negative dancers (electrons) enter through the East door:

1. **The West Door (Anode - ITO)**: Transparent glass so the audience outside can see the show. It lets holes in smoothly.
2. **The Red Carpet (Hole Transport Layer - HTL)**: Fast escalator for positive dancers, but has a steep barrier that prevents negative dancers from escaping.
3. **The Ballroom (Emissive Layer - EML)**:
   - Positive and negative dancers finally meet in the middle and pair up into couples called **Excitons**!
   - When a couple hugs and settles down, they release a flash of colored light (a photon).
4. **The Blue Carpet (Electron Transport Layer - ETL)**: Fast escalator for negative dancers, blocking positive dancers.
5. **The East Door (Cathode - Aluminum/LiF)**: Highly reflective metal mirror that reflects light back out through the front glass.

If you made an OLED with just one single layer, electrons and holes would shoot right through and collide with the metal contacts without ever meeting in the middle. The multi-layer sandwich forces them to meet and dance inside the emissive layer!`,
      keyInsight: 'Multi-layer structures confine electrons and holes within a narrow central emissive zone, preventing non-radiative quenching at the metal electrodes.',
      cognitiveAnchor: 'Holes from left + electrons from right trapped inside central ballroom.'
    },
    rigorous: {
      mode: 'rigorous',
      modeLabel: '📐 First-Principles & Equations',
      title: 'Quantum Spin Statistics (Singlet vs Triplet Excitons)',
      subtitle: 'The 25% fluorescent limit and phosphorescent harvesting',
      content: `### 1. The 25% Fluorescent Quantum Efficiency Limit
Electrons and holes are fermions with spin $s = 1/2$.
When an uncorrelated electron ($s_1 = 1/2$) and hole ($s_2 = 1/2$) combine, their total spin angular momentum $S$ can be $0$ or $1$:

- **Singlet State ($S = 0$, $M_S = 0$, Anti-symmetric spin)**:
  $$\\frac{1}{\\sqrt{2}} (\\left| \\uparrow \\downarrow \\right\\rangle - \\left| \\downarrow \\uparrow \\right\\rangle) \\quad \\text{--- } 1 \\text{ state (25% probability)}$$
- **Triplet States ($S = 1$, $M_S = +1, 0, -1$, Symmetric spin)**:
  $$\\begin{cases} \\left| \\uparrow \\uparrow \\right\\rangle \\\\ \\frac{1}{\\sqrt{2}} (\\left| \\uparrow \\downarrow \\right\\rangle + \\left| \\downarrow \\uparrow \\right\\rangle) \\\\ \\left| \\downarrow \\downarrow \\right\\rangle \\end{cases} \\quad \\text{--- } 3 \\text{ states (75% probability)}$$

### Radiative Selection Rules:
In purely organic fluorescent molecules (e.g. $Alq_3$), optical transitions must conserve spin ($\\Delta S = 0$).
- Decay from the Singlet state ($S_1 \\rightarrow S_0$) is spin-allowed: **Radiative fluorescence** ($10^{-9}\\text{ s}$).
- Decay from the Triplet state ($T_1 \\rightarrow S_0$) is spin-forbidden ($\\Delta S = 1$): **Non-radiative thermal dissipation**!
- Therefore, traditional fluorescent OLEDs have an **Internal Quantum Efficiency (IQE) capped at 25%**!

### Phosphorescent Solution (Baldo & Forrest):
Doping with heavy transition metal complexes (e.g. Iridium $Ir(ppy)_3$ or Platinum $PtOEP$):
Strong **Spin-Orbit Coupling** mixes singlet and triplet wavefunctions, permitting radiative decay from $T_1 \\rightarrow S_0$, unlocking **100% Internal Quantum Efficiency**!`,
      keyInsight: 'Quantum spin multiplicity dictates 1 singlet : 3 triplets. Heavy-metal spin-orbit coupling is mandatory to harvest the 75% triplet excitons.',
      cognitiveAnchor: 'Spin statistics: 1 Singlet (25%) + 3 Triplets (75%).'
    },
    mechanism: {
      mode: 'mechanism',
      modeLabel: '⚙️ Physical Mechanism',
      title: '5-Step Operating Cascade in Multi-Layer OLEDs',
      subtitle: 'Step-by-step electronic progression',
      content: `### Complete Operation Sequence:
1. **Carrier Injection**:
   - Forward bias applied ($3-8\\text{ V}$).
   - Holes tunnel from ITO ($W \\approx 4.8\\text{ eV}$) into HOMO of HTL (NPB, $5.4\\text{ eV}$).
   - Electrons tunnel from Al/LiF ($W \\approx 2.9\\text{ eV}$) into LUMO of ETL ($Alq_3$, $3.1\\text{ eV}$).
2. **Carrier Transport**:
   - Holes move via polaron hopping across HTL.
   - Electrons move via radical anion hopping across ETL.
3. **Carrier Blocking & Confinement**:
   - High LUMO barrier at HTL/EML interface blocks electrons from entering HTL.
   - Low HOMO barrier at EML/ETL interface blocks holes from entering ETL.
4. **Exciton Formation**:
   - Electron and hole capture within EML forming localized Frenkel excitons ($r_b \\approx 1\\text{ nm}$).
5. **Radiative Recombination**:
   - Exciton decays, emitting a photon through transparent glass substrate:
   $$\\lambda = \\frac{h c}{E_{\\text{HOMO}} - E_{\\text{LUMO}}}$$`,
      keyInsight: 'Energy offset barriers prevent leakage currents and confine recombination strictly within the active emissive volume.',
      cognitiveAnchor: 'Injection -> Transport -> Confinement -> Exciton Formation -> Photon Emission.'
    },
    exam_viva: {
      mode: 'exam_viva',
      modeLabel: '📝 Exam & Viva Cheat Sheet',
      title: 'OLED Exam Essentials & Viva Defense',
      subtitle: 'Key questions and exact exam phrasing',
      content: `### High-Yield Exam Questions:
**Q1: Why is an OLED built with multiple organic layers instead of a single layer?**
> *Model Answer*:
> 1. To match energy barriers (HOMO and LUMO) with electrode work functions for low driving voltage.
> 2. To balance hole mobility (normally high) and electron mobility (normally low).
> 3. To confine electrons and holes within the central emissive layer, preventing non-radiative quenching against metallic electrodes.

**Q2: What is the theoretical limit of internal quantum efficiency in fluorescent OLEDs? How is it overcome?**
> *Model Answer*: The limit is **25%** due to quantum spin statistics (1 singlet : 3 triplets), as triplet excitons cannot decay radiatively. It is overcome by using **phosphorescent dopants** (such as Iridium complexes) where heavy-atom spin-orbit coupling allows radiative emission from triplets, reaching **100% internal efficiency**.`,
      keyInsight: 'Fluorescent limit = 25%; Phosphorescent limit = 100% via spin-orbit coupling.',
      cognitiveAnchor: 'HOMO-LUMO matching + 25% vs 100% IQE.'
    }
  }
};

/**
 * Returns alternative explanations for any topic, generating structured cognitive modes if not present
 */
export function getAlternativeExplanationsForTopic(topic: TopicNode): Record<ExplanationMode, AlternativeExplanation> {
  if (TOPIC_ALTERNATIVE_EXPLANATIONS[topic.id]) {
    return TOPIC_ALTERNATIVE_EXPLANATIONS[topic.id];
  }

  // Dynamic structured fallback for other syllabus topics or custom user notes
  return {
    standard: {
      mode: 'standard',
      modeLabel: 'Standard Academic',
      title: topic.title,
      subtitle: `Standard syllabus note in ${topic.category}`,
      content: topic.description + '\n\n' + topic.content.slice(0, 300) + '...',
      keyInsight: `Core functional concept in ${topic.category}.`,
      cognitiveAnchor: `${topic.title} (${topic.category})`
    },
    intuitive: {
      mode: 'intuitive',
      modeLabel: '💡 Intuitive Analogy',
      title: `The Intuitive Mental Model: ${topic.title}`,
      subtitle: `Everyday analogy for ${topic.title}`,
      content: `### Everyday Analogy for ${topic.title}:
Imagine **${topic.title}** as a specialized mechanical or electrical system:
- In the ${topic.category} framework, materials do not behave as static blocks of matter. Instead, their atomic-scale architecture dictates macroscopic behavior.
- Think of this concept like an intricate network where subtle changes in composition, temperature, or chemical bonding trigger macroscopic shifts in properties.
- **Why it matters**: Understanding ${topic.title} allows materials scientists to design functional devices like high-efficiency sensors, capacitors, and displays.`,
      keyInsight: `Connects microscale structure directly to macroscale performance in ${topic.category}.`,
      cognitiveAnchor: `Analogy for ${topic.title}`
    },
    rigorous: {
      mode: 'rigorous',
      modeLabel: '📐 First-Principles & Equations',
      title: `Governing Equations & Principles: ${topic.title}`,
      subtitle: `Mathematical and thermodynamic formulation`,
      content: `### Mathematical & Thermodynamic Principles:
- **Structural and Energy Foundations**:
  The behavior of ${topic.title} is governed by thermodynamic minimization of Gibbs free energy $\\Delta G = \\Delta H - T \\Delta S$.
- **Key Relationships**:
  - Intermolecular and crystal forces balance Coulombic attraction against short-range Pauli repulsion.
  - Rate kinetics follow the Arrhenius relationship: $k = A \\exp\\left(-\\frac{E_a}{R T}\\right)$.
- **Critical Parameters**:
  Always identify the limiting reagent, phase stability boundaries, and electronic bandgap constraints.`,
      keyInsight: `Gibbs free energy minimization and Arrhenius kinetics govern ${topic.title}.`,
      cognitiveAnchor: `First-principles framework for ${topic.category}`
    },
    mechanism: {
      mode: 'mechanism',
      modeLabel: '⚙️ Physical Mechanism',
      title: `Step-by-Step Mechanism: ${topic.title}`,
      subtitle: `Sequential physical & chemical process workflow`,
      content: `### Step-by-Step Mechanism:
1. **Initiation / Precursor Activation**:
   - Activation of raw precursor materials under thermal or chemical driving force.
2. **Phase Formation / Molecular Alignment**:
   - Structural orientation along low-energy crystallographic planes or conjugated chains.
3. **Property Manifestation**:
   - Emergence of the characteristic target properties (electrical, optical, dielectric, or mechanical).
4. **Final Stabilization**:
   - Relaxation into the thermodynamically stable or metastable state.`,
      keyInsight: `Sequential transition from precursor activation to stabilized functional performance.`,
      cognitiveAnchor: `Mechanism workflow for ${topic.title}`
    },
    exam_viva: {
      mode: 'exam_viva',
      modeLabel: '📝 Exam & Viva Cheat Sheet',
      title: `Exam & Viva Essentials: ${topic.title}`,
      subtitle: `Key definitions and common examiner questions`,
      content: `### Viva Questions & Exam Traps for ${topic.title}:
**Q1: State the precise definition and significance of ${topic.title}.**
> *Model Answer*: ${topic.description} It is a critical foundation in ${topic.category} connecting precursor chemistry to physical performance.

**Examiner Trap to Avoid**:
- Never confuse precursor preparation with the final cured/sintered material state.
- Always mention proper units and operating boundary conditions (e.g. temperature ranges, pH, atmospheric conditions).`,
      keyInsight: `Memorize definition, governing reaction/equation, and common examiner pitfalls.`,
      cognitiveAnchor: `Viva preparation for ${topic.title}`
    }
  };
}
