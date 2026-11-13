/**
 * ============================================================================
 * CC MOTOCRAFTS AI ENGINE LABS SERVICE - MASTER FRONTEND ENGINE (Vanilla JS)
 * Official Business Email: info@ccmotocrafts.in | Helpline: +91 8333084261
 * Publishable Key: sb_publishable_4s_UdA1rJTrF5aeCh__wCg_XZCyh1_I
 * ============================================================================
 */

(function () {
  const CFG = window.CC_CONFIG;

  // Initialize Local Storage Data Stores with Seed Data (Syncs with Supabase when URL is provided)
  function getServices() {
    const saved = localStorage.getItem("ccm_services_db");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem("ccm_services_db", JSON.stringify(CFG.defaultServices));
    return CFG.defaultServices;
  }

  function saveServices(list) {
    localStorage.setItem("ccm_services_db", JSON.stringify(list));
    window.dispatchEvent(new Event("ccm_data_updated"));
  }

  function getBookings() {
    const saved = localStorage.getItem("ccm_bookings_db");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const seedBookings = [
      {
        booking_code: "CCM-849201",
        customer_name: "Arjun Varma",
        customer_mobile: "9848011223",
        customer_email: "info@ccmotocrafts.in",
        vehicle_brand: "Kawasaki",
        vehicle_model: "Z900",
        registration_no: "TS09FK9000",
        vehicle_class: "Multi-Cylinder Superbike (600–2500cc)",
        engine_cc: "900cc",
        service_category: "FI/ECU diagnostics",
        complaint_notes: "Check engine light on after highway run; throttle sync & OBD scan needed.",
        area_name: "Jubilee Hills / Film Nagar",
        pincode: "500033",
        is_vip_free_pickup: true,
        pickup_charge: 0,
        cancellation_fee: 300,
        preferred_date: "2026-11-13",
        preferred_time_window: "11:00–13:00",
        street_address: "Road No. 45, Jubilee Hills",
        landmark: "Near Peddamma Temple Metro",
        gps_coords: "17.4319, 78.4071 (https://maps.google.com/?q=17.4319,78.4071)",
        bay_number: "BAY-01 (Superbike Dyno Lab)",
        assigned_partner: "CCM-HQ-01 — Mr. Shaik Mujahid Qadri",
        booking_status: "awaiting_whatsapp_approval",
        customer_parts_approval_status: "quotation_sent_on_whatsapp",
        inspection_findings: "OBD-II Fault P0171 detected. O2 Sensor cleaning + Throttle Body Sync recommended. Genuine Kawasaki O-ring seal ₹680 + Labor ₹999.",
        estimated_cost: 1679,
        created_at: "2026-11-12T10:30:00+05:30"
      },
      {
        booking_code: "CCM-849205",
        customer_name: "Mohammed Farhan",
        customer_mobile: "9000122334",
        customer_email: "info@ccmotocrafts.in",
        vehicle_brand: "Royal Enfield",
        vehicle_model: "Himalayan 450",
        registration_no: "TS07ul4500",
        vehicle_class: "Sports (200–500cc)",
        engine_cc: "450cc",
        service_category: "Brake & suspension",
        complaint_notes: "Front fork oil leak and ABS bleeding required.",
        area_name: "Gachibowli / Financial District",
        pincode: "500032",
        is_vip_free_pickup: true,
        pickup_charge: 0,
        cancellation_fee: 300,
        preferred_date: "2026-11-13",
        preferred_time_window: "09:00–11:00",
        street_address: "My Home Avatar, Narsingi-Puppalguda Main Rd",
        landmark: "Near ORR Exit 19",
        gps_coords: "17.3950, 78.3560",
        bay_number: "BAY-02 (Suspension & Fork Lab)",
        assigned_partner: "CCM-HQ-01 — Mr. Shaik Mujahid Qadri",
        booking_status: "repair_in_progress",
        customer_parts_approval_status: "approved_by_customer",
        inspection_findings: "Customer approved genuine fork oil seal kit (₹1,150) + Motul Fork Oil 10W (₹650) on WhatsApp.",
        estimated_cost: 2350,
        created_at: "2026-11-12T12:15:00+05:30"
      }
    ];
    localStorage.setItem("ccm_bookings_db", JSON.stringify(seedBookings));
    return seedBookings;
  }

  function saveBookings(list) {
    localStorage.setItem("ccm_bookings_db", JSON.stringify(list));
    window.dispatchEvent(new Event("ccm_data_updated"));
  }

  // Supabase REST Helper (Pre-Connected to https://xrrlbqxbgxmetrwgiwvk.supabase.co + Key sb_publishable_4s_UdA1rJTrF5aeCh__wCg_XZCyh1_I)
  async function syncToSupabase(table, method, payload, query = "") {
    const sbUrl = localStorage.getItem("ccm_supabase_url") || CFG.supabaseUrl || "https://xrrlbqxbgxmetrwgiwvk.supabase.co";
    const sbKey = CFG.supabasePublishableKey;
    const cleanUrl = sbUrl.replace(/\/+$/, "");
    const headers = {
      "apikey": sbKey,
      "Authorization": `Bearer ${sbKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    };
    try {
      const res = await fetch(`${cleanUrl}/rest/v1/${table}${query}`, {
        method: method,
        headers: headers,
        body: payload ? JSON.stringify(payload) : undefined
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        return { synced: true, status: res.status, data };
      }
      // Fallback: if inserting a booking and the existing Supabase table has minimal columns or is named bike_bookings
      if (table === "bookings" && method === "POST" && payload) {
        const minimalPayload = {
          booking_code: payload.booking_code,
          customer_name: payload.customer_name,
          customer_mobile: payload.customer_mobile,
          customer_email: payload.customer_email,
          vehicle_brand: payload.vehicle_brand,
          vehicle_model: payload.vehicle_model,
          registration_no: payload.registration_no,
          vehicle_class: payload.vehicle_class,
          engine_cc: payload.engine_cc,
          service_category: payload.service_category,
          complaint_notes: payload.complaint_notes,
          area_name: payload.area_name,
          pincode: payload.pincode,
          pickup_charge: payload.pickup_charge,
          preferred_date: payload.preferred_date,
          preferred_time_window: payload.preferred_time_window,
          street_address: payload.street_address,
          landmark: payload.landmark,
          booking_status: payload.booking_status
        };
        const res2 = await fetch(`${cleanUrl}/rest/v1/bike_bookings`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(minimalPayload)
        }).catch(() => null);
        if (res2 && res2.ok) {
          return { synced: true, status: res2.status, table: "bike_bookings" };
        }
      }
      return { synced: false, status: res.status };
    } catch (err) {
      return { synced: false, error: err.message };
    }
  }

  // Format WhatsApp Booking Message
  function buildWhatsAppMessage(b) {
    const vipText = b.is_vip_free_pickup
      ? "✅ FREE VIP FLATBED PICKUP & DROP (₹0)"
      : "🚚 Standard Hyderabad Pickup & Drop (₹500)";
    return [
      `*CC MOTOCRAFTS AI ENGINE LABS SERVICE — CONFIRMED BOOKING PASS*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `🆔 *Booking ID:* ${b.booking_code}`,
      `👤 *Customer:* ${b.customer_name}`,
      `📞 *Mobile:* ${b.customer_mobile}`,
      `📧 *Email:* ${b.customer_email || CFG.officialEmail}`,
      `🏍️ *Vehicle:* ${b.vehicle_brand} ${b.vehicle_model} (${b.engine_cc})`,
      `🏷️ *Class:* ${b.vehicle_class}`,
      `🔢 *Reg No:* ${b.registration_no}`,
      `🛠️ *Service:* ${b.service_category}`,
      `📝 *Complaint:* ${b.complaint_notes || "Complete Diagnostic Inspection"}`,
      `📍 *Area & PIN:* ${b.area_name} — ${b.pincode}`,
      `🚚 *Pickup Tier:* ${vipText}`,
      `📅 *Preferred Slot:* ${b.preferred_date} | ${b.preferred_time_window}`,
      `🏠 *Address:* ${b.street_address} (Landmark: ${b.landmark})`,
      b.gps_coords ? `🛰️ *Live GPS:* ${b.gps_coords}` : "",
      `━━━━━━━━━━━━━━━━━━━━`,
      `🛡️ *100% Genuine Parts & Zero Unapproved Parts Pledge:* Without your WhatsApp approval, not even 1 Paisa of extra part is replaced.`,
      `📩 *Official Email:* ${CFG.officialEmail}`,
      `📲 *Helpline:* ${CFG.officialPhone}`
    ].filter(Boolean).join("\n");
  }

  // Expose Global API for Admin, Partner, and Customer Pages
  window.CCM_API = {
    getServices,
    saveServices,
    getBookings,
    saveBookings,
    syncToSupabase,
    buildWhatsAppMessage,
    checkPinEligibility(pin) {
      const cleanPin = String(pin || "").trim();
      const isVip = CFG.vipPincodes.includes(cleanPin);
      return {
        pincode: cleanPin,
        isVip,
        pickupFee: isVip ? 0 : 500,
        cancellationFee: isVip ? 300 : 500,
        label: isVip
          ? "🎉 FREE VIP Flatbed Van Pickup & Drop (₹0) — Priority 35–45 Min Dispatch!"
          : "🚚 Standard Greater Hyderabad Pickup & Drop: ₹500 (All 100cc–2500cc Two-Wheelers)"
      };
    }
  };

  // ============================================================================
  // DOM INITIALIZATION FOR CUSTOMER PLATFORM (index.html) + GLOBAL FLOATING DOCK
  // ============================================================================
  document.addEventListener("DOMContentLoaded", () => {
    initCustomerPlatform();
    initGlobalFloatingAssistant();
  });

  function initCustomerPlatform() {
    // 1. Render Vehicle Classes
    const vGrid = document.getElementById("vehicle-classes-grid");
    if (vGrid) {
      vGrid.innerHTML = CFG.vehicleClasses.map((vc, idx) => `
        <div class="vehicle-class-card ${idx === 0 ? "selected" : ""}" data-vclass="${vc.id}">
          <div class="vehicle-icon">${vc.icon}</div>
          <span class="cluster-tag">${vc.ccRange}</span>
          <h3 style="margin:6px 0 8px;color:#fff;">${vc.title}</h3>
          <p style="font-size:0.84rem;color:var(--text-muted);margin-bottom:14px;">${vc.examples}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border-subtle);padding-top:12px;">
            <span style="font-size:0.8rem;color:var(--amber-bright);font-weight:700;">Diagnostic Base: ${vc.baseInspect}</span>
            <button type="button" class="btn btn-outline" style="padding:6px 12px;font-size:0.78rem;" onclick="selectVehicleClass('${vc.id}')">Select Class →</button>
          </div>
        </div>
      `).join("");
    }

    // 2. Render Dynamic Services & Pricing
    renderDynamicServicesGrid();
    window.addEventListener("ccm_data_updated", renderDynamicServicesGrid);

    // 3. Populate Booking Form Dropdowns
    const areaSelect = document.getElementById("bf-area");
    if (areaSelect) {
      areaSelect.innerHTML = CFG.hyderabadAreas.map(a =>
        `<option value="${a.pincode}" data-areaname="${a.area}">${a.label}</option>`
      ).join("");
      areaSelect.addEventListener("change", updateBookingPickupPreview);
    }

    const pinInput = document.getElementById("bf-pincode");
    if (pinInput) {
      pinInput.addEventListener("input", () => {
        updatePinBanner(pinInput.value);
      });
    }

    const dateInput = document.getElementById("bf-date");
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split("T")[0];
    }

    updateBookingPickupPreview();

    // 4. Live GPS Current Location Capture
    const gpsBtn = document.getElementById("btn-capture-gps");
    if (gpsBtn) {
      gpsBtn.addEventListener("click", () => {
        const statusEl = document.getElementById("gps-status-text");
        const gpsInput = document.getElementById("bf-gps");
        if (!navigator.geolocation) {
          statusEl.textContent = "Browser GPS not supported. Your selected Area & PIN will be used.";
          return;
        }
        statusEl.textContent = "🛰️ Acquiring High-Accuracy Satellite GPS Coordinates...";
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude.toFixed(5);
            const lng = pos.coords.longitude.toFixed(5);
            const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
            gpsInput.value = `${lat}, ${lng} (${mapsUrl})`;
            statusEl.innerHTML = `✅ Live GPS Locked: <strong style="color:#34d399;">${lat}, ${lng}</strong> — Ready for Flatbed Dispatch!`;
          },
          () => {
            statusEl.textContent = "ℹ️ Location permission skipped. Using your selected Area, PIN & Landmark.";
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      });
    }

    // 5. Load / Save Customer Profile on Device
    const btnLoadProfile = document.getElementById("btn-load-profile");
    if (btnLoadProfile) {
      btnLoadProfile.addEventListener("click", () => {
        const saved = localStorage.getItem("ccm_customer_profile");
        if (!saved) {
          alert("No saved profile found on this device yet. Submit a booking once to auto-save!");
          return;
        }
        const p = JSON.parse(saved);
        if (p.name) document.getElementById("bf-name").value = p.name;
        if (p.mobile) document.getElementById("bf-mobile").value = p.mobile;
        if (p.email) document.getElementById("bf-email").value = p.email;
        if (p.brand) document.getElementById("bf-brand").value = p.brand;
        if (p.model) document.getElementById("bf-model").value = p.model;
        if (p.reg) document.getElementById("bf-reg").value = p.reg;
        if (p.pincode) {
          document.getElementById("bf-pincode").value = p.pincode;
          updatePinBanner(p.pincode);
        }
        if (p.address) document.getElementById("bf-address").value = p.address;
        if (p.landmark) document.getElementById("bf-landmark").value = p.landmark;
      });
    }

    // 6. Booking Form Submission (Supabase + Cloudflare Worker + Popup Pass + WhatsApp)
    const bookingForm = document.getElementById("main-booking-form");
    if (bookingForm) {
      bookingForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await handleBookingSubmit(false);
      });
    }

    const btnDirectWa = document.getElementById("btn-booking-whatsapp");
    if (btnDirectWa) {
      btnDirectWa.addEventListener("click", async () => {
        await handleBookingSubmit(true);
      });
    }

    // 7. Render 18 Portfolio Cards + Filters
    renderPortfolioGallery("ALL");

    // 8. Live Job Card & Approval Tracker Search
    const btnTrack = document.getElementById("btn-track-search");
    if (btnTrack) {
      btnTrack.addEventListener("click", () => {
        const q = (document.getElementById("tracker-input").value || "").trim().toUpperCase();
        renderCustomerLiveTracker(q);
      });
      renderCustomerLiveTracker("CCM-849201");
    }

    // 9. Instant PIN Code Checker Bar
    const btnCheckPin = document.getElementById("btn-quick-pin-check");
    if (btnCheckPin) {
      btnCheckPin.addEventListener("click", () => {
        const val = document.getElementById("quick-pin-input").value;
        const info = window.CCM_API.checkPinEligibility(val);
        const out = document.getElementById("quick-pin-result");
        out.innerHTML = `<span style="color:${info.isVip ? "#34d399" : "#fbbf24"};font-weight:700;">${info.label} (Cancellation Fee: ₹${info.cancellationFee})</span>`;
      });
    }
  }

  function renderDynamicServicesGrid() {
    const sGrid = document.getElementById("dynamic-services-grid");
    const sSelect = document.getElementById("bf-service");
    const services = getServices();

    if (sGrid) {
      sGrid.innerHTML = services.map(s => `
        <div class="service-card">
          <div>
            <span class="cluster-tag">${s.category}</span>
            <h3 style="font-size:1.08rem;color:#fff;margin-bottom:6px;">${s.name}</h3>
            <p style="font-size:0.84rem;color:var(--text-muted);">${s.desc || ""}</p>
            <div class="service-price-matrix">
              <div><span>🛵 Scooter / Gearless</span><strong>₹${s.scooter_price}</strong></div>
              <div><span>🏍️ Commuter (100-160cc)</span><strong>₹${s.commuter_price}</strong></div>
              <div><span>⚡ Sports (200-500cc)</span><strong>₹${s.sports_price}</strong></div>
              <div><span>🏁 Superbike (600-2500cc)</span><strong>₹${s.superbike_price}</strong></div>
            </div>
            <p style="font-size:0.76rem;color:#34d399;margin-bottom:14px;">🛡️ ${s.warranty}</p>
          </div>
          <div style="display:flex;gap:8px;">
            <button type="button" class="btn btn-amber" style="flex:1;padding:8px 12px;font-size:0.82rem;" onclick="prefillServiceBooking('${s.category}')">Book Service →</button>
            <a href="https://wa.me/${CFG.officialWhatsApp}?text=${encodeURIComponent("Hi CC Motocrafts AI Engine Labs, I want to book: " + s.name + " (" + s.category + "). Please share slot availability.")}" target="_blank" class="btn btn-whatsapp" style="padding:8px 12px;font-size:0.82rem;">💬 WhatsApp</a>
          </div>
        </div>
      `).join("");
    }

    if (sSelect) {
      sSelect.innerHTML = services.map(s =>
        `<option value="${s.category}">${s.category} — ${s.name} (From ₹${s.scooter_price})</option>`
      ).join("");
    }
  }

  window.selectVehicleClass = function (vClass) {
    document.querySelectorAll(".vehicle-class-card").forEach(el => {
      el.classList.toggle("selected", el.getAttribute("data-vclass") === vClass);
    });
    const sel = document.getElementById("bf-vclass");
    if (sel) sel.value = vClass;
    const formSec = document.getElementById("booking-section");
    if (formSec) formSec.scrollIntoView({ behavior: "smooth" });
  };

  window.prefillServiceBooking = function (categoryName, vClass) {
    const sSelect = document.getElementById("bf-service");
    if (sSelect) sSelect.value = categoryName;
    if (vClass) {
      const vSelect = document.getElementById("bf-vclass");
      if (vSelect) vSelect.value = vClass;
    }
    const formSec = document.getElementById("booking-section");
    if (formSec) formSec.scrollIntoView({ behavior: "smooth" });
  };

  window.selectVipPin = function (pin, areaLabel) {
    const pinInput = document.getElementById("bf-pincode");
    const areaSelect = document.getElementById("bf-area");
    if (areaSelect) {
      for (let i = 0; i < areaSelect.options.length; i++) {
        if (areaSelect.options[i].value === pin) {
          areaSelect.selectedIndex = i;
          break;
        }
      }
    }
    if (pinInput) pinInput.value = pin;
    updatePinBanner(pin);
    const formSec = document.getElementById("booking-section");
    if (formSec) formSec.scrollIntoView({ behavior: "smooth" });
  };

  function updateBookingPickupPreview() {
    const areaSelect = document.getElementById("bf-area");
    const pinInput = document.getElementById("bf-pincode");
    if (!areaSelect || !pinInput) return;
    const selectedPin = areaSelect.value;
    pinInput.value = selectedPin;
    updatePinBanner(selectedPin);
  }

  function updatePinBanner(pin) {
    const info = window.CCM_API.checkPinEligibility(pin);
    const banner = document.getElementById("pickup-eligibility-banner");
    const summaryFee = document.getElementById("summary-pickup-fee");
    const summaryCancel = document.getElementById("summary-cancel-fee");
    if (banner) {
      banner.style.borderColor = info.isVip ? "#10b981" : "#f59e0b";
      banner.style.background = info.isVip ? "rgba(16, 185, 129, 0.14)" : "rgba(245, 158, 11, 0.14)";
      banner.innerHTML = `
        <div style="font-weight:800;color:${info.isVip ? "#34d399" : "#fbbf24"};font-size:0.95rem;">
          ${info.label}
        </div>
        <div style="font-size:0.8rem;color:#e2e8f0;margin-top:4px;">
          PIN Code: <strong>${info.pincode || "N/A"}</strong> • Pickup & Drop: <strong>₹${info.pickupFee}</strong> • Disclosed Cancellation Fee: <strong>₹${info.cancellationFee}</strong>
        </div>
      `;
    }
    if (summaryFee) summaryFee.textContent = info.isVip ? "₹0 (FREE VIP Zone)" : "₹500 (Standard Hyderabad)";
    if (summaryCancel) summaryCancel.textContent = `₹${info.cancellationFee}`;
  }

  async function handleBookingSubmit(openWhatsAppImmediately) {
    const name = document.getElementById("bf-name").value.trim();
    const mobile = document.getElementById("bf-mobile").value.trim();
    const email = document.getElementById("bf-email").value.trim() || CFG.officialEmail;
    const brand = document.getElementById("bf-brand").value;
    const model = document.getElementById("bf-model").value.trim();
    const reg = document.getElementById("bf-reg").value.trim().toUpperCase();
    const vclass = document.getElementById("bf-vclass").value;
    const cc = document.getElementById("bf-cc").value;
    const service = document.getElementById("bf-service").value;
    const complaint = document.getElementById("bf-complaint").value.trim();
    const areaSelect = document.getElementById("bf-area");
    const areaName = areaSelect.options[areaSelect.selectedIndex]?.getAttribute("data-areaname") || "Hyderabad";
    const pincode = document.getElementById("bf-pincode").value.trim();
    const prefDate = document.getElementById("bf-date").value;
    const prefTime = document.getElementById("bf-time").value;
    const address = document.getElementById("bf-address").value.trim();
    const landmark = document.getElementById("bf-landmark").value.trim();
    const gps = document.getElementById("bf-gps").value.trim();

    if (!name || !mobile || !model || !reg || !pincode || !address || !landmark) {
      alert("Please fill in your Name, 10-Digit Mobile, Bike Model, Registration Number, PIN Code, Address, and Landmark.");
      return;
    }

    const pinInfo = window.CCM_API.checkPinEligibility(pincode);
    const bookingCode = "CCM-" + Math.floor(100000 + Math.random() * 900000);

    const newBooking = {
      booking_code: bookingCode,
      customer_name: name,
      customer_mobile: mobile,
      customer_email: email,
      vehicle_brand: brand,
      vehicle_model: model,
      registration_no: reg,
      vehicle_class: vclass,
      engine_cc: cc,
      service_category: service,
      complaint_notes: complaint,
      area_name: areaName,
      pincode: pincode,
      is_vip_free_pickup: pinInfo.isVip,
      pickup_charge: pinInfo.pickupFee,
      cancellation_fee: pinInfo.cancellationFee,
      preferred_date: prefDate,
      preferred_time_window: prefTime,
      street_address: address,
      landmark: landmark,
      gps_coords: gps,
      bay_number: "BAY-01 (Assigned on Arrival)",
      assigned_partner: "CCM-HQ-01 — Mr. Shaik Mujahid Qadri",
      booking_status: "received",
      customer_parts_approval_status: "pending_inspection",
      inspection_findings: "Awaiting flatbed pickup & 40-point digital diagnostic inspection.",
      estimated_cost: pinInfo.pickupFee,
      created_at: new Date().toISOString()
    };

    // Save to Local Profile for 1-click repeat booking
    localStorage.setItem("ccm_customer_profile", JSON.stringify({
      name, mobile, email, brand, model, reg, pincode, address, landmark
    }));

    // Save to Local DB & Sync to Supabase
    const list = getBookings();
    list.unshift(newBooking);
    saveBookings(list);
    await syncToSupabase("bookings", "POST", newBooking);

    // Build WhatsApp URL
    const waText = buildWhatsAppMessage(newBooking);
    const waUrl = `https://wa.me/${CFG.officialWhatsApp}?text=${encodeURIComponent(waText)}`;

    // Populate & Open Booking Pass Popup Modal
    const modal = document.getElementById("booking-pass-modal");
    const passContent = document.getElementById("booking-pass-details");
    const btnPassWa = document.getElementById("btn-pass-whatsapp");
    const btnPassEmail = document.getElementById("btn-pass-email");

    if (passContent) {
      passContent.innerHTML = `
        <div style="background:rgba(16,185,129,0.12);border:1px solid #10b981;padding:12px;border-radius:8px;margin-bottom:14px;">
          <div style="font-size:0.78rem;color:#34d399;font-weight:800;">DIGITAL BOOKING PASS CONFIRMED</div>
          <div style="font-size:1.35rem;font-weight:900;color:#fff;">Booking ID: ${bookingCode}</div>
          <div style="font-size:0.82rem;color:#e2e8f0;">Notification routed to: <strong>${CFG.officialEmail}</strong> | Helpline: <strong>${CFG.officialPhone}</strong></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:0.85rem;margin-bottom:14px;">
          <div><span style="color:var(--text-muted);">Customer:</span><br><strong>${name} (${mobile})</strong></div>
          <div><span style="color:var(--text-muted);">Vehicle:</span><br><strong>${brand} ${model} (${cc})</strong></div>
          <div><span style="color:var(--text-muted);">Reg No & Class:</span><br><strong>${reg} • ${vclass}</strong></div>
          <div><span style="color:var(--text-muted);">Service Category:</span><br><strong>${service}</strong></div>
          <div><span style="color:var(--text-muted);">Area & PIN:</span><br><strong>${areaName} (${pincode})</strong></div>
          <div><span style="color:var(--text-muted);">Pickup & Drop Charge:</span><br><strong style="color:#34d399;">${pinInfo.isVip ? "FREE VIP PICKUP (₹0)" : "Standard ₹500"}</strong></div>
          <div style="grid-column:1/-1;"><span style="color:var(--text-muted);">Pickup Slot & Address:</span><br><strong>${prefDate} (${prefTime}) — ${address}, Landmark: ${landmark}</strong></div>
        </div>
        <div style="background:rgba(245,158,11,0.12);border:1px solid var(--border-amber);padding:10px 12px;border-radius:8px;font-size:0.8rem;color:#fde68a;">
          🛡️ <strong>Zero Unapproved Parts Guarantee:</strong> Our technician will inspect your two-wheeler and send photos/video + quotation on WhatsApp. If you reply <strong>"Confirm Change"</strong>, we replace with 100% Genuine OEM parts. If you say <strong>"Nako / No"</strong>, we do not add even 1 Paisa of extra parts!
        </div>
      `;
    }

    if (btnPassWa) btnPassWa.href = waUrl;
    if (btnPassEmail) {
      btnPassEmail.href = `mailto:${CFG.officialEmail}?subject=${encodeURIComponent("Confirmed Booking Pass " + bookingCode + " - " + brand + " " + model)}&body=${encodeURIComponent(waText)}`;
    }

    if (modal) modal.classList.add("open");

    // Also update live tracker with this new booking immediately
    renderCustomerLiveTracker(bookingCode);

    if (openWhatsAppImmediately) {
      window.open(waUrl, "_blank");
    }
  }

  window.closeBookingModal = function () {
    const modal = document.getElementById("booking-pass-modal");
    if (modal) modal.classList.remove("open");
  };

  // Portfolio Filter & Render (All 18 Workshop Photos)
  window.filterPortfolio = function (filterKey, btnEl) {
    document.querySelectorAll(".portfolio-filters .filter-btn").forEach(b => b.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");
    renderPortfolioGallery(filterKey);
  };

  function renderPortfolioGallery(filterKey) {
    const grid = document.getElementById("portfolio-showcase-grid");
    if (!grid) return;
    const items = CFG.portfolioItems.filter(item => {
      if (filterKey === "ALL") return true;
      return item.vehicleClass.includes(filterKey) || item.category.includes(filterKey);
    });

    grid.innerHTML = items.map(item => `
      <div class="portfolio-card">
        <div class="portfolio-img-wrap">
          <img src="${item.img}" alt="${item.title} - CC Motocrafts AI Engine Labs Hyderabad" loading="lazy">
          <span class="portfolio-badge">${item.badge}</span>
        </div>
        <div class="portfolio-body">
          <div>
            <div style="font-size:0.74rem;color:var(--cyan);font-weight:700;text-transform:uppercase;margin-bottom:4px;">${item.vehicleClass} • ${item.category}</div>
            <h4>${item.title}</h4>
            <p>${item.desc}</p>
          </div>
          <div style="display:flex;gap:8px;">
            <button type="button" class="btn btn-amber" style="flex:1;padding:8px 10px;font-size:0.8rem;" onclick="prefillServiceBooking('${item.category}', '${item.vehicleClass}')">Book This Service →</button>
            <a href="https://wa.me/${CFG.officialWhatsApp}?text=${encodeURIComponent("Hi CC Motocrafts, I saw your portfolio for: " + item.title + ". I want to book this service.")}" target="_blank" class="btn btn-whatsapp" style="padding:8px 10px;font-size:0.8rem;">💬</a>
          </div>
        </div>
      </div>
    `).join("");
  }

  // Live Customer Job Card & WhatsApp Approval Tracker
  function renderCustomerLiveTracker(query) {
    const box = document.getElementById("live-tracker-result");
    if (!box) return;
    const list = getBookings();
    const match = list.find(b =>
      b.booking_code.toUpperCase() === query ||
      b.customer_mobile.includes(query) ||
      b.registration_no.toUpperCase() === query
    ) || list[0];

    if (!match) {
      box.innerHTML = `<p style="color:var(--text-muted);">No booking found for "${query}". Try Booking ID <strong>CCM-849201</strong>.</p>`;
      return;
    }

    const stages = [
      { key: "received", label: "01. Booking Received" },
      { key: "pickup_dispatched", label: "02. Flatbed Pickup" },
      { key: "in_inspection", label: "03. OBD/Lab Inspection" },
      { key: "awaiting_whatsapp_approval", label: "04. WhatsApp Quote Approval" },
      { key: "repair_in_progress", label: "05. Genuine Parts & Repair" },
      { key: "ready_for_delivery", label: "06. QC & Ready for Drop" }
    ];
    const currentIdx = Math.max(0, stages.findIndex(s => s.key === match.booking_status));

    const approveWaMsg = `Hi CC Motocrafts AI Engine Labs, for my Booking ID *${match.booking_code}* (${match.vehicle_brand} ${match.vehicle_model} - ${match.registration_no}), I *CONFIRM & APPROVE* the genuine parts replacement quotation.`;
    const rejectWaMsg = `Hi CC Motocrafts AI Engine Labs, for my Booking ID *${match.booking_code}* (${match.vehicle_brand} ${match.vehicle_model}), *NAKO / DO NOT CHANGE* the extra parts. Please proceed only with standard approved service.`;

    box.innerHTML = `
      <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border-cyan);border-radius:12px;padding:22px;">
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px;">
          <div>
            <span class="cluster-tag">LIVE WORKSHOP BAY TRACKER • ${match.bay_number || "BAY-01"}</span>
            <h3 style="color:#fff;font-size:1.3rem;">${match.booking_code} — ${match.vehicle_brand} ${match.vehicle_model} (${match.registration_no})</h3>
            <p style="font-size:0.85rem;color:var(--text-muted);">Customer: <strong>${match.customer_name}</strong> • Area: <strong>${match.area_name} (${match.pincode})</strong> • Assigned: <strong>${match.assigned_partner || "Mr. Shaik Mujahid Qadri"}</strong></p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.78rem;color:var(--text-muted);">Pickup Tier</div>
            <div style="font-weight:800;color:#34d399;">${match.is_vip_free_pickup ? "FREE VIP PICKUP (₹0)" : "Standard ₹500"}</div>
          </div>
        </div>

        <div class="tracker-steps">
          ${stages.map((st, i) => `
            <div class="tracker-step ${i < currentIdx ? "done" : i === currentIdx ? "current" : ""}">
              <div style="font-size:0.75rem;font-weight:800;color:${i <= currentIdx ? "#fff" : "var(--text-dim)"};">${st.label}</div>
              <div style="font-size:0.7rem;color:${i < currentIdx ? "#34d399" : i === currentIdx ? "#fbbf24" : "var(--text-dim)"};margin-top:4px;">
                ${i < currentIdx ? "✓ Completed" : i === currentIdx ? "● Active Stage" : "Pending"}
              </div>
            </div>
          `).join("")}
        </div>

        <div style="background:rgba(15,21,32,0.9);border:1px solid var(--border-amber);border-radius:10px;padding:16px;margin-top:16px;">
          <h4 style="color:var(--amber-bright);margin-bottom:6px;">📋 Technician Diagnostic Report & Genuine Parts Quotation:</h4>
          <p style="font-size:0.9rem;color:#e2e8f0;margin-bottom:10px;">${match.inspection_findings || "Inspection in progress."}</p>
          <div style="font-size:0.84rem;color:#34d399;margin-bottom:14px;">
            Customer Parts Approval Status: <strong>${(match.customer_parts_approval_status || "").toUpperCase().replace(/_/g, " ")}</strong> • Estimated Total: <strong>₹${match.estimated_cost || 0}</strong>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:10px;">
            <a href="https://wa.me/${CFG.officialWhatsApp}?text=${encodeURIComponent(approveWaMsg)}" target="_blank" class="btn btn-whatsapp" onclick="updatePartsDecision('${match.booking_code}', 'approved_by_customer')">
              ✅ Confirm Change on WhatsApp (Approve Genuine Parts)
            </a>
            <a href="https://wa.me/${CFG.officialWhatsApp}?text=${encodeURIComponent(rejectWaMsg)}" target="_blank" class="btn btn-crimson" onclick="updatePartsDecision('${match.booking_code}', 'declined_no_extra_parts')">
              ✋ Nako / Do Not Change Parts (0 Paisa Extra)
            </a>
          </div>
        </div>
      </div>
    `;
  }

  window.updatePartsDecision = function (bookingCode, decision) {
    const list = getBookings();
    const item = list.find(b => b.booking_code === bookingCode);
    if (item) {
      item.customer_parts_approval_status = decision;
      if (decision === "approved_by_customer") {
        item.booking_status = "repair_in_progress";
      }
      saveBookings(list);
      renderCustomerLiveTracker(bookingCode);
    }
  };

  // ============================================================================
  // ALL-PAGE FLOATING AI ENGINE ASSISTANT + QUICK WHATSAPP BOOKING WIDGET
  // ============================================================================
  function initGlobalFloatingAssistant() {
    const dock = document.getElementById("global-floating-dock");
    if (!dock) return;

    dock.innerHTML = `
      <div class="ai-chat-window" id="ai-assistant-window">
        <div class="ai-chat-header">
          <div>
            <strong style="color:#fff;font-size:0.92rem;">🤖 CC Motocrafts AI Engine Assistant</strong>
            <div style="font-size:0.72rem;color:#a5f3fc;">100cc–2500cc Diagnostics & Instant WhatsApp Booking</div>
          </div>
          <button type="button" onclick="toggleAiAssistant()" style="background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer;">✕</button>
        </div>
        <div class="ai-chat-body" id="ai-chat-messages">
          <div class="chat-msg bot">
            👋 Welcome to <strong>CC Motocrafts AI Engine Labs</strong>! Tell me your bike problem or fill your quick booking details below to confirm & share directly on WhatsApp (<strong>${CFG.officialPhone}</strong>):
          </div>
          <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border-subtle);padding:12px;border-radius:8px;display:flex;flex-direction:column;gap:8px;">
            <input type="text" id="qa-name" class="form-control" placeholder="Your Name *" style="padding:8px 10px;font-size:0.82rem;">
            <input type="tel" id="qa-mobile" class="form-control" placeholder="10-Digit Mobile Number *" style="padding:8px 10px;font-size:0.82rem;">
            <input type="text" id="qa-bike" class="form-control" placeholder="Bike/Scooter Model & Reg No (e.g. Activa / Z900) *" style="padding:8px 10px;font-size:0.82rem;">
            <select id="qa-pin" class="form-control" style="padding:8px 10px;font-size:0.82rem;">
              <option value="500033">500033 — Jubilee Hills / Film Nagar (FREE VIP Pickup)</option>
              <option value="500034">500034 — Banjara Hills (FREE VIP Pickup)</option>
              <option value="500096">500096 — Film Nagar / Nanakramguda (FREE VIP Pickup)</option>
              <option value="500032">500032 — Gachibowli / Financial District (FREE VIP Pickup)</option>
              <option value="500075">500075 — Kokapet / Narsingi (FREE VIP Pickup)</option>
              <option value="500089">500089 — Manikonda / Puppalguda / Lanco Hills (FREE VIP)</option>
              <option value="500081">500081 — HITEC City / Madhapur (FREE VIP Pickup)</option>
              <option value="500084">500084 — Kondapur (FREE VIP Pickup)</option>
              <option value="500008">Other Hyderabad Area / PIN (₹500 Pickup & Drop)</option>
            </select>
            <input type="text" id="qa-issue" class="form-control" placeholder="Symptom / Service Needed (e.g. General Service / ECU)" style="padding:8px 10px;font-size:0.82rem;">
            <button type="button" class="btn btn-whatsapp" style="width:100%;padding:9px;font-size:0.84rem;" onclick="submitQuickChatBooking()">
              📲 Confirm Booking & Share on WhatsApp
            </button>
          </div>
        </div>
      </div>
      <div class="floating-buttons-row">
        <button type="button" class="btn btn-amber" onclick="toggleAiAssistant()" style="border-radius:999px;box-shadow:0 8px 25px rgba(0,0,0,0.7);">
          🤖 AI Engineer / Quick Book
        </button>
        <a href="https://wa.me/${CFG.officialWhatsApp}?text=${encodeURIComponent("Hello CC Motocrafts AI Engine Labs! I need two-wheeler service / diagnostic support in Hyderabad.")}" target="_blank" class="btn btn-whatsapp" style="border-radius:999px;box-shadow:0 8px 25px rgba(0,0,0,0.7);">
          💬 WhatsApp +91 8333084261
        </a>
      </div>
    `;
  }

  window.toggleAiAssistant = function () {
    const w = document.getElementById("ai-assistant-window");
    if (w) w.classList.toggle("open");
  };

  window.submitQuickChatBooking = async function () {
    const name = document.getElementById("qa-name").value.trim();
    const mobile = document.getElementById("qa-mobile").value.trim();
    const bike = document.getElementById("qa-bike").value.trim();
    const pin = document.getElementById("qa-pin").value;
    const issue = document.getElementById("qa-issue").value.trim() || "AI Diagnostic & Service Check";

    if (!name || !mobile || !bike) {
      alert("Please enter your Name, Mobile Number, and Bike Model.");
      return;
    }

    const pinInfo = window.CCM_API.checkPinEligibility(pin);
    const code = "CCM-" + Math.floor(100000 + Math.random() * 900000);
    const quickRecord = {
      booking_code: code,
      customer_name: name,
      customer_mobile: mobile,
      customer_email: CFG.officialEmail,
      vehicle_brand: bike.split(" ")[0] || "Two-Wheeler",
      vehicle_model: bike,
      registration_no: "CONFIRMED-ON-WA",
      vehicle_class: "Commuter (100–160cc)",
      engine_cc: "Multi-CC",
      service_category: issue,
      complaint_notes: issue,
      area_name: pinInfo.isVip ? "VIP Free Pickup Zone" : "Greater Hyderabad",
      pincode: pin,
      is_vip_free_pickup: pinInfo.isVip,
      pickup_charge: pinInfo.pickupFee,
      cancellation_fee: pinInfo.cancellationFee,
      preferred_date: new Date().toISOString().split("T")[0],
      preferred_time_window: "11:00–13:00",
      street_address: "Shared via WhatsApp Quick Chat",
      landmark: "Hyderabad",
      booking_status: "received",
      customer_parts_approval_status: "pending_inspection",
      source_channel: "ai_chat_portal",
      created_at: new Date().toISOString()
    };

    const list = getBookings();
    list.unshift(quickRecord);
    saveBookings(list);
    await syncToSupabase("bookings", "POST", quickRecord);

    const waText = buildWhatsAppMessage(quickRecord);
    window.open(`https://wa.me/${CFG.officialWhatsApp}?text=${encodeURIComponent(waText)}`, "_blank");
  };
})();

window.toggleMobileNav = function () {
  const nav = document.getElementById("main-nav-links");
  if (nav) nav.classList.toggle("open");
};
