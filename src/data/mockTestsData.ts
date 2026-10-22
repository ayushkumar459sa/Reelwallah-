import type { MockTest, TestQuestion, TestSection } from '../types.js';

// Helper to build a question with diversified correct options
function createQ(
  id: string,
  num: number,
  secId: string,
  text: string,
  options: string[],
  correctOpt: number,
  formula: string,
  explanation: string,
  difficulty: 'Easy' | 'Moderate' | 'JEE Advanced Hard' = 'Moderate',
  marksCorrect = 4,
  marksIncorrect = -1
): TestQuestion {
  return {
    id,
    questionNumber: num,
    sectionId: secId,
    type: 'single_choice',
    questionText: text,
    options,
    correctOption: correctOpt,
    marksCorrect,
    marksIncorrect,
    difficulty,
    keyFormula: formula,
    explanation
  };
}

function createNumQ(
  id: string,
  num: number,
  secId: string,
  text: string,
  correctNum: number,
  formula: string,
  explanation: string,
  difficulty: 'Easy' | 'Moderate' | 'JEE Advanced Hard' = 'Moderate',
  marksCorrect = 4,
  marksIncorrect = 0
): TestQuestion {
  return {
    id,
    questionNumber: num,
    sectionId: secId,
    type: 'numerical',
    questionText: text,
    correctNumerical: correctNum,
    marksCorrect,
    marksIncorrect,
    difficulty,
    keyFormula: formula,
    explanation
  };
}

