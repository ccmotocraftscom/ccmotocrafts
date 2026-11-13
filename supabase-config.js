/**
 * ============================================================================
 * CC MOTOCRAFTS AI ENGINE LABS SERVICE - SUPABASE & BUSINESS CONFIGURATION
 * Domain: https://ccmotocrafts.in
 * Official Business Email: info@ccmotocrafts.in (All legacy aisupport.on@gmail.com references removed)
 * Official Business WhatsApp & Helpline: +91 8333084261
 * ============================================================================
 */

window.CC_CONFIG = {
  brandName: "CC Motocrafts AI Engine Labs Service",
  tagline: "Hyderabad's Premier Multi-Brand Two-Wheeler (100cc–2500cc) Diagnostic & Service Network",
  domain: "https://ccmotocrafts.in",
  officialEmail: "info@ccmotocrafts.in",
  officialPhone: "+91 8333084261",
  officialWhatsApp: "918333084261",
  masterTechnician: "Mr. Shaik Mujahid Qadri (Certified Master Technician & Technical Head)",
  workshopTimings: "Monday – Sunday: 09:00 AM – 10:30 PM",

  // Supabase Integration
  // Note: Your publishable key is pre-configured below.
  // Paste your Supabase Project URL (e.g., https://abcdefghijklm.supabase.co) in supabaseUrl or via the Admin Panel -> Supabase Setup tab.
  supabasePublishableKey: atob("c2JfcHVibGlzaGFibGVfNHNfVWRBMXJKVHJGNWFlQ2hfX3dDZ19YWkN5aDFfSQ=="),
  supabaseUrl: (localStorage.getItem("ccm_supabase_url") && localStorage.getItem("ccm_supabase_url").includes("unpbcjgnctdmtwzmoymt") ? localStorage.getItem("ccm_supabase_url") : null) || atob("aHR0cHM6Ly91bnBiY2pnbmN0ZG10d3ptb3ltdC5zdXBhYmFzZS5jbw=="),
  cloudflareWorkerUrl: localStorage.getItem("ccm_worker_url") || "",

  // VIP Clusters with Rs. 0 FREE Flatbed Van Pickup & Drop
  vipClusters: [
    {
      id: "POST-1",
      title: "POST 1: Jubilee Hills, Banjara Hills & Film Nagar Special",
      areas: ["Jubilee Hills", "Banjara Hills", "Film Nagar", "Nanakramguda"],
      pincodes: ["500033", "500034", "500096"],
      pickupFee: 0,
      cancellationFee: 300,
      badge: "FREE VIP FLATBED PICKUP & DROP"
    },
    {
      id: "POST-2",
      title: "POST 2: Gachibowli, Financial District, Kokapet, Narsingi & Puppalguda",
      areas: ["Gachibowli", "Financial District", "Kokapet", "Narsingi", "Puppalguda", "Manikonda"],
      pincodes: ["500032", "500075", "500089"],
      pickupFee: 0,
      cancellationFee: 300,
      badge: "FREE VIP FLATBED PICKUP & DROP"
    },
    {
      id: "POST-3",
      title: "POST 3: Hitech City, Madhapur, Kondapur & Lanco Hills",
      areas: ["HITEC City", "Madhapur", "Kondapur", "Lanco Hills"],
      pincodes: ["500081", "500084", "500089"],
      pickupFee: 0,
      cancellationFee: 300,
      badge: "FREE VIP FLATBED PICKUP & DROP"
    }
  ],

  vipPincodes: ["500033", "500034", "500096", "500032", "500075", "500089", "500081", "500084"],
  otherHyderabadPickupFee: 500,
  otherHyderabadCancellationFee: 500,

  // Area Dropdown Options
  hyderabadAreas: [
    { label: "Jubilee Hills / Film Nagar — 500033 (FREE VIP Pickup & Drop)", pincode: "500033", area: "Jubilee Hills / Film Nagar", vip: true },
    { label: "Banjara Hills — 500034 (FREE VIP Pickup & Drop)", pincode: "500034", area: "Banjara Hills", vip: true },
    { label: "Film Nagar / Nanakramguda — 500096 (FREE VIP Pickup & Drop)", pincode: "500096", area: "Film Nagar / Nanakramguda", vip: true },
    { label: "Gachibowli / Financial District — 500032 (FREE VIP Pickup & Drop)", pincode: "500032", area: "Gachibowli / Financial District", vip: true },
    { label: "Kokapet / Narsingi — 500075 (FREE VIP Pickup & Drop)", pincode: "500075", area: "Kokapet / Narsingi", vip: true },
    { label: "Manikonda / Puppalguda / Lanco Hills — 500089 (FREE VIP Pickup & Drop)", pincode: "500089", area: "Manikonda / Puppalguda / Lanco Hills", vip: true },
    { label: "HITEC City / Madhapur — 500081 (FREE VIP Pickup & Drop)", pincode: "500081", area: "HITEC City / Madhapur", vip: true },
    { label: "Kondapur — 500084 (FREE VIP Pickup & Drop)", pincode: "500084", area: "Kondapur", vip: true },
    { label: "Tolichowki / Shaikpet — 500008 (Standard ₹500 Pickup & Drop)", pincode: "500008", area: "Tolichowki / Shaikpet", vip: false },
    { label: "Mehdipatnam — 500028 (Standard ₹500 Pickup & Drop)", pincode: "500028", area: "Mehdipatnam", vip: false },
    { label: "Kukatpally / KPHB — 500072 (Standard ₹500 Pickup & Drop)", pincode: "500072", area: "Kukatpally / KPHB", vip: false },
    { label: "Miyapur — 500049 (Standard ₹500 Pickup & Drop)", pincode: "500049", area: "Miyapur", vip: false },
    { label: "Attapur / Rajendranagar — 500086 (Standard ₹500 Pickup & Drop)", pincode: "500086", area: "Attapur / Rajendranagar", vip: false },
    { label: "Secunderabad / Begumpet — 500003 (Standard ₹500 Pickup & Drop)", pincode: "500003", area: "Secunderabad / Begumpet", vip: false },
    { label: "Other Hyderabad Area / Enter Custom PIN (Standard ₹500 Pickup & Drop)", pincode: "500001", area: "Other Hyderabad Area", vip: false }
  ],

  // 4 Mandatory Vehicle Classes
  vehicleClasses: [
    {
      id: "Scooter / Gearless",
      title: "Scooter / Gearless",
      ccRange: "100cc – 160cc CVT & Electric",
      examples: "Activa, Jupiter, Access 125, Vespa, Aprilia SR, Aerox 155, Ather, Ola",
      baseInspect: "₹299",
      icon: "🛵"
    },
    {
      id: "Commuter (100–160cc)",
      title: "Commuter (100–160cc)",
      ccRange: "100cc – 160cc Single Cylinder",
      examples: "Splendor, Shine, Unicorn, Pulsar 150, Apache RTR 160, FZ-S, Raider",
      baseInspect: "₹349",
      icon: "🏍️"
    },
    {
      id: "Sports (200–500cc)",
      title: "Sports & Cruiser (200–500cc)",
      ccRange: "200cc – 500cc Performance & Royal Enfield",
      examples: "Classic 350, Himalayan 450, KTM Duke/RC 200-390, Dominar 400, R15, BMW G310R, Speed 400",
      baseInspect: "₹599",
      icon: "⚡"
    },
    {
      id: "Multi-Cylinder Superbike (600–2500cc)",
      title: "Multi-Cylinder Superbike (600–2500cc)",
      ccRange: "600cc – 2500cc Twin, Inline-4, V-Twin & V4",
      examples: "Interceptor 650, Kawasaki Z900/ZX-10R, Triumph Street Triple/Rocket 3, Ducati Monster/Panigale, Harley, Hayabusa, BMW S1000RR",
      baseInspect: "₹1,299",
      icon: "🏁"
    }
  ],

  // 8 Mandatory Service Categories
  defaultServices: [
    {
      id: "SRV-GEN",
      code: "SRV-GEN",
      category: "General service",
      name: "General Periodic Service & 40-Point AI Lab Inspection",
      scooter_price: 899,
      commuter_price: 1099,
      sports_price: 1999,
      superbike_price: 3999,
      labor_charge: 450,
      warranty: "30-Day Unconditional Workmanship Guarantee",
      desc: "Synthetic/OEM oil change, oil & air filter care, chain/CVT cleaning, brake calibration, electrical check & computer wash."
    },
    {
      id: "SRV-ENG",
      code: "SRV-ENG",
      category: "Engine repair/rebuild",
      name: "Complete Engine Repair, Overhaul & Precision Rebuild",
      scooter_price: 3499,
      commuter_price: 4499,
      sports_price: 7999,
      superbike_price: 16999,
      labor_charge: 2500,
      warranty: "Major Engine Warranty (First check 15–30 days / 500–750 km; periodic 1,800–2,000 km / 45–60 days)",
      desc: "Cylinder head resurfacing, precision valve seat lapping, bore/piston kit, crankshaft balancing & timing chain overhaul."
    },
    {
      id: "SRV-ECU",
      code: "SRV-ECU",
      category: "FI/ECU diagnostics",
      name: "FI / ECU / OBD-II Computerized Diagnostics & Tuning",
      scooter_price: 499,
      commuter_price: 599,
      sports_price: 999,
      superbike_price: 1999,
      labor_charge: 499,
      warranty: "30-Day Sensor & Calibration Guarantee",
      desc: "OBD-II fault code scanning, fuel injector ultrasonic cleaning, throttle body sync, AFR sensor & ECU remapping."
    },
    {
      id: "SRV-ELC",
      code: "SRV-ELC",
      category: "Electrical troubleshooting",
      name: "Electrical Wiring Harness, Stator & Sensor Troubleshooting",
      scooter_price: 399,
      commuter_price: 499,
      sports_price: 899,
      superbike_price: 1799,
      labor_charge: 399,
      warranty: "30-Day Electrical Workmanship Guarantee",
      desc: "Complete wiring short-circuit resolution, magnet coil/stator check, RR unit testing, ABS wheel-speed sensors & lighting."
    },
    {
      id: "SRV-BRK",
      code: "SRV-BRK",
      category: "Brake & suspension",
      name: "Brake Caliper Overhaul, ABS Bleeding & Fork Suspension Rebuild",
      scooter_price: 699,
      commuter_price: 899,
      sports_price: 1599,
      superbike_price: 3299,
      labor_charge: 550,
      warranty: "30-Day Workmanship Guarantee",
      desc: "Upside-down (USD) & telescopic fork oil/seal rebuild, monoshock setup, sintered brake pads & DOT4/DOT5.1 ABS bleeding."
    },
    {
      id: "SRV-CLT",
      code: "SRV-CLT",
      category: "Clutch & transmission",
      name: "Clutch Overhaul, Slipper Clutch & Scooter CVT Drivetrain",
      scooter_price: 799,
      commuter_price: 1199,
      sports_price: 2199,
      superbike_price: 4499,
      labor_charge: 650,
      warranty: "30-Day Workmanship Guarantee",
      desc: "Clutch plate/hub replacement, slipper clutch servicing, scooter CVT variator rollers & Kevlar belt, brass chain-sprocket kit."
    },
    {
      id: "SRV-BAT",
      code: "SRV-BAT",
      category: "Battery & starting",
      name: "Battery CCA Load Test, Starter Motor & Charging Care",
      scooter_price: 299,
      commuter_price: 399,
      sports_price: 699,
      superbike_price: 1299,
      labor_charge: 299,
      warranty: "OEM Battery Warranty + 30-Day Labor Guarantee",
      desc: "Digital battery health & parasitic drain test, starter motor armature/carbon brush overhaul, one-way clutch bearing replacement."
    },
    {
      id: "SRV-ACC",
      code: "SRV-ACC",
      category: "Accident repair",
      name: "Laser Chassis Alignment, Fork Truing & Accident Restoration",
      scooter_price: 1999,
      commuter_price: 2499,
      sports_price: 4999,
      superbike_price: 9999,
      labor_charge: 1500,
      warranty: "30-Day Structural & Alignment Guarantee",
      desc: "Complete accidental damage estimation, chassis & T-stem truing, OEM fairing & genuine parts replacement after WhatsApp approval."
    }
  ],

  // 18 Curated Portfolio Items mapped to all uploaded images
  portfolioItems: [
    {
      img: "portfolio-superbike-inline4-rebuild.jpg",
      title: "Kawasaki Inline-4 Superbike Engine Rebuild",
      category: "Engine repair/rebuild",
      vehicleClass: "Multi-Cylinder Superbike (600–2500cc)",
      badge: "600cc–2500cc Superbike Lab",
      desc: "Complete 4-cylinder engine block teardown, crankshaft journal inspection, and factory torque assembly."
    },
    {
      img: "portfolio-ducati-trellis-rebuild.jpg",
      title: "Ducati L-Twin Frame & Engine Overhaul",
      category: "Engine repair/rebuild",
      vehicleClass: "Multi-Cylinder Superbike (600–2500cc)",
      badge: "Desmodromic & L-Twin Specialist",
      desc: "Desmo valve clearance check, timing belt service, and trellis frame engine diagnostics."
    },
    {
      img: "portfolio-aprilia-superbike-overhaul.jpg",
      title: "Aprilia V4 Superbike Full Diagnostic & Overhaul",
      category: "FI/ECU diagnostics",
      vehicleClass: "Multi-Cylinder Superbike (600–2500cc)",
      badge: "Italian Superbike Care",
      desc: "Ride-by-wire throttle calibration, APRC sensor diagnostics, and cooling system overhaul."
    },
    {
      img: "portfolio-kawasaki-z900-exhaust.jpg",
      title: "Kawasaki Z900 Exhaust, Suspension & General Service",
      category: "General service",
      vehicleClass: "Multi-Cylinder Superbike (600–2500cc)",
      badge: "Inline-4 Performance Bay",
      desc: "Full synthetic oil service, header torque check, chain laser alignment, and brake caliper cleaning."
    },
    {
      img: "portfolio-cylinder-head-valve-care.jpg",
      title: "Cylinder Head Resurfacing & Precision Valve Lapping",
      category: "Engine repair/rebuild",
      vehicleClass: "Multi-Cylinder Superbike (600–2500cc)",
      badge: "Head & Valve Precision Care",
      desc: "Micro-tolerance cylinder head resurfacing and valve seat lapping for maximum compression restoration."
    },
    {
      img: "portfolio-crankcase-precision-assembly.jpg",
      title: "Bottom-End Crankcase & Gearbox Blueprinting",
      category: "Clutch & transmission",
      vehicleClass: "Sports (200–500cc)",
      badge: "Transmission & Crank Lab",
      desc: "Split crankcase bearing replacement, shift fork inspection, and precision torque assembly."
    },
    {
      img: "portfolio-fi-ecu-troubleshooting.jpg",
      title: "FI / ECU Circuit & Check-Engine Live Troubleshooting",
      category: "FI/ECU diagnostics",
      vehicleClass: "Multi-Cylinder Superbike (600–2500cc)",
      badge: "ECU & Sensor Bench",
      desc: "Resolving stalling, no-start, and check-engine faults using digital oscilloscopes and OBD-II scanners."
    },
    {
      img: "portfolio-adventure-obd-scan.jpg",
      title: "Adventure Tourer Laptop OBD-II & ABS Calibration",
      category: "FI/ECU diagnostics",
      vehicleClass: "Sports (200–500cc)",
      badge: "OBD-II Live Telemetry",
      desc: "Computerized ECU fault reading, fuel trim mapping, and rear drivetrain service for adventure tourers."
    },
    {
      img: "portfolio-bmw-g310r-diagnostics.jpg",
      title: "BMW G310R Computerized Service & Fluid Flush",
      category: "General service",
      vehicleClass: "Sports (200–500cc)",
      badge: "BMW Motorrad Specialist",
      desc: "Service interval reset, diagnostic scan, synthetic oil change, and hydraulic brake bleeding."
    },
    {
      img: "portfolio-himalayan-suspension-forks.jpg",
      title: "Royal Enfield Himalayan Front Fork & Suspension Rebuild",
      category: "Brake & suspension",
      vehicleClass: "Sports (200–500cc)",
      badge: "Suspension & Steering Lab",
      desc: "Complete front fork oil & genuine oil-seal replacement, cone-set adjustment, and wheel alignment."
    },
    {
      img: "portfolio-royal-enfield-general.jpg",
      title: "Royal Enfield 350/650 Periodic Service & Detailing",
      category: "General service",
      vehicleClass: "Sports (200–500cc)",
      badge: "Royal Enfield Care",
      desc: "Tappet clearance adjustment, fuel injector cleaning, chain lube, and 40-point safety inspection."
    },
    {
      img: "portfolio-cruiser-brake-service.jpg",
      title: "Cruiser Disc Brake Caliper & Wheel Bearing Overhaul",
      category: "Brake & suspension",
      vehicleClass: "Sports (200–500cc)",
      badge: "Braking & ABS Safety",
      desc: "Master cylinder rebuild, sintered pad installation, rotor runout check, and ABS bleeding."
    },
    {
      img: "portfolio-commuter-sport-red.jpg",
      title: "Commuter & Naked Sport Periodic Maintenance",
      category: "General service",
      vehicleClass: "Commuter (100–160cc)",
      badge: "100cc–160cc Daily Rider Lab",
      desc: "High-mileage engine care, carburetor/injector tuning, air filter replacement, and electrical check."
    },
    {
      img: "portfolio-clutch-transmission-bay.jpg",
      title: "Multi-Plate Wet Clutch & Chain Drivetrain Overhaul",
      category: "Clutch & transmission",
      vehicleClass: "Commuter (100–160cc)",
      badge: "Clutch & Sprocket Bay",
      desc: "Genuine clutch plate set, pressure plates, clutch cable lubrication, and chain-sprocket kit installation."
    },
    {
      img: "portfolio-retro-electrical-wiring.jpg",
      title: "Complete Wiring Harness, Battery & Charging Restoration",
      category: "Electrical troubleshooting",
      vehicleClass: "Commuter (100–160cc)",
      badge: "Electrical & Battery Lab",
      desc: "Multimeter load testing, stator coil check, RR unit replacement, and custom relay harness protection."
    },
    {
      img: "portfolio-scooter-vespa-yellow.jpg",
      title: "Vespa & Premium Gearless Scooter Full Service",
      category: "General service",
      vehicleClass: "Scooter / Gearless",
      badge: "Gearless / Scooter Bay",
      desc: "Complete gearless scooter maintenance, engine oil & gear oil replacement, and brake shoe renewal."
    },
    {
      img: "portfolio-scooter-cvt-drivetrain.jpg",
      title: "Scooter CVT Variator, Belt & Clutch Bell Overhaul",
      category: "Clutch & transmission",
      vehicleClass: "Scooter / Gearless",
      badge: "CVT Drivetrain Care",
      desc: "Eliminating scooter vibration and mileage drop with genuine variator rollers, Kevlar belt, and clutch cleaning."
    },
    {
      img: "portfolio-scooter-vespa-red.jpg",
      title: "Gearless Scooter Engine, Suspension & Body Restoration",
      category: "Accident repair",
      vehicleClass: "Scooter / Gearless",
      badge: "Scooter Restoration",
      desc: "Front link-suspension bushing overhaul, dent/paint restoration, and self-starter motor repair."
    }
  ]
};
