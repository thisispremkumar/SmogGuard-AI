import { IndoorAirHack } from '../types/index.js';

export const INDOOR_AIR_HACKS: IndoorAirHack[] = [
  {
    id: 'corsi-rosenthal-box',
    title: 'The Corsi-Rosenthal Box ($40 DIY High-CADR Air Purifier)',
    category: 'diy_filtration',
    costLevel: 'Under $40',
    difficulty: 'Easy',
    effectivenessPm25: 92,
    materials: [
      '1x 20-inch standard box fan (3-speed)',
      '4x MERV 13 furnace filters (20" x 20" x 1" or 2")',
      '1x cardboard box (for base and fan shroud)',
      '1x roll of standard duct tape or painter\'s tape',
      'Utility knife or scissors'
    ],
    steps: [
      'Form the 4 MERV 13 filters into a square cube box with the airflow indicator arrows all pointing INWARD toward the center of the box.',
      'Tape the vertical filter corners securely with duct tape to ensure an airtight seal between adjoining filter frames.',
      'Cut a square piece of cardboard from the filter packaging and tape it firmly to the bottom to form the floor of the cube.',
      'Place the 20" box fan on top of the cube, oriented with airflow blowing UPWARD / OUTWARD (away from the filter box).',
      'Cut a circular cardboard donut shroud (approx. 15-inch opening) and tape it onto the front face of the fan to cover the corners, preventing aerodynamic backflow vortexes and boosting air throughput by 20%.',
      'Plug in and run on Medium (Speed 2) for quiet, continuous operation delivering ~500+ CFM of clean air (matching commercial $800 units).'
    ],
    scienceExplanation: 'Developed by environmental engineers Dr. Richard Corsi and Jim Rosenthal, the four-sided geometry provides over 16 square feet of filter surface area. The low air resistance allows the low-pressure box fan to move massive volumes of air through MERV 13 electrostatic media, capturing over 90% of PM2.5 and viral aerosol particles.',
    cadDiagramDescription: 'Square prism configuration: 4 vertical MERV 13 panels forming intake walls, 1 solid bottom cardboard floor, 1 top 20" exhaust fan with circular corner shroud ring.',
  },
  {
    id: 'clean-air-sanctuary-room',
    title: 'Clean-Air Bedroom Sanctuary Setup',
    category: 'sanctuary_room',
    costLevel: 'Under $15',
    difficulty: 'Easy',
    effectivenessPm25: 88,
    materials: [
      'Self-adhesive weatherstripping foam tape (for door perimeter)',
      'Under-door draft stopper or rolled-up dense towel',
      'Painter\'s tape for electrical outlet gaskets and window sash gaps',
      '1x DIY or HEPA air purifier placed 3 feet off the floor'
    ],
    steps: [
      'Select a bedroom on the leeward (non-street-facing) side of your home, ideally where vulnerable members (infant, asthmatic) sleep.',
      'Apply foam weatherstripping tape along the door jamb and place a draft stopper under the bottom door gap.',
      'Inspect window sashes: apply temporary removable painter\'s tape over hairline joints where cold smog seeps in under pressure.',
      'Position your air purifier at least 2 feet away from walls and avoid blowing chilled air directly across the bed.',
      'Keep the door closed continuously; when entering or exiting, slip through quickly to preserve positive microclimate.'
    ],
    scienceExplanation: 'During severe winter inversions, wind pressures and stack effects force smog inward through micro-cracks in walls and doorframes. Establishing a single well-sealed sanctuary room with continuous filtration keeps ambient PM2.5 under 15 µg/m³ even when outdoor air exceeds 300 µg/m³.',
  },
  {
    id: 'inversion-break-ventilation',
    title: 'Inversion-Break 15-Minute Purge Ventilation',
    category: 'ventilation',
    costLevel: 'Free',
    difficulty: 'Easy',
    effectivenessPm25: 65,
    materials: [
      'Timer / smartphone alarm set for 13:30 (1:30 PM)',
      'Two opposing windows (preferably courtyard or interior garden facing)',
      'Optional: spare MERV 11/13 filter sheet taped across screen'
    ],
    steps: [
      'Check the SmogGuard forecast to confirm solar inversion breakdown (typically between 13:00 and 15:00).',
      'Open two non-street-facing windows on opposite sides of the residence for exactly 10 to 15 minutes to initiate rapid cross-flow air exchange.',
      'Turn on bathroom and kitchen mechanical exhaust fans briefly to pull stale CO2 and indoor moisture out.',
      'Close windows tightly at 14:45 before late-afternoon surface cooling begins to reform the ground inversion trap.',
      'Switch your indoor air cleaner to High speed for 20 minutes following the flush to scrub any residual outdoor particulates.'
    ],
    scienceExplanation: 'Winter homes accumulate dangerous levels of indoor CO2, moisture, and VOCs if sealed permanently. Solar radiation reaches peak ground warming at early afternoon, triggering thermal convective plumes that mix and dilute surface smog by 35-50% compared to night-time stagnation.',
  },
  {
    id: 'kitchen-source-control',
    title: 'Zero-Emission Kitchen & Cooking Protocol',
    category: 'source_control',
    costLevel: 'Free',
    difficulty: 'Easy',
    effectivenessPm25: 78,
    materials: [
      'Cooking pot lids for all active stove burners',
      'Electric kettle / induction plate (if available)',
      'Kitchen range hood set to High with closed bedroom doors'
    ],
    steps: [
      'Always use the BACK burners first on gas stoves: range hoods capture 70-80% of back-burner fumes compared to only 30-40% on front burners.',
      'Turn on the range hood exhaust 2 minutes BEFORE igniting burners to establish upward convective airflow.',
      'Always cook with lids secured on pots to prevent aerosolization of microscopic cooking oils and moisture.',
      'Substitute high-heat stir-frying, grilling, and deep frying with steaming, boiling, stewing, or microwave cooking during high smog alerts.',
      'Keep kitchen doors closed to prevent nitrogen dioxide (NO2) and ultrafine carbon particles from migrating into sleeping areas.'
    ],
    scienceExplanation: 'Cooking on open gas flames without proper containment can spike indoor NO2 above 400 ppb and PM2.5 over 150 µg/m³ within 15 minutes. Using lids and back burners dramatically suppresses combustion plume dispersion.',
  },
  {
    id: 'respiratory-cilia-humidity-balance',
    title: 'Cilia Defense: 40-50% Winter Humidity Regulation',
    category: 'plants_humidity',
    costLevel: 'Under $15',
    difficulty: 'Easy',
    effectivenessPm25: 45,
    materials: [
      'Inexpensive hygrometer ($5-$8 digital sensor)',
      'Shallow ceramic bowl of clean tap water placed atop radiator / heater register',
      'Spider plants or Snake plants (Sansevieria) in bedroom'
    ],
    steps: [
      'Place the hygrometer in your main living space; check that relative humidity remains between 40% and 50%.',
      'Avoid running ultra-dry heating without moisture: place a heat-safe ceramic bowl of clean water directly near your radiator or baseboard.',
      'Rinse and refill water bowls daily to eliminate bacterial stagnation; do not use ultrasonic humidifiers with mineral-heavy hard tap water as they disperse fine mineral dust.',
      'Incorporate hardy houseplants (Snake Plant, Spider Plant) which naturally regulate transpirational humidity without releasing dust.'
    ],
    scienceExplanation: 'When cold winter heating drops indoor humidity below 30%, human respiratory epithelial cilia dry out and become paralyzed, allowing inhaled PM2.5 to penetrate deep into alveoli. Maintaining 40-50% humidity preserves mucosal clearance while avoiding mold growth thresholds (>60%).',
  },
  {
    id: 'mask-fit-multiplier',
    title: 'Emergency Mask-Fit Multiplier (Eliminating Perimeter Leaks)',
    category: 'source_control',
    costLevel: 'Under $15',
    difficulty: 'Easy',
    effectivenessPm25: 80,
    materials: [
      'Standard 3-ply surgical mask or KN95',
      'Small rubber band / silicone mask brace or hair clip for ear loops'
    ],
    steps: [
      'If an N95 is unavailable, take a standard surgical mask and tie an overhand knot in each earloop right where it meets the mask fabric edge.',
      'Fold and tuck the corner fabric inward along the cheek fold so there are no open side gills.',
      'Firmly mold the metal nose-wire over the bridge of your nose using two fingers in an inverted V shape.',
      'Use a back-of-the-head strap clip to anchor ear loops snugly, creating a tight perimeter seal against your cheeks and jaw.',
      'Perform a seal check: exhale gently; you should feel the mask puff slightly outward without air blowing into your eyes or escaping under your chin.'
    ],
    scienceExplanation: 'Standard loose surgical masks leak 60% of air around cheeks and nose. Eliminating edge leakage via knotting or tension clips increases particulate filtration efficiency from ~35% to over 80% for unavoidable winter commutes.',
  }
];

export class IndoorAirService {
  public getAllHacks(): IndoorAirHack[] {
    return INDOOR_AIR_HACKS;
  }

  public getHacksByCategory(category: IndoorAirHack['category']): IndoorAirHack[] {
    return INDOOR_AIR_HACKS.filter(h => h.category === category);
  }

  public getHackById(id: string): IndoorAirHack | undefined {
    return INDOOR_AIR_HACKS.find(h => h.id === id);
  }
}

export const indoorAirService = new IndoorAirService();