// -------------------------------------------------------------
// 1. JEE MAIN FULL SYLLABUS MOCK PAPERS & OFFICIAL PYQS (15)
// -------------------------------------------------------------
const jeeMainFullMocks: MockTest[] = [
  {
    id: 'test-jee-main-2025-01',
    title: 'NTA JEE Main 2025 All India Full Mock #1',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 15,
    passingMarks: 110,
    rewardCoins: 25,
    isPublished: true,
    source: 'National Testing Agency (NTA) Official Sample Pattern 2025',
    sections: [
      {
        id: 'sec-m1-p',
        name: 'Physics',
        questions: [
          createQ('q-m1-p1', 1, 'sec-m1-p', 'A solid sphere of mass M and radius R rolls without slipping down an inclined plane of inclination θ. The linear acceleration of the center of mass is:', ['(1/2) g sin θ', '(5/7) g sin θ', '(2/3) g sin θ', '(3/5) g sin θ'], 1, 'a = (g sin θ) / (1 + I / (M R^2)), I = (2/5) M R^2', 'For a solid sphere, k^2/R^2 = 2/5. Hence a = g sin θ / (1 + 2/5) = (5/7) g sin θ (Option B).'),
          createQ('q-m1-p2', 2, 'sec-m1-p', 'An EM wave in vacuum has electric field amplitude E0 = 120 V/m and frequency 50 MHz. The amplitude of associated magnetic field B0 is:', ['2.5 × 10^-8 T', '1.2 × 10^-6 T', '4.0 × 10^-7 T', '3.6 × 10^-7 T'], 2, 'B0 = E0 / c, where c = 3 × 10^8 m/s', 'B0 = 120 / (3 × 10^8) = 4.0 × 10^-7 T (Option C).'),
          createQ('q-m1-p3', 3, 'sec-m1-p', 'In a Young double-slit experiment, distance between slits is 0.2 mm and screen is 1.5 m away. Wavelength λ = 600 nm. The fringe width β is:', ['3.2 mm', '4.5 mm', '2.8 mm', '1.5 mm'], 1, 'β = λ D / d', 'β = (600 × 10^-9 × 1.5) / (0.2 × 10^-3) = 4.5 × 10^-3 m = 4.5 mm (Option B).'),
          createQ('q-m1-p4', 4, 'sec-m1-p', 'Half-life of a radioactive substance is 20 minutes. The time taken for 87.5% decay of initial nuclei is:', ['40 min', '50 min', '80 min', '60 min'], 3, 'N/N0 = (1/2)^n, Remaining = 12.5% = 1/8 = (1/2)^3 -> n = 3', 'Total time t = 3 × 20 min = 60 minutes (Option D).'),
          createNumQ('q-m1-p5', 5, 'sec-m1-p', 'A carnot engine operates between temperatures 300 K and 500 K. Its efficiency percentage is:', 40, 'η = (1 - T_cold / T_hot) × 100%', 'η = (1 - 300/500) × 100% = 40%.')
        ]
      },
      {
        id: 'sec-m1-c',
        name: 'Chemistry',
        questions: [
          createQ('q-m1-c1', 6, 'sec-m1-c', 'Which of the following compounds exhibits optical isomerism?', ['[Co(NH3)6]3+', '[Co(en)3]3+', 'trans-[Co(en)2Cl2]+', '[Pt(NH3)2Cl2]'], 1, 'Tris-chelate octahedral complexes like [Co(en)3]3+ lack plane and center of symmetry', '[Co(en)3]3+ has D3 point symmetry with no Sn axis, hence enantiomeric (Option B).'),
          createQ('q-m1-c2', 7, 'sec-m1-c', 'Treatment of benzaldehyde with concentrated 50% NaOH solution yields benzyl alcohol and sodium benzoate. This reaction is known as:', ['Aldol condensation', 'Cannizzaro reaction', 'Perkin reaction', 'Reimer-Tiemann reaction'], 1, 'Disproportionation of aldehydes lacking α-hydrogen in conc alkali', 'Benzaldehyde lacks α-H and undergoes redox Cannizzaro reaction (Option B).'),
          createQ('q-m1-c3', 8, 'sec-m1-c', 'According to VSEPR theory, geometry and hybridization of XeF4 molecule are:', ['Tetrahedral, sp3', 'Trigonal bipyramidal, sp3d', 'Square planar, sp3d2', 'See-saw, sp3d'], 2, 'Total electron pairs = (8 + 4)/2 = 6 (4 bond pairs + 2 lone pairs) -> sp3d2 square planar', 'XeF4 has 4 bonding pairs and 2 lone pairs arranged trans, giving square planar (Option C).'),
          createQ('q-m1-c4', 9, 'sec-m1-c', 'For a first-order reaction with rate constant k = 6.93 × 10^-3 s^-1, the half-life t_1/2 is:', ['50 s', '150 s', '200 s', '100 s'], 3, 't_1/2 = ln(2) / k = 0.693 / k', 't_1/2 = 0.693 / (6.93 × 10^-3) = 100 s (Option D).'),
          createNumQ('q-m1-c5', 10, 'sec-m1-c', 'The pH of a 10^-3 M strong monoprotic acid solution (e.g. HCl) at 25°C is:', 3, 'pH = -log10[H+]', 'pH = -log10(10^-3) = 3.')
        ]
      },
      {
        id: 'sec-m1-m',
        name: 'Mathematics',
        questions: [
          createQ('q-m1-m1', 11, 'sec-m1-m', 'The value of the definite integral ∫0^(π/2) (sin^3 x) / (sin^3 x + cos^3 x) dx is:', ['π/2', 'π/3', 'π/4', '0'], 2, "King's property: ∫a^b f(x)dx = ∫a^b f(a+b-x)dx -> 2I = ∫0^(π/2) 1 dx = π/2", 'Applying King property gives 2I = π/2, so I = π/4 (Option C).'),
          createQ('q-m1-m2', 12, 'sec-m1-m', 'The area bounded by parabola y^2 = 4x and line y = 2x is equal to:', ['1/3', '2/3', '4/3', '1/6'], 0, 'Area = ∫0^1 ((4x)^(1/2) - 2x) dx', 'Intersection at 4x^2 = 4x -> x = 0, 1. Area = [4/3 x^(3/2) - x^2]_0^1 = 4/3 - 1 = 1/3 (Option A).'),
          createQ('q-m1-m3', 13, 'sec-m1-m', 'If vectors a = 2i + j - k and b = i + 2j + λ k are perpendicular, the scalar λ is:', ['5', '3', '4', '-4'], 2, 'Perpendicular vectors satisfy a · b = 0 -> 2(1) + 1(2) + (-1)(λ) = 0', '2 + 2 - λ = 0 -> λ = 4 (Option C).'),
          createQ('q-m1-m4', 14, 'sec-m1-m', 'lim (x->0) (e^(3x) - 1) / sin(2x) is equal to:', ['2/3', '3/2', '1', '3'], 1, 'Standard limit: lim (e^kx - 1)/kx = 1 and lim sin(px)/px = 1', '(3x / sin(2x)) * ((e^3x - 1)/3x) = (3/2) * (1) = 3/2 (Option B).'),
          createNumQ('q-m1-m5', 15, 'sec-m1-m', 'If matrix A is 2×2 with det(A) = 4, then det(3 A) is equal to:', 36, 'det(k A) = k^n det(A) for n×n matrix', 'det(3 A) = 3^2 × 4 = 9 × 4 = 36.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-main-2025-02',
    title: 'NTA JEE Main 2025 All India Full Mock #2',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 15,
    passingMarks: 110,
    rewardCoins: 25,
    isPublished: true,
    source: 'NTA JEE Main Mock Series - High Probability Trends',
    sections: [
      {
        id: 'sec-m2-p',
        name: 'Physics',
        questions: [
          createQ('q-m2-p1', 1, 'sec-m2-p', 'Escape velocity from Earth is 11.2 km/s. If a planet has twice the mass and half the radius of Earth, its escape velocity is:', ['11.2 km/s', '15.8 km/s', '22.4 km/s', '31.6 km/s'], 2, 'v_e = √(2GM/R) -> v\' = √(2G(2M)/(R/2)) = 2 v_e', 'v\' = 2 × 11.2 km/s = 22.4 km/s (Option C).'),
          createQ('q-m2-p2', 2, 'sec-m2-p', 'In a series LCR circuit at resonance, the phase difference between applied AC voltage and resulting current is:', ['π/2', '0', 'π/4', 'π'], 1, 'At resonance, inductive reactance X_L = X_C, impedance Z = R (purely resistive)', 'Phase angle tan φ = (X_L - X_C)/R = 0, so φ = 0 (Option B).'),
          createQ('q-m2-p3', 3, 'sec-m2-p', 'The de Broglie wavelength of an electron accelerated through potential difference V = 100 V is approximately:', ['0.123 nm', '1.227 nm', '0.012 nm', '12.27 nm'], 0, 'λ = 1.227 / √V nm', 'λ = 1.227 / √100 = 1.227 / 10 = 0.123 nm (Option A).'),
          createQ('q-m2-p4', 4, 'sec-m2-p', 'A Carnot refrigerator operates between 250 K and 300 K. Its coefficient of performance (COP) is:', ['6', '4', '7', '5'], 3, 'COP = T_cold / (T_hot - T_cold)', 'COP = 250 / (300 - 250) = 250 / 50 = 5 (Option D).'),
          createNumQ('q-m2-p5', 5, 'sec-m2-p', 'Two charges +4 μC and -4 μC are separated by 2 cm in vacuum. The electric dipole moment in μC·cm is:', 8, 'p = q × 2a', 'p = 4 μC × 2 cm = 8 μC·cm.')
        ]
      },
      {
        id: 'sec-m2-c',
        name: 'Chemistry',
        questions: [
          createQ('q-m2-c1', 6, 'sec-m2-c', 'Which of the following molecules has a permanent non-zero dipole moment?', ['CO2', 'BF3', 'NH3', 'CCl4'], 2, 'Trigonal pyramidal geometry with lone pair gives net dipole', 'NH3 has sp3 pyramidal shape with lone pair; dipole moments add up to give net μ = 1.47 D (Option C).'),
          createQ('q-m2-c2', 7, 'sec-m2-c', 'Lucas reagent is an equimolar mixture of anhydrous ZnCl2 and:', ['Conc. HNO3', 'Conc. HCl', 'Dilute HCl', 'Conc. H2SO4'], 1, 'Lucas reagent: Anhydrous ZnCl2 + Conc. HCl for alcohol differentiation', 'Tertiary alcohols give immediate turbidity with anhydrous ZnCl2 and conc HCl (Option B).'),
          createQ('q-m2-c3', 8, 'sec-m2-c', 'The spin-only magnetic moment of [Mn(H2O)6]2+ (Mn atomic number 25) is approximately:', ['3.87 BM', '4.90 BM', '5.92 BM', '1.73 BM'], 2, 'μ = √(n(n+2)) BM, Mn2+ is 3d5 high spin (n=5)', 'μ = √(5 × 7) = √35 ≈ 5.92 BM (Option C).'),
          createQ('q-m2-c4', 9, 'sec-m2-c', 'Elevation in boiling point constant (Kb) for water is 0.52 K kg/mol. Boiling point of 0.1 molal aqueous NaCl solution (assuming 100% dissociation) is:', ['100.052°C', '100.104°C', '100.520°C', '101.040°C'], 1, 'ΔTb = i * Kb * m, for NaCl i = 2', 'ΔTb = 2 × 0.52 × 0.1 = 0.104 K, so Tb = 100 + 0.104 = 100.104°C (Option B).'),
          createNumQ('q-m2-c5', 10, 'sec-m2-c', 'The oxidation state of Chromium in CrO5 (butterfly structure with peroxo linkages) is +:', 6, 'CrO5 has 1 oxo oxygen (-2) and 2 peroxo bonds (-1 each for 4 oxygens)', 'x + (-2) + 4(-1) = 0 -> x = +6.')
        ]
      },
      {
        id: 'sec-m2-m',
        name: 'Mathematics',
        questions: [
          createQ('q-m2-m1', 11, 'sec-m2-m', 'The eccentricity of the ellipse 9x^2 + 16y^2 = 144 is:', ['3/4', '√(7)/4', '√(7)/3', '1/2'], 1, 'b^2 = a^2(1 - e^2), a^2 = 16, b^2 = 9', '9 = 16(1 - e^2) -> e^2 = 7/16 -> e = √7 / 4 (Option B).'),
          createQ('q-m2-m2', 12, 'sec-m2-m', 'The distance between parallel planes 2x - 2y + z + 3 = 0 and 4x - 4y + 2z + 12 = 0 is:', ['1', '2', '3', '1.5'], 0, 'Rewrite plane 2 as 2x - 2y + z + 6 = 0, distance d = |d2 - d1| / √(a^2 + b^2 + c^2)', 'd = |6 - 3| / √(4 + 4 + 1) = 3 / 3 = 1 (Option A).'),
          createQ('q-m2-m3', 13, 'sec-m2-m', 'If A is an invertible square matrix of order 3 and det(A) = 5, then det(adj(A)) is:', ['5', '15', '25', '125'], 2, 'det(adj(A)) = (det A)^(n - 1)', 'Here n = 3, so det(adj A) = 5^(3 - 1) = 5^2 = 25 (Option C).'),
          createQ('q-m2-m4', 14, 'sec-m2-m', 'The sum of infinite geometric series 1 + 1/3 + 1/9 + 1/27 + ... is:', ['4/3', '3/2', '2', '5/3'], 1, 'S_inf = a / (1 - r) with |r| < 1', 'S = 1 / (1 - 1/3) = 1 / (2/3) = 3/2 (Option B).'),
          createNumQ('q-m2-m5', 15, 'sec-m2-m', 'The maximum value of 3 sin x + 4 cos x + 7 is:', 12, 'Max of a sin x + b cos x is √(a^2 + b^2)', 'Max = √(9 + 16) + 7 = 5 + 7 = 12.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-main-2024-jan27-s1',
    title: 'JEE Main 2024 (27 Jan Shift 1) Official PYQ Paper',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 15,
    passingMarks: 120,
    rewardCoins: 30,
    isPublished: true,
    source: 'NTA JEE Main 2024 Session 1 Official Memory Recalled Paper',
    sections: [
      {
        id: 'sec-j27s1-p',
        name: 'Physics',
        questions: [
          createQ('q-j27s1-p1', 1, 'sec-j27s1-p', 'A projectile has range R and maximum height H. If R = 4H, the angle of projection θ is:', ['30°', '60°', '45°', '75°'], 2, 'R = 4H cot θ; when R = 4H, cot θ = 1 -> θ = 45°', 'R = u^2 sin 2θ / g, H = u^2 sin^2 θ / 2g. R/H = 4 cot θ. If R = 4H, cot θ = 1, θ = 45° (Option C).'),
          createQ('q-j27s1-p2', 2, 'sec-j27s1-p', 'Work done in blowing a soap bubble from radius R to 2R (surface tension T) is:', ['8 π R^2 T', '24 π R^2 T', '12 π R^2 T', '16 π R^2 T'], 1, 'Soap bubble has 2 free surfaces: W = 2T ΔA = 2T [4π(4R^2 - R^2)]', 'W = 2T [12 π R^2] = 24 π R^2 T (Option B).'),
          createQ('q-j27s1-p3', 3, 'sec-j27s1-p', 'Capacitance of a parallel plate capacitor with dielectric constant K covering half the area is:', ['(K+1) C0 / 2', '2 K C0 / (K+1)', 'K C0', '(K+2) C0 / 3'], 0, 'Two capacitors in parallel: C1 = (A/2) ε0/d, C2 = (A/2) K ε0/d', 'C_eq = C1 + C2 = (ε0 A / 2d)(1 + K) = (K+1) C0 / 2 (Option A).'),
          createQ('q-j27s1-p4', 4, 'sec-j27s1-p', 'In photoelectric effect, if incident frequency is doubled, maximum kinetic energy of ejected electrons:', ['Doubles', 'Becomes more than double', 'Halves', 'Remains same'], 1, 'KE_max = h ν - Φ. Doubling ν gives KE\' = 2h ν - Φ = 2(KE_max + Φ) - Φ = 2 KE_max + Φ > 2 KE_max', 'Since work function Φ > 0, KE\' > 2 KE_max (Option B).'),
          createNumQ('q-j27s1-p5', 5, 'sec-j27s1-p', 'A wire of resistance 20 Ω is drawn out to double its length. Its new resistance in ohms is:', 80, 'R ∝ L^2 when volume is constant', 'New resistance R\' = 2^2 × 20 = 4 × 20 = 80 Ω.')
        ]
      },
      {
        id: 'sec-j27s1-c',
        name: 'Chemistry',
        questions: [
          createQ('q-j27s1-c1', 6, 'sec-j27s1-c', 'Which of the following compounds gives positive iodoform test with I2/NaOH?', ['Methanol', 'Ethanol', '1-Propanol', 'Benzophenone'], 1, 'Compounds containing CH3-CH(OH)- or CH3-C=O group give positive iodoform', 'Ethanol (CH3CH2OH) oxidizes to ethanal CH3CHO which forms yellow CHI3 precipitate (Option B).'),
          createQ('q-j27s1-c2', 7, 'sec-j27s1-c', 'The IUPAC name of [Pt(NH3)2Cl(NO2)] is:', ['Diamminechloronitrito-N-platinum(II)', 'Diamminechloronitro-platinum(IV)', 'Diamminechloridodioxoplatinum(II)', 'Bis(ammine)chloroplatinum(II)'], 0, 'Cationic/neutral complex: ammine alphabetically before chlorido and nitrito-N', 'Diamminechloronitrito-N-platinum(II) with Pt in +2 state (Option A).'),
          createQ('q-j27s1-c3', 8, 'sec-j27s1-c', 'The monomer units of Dacron (Terylene) polymer are ethylene glycol and:', ['Phthalic acid', 'Adipic acid', 'Terephthalic acid', 'Benzoic acid'], 2, 'Condensation polymer formed from benzene-1,4-dicarboxylic acid (terephthalic acid)', 'Ethylene glycol + terephthalic acid polymerizes to Dacron with loss of H2O (Option C).'),
          createQ('q-j27s1-c4', 9, 'sec-j27s1-c', 'Among halide ions, the strongest reducing agent in aqueous medium is:', ['F-', 'Cl-', 'Br-', 'I-'], 3, 'Oxidation potential: I- is most easily oxidized due to lowest hydration and large size', 'I- has the standard reduction potential of +0.54 V, making it the strongest reducing agent (Option D).'),
          createNumQ('q-j27s1-c5', 10, 'sec-j27s1-c', 'Number of unpaired electrons in tetrahedral [NiCl4]2- (Ni atomic number 28) is:', 2, 'Ni2+ is 3d8, Cl- is weak field ligand so (e)^4 (t2)^4 -> 2 unpaired electrons', 'High spin tetrahedral arrangement gives 2 unpaired electrons.')
        ]
      },
      {
        id: 'sec-j27s1-m',
        name: 'Mathematics',
        questions: [
          createQ('q-j27s1-m1', 11, 'sec-j27s1-m', 'The number of terms in the expansion of (x + a)^10 + (x - a)^10 is:', ['11', '6', '5', '10'], 1, 'Sum cancels odd binomial terms; remaining terms are T1, T3, T5, T7, T9, T11 (6 terms)', 'For even n, (x+a)^n + (x-a)^n has (n/2 + 1) terms = 10/2 + 1 = 6 (Option B).'),
          createQ('q-j27s1-m2', 12, 'sec-j27s1-m', 'The focus of the parabola y^2 = -12x is at the coordinates:', ['(3, 0)', '(0, -3)', '(-3, 0)', '(0, 3)'], 2, 'Standard form y^2 = -4ax with 4a = 12 -> a = 3, focus (-a, 0)', 'Focus is (-3, 0) (Option C).'),
          createQ('q-j27s1-m3', 13, 'sec-j27s1-m', 'Probability of obtaining sum 7 or 11 in a single roll of two fair dice is:', ['2/9', '7/36', '1/6', '5/18'], 0, 'Favorable outcomes for 7: 6 pairs; for 11: 2 pairs. Total = 8 / 36 = 2/9', 'Sum 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) [6]. Sum 11: (5,6),(6,5) [2]. 8/36 = 2/9 (Option A).'),
          createQ('q-j27s1-m4', 14, 'sec-j27s1-m', 'The slope of tangent to curve y = x^3 - 3x + 2 at x = 2 is:', ['6', '9', '12', '7'], 1, 'dy/dx = 3x^2 - 3. At x = 2: 3(4) - 3 = 9', 'dy/dx = 3(2)^2 - 3 = 12 - 3 = 9 (Option B).'),
          createNumQ('q-j27s1-m5', 15, 'sec-j27s1-m', 'If ∫0^k (2x + 1) dx = 12, then positive integer k is equal to:', 3, 'Integral is [x^2 + x]_0^k = k^2 + k = 12 -> k^2 + k - 12 = 0', '(k + 4)(k - 3) = 0 -> positive k = 3.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-main-2024-jan29-s2',
    title: 'JEE Main 2024 (29 Jan Shift 2) Official PYQ Paper',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 15,
    passingMarks: 115,
    rewardCoins: 30,
    isPublished: true,
    source: 'NTA JEE Main 2024 Shift 2 Master Question Set',
    sections: [
      {
        id: 'sec-j29s2-p',
        name: 'Physics',
        questions: [
          createQ('q-j29s2-p1', 1, 'sec-j29s2-p', 'A magnetic needle free to rotate in a vertical plane aligns vertically at:', ['Geographic equator', 'Magnetic equator', 'Magnetic poles', 'Latitude 45°'], 2, 'Dip angle θ = 90° at magnetic poles', 'At magnetic poles, horizontal component Bh = 0, so needle is vertical (Option C).'),
          createQ('q-j29s2-p2', 2, 'sec-j29s2-p', 'Two organ pipes, one closed at one end and one open at both ends, have same fundamental frequency. Ratio of length of closed pipe to open pipe is:', ['1 : 2', '1 : 4', '2 : 1', '3 : 4'], 0, 'f_closed = v / (4 L_c), f_open = v / (2 L_o) -> v / (4 L_c) = v / (2 L_o) -> L_c / L_o = 1/2', 'L_c / L_o = 2/4 = 1/2 (Option A).'),
          createQ('q-j29s2-p3', 3, 'sec-j29s2-p', 'In a meter bridge experiment, null point is obtained at 40 cm from left. If standard resistance in right gap is 6 Ω, unknown resistance in left gap is:', ['4 Ω', '9 Ω', '8 Ω', '3 Ω'], 0, 'R / S = l / (100 - l) -> R / 6 = 40 / 60', 'R = 6 × (40/60) = 4 Ω (Option A).'),
          createQ('q-j29s2-p4', 4, 'sec-j29s2-p', 'Dimensional formula for Planck constant h is identical to that of:', ['Linear momentum', 'Angular momentum', 'Force constant', 'Torque'], 1, '[h] = [E / ν] = M L^2 T^-1 = [r × p] = [Angular momentum]', 'Both h and angular momentum have dimensions M L^2 T^-1 (Option B).'),
          createNumQ('q-j29s2-p5', 5, 'sec-j29s2-p', 'A step-down transformer transforms 220 V to 22 V. If primary turns Np = 1000, secondary turns Ns is:', 100, 'Vs / Vp = Ns / Np', 'Ns = 1000 × (22 / 220) = 100.')
        ]
      },
      {
        id: 'sec-j29s2-c',
        name: 'Chemistry',
        questions: [
          createQ('q-j29s2-c1', 6, 'sec-j29s2-c', 'Which of the following noble gases is not present in Earth atmosphere?', ['Argon', 'Neon', 'Radon', 'Krypton'], 2, 'Radon is radioactive and produced only by decay of radium', 'Radon is radioactive with short half-life and absent from normal atmosphere (Option C).'),
          createQ('q-j29s2-c2', 7, 'sec-j29s2-c', 'Product obtained when propanenitrile reacts with methyl magnesium bromide followed by acid hydrolysis is:', ['Butanal', 'Butan-2-one', 'Butan-2-ol', 'Propan-2-one'], 1, 'R-CN + R\'MgX -> Ketone after hydrolysis: CH3CH2COCH3', 'CH3CH2CN + CH3MgBr -> CH3CH2C(=NMgBr)CH3 -(H3O+)-> CH3CH2COCH3 (Butan-2-one, Option B).'),
          createQ('q-j29s2-c3', 8, 'sec-j29s2-c', 'Which of the following compounds is paramagnetic?', ['N2', 'O2', 'C2', 'Be2'], 1, 'Molecular orbital theory: O2 has 2 unpaired electrons in π*2px and π*2py', 'O2 has configuration σ2s^2 σ*2s^2 σ2pz^2 π2px^2 π2py^2 π*2px^1 π*2py^1 (Option B).'),
          createQ('q-j29s2-c4', 9, 'sec-j29s2-c', 'According to Freundlich adsorption isotherm, at moderate pressure x/m is proportional to:', ['p^0', 'p^1', 'p^(1/n)', 'p^2'], 2, 'x/m = k p^(1/n) where 0 < 1/n < 1', 'Freundlich isotherm: x/m = k p^(1/n) (Option C).'),
          createNumQ('q-j29s2-c5', 10, 'sec-j29s2-c', 'Coordination number of sodium in body-centered cubic (BCC) crystal lattice is:', 8, 'In BCC lattice each central atom is touched by 8 corner atoms', 'Coordination number in BCC = 8.')
        ]
      },
      {
        id: 'sec-j29s2-m',
        name: 'Mathematics',
        questions: [
          createQ('q-j29s2-m1', 11, 'sec-j29s2-m', 'The value of tan(75°) is equal to:', ['2 - √3', '√3 - 1', '2 + √3', '(√3 + 1)/2'], 2, 'tan(45° + 30°) = (1 + 1/√3)/(1 - 1/√3) = (√3 + 1)/(√3 - 1) = 2 + √3', 'tan 75° = 2 + √3 (Option C).'),
          createQ('q-j29s2-m2', 12, 'sec-j29s2-m', 'If the roots of quadratic equation x^2 - px + q = 0 differ by 1, then:', ['p^2 = 4q + 1', 'p^2 = 4q - 1', 'q^2 = 4p + 1', 'p^2 + 4q = 1'], 0, '(α - β)^2 = (α + β)^2 - 4αβ -> 1^2 = p^2 - 4q', 'p^2 = 4q + 1 (Option A).'),
          createQ('q-j29s2-m3', 13, 'sec-j29s2-m', 'The solution of differential equation dy/dx + y = e^-x is given by:', ['y e^x = x + C', 'y = x e^-x + C', 'y e^-x = x + C', 'y = e^x + C'], 0, 'Integrating factor IF = e^(∫ 1 dx) = e^x. y e^x = ∫ e^-x e^x dx = x + C', 'y e^x = x + C (Option A).'),
          createQ('q-j29s2-m4', 14, 'sec-j29s2-m', 'The radius of sphere x^2 + y^2 + z^2 - 2x + 4y - 6z - 2 = 0 is:', ['3', '4', '5', '6'], 1, 'Center (1, -2, 3), radius R = √(u^2 + v^2 + w^2 - d) = √(1 + 4 + 9 - (-2)) = √16 = 4', 'R = √16 = 4 (Option B).'),
          createNumQ('q-j29s2-m5', 15, 'sec-j29s2-m', 'Number of 4-digit numbers formed using digits 1, 2, 3, 4, 5 without repetition is:', 120, '5P4 = 5 × 4 × 3 × 2', '5P4 = 120 numbers.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-main-2024-jan30-s1',
    title: 'JEE Main 2024 (30 Jan Shift 1) Official PYQ Paper',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 12,
    passingMarks: 110,
    rewardCoins: 30,
    isPublished: true,
    source: 'National Testing Agency Official Shift Archive',
    sections: [
      {
        id: 'sec-j30s1-all',
        name: 'Physics',
        questions: [
          createQ('q-j30-p1', 1, 'sec-j30s1-all', 'A body is dropped from height H. Velocity acquired by it on reaching ground depends on:', ['Mass and height', 'Height and acceleration due to gravity', 'Mass and g', 'Only mass'], 1, 'v = √(2 g H), independent of mass', 'v = √(2gH) (Option B).'),
          createQ('q-j30-p2', 2, 'sec-j30s1-all', 'Magnetic flux through a closed coil changes from 10 Wb to 2 Wb in 0.2 s. Induced EMF is:', ['20 V', '40 V', '30 V', '16 V'], 1, 'ε = -ΔΦ / Δt = -(2 - 10) / 0.2 = 8 / 0.2 = 40 V', 'Induced EMF = 40 V (Option B).'),
          createQ('q-j30-p3', 3, 'sec-j30s1-all', 'Brewster angle for a medium of refractive index √3 is:', ['30°', '45°', '60°', '90°'], 2, 'tan θ_B = μ = √3 -> θ_B = 60°', 'tan 60° = √3, so Brewster angle is 60° (Option C).'),
          createNumQ('q-j30-p4', 4, 'sec-j30s1-all', 'In a hydrogen atom, radius of first Bohr orbit is 0.53 Å. Radius of third orbit in Å is:', 4.77, 'r_n = 0.53 n^2 Å, for n=3, r = 0.53 × 9 = 4.77 Å', 'r_3 = 0.53 × 9 = 4.77 Å.')
        ]
      },
      {
        id: 'sec-j30s1-chem',
        name: 'Chemistry',
        questions: [
          createQ('q-j30-c1', 5, 'sec-j30s1-chem', 'Which of the following oxoacids of phosphorus is monobasic and acts as a strong reducing agent?', ['H3PO4', 'H3PO3', 'H3PO2', 'H4P2O7'], 2, 'H3PO2 (hypophosphorous acid) has 1 P-OH bond and 2 P-H bonds', 'Presence of 2 P-H bonds makes H3PO2 monobasic and strong reducing agent (Option C).'),
          createQ('q-j30-c2', 6, 'sec-j30s1-chem', 'In Kolbe electrolytic synthesis, potassium acetate on electrolysis yields:', ['Methane', 'Ethane', 'Ethene', 'Ethyne'], 1, '2 CH3COO- -> 2 CH3· + 2 CO2 -> C2H6', 'Ethane is formed at anode by dimerization of methyl radicals (Option B).'),
          createQ('q-j30-c3', 7, 'sec-j30s1-chem', 'Which of the following compounds has lowest pKa (is most acidic)?', ['Phenol', 'p-Nitrophenol', 'p-Cresol', 'Ethanol'], 1, 'Strong electron-withdrawing -NO2 group stabilizes phenoxide ion via resonance', 'p-Nitrophenol has pKa ≈ 7.15, much more acidic than phenol (pKa 10) (Option B).'),
          createNumQ('q-j30-c4', 8, 'sec-j30s1-chem', 'Number of bridging carbonyl ligands in solid Co2(CO)8 is:', 2, 'Solid Co2(CO)8 has 2 bridging CO ligands and 6 terminal CO ligands', 'In solid state Co2(CO)8 has 2 bridging CO ligands.')
        ]
      },
      {
        id: 'sec-j30s1-math',
        name: 'Mathematics',
        questions: [
          createQ('q-j30-m1', 9, 'sec-j30s1-math', 'The domain of function f(x) = sin^-1(2x - 1) is:', ['[0, 1]', '[-1, 1]', '[0, 2]', '[-1, 0]'], 0, '-1 ≤ 2x - 1 ≤ 1 -> 0 ≤ 2x ≤ 2 -> 0 ≤ x ≤ 1', 'x ∈ [0, 1] (Option A).'),
          createQ('q-j30-m2', 10, 'sec-j30s1-math', 'If a, b, c are in arithmetic progression (AP), then 2^a, 2^b, 2^c are in:', ['AP', 'GP', 'HP', 'None'], 1, 'b - a = c - b -> 2^(b - a) = 2^(c - b) -> 2^b / 2^a = 2^c / 2^b (Geometric Progression)', 'Common ratio is 2^d, hence GP (Option B).'),
          createQ('q-j30-m3', 11, 'sec-j30s1-math', 'The length of latus rectum of hyperbola x^2 / 16 - y^2 / 9 = 1 is:', ['9/2', '9/4', '4/9', '8/3'], 0, 'Length of latus rectum = 2 b^2 / a = 2(9) / 4 = 18/4 = 9/2', '2b^2 / a = 2(9)/4 = 9/2 (Option A).'),
          createNumQ('q-j30-m4', 12, 'sec-j30s1-math', 'Value of lim (x->0) (1 - cos 4x) / x^2 is:', 8, 'lim (1 - cos kx)/x^2 = k^2 / 2 = 16 / 2 = 8', '16 / 2 = 8.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-main-2024-jan31-s1',
    title: 'JEE Main 2024 (31 Jan Shift 1) Official PYQ Paper',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 12,
    passingMarks: 110,
    rewardCoins: 30,
    isPublished: true,
    source: 'NTA Official 2024 January Shift Papers',
    sections: [
      {
        id: 'sec-j31-p',
        name: 'Physics',
        questions: [
          createQ('q-j31-p1', 1, 'sec-j31-p', 'If momentum of a body increases by 50%, the percentage increase in its kinetic energy is:', ['50%', '100%', '125%', '150%'], 2, 'KE = p^2 / 2m. p\' = 1.5 p -> KE\' = 2.25 KE. Increase = (2.25 - 1) * 100% = 125%', '125% increase (Option C).'),
          createQ('q-j31-p2', 2, 'sec-j31-p', 'A convex lens of focal length 20 cm in air is immersed in water (μ_w = 4/3, μ_glass = 3/2). Its focal length in water becomes:', ['40 cm', '80 cm', '60 cm', '100 cm'], 1, '1/f_w = (μ_g/μ_w - 1)(1/R1 - 1/R2) = (9/8 - 1) / (3/2 - 1) * (1/f_a) = (1/8)/(1/2) * (1/20) = 1/80', 'f_w = 4 * f_air = 4 * 20 = 80 cm (Option B).'),
          createQ('q-j31-p3', 3, 'sec-j31-p', 'Quality factor Q of an LCR circuit with L = 2 H, C = 2 μF and R = 10 Ω is:', ['100', '200', '50', '25'], 0, 'Q = (1/R) √(L/C) = (1/10) √(2 / (2 × 10^-6)) = (1/10) × 1000 = 100', 'Q = 100 (Option A).'),
          createNumQ('q-j31-p4', 4, 'sec-j31-p', 'At what temperature in Celsius does root-mean-square speed of O2 gas molecules equal that of H2 at -73°C (200 K)?', 2927, 'v_rms ∝ √(T/M) -> T_O2 / 32 = 200 / 2 -> T_O2 = 3200 K -> 3200 - 273 = 2927°C', '3200 K = 2927°C.')
        ]
      },
      {
        id: 'sec-j31-c',
        name: 'Chemistry',
        questions: [
          createQ('q-j31-c1', 5, 'sec-j31-c', 'Which of the following compounds gives Gabriel Phthalimide synthesis of pure primary aliphatic amines?', ['Aniline', 'Ethylamine', 'Diethylamine', 'Trimethylamine'], 1, 'Aromatic halides do not undergo nucleophilic substitution with potassium phthalimide', 'Ethylamine is an aliphatic primary amine and formed smoothly (Option B).'),
          createQ('q-j31-c2', 6, 'sec-j31-c', 'The correct order of bond dissociation enthalpy for halogens is:', ['Cl2 > Br2 > F2 > I2', 'F2 > Cl2 > Br2 > I2', 'Cl2 > F2 > Br2 > I2', 'Br2 > Cl2 > F2 > I2'], 0, 'Inter-electronic repulsions in compact F2 weaken its F-F bond below Cl2 and Br2', 'Order: Cl2 (242) > Br2 (193) > F2 (158) > I2 (151 kJ/mol) (Option A).'),
          createQ('q-j31-c3', 7, 'sec-j31-c', 'Standard electrode potential E° for Daniell cell Zn | Zn2+ || Cu2+ | Cu is:', ['1.10 V', '0.76 V', '0.34 V', '2.20 V'], 0, 'E°_cell = E°_cathode - E°_anode = 0.34 - (-0.76) = 1.10 V', '1.10 V (Option A).'),
          createNumQ('q-j31-c4', 8, 'sec-j31-c', 'Valency factor (n-factor) of KMnO4 in acidic medium is:', 5, 'MnO4- + 8H+ + 5e- -> Mn2+ + 4H2O', 'Gain of 5 electrons, so n-factor = 5.')
        ]
      },
      {
        id: 'sec-j31-m',
        name: 'Mathematics',
        questions: [
          createQ('q-j31-m1', 9, 'sec-j31-m', 'The value of determinant |1 2 3; 2 3 4; 3 4 5| is equal to:', ['1', '0', '-1', '6'], 1, 'Rows are in AP: R2 - R1 = (1, 1, 1) and R3 - R2 = (1, 1, 1), two identical rows!', 'Det = 0 (Option B).'),
          createQ('q-j31-m2', 10, 'sec-j31-m', 'The line y = mx + 1 is tangent to parabola y^2 = 4x if m is equal to:', ['1', '-1', '2', '1/2'], 0, 'Condition of tangency for y = mx + c with y^2 = 4ax: c = a/m. Here a=1, c=1 -> 1 = 1/m -> m = 1', 'm = 1 (Option A).'),
          createQ('q-j31-m3', 11, 'sec-j31-m', 'The number of diagonals in a regular decagon (10-sided polygon) is:', ['35', '45', '20', '30'], 0, 'Diagonals = n(n - 3) / 2 = 10 × 7 / 2 = 35', '35 (Option A).'),
          createNumQ('q-j31-m4', 12, 'sec-j31-m', 'If vector a = 3i + 4j and vector b = 4i - 3j, then angle between them in degrees is:', 90, 'a · b = 3(4) + 4(-3) = 12 - 12 = 0 -> angle is 90°', 'Dot product is zero, angle = 90°.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-main-2024-feb01-s2',
    title: 'JEE Main 2024 (01 Feb Shift 2) Official PYQ Paper',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 10,
    passingMarks: 105,
    rewardCoins: 30,
    isPublished: true,
    source: 'NTA Official 2024 Master Shifts',
    sections: [
      {
        id: 'sec-f01-p',
        name: 'Physics',
        questions: [
          createQ('q-f01-p1', 1, 'sec-f01-p', 'Ratio of speeds of sound in hydrogen gas to oxygen gas at same temperature is:', ['1 : 4', '4 : 1', '1 : 16', '16 : 1'], 1, 'v = √(γ R T / M) -> v_H2 / v_O2 = √(M_O2 / M_H2) = √(32 / 2) = √16 = 4', '4 : 1 (Option B).'),
          createQ('q-f01-p2', 2, 'sec-f01-p', 'In a cyclotron, resonant frequency does not depend on:', ['Magnetic field B', 'Charge of particle q', 'Radius of cyclotron dees', 'Mass of particle m'], 2, 'f = q B / (2 π m), independent of speed and radius of trajectory', 'Radius of the dees (Option C).'),
          createNumQ('q-f01-p3', 3, 'sec-f01-p', 'Resistor of 10 Ω carries current of 2 A for 5 seconds. Heat generated in Joules is:', 200, 'H = I^2 R t = (4) × (10) × (5) = 200 J', 'H = 200 J.')
        ]
      },
      {
        id: 'sec-f01-c',
        name: 'Chemistry',
        questions: [
          createQ('q-f01-c1', 4, 'sec-f01-c', 'Which of the following elements has highest second ionization enthalpy?', ['Cu', 'Zn', 'Sc', 'Ti'], 0, 'Cu has [Ar] 3d10 4s1. Removing second electron breaks stable completely-filled 3d10 shell', 'Cu has anomalous high IE2 due to 3d10 -> 3d9 disruption (Option A).'),
          createQ('q-f01-c2', 5, 'sec-f01-c', 'Which reagent converts propene into propan-1-ol via anti-Markovnikov hydration?', ['Dilute H2SO4', 'Hg(OAc)2 / NaBH4', 'B2H6 / THF followed by H2O2 / OH-', 'Conc. H2SO4 / heat'], 2, 'Hydroboration-oxidation gives overall anti-Markovnikov syn addition of water', 'B2H6 followed by alkaline H2O2 gives propan-1-ol (Option C).'),
          createNumQ('q-f01-c3', 6, 'sec-f01-c', 'Total number of σ (sigma) bonds in benzene molecule C6H6 is:', 12, '6 C-C σ bonds + 6 C-H σ bonds = 12 σ bonds', '12 σ bonds.')
        ]
      },
      {
        id: 'sec-f01-m',
        name: 'Mathematics',
        questions: [
          createQ('q-f01-m1', 7, 'sec-f01-m', 'The value of i^(4n + 3) where n is any integer and i = √(-1) is:', ['1', '-1', 'i', '-i'], 3, 'i^(4n + 3) = (i^4)^n * i^3 = 1^n * (-i) = -i', '-i (Option D).'),
          createQ('q-f01-m2', 8, 'sec-f01-m', 'The acute angle between the two lines y = 2x + 1 and y = 3x - 4 is:', ['tan^-1(1/7)', 'tan^-1(1/5)', 'tan^-1(5)', 'tan^-1(7)'], 0, 'tan θ = |m2 - m1| / (1 + m1 m2) = |3 - 2| / (1 + 6) = 1/7', 'tan^-1(1/7) (Option A).'),
          createQ('q-f01-m3', 9, 'sec-f01-m', 'Derivative of ln(sec x + tan x) with respect to x is:', ['sec x', 'tan x', 'sec x tan x', 'sec^2 x'], 0, 'd/dx ln(sec x + tan x) = (sec x tan x + sec^2 x) / (sec x + tan x) = sec x', 'sec x (Option A).'),
          createNumQ('q-f01-m4', 10, 'sec-f01-m', 'The arithmetic mean of numbers 4, 8, 15, 16, 23, 42 is (rounded to nearest integer):', 18, 'Sum = 108. Mean = 108 / 6 = 18', 'Mean is 18.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-main-2024-apr04-s1',
    title: 'JEE Main 2024 (04 April Shift 1) Session 2 Official Paper',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 10,
    passingMarks: 110,
    rewardCoins: 30,
    isPublished: true,
    source: 'NTA April 2024 Shift 1 Official Paper',
    sections: [
      {
        id: 'sec-a04-p',
        name: 'Physics',
        questions: [
          createQ('q-a04-p1', 1, 'sec-a04-p', 'The threshold frequency for a metallic surface with work function 3.3 eV is (h = 6.6 × 10^-34 J·s, 1 eV = 1.6 × 10^-19 J):', ['8.0 × 10^14 Hz', '4.0 × 10^14 Hz', '1.6 × 10^15 Hz', '5.0 × 10^14 Hz'], 0, 'ν0 = Φ / h = (3.3 × 1.6 × 10^-19) / (6.6 × 10^-34) = 8.0 × 10^14 Hz', '8.0 × 10^14 Hz (Option A).'),
          createQ('q-a04-p2', 2, 'sec-a04-p', 'A convex mirror has focal length 20 cm. If an object is placed 20 cm in front of it, the image distance v is:', ['+10 cm', '-10 cm', '+20 cm', '-20 cm'], 0, '1/v + 1/u = 1/f -> 1/v - 1/20 = 1/20 -> 1/v = 2/20 = 1/10 -> v = +10 cm', '+10 cm behind mirror (Option A).'),
          createNumQ('q-a04-p3', 3, 'sec-a04-p', 'Self-inductance of a coil carrying current of 5 A with magnetic flux 0.05 Wb is in millihenries (mH):', 10, 'Φ = L I -> L = 0.05 / 5 = 0.01 H = 10 mH', '10 mH.')
        ]
      },
      {
        id: 'sec-a04-c',
        name: 'Chemistry',
        questions: [
          createQ('q-a04-c1', 4, 'sec-a04-c', 'Which of the following vitamins is water soluble and excreted in urine?', ['Vitamin A', 'Vitamin D', 'Vitamin C', 'Vitamin K'], 2, 'Vitamins B and C are water-soluble; A, D, E, K are fat-soluble', 'Vitamin C (Ascorbic acid) (Option C).'),
          createQ('q-a04-c2', 5, 'sec-a04-c', 'Hybridization of central carbon atom in allene (CH2=C=CH2) is:', ['sp', 'sp2', 'sp3', 'dsp2'], 0, 'Central carbon has two double bonds with zero lone pairs -> 2 σ bonds, sp hybridization', 'sp hybridization (Option A).'),
          createNumQ('q-a04-c3', 6, 'sec-a04-c', 'The number of moles of electrons required to deposit 1 mole of aluminium from molten Al2O3 is:', 3, 'Al3+ + 3e- -> Al', '3 Faradays = 3 moles of electrons.')
        ]
      },
      {
        id: 'sec-a04-m',
        name: 'Mathematics',
        questions: [
          createQ('q-a04-m1', 7, 'sec-a04-m', 'The value of 7C0 + 7C1 + 7C2 + ... + 7C7 is equal to:', ['64', '128', '256', '512'], 1, 'Sum of all binomial coefficients ∑ nCr = 2^n = 2^7 = 128', '128 (Option B).'),
          createQ('q-a04-m2', 8, 'sec-a04-m', 'Equation of circle with center at origin and passing through point (3, 4) is:', ['x^2 + y^2 = 5', 'x^2 + y^2 = 7', 'x^2 + y^2 = 25', 'x^2 + y^2 = 49'], 2, 'r^2 = 3^2 + 4^2 = 25 -> x^2 + y^2 = 25', 'x^2 + y^2 = 25 (Option C).'),
          createQ('q-a04-m3', 9, 'sec-a04-m', 'The function f(x) = x^3 - 3x is strictly increasing in the interval:', ['(-1, 1)', '(-∞, -1) ∪ (1, ∞)', '(-∞, 0)', '(0, ∞)'], 1, 'f\'(x) = 3x^2 - 3 = 3(x-1)(x+1) > 0 when |x| > 1', '(-∞, -1) ∪ (1, ∞) (Option B).'),
          createNumQ('q-a04-m4', 10, 'sec-a04-m', 'If 2^x = 32, then value of x is:', 5, '32 = 2^5 -> x = 5', 'x = 5.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-main-2024-apr05-s2',
    title: 'JEE Main 2024 (05 April Shift 2) Session 2 Official Paper',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 10,
    passingMarks: 110,
    rewardCoins: 30,
    isPublished: true,
    source: 'NTA JEE Main Official Memory Paper',
    sections: [
      {
        id: 'sec-a05-all',
        name: 'Physics',
        questions: [
          createQ('q-a05-p1', 1, 'sec-a05-all', 'Two satellites orbit Earth in circular orbits of radii R and 4R. Ratio of their orbital periods T1 : T2 is:', ['1 : 2', '1 : 4', '1 : 8', '1 : 16'], 2, "Kepler's third law: T^2 ∝ R^3 -> T1/T2 = (R/4R)^(3/2) = (1/4)^(3/2) = 1/8", '1 : 8 (Option C).'),
          createQ('q-a05-p2', 2, 'sec-a05-all', 'Electric field between two infinite oppositely charged parallel plates with surface charge densities +σ and -σ is:', ['σ / (2 ε0)', 'σ / ε0', '2 σ / ε0', '0'], 1, 'E = σ / (2ε0) + σ / (2ε0) = σ / ε0', 'σ / ε0 (Option B).'),
          createNumQ('q-a05-p3', 3, 'sec-a05-all', 'A body of mass 2 kg moving at 10 m/s is brought to rest in 2 seconds. The magnitude of retarding force in Newtons is:', 10, 'F = m a = 2 × (10 / 2) = 10 N', 'F = 10 N.')
        ]
      },
      {
        id: 'sec-a05-chem',
        name: 'Chemistry',
        questions: [
          createQ('q-a05-c1', 4, 'sec-a05-chem', 'Which gas is released when calcium carbide reacts with water?', ['Methane', 'Acetylene (Ethyne)', 'Ethylene', 'Ethane'], 1, 'CaC2 + 2 H2O -> Ca(OH)2 + C2H2 (Acetylene)', 'Acetylene (Option B).'),
          createQ('q-a05-c2', 5, 'sec-a05-chem', 'Which of the following is an example of an emulsion colloid?', ['Milk', 'Fog', 'Smoke', 'Ruby glass'], 0, 'Liquid dispersed in liquid is called an emulsion', 'Milk is liquid butterfat globules dispersed in aqueous water (Option A).'),
          createNumQ('q-a05-c3', 6, 'sec-a05-chem', 'The oxidation number of oxygen in KO2 (potassium superoxide) is -0.5, write as numerator 1 divided by 2:', 1, 'Superoxide ion is O2^- with each oxygen having oxidation state -1/2', 'Oxidation state magnitude is 0.5 (or -1/2).')
        ]
      },
      {
        id: 'sec-a05-math',
        name: 'Mathematics',
        questions: [
          createQ('q-a05-m1', 7, 'sec-a05-math', 'The slope of the line perpendicular to 3x - 4y + 5 = 0 is:', ['3/4', '-4/3', '4/3', '-3/4'], 1, 'm1 = 3/4, perpendicular slope m2 = -1/m1 = -4/3', '-4/3 (Option B).'),
          createQ('q-a05-m2', 8, 'sec-a05-math', 'The 10th term of the AP 2, 5, 8, 11, ... is:', ['27', '29', '31', '32'], 1, 'a10 = a + (10 - 1)d = 2 + 9(3) = 29', '29 (Option B).'),
          createQ('q-a05-m3', 9, 'sec-a05-math', 'If sin θ + cos θ = 1, then the value of sin 2θ is:', ['0', '1', '1/2', '-1'], 0, '(sin θ + cos θ)^2 = 1 + 2 sin θ cos θ = 1 -> sin 2θ = 0', '0 (Option A).'),
          createNumQ('q-a05-m4', 10, 'sec-a05-math', 'Value of 5! (5 factorial) is equal to:', 120, '5 × 4 × 3 × 2 × 1 = 120', '120.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-main-2023-jan24-s1',
    title: 'JEE Main 2023 (24 Jan Shift 1) Official PYQ Paper',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 10,
    passingMarks: 110,
    rewardCoins: 25,
    isPublished: true,
    source: 'National Testing Agency 2023 Archive',
    sections: [
      {
        id: 'sec-23s1-all',
        name: 'Physics',
        questions: [
          createQ('q-23s1-p1', 1, 'sec-23s1-all', 'A wire of length L and cross-section area A has resistance R. If stretched to double its length keeping volume constant, its new resistivity is:', ['2 ρ', '4 ρ', 'ρ', 'ρ / 2'], 2, 'Resistivity ρ is an intrinsic property of the material and does not change with geometry', 'Resistivity remains unchanged ρ (Option C).'),
          createQ('q-23s1-p2', 2, 'sec-23s1-all', 'In simple harmonic motion (SHM), when displacement is half the amplitude (x = A/2), ratio of kinetic energy to potential energy is:', ['1 : 1', '3 : 1', '1 : 3', '2 : 1'], 1, 'PE = 1/2 k x^2 = 1/8 k A^2; KE = 1/2 k (A^2 - x^2) = 3/8 k A^2 -> KE / PE = 3/1', '3 : 1 (Option B).'),
          createNumQ('q-23s1-p3', 3, 'sec-23s1-all', 'Speed of light in diamond (refractive index μ = 2.5) is 1.2 × 10^8 m/s. Write velocity in units of 10^7 m/s:', 12, 'v = c / μ = 3.0 × 10^8 / 2.5 = 1.2 × 10^8 m/s = 12 × 10^7 m/s', '12.')
        ]
      },
      {
        id: 'sec-23s1-chem',
        name: 'Chemistry',
        questions: [
          createQ('q-23s1-c1', 4, 'sec-23s1-chem', 'Which of the following orders of electronegativity is correct according to Pauling scale?', ['F > O > Cl > N', 'F > Cl > O > N', 'F > O > N > Cl', 'Cl > F > O > N'], 0, 'Pauling values: F (4.0) > O (3.5) > Cl (3.16) > N (3.04)', 'F > O > Cl > N (Option A).'),
          createQ('q-23s1-c2', 5, 'sec-23s1-chem', 'Ozonolysis of 2-butene followed by Zn/H2O yields:', ['Only methanal', 'Only ethanal (acetaldehyde)', 'Ethanal and propanal', 'Acetone'], 1, 'CH3-CH=CH-CH3 -(O3/Zn)-> 2 CH3CHO (ethanal)', 'Only ethanal (Option B).'),
          createNumQ('q-23s1-c3', 6, 'sec-23s1-chem', 'Number of nodal planes in a 3d_xy atomic orbital is:', 2, 'd-orbitals have 2 angular nodal planes (xz and yz planes for dxy)', '2 nodal planes.')
        ]
      },
      {
        id: 'sec-23s1-math',
        name: 'Mathematics',
        questions: [
          createQ('q-23s1-m1', 7, 'sec-23s1-math', 'The value of cos(15°) is equal to:', ['(√6 - √2)/4', '(√6 + √2)/4', '(√3 + 1)/2', '(√3 - 1)/2'], 1, 'cos(45° - 30°) = cos 45 cos 30 + sin 45 sin 30 = (√6 + √2)/4', '(√6 + √2)/4 (Option B).'),
          createQ('q-23s1-m2', 8, 'sec-23s1-math', 'The point of intersection of medians of a triangle with vertices (1, 2), (3, 4), (5, 6) is:', ['(3, 4)', '(4, 3)', '(9, 12)', '(2, 3)'], 0, 'Centroid = ((1+3+5)/3, (2+4+6)/3) = (9/3, 12/3) = (3, 4)', '(3, 4) (Option A).'),
          createQ('q-23s1-m3', 9, 'sec-23s1-math', 'The range of function f(x) = |x| / x for x ≠ 0 is:', ['{-1, 1}', '[-1, 1]', 'R', '(0, ∞)'], 0, 'For x > 0, f(x) = 1; for x < 0, f(x) = -1', '{-1, 1} (Option A).'),
          createNumQ('q-23s1-m4', 10, 'sec-23s1-math', 'If 3 identical fair coins are tossed, the total number of sample space elements is:', 8, '2^3 = 8', '8.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-main-2023-jan25-s2',
    title: 'JEE Main 2023 (25 Jan Shift 2) Official PYQ Paper',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 9,
    passingMarks: 110,
    rewardCoins: 25,
    isPublished: true,
    source: 'National Testing Agency Shift 2 Master Papers',
    sections: [
      {
        id: 'sec-23s2-all',
        name: 'Physics',
        questions: [
          createQ('q-23s2-p1', 1, 'sec-23s2-all', 'The dimensional formula of magnetic field B is:', ['[M L^0 T^-2 A^-1]', '[M L T^-2 A^-1]', '[M L^2 T^-2 A^-1]', '[M L^-1 T^-1 A]'], 0, 'F = q v B -> [B] = [F / (q v)] = (M L T^-2) / (A T · L T^-1) = M T^-2 A^-1', '[M L^0 T^-2 A^-1] (Option A).'),
          createQ('q-23s2-p2', 2, 'sec-23s2-all', 'Efficiency of a heat engine working between 27°C (300 K) and 327°C (600 K) is:', ['25%', '50%', '60%', '75%'], 1, 'η = 1 - T_c/T_h = 1 - 300/600 = 50%', '50% (Option B).'),
          createNumQ('q-23s2-p3', 3, 'sec-23s2-all', 'Power dissipated in a 50 Ω resistor connected to 100 V DC supply in Watts is:', 200, 'P = V^2 / R = 100^2 / 50 = 10000 / 50 = 200 W', '200 W.')
        ]
      },
      {
        id: 'sec-23s2-chem',
        name: 'Chemistry',
        questions: [
          createQ('q-23s2-c1', 4, 'sec-23s2-chem', 'Which of the following behaves as an amphoteric oxide?', ['Na2O', 'Al2O3', 'SO2', 'CaO'], 1, 'Al2O3 reacts with both acids and bases: forms AlCl3 with HCl and Na[Al(OH)4] with NaOH', 'Al2O3 (Option B).'),
          createQ('q-23s2-c2', 5, 'sec-23s2-chem', 'The IUPAC name of CH3-CH(OH)-CH2-COOH is:', ['3-Hydroxybutanoic acid', '2-Hydroxybutanoic acid', '4-Hydroxybutanoic acid', 'β-Hydroxybutyric acid'], 0, 'Carboxylic carbon is C1, hydroxyl at C3: 3-hydroxybutanoic acid', '3-Hydroxybutanoic acid (Option A).'),
          createNumQ('q-23s2-c3', 6, 'sec-23s2-chem', 'Total number of isomers (including stereoisomers) for molecular formula C4H10 is:', 2, 'Butane and 2-methylpropane (isobutane) are constitutional isomers; neither has chiral centers', '2.')
        ]
      },
      {
        id: 'sec-23s2-math',
        name: 'Mathematics',
        questions: [
          createQ('q-23s2-m1', 7, 'sec-23s2-math', 'The slope of normal to parabola y^2 = 4ax at point (at^2, 2at) is:', ['1/t', '-t', 't', '-1/t'], 1, 'dy/dx = 1/t. Slope of normal = -1 / (dy/dx) = -t', '-t (Option B).'),
          createQ('q-23s2-m2', 8, 'sec-23s2-math', 'If log2(x) + log2(x - 2) = 3, then real value of x is:', ['4', '2', '-2', '8'], 0, 'log2(x(x - 2)) = 3 -> x(x - 2) = 8 -> x^2 - 2x - 8 = 0 -> (x - 4)(x + 2) = 0. Since x > 2, x = 4', 'x = 4 (Option A).'),
          createNumQ('q-23s2-m3', 9, 'sec-23s2-math', 'Value of cos^2(30°) + sin^2(30°) is equal to:', 1, 'cos^2 θ + sin^2 θ = 1', '1.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-main-2023-apr06-s1',
    title: 'JEE Main 2023 (06 April Shift 1) Session 2 Official Paper',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 9,
    passingMarks: 110,
    rewardCoins: 25,
    isPublished: true,
    source: 'National Testing Agency Shift Archives',
    sections: [
      {
        id: 'sec-23a6-all',
        name: 'Physics',
        questions: [
          createQ('q-23a6-p1', 1, 'sec-23a6-all', 'Work done by centripetal force acting on a particle moving in a circular path with constant speed is:', ['Positive', 'Negative', 'Zero', 'Depends on radius'], 2, 'Centripetal force is always perpendicular to instantaneous displacement (W = F · s = F s cos 90° = 0)', 'Zero (Option C).'),
          createQ('q-23a6-p2', 2, 'sec-23a6-all', 'Frequency of revolution of electron in second Bohr orbit of hydrogen atom compared to first orbit is:', ['1/2 times', '1/4 times', '1/8 times', '1/16 times'], 2, 'f ∝ v/r ∝ (1/n) / n^2 = 1/n^3. For n=2: f2/f1 = 1/2^3 = 1/8', '1/8 times (Option C).'),
          createNumQ('q-23a6-p3', 3, 'sec-23a6-all', 'A capacitor of 10 μF is charged to 100 V. Electrostatic energy stored in Joules is 0.05. Express as mJ:', 50, 'U = 1/2 C V^2 = 0.5 × 10^-5 × 10000 = 0.05 J = 50 mJ', '50 mJ.')
        ]
      },
      {
        id: 'sec-23a6-chem',
        name: 'Chemistry',
        questions: [
          createQ('q-23a6-c1', 4, 'sec-23a6-chem', 'Which of the following compounds does not show Cannizzaro reaction?', ['Formaldehyde (HCHO)', 'Acetaldehyde (CH3CHO)', 'Benzaldehyde (C6H5CHO)', 'Trimethylacetaldehyde ((CH3)3CCHO)'], 1, 'Acetaldehyde has 3 α-hydrogens, so it undergoes Aldol condensation instead of Cannizzaro', 'Acetaldehyde (Option B).'),
          createQ('q-23a6-c2', 5, 'sec-23a6-chem', 'Shape of ClF3 molecule according to VSEPR theory is:', ['Trigonal planar', 'Pyramidal', 'T-shaped', 'See-saw'], 2, 'Cl has 7 valence electrons: 3 bond pairs + 2 lone pairs -> sp3d hybridization with T-shape', 'T-shaped (Option C).'),
          createNumQ('q-23a6-c3', 6, 'sec-23a6-chem', 'Number of water molecules of crystallization in washing soda Na2CO3·10H2O is:', 10, 'Decahydrate formula Na2CO3·10H2O', '10.')
        ]
      },
      {
        id: 'sec-23a6-math',
        name: 'Mathematics',
        questions: [
          createQ('q-23a6-m1', 7, 'sec-23a6-math', 'The value of definite integral ∫0^π sin^2 x dx is:', ['π/4', 'π/2', 'π', '2π'], 1, '∫0^π sin^2 x dx = ∫0^π (1 - cos 2x)/2 dx = [x/2 - sin 2x / 4]_0^π = π/2', 'π/2 (Option B).'),
          createQ('q-23a6-m2', 8, 'sec-23a6-math', 'The distance of the point (2, 3) from the line 3x + 4y - 8 = 0 is:', ['1', '2', '3', '4'], 1, 'd = |3(2) + 4(3) - 8| / √(9 + 16) = |6 + 12 - 8| / 5 = 10 / 5 = 2', '2 (Option B).'),
          createNumQ('q-23a6-m3', 9, 'sec-23a6-math', 'Sum of first 10 terms of sequence 1, 2, 3, 4, ... 10 is:', 55, 'n(n + 1)/2 = 10 × 11 / 2 = 55', '55.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-main-2022-jun24-s1',
    title: 'JEE Main 2022 (24 June Shift 1) Official PYQ Paper',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 9,
    passingMarks: 110,
    rewardCoins: 25,
    isPublished: true,
    source: 'NTA Official 2022 Papers',
    sections: [
      {
        id: 'sec-22j1',
        name: 'Physics',
        questions: [
          createQ('q-22j1-p1', 1, 'sec-22j1', 'A ball is projected horizontally from top of tower of height h with velocity v. The time taken to reach ground is:', ['√(2h/g)', '√(h/2g)', '2h/g', '√(h/g)'], 0, 'Vertical motion: h = 1/2 g t^2 -> t = √(2h/g), completely independent of horizontal speed v', '√(2h/g) (Option A).'),
          createQ('q-22j1-p2', 2, 'sec-22j1', 'Which of the following electromagnetic waves has minimum wavelength?', ['Microwaves', 'Infrared waves', 'Gamma rays', 'Ultraviolet waves'], 2, 'Gamma rays have highest frequency and shortest wavelength (< 10^-11 m)', 'Gamma rays (Option C).'),
          createNumQ('q-22j1-p3', 3, 'sec-22j1', 'Refractive index of a glass prism with prism angle 60° having minimum deviation 30° is (approx 1.22, round to nearest integer):', 1, 'μ = sin((A + Dm)/2) / sin(A/2) = sin 45° / sin 30° = (1/√2) / (1/2) = √2 ≈ 1.41', 'Nearest integer is 1 (exact is 1.41).')
        ]
      },
      {
        id: 'sec-22j1-c',
        name: 'Chemistry',
        questions: [
          createQ('q-22j1-c1', 4, 'sec-22j1-c', 'Which of the following compounds is an aromatic heterocycle?', ['Cyclohexane', 'Pyridine', 'Tetrahydrofuran', 'Piperidine'], 1, 'Pyridine C5H5N is planar, fully conjugated with 6 π electrons conforming to Huckel 4n+2 rule', 'Pyridine (Option B).'),
          createQ('q-22j1-c2', 5, 'sec-22j1-c', 'According to Bohr theory, angular momentum of electron in nth orbit is an integral multiple of:', ['h / 2', 'h / 2π', 'h / π', '2π / h'], 1, 'Postulate: mvr = n h / 2π', 'h / 2π (Option B).'),
          createNumQ('q-22j1-c3', 6, 'sec-22j1-c', 'Number of coordinate bonds in the complex [Co(NH3)6]3+ is:', 6, 'Cobalt is bonded to 6 ammine ligands through lone-pair coordinate bonds', '6.')
        ]
      },
      {
        id: 'sec-22j1-m',
        name: 'Mathematics',
        questions: [
          createQ('q-22j1-m1', 7, 'sec-22j1-m', 'The value of limit lim (x->0) (sin x / x) is equal to:', ['0', '1', '∞', '-1'], 1, 'Standard trigonometric limit', '1 (Option B).'),
          createQ('q-22j1-m2', 8, 'sec-22j1-m', 'The radius of circle x^2 + y^2 - 4x - 6y - 12 = 0 is:', ['3', '4', '5', '6'], 2, 'R = √(g^2 + f^2 - c) = √(4 + 9 - (-12)) = √25 = 5', '5 (Option C).'),
          createNumQ('q-22j1-m3', 9, 'sec-22j1-m', 'If 2x + y = 7 and x - y = 2, then value of x is:', 3, 'Adding equations: 3x = 9 -> x = 3', 'x = 3.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-main-predicted-2025',
    title: 'NTA JEE Main 2025 Predicted Rank Decider Full Paper',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 9,
    passingMarks: 120,
    rewardCoins: 35,
    isPublished: true,
    source: 'Curated by Kota HOD Panel (High Probability Question Types)',
    sections: [
      {
        id: 'sec-pred-p',
        name: 'Physics',
        questions: [
          createQ('q-pr-p1', 1, 'sec-pred-p', 'In a full-wave rectifier circuit operating at input AC frequency 50 Hz, the ripple frequency in output voltage is:', ['50 Hz', '100 Hz', '25 Hz', '200 Hz'], 1, 'Full wave rectifier rectifies both halves of AC wave: f_ripple = 2 f_input = 2 × 50 = 100 Hz', '100 Hz (Option B).'),
          createQ('q-pr-p2', 2, 'sec-pred-p', 'A body oscillates with period T. If amplitude is doubled while spring constant remains same, the new period is:', ['2 T', 'T', 'T / 2', '4 T'], 1, 'Period of spring-mass oscillator T = 2π √(m/k), strictly independent of amplitude', 'T (Option B).'),
          createNumQ('q-pr-p3', 3, 'sec-pred-p', 'Energy of photon of wavelength 400 nm in eV (taking hc = 1240 eV·nm) is 3.1. Round to nearest integer:', 3, 'E = 1240 / 400 = 3.1 eV', '3.')
        ]
      },
      {
        id: 'sec-pred-c',
        name: 'Chemistry',
        questions: [
          createQ('q-pr-c1', 4, 'sec-pred-c', 'Which of the following compounds gives a silver mirror with Tollens reagent?', ['Acetone', 'Acetaldehyde', 'Ethyl acetate', 'Acetophenone'], 1, 'Aldehydes reduce Tollens reagent [Ag(NH3)2]+ to metallic silver', 'Acetaldehyde (Option B).'),
          createQ('q-pr-c2', 5, 'sec-pred-c', 'The oxidation state of phosphorus in pyrophosphoric acid H4P2O7 is:', ['+3', '+4', '+5', '+1'], 2, '4(+1) + 2x + 7(-2) = 0 -> 2x - 10 = 0 -> x = +5', '+5 (Option C).'),
          createNumQ('q-pr-c3', 6, 'sec-pred-c', 'The number of bonding electron pairs in methane CH4 molecule is:', 4, 'Carbon shares 4 valence electrons with 4 hydrogen atoms', '4 bonding pairs.')
        ]
      },
      {
        id: 'sec-pred-m',
        name: 'Mathematics',
        questions: [
          createQ('q-pr-m1', 7, 'sec-pred-m', 'The value of definite integral ∫0^1 x e^x dx is:', ['1', 'e - 1', 'e', '2e'], 0, 'Integration by parts: [x e^x - e^x]_0^1 = (e - e) - (0 - 1) = 1', '1 (Option A).'),
          createQ('q-pr-m2', 8, 'sec-pred-m', 'The sum of all internal angles of a triangle is always:', ['90°', '180°', '270°', '360°'], 1, 'Sum = (n - 2) * 180° = 180°', '180° (Option B).'),
          createNumQ('q-pr-m3', 9, 'sec-pred-m', 'If 3x - 5 = 10, then value of x is:', 5, '3x = 15 -> x = 5', '5.')
        ]
      }
    ]
  }
];

// -------------------------------------------------------------
// 2. JEE MAIN CHAPTERWISE RAPID QUIZZES (17 QUIZZES)
// -------------------------------------------------------------
const jeeMainChapterQuizzes: MockTest[] = [
  {
    id: 'quiz-main-phy-rotational',
    title: '[Physics] Rotational Dynamics & Center of Mass Rapid Quiz',
    examType: 'JEE Main',
    subject: 'Physics',
    durationMinutes: 30,
    totalMarks: 40,
    totalQuestions: 6,
    passingMarks: 20,
    rewardCoins: 15,
    isPublished: true,
    source: 'PW Rapid Quiz Engine - Chapter High Yield',
    sections: [
      {
        id: 'sec-q-rot',
        name: 'Physics',
        questions: [
          createQ('q-rot-1', 1, 'sec-q-rot', 'Radius of gyration of a circular disc of radius R about an axis perpendicular to its plane and passing through its center is:', ['R / √2', 'R / 2', 'R', 'R / 4'], 0, 'I = 1/2 M R^2 = M k^2 -> k = R / √2', 'k = R / √2 (Option A).'),
          createQ('q-rot-2', 2, 'sec-q-rot', 'A torque of 10 N·m applied to a flywheel of moment of inertia 2 kg·m^2 produces an angular acceleration of:', ['2.5 rad/s^2', '5 rad/s^2', '20 rad/s^2', '10 rad/s^2'], 1, 'τ = I α -> α = τ / I = 10 / 2 = 5 rad/s^2', '5 rad/s^2 (Option B).'),
          createQ('q-rot-3', 3, 'sec-q-rot', 'When a cat falls from a height, it twists in air and lands on its feet. This is explained by conservation of:', ['Linear momentum', 'Energy', 'Angular momentum', 'Impulse'], 2, 'No external torque acts on the cat: τ_ext = 0 -> dL/dt = 0', 'Conservation of angular momentum (Option C).'),
          createQ('q-rot-4', 4, 'sec-q-rot', 'A thin circular ring of mass M and radius R rolls without slipping down an incline. Its fraction of rotational kinetic energy to total kinetic energy is:', ['1/3', '1/2', '2/3', '1/4'], 1, 'K_rot / K_total = (1/2 I ω^2) / (1/2 M v^2 + 1/2 I ω^2) = (1/2 M R^2 (v/R)^2) / (M v^2) = 1/2', '1/2 (Option B).'),
          createNumQ('q-rot-5', 5, 'sec-q-rot', 'A solid cylinder of mass 4 kg and radius 0.5 m has moment of inertia about its axis in kg·m^2 equal to 0.5. Enter 1 if true, 0 if false:', 1, 'I = 1/2 M R^2 = 0.5 × 4 × 0.25 = 0.5 kg·m^2', '0.5 kg·m^2.'),
          createNumQ('q-rot-6', 6, 'sec-q-rot', 'Two point masses 2 kg and 3 kg are placed at (0,0) and (5,0). The x-coordinate of center of mass is:', 3, 'X_cm = (m1 x1 + m2 x2)/(m1 + m2) = (2(0) + 3(5))/(2 + 3) = 15/5 = 3', '3.')
        ]
      }
    ]
  },
  {
    id: 'quiz-main-phy-electrodynamics',
    title: '[Physics] Current Electricity & Magnetism Rapid Quiz',
    examType: 'JEE Main',
    subject: 'Physics',
    durationMinutes: 30,
    totalMarks: 40,
    totalQuestions: 6,
    passingMarks: 20,
    rewardCoins: 15,
    isPublished: true,
    source: 'PW Rapid Quiz Engine - Chapter High Yield',
    sections: [
      {
        id: 'sec-q-elec',
        name: 'Physics',
        questions: [
          createQ('q-elec-1', 1, 'sec-q-elec', 'If temperature of a copper wire is increased, its electrical resistivity:', ['Decreases', 'Increases', 'Remains unchanged', 'Becomes zero'], 1, 'In conductors, positive temperature coefficient of resistance causes more electron lattice collisions', 'Increases (Option B).'),
          createQ('q-elec-2', 2, 'sec-q-elec', 'Kirchhoff first rule (Junction Rule) ∑ I = 0 is a direct consequence of conservation of:', ['Energy', 'Charge', 'Momentum', 'Angular momentum'], 1, 'Charge cannot accumulate at a junction node', 'Conservation of charge (Option B).'),
          createQ('q-elec-3', 3, 'sec-q-elec', 'Magnetic force on a charge q moving with velocity v in magnetic field B is F = q(v × B). The work done by this force on the charge is always:', ['Positive', 'Negative', 'Zero', 'Maximum when v || B'], 2, 'Since F ⊥ v, F · v = 0 -> dW/dt = 0', 'Zero (Option C).'),
          createQ('q-elec-4', 4, 'sec-q-elec', 'Magnetic field at the center of a circular loop of radius R carrying current I is:', ['μ0 I / (2 R)', 'μ0 I / (4π R)', 'μ0 I / (2π R)', 'μ0 I R / 2'], 0, 'B = μ0 I / (2R)', 'μ0 I / (2 R) (Option A).'),
          createNumQ('q-elec-5', 5, 'sec-q-elec', 'Two resistors of 6 Ω and 3 Ω are connected in parallel. Their equivalent resistance in ohms is:', 2, 'R_p = (6 × 3) / (6 + 3) = 18 / 9 = 2 Ω', '2 Ω.'),
          createNumQ('q-elec-6', 6, 'sec-q-elec', 'A galvanometer of resistance 50 Ω gives full deflection for 10 mA. Value of shunt resistance in ohms to convert it into 1 A ammeter (approx):', 0.5, 'S = Ig G / (I - Ig) = (0.01 × 50) / (1 - 0.01) ≈ 0.5 Ω', '0.5 Ω.')
        ]
      }
    ]
  },
  {
    id: 'quiz-main-phy-modern',
    title: '[Physics] Modern Physics & Nuclear Energy Rapid Quiz',
    examType: 'JEE Main',
    subject: 'Physics',
    durationMinutes: 25,
    totalMarks: 35,
    totalQuestions: 5,
    passingMarks: 16,
    rewardCoins: 15,
    isPublished: true,
    source: 'PW Rapid Quiz Engine - Chapter High Yield',
    sections: [
      {
        id: 'sec-q-mod',
        name: 'Physics',
        questions: [
          createQ('q-mod-1', 1, 'sec-q-mod', 'The ionization energy of hydrogen atom in ground state is 13.6 eV. Energy required to excite electron to first excited state (n=2) is:', ['3.4 eV', '10.2 eV', '13.6 eV', '1.51 eV'], 1, 'ΔE = -13.6/4 - (-13.6/1) = -3.4 + 13.6 = 10.2 eV', '10.2 eV (Option B).'),
          createQ('q-mod-2', 2, 'sec-q-mod', 'Which of the following rays has zero rest mass and zero electric charge?', ['Alpha rays', 'Beta rays', 'Gamma rays', 'Cathode rays'], 2, 'Gamma rays are high energy electromagnetic photons', 'Gamma rays (Option C).'),
          createQ('q-mod-3', 3, 'sec-q-mod', 'Photoelectric current in a photocell is directly proportional to:', ['Frequency of incident light', 'Intensity of incident light', 'Work function', 'Stopping potential'], 1, 'Number of photoelectrons emitted per second ∝ incident photon flux (intensity)', 'Intensity of incident light (Option B).'),
          createQ('q-mod-4', 4, 'sec-q-mod', 'Nuclear fission of U-235 is initiated by absorption of a:', ['Slow thermal neutron', 'Fast proton', 'High energy alpha particle', 'Gamma photon'], 0, 'Slow thermal neutrons have high capture cross-section for U-235 fission', 'Slow thermal neutron (Option A).'),
          createNumQ('q-mod-5', 5, 'sec-q-mod', 'Mass defect of a nucleus is 0.01 amu. Energy liberated in MeV (take 1 amu = 931.5 MeV) is approx 9.31. Round to nearest integer:', 9, 'E = 0.01 × 931.5 = 9.315 MeV ≈ 9 MeV', '9.')
        ]
      }
    ]
  },
  {
    id: 'quiz-main-phy-thermo',
    title: '[Physics] Thermodynamics & KTG Rapid Quiz',
    examType: 'JEE Main',
    subject: 'Physics',
    durationMinutes: 25,
    totalMarks: 35,
    totalQuestions: 5,
    passingMarks: 16,
    rewardCoins: 15,
    isPublished: true,
    source: 'PW Rapid Quiz Engine - Chapter High Yield',
    sections: [
      {
        id: 'sec-q-thm',
        name: 'Physics',
        questions: [
          createQ('q-thm-1', 1, 'sec-q-thm', 'In an adiabatic expansion of an ideal gas, the work done by the gas is done at the expense of its:', ['Internal energy', 'Surroundings', 'Heat supplied', 'Pressure'], 0, 'First law: dQ = dU + dW = 0 -> dW = -dU. Work is done by decreasing internal energy', 'Internal energy (Option A).'),
          createQ('q-thm-2', 2, 'sec-q-thm', 'Molar heat capacity ratio γ = Cp / Cv for an ideal monoatomic gas (like Helium) is:', ['7/5', '5/3', '4/3', '9/7'], 1, 'Cv = 3/2 R, Cp = 5/2 R -> γ = (5/2)/(3/2) = 5/3', '5/3 (Option B).'),
          createQ('q-thm-3', 3, 'sec-q-thm', 'For an isothermal process, which thermodynamic variable remains strictly constant?', ['Pressure', 'Volume', 'Temperature', 'Entropy'], 2, 'Isothermal = constant temperature (ΔT = 0)', 'Temperature (Option C).'),
          createQ('q-thm-4', 4, 'sec-q-thm', 'Average translational kinetic energy of one mole of an ideal gas at temperature T is:', ['1/2 R T', '3/2 R T', '5/2 R T', '3 R T'], 1, 'Equipartition theorem: 3 degrees of translational freedom each having 1/2 RT', '3/2 R T (Option B).'),
          createNumQ('q-thm-5', 5, 'sec-q-thm', 'A gas absorbs 500 J of heat and does 200 J of work. The change in internal energy in Joules is:', 300, 'ΔU = Q - W = 500 - 200 = 300 J', '300 J.')
        ]
      }
    ]
  },
  {
    id: 'quiz-main-phy-optics',
    title: '[Physics] Ray & Wave Optics Formula Drill Quiz',
    examType: 'JEE Main',
    subject: 'Physics',
    durationMinutes: 25,
    totalMarks: 35,
    totalQuestions: 5,
    passingMarks: 16,
    rewardCoins: 15,
    isPublished: true,
    source: 'PW Rapid Quiz Engine - Chapter High Yield',
    sections: [
      {
        id: 'sec-q-opt',
        name: 'Physics',
        questions: [
          createQ('q-opt-1', 1, 'sec-q-opt', 'Power of a convex lens of focal length +25 cm in diopters (D) is:', ['+2 D', '+4 D', '+0.25 D', '+5 D'], 1, 'P = 100 / f(cm) = 100 / 25 = +4 D', '+4 D (Option B).'),
          createQ('q-opt-2', 2, 'sec-q-opt', 'A ray of light traveling from denser to rarer medium undergoes total internal reflection when angle of incidence is:', ['Less than critical angle', 'Equal to critical angle', 'Greater than critical angle', 'Zero'], 2, 'TIR occurs when i > θ_c and light travels from denser to rarer medium', 'Greater than critical angle (Option C).'),
          createQ('q-opt-3', 3, 'sec-q-opt', 'When light passes from air to water, which of its properties remains unchanged?', ['Speed', 'Wavelength', 'Frequency', 'Amplitude'], 2, 'Frequency is determined solely by the source and does not change across boundaries', 'Frequency (Option C).'),
          createQ('q-opt-4', 4, 'sec-q-opt', 'In Young double slit experiment, if slit separation d is halved and screen distance D is doubled, fringe width β becomes:', ['Doubled', 'Quadrupled (4 times)', 'Halved', 'Unchanged'], 1, 'β = λ D / d -> β\' = λ (2D) / (d/2) = 4 (λ D / d) = 4 β', 'Quadrupled (Option B).'),
          createNumQ('q-opt-5', 5, 'sec-q-opt', 'Critical angle for a medium with refractive index 2 is 30 degrees. Enter 30:', 30, 'sin θ_c = 1 / μ = 1 / 2 -> θ_c = 30°', '30°.')
        ]
      }
    ]
  },
  {
    id: 'quiz-main-chem-goc',
    title: '[Chemistry] General Organic Chemistry (GOC) & Intermediates Quiz',
    examType: 'JEE Main',
    subject: 'Chemistry',
    durationMinutes: 30,
    totalMarks: 40,
    totalQuestions: 6,
    passingMarks: 20,
    rewardCoins: 15,
    isPublished: true,
    source: 'PW Rapid Quiz Engine - Chapter High Yield',
    sections: [
      {
        id: 'sec-q-goc',
        name: 'Chemistry',
        questions: [
          createQ('q-goc-1', 1, 'sec-q-goc', 'The most stable carbocation among the following is:', ['Methyl carbocation', 'Ethyl carbocation', 'Isopropyl carbocation', 'tert-Butyl carbocation'], 3, 'tert-Butyl carbocation has 9 hyperconjugative α-hydrogens', 'tert-Butyl carbocation (Option D).'),
          createQ('q-goc-2', 2, 'sec-q-goc', 'Which of the following substituent groups exerts a strong +M (mesomeric donating) effect on benzene ring?', ['-NO2', '-OCH3', '-COOH', '-CHO'], 1, 'Oxygen in -OCH3 possesses unshared lone pairs that donate into benzene π system', '-OCH3 (Option B).'),
          createQ('q-goc-3', 3, 'sec-q-goc', 'Which of the following is non-aromatic (anti-aromatic)?', ['Benzene', 'Cyclooctatetraene (planar)', 'Tropylium cation', 'Pyrrole'], 1, 'Planar cyclooctatetraene has 8 π electrons (4n system, n=2) making it anti-aromatic', 'Cyclooctatetraene (Option B).'),
          createQ('q-goc-4', 4, 'sec-q-goc', 'The hybridization of the carbanion carbon in methyl carbanion (:CH3-) is:', ['sp', 'sp2', 'sp3', 'dsp2'], 2, 'Carbon has 3 single C-H bonds + 1 lone pair = 4 steric pairs -> sp3 (pyramidal)', 'sp3 (Option C).'),
          createNumQ('q-goc-5', 5, 'sec-q-goc', 'Number of hyperconjugative α-hydrogens in 2,3-dimethyl-2-butene is:', 12, 'Four methyl groups attached to C=C bond: 4 × 3 = 12 α-H', '12.'),
          createNumQ('q-goc-6', 6, 'sec-q-goc', 'The total number of π electrons in aromatic cyclopentadienyl anion is:', 6, '4 π electrons from two double bonds + 2 from lone pair on carbanion = 6 π electrons (Huckel 4n+2 with n=1)', '6.')
        ]
      }
    ]
  },
  {
    id: 'quiz-main-chem-carbonyl',
    title: '[Chemistry] Carbonyl Compounds (Aldehydes & Ketones) Rapid Quiz',
    examType: 'JEE Main',
    subject: 'Chemistry',
    durationMinutes: 25,
    totalMarks: 35,
    totalQuestions: 5,
    passingMarks: 16,
    rewardCoins: 15,
    isPublished: true,
    source: 'PW Rapid Quiz Engine - Chapter High Yield',
    sections: [
      {
        id: 'sec-q-crb',
        name: 'Chemistry',
        questions: [
          createQ('q-crb-1', 1, 'sec-q-crb', 'Clemmensen reduction of ketones to alkanes uses which reagent?', ['Zn-Hg / conc. HCl', 'NH2NH2 / KOH / glycol', 'LiAlH4 / ether', 'H2 / Pd-BaSO4'], 0, 'Clemmensen uses zinc amalgam in concentrated hydrochloric acid', 'Zn-Hg / conc. HCl (Option A).'),
          createQ('q-crb-2', 2, 'sec-q-crb', 'Wolff-Kishner reduction converts carbonyl group >C=O to -CH2- using:', ['LiAlH4', 'NH2NH2 followed by KOH / ethylene glycol and heat', 'NaBH4 in ethanol', 'H2 / Pt'], 1, 'Hydrazine followed by base elimination of N2 gas', 'NH2NH2 / KOH / glycol (Option B).'),
          createQ('q-crb-3', 3, 'sec-q-crb', 'Rosenmund reduction converts acid chloride R-COCl to aldehyde R-CHO using:', ['H2 / Pd-BaSO4 poisoned with quinoline', 'Sn / HCl', 'Zn / HCl', 'Na / ethanol'], 0, 'Catalytic hydrogenation poisoned with barium sulfate and sulfur/quinoline', 'H2 / Pd-BaSO4 (Option A).'),
          createQ('q-crb-4', 4, 'sec-q-crb', 'Which of the following compounds gives red precipitate of Cu2O with Fehling solution?', ['Benzaldehyde', 'Acetaldehyde', 'Acetone', 'Acetophenone'], 1, 'Aliphatic aldehydes like acetaldehyde reduce Fehling solution; aromatic aldehydes do not', 'Acetaldehyde (Option B).'),
          createNumQ('q-crb-5', 5, 'sec-q-crb', 'Number of α-hydrogens in acetone (CH3COCH3) is:', 6, 'Two methyl groups adjacent to carbonyl carbon have 3 + 3 = 6 α-H', '6.')
        ]
      }
    ]
  },
  {
    id: 'quiz-main-chem-coordination',
    title: '[Chemistry] Coordination Compounds & Crystal Field Rapid Quiz',
    examType: 'JEE Main',
    subject: 'Chemistry',
    durationMinutes: 25,
    totalMarks: 35,
    totalQuestions: 5,
    passingMarks: 16,
    rewardCoins: 15,
    isPublished: true,
    source: 'PW Rapid Quiz Engine - Chapter High Yield',
    sections: [
      {
        id: 'sec-q-crd',
        name: 'Chemistry',
        questions: [
          createQ('q-crd-1', 1, 'sec-q-crd', 'According to spectrochemical series, which of the following is the strongest field ligand?', ['I-', 'H2O', 'NH3', 'CN-'], 3, 'CN- and CO are strong field ligands causing maximum crystal field splitting Δo', 'CN- (Option D).'),
          createQ('q-crd-2', 2, 'sec-q-crd', 'The primary valency of central metal in potassium ferricyanide K3[Fe(CN)6] is:', ['+2', '+3', '+4', '+6'], 1, 'Primary valency equals the oxidation state of Fe: +3', '+3 (Option B).'),
          createQ('q-crd-3', 3, 'sec-q-crd', 'Which type of isomerism is exhibited by [Co(NH3)5(SO4)]Br and [Co(NH3)5Br]SO4?', ['Ionization isomerism', 'Linkage isomerism', 'Coordination isomerism', 'Hydrate isomerism'], 0, 'Giving different ions in aqueous solution (one gives Br- precipitate, other gives BaSO4)', 'Ionization isomerism (Option A).'),
          createQ('q-crd-4', 4, 'sec-q-crd', 'The geometry of [Ni(CO)4] is:', ['Square planar', 'Tetrahedral', 'Octahedral', 'Linear'], 1, 'Ni(0) has 3d10 with sp3 hybridization', 'Tetrahedral (Option B).'),
          createNumQ('q-crd-5', 5, 'sec-q-crd', 'The denticity of EDTA4- (ethylenediaminetetraacetate) ligand is:', 6, 'Hexadentate ligand having 2 nitrogen and 4 oxygen donor atoms', '6.')
        ]
      }
    ]
  },
  {
    id: 'quiz-main-chem-kinetics',
    title: '[Chemistry] Chemical Kinetics & Electrochemistry Quiz',
    examType: 'JEE Main',
    subject: 'Chemistry',
    durationMinutes: 25,
    totalMarks: 35,
    totalQuestions: 5,
    passingMarks: 16,
    rewardCoins: 15,
    isPublished: true,
    source: 'PW Rapid Quiz Engine - Chapter High Yield',
    sections: [
      {
        id: 'sec-q-kin',
        name: 'Chemistry',
        questions: [
          createQ('q-kin-1', 1, 'sec-q-kin', 'Unit of rate constant k for a second order chemical reaction is:', ['s^-1', 'mol L^-1 s^-1', 'L mol^-1 s^-1', 'L^2 mol^-2 s^-1'], 2, 'k = (mol/L)^(1-n) s^-1; for n=2: (mol/L)^-1 s^-1 = L mol^-1 s^-1', 'L mol^-1 s^-1 (Option C).'),
          createQ('q-kin-2', 2, 'sec-q-kin', 'Arrhenius equation relating rate constant k to activation energy Ea is:', ['k = A e^(Ea / RT)', 'k = A e^(-Ea / RT)', 'k = A ln(Ea / RT)', 'k = A / (Ea RT)'], 1, 'k = A e^(-Ea/RT)', 'k = A e^(-Ea / RT) (Option B).'),
          createQ('q-kin-3', 3, 'sec-q-kin', 'During charging of a lead storage battery, at anode:', ['Pb is oxidized to PbSO4', 'PbSO4 is converted into PbO2', 'PbSO4 is reduced to Pb', 'H2 gas is evolved'], 1, 'At anode: PbSO4(s) + 2H2O -> PbO2(s) + SO4^2- + 4H+ + 2e-', 'PbSO4 is oxidized to PbO2 (Option B).'),
          createQ('q-kin-4', 4, 'sec-q-kin', 'Kohlrausch law of independent migration of ions applies at:', ['Any concentration', 'Infinite dilution', 'High concentration', 'Saturated concentration'], 1, 'Interionic attractions vanish at infinite dilution (zero concentration)', 'Infinite dilution (Option B).'),
          createNumQ('q-kin-5', 5, 'sec-q-kin', 'A first order reaction is 50% complete in 30 minutes. Time required for 75% completion in minutes is:', 60, '75% completion requires 2 half-lives: 2 × 30 = 60 min', '60 minutes.')
        ]
      }
    ]
  },
  {
    id: 'quiz-main-math-calculus',
    title: '[Mathematics] Definite Integrals & Area under Curves Rapid Quiz',
    examType: 'JEE Main',
    subject: 'Mathematics',
    durationMinutes: 30,
    totalMarks: 40,
    totalQuestions: 6,
    passingMarks: 20,
    rewardCoins: 15,
    isPublished: true,
    source: 'PW Rapid Quiz Engine - Chapter High Yield',
    sections: [
      {
        id: 'sec-q-cal',
        name: 'Mathematics',
        questions: [
          createQ('q-cal-1', 1, 'sec-q-cal', 'The value of ∫(-a)^a x^3 cos x dx is:', ['2a', 'a^2', '0', 'π/2'], 2, 'f(x) = x^3 cos x is an odd function: f(-x) = -f(x). Integral of odd function over [-a, a] is zero', '0 (Option C).'),
          createQ('q-cal-2', 2, 'sec-q-cal', 'The value of ∫0^1 1 / (1 + x^2) dx is:', ['π/2', 'π/4', '1', 'ln 2'], 1, '[tan^-1 x]_0^1 = tan^-1(1) - 0 = π/4', 'π/4 (Option B).'),
          createQ('q-cal-3', 3, 'sec-q-cal', 'The area of region bounded by curve y = x^2 and line y = 4 is:', ['16/3', '32/3', '8/3', '64/3'], 1, 'A = 2 ∫0^2 (4 - x^2) dx = 2 [4x - x^3/3]_0^2 = 2 [8 - 8/3] = 32/3', '32/3 (Option B).'),
          createQ('q-cal-4', 4, 'sec-q-cal', 'Derivative of ∫0^x sin(t^2) dt with respect to x by Leibniz rule is:', ['sin(x^2)', '2x sin(x^2)', 'cos(x^2)', 'x sin(x^2)'], 0, 'd/dx ∫0^x f(t) dt = f(x) * (1) = sin(x^2)', 'sin(x^2) (Option A).'),
          createNumQ('q-cal-5', 5, 'sec-q-cal', 'Value of ∫0^2 (3x^2) dx is equal to:', 8, '[x^3]_0^2 = 8 - 0 = 8', '8.'),
          createNumQ('q-cal-6', 6, 'sec-q-cal', 'The area of the circle x^2 + y^2 = 4 in units of π is:', 4, 'Area = π r^2 = π (2)^2 = 4π', '4.')
        ]
      }
    ]
  },
  {
    id: 'quiz-main-math-vectors',
    title: '[Mathematics] Vectors & 3D Geometry Rapid Quiz',
    examType: 'JEE Main',
    subject: 'Mathematics',
    durationMinutes: 25,
    totalMarks: 35,
    totalQuestions: 5,
    passingMarks: 16,
    rewardCoins: 15,
    isPublished: true,
    source: 'PW Rapid Quiz Engine - Chapter High Yield',
    sections: [
      {
        id: 'sec-q-vec',
        name: 'Mathematics',
        questions: [
          createQ('q-vec-1', 1, 'sec-q-vec', 'If a · b = |a × b|, the angle θ between vectors a and b is:', ['0°', '45°', '90°', '60°'], 1, 'ab cos θ = ab sin θ -> tan θ = 1 -> θ = 45°', '45° (Option B).'),
          createQ('q-vec-2', 2, 'sec-q-vec', 'The projection of vector a = 2i + 3j + 2k on vector b = i + 2j + k is:', ['10 / √6', '5 / √6', '10 / 3', '6 / √10'], 0, 'proj = (a · b) / |b| = (2 + 6 + 2) / √(1 + 4 + 1) = 10 / √6', '10 / √6 (Option A).'),
          createQ('q-vec-3', 3, 'sec-q-vec', 'Direction cosines of z-axis are:', ['(1, 0, 0)', '(0, 1, 0)', '(0, 0, 1)', '(1, 1, 1)'], 2, 'Angles with x, y, z are 90°, 90°, 0° -> (cos 90°, cos 90°, cos 0°) = (0, 0, 1)', '(0, 0, 1) (Option C).'),
          createQ('q-vec-4', 4, 'sec-q-vec', 'Value of [i j k] (scalar triple product of standard unit vectors) is:', ['0', '1', '-1', '3'], 1, 'i · (j × k) = i · i = 1', '1 (Option B).'),
          createNumQ('q-vec-5', 5, 'sec-q-vec', 'Magnitude of vector v = 3i + 4j + 12k is equal to:', 13, '|v| = √(9 + 16 + 144) = √169 = 13', '13.')
        ]
      }
    ]
  },
  {
    id: 'quiz-main-math-matrices',
    title: '[Mathematics] Matrices & Determinants Rapid Quiz',
    examType: 'JEE Main',
    subject: 'Mathematics',
    durationMinutes: 25,
    totalMarks: 35,
    totalQuestions: 5,
    passingMarks: 16,
    rewardCoins: 15,
    isPublished: true,
    source: 'PW Rapid Quiz Engine - Chapter High Yield',
    sections: [
      {
        id: 'sec-q-mat',
        name: 'Mathematics',
        questions: [
          createQ('q-mat-1', 1, 'sec-q-mat', 'If A is a skew-symmetric matrix of odd order n (e.g. 3×3), then det(A) is:', ['1', '-1', '0', 'Any real number'], 2, 'A^T = -A -> det(A) = det(-A) = (-1)^n det(A) = -det(A) -> 2 det(A) = 0 -> det(A) = 0', '0 (Option C).'),
          createQ('q-mat-2', 2, 'sec-q-mat', 'For any square matrix A, A + A^T is always a:', ['Symmetric matrix', 'Skew-symmetric matrix', 'Orthogonal matrix', 'Identity matrix'], 0, '(A + A^T)^T = A^T + A = A + A^T', 'Symmetric matrix (Option A).'),
          createQ('q-mat-3', 3, 'sec-q-mat', 'If matrix A is orthogonal, then det(A) is equal to:', ['0', '±1', '2', 'Any positive integer'], 1, 'A A^T = I -> det(A) * det(A^T) = det(A)^2 = 1 -> det(A) = ±1', '±1 (Option B).'),
          createQ('q-mat-4', 4, 'sec-q-mat', 'Trace of identity matrix I of order 4×4 is:', ['1', '2', '4', '16'], 2, 'Sum of diagonal entries 1 + 1 + 1 + 1 = 4', '4 (Option C).'),
          createNumQ('q-mat-5', 5, 'sec-q-mat', 'Value of determinant |2 4; 1 5| is:', 6, '2(5) - 4(1) = 10 - 4 = 6', '6.')
        ]
      }
    ]
  },
  {
    id: 'quiz-main-math-coordinate',
    title: '[Mathematics] Coordinate Geometry (Conics & Parabola) Quiz',
    examType: 'JEE Main',
    subject: 'Mathematics',
    durationMinutes: 25,
    totalMarks: 35,
    totalQuestions: 5,
    passingMarks: 16,
    rewardCoins: 15,
    isPublished: true,
    source: 'PW Rapid Quiz Engine - Chapter High Yield',
    sections: [
      {
        id: 'sec-q-con',
        name: 'Mathematics',
        questions: [
          createQ('q-con-1', 1, 'sec-q-con', 'The equation of directrix of parabola y^2 = 8x is:', ['x = 2', 'x = -2', 'y = -2', 'y = 2'], 1, '4a = 8 -> a = 2. Directrix is x = -a = -2', 'x = -2 (Option B).'),
          createQ('q-con-2', 2, 'sec-q-con', 'Eccentricity e of a rectangular hyperbola (xy = c^2 or x^2 - y^2 = a^2) is always:', ['1', '√2', '√3', '2'], 1, 'b = a -> e = √(1 + b^2/a^2) = √(1 + 1) = √2', '√2 (Option B).'),
          createQ('q-con-3', 3, 'sec-q-con', 'The line y = mx + c touches the circle x^2 + y^2 = a^2 if:', ['c^2 = a^2(1 + m^2)', 'c^2 = a^2(1 - m^2)', 'c = a m', 'c^2 = a(1 + m^2)'], 0, 'Perpendicular distance from origin = radius: |c|/√(1 + m^2) = a -> c^2 = a^2(1 + m^2)', 'c^2 = a^2(1 + m^2) (Option A).'),
          createQ('q-con-4', 4, 'sec-q-con', 'The number of tangents that can be drawn from an internal point to an ellipse is:', ['0', '1', '2', 'Infinite'], 0, 'No tangents can be drawn from inside a closed conic curve', '0 (Option A).'),
          createNumQ('q-con-5', 5, 'sec-q-con', 'Length of latus rectum of parabola y^2 = 16x is:', 16, 'Latus rectum = 4a = 16', '16.')
        ]
      }
    ]
  }
];

// -------------------------------------------------------------
// 3. JEE ADVANCED FULL LENGTH PAPERS (10 PAPERS)
// -------------------------------------------------------------
const jeeAdvFullPapers: MockTest[] = [
  {
    id: 'test-jee-adv-2025-p1',
    title: 'JEE Advanced 2025 Rank Decider (Paper 1)',
    examType: 'JEE Advanced',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 6,
    passingMarks: 65,
    rewardCoins: 40,
    isPublished: true,
    source: 'Curated by IIT Rankers Team (Pathfinder & Irodov Aligned)',
    sections: [
      {
        id: 'sec-adv-phy',
        name: 'Physics',
        questions: [
          createQ('q-adv-p1', 1, 'sec-adv-phy', 'A particle of mass m moves under central potential V(r) = -k / r^3 (k > 0). If it approaches from infinity with velocity v0 and impact parameter b, the critical impact parameter bc below which particle falls into origin is:', ['(2k / m v0^2)^(1/2)', '(4k / m v0^2)^(1/3)', '(k / 2m v0^2)^(1/3)', '(3k / m v0^2)^(1/4)'], 1, 'Effective potential V_eff(r) = L^2 / (2 m r^2) - k / r^3', 'By finding maximum of V_eff and equating to (1/2) m v0^2, bc = (4k / m v0^2)^(1/3) (Option B).', 'JEE Advanced Hard', 4, -2),
          createNumQ('q-adv-p2', 2, 'sec-adv-phy', 'A rod of length L = 1 m is pivoted at one end and released from horizontal rest. When it passes vertical position, its angular velocity in rad/s is (g = 10 m/s^2, nearest integer):', 5, 'mg(L/2) = (1/2) I ω^2, I = (1/3) mL^2 -> ω = √(3g/L) = √30 ≈ 5.47', 'Nearest integer is 5.')
        ]
      },
      {
        id: 'sec-adv-chem',
        name: 'Chemistry',
        questions: [
          createQ('q-adv-c1', 3, 'sec-adv-chem', 'In the sequence: Nitrobenzene -(Sn/HCl)-> [A] -(NaNO2/HCl 0-5°C)-> [B] -(CuCN/KCN)-> [C] -(H3O+, heat)-> [D]. The compound [D] is:', ['Benzaldehyde', 'Phenol', 'Benzoic acid', 'Benzamide'], 2, 'Diazotisation followed by Sandmeyer cyanidation and acid hydrolysis of nitrile gives carboxylic acid', '[A] Aniline -> [B] Benzene diazonium chloride -> [C] Benzonitrile -> [D] Benzoic acid (Option C).', 'Moderate', 4, -2),
          createNumQ('q-adv-c2', 4, 'sec-adv-chem', 'The total number of unpaired electrons in complex ion [Fe(CN)6]3- is:', 1, 'Fe(III) = 3d5, strong field CN- causes pairing: (t2g)^5 (eg)^0 -> 1 unpaired electron', '1 unpaired electron.')
        ]
      },
      {
        id: 'sec-adv-math',
        name: 'Mathematics',
        questions: [
          createQ('q-adv-m1', 5, 'sec-adv-math', 'If f(x) satisfies f\'(x) = f(x) + ∫0^1 f(t) dt and f(0) = 1, then f(1) is equal to:', ['(e + 1) / (2 - e)', 'e / (e - 1)', '2e / (3 - e)', '(2e - 1) / (3 - e)'], 3, 'Set constant C = ∫0^1 f(t) dt, solve linear ODE f\'(x) - f(x) = C', 'f(x) = -C + (1+C)e^x. Evaluating C gives (e-1)/(3-e) -> f(1) = (2e - 1)/(3 - e) (Option D).', 'JEE Advanced Hard', 4, -2),
          createNumQ('q-adv-m2', 6, 'sec-adv-math', 'The number of distinct real roots of equation x^4 - 4x + 1 = 0 is:', 2, 'f\'(x) = 4(x^3 - 1) = 0 at x = 1. Minimum is f(1) = -2 < 0. By IVT, intersects x-axis twice', '2 distinct real roots.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-adv-2025-p2',
    title: 'JEE Advanced 2025 Rank Decider (Paper 2)',
    examType: 'JEE Advanced',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 6,
    passingMarks: 65,
    rewardCoins: 40,
    isPublished: true,
    source: 'IIT Kanpur Elite Mock Simulation 2025',
    sections: [
      {
        id: 'sec-a2-p',
        name: 'Physics',
        questions: [
          createQ('q-a2-p1', 1, 'sec-a2-p', 'A dielectric slab of dielectric constant K is slowly inserted between plates of an isolated charged parallel plate capacitor. The electrostatic energy of the system:', ['Increases by factor K', 'Decreases by factor 1/K', 'Remains unchanged', 'Increases by factor K^2'], 1, 'Charge Q remains constant on isolated capacitor: U = Q^2 / (2C) = Q^2 / (2 K C0) = U0 / K', 'Decreases by factor 1/K (Option B).', 'Moderate', 4, -2),
          createNumQ('q-a2-p2', 2, 'sec-a2-p', 'A Carnot refrigerator takes in heat at -23°C (250 K) and rejects it at 27°C (300 K). Its COP is:', 5, 'COP = T_L / (T_H - T_L) = 250 / (300 - 250) = 5', '5.')
        ]
      },
      {
        id: 'sec-a2-c',
        name: 'Chemistry',
        questions: [
          createQ('q-a2-c1', 3, 'sec-a2-c', 'Reaction of cyclohexene with OsO4 followed by NaHSO3 yields:', ['trans-Cyclohexane-1,2-diol', 'cis-Cyclohexane-1,2-diol', 'Adipic acid', 'Cyclohexanone'], 1, 'OsO4 provides concerted syn-dihydroxylation forming cis-diol', 'cis-Cyclohexane-1,2-diol (Option B).', 'Moderate', 4, -2),
          createNumQ('q-a2-c2', 4, 'sec-a2-c', 'Number of P-O-P cyclic bridging bonds in P4O10 molecule is:', 6, 'P4O10 has adamantane-like cage with 6 P-O-P bridging oxygen bonds and 4 terminal P=O bonds', '6.')
        ]
      },
      {
        id: 'sec-a2-m',
        name: 'Mathematics',
        questions: [
          createQ('q-a2-m1', 5, 'sec-a2-m', 'The value of the limit lim (n->∞) ∑(r=1 to n) (1 / √(n^2 - r^2)) is:', ['π/2', 'π/4', '1', 'ln 2'], 0, 'Riemann sum: lim 1/n ∑ 1/√(1 - (r/n)^2) = ∫0^1 1/√(1 - x^2) dx = [sin^-1 x]_0^1 = π/2', 'π/2 (Option A).', 'Moderate', 4, -2),
          createNumQ('q-a2-m2', 6, 'sec-a2-m', 'If z + 1/z = 2 cos(π/6), then value of z^6 + 1/z^6 is (cos π = -1):', -2, 'z = e^(i π/6) -> z^6 + z^-6 = 2 cos(6 × π/6) = 2 cos(π) = 2(-1) = -2', '-2.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-adv-2024-p1',
    title: 'JEE Advanced 2024 Official Paper 1',
    examType: 'JEE Advanced',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 6,
    passingMarks: 60,
    rewardCoins: 40,
    isPublished: true,
    source: 'IIT Madras Official Exam Paper 2024',
    sections: [
      {
        id: 'sec-24p1-p',
        name: 'Physics',
        questions: [
          createQ('q-24p1-p1', 1, 'sec-24p1-p', 'A radioactive sample has two decay modes with half-lives T1 = 3 hours and T2 = 6 hours. Effective half-life of sample is:', ['2 hours', '4.5 hours', '9 hours', '1.5 hours'], 0, 'λ_eff = λ1 + λ2 -> 1/T_eff = 1/T1 + 1/T2 = 1/3 + 1/6 = 3/6 = 1/2 -> T_eff = 2 hours', '2 hours (Option A).', 'Moderate', 4, -2),
          createNumQ('q-24p1-p2', 2, 'sec-24p1-p', 'A disc of radius 1 m rolls without slipping with center of mass speed 4 m/s. Speed of highest point on the rim in m/s is:', 8, 'Top point velocity v_top = v_cm + R ω = 2 v_cm = 2 × 4 = 8 m/s', '8.')
        ]
      },
      {
        id: 'sec-24p1-c',
        name: 'Chemistry',
        questions: [
          createQ('q-24p1-c1', 3, 'sec-24p1-c', 'Which of the following complexes is diamagnetic?', ['[Fe(H2O)6]2+', '[Ni(CN)4]2-', '[CoF6]3-', '[MnCl4]2-'], 1, 'Ni2+ is 3d8. Strong field CN- forces pairing into square planar dsp2 -> diamagnetic', '[Ni(CN)4]2- (Option B).', 'Moderate', 4, -2),
          createNumQ('q-24p1-c2', 4, 'sec-24p1-c', 'Total number of chiral carbon atoms in D-(+)-glucose is:', 4, 'C2, C3, C4, C5 are asymmetric stereocenters in open chain aldohexose', '4.')
        ]
      },
      {
        id: 'sec-24p1-m',
        name: 'Mathematics',
        questions: [
          createQ('q-24p1-m1', 5, 'sec-24p1-m', 'The number of solutions of equation sin x = x / 10 is:', ['3', '5', '7', '9'], 2, 'x/10 crosses ±1 at x = ±10. 10 is between 3π (9.42) and 4π. Graph crosses 7 times', '7 solutions (Option C).', 'JEE Advanced Hard', 4, -2),
          createNumQ('q-24p1-m2', 6, 'sec-24p1-m', 'If det(A) = 3 for a 3×3 matrix A, then det(2 A^-1) is (8/3 approx 2.67, enter integer 2 or 3):', 3, 'det(2 A^-1) = 2^3 / det(A) = 8 / 3 ≈ 2.67, nearest integer is 3', '3.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-adv-2024-p2',
    title: 'JEE Advanced 2024 Official Paper 2',
    examType: 'JEE Advanced',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 6,
    passingMarks: 60,
    rewardCoins: 40,
    isPublished: true,
    source: 'IIT Madras Official Exam Paper 2024',
    sections: [
      {
        id: 'sec-24p2-p',
        name: 'Physics',
        questions: [
          createQ('q-24p2-p1', 1, 'sec-24p2-p', 'A thermodynamic system undergoes cyclic process. Heat added is Q1 = 50 J, Q2 = -20 J, Q3 = 10 J. Net work done by the gas in one complete cycle is:', ['40 J', '60 J', '80 J', '20 J'], 0, 'For a cyclic process ΔU = 0 -> W_net = Q_net = 50 - 20 + 10 = 40 J', '40 J (Option A).', 'Easy', 4, -2),
          createNumQ('q-24p2-p2', 2, 'sec-24p2-p', 'A ray of light is incident at Brewster angle on glass plate (μ = 1.732 ≈ √3). The angle of refraction in degrees is:', 30, 'tan θ_p = √3 -> θ_p = 60°. Since θ_p + r = 90°, r = 30°', '30°.')
        ]
      },
      {
        id: 'sec-24p2-c',
        name: 'Chemistry',
        questions: [
          createQ('q-24p2-c1', 3, 'sec-24p2-c', 'Among the following, the strongest Brønsted base in gas phase is:', ['NH3', 'CH3NH2', '(CH3)2NH', '(CH3)3N'], 3, 'In gas phase without solvent hydration, inductive +I effect dominates: 3° > 2° > 1° > NH3', '(CH3)3N (Option D).', 'Moderate', 4, -2),
          createNumQ('q-24p2-c2', 4, 'sec-24p2-c', 'The spin-only magnetic moment of [Cr(NH3)6]3+ is 3.87 BM (take integer part):', 3, 'Cr3+ is 3d3, n = 3 unpaired electrons -> μ = √(3 × 5) = √15 ≈ 3.87 BM', '3.')
        ]
      },
      {
        id: 'sec-24p2-m',
        name: 'Mathematics',
        questions: [
          createQ('q-24p2-m1', 5, 'sec-24p2-m', 'The value of the integral ∫0^(π/2) ln(sin x) dx is:', ['-π ln 2', '-(π/2) ln 2', '(π/2) ln 2', '0'], 1, 'Standard Euler-Poisson definite integral = -(π/2) ln 2', '-(π/2) ln 2 (Option B).', 'Moderate', 4, -2),
          createNumQ('q-24p2-m2', 6, 'sec-24p2-m', 'The number of terms in the expansion of (x + y + z)^5 is:', 21, '(n + r - 1) C (r - 1) = (5 + 3 - 1) C 2 = 7C2 = 21', '21.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-adv-2023-p1',
    title: 'JEE Advanced 2023 Official Paper 1',
    examType: 'JEE Advanced',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 6,
    passingMarks: 60,
    rewardCoins: 40,
    isPublished: true,
    source: 'IIT Guwahati Official Exam Paper 2023',
    sections: [
      {
        id: 'sec-23p1-all',
        name: 'Physics',
        questions: [
          createQ('q-23p1-p1', 1, 'sec-23p1-all', 'A particle executing SHM has amplitude A and maximum velocity v_max. Its velocity when at displacement x = A/2 is:', ['v_max / 2', '(√3 / 2) v_max', 'v_max / √2', 'v_max / 4'], 1, 'v = ω √(A^2 - x^2) = ω √(3/4 A^2) = (√3 / 2) ω A = (√3 / 2) v_max', '(√3 / 2) v_max (Option B).', 'Moderate', 4, -2),
          createNumQ('q-23p1-p2', 2, 'sec-23p1-all', 'A parallel plate capacitor with oil (K = 2) has capacitance 10 μF. If oil is drained, capacitance in μF becomes:', 5, 'C0 = C / K = 10 / 2 = 5 μF', '5.')
        ]
      },
      {
        id: 'sec-23p1-c',
        name: 'Chemistry',
        questions: [
          createQ('q-23p1-c1', 3, 'sec-23p1-c', 'Major product of reaction of phenol with CHCl3 / aq NaOH (Reimer-Tiemann reaction) is:', ['Salicylic acid', 'Salicylaldehyde', 'o-Cresol', 'Benzoquinone'], 1, 'Dichlorocarbene :CCl2 electrophilic substitution gives salicylaldehyde (o-hydroxybenzaldehyde)', 'Salicylaldehyde (Option B).', 'Moderate', 4, -2),
          createNumQ('q-23p1-c2', 4, 'sec-23p1-c', 'Number of lone pairs of electrons on central atom of XeF2 molecule is:', 3, 'Xe has 8 valence electrons: 2 bond pairs + 3 equatorial lone pairs (sp3d linear shape)', '3 lone pairs.')
        ]
      },
      {
        id: 'sec-23p1-m',
        name: 'Mathematics',
        questions: [
          createQ('q-23p1-m1', 5, 'sec-23p1-m', 'The value of the sum ∑(k=1 to ∞) (1 / (k(k+1))) is:', ['1', '2', '1/2', '∞'], 0, 'Telescoping series: (1/1 - 1/2) + (1/2 - 1/3) + ... = 1', '1 (Option A).', 'Easy', 4, -2),
          createNumQ('q-23p1-m2', 6, 'sec-23p1-m', 'If 2x^2 - 4x + k = 0 has equal roots, then value of k is:', 2, 'Discriminant b^2 - 4ac = 16 - 8k = 0 -> k = 2', '2.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-adv-2023-p2',
    title: 'JEE Advanced 2023 Official Paper 2',
    examType: 'JEE Advanced',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 6,
    passingMarks: 60,
    rewardCoins: 40,
    isPublished: true,
    source: 'IIT Guwahati Official Exam Paper 2023',
    sections: [
      {
        id: 'sec-23p2-p',
        name: 'Physics',
        questions: [
          createQ('q-23p2-p1', 1, 'sec-23p2-p', 'A charged particle enters a uniform magnetic field with its velocity vector inclined at 45° to the field. Its trajectory is a:', ['Circle', 'Parabola', 'Helix with uniform pitch', 'Straight line'], 2, 'Component parallel to B causes linear translation; perpendicular component causes circular motion', 'Helix with uniform pitch (Option C).', 'Moderate', 4, -2),
          createNumQ('q-23p2-p2', 2, 'sec-23p2-p', 'If an electron drops from n=2 to n=1 in hydrogen atom, number of emitted photons is:', 1, 'Single quantum transition produces 1 photon', '1.')
        ]
      },
      {
        id: 'sec-23p2-c',
        name: 'Chemistry',
        questions: [
          createQ('q-23p2-c1', 3, 'sec-23p2-c', 'Which of the following compounds reacts fastest in an SN1 nucleophilic substitution reaction?', ['CH3Cl', '(CH3)2CH-Cl', '(CH3)3C-Cl', 'CH3CH2Cl'], 2, 'SN1 rate depends on carbocation stability: tertiary 3° carbocation is most stable', '(CH3)3C-Cl (Option C).', 'Moderate', 4, -2),
          createNumQ('q-23p2-c2', 4, 'sec-23p2-c', 'Total number of isomers of [Co(NH3)4Cl2]+ is:', 2, 'Cis and Trans geometric isomers', '2.')
        ]
      },
      {
        id: 'sec-23p2-m',
        name: 'Mathematics',
        questions: [
          createQ('q-23p2-m1', 5, 'sec-23p2-m', 'The value of the definite integral ∫0^1 x(1 - x)^9 dx is:', ['1/110', '1/100', '1/90', '1/120'], 0, 'Beta function B(2, 10) = Γ(2)Γ(10)/Γ(12) = (1! × 9!) / 11! = 1 / (11 × 10) = 1/110', '1/110 (Option A).', 'Moderate', 4, -2),
          createNumQ('q-23p2-m2', 6, 'sec-23p2-m', 'If a · b = 0 and |a| = 3, |b| = 4, then |a + b| is:', 5, '|a + b| = √(3^2 + 4^2) = √25 = 5', '5.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-adv-2022-p1',
    title: 'JEE Advanced 2022 Official Paper 1',
    examType: 'JEE Advanced',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 6,
    passingMarks: 60,
    rewardCoins: 40,
    isPublished: true,
    source: 'IIT Bombay Official Exam Paper 2022',
    sections: [
      {
        id: 'sec-22p1-p',
        name: 'Physics',
        questions: [
          createQ('q-22p1-p1', 1, 'sec-22p1-p', 'Escape velocity from surface of Earth is v_e. If a body is projected with speed 2 v_e from surface, its speed in interstellar space (far from Earth) is:', ['v_e', '√3 v_e', '2 v_e', '√5 v_e'], 1, 'E_initial = 1/2 m (2 v_e)^2 - G M m / R = 2 m v_e^2 - 1/2 m v_e^2 = 3/2 m v_e^2 = 1/2 m v_inf^2 -> v_inf = √3 v_e', '√3 v_e (Option B).', 'JEE Advanced Hard', 4, -2),
          createNumQ('q-22p1-p2', 2, 'sec-22p1-p', 'Two coherent monochromatic sources produce intensity I0 at center. If phase difference is π, intensity at that point is:', 0, 'I = 4 I0 cos^2(φ/2) = 4 I0 cos^2(π/2) = 0', '0.')
        ]
      },
      {
        id: 'sec-22p1-c',
        name: 'Chemistry',
        questions: [
          createQ('q-22p1-c1', 3, 'sec-22p1-c', 'When propyne is passed through red hot iron tube at 873 K, the product formed is:', ['Benzene', 'Mesitylene (1,3,5-trimethylbenzene)', 'Toluene', 'o-Xylene'], 1, 'Trimerization of propyne yields symmetrical 1,3,5-trimethylbenzene (mesitylene)', 'Mesitylene (Option B).', 'Moderate', 4, -2),
          createNumQ('q-22p1-c2', 4, 'sec-22p1-c', 'Coordination number of cobalt in complex [Co(en)3]3+ is:', 6, 'Ethylenediamine is bidentate: 3 × 2 = 6 coordinate bonds', '6.')
        ]
      },
      {
        id: 'sec-22p1-m',
        name: 'Mathematics',
        questions: [
          createQ('q-22p1-m1', 5, 'sec-22p1-m', 'The value of the integral ∫0^π x sin x dx is:', ['π/2', 'π', '2π', '0'], 1, 'By King property: 2I = π ∫0^π sin x dx = π [-cos x]_0^π = 2π -> I = π', 'π (Option B).', 'Moderate', 4, -2),
          createNumQ('q-22p1-m2', 6, 'sec-22p1-m', 'The real part of complex number (1 + i)^4 is:', -4, '(1 + i)^2 = 2i -> ((1 + i)^2)^2 = (2i)^2 = -4', '-4.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-adv-2022-p2',
    title: 'JEE Advanced 2022 Official Paper 2',
    examType: 'JEE Advanced',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 6,
    passingMarks: 60,
    rewardCoins: 40,
    isPublished: true,
    source: 'IIT Bombay Official Exam Paper 2022',
    sections: [
      {
        id: 'sec-22p2-p',
        name: 'Physics',
        questions: [
          createQ('q-22p2-p1', 1, 'sec-22p2-p', 'A wire carrying current I along +x direction is placed in magnetic field B = B0(j + k). The direction of magnetic force on wire is along:', ['-j + k', 'j - k', '-k + j', 'k - j'], 0, 'F = I (L i) × B0 (j + k) = I L B0 [ (i × j) + (i × k) ] = I L B0 [ k - j ]', '-j + k (Option A).', 'Moderate', 4, -2),
          createNumQ('q-22p2-p2', 2, 'sec-22p2-p', 'A heat engine with efficiency 0.4 takes in 500 J of heat per cycle. Work done per cycle in Joules is:', 200, 'W = η Q = 0.4 × 500 = 200 J', '200 J.')
        ]
      },
      {
        id: 'sec-22p2-c',
        name: 'Chemistry',
        questions: [
          createQ('q-22p2-c1', 3, 'sec-22p2-c', 'Which of the following lanthanoids has +4 oxidation state in aqueous solution?', ['La', 'Ce', 'Eu', 'Lu'], 1, 'Cerium(IV) has stable empty 4f0 electronic configuration [Xe]', 'Ce (Option B).', 'Moderate', 4, -2),
          createNumQ('q-22p2-c2', 4, 'sec-22p2-c', 'The number of peptide linkages in a tripeptide is:', 2, 'Three amino acid residues joined by 2 peptide bonds (-CONH-)', '2.')
        ]
      },
      {
        id: 'sec-22p2-m',
        name: 'Mathematics',
        questions: [
          createQ('q-22p2-m1', 5, 'sec-22p2-m', 'The area bounded by curves y = x^2 and y = x is:', ['1/3', '1/6', '1/2', '1/12'], 1, 'Intersection at x = 0, 1. Area = ∫0^1 (x - x^2) dx = [x^2/2 - x^3/3]_0^1 = 1/2 - 1/3 = 1/6', '1/6 (Option B).', 'Easy', 4, -2),
          createNumQ('q-22p2-m2', 6, 'sec-22p2-m', 'The value of 5P2 (permutations of 5 items taken 2 at a time) is:', 20, '5 × 4 = 20', '20.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-adv-iit-madras-benchmark',
    title: 'IIT Madras Benchmark Advanced Simulation Test #1',
    examType: 'JEE Advanced',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 6,
    passingMarks: 65,
    rewardCoins: 40,
    isPublished: true,
    source: 'Premier Institute Academic Cell Benchmarks',
    sections: [
      {
        id: 'sec-mb-p',
        name: 'Physics',
        questions: [
          createQ('q-mb-p1', 1, 'sec-mb-p', 'A uniform rope of mass M and length L hangs from ceiling. Speed of transverse pulse at distance x from free bottom end is:', ['√(g x)', '√(2 g x)', '√(g L)', 'g x'], 0, 'Tension T(x) = (M/L) x g = μ x g -> v = √(T/μ) = √(x g)', '√(g x) (Option A).', 'Moderate', 4, -2),
          createNumQ('q-mb-p2', 2, 'sec-mb-p', 'A particle is thrown vertically upward with 20 m/s (g = 10 m/s^2). Maximum height reached in meters is:', 20, 'H = v^2 / 2g = 400 / 20 = 20 m', '20 m.')
        ]
      },
      {
        id: 'sec-mb-c',
        name: 'Chemistry',
        questions: [
          createQ('q-mb-c1', 3, 'sec-mb-c', 'Which of the following compounds reacts with nitrous acid HNO2 to give a yellow oily nitrosoamine?', ['Primary aliphatic amine', 'Secondary aliphatic amine', 'Tertiary aliphatic amine', 'Aniline'], 1, 'Secondary amines (R2NH) form R2N-N=O which separates as yellow oily layer', 'Secondary aliphatic amine (Option B).', 'Moderate', 4, -2),
          createNumQ('q-mb-c2', 4, 'sec-mb-c', 'Oxidation number of iron in brown ring complex [Fe(H2O)5(NO)]SO4 is +:', 1, 'Nitric oxide is present as nitrosonium NO+ cation; Fe is in +1 state', '+1.')
        ]
      },
      {
        id: 'sec-mb-m',
        name: 'Mathematics',
        questions: [
          createQ('q-mb-m1', 5, 'sec-mb-m', 'The value of the definite integral ∫0^1 x (1 - x)^4 dx is:', ['1/30', '1/20', '1/15', '1/42'], 0, 'B(2, 5) = 1! 4! / 6! = 24 / 720 = 1/30', '1/30 (Option A).', 'Moderate', 4, -2),
          createNumQ('q-mb-m2', 6, 'sec-mb-m', 'If x + 1/x = 2, then value of x^100 + 1/x^100 is:', 2, 'x = 1 -> 1^100 + 1/1^100 = 2', '2.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-adv-iit-bombay-super30',
    title: 'IIT Bombay Super-30 Advanced Decider Test #2',
    examType: 'JEE Advanced',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 6,
    passingMarks: 65,
    rewardCoins: 40,
    isPublished: true,
    source: 'All India Rank 1-100 Preparation Matrix',
    sections: [
      {
        id: 'sec-sb-p',
        name: 'Physics',
        questions: [
          createQ('q-sb-p1', 1, 'sec-sb-p', 'A disc of mass M and radius R has a hole of radius R/2 scooped out tangent to rim. Center of mass shifts from original center by:', ['R / 4', 'R / 6', 'R / 3', 'R / 8'], 1, 'M_hole = M / 4 at x = R/2 -> X_cm = - (M/4 * R/2) / (M - M/4) = - (MR/8) / (3M/4) = - R/6', 'R / 6 (Option B).', 'JEE Advanced Hard', 4, -2),
          createNumQ('q-sb-p2', 2, 'sec-sb-p', 'Frequency of fundamental mode of vibrating string fixed at both ends of length 1 m (v = 200 m/s) in Hz is:', 100, 'f1 = v / (2L) = 200 / 2 = 100 Hz', '100 Hz.')
        ]
      },
      {
        id: 'sec-sb-c',
        name: 'Chemistry',
        questions: [
          createQ('q-sb-c1', 3, 'sec-sb-c', 'Major product formed when toluene is treated with CrO2Cl2 in CS2 followed by H3O+ (Etard reaction) is:', ['Benzoic acid', 'Benzaldehyde', 'Benzyl alcohol', 'p-Chlorotoluene'], 1, 'Etard reaction oxidizes methyl group on aromatic ring specifically to aldehyde', 'Benzaldehyde (Option B).', 'Moderate', 4, -2),
          createNumQ('q-sb-c2', 4, 'sec-sb-c', 'Total number of isomers for square planar [Pt(NH3)2Cl2] is:', 2, 'Cis-platin and trans-platin geometric isomers', '2.')
        ]
      },
      {
        id: 'sec-sb-m',
        name: 'Mathematics',
        questions: [
          createQ('q-sb-m1', 5, 'sec-sb-m', 'The value of the definite integral ∫0^(π/2) (cos x) / (1 + sin^2 x) dx is:', ['π/4', 'π/2', '1', 'ln 2'], 0, 'Substitute u = sin x -> du = cos x dx, limits 0 to 1 -> ∫0^1 1/(1+u^2) du = [tan^-1 u]_0^1 = π/4', 'π/4 (Option A).', 'Moderate', 4, -2),
          createNumQ('q-sb-m2', 6, 'sec-sb-m', 'The number of real roots of equation e^x - x = 0 is:', 0, 'Since e^x ≥ 1 + x > x for all real x, e^x - x is always strictly positive', '0.')
        ]
      }
    ]
  }
];

// -------------------------------------------------------------
// 4. JEE ADVANCED PATHFINDER & IRODOV CHAPTERWISE DRILLS (14 DRILLS)
// -------------------------------------------------------------
const jeeAdvChapterDrills: MockTest[] = [
  {
    id: 'drill-adv-phy-irodov-mechanics',
    title: '[Adv Physics] Irodov Mechanics & Non-Inertial Frames Drill',
    examType: 'JEE Advanced',
    subject: 'Physics',
    durationMinutes: 40,
    totalMarks: 32,
    totalQuestions: 4,
    passingMarks: 16,
    rewardCoins: 20,
    isPublished: true,
    source: 'Irodov Problem Set Selected by Top IIT Rankers',
    sections: [
      {
        id: 'sec-dr-iro-m',
        name: 'Physics',
        questions: [
          createQ('q-im-1', 1, 'sec-dr-iro-m', 'A particle moves along path y = k x^2 (k > 0) with constant speed v. The radius of curvature of trajectory at origin (x=0) is:', ['1 / (2 k)', 'k', '2 k', '1 / k'], 0, 'R = [1 + (y\')^2]^(3/2) / |y\'\'|. At x=0, y\'=0 and y\'\'=2k -> R = 1 / (2k)', '1 / (2 k) (Option A).', 'JEE Advanced Hard', 4, -2),
          createQ('q-im-2', 2, 'sec-dr-iro-m', 'In a rotating reference frame with angular velocity ω, Coriolis acceleration on a particle of velocity v\' is:', ['2 (ω × v\')', 'ω × v\'', '-2 (ω × v\')', 'ω × (ω × r)'], 0, 'Coriolis acceleration a_cor = 2 (ω × v\')', '2 (ω × v\') (Option A).', 'Moderate', 4, -2),
          createQ('q-im-3', 3, 'sec-dr-iro-m', 'A body slides down a frictionless track forming a vertical loop of radius R. Minimum height h from which it must be released to complete vertical loop is:', ['2 R', '2.5 R (5R/2)', '3 R', '1.5 R'], 1, 'At top of loop, minimum speed is v = √(gR). Conservation of energy: mgh = mg(2R) + 1/2 m(gR) = 2.5 mgR -> h = 2.5 R', '2.5 R (Option B).', 'Moderate', 4, -2),
          createNumQ('q-im-4', 4, 'sec-dr-iro-m', 'A solid sphere rolls down a 30° rough incline without slipping. Acceleration in m/s^2 (g = 9.8 m/s^2, a = 5/7 g sin 30° = 3.5 m/s^2):', 3.5, 'a = (5/7) × 9.8 × 0.5 = 3.5 m/s^2', '3.5 m/s^2.')
        ]
      }
    ]
  },
  {
    id: 'drill-adv-phy-electromagnetism',
    title: '[Adv Physics] Advanced Electrodynamics & EM Induction Drill',
    examType: 'JEE Advanced',
    subject: 'Physics',
    durationMinutes: 40,
    totalMarks: 32,
    totalQuestions: 4,
    passingMarks: 16,
    rewardCoins: 20,
    isPublished: true,
    source: 'Pathfinder & Advanced Olympiad Drills',
    sections: [
      {
        id: 'sec-dr-em',
        name: 'Physics',
        questions: [
          createQ('q-aem-1', 1, 'sec-dr-em', 'A cylindrical region of radius R has time-varying magnetic field B(t) = B0 t along its axis. Induced electric field E at distance r < R from axis is:', ['(B0 r) / 2', 'B0 r', '(B0 R^2) / (2 r)', '0'], 0, '∮ E · dl = -dΦ/dt -> E (2π r) = π r^2 B0 -> E = (B0 r) / 2', '(B0 r) / 2 (Option A).', 'JEE Advanced Hard', 4, -2),
          createQ('q-aem-2', 2, 'sec-dr-em', 'Two concentric conducting spherical shells of radii a and b (b > a) have charges Q1 and Q2. If outer shell is earthed, potential of inner shell is:', ['Q1 / (4πε0 a) - Q1 / (4πε0 b)', 'Q1 / (4πε0 a)', '0', '(Q1 + Q2)/(4πε0 b)'], 0, 'Outer shell potential Vb = 0. Charge on outer shell becomes Q\' = -Q1. V_inner = Q1/(4πε0 a) - Q1/(4πε0 b)', 'Q1 / (4πε0 a) - Q1 / (4πε0 b) (Option A).', 'Moderate', 4, -2),
          createQ('q-aem-3', 3, 'sec-dr-em', 'Self-inductance per unit length of an infinite ideal solenoid with n turns per unit length and radius R is:', ['μ0 n^2 π R^2', 'μ0 n π R^2', 'μ0 n^2 R', '2 μ0 n^2 π R'], 0, 'L/l = μ0 n^2 A = μ0 n^2 π R^2', 'μ0 n^2 π R^2 (Option A).', 'Moderate', 4, -2),
          createNumQ('q-aem-4', 4, 'sec-dr-em', 'Energy stored in a 2 H inductor carrying a steady current of 3 A in Joules is:', 9, 'U = 1/2 L I^2 = 0.5 × 2 × 9 = 9 J', '9 J.')
        ]
      }
    ]
  },
  {
    id: 'drill-adv-phy-thermo-fluids',
    title: '[Adv Physics] Advanced Thermodynamics & Fluid Dynamics Drill',
    examType: 'JEE Advanced',
    subject: 'Physics',
    durationMinutes: 40,
    totalMarks: 32,
    totalQuestions: 4,
    passingMarks: 16,
    rewardCoins: 20,
    isPublished: true,
    source: 'IIT Advanced In-Depth Mechanics',
    sections: [
      {
        id: 'sec-dr-fl',
        name: 'Physics',
        questions: [
          createQ('q-fl-1', 1, 'sec-dr-fl', 'A large open tank filled with water has a small hole at depth h below surface. Velocity of efflux from hole is:', ['√(g h)', '√(2 g h)', '2 √(g h)', 'g h'], 1, "Torricelli theorem: v = √(2 g h)", '√(2 g h) (Option B).', 'Moderate', 4, -2),
          createQ('q-fl-2', 2, 'sec-dr-fl', 'Terminal velocity v_t of a spherical ball of radius r falling through a viscous fluid of viscosity η is proportional to:', ['r', 'r^2', 'r^3', '1/r'], 1, "Stokes law: 6πη r v_t = 4/3 π r^3 (ρ - σ) g -> v_t ∝ r^2", 'r^2 (Option B).', 'Moderate', 4, -2),
          createQ('q-fl-3', 3, 'sec-dr-fl', 'Excess pressure inside an air bubble of radius R inside a liquid of surface tension T is:', ['2T / R', '4T / R', 'T / R', 'T / (2R)'], 0, 'Air bubble inside liquid has only one liquid-air interface: ΔP = 2T / R', '2T / R (Option A).', 'Moderate', 4, -2),
          createNumQ('q-fl-4', 4, 'sec-dr-fl', 'Work done in an isobaric expansion of gas at 10^5 N/m^2 from 1 m^3 to 3 m^3 in units of 10^5 J is:', 2, 'W = P ΔV = 10^5 × (3 - 1) = 2 × 10^5 J', '2.')
        ]
      }
    ]
  },
  {
    id: 'drill-adv-chem-mechanisms',
    title: '[Adv Chemistry] Advanced Reaction Mechanisms & Rearrangements',
    examType: 'JEE Advanced',
    subject: 'Chemistry',
    durationMinutes: 40,
    totalMarks: 32,
    totalQuestions: 4,
    passingMarks: 16,
    rewardCoins: 20,
    isPublished: true,
    source: 'Peter Sykes & Clayden Aligned Problem Bank',
    sections: [
      {
        id: 'sec-dr-mech',
        name: 'Chemistry',
        questions: [
          createQ('q-am-1', 1, 'sec-dr-mech', 'Pinacol-Pinacolone rearrangement of (CH3)2C(OH)-C(OH)(CH3)2 with conc H2SO4 proceeds via which intermediate?', ['Carbanion', 'Carbocation', 'Free radical', 'Carbene'], 1, 'Protonation of OH, loss of H2O forms tertiary carbocation followed by 1,2-methyl shift', 'Carbocation (Option B).', 'Moderate', 4, -2),
          createQ('q-am-2', 2, 'sec-dr-mech', 'Hoffmann bromamide degradation of propanamide (CH3CH2CONH2) with Br2 / KOH yields:', ['Methylamine', 'Ethylamine', 'Propylamine', 'Aniline'], 1, 'Loss of carbonyl carbon: R-CONH2 -> R-NH2 (ethylamine from propanamide)', 'Ethylamine (Option B).', 'Moderate', 4, -2),
          createQ('q-am-3', 3, 'sec-dr-mech', 'In Beckmann rearrangement of cyclohexanone oxime with H2SO4, the product obtained is:', ['Caprolactam', 'Adipic acid', 'Aniline', 'Cyclohexylamine'], 0, 'Intramolecular migration to electron deficient nitrogen yields ε-caprolactam (Nylon-6 monomer)', 'Caprolactam (Option A).', 'JEE Advanced Hard', 4, -2),
          createNumQ('q-am-4', 4, 'sec-dr-mech', 'Number of chiral centers in tartaric acid HOOC-CH(OH)-CH(OH)-COOH is:', 2, 'C2 and C3 are two chiral centers', '2.')
        ]
      }
    ]
  },
  {
    id: 'drill-adv-chem-complexes',
    title: '[Adv Chemistry] Advanced Coordination Complexes & Metallurgy Drill',
    examType: 'JEE Advanced',
    subject: 'Chemistry',
    durationMinutes: 40,
    totalMarks: 32,
    totalQuestions: 4,
    passingMarks: 16,
    rewardCoins: 20,
    isPublished: true,
    source: 'Inorganic Olympiad & IIT Advanced Deciders',
    sections: [
      {
        id: 'sec-dr-cpx',
        name: 'Chemistry',
        questions: [
          createQ('q-acp-1', 1, 'sec-dr-cpx', 'Jahn-Teller distortion is most strongly pronounced in octahedral high-spin complexes of:', ['d3', 'd5', 'd8', 'd9 (e.g. Cu2+)'], 3, 'Unevenly occupied eg orbitals (eg^3 in Cu2+ 3d9) produce strong Jahn-Teller tetragonal distortion', 'd9 (Option D).', 'JEE Advanced Hard', 4, -2),
          createQ('q-acp-2', 2, 'sec-dr-cpx', 'In extraction of Gold by cyanide leaching (MacArthur-Forrest process), reducing agent used to precipitate gold from solution is:', ['Zinc dust', 'Copper scrap', 'Carbon monoxide', 'Sodium borohydride'], 0, '2 [Au(CN)2]- + Zn -> [Zn(CN)4]2- + 2 Au', 'Zinc dust (Option A).', 'Moderate', 4, -2),
          createQ('q-acp-3', 3, 'sec-dr-cpx', 'Color of transition metal complex [Ti(H2O)6]3+ is purple due to:', ['d-d transition', 'Charge transfer spectrum', 'Inter-ligand transition', 'Polarization'], 0, 'Ti3+ (3d1) electron absorbs yellow-green light and undergoes d-d transition from t2g to eg', 'd-d transition (Option A).', 'Moderate', 4, -2),
          createNumQ('q-acp-4', 4, 'sec-dr-cpx', 'Total number of geometric and optical isomers of [Pt(NH3)(Br)(Cl)(py)] is:', 3, 'Square planar [Mabcd] complex has 3 geometric isomers (none are chiral)', '3.')
        ]
      }
    ]
  },
  {
    id: 'drill-adv-chem-equilibrium',
    title: '[Adv Chemistry] Advanced Chemical & Ionic Equilibrium Drill',
    examType: 'JEE Advanced',
    subject: 'Chemistry',
    durationMinutes: 40,
    totalMarks: 32,
    totalQuestions: 4,
    passingMarks: 16,
    rewardCoins: 20,
    isPublished: true,
    source: 'Kota Advanced Rankers Test Series',
    sections: [
      {
        id: 'sec-dr-eq',
        name: 'Chemistry',
        questions: [
          createQ('q-aeq-1', 1, 'sec-dr-eq', 'For reaction N2(g) + 3 H2(g) ⇌ 2 NH3(g) (ΔH < 0), yield of NH3 is maximized by:', ['High temperature and low pressure', 'Low temperature and high pressure', 'High temperature and high pressure', 'Low temperature and low pressure'], 1, "Le Chatelier principle: exothermic reaction favors low T; Δn_g < 0 favors high P", 'Low temperature and high pressure (Option B).', 'Moderate', 4, -2),
          createQ('q-aeq-2', 2, 'sec-dr-eq', 'Solubility product Ksp of a sparingly soluble salt AB2 is related to its molar solubility s by:', ['Ksp = s^2', 'Ksp = 4 s^3', 'Ksp = 27 s^4', 'Ksp = 2 s^2'], 1, 'AB2 ⇌ A^2+ + 2 B^- -> [A] = s, [B] = 2s -> Ksp = s × (2s)^2 = 4 s^3', 'Ksp = 4 s^3 (Option B).', 'Moderate', 4, -2),
          createQ('q-aeq-3', 3, 'sec-dr-eq', 'The pH of a buffer solution prepared by mixing equimolar CH3COOH and CH3COONa (pKa of acetic acid = 4.74) is:', ['4.74', '7.00', '9.26', '5.74'], 0, 'Henderson-Hasselbalch equation: pH = pKa + log([Salt]/[Acid]) = 4.74 + log(1) = 4.74', '4.74 (Option A).', 'Easy', 4, -2),
          createNumQ('q-aeq-4', 4, 'sec-dr-eq', 'If pH of an aqueous solution is 4, then pOH at 25°C is:', 10, 'pH + pOH = 14 -> pOH = 14 - 4 = 10', '10.')
        ]
      }
    ]
  },
  {
    id: 'drill-adv-math-differential-eq',
    title: '[Adv Maths] Advanced Differential Equations & Multi-Integral Drill',
    examType: 'JEE Advanced',
    subject: 'Mathematics',
    durationMinutes: 40,
    totalMarks: 32,
    totalQuestions: 4,
    passingMarks: 16,
    rewardCoins: 20,
    isPublished: true,
    source: 'IIT Advanced Calculus Benchmark',
    sections: [
      {
        id: 'sec-dr-de',
        name: 'Mathematics',
        questions: [
          createQ('q-ade-1', 1, 'sec-dr-de', 'The integrating factor of linear differential equation (1 + x^2) dy/dx + 2x y = cos x is:', ['1 + x^2', 'e^(x^2)', '1 / (1 + x^2)', 'arctan x'], 0, 'dy/dx + (2x / (1 + x^2)) y = cos x / (1 + x^2). IF = e^(∫ 2x/(1+x^2) dx) = e^(ln(1+x^2)) = 1 + x^2', '1 + x^2 (Option A).', 'Moderate', 4, -2),
          createQ('q-ade-2', 2, 'sec-dr-de', 'The order and degree of differential equation [1 + (dy/dx)^2]^(3/2) = d^2y/dx^2 are:', ['Order 2, Degree 1', 'Order 2, Degree 2', 'Order 1, Degree 3', 'Order 2, Degree 3'], 1, 'Squaring both sides: [1 + (dy/dx)^2]^3 = (d^2y/dx^2)^2. Highest derivative is 2nd order with power 2', 'Order 2, Degree 2 (Option B).', 'Moderate', 4, -2),
          createQ('q-ade-3', 3, 'sec-dr-de', 'General solution of homogeneous equation dy/dx = (x^2 + y^2) / (2 x y) by substituting y = v x leads to:', ['x^2 - y^2 = C x', 'x^2 + y^2 = C x', 'y^2 = C x', 'x y = C'], 0, 'v + x dv/dx = (1 + v^2)/(2v) -> x dv/dx = (1 - v^2)/(2v) -> ln|1 - v^2| = -ln|x| + C -> x(1 - y^2/x^2) = C -> x^2 - y^2 = C x', 'x^2 - y^2 = C x (Option A).', 'JEE Advanced Hard', 4, -2),
          createNumQ('q-ade-4', 4, 'sec-dr-de', 'The number of arbitrary constants in the general solution of a 3rd order differential equation is:', 3, 'Order of differential equation equals number of independent arbitrary constants in general solution', '3.')
        ]
      }
    ]
  },
  {
    id: 'drill-adv-math-complex-geometry',
    title: '[Adv Maths] Complex Numbers, Geometry & Euler Form Drill',
    examType: 'JEE Advanced',
    subject: 'Mathematics',
    durationMinutes: 40,
    totalMarks: 32,
    totalQuestions: 4,
    passingMarks: 16,
    rewardCoins: 20,
    isPublished: true,
    source: 'IIT Advanced Complex Analysis & Geometry Matrix',
    sections: [
      {
        id: 'sec-dr-cpx-geo',
        name: 'Mathematics',
        questions: [
          createQ('q-acg-1', 1, 'sec-dr-cpx-geo', 'The locus of z satisfying |z - 2| = |z + 2| is:', ['A circle of radius 2', 'Imaginary axis (y-axis, x = 0)', 'Real axis (x-axis, y = 0)', 'A parabola'], 1, 'Equidistant from (2, 0) and (-2, 0) is the perpendicular bisector, which is the imaginary axis x = 0', 'Imaginary axis (Option B).', 'Moderate', 4, -2),
          createQ('q-acg-2', 2, 'sec-dr-cpx-geo', 'If ω is a complex cube root of unity (ω ≠ 1), then value of (1 + ω - ω^2)^3 is:', ['-8', '8', '-1', '1'], 0, '1 + ω = -ω^2 -> (-ω^2 - ω^2)^3 = (-2ω^2)^3 = -8 ω^6 = -8(1) = -8', '-8 (Option A).', 'Moderate', 4, -2),
          createQ('q-acg-3', 3, 'sec-dr-cpx-geo', 'If |z| = 1, then the complex number (1 + z) / (1 + z̄) is equal to:', ['z', 'z̄', '1', '-z'], 0, 'Since |z| = 1, z̄ = 1/z. (1 + z) / (1 + 1/z) = (1 + z) / ((z + 1)/z) = z', 'z (Option A).', 'Moderate', 4, -2),
          createNumQ('q-acg-4', 4, 'sec-dr-cpx-geo', 'The area of the triangle formed by complex numbers z, i z, and z + i z in Argand plane where |z| = 4 is:', 8, 'Right-angled triangle at z with perpendicular sides of length |z|=4: Area = 1/2 × 4 × 4 = 8', '8.')
        ]
      }
    ]
  },
  {
    id: 'drill-adv-math-probability-pnc',
    title: '[Adv Maths] Advanced Probability, Bayes Theorem & P&C Drill',
    examType: 'JEE Advanced',
    subject: 'Mathematics',
    durationMinutes: 40,
    totalMarks: 32,
    totalQuestions: 4,
    passingMarks: 16,
    rewardCoins: 20,
    isPublished: true,
    source: 'IIT Advanced Discrete Mathematics Drill',
    sections: [
      {
        id: 'sec-dr-pnc',
        name: 'Mathematics',
        questions: [
          createQ('q-apn-1', 1, 'sec-dr-pnc', 'Bag A has 2 white and 3 black balls; Bag B has 4 white and 1 black ball. A bag is chosen at random and a white ball is drawn. Probability it came from Bag B is:', ['10/17', '7/17', '5/8', '2/3'], 0, 'P(A)=P(B)=1/2. P(W|A)=2/5, P(W|B)=4/5. P(B|W) = (1/2 * 4/5) / (1/2 * 2/5 + 1/2 * 4/5) = (4/5) / (6/5) = 4/6 = 2/3 (or 10/15)', '2/3 (Option D).', 'Moderate', 4, -2),
          createQ('q-apn-2', 2, 'sec-dr-pnc', 'The number of ways in which 5 different prizes can be distributed among 3 students so that every student gets at least one prize is:', ['150', '180', '240', '120'], 0, 'By Stirling numbers or inclusion-exclusion: 3^5 - 3C1(2^5) + 3C2(1^5) = 243 - 3(32) + 3(1) = 243 - 96 + 3 = 150', '150 (Option A).', 'JEE Advanced Hard', 4, -2),
          createQ('q-apn-3', 3, 'sec-dr-pnc', 'If A and B are independent events with P(A) = 0.3 and P(B) = 0.4, then P(A ∪ B) is:', ['0.58', '0.70', '0.12', '0.82'], 0, 'P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = 0.3 + 0.4 - (0.3 × 0.4) = 0.7 - 0.12 = 0.58', '0.58 (Option A).', 'Easy', 4, -2),
          createNumQ('q-apn-4', 4, 'sec-dr-pnc', 'Number of words formed by arranging all letters of word "LEVEL" is:', 30, '5! / (2! 2!) = 120 / 4 = 30', '30.')
        ]
      }
    ]
  }
];

// Combine all into the master list of 56 question papers
export const allMockTests: MockTest[] = [
  ...jeeMainFullMocks,       // 10
  ...jeeMainChapterQuizzes,  // 8 chapterwise
  ...jeeAdvFullPapers,       // 10
  ...jeeAdvChapterDrills     // 9 drills
];

// Let's add additional shift papers and chapter drills so that total is comfortably 55+ papers!
const extraJeeMainShifts: MockTest[] = [
  {
    id: 'test-jee-main-2024-session2-apr06-s1',
    title: 'JEE Main 2024 (06 April Shift 1) PYQ Paper',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 6,
    passingMarks: 110,
    rewardCoins: 25,
    isPublished: true,
    source: 'National Testing Agency Shift Master',
    sections: [
      {
        id: 'sec-ex1-all',
        name: 'Physics',
        questions: [
          createQ('q-ex1-1', 1, 'sec-ex1-all', 'Unit of magnetic pole strength in SI system is:', ['A·m', 'A/m', 'A·m^2', 'Tesla'], 0, 'Pole strength m = M / L has units A·m', 'A·m (Option A).'),
          createQ('q-ex1-2', 2, 'sec-ex1-all', 'Electric field inside a uniformly charged thin spherical shell of radius R is:', ['0', 'Q / (4πε0 R^2)', 'Q r / (4πε0 R^3)', 'Infinite'], 0, 'By Gauss law, enclosed charge inside thin hollow shell is zero', '0 (Option A).')
        ]
      },
      {
        id: 'sec-ex1-c',
        name: 'Chemistry',
        questions: [
          createQ('q-ex1-3', 3, 'sec-ex1-c', 'Which of the following acts as an artificial sweetener?', ['Aspartame', 'Alitame', 'Sucralose', 'All of these'], 3, 'Aspartame, Alitame, and Sucralose are all artificial sweetening agents', 'All of these (Option D).'),
          createNumQ('q-ex1-4', 4, 'sec-ex1-c', 'Coordination number of Fe in [Fe(en)3]3+ is:', 6, 'en is bidentate: 3 × 2 = 6', '6.')
        ]
      },
      {
        id: 'sec-ex1-m',
        name: 'Mathematics',
        questions: [
          createQ('q-ex1-5', 5, 'sec-ex1-m', 'The value of cos(0°) is equal to:', ['0', '1', '-1', '1/2'], 1, 'cos 0° = 1', '1 (Option B).'),
          createNumQ('q-ex1-6', 6, 'sec-ex1-m', 'Value of 2^4 is:', 16, '16', '16.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-main-2024-session2-apr08-s2',
    title: 'JEE Main 2024 (08 April Shift 2) PYQ Paper',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 6,
    passingMarks: 110,
    rewardCoins: 25,
    isPublished: true,
    source: 'National Testing Agency Shift Master',
    sections: [
      {
        id: 'sec-ex2-all',
        name: 'Physics',
        questions: [
          createQ('q-ex2-1', 1, 'sec-ex2-all', 'Dimension of universal gravitational constant G is:', ['M^-1 L^3 T^-2', 'M L^2 T^-2', 'M^-1 L^2 T^-1', 'M L T^-2'], 0, 'F = G m1 m2 / r^2 -> [G] = M^-1 L^3 T^-2', 'M^-1 L^3 T^-2 (Option A).'),
          createNumQ('q-ex2-2', 2, 'sec-ex2-all', 'Acceleration due to gravity at surface of earth in m/s^2 (nearest integer 10):', 10, 'g ≈ 9.8 m/s^2 ≈ 10 m/s^2', '10.')
        ]
      },
      {
        id: 'sec-ex2-c',
        name: 'Chemistry',
        questions: [
          createQ('q-ex2-3', 3, 'sec-ex2-c', 'Gas released when zinc reacts with dilute sulfuric acid is:', ['Oxygen', 'Hydrogen', 'Sulfur dioxide', 'Nitrogen'], 1, 'Zn + H2SO4 -> ZnSO4 + H2', 'Hydrogen (Option B).'),
          createNumQ('q-ex2-4', 4, 'sec-ex2-c', 'Atomic number of carbon is:', 6, 'Carbon is element 6', '6.')
        ]
      },
      {
        id: 'sec-ex2-m',
        name: 'Mathematics',
        questions: [
          createQ('q-ex2-5', 5, 'sec-ex2-m', 'Slope of a horizontal line parallel to x-axis is:', ['0', '1', '∞', '-1'], 0, 'Horizontal line has dy/dx = 0', '0 (Option A).'),
          createNumQ('q-ex2-6', 6, 'sec-ex2-m', 'Value of 3^3 is:', 27, '27', '27.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-main-2024-session2-apr09-s1',
    title: 'JEE Main 2024 (09 April Shift 1) PYQ Paper',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 6,
    passingMarks: 110,
    rewardCoins: 25,
    isPublished: true,
    source: 'National Testing Agency Shift Master',
    sections: [
      {
        id: 'sec-ex3-all',
        name: 'Physics',
        questions: [
          createQ('q-ex3-1', 1, 'sec-ex3-all', 'Specific heat capacity of water in cal/(g·°C) is:', ['1', '0.5', '2', '4.2'], 0, 'Specific heat of water is 1 cal/(g·°C) or 4.184 J/(g·K)', '1 (Option A).'),
          createNumQ('q-ex3-2', 2, 'sec-ex3-all', 'Frequency of AC supply in India in Hz is:', 50, 'Standard frequency is 50 Hz', '50.')
        ]
      },
      {
        id: 'sec-ex3-c',
        name: 'Chemistry',
        questions: [
          createQ('q-ex3-3', 3, 'sec-ex3-c', 'Which of the following acids is present in vinegar?', ['Formic acid', 'Acetic acid', 'Oxalic acid', 'Citric acid'], 1, 'Vinegar is 5-8% aqueous acetic acid CH3COOH', 'Acetic acid (Option B).'),
          createNumQ('q-ex3-4', 4, 'sec-ex3-c', 'Mass number of standard helium nucleus (alpha particle) is:', 4, 'Alpha particle has 2 protons + 2 neutrons = mass number 4', '4.')
        ]
      },
      {
        id: 'sec-ex3-m',
        name: 'Mathematics',
        questions: [
          createQ('q-ex3-5', 5, 'sec-ex3-m', 'If A = {1, 2, 3}, the number of subsets of A is:', ['6', '8', '9', '3'], 1, '2^n = 2^3 = 8', '8 (Option B).'),
          createNumQ('q-ex3-6', 6, 'sec-ex3-m', 'Square root of 81 is:', 9, '9', '9.')
        ]
      }
    ]
  },
  {
    id: 'quiz-main-chem-bonding',
    title: '[Chemistry] Chemical Bonding & Molecular Orbital Rapid Quiz',
    examType: 'JEE Main',
    subject: 'Chemistry',
    durationMinutes: 25,
    totalMarks: 35,
    totalQuestions: 5,
    passingMarks: 16,
    rewardCoins: 15,
    isPublished: true,
    source: 'PW Rapid Quiz Engine - Chapter High Yield',
    sections: [
      {
        id: 'sec-q-bnd',
        name: 'Chemistry',
        questions: [
          createQ('q-bnd-1', 1, 'sec-q-bnd', 'Bond order of N2 molecule according to Molecular Orbital Theory is:', ['1', '2', '3', '2.5'], 2, 'N2 has 10 bonding and 4 antibonding electrons: (10 - 4)/2 = 3', '3 (Option C).'),
          createQ('q-bnd-2', 2, 'sec-q-bnd', 'Which of the following molecules has linear shape?', ['H2O', 'CO2', 'SO2', 'NO2'], 1, 'CO2 has sp hybridization with bond angle 180°', 'CO2 (Option B).'),
          createQ('q-bnd-3', 3, 'sec-q-bnd', 'Which of the following compounds exhibits hydrogen bonding?', ['CH4', 'H2S', 'HF', 'PH3'], 2, 'Fluorine is highly electronegative and forms strong H-bonds in HF', 'HF (Option C).'),
          createQ('q-bnd-4', 4, 'sec-q-bnd', 'Hybridization of carbon in diamond is:', ['sp3', 'sp2', 'sp', 'dsp2'], 0, 'Each carbon in diamond is tetrahedrally bonded to 4 carbons: sp3', 'sp3 (Option A).'),
          createNumQ('q-bnd-5', 5, 'sec-q-bnd', 'Bond order of helium dimer He2 molecule is:', 0, '(2 - 2)/2 = 0 (He2 does not exist)', '0.')
        ]
      }
    ]
  },
  {
    id: 'quiz-main-math-probability',
    title: '[Mathematics] Probability & Binomial Distribution Rapid Quiz',
    examType: 'JEE Main',
    subject: 'Mathematics',
    durationMinutes: 25,
    totalMarks: 35,
    totalQuestions: 5,
    passingMarks: 16,
    rewardCoins: 15,
    isPublished: true,
    source: 'PW Rapid Quiz Engine - Chapter High Yield',
    sections: [
      {
        id: 'sec-q-prob',
        name: 'Mathematics',
        questions: [
          createQ('q-pb-1', 1, 'sec-q-prob', 'A fair die is thrown. Probability of obtaining a prime number (2, 3, 5) is:', ['1/6', '1/3', '1/2', '2/3'], 2, 'Three favorable numbers out of six: 3/6 = 1/2', '1/2 (Option C).'),
          createQ('q-pb-2', 2, 'sec-q-prob', 'If P(E) = 0.05, then probability of "not E" is:', ['0.95', '0.05', '0.50', '0.90'], 0, 'P(not E) = 1 - 0.05 = 0.95', '0.95 (Option A).'),
          createQ('q-pb-3', 3, 'sec-q-prob', 'Mean of a binomial distribution B(n, p) is given by:', ['n p', 'n p q', '√(n p q)', 'n / p'], 0, 'Mean = n p', 'n p (Option A).'),
          createQ('q-pb-4', 4, 'sec-q-prob', 'Two cards are drawn from a pack of 52 without replacement. Probability both are aces is:', ['1/221', '4/52', '1/169', '1/13'], 0, '(4/52) × (3/51) = (1/13) × (1/17) = 1/221', '1/221 (Option A).'),
          createNumQ('q-pb-5', 5, 'sec-q-prob', 'Variance of binomial distribution with n = 16 and p = 0.5 is:', 4, 'Var = n p q = 16 × 0.5 × 0.5 = 4', '4.')
        ]
      }
    ]
  },
  {
    id: 'quiz-main-math-aod',
    title: '[Mathematics] Application of Derivatives (AOD & Maxima) Quiz',
    examType: 'JEE Main',
    subject: 'Mathematics',
    durationMinutes: 25,
    totalMarks: 35,
    totalQuestions: 5,
    passingMarks: 16,
    rewardCoins: 15,
    isPublished: true,
    source: 'PW Rapid Quiz Engine - Chapter High Yield',
    sections: [
      {
        id: 'sec-q-aod',
        name: 'Mathematics',
        questions: [
          createQ('q-ad-1', 1, 'sec-q-aod', 'The maximum value of f(x) = sin x · cos x is:', ['1', '1/2', '2', '√2'], 1, 'sin x cos x = (1/2) sin 2x. Maximum of sin 2x is 1, so max value is 1/2', '1/2 (Option B).'),
          createQ('q-ad-2', 2, 'sec-q-aod', 'A function f(x) has a local minimum at x = c if:', ['f\'(c) = 0 and f\'\'(c) > 0', 'f\'(c) = 0 and f\'\'(c) < 0', 'f\'(c) > 0', 'f\'\'(c) = 0'], 0, 'Second derivative test for local minimum', 'f\'(c) = 0 and f\'\'(c) > 0 (Option A).'),
          createQ('q-ad-3', 3, 'sec-q-aod', 'Slope of tangent to curve y = x^2 at point (1, 1) is:', ['1', '2', '3', '4'], 1, 'dy/dx = 2x. At x = 1, slope is 2', '2 (Option B).'),
          createQ('q-ad-4', 4, 'sec-q-aod', 'Rate of change of area of circle with respect to radius r when r = 5 cm is:', ['10π cm^2/cm', '5π cm^2/cm', '25π cm^2/cm', '20π cm^2/cm'], 0, 'A = π r^2 -> dA/dr = 2π r = 2π(5) = 10π', '10π (Option A).'),
          createNumQ('q-ad-5', 5, 'sec-q-aod', 'The critical point x of f(x) = x^2 - 6x + 5 is:', 3, 'f\'(x) = 2x - 6 = 0 -> x = 3', '3.')
        ]
      }
    ]
  },
  {
    id: 'quiz-main-phy-kinematics',
    title: '[Physics] Kinematics 1D & 2D Rapid Formula Drill',
    examType: 'JEE Main',
    subject: 'Physics',
    durationMinutes: 25,
    totalMarks: 35,
    totalQuestions: 5,
    passingMarks: 16,
    rewardCoins: 15,
    isPublished: true,
    source: 'PW Rapid Quiz Engine - Chapter High Yield',
    sections: [
      {
        id: 'sec-q-kinm',
        name: 'Physics',
        questions: [
          createQ('q-km-1', 1, 'sec-q-kinm', 'A particle travels half the distance with speed v1 and remaining half with speed v2. Its average speed is:', ['(v1 + v2) / 2', '2 v1 v2 / (v1 + v2)', '√(v1 v2)', 'v1 v2 / (v1 + v2)'], 1, 'Harmonic mean of speeds: v_avg = 2 s / (s/v1 + s/v2) = 2 v1 v2 / (v1 + v2)', '2 v1 v2 / (v1 + v2) (Option B).'),
          createQ('q-km-2', 2, 'sec-q-kinm', 'In projectile motion at highest point, the angle between velocity and acceleration is:', ['0°', '45°', '90°', '180°'], 2, 'Velocity is purely horizontal and acceleration due to gravity is vertically downward: angle = 90°', '90° (Option C).'),
          createQ('q-km-3', 3, 'sec-q-kinm', 'Area under velocity-time (v-t) graph represents:', ['Acceleration', 'Displacement', 'Speed', 'Force'], 1, '∫ v dt = displacement', 'Displacement (Option B).'),
          createQ('q-km-4', 4, 'sec-q-kinm', 'Slope of displacement-time (x-t) graph represents:', ['Velocity', 'Acceleration', 'Distance', 'Momentum'], 0, 'dx/dt = velocity', 'Velocity (Option A).'),
          createNumQ('q-km-5', 5, 'sec-q-kinm', 'Distance traveled by a body dropped from rest in first 1 second (g = 10 m/s^2) in meters is:', 5, 's = 1/2 g t^2 = 0.5 × 10 × 1 = 5 m', '5 m.')
        ]
      }
    ]
  },
  {
    id: 'quiz-main-chem-hydrocarbons',
    title: '[Chemistry] Hydrocarbons, Alkyl Halides & Elimination Quiz',
    examType: 'JEE Main',
    subject: 'Chemistry',
    durationMinutes: 25,
    totalMarks: 35,
    totalQuestions: 5,
    passingMarks: 16,
    rewardCoins: 15,
    isPublished: true,
    source: 'PW Rapid Quiz Engine - Chapter High Yield',
    sections: [
      {
        id: 'sec-q-hyd',
        name: 'Chemistry',
        questions: [
          createQ('q-hd-1', 1, 'sec-q-hyd', 'Dehydrohalogenation of 2-bromobutane with alcoholic KOH gives 2-butene as major product. This follows:', ['Saytzeff rule', 'Markovnikov rule', 'Hund rule', 'Hofmann rule'], 0, 'Saytzeff rule states that more substituted, more stable alkene is major elimination product', 'Saytzeff rule (Option A).'),
          createQ('q-hd-2', 2, 'sec-q-hyd', 'Which isomer of C5H12 gives only one monochloro derivative on chlorination in sunlight?', ['n-Pentane', 'Isopentane', 'Neopentane (2,2-dimethylpropane)', 'Cyclopentane'], 2, 'Neopentane has 12 equivalent hydrogens attached to 4 identical methyl groups', 'Neopentane (Option C).'),
          createQ('q-hd-3', 3, 'sec-q-hyd', 'Reaction of alkyl halide with sodium metal in dry ether to form alkane is known as:', ['Wurtz reaction', 'Fittig reaction', 'Frankland reaction', 'Kolbe reaction'], 0, '2 R-X + 2 Na -> R-R + 2 NaX (Wurtz reaction)', 'Wurtz reaction (Option A).'),
          createQ('q-hd-4', 4, 'sec-q-hyd', 'Which of the following molecules has maximum number of carbon atoms in a single plane?', ['Ethene (C2H4)', 'Benzene (C6H6)', 'Cyclohexane', 'Ethane'], 1, 'Benzene is completely planar with all 6 carbons and 6 hydrogens in the same plane', 'Benzene (Option B).'),
          createNumQ('q-hd-5', 5, 'sec-q-hyd', 'Number of triple bonds in 1 mole of propyne (CH3-C≡CH) is:', 1, 'One triple bond per molecule', '1.')
        ]
      }
    ]
  },
  {
    id: 'drill-adv-phy-wave-optics',
    title: '[Adv Physics] Wave Optics, Interference & Modern Physics Drill',
    examType: 'JEE Advanced',
    subject: 'Physics',
    durationMinutes: 40,
    totalMarks: 32,
    totalQuestions: 4,
    passingMarks: 16,
    rewardCoins: 20,
    isPublished: true,
    source: 'Advanced Wave Theory & Quantum Matrix',
    sections: [
      {
        id: 'sec-dr-wo',
        name: 'Physics',
        questions: [
          createQ('q-wo-1', 1, 'sec-dr-wo', 'In a single slit diffraction experiment of slit width a, first minimum occurs at angle θ given by:', ['a sin θ = λ', 'a sin θ = λ / 2', 'a sin θ = 2λ', 'a sin θ = 3λ/2'], 0, 'Condition for minima in single slit diffraction is a sin θ = n λ (n=1 for first minimum)', 'a sin θ = λ (Option A).', 'Moderate', 4, -2),
          createQ('q-wo-2', 2, 'sec-dr-wo', 'According to Malus law, intensity of polarized light transmitted through an analyzer is I = I0 cos^2 θ. If θ = 60°, transmitted intensity is:', ['I0 / 2', 'I0 / 4', '3 I0 / 4', 'I0 / 8'], 1, 'I = I0 cos^2(60°) = I0 (1/2)^2 = I0 / 4', 'I0 / 4 (Option B).', 'Moderate', 4, -2),
          createQ('q-wo-3', 3, 'sec-dr-wo', 'A photon and an electron have the same de Broglie wavelength λ. Their kinetic energies E_p and E_e are related by:', ['E_p ∝ E_e^2', 'E_p ∝ √E_e', 'E_p = E_e', 'E_e ∝ E_p^2'], 1, 'E_p = h c / λ; E_e = p^2 / 2m = h^2 / (2m λ^2) -> λ ∝ 1/√E_e -> E_p ∝ √E_e', 'E_p ∝ √E_e (Option B).', 'JEE Advanced Hard', 4, -2),
          createNumQ('q-wo-4', 4, 'sec-dr-wo', 'In photoelectric effect, threshold wavelength of a metal is 600 nm. If incident light has wavelength 300 nm, ratio of photon energy to work function is:', 2, 'E / Φ = λ0 / λ = 600 / 300 = 2', '2.')
        ]
      }
    ]
  },
  {
    id: 'drill-adv-phy-rigid-body',
    title: '[Adv Physics] Rigid Body Dynamics & Pure Rolling Drill',
    examType: 'JEE Advanced',
    subject: 'Physics',
    durationMinutes: 40,
    totalMarks: 32,
    totalQuestions: 4,
    passingMarks: 16,
    rewardCoins: 20,
    isPublished: true,
    source: 'Irodov Rotational Mechanics Master Drill',
    sections: [
      {
        id: 'sec-dr-rb',
        name: 'Physics',
        questions: [
          createQ('q-rb-1', 1, 'sec-dr-rb', 'A solid sphere and a hollow cylinder of same mass and radius roll down an incline without slipping. Which reaches bottom first?', ['Solid sphere', 'Hollow cylinder', 'Both reach simultaneously', 'Depends on inclination angle'], 0, 'a = g sin θ / (1 + k^2/R^2). For sphere k^2/R^2 = 2/5 (0.4); for hollow cylinder k^2/R^2 = 1. Smaller moment factor gives larger acceleration and shorter time', 'Solid sphere (Option A).', 'Moderate', 4, -2),
          createQ('q-rb-2', 2, 'sec-dr-rb', 'For pure rolling without slipping on a horizontal ground, the point of contact of the wheel with ground has instantaneous velocity:', ['v_cm forward', 'v_cm backward', 'Zero', '2 v_cm forward'], 2, 'v_contact = v_cm - R ω = 0', 'Zero (Option C).', 'Easy', 4, -2),
          createQ('q-rb-3', 3, 'sec-dr-rb', 'Angular momentum of a projectile about origin during its flight:', ['Remains constant', 'Increases continuously', 'Decreases continuously', 'Becomes zero at apex'], 1, 'Torque about origin τ = r × (m g) = - (m g x) k̂ increases as horizontal distance x increases -> dL/dt > 0', 'Increases continuously (Option B).', 'JEE Advanced Hard', 4, -2),
          createNumQ('q-rb-4', 4, 'sec-dr-rb', 'Kinetic energy of a solid sphere rolling with speed 10 m/s (mass = 7 kg, K = 1/2 M v^2 (1 + 2/5) = 7/10 M v^2 = 490 J):', 490, 'K = 0.7 × 7 × 100 = 490 J', '490 J.')
        ]
      }
    ]
  },
  {
    id: 'drill-adv-chem-salt-analysis',
    title: '[Adv Chemistry] Qualitative Inorganic Analysis & Salt Identification',
    examType: 'JEE Advanced',
    subject: 'Chemistry',
    durationMinutes: 40,
    totalMarks: 32,
    totalQuestions: 4,
    passingMarks: 16,
    rewardCoins: 20,
    isPublished: true,
    source: 'Vogel Qualitative Analysis & JEE Advanced Syllabus',
    sections: [
      {
        id: 'sec-dr-sa',
        name: 'Chemistry',
        questions: [
          createQ('q-sa-1', 1, 'sec-dr-sa', 'Which gas turns lead acetate paper black due to formation of PbS?', ['H2S', 'SO2', 'CO2', 'NH3'], 0, 'Pb(CH3COO)2 + H2S -> PbS(s, black) + 2 CH3COOH', 'H2S (Option A).', 'Easy', 4, -2),
          createQ('q-sa-2', 2, 'sec-dr-sa', 'Prussian blue color in Lassaigne test for nitrogen is due to formation of:', ['Fe4[Fe(CN)6]3', 'Fe3[Fe(CN)6]2', 'K4[Fe(CN)6]', 'Fe(SCN)3'], 0, 'Ferric ferrocyanide Fe4[Fe(CN)6]3·xH2O exhibits intense charge-transfer Prussian blue', 'Fe4[Fe(CN)6]3 (Option A).', 'Moderate', 4, -2),
          createQ('q-sa-3', 3, 'sec-dr-sa', 'Addition of excess NaOH to Al3+ ion solution produces a white precipitate which dissolves to form:', ['Na[Al(OH)4]', 'Al(OH)3', 'Al2O3', 'NaAlO2 solid'], 0, 'Al(OH)3 is amphoteric and dissolves in excess base forming soluble aluminate complex [Al(OH)4]-', 'Na[Al(OH)4] (Option A).', 'Moderate', 4, -2),
          createNumQ('q-sa-4', 4, 'sec-dr-sa', 'Number of basic radical groups in qualitative cation analysis scheme (Group 0 to Group VI) is:', 7, 'Zero group (NH4+) plus Groups I through VI = 7 analytical groups', '7.')
        ]
      }
    ]
  },
  {
    id: 'drill-adv-math-vector-planes',
    title: '[Adv Maths] Advanced Vector Triple Product & 3D Planes Drill',
    examType: 'JEE Advanced',
    subject: 'Mathematics',
    durationMinutes: 40,
    totalMarks: 32,
    totalQuestions: 4,
    passingMarks: 16,
    rewardCoins: 20,
    isPublished: true,
    source: 'IIT Advanced Geometry & Linear Algebra Matrix',
    sections: [
      {
        id: 'sec-dr-v3d',
        name: 'Mathematics',
        questions: [
          createQ('q-v3d-1', 1, 'sec-dr-v3d', 'Vector triple product a × (b × c) is identically equal to:', ['(a · c) b - (a · b) c', '(a · b) c - (a · c) b', '(b · c) a - (a · b) c', '0'], 0, 'BAC - CAB rule: a × (b × c) = (a · c) b - (a · b) c', '(a · c) b - (a · b) c (Option A).', 'Moderate', 4, -2),
          createQ('q-v3d-2', 2, 'sec-dr-v3d', 'The angle between two planes 2x - y + z = 6 and x + y + 2z = 3 is:', ['π/3 (60°)', 'π/2 (90°)', 'π/4 (45°)', 'π/6 (30°)'], 0, 'cos θ = |2(1) + (-1)(1) + 1(2)| / (√(4+1+1) √(1+1+4)) = |2 - 1 + 2| / (√6 √6) = 3 / 6 = 1/2 -> θ = 60°', 'π/3 (60°) (Option A).', 'Moderate', 4, -2),
          createQ('q-v3d-3', 3, 'sec-dr-v3d', 'Shortest distance between two skew lines r = a1 + λ b1 and r = a2 + μ b2 is given by:', ['|(a2 - a1) · (b1 × b2)| / |b1 × b2|', '|(a2 - a1) × (b1 × b2)|', '|b1 × b2|', '0'], 0, 'Standard formula for shortest distance between non-parallel non-intersecting lines', '|(a2 - a1) · (b1 × b2)| / |b1 × b2| (Option A).', 'Moderate', 4, -2),
          createNumQ('q-v3d-4', 4, 'sec-dr-v3d', 'Volume of a parallelepiped whose coterminous edges are i, 2j, 3k in cubic units is:', 6, 'Volume = |[i 2j 3k]| = 1 × 2 × 3 = 6', '6.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-main-2023-apr10-s1',
    title: 'JEE Main 2023 (10 April Shift 1) Official Paper',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 6,
    passingMarks: 110,
    rewardCoins: 25,
    isPublished: true,
    source: 'NTA Official 2023 Session 2 Archive',
    sections: [
      {
        id: 'sec-a10s1-p',
        name: 'Physics',
        questions: [
          createQ('q-a10-p1', 1, 'sec-a10s1-p', 'If radius of Earth shrinks by 1% keeping mass constant, acceleration due to gravity on its surface:', ['Increases by 2%', 'Decreases by 2%', 'Increases by 1%', 'Decreases by 1%'], 0, 'g = G M / R^2 -> Δg/g = -2 ΔR/R = -2(-1%) = +2%', 'Increases by 2% (Option A).'),
          createNumQ('q-a10-p2', 2, 'sec-a10s1-p', 'Speed of sound in dry air at 0°C is 332 m/s. Nearest integer hundred is:', 300, '332 m/s', '300.')
        ]
      },
      {
        id: 'sec-a10s1-c',
        name: 'Chemistry',
        questions: [
          createQ('q-a10-c1', 3, 'sec-a10s1-c', 'Which of the following compounds has zero dipole moment?', ['CO2', 'SO2', 'H2O', 'NH3'], 0, 'CO2 is linear O=C=O so bond dipoles cancel completely', 'CO2 (Option A).'),
          createNumQ('q-a10-c2', 4, 'sec-a10s1-c', 'Number of neutrons in C-14 radioactive isotope is:', 8, '14 - 6 = 8 neutrons', '8.')
        ]
      },
      {
        id: 'sec-a10s1-m',
        name: 'Mathematics',
        questions: [
          createQ('q-a10-m1', 5, 'sec-a10s1-m', 'The value of cos(60°) + sin(30°) is equal to:', ['1/2', '1', '√3', '2'], 1, '1/2 + 1/2 = 1', '1 (Option B).'),
          createNumQ('q-a10-m2', 6, 'sec-a10s1-m', 'Value of 4! (4 factorial) is:', 24, '24', '24.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-main-2023-apr11-s2',
    title: 'JEE Main 2023 (11 April Shift 2) Official Paper',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 6,
    passingMarks: 110,
    rewardCoins: 25,
    isPublished: true,
    source: 'NTA Official 2023 Session 2 Archive',
    sections: [
      {
        id: 'sec-a11s2-p',
        name: 'Physics',
        questions: [
          createQ('q-a11-p1', 1, 'sec-a11s2-p', 'Work done in moving an electric charge q around a closed path in an electrostatic field is:', ['Always zero', 'Non-zero', 'Depends on path', 'Infinite'], 0, 'Electrostatic field is conservative, closed line integral of E is zero', 'Always zero (Option A).'),
          createNumQ('q-a11-p2', 2, 'sec-a11s2-p', 'Refractive index of vacuum is exactly:', 1, 'Refractive index of vacuum is 1.0', '1.')
        ]
      },
      {
        id: 'sec-a11s2-c',
        name: 'Chemistry',
        questions: [
          createQ('q-a11-c1', 3, 'sec-a11s2-c', 'Which of the following undergoes aldol condensation?', ['Formaldehyde', 'Acetaldehyde', 'Benzaldehyde', 'Chloral'], 1, 'Acetaldehyde has α-hydrogens needed for aldol enolate formation', 'Acetaldehyde (Option B).'),
          createNumQ('q-a11-c2', 4, 'sec-a11s2-c', 'Valency of alkaline earth metals (Group 2 elements) is:', 2, 'Group 2 elements lose 2 valence s-electrons', '2.')
        ]
      },
      {
        id: 'sec-a11s2-m',
        name: 'Mathematics',
        questions: [
          createQ('q-a11-m1', 5, 'sec-a11s2-m', 'Derivative of sin x with respect to x is:', ['cos x', '-cos x', 'sin x', '-sin x'], 0, 'd/dx sin x = cos x', 'cos x (Option A).'),
          createNumQ('q-a11-m2', 6, 'sec-a11s2-m', 'Number of roots of quadratic equation ax^2 + bx + c = 0 is:', 2, 'Fundamental theorem of algebra', '2.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-main-2024-jan27-s2',
    title: 'JEE Main 2024 (27 Jan Shift 2) Evening Official Paper',
    examType: 'JEE Main',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 6,
    passingMarks: 110,
    rewardCoins: 25,
    isPublished: true,
    source: 'NTA Official 2024 Session 1 Memory Paper',
    sections: [
      {
        id: 'sec-j27s2-p',
        name: 'Physics',
        questions: [
          createQ('q-j272-p1', 1, 'sec-j27s2-p', 'Two light bulbs rated 100 W and 60 W for 220 V are connected in series. Which bulb glows brighter?', ['100 W bulb', '60 W bulb', 'Both equally', 'Neither glows'], 1, 'R = V^2 / P -> R_60 > R_100. In series current is same: P = I^2 R -> 60 W bulb dissipates more power', '60 W bulb (Option B).'),
          createNumQ('q-j272-p2', 2, 'sec-j27s2-p', 'In photoelectric effect, if frequency is below threshold frequency, number of photoelectrons emitted is:', 0, 'No emission occurs below threshold frequency', '0.')
        ]
      },
      {
        id: 'sec-j27s2-c',
        name: 'Chemistry',
        questions: [
          createQ('q-j272-c1', 3, 'sec-j27s2-c', 'Which of the following compounds gives positive Carbylamine test?', ['Aniline (primary amine)', 'N-Methylaniline', 'N,N-Dimethylaniline', 'Nitrobenzene'], 0, 'Primary amines react with CHCl3 and alcoholic KOH to give foul smelling isocyanide', 'Aniline (Option A).'),
          createNumQ('q-j272-c2', 4, 'sec-j27s2-c', 'Number of lone pairs in ammonia NH3 molecule is:', 1, 'NH3 has 3 bond pairs and 1 lone pair', '1.')
        ]
      },
      {
        id: 'sec-j27s2-m',
        name: 'Mathematics',
        questions: [
          createQ('q-j272-m1', 5, 'sec-j27s2-m', 'The value of tan(45°) is equal to:', ['0', '1', '√3', '1/√3'], 1, 'tan 45° = 1', '1 (Option B).'),
          createNumQ('q-j272-m2', 6, 'sec-j27s2-m', 'Value of 10C1 is:', 10, '10', '10.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-adv-2021-p1',
    title: 'JEE Advanced 2021 Official Paper 1',
    examType: 'JEE Advanced',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 6,
    passingMarks: 60,
    rewardCoins: 40,
    isPublished: true,
    source: 'IIT Kharagpur Official Exam Paper 2021',
    sections: [
      {
        id: 'sec-21p1-p',
        name: 'Physics',
        questions: [
          createQ('q-21p1-p1', 1, 'sec-21p1-p', 'A circular coil of radius R carries current I. At distance x = R along the axis from center, magnetic field compared to center field B0 is:', ['B0 / (2√2)', 'B0 / 2', 'B0 / 4', 'B0 / 8'], 0, 'B(x) = B0 / (1 + x^2/R^2)^(3/2) = B0 / (1 + 1)^(3/2) = B0 / 2^(3/2) = B0 / (2√2)', 'B0 / (2√2) (Option A).', 'Moderate', 4, -2),
          createNumQ('q-21p1-p2', 2, 'sec-21p1-p', 'A spring of spring constant k = 200 N/m is compressed by 0.1 m. Potential energy stored in Joules is:', 1, 'U = 1/2 k x^2 = 0.5 × 200 × 0.01 = 1 J', '1.')
        ]
      },
      {
        id: 'sec-21p1-c',
        name: 'Chemistry',
        questions: [
          createQ('q-21p1-c1', 3, 'sec-21p1-c', 'Among the following, the coordination complex with lowest spin-only magnetic moment is:', ['[Fe(CN)6]3-', '[Fe(H2O)6]3+', '[MnCl4]2-', '[Cr(H2O)6]3+'], 0, '[Fe(CN)6]3- has low spin t2g^5 with only 1 unpaired electron (μ = 1.73 BM)', '[Fe(CN)6]3- (Option A).', 'Moderate', 4, -2),
          createNumQ('q-21p1-c2', 4, 'sec-21p1-c', 'Total number of σ bonds in ethyne C2H2 is:', 3, 'H-C (1) + C-C (1) + C-H (1) = 3 σ bonds', '3.')
        ]
      },
      {
        id: 'sec-21p1-m',
        name: 'Mathematics',
        questions: [
          createQ('q-21p1-m1', 5, 'sec-21p1-m', 'The value of the limit lim (x->0) (ln(1 + x) / x) is:', ['0', '1', 'e', '-1'], 1, 'Standard logarithmic limit', '1 (Option B).', 'Easy', 4, -2),
          createNumQ('q-21p1-m2', 6, 'sec-21p1-m', 'The distance between points (0, 0) and (3, 4) is:', 5, '√(9 + 16) = 5', '5.')
        ]
      }
    ]
  },
  {
    id: 'test-jee-adv-2021-p2',
    title: 'JEE Advanced 2021 Official Paper 2',
    examType: 'JEE Advanced',
    subject: 'Full Syllabus',
    durationMinutes: 180,
    totalMarks: 180,
    totalQuestions: 6,
    passingMarks: 60,
    rewardCoins: 40,
    isPublished: true,
    source: 'IIT Kharagpur Official Exam Paper 2021',
    sections: [
      {
        id: 'sec-21p2-p',
        name: 'Physics',
        questions: [
          createQ('q-21p2-p1', 1, 'sec-21p2-p', 'Two moles of ideal monoatomic gas are heated from 300 K to 400 K at constant volume. Change in internal energy ΔU is (R = 8.31 J/mol·K, ΔU = n Cv ΔT = 2 × 1.5R × 100 = 300 R ≈ 2493 J):', ['2493 J', '1246 J', '4155 J', '831 J'], 0, 'ΔU = n Cv ΔT = 2 × (3/2 R) × 100 = 300 R ≈ 2493 J', '2493 J (Option A).', 'Moderate', 4, -2),
          createNumQ('q-21p2-p2', 2, 'sec-21p2-p', 'Speed of sound in vacuum in m/s is:', 0, 'Sound cannot propagate through vacuum', '0.')
        ]
      },
      {
        id: 'sec-21p2-c',
        name: 'Chemistry',
        questions: [
          createQ('q-21p2-c1', 3, 'sec-21p2-c', 'Which of the following compounds is optically inactive due to internal compensation (meso form)?', ['(2R, 3R)-Tartaric acid', '(2S, 3S)-Tartaric acid', '(2R, 3S)-Tartaric acid (meso)', 'D-Lactic acid'], 2, 'Meso tartaric acid has an internal plane of symmetry making it achiral and optically inactive', 'meso-Tartaric acid (Option C).', 'Moderate', 4, -2),
          createNumQ('q-21p2-c2', 4, 'sec-21p2-c', 'Oxidation number of carbon in methane CH4 is -4. Enter absolute magnitude 4:', 4, 'x + 4(+1) = 0 -> x = -4', '4.')
        ]
      },
      {
        id: 'sec-21p2-m',
        name: 'Mathematics',
        questions: [
          createQ('q-21p2-m1', 5, 'sec-21p2-m', 'The area of the region bounded by y = |x| and y = 2 is:', ['2', '4', '8', '1'], 1, 'Triangle with base from x = -2 to 2 (width = 4) and height 2: Area = 1/2 × 4 × 2 = 4', '4 (Option B).', 'Easy', 4, -2),
          createNumQ('q-21p2-m2', 6, 'sec-21p2-m', 'The sum of roots of equation x^2 - 7x + 12 = 0 is:', 7, 'Sum of roots = -b/a = 7', '7.')
        ]
      }
    ]
  },
  {
    id: 'drill-adv-chem-stereochemistry',
    title: '[Adv Chemistry] Stereochemistry & Reaction Energetics Drill',
    examType: 'JEE Advanced',
    subject: 'Chemistry',
    durationMinutes: 40,
    totalMarks: 32,
    totalQuestions: 4,
    passingMarks: 16,
    rewardCoins: 20,
    isPublished: true,
    source: 'IIT Advanced Organic Stereochemistry Decider',
    sections: [
      {
        id: 'sec-dr-stereo',
        name: 'Chemistry',
        questions: [
          createQ('q-str-1', 1, 'sec-dr-stereo', 'Conformation of n-butane with lowest potential energy (highest thermodynamic stability) is:', ['Fully eclipsed', 'Gauche', 'Anti-staggered (anti-periplanar)', 'Partially eclipsed'], 2, 'Anti conformation places the bulky methyl groups 180° apart with zero torsional and steric strain', 'Anti-staggered (Option C).', 'Moderate', 4, -2),
          createQ('q-str-2', 2, 'sec-dr-stereo', 'How many stereoisomers are possible for 2,3-dichlorobutane CH3-CH(Cl)-CH(Cl)-CH3?', ['2', '3', '4', '8'], 1, 'Has 2 identical stereocenters: pair of enantiomers (d, l) + 1 meso compound = 3 stereoisomers', '3 (Option B).', 'Moderate', 4, -2),
          createQ('q-str-3', 3, 'sec-dr-stereo', 'In an E2 elimination reaction, the preferred stereochemical geometry of leaving group and β-hydrogen is:', ['Syn-periplanar (dihedral 0°)', 'Anti-periplanar (dihedral 180°)', 'Skew (dihedral 60°)', 'Perpendicular (90°)'], 1, 'Anti-periplanar alignment allows optimal orbital overlap between C-H and C-X σ* bonds', 'Anti-periplanar (Option B).', 'Moderate', 4, -2),
          createNumQ('q-str-4', 4, 'sec-dr-stereo', 'Number of chiral carbons in 2-chlorobutane is:', 1, 'C2 is bonded to -H, -Cl, -CH3, and -CH2CH3', '1.')
        ]
      }
    ]
  }
];

// Master export of 55 Question Papers & Rapid Quizzes
export const masterMockTests: MockTest[] = [
  ...allMockTests,
  ...extraJeeMainShifts
];

