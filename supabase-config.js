/**
 * ============================================================================
 * CC MOTOCRAFTS AI ENGINE LABS SERVICE - CONFIGURATION
 * Domain: https://ccmotocrafts.in | Official Email: info@ccmotocrafts.in
 * Manager & Lead Dispatcher: Mr. Nitish Kumar (+91 8333084261)
 * Scope: 100cc to 2500cc Petrol Two-Wheelers (Bikes & Gearless Scooters Only — Strictly No EVs)
 * ============================================================================
 */

window.CC_CONFIG = {
  brandName: "CC Motocrafts AI Engine Labs Service",
  tagline: "Hyderabad's Premier Multi-Brand Petrol Two-Wheeler (100cc–2500cc) Diagnostic & Service Network",
  domain: "https://ccmotocrafts.in",
  officialEmail: "info@ccmotocrafts.in",
  officialPhone: "+91 8333084261",
  officialWhatsApp: "918333084261",
  managerAndDispatcher: "Mr. Nitish Kumar (Manager & Lead Dispatcher — +91 8333084261)",
  masterTechnician: "Mr. Shaik Mujahid Qadri (Certified Master Technician & Technical Head)",
  workshopTimings: "Monday – Sunday: 09:00 AM – 10:30 PM",

  supabasePublishableKey: atob("c2JfcHVibGlzaGFibGVfNHNfVWRBMXJKVHJGNWFlQ2hfX3dDZ19YWkN5aDFfSQ=="),
  supabaseUrl: atob("aHR0cHM6Ly94cnJsYnF4Ymd4bWV0cndnaXd2ay5zdXBhYmFzZS5jbw=="),
  supabaseSecondaryUrl: atob("aHR0cHM6Ly91bnBiY2pnbmN0ZG10d3ptb3ltdC5zdXBhYmFzZS5jbw=="),

  vipPincodes: ["500033", "500034", "500096", "500032", "500075", "500089", "500081", "500084"],
  otherHyderabadPickupFee: 500,
  otherHyderabadCancellationFee: 500,

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

  // 4 Mandatory Vehicle Classes (Strictly Petrol Only — 100cc to 2500cc, Zero EVs)
  vehicleClasses: [
    {
      id: "Scooter / Gearless (100–160cc Petrol)",
      title: "Scooter / Gearless (Petrol)",
      ccRange: "100cc – 160cc CVT Petrol Scooters",
      examples: "Honda Activa 110/125, TVS Jupiter, Suzuki Access 125, Burgman, Vespa, Aprilia SR 160, Yamaha Aerox 155 (Strictly Petrol Only)",
      baseInspect: "₹299",
      icon: "🛵"
    },
    {
      id: "Commuter (100–160cc Petrol)",
      title: "Commuter Bikes (100–160cc)",
      ccRange: "100cc – 160cc Single-Cylinder Petrol",
      examples: "Hero Splendor+, Honda Shine/Unicorn, Bajaj Pulsar 150, TVS Apache RTR 160 4V, Yamaha FZ-S, Raider 125",
      baseInspect: "₹349",
      icon: "🏍️"
    },
    {
      id: "Sports & Cruiser (200–500cc Petrol)",
      title: "Sports & Cruiser (200–500cc)",
      ccRange: "200cc – 500cc Performance & Royal Enfield",
      examples: "Royal Enfield Classic 350, Himalayan 450, KTM Duke/RC 200/250/390, Apache RTR 200 4V, Dominar 400, R15 V4, BMW G310R, Triumph Speed 400",
      baseInspect: "₹599",
      icon: "⚡"
    },
    {
      id: "Multi-Cylinder Superbike (600–2500cc Petrol)",
      title: "Multi-Cylinder Superbike (600–2500cc)",
      ccRange: "600cc – 2500cc Twin, Inline-4, V-Twin & V4",
      examples: "Suzuki Hayabusa 1300cc, Benelli TNT 600i, Kawasaki Z900/ZX-10R, Interceptor 650, Triumph Street Triple/Rocket 3, Ducati, Harley-Davidson, Aprilia RSV4",
      baseInspect: "₹1,299",
      icon: "🏁"
    }
  ],

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
      desc: "Synthetic/OEM petrol engine oil change, oil & air filter care, chain/CVT cleaning, brake calibration, electrical check & foam wash."
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
      desc: "OBD-II fault code scanning, petrol fuel injector ultrasonic cleaning, throttle body sync, AFR sensor & ECU remapping."
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
      desc: "Complete wiring short-circuit resolution, magnet coil/stator check, RR unit testing, ABS wheel-speed sensors & ignition coils."
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
      desc: "Clutch plate/hub replacement, slipper clutch servicing, petrol scooter CVT variator rollers & Kevlar belt, brass chain-sprocket kit."
    },
    {
      id: "SRV-BAT",
      code: "SRV-BAT",
      category: "Battery & starting",
      name: "Battery CCA Load Test, Self-Starter Motor & Charging Care",
      scooter_price: 299,
      commuter_price: 399,
      sports_price: 699,
      superbike_price: 1299,
      labor_charge: 299,
      warranty: "OEM Battery Warranty + 30-Day Labor Guarantee",
      desc: "Digital 12V battery health & parasitic drain test, starter motor armature/carbon brush overhaul, one-way clutch bearing replacement."
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

  portfolioItems: [
    {
      img: "portfolio-superbike-inline4-rebuild.jpg",
      title: "Kawasaki Inline-4 Superbike Engine Rebuild",
      category: "Engine repair/rebuild",
      vehicleClass: "Multi-Cylinder Superbike (600–2500cc Petrol)",
      ccFilter: "600-2500cc",
      badge: "600cc–2500cc Superbike Lab",
      desc: "Complete 4-cylinder petrol engine block teardown, crankshaft journal inspection, and factory torque assembly."
    },
    {
      img: "portfolio-ducati-trellis-rebuild.jpg",
      title: "Ducati L-Twin Frame & Engine Overhaul",
      category: "Engine repair/rebuild",
      vehicleClass: "Multi-Cylinder Superbike (600–2500cc Petrol)",
      ccFilter: "600-2500cc",
      badge: "Desmodromic & L-Twin Specialist",
      desc: "Desmo valve clearance check, timing belt service, and trellis frame engine diagnostics."
    },
    {
      img: "portfolio-aprilia-superbike-overhaul.jpg",
      title: "Aprilia V4 Superbike Full Diagnostic & Overhaul",
      category: "FI/ECU diagnostics",
      vehicleClass: "Multi-Cylinder Superbike (600–2500cc Petrol)",
      ccFilter: "600-2500cc",
      badge: "Italian Superbike Care",
      desc: "Ride-by-wire throttle calibration, APRC sensor diagnostics, and cooling system overhaul."
    },
    {
      img: "portfolio-kawasaki-z900-exhaust.jpg",
      title: "Kawasaki Z900 Exhaust, Suspension & General Service",
      category: "General service",
      vehicleClass: "Multi-Cylinder Superbike (600–2500cc Petrol)",
      ccFilter: "600-2500cc",
      badge: "Inline-4 Performance Bay",
      desc: "Full synthetic oil service, header torque check, chain laser alignment, and brake caliper cleaning."
    },
    {
      img: "portfolio-cylinder-head-valve-care.jpg",
      title: "Cylinder Head Resurfacing & Precision Valve Lapping",
      category: "Engine repair/rebuild",
      vehicleClass: "Multi-Cylinder Superbike (600–2500cc Petrol)",
      ccFilter: "600-2500cc",
      badge: "Head & Valve Precision Care",
      desc: "Micro-tolerance cylinder head resurfacing and valve seat lapping for maximum compression restoration."
    },
    {
      img: "portfolio-fi-ecu-troubleshooting.jpg",
      title: "FI / ECU Circuit & Check-Engine Live Troubleshooting",
      category: "FI/ECU diagnostics",
      vehicleClass: "Multi-Cylinder Superbike (600–2500cc Petrol)",
      ccFilter: "600-2500cc",
      badge: "ECU & Sensor Bench",
      desc: "Resolving stalling, no-start, and check-engine faults using digital oscilloscopes and OBD-II scanners."
    },
    {
      img: "portfolio-crankcase-precision-assembly.jpg",
      title: "Bottom-End Crankcase & Gearbox Blueprinting",
      category: "Clutch & transmission",
      vehicleClass: "Sports & Cruiser (200–500cc Petrol)",
      ccFilter: "200-500cc",
      badge: "Transmission & Crank Lab",
      desc: "Split crankcase bearing replacement, shift fork inspection, and precision torque assembly."
    },
    {
      img: "portfolio-adventure-obd-scan.jpg",
      title: "Adventure Tourer Laptop OBD-II & ABS Calibration",
      category: "FI/ECU diagnostics",
      vehicleClass: "Sports & Cruiser (200–500cc Petrol)",
      ccFilter: "200-500cc",
      badge: "OBD-II Live Telemetry",
      desc: "Computerized ECU fault reading, petrol fuel trim mapping, and rear drivetrain service for adventure tourers."
    },
    {
      img: "portfolio-bmw-g310r-diagnostics.jpg",
      title: "BMW G310R Computerized Service & Fluid Flush",
      category: "General service",
      vehicleClass: "Sports & Cruiser (200–500cc Petrol)",
      ccFilter: "200-500cc",
      badge: "BMW Motorrad Specialist",
      desc: "Service interval reset, diagnostic scan, synthetic oil change, and hydraulic brake bleeding."
    },
    {
      img: "portfolio-himalayan-suspension-forks.jpg",
      title: "Royal Enfield Himalayan Front Fork & Suspension Rebuild",
      category: "Brake & suspension",
      vehicleClass: "Sports & Cruiser (200–500cc Petrol)",
      ccFilter: "200-500cc",
      badge: "Suspension & Steering Lab",
      desc: "Complete front fork oil & genuine oil-seal replacement, cone-set adjustment, and wheel alignment."
    },
    {
      img: "portfolio-royal-enfield-general.jpg",
      title: "Royal Enfield 350/650 Periodic Service & Detailing",
      category: "General service",
      vehicleClass: "Sports & Cruiser (200–500cc Petrol)",
      ccFilter: "200-500cc",
      badge: "Royal Enfield Care",
      desc: "Tappet clearance adjustment, fuel injector cleaning, chain lube, and 40-point safety inspection."
    },
    {
      img: "portfolio-cruiser-brake-service.jpg",
      title: "Cruiser Disc Brake Caliper & Wheel Bearing Overhaul",
      category: "Brake & suspension",
      vehicleClass: "Sports & Cruiser (200–500cc Petrol)",
      ccFilter: "200-500cc",
      badge: "Braking & ABS Safety",
      desc: "Master cylinder rebuild, sintered pad installation, rotor runout check, and ABS bleeding."
    },
    {
      img: "portfolio-commuter-sport-red.jpg",
      title: "Commuter & Naked Sport Periodic Maintenance",
      category: "General service",
      vehicleClass: "Commuter (100–160cc Petrol)",
      ccFilter: "100-160cc",
      badge: "100cc–160cc Daily Rider Lab",
      desc: "High-mileage petrol engine care, carburetor/injector tuning, air filter replacement, and electrical check."
    },
    {
      img: "portfolio-clutch-transmission-bay.jpg",
      title: "Multi-Plate Wet Clutch & Chain Drivetrain Overhaul",
      category: "Clutch & transmission",
      vehicleClass: "Commuter (100–160cc Petrol)",
      ccFilter: "100-160cc",
      badge: "Clutch & Sprocket Bay",
      desc: "Genuine clutch plate set, pressure plates, clutch cable lubrication, and chain-sprocket kit installation."
    },
    {
      img: "portfolio-retro-electrical-wiring.jpg",
      title: "Complete Wiring Harness, Battery & Charging Restoration",
      category: "Electrical troubleshooting",
      vehicleClass: "Commuter (100–160cc Petrol)",
      ccFilter: "100-160cc",
      badge: "Electrical & Battery Lab",
      desc: "Multimeter load testing, stator coil check, RR unit replacement, and custom relay harness protection."
    },
    {
      img: "portfolio-scooter-vespa-yellow.jpg",
      title: "Vespa & Premium Gearless Petrol Scooter Full Service",
      category: "General service",
      vehicleClass: "Scooter / Gearless (100–160cc Petrol)",
      ccFilter: "Scooter",
      badge: "Gearless Petrol Scooter Bay",
      desc: "Complete gearless petrol scooter maintenance, engine oil & gear oil replacement, and brake shoe renewal."
    },
    {
      img: "portfolio-scooter-cvt-drivetrain.jpg",
      title: "Scooter CVT Variator, Belt & Clutch Bell Overhaul",
      category: "Clutch & transmission",
      vehicleClass: "Scooter / Gearless (100–160cc Petrol)",
      ccFilter: "Scooter",
      badge: "CVT Drivetrain Care",
      desc: "Eliminating scooter vibration and mileage drop with genuine variator rollers, Kevlar belt, and clutch cleaning."
    },
    {
      img: "portfolio-scooter-vespa-red.jpg",
      title: "Gearless Petrol Scooter Engine, Suspension & Body Restoration",
      category: "Accident repair",
      vehicleClass: "Scooter / Gearless (100–160cc Petrol)",
      ccFilter: "Scooter",
      badge: "Scooter Restoration",
      desc: "Front link-suspension bushing overhaul, dent/paint restoration, and self-starter motor repair."
    }
  ],

  // Pre-Populated Family Vehicle Garage Records (Accessible via Customer Mobile Lookup or Default View)
  defaultFamilyGarage: [
    {
      reg_number: "KA 51 HW 3002",
      vehicle_brand: "Honda",
      vehicle_model: "Activa 125cc (Gearless Petrol)",
      vehicle_class: "Scooter / Gearless (100–160cc Petrol)",
      engine_cc: "125cc",
      odometer_km: 28938,
      last_service_date: "2026-11-12",
      next_service_due_date: "2027-05-12",
      next_service_due_km: 31938,
      parts_changed: "Engine Oil 10W30, Gear Oil, Air Filter Element, CVT Belt Inspection & Brake Shoe Cleaning",
      total_amount: 1450,
      warranty_status: "Active — 30-Day Unconditional Workmanship Guarantee",
      certificate_no: "CCM-CERT-3002",
      supervised_by: "Mr. Nitish Kumar (Manager & Lead Dispatcher, +91 8333084261)"
    },
    {
      reg_number: "TS 09 FK 1300",
      vehicle_brand: "Suzuki",
      vehicle_model: "Hayabusa 1300cc (Inline-4 Superbike)",
      vehicle_class: "Multi-Cylinder Superbike (600–2500cc Petrol)",
      engine_cc: "1300cc",
      odometer_km: 14200,
      last_service_date: "2026-10-28",
      next_service_due_date: "2027-02-28",
      next_service_due_km: 17200,
      parts_changed: "Motul 300V Full Synthetic Oil, OEM K&N Filter Cleaning, OBD-II ECU Telemetry Calibration & Sintered Pads",
      total_amount: 6850,
      warranty_status: "Active — 30-Day Workmanship & Sensor Calibration Guarantee",
      certificate_no: "CCM-CERT-1300",
      supervised_by: "Mr. Nitish Kumar (Manager & Lead Dispatcher, +91 8333084261)"
    },
    {
      reg_number: "TS 07 UL 0390",
      vehicle_brand: "KTM",
      vehicle_model: "Duke 390 (Performance Petrol)",
      vehicle_class: "Sports & Cruiser (200–500cc Petrol)",
      engine_cc: "390cc",
      odometer_km: 19450,
      last_service_date: "2026-11-04",
      next_service_due_date: "2027-03-04",
      next_service_due_km: 22450,
      parts_changed: "Coolant Flush, Throttle Body Cleaning, Spark Plug & Slipper Clutch Inspection",
      total_amount: 2790,
      warranty_status: "Active — 30-Day Unconditional Workmanship Guarantee",
      certificate_no: "CCM-CERT-0390",
      supervised_by: "Mr. Nitish Kumar (Manager & Lead Dispatcher, +91 8333084261)"
    },
    {
      reg_number: "TS 08 GP 0200",
      vehicle_brand: "TVS",
      vehicle_model: "Apache RTR 200 4V (Petrol)",
      vehicle_class: "Sports & Cruiser (200–500cc Petrol)",
      cc: "200cc",
      engine_cc: "200cc",
      odometer_km: 34120,
      last_service_date: "2026-11-08",
      next_service_due_date: "2027-03-08",
      next_service_due_km: 37120,
      parts_changed: "TVS Tru4 Synthetic Oil, Oil Filter, Front Fork Oil Seal Kit & ABS Hydraulic Bleeding",
      total_amount: 2150,
      warranty_status: "Active — 30-Day Unconditional Workmanship Guarantee",
      certificate_no: "CCM-CERT-0200",
      supervised_by: "Mr. Nitish Kumar (Manager & Lead Dispatcher, +91 8333084261)"
    }
  ]
};
