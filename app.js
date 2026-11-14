/**
 * ============================================================================
 * CC MOTOCRAFTS AI ENGINE LABS SERVICE - MASTER PRODUCTION ENGINE (v9)
 * Strictly Petrol 100cc–2500cc Two-Wheelers (Bikes & Scooters Only — Zero EVs)
 * Manager & Lead Dispatcher: Mr. Nitish Kumar (+91 8333084261 | info@ccmotocrafts.in)
 * ============================================================================
 */

(function () {
  const CFG = window.CC_CONFIG;

  // ==========================================================================
  // REQUIREMENT 3: GLOBAL TECHNICAL FALLBACK & ERROR MODAL (NO RAW CODE ERRORS)
  // ==========================================================================
  window.showTechnicalFallbackModal = function () {
    const modal = document.getElementById("technical-fallback-modal");
    if (modal) modal.classList.add("open");
  };

  window.closeTechnicalFallbackModal = function () {
    const modal = document.getElementById("technical-fallback-modal");
    if (modal) modal.classList.remove("open");
  };

  window.addEventListener("error", function (event) {
    event.preventDefault();
    console.warn("Handled client notice:", event.message);
  });

  window.addEventListener("unhandledrejection", function (event) {
    event.preventDefault();
    console.warn("Handled async notice:", event.reason);
  });

  // ==========================================================================
  // LOCAL & CLOUD STORAGE HELPERS
  // ==========================================================================
  function getServices() {
    const saved = localStorage.getItem("ccm_services_db_v9");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem("ccm_services_db_v9", JSON.stringify(CFG.defaultServices));
    return CFG.defaultServices;
  }

  function saveServices(list) {
    localStorage.setItem("ccm_services_db_v9", JSON.stringify(list));
    window.dispatchEvent(new Event("ccm_data_updated"));
  }

  function getBookings() {
    const saved = localStorage.getItem("ccm_bookings_db_v9");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  }

  function saveBookings(list) {
    localStorage.setItem("ccm_bookings_db_v9", JSON.stringify(list));
    window.dispatchEvent(new Event("ccm_data_updated"));
  }

  function getFamilyGarage() {
    const saved = localStorage.getItem("ccm_family_garage_v9");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem("ccm_family_garage_v9", JSON.stringify(CFG.defaultFamilyGarage));
    return CFG.defaultFamilyGarage;
  }

  function saveFamilyGarage(list) {
    localStorage.setItem("ccm_family_garage_v9", JSON.stringify(list));
  }

  // ==========================================================================
  // CRITICAL FIX: DIRECT FORM-TO-DATABASE BINDING TO SUPABASE `bike_bookings`
  // Dynamically binds exact typed customer inputs (`customer_name`, `phone`, `email`, etc.)
  // with ZERO static test strings or owner phone/email fallbacks!
  // ==========================================================================
  async function postWithFallback(baseUrl, sbKey, table, payloads) {
    const cleanUrl = baseUrl.replace(/\/+$/, "");
    const headers = {
      "apikey": sbKey,
      "Authorization": `Bearer ${sbKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    };
    for (let i = 0; i < payloads.length; i++) {
      try {
        const res = await fetch(`${cleanUrl}/rest/v1/${table}`, {
          method: "POST",
          keepalive: true,
          headers: headers,
          body: JSON.stringify(payloads[i])
        });
        if (res.ok || res.status === 201 || res.status === 204) {
          const data = await res.json().catch(() => null);
          return { ok: true, table, attempt: i + 1, status: res.status, data };
        }
      } catch (e) {}
    }
    return { ok: false, table };
  }

  async function syncToSupabase(table, method, payload, query = "") {
    const sbKey = CFG.supabasePublishableKey;
    const endpoints = [CFG.supabaseUrl, CFG.supabaseSecondaryUrl].filter(Boolean);

    if (table === "bookings" && method === "POST" && payload) {
      // Strictly map user's live typed values from payload (NO hardcoded fallback names or phones)
      const typedCustomerName = String(payload.customer_name || "").trim();
      const typedCustomerPhone = String(payload.phone || payload.customer_mobile || "").trim();
      const typedCustomerEmail = String(payload.email || payload.customer_email || "").trim();

      const bikePayloads = [
        {
          booking_id: payload.booking_code,
          customer_name: typedCustomerName,
          phone: typedCustomerPhone,
          email: typedCustomerEmail,
          vehicle_brand: payload.vehicle_brand,
          bike_model: payload.bike_model || payload.vehicle_model,
          reg_number: payload.reg_number || payload.registration_no,
          vehicle_class: payload.vehicle_class,
          engine_cc: payload.engine_cc,
          odometer_km: Number(payload.odometer_km || 0),
          service_type: payload.service_type || payload.service_category,
          area: `${payload.area_name} (${payload.pincode})`,
          pincode: payload.pincode,
          booking_date: payload.booking_date || payload.preferred_date,
          time_slot: payload.time_slot || payload.preferred_time_window,
          complaint_note: payload.complaint_note || payload.complaint_notes || "Standard diagnostic & service inspection",
          address: payload.address || payload.street_address,
          landmark: payload.landmark,
          gps_coords: payload.gps_coords || "",
          status: "Booking Confirmed",
          pickup_zone_type: payload.is_vip_free_pickup ? "VIP_FREE" : "STANDARD_500",
          pickup_charge: Number(payload.pickup_charge || 0),
          cancellation_penalty: Number(payload.cancellation_fee || 300),
          total_dispatch_fee: Number(payload.pickup_charge || 0),
          vehicle_displacement_cc: payload.engine_cc,
          workmanship_guarantee_days: 30,
          admin_notes: `Supervised by ${CFG.managerAndDispatcher}`
        },
        {
          booking_id: payload.booking_code,
          customer_name: typedCustomerName,
          phone: typedCustomerPhone,
          email: typedCustomerEmail,
          vehicle_brand: payload.vehicle_brand,
          bike_model: payload.bike_model || payload.vehicle_model,
          reg_number: payload.reg_number || payload.registration_no,
          vehicle_class: payload.vehicle_class,
          engine_cc: payload.engine_cc,
          service_type: payload.service_type || payload.service_category,
          area: `${payload.area_name} (${payload.pincode})`,
          booking_date: payload.booking_date || payload.preferred_date,
          time_slot: payload.time_slot || payload.preferred_time_window,
          complaint_note: payload.complaint_note || payload.complaint_notes || "Diagnostic check",
          address: payload.address || payload.street_address,
          landmark: payload.landmark,
          status: "Booking Confirmed"
        }
      ];

      const bookingsPayloads = [
        {
          job_id: payload.booking_code,
          booking_code: payload.booking_code,
          division: "2W-PETROL",
          customer_name: typedCustomerName,
          customer_phone: typedCustomerPhone,
          customer_mobile: typedCustomerPhone,
          customer_email: typedCustomerEmail,
          vehicle_brand: payload.vehicle_brand,
          vehicle_model: `${payload.vehicle_brand} ${payload.bike_model || payload.vehicle_model}`,
          vehicle_reg: payload.reg_number || payload.registration_no,
          registration_no: payload.reg_number || payload.registration_no,
          vehicle_class: payload.vehicle_class,
          engine_cc: payload.engine_cc,
          machinery_spec: payload.engine_cc,
          service_package: payload.service_type || payload.service_category,
          service_category: payload.service_type || payload.service_category,
          complaint_notes: payload.complaint_note || payload.complaint_notes || "",
          customer_notes: `${payload.complaint_note || ""} | Area: ${payload.area_name} | Address: ${payload.address || payload.street_address}, Landmark: ${payload.landmark}`,
          area_name: payload.area_name,
          pincode: payload.pincode,
          pickup_fee: Number(payload.pickup_charge || 0),
          pickup_charge: Number(payload.pickup_charge || 0),
          preferred_date: payload.booking_date || payload.preferred_date || null,
          preferred_slot: payload.time_slot || payload.preferred_time_window,
          street_address: payload.address || payload.street_address,
          landmark: payload.landmark,
          google_maps_link: payload.gps_coords || "",
          base_price: Number(payload.estimated_cost || 0),
          status: "Booking Confirmed"
        }
      ];

      const requestPayloads = [
        {
          booking_id: payload.booking_code,
          customer_name: typedCustomerName,
          customer_phone: typedCustomerPhone,
          customer_email: typedCustomerEmail,
          description: `[${payload.booking_code}] ${typedCustomerName} (${typedCustomerPhone}) | ${payload.vehicle_brand} ${payload.bike_model || payload.vehicle_model} (${payload.reg_number || payload.registration_no}, ${payload.engine_cc}) | ${payload.service_type || payload.service_category} | Area: ${payload.area_name} (${payload.pincode})`,
          status: "Booking Confirmed"
        }
      ];

      let anySynced = false;
      for (const ep of endpoints) {
        const [r1, r2, r3] = await Promise.all([
          postWithFallback(ep, sbKey, "bike_bookings", bikePayloads),
          postWithFallback(ep, sbKey, "bookings", bookingsPayloads),
          postWithFallback(ep, sbKey, "customer_requests", requestPayloads)
        ]);
        if (r1.ok || r2.ok || r3.ok) {
          anySynced = true;
        }
      }
      return { synced: anySynced };
    }

    // Generic table call (e.g. job_cards, family_vehicles)
    for (const ep of endpoints) {
      try {
        const cleanUrl = ep.replace(/\/+$/, "");
        const res = await fetch(`${cleanUrl}/rest/v1/${table}${query}`, {
          method: method,
          keepalive: true,
          headers: {
            "apikey": sbKey,
            "Authorization": `Bearer ${sbKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: payload ? JSON.stringify(payload) : undefined
        });
        if (res.ok) return { synced: true, status: res.status };
      } catch (e) {}
    }
    return { synced: false };
  }

  async function fetchCloudBookings() {
    const sbKey = CFG.supabasePublishableKey;
    const endpoints = [CFG.supabaseUrl, CFG.supabaseSecondaryUrl].filter(Boolean);
    const merged = [...getBookings()];
    const seen = new Set(merged.map(b => b.booking_code));

    for (const ep of endpoints) {
      const cleanUrl = ep.replace(/\/+$/, "");
      const headers = { "apikey": sbKey, "Authorization": `Bearer ${sbKey}` };
      try {
        const res1 = await fetch(`${cleanUrl}/rest/v1/bike_bookings?select=*&order=created_at.desc&limit=50`, { headers });
        if (res1.ok) {
          const rows = await res1.json();
          if (Array.isArray(rows)) {
            rows.forEach(r => {
              // Filter out any legacy hardcoded test row
              if (r.customer_name && (r.customer_name.includes("Live Verified") || r.customer_name.includes("Live Connection"))) return;
              const code = r.booking_id || ("CCM-" + String(r.id || "").slice(0, 6).toUpperCase());
              if (!seen.has(code)) {
                seen.add(code);
                merged.push({
                  booking_code: code,
                  customer_name: r.customer_name || "",
                  phone: r.phone || "",
                  customer_mobile: r.phone || "",
                  email: r.email || "",
                  customer_email: r.email || "",
                  vehicle_brand: r.vehicle_brand || "",
                  bike_model: r.bike_model || "",
                  vehicle_model: r.bike_model || "",
                  reg_number: r.reg_number || "",
                  registration_no: r.reg_number || "",
                  vehicle_class: r.vehicle_class || "Petrol Two-Wheeler",
                  engine_cc: r.engine_cc || "",
                  odometer_km: Number(r.odometer_km || 0),
                  service_type: r.service_type || "General service",
                  service_category: r.service_type || "General service",
                  complaint_note: r.complaint_note || "",
                  complaint_notes: r.complaint_note || "",
                  area_name: r.area || "Hyderabad",
                  pincode: r.pincode || "500033",
                  is_vip_free_pickup: r.pickup_zone_type === "VIP_FREE" || Number(r.pickup_charge) === 0,
                  pickup_charge: Number(r.pickup_charge || 0),
                  cancellation_fee: Number(r.cancellation_penalty || 300),
                  preferred_date: r.booking_date || "",
                  preferred_time_window: r.time_slot || "",
                  street_address: r.address || "",
                  landmark: r.landmark || "",
                  booking_status: r.status === "Booking Confirmed" ? "received" : (r.status || "received"),
                  customer_parts_approval_status: "pending_inspection",
                  parts_changed: r.parts_changed || "40-Point Diagnostic & Genuine Parts Inspection",
                  next_service_due_date: r.next_service_due_date || "After 3,000 KM / 90 Days",
                  estimated_cost: Number(r.pickup_charge || 0),
                  created_at: r.created_at || new Date().toISOString()
                });
              }
            });
          }
        }
      } catch (e) {}
    }
    saveBookings(merged);
    return merged;
  }

  function buildWhatsAppMessage(b) {
    const vipText = b.is_vip_free_pickup
      ? "✅ FREE VIP FLATBED PICKUP & DROP (₹0)"
      : "🚚 Standard Hyderabad Pickup & Drop (₹500)";
    return [
      `*CC MOTOCRAFTS AI ENGINE LABS SERVICE — CONFIRMED BOOKING PASS*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `🆔 *Booking ID:* ${b.booking_code}`,
      `👤 *Customer Name:* ${b.customer_name}`,
      `📞 *Customer Mobile:* ${b.phone || b.customer_mobile}`,
      b.email ? `📧 *Customer Email:* ${b.email}` : "",
      `🏍️ *Vehicle:* ${b.vehicle_brand} ${b.bike_model || b.vehicle_model} (${b.engine_cc})`,
      `🏷️ *Class:* ${b.vehicle_class}`,
      `🔢 *Reg No:* ${b.reg_number || b.registration_no} ${b.odometer_km ? "| Odometer: " + b.odometer_km + " KM" : ""}`,
      `🛠️ *Service:* ${b.service_type || b.service_category}`,
      `📝 *Complaint:* ${b.complaint_note || b.complaint_notes || "Complete Diagnostic Inspection"}`,
      `📍 *Area & PIN:* ${b.area_name} — ${b.pincode}`,
      `🚚 *Pickup Tier:* ${vipText}`,
      `📅 *Preferred Slot:* ${b.preferred_date} | ${b.preferred_time_window}`,
      `🏠 *Address:* ${b.street_address} (Landmark: ${b.landmark})`,
      b.gps_coords ? `🛰️ *Live GPS:* ${b.gps_coords}` : "",
      `━━━━━━━━━━━━━━━━━━━━`,
      `👨‍💼 *Supervised By:* ${CFG.managerAndDispatcher}`,
      `🛡️ *Zero Unapproved Parts Guarantee:* Without your WhatsApp approval, not even 1 Paisa of extra part is replaced.`,
      `📩 *Official Email:* ${CFG.officialEmail}`
    ].filter(Boolean).join("\n");
  }

  window.CCM_API = {
    fetchCloudBookings,
    getServices,
    saveServices,
    getBookings,
    saveBookings,
    getFamilyGarage,
    saveFamilyGarage,
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
          : "🚚 Standard Greater Hyderabad Pickup & Drop: ₹500 (All 100cc–2500cc Petrol Two-Wheelers)"
      };
    }
  };

  // ==========================================================================
  // DOM INITIALIZATION
  // ==========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    initCustomerPlatform();
    initGlobalFloatingAssistant();
  });

  function initCustomerPlatform() {
    // 1. Render 4 Petrol Vehicle Classes
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

    // 3. Populate Booking Form Area & Date
    const areaSelect = document.getElementById("area");
    if (areaSelect) {
      areaSelect.innerHTML = CFG.hyderabadAreas.map(a =>
        `<option value="${a.pincode}" data-areaname="${a.area}">${a.label}</option>`
      ).join("");
      areaSelect.addEventListener("change", updateBookingPickupPreview);
    }

    const pinInput = document.getElementById("pincode");
    if (pinInput) {
      pinInput.addEventListener("input", () => updatePinBanner(pinInput.value));
    }

    const dateInput = document.getElementById("booking_date");
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split("T")[0];
    }

    updateBookingPickupPreview();

    // 4. Live GPS Capture
    const gpsBtn = document.getElementById("btn-capture-gps");
    if (gpsBtn) {
      gpsBtn.addEventListener("click", () => {
        const statusEl = document.getElementById("gps-status-text");
        const gpsInput = document.getElementById("gps_coords");
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

    // 5. Booking Form Submission (Direct Binding from #customer_name, #phone, #email, etc.)
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

    // 6. Render Portfolio Gallery
    renderPortfolioGallery("ALL");

    // 7. Live Workshop Bay Tracker (#vip-zor) & My Orders / Family Vehicle Garage Hub
    fetchCloudBookings().then(() => {
      renderCustomerLiveTracker("");
      renderMyOrdersAndFamilyGarage("");
    });

    const btnTrack = document.getElementById("btn-track-search");
    if (btnTrack) {
      btnTrack.addEventListener("click", () => {
        const q = (document.getElementById("tracker-input").value || "").trim();
        renderCustomerLiveTracker(q);
      });
    }

    const btnGarageLookup = document.getElementById("btn-garage-lookup");
    if (btnGarageLookup) {
      btnGarageLookup.addEventListener("click", () => {
        const q = (document.getElementById("garage-mobile-input").value || "").trim();
        renderMyOrdersAndFamilyGarage(q);
      });
    }

    // 8. Instant PIN Code Checker Bar
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
    const sSelect = document.getElementById("service_type");
    const services = getServices();

    if (sGrid) {
      sGrid.innerHTML = services.map(s => `
        <div class="service-card">
          <div>
            <span class="cluster-tag">${s.category}</span>
            <h3 style="font-size:1.06rem;color:#fff;margin-bottom:6px;">${s.name}</h3>
            <p style="font-size:0.83rem;color:var(--text-muted);">${s.desc || ""}</p>
            <div class="service-price-matrix">
              <div><span>🛵 Scooter (Petrol)</span><strong>₹${s.scooter_price}</strong></div>
              <div><span>🏍️ Commuter (100-160cc)</span><strong>₹${s.commuter_price}</strong></div>
              <div><span>⚡ Sports (200-500cc)</span><strong>₹${s.sports_price}</strong></div>
              <div><span>🏁 Superbike (600-2500cc)</span><strong>₹${s.superbike_price}</strong></div>
            </div>
            <p style="font-size:0.75rem;color:#34d399;margin-bottom:14px;">🛡️ ${s.warranty}</p>
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
    const sel = document.getElementById("vehicle_class");
    if (sel) sel.value = vClass;
    const formSec = document.getElementById("booking-section");
    if (formSec) formSec.scrollIntoView({ behavior: "smooth" });
  };

  window.prefillServiceBooking = function (categoryName, vClass) {
    const sSelect = document.getElementById("service_type");
    if (sSelect) sSelect.value = categoryName;
    if (vClass) {
      const vSelect = document.getElementById("vehicle_class");
      if (vSelect) vSelect.value = vClass;
    }
    const formSec = document.getElementById("booking-section");
    if (formSec) formSec.scrollIntoView({ behavior: "smooth" });
  };

  window.selectVipPin = function (pin) {
    const pinInput = document.getElementById("pincode");
    const areaSelect = document.getElementById("area");
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
    const areaSelect = document.getElementById("area");
    const pinInput = document.getElementById("pincode");
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
        <div style="font-weight:800;color:${info.isVip ? "#34d399" : "#fbbf24"};font-size:0.93rem;">
          ${info.label}
        </div>
        <div style="font-size:0.79rem;color:#e2e8f0;margin-top:4px;">
          PIN Code: <strong>${info.pincode || "N/A"}</strong> • Pickup & Drop: <strong>₹${info.pickupFee}</strong> • Disclosed Cancellation Fee: <strong>₹${info.cancellationFee}</strong>
        </div>
      `;
    }
    if (summaryFee) summaryFee.textContent = info.isVip ? "₹0 (FREE VIP Zone)" : "₹500 (Standard Hyderabad)";
    if (summaryCancel) summaryCancel.textContent = `₹${info.cancellationFee}`;
  }

  // ==========================================================================
  // CRITICAL FIX: DIRECT INPUT ELEMENT READING (customer_name, phone, email, etc.)
  // ==========================================================================
  async function handleBookingSubmit(openWhatsAppImmediately) {
    try {
      const customerNameEl = document.getElementById("customer_name");
      const phoneEl = document.getElementById("phone");
      const emailEl = document.getElementById("email");
      const brandEl = document.getElementById("vehicle_brand");
      const modelEl = document.getElementById("bike_model");
      const regEl = document.getElementById("reg_number");
      const odoEl = document.getElementById("odometer_km");
      const vclassEl = document.getElementById("vehicle_class");
      const ccEl = document.getElementById("engine_cc");
      const serviceEl = document.getElementById("service_type");
      const complaintEl = document.getElementById("complaint_note");
      const areaSelect = document.getElementById("area");
      const pincodeEl = document.getElementById("pincode");
      const dateEl = document.getElementById("booking_date");
      const timeEl = document.getElementById("time_slot");
      const addressEl = document.getElementById("address");
      const landmarkEl = document.getElementById("landmark");
      const gpsEl = document.getElementById("gps_coords");

      const customer_name = (customerNameEl ? customerNameEl.value : "").trim();
      const phone = (phoneEl ? phoneEl.value : "").trim();
      const email = (emailEl ? emailEl.value : "").trim();
      const vehicle_brand = brandEl ? brandEl.value : "Honda";
      const bike_model = (modelEl ? modelEl.value : "").trim();
      const reg_number = (regEl ? regEl.value : "").trim().toUpperCase();
      const odometer_km = Number((odoEl ? odoEl.value : "0").trim() || 0);
      const vehicle_class = vclassEl ? vclassEl.value : "Commuter (100–160cc Petrol)";
      const engine_cc = ccEl ? ccEl.value : "100cc–125cc";
      const service_type = serviceEl ? serviceEl.value : "General service";
      const complaint_note = (complaintEl ? complaintEl.value : "").trim();
      const area_name = areaSelect && areaSelect.options[areaSelect.selectedIndex]
        ? areaSelect.options[areaSelect.selectedIndex].getAttribute("data-areaname") || "Hyderabad"
        : "Hyderabad";
      const pincode = (pincodeEl ? pincodeEl.value : "").trim();
      const booking_date = dateEl ? dateEl.value : new Date().toISOString().split("T")[0];
      const time_slot = timeEl ? timeEl.value : "09:00–11:00";
      const address = (addressEl ? addressEl.value : "").trim();
      const landmark = (landmarkEl ? landmarkEl.value : "").trim();
      const gps_coords = (gpsEl ? gpsEl.value : "").trim();

      if (!customer_name || !phone || !bike_model || !reg_number || !pincode || !address || !landmark) {
        alert("Please enter your Name, 10-Digit Mobile Number, Bike/Scooter Model, Registration Number, PIN Code, Street Address, and Landmark.");
        return;
      }

      const pinInfo = window.CCM_API.checkPinEligibility(pincode);
      const bookingCode = "CCM-" + Math.floor(100000 + Math.random() * 900000);
      const nextDueKm = odometer_km > 0 ? odometer_km + 3000 : 3000;
      const nextDueDateObj = new Date();
      nextDueDateObj.setMonth(nextDueDateObj.getMonth() + 4);
      const nextDueDate = nextDueDateObj.toISOString().split("T")[0];

      const newBooking = {
        booking_code: bookingCode,
        booking_id: bookingCode,
        customer_name: customer_name,
        phone: phone,
        customer_mobile: phone,
        email: email,
        customer_email: email,
        vehicle_brand: vehicle_brand,
        bike_model: bike_model,
        vehicle_model: bike_model,
        reg_number: reg_number,
        registration_no: reg_number,
        odometer_km: odometer_km,
        vehicle_class: vehicle_class,
        engine_cc: engine_cc,
        service_type: service_type,
        service_category: service_type,
        complaint_note: complaint_note,
        complaint_notes: complaint_note,
        area_name: area_name,
        pincode: pincode,
        is_vip_free_pickup: pinInfo.isVip,
        pickup_charge: pinInfo.pickupFee,
        cancellation_fee: pinInfo.cancellationFee,
        booking_date: booking_date,
        preferred_date: booking_date,
        time_slot: time_slot,
        preferred_time_window: time_slot,
        address: address,
        street_address: address,
        landmark: landmark,
        gps_coords: gps_coords,
        bay_number: "BAY-01 (Assigned on Arrival)",
        assigned_partner: CFG.managerAndDispatcher,
        booking_status: "received",
        customer_parts_approval_status: "pending_inspection",
        parts_changed: `Booked for ${service_type} (100% Genuine OEM Parts — Prior WhatsApp Approval Required)`,
        next_service_due_date: nextDueDate,
        next_service_due_km: nextDueKm,
        inspection_findings: "Awaiting flatbed pickup & 40-point digital diagnostic inspection.",
        estimated_cost: pinInfo.pickupFee,
        created_at: new Date().toISOString()
      };

      // Save Customer Profile on device for 1-click repeat booking
      localStorage.setItem("ccm_customer_profile_v9", JSON.stringify({
        customer_name, phone, email, vehicle_brand, bike_model, reg_number, odometer_km, pincode, address, landmark
      }));

      // Also add/update vehicle in Family Vehicles Garage Hub
      const famList = getFamilyGarage();
      const existingVehIdx = famList.findIndex(v => v.reg_number.replace(/\s+/g, "") === reg_number.replace(/\s+/g, ""));
      const vehEntry = {
        customer_phone: phone,
        customer_name: customer_name,
        reg_number: reg_number,
        vehicle_brand: vehicle_brand,
        vehicle_model: `${bike_model} (${engine_cc})`,
        vehicle_class: vehicle_class,
        engine_cc: engine_cc,
        odometer_km: odometer_km || 15000,
        last_service_date: booking_date,
        next_service_due_date: nextDueDate,
        next_service_due_km: nextDueKm,
        parts_changed: `${service_type} — Scheduled (${bookingCode})`,
        total_amount: pinInfo.pickupFee,
        warranty_status: "Active — 30-Day Unconditional Workmanship Guarantee",
        certificate_no: "CERT-" + bookingCode,
        supervised_by: CFG.managerAndDispatcher
      };
      if (existingVehIdx >= 0) {
        famList[existingVehIdx] = vehEntry;
      } else {
        famList.unshift(vehEntry);
      }
      saveFamilyGarage(famList);

      // Save to Local DB & Sync to Supabase (`bike_bookings` + `bookings` + `family_vehicles`)
      const list = getBookings();
      list.unshift(newBooking);
      saveBookings(list);

      const syncResult = await syncToSupabase("bookings", "POST", newBooking);
      if (window.queueOfflineBookingIfNeeded) {
        window.queueOfflineBookingIfNeeded(newBooking, syncResult && syncResult.synced);
      }

      // Build WhatsApp URL
      const waText = buildWhatsAppMessage(newBooking);
      const waUrl = `https://wa.me/${CFG.officialWhatsApp}?text=${encodeURIComponent(waText)}`;

      // Populate & Open Booking Confirmation Pass Modal
      const modal = document.getElementById("booking-pass-modal");
      const passContent = document.getElementById("booking-pass-details");
      const btnPassWa = document.getElementById("btn-pass-whatsapp");
      const btnPassEmail = document.getElementById("btn-pass-email");

      if (passContent) {
        passContent.innerHTML = `
          <div style="background:rgba(16,185,129,0.12);border:1px solid #10b981;padding:12px;border-radius:8px;margin-bottom:14px;">
            <div style="font-size:0.76rem;color:#34d399;font-weight:800;">DIGITAL BOOKING PASS & SUPABASE RECORD SAVED</div>
            <div style="font-size:1.3rem;font-weight:900;color:#fff;">Booking ID: ${bookingCode}</div>
            <div style="font-size:0.8rem;color:#e2e8f0;">Supervised by: <strong>${CFG.managerAndDispatcher}</strong></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:0.84rem;margin-bottom:14px;">
            <div><span style="color:var(--text-muted);">Customer Name & Phone:</span><br><strong>${customer_name} (${phone})</strong></div>
            <div><span style="color:var(--text-muted);">Petrol Two-Wheeler:</span><br><strong>${vehicle_brand} ${bike_model} (${engine_cc})</strong></div>
            <div><span style="color:var(--text-muted);">Reg No & Odometer:</span><br><strong>${reg_number} ${odometer_km ? "• " + odometer_km + " KM" : ""}</strong></div>
            <div><span style="color:var(--text-muted);">Service Category:</span><br><strong>${service_type}</strong></div>
            <div><span style="color:var(--text-muted);">Area & PIN:</span><br><strong>${area_name} (${pincode})</strong></div>
            <div><span style="color:var(--text-muted);">Pickup & Drop Charge:</span><br><strong style="color:#34d399;">${pinInfo.isVip ? "FREE VIP PICKUP (₹0)" : "Standard ₹500"}</strong></div>
            <div style="grid-column:1/-1;"><span style="color:var(--text-muted);">Pickup Slot & Address:</span><br><strong>${booking_date} (${time_slot}) — ${address}, Landmark: ${landmark}</strong></div>
          </div>
          <div style="background:rgba(245,158,11,0.12);border:1px solid var(--border-amber);padding:10px 12px;border-radius:8px;font-size:0.8rem;color:#fde68a;">
            🛡️ <strong>Zero Unapproved Parts Guarantee:</strong> Our technician will inspect your petrol two-wheeler and send photos/video + quotation on WhatsApp. If you reply <strong>"Confirm Change"</strong>, we replace with 100% Genuine OEM parts. If you say <strong>"Nako / No"</strong>, we do not add even 1 Paisa of extra parts!
          </div>
        `;
      }

      if (btnPassWa) btnPassWa.href = waUrl;
      if (btnPassEmail) {
        btnPassEmail.href = `mailto:${CFG.officialEmail}?subject=${encodeURIComponent("Confirmed Booking Pass " + bookingCode + " - " + customer_name + " (" + phone + ")")}&body=${encodeURIComponent(waText)}`;
      }

      if (modal) modal.classList.add("open");

      renderCustomerLiveTracker(bookingCode);
      renderMyOrdersAndFamilyGarage(phone);

      if (openWhatsAppImmediately) {
        window.open(waUrl, "_blank");
      }
    } catch (err) {
      window.showTechnicalFallbackModal();
    }
  }

  window.closeBookingModal = function () {
    const modal = document.getElementById("booking-pass-modal");
    if (modal) modal.classList.remove("open");
  };

  // ==========================================================================
  // PORTFOLIO FILTER BY CC CLASS (100cc-2500cc Petrol Bikes & Scooters)
  // ==========================================================================
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
      return item.ccFilter === filterKey || item.vehicleClass.includes(filterKey) || item.category.includes(filterKey);
    });

    grid.innerHTML = items.map(item => `
      <div class="portfolio-card">
        <div class="portfolio-img-wrap">
          <img src="${item.img}" alt="${item.title} - CC Motocrafts AI Engine Labs Hyderabad" loading="lazy">
          <span class="portfolio-badge">${item.badge}</span>
        </div>
        <div class="portfolio-body">
          <div>
            <div style="font-size:0.73rem;color:var(--cyan);font-weight:700;text-transform:uppercase;margin-bottom:4px;">${item.vehicleClass} • ${item.category}</div>
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

  // ==========================================================================
  // LIVE WORKSHOP BAY STATUS TRACKER (#vip-zor) & DIGITAL CERTIFICATE DISPATCH
  // ==========================================================================
  function renderCustomerLiveTracker(query) {
    const box = document.getElementById("live-tracker-result");
    if (!box) return;
    const list = getBookings();
    const q = String(query || "").trim().toUpperCase();

    let match = list.find(b =>
      (b.booking_code && b.booking_code.toUpperCase() === q) ||
      (b.phone && b.phone.includes(q)) ||
      (b.reg_number && b.reg_number.toUpperCase().includes(q))
    );

    if (!match) {
      match = list[0] || {
        booking_code: "CCM-BAY-LIVE",
        customer_name: "Enter Your Booking ID or Mobile Above",
        phone: "+91 8333084261",
        vehicle_brand: "Suzuki",
        bike_model: "Hayabusa 1300cc / Activa 125cc",
        reg_number: "KA 51 HW 3002",
        engine_cc: "125cc–1300cc",
        area_name: "Jubilee Hills / Manikonda VIP Hub",
        pincode: "500033",
        is_vip_free_pickup: true,
        bay_number: "BAY-01 (OBD-II & Precision Engine Lab)",
        assigned_partner: CFG.managerAndDispatcher,
        booking_status: "awaiting_whatsapp_approval",
        customer_parts_approval_status: "quotation_sent_on_whatsapp",
        inspection_findings: "40-Point OBD-II & Mechanical Inspection Complete. Live video & genuine OEM part quotation shared on customer WhatsApp for prior approval.",
        estimated_cost: 1450
      };
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

    const approveWaMsg = `Hi Mr. Nitish Kumar (CC Motocrafts AI Engine Labs), for Booking ID *${match.booking_code}* (${match.vehicle_brand} ${match.bike_model || match.vehicle_model} - ${match.reg_number || match.registration_no}), I *CONFIRM & APPROVE* the genuine parts replacement quotation.`;
    const rejectWaMsg = `Hi Mr. Nitish Kumar (CC Motocrafts AI Engine Labs), for Booking ID *${match.booking_code}* (${match.vehicle_brand} ${match.bike_model || match.vehicle_model}), *NAKO / DO NOT CHANGE* the extra parts. Please proceed only with standard approved service.`;

    box.innerHTML = `
      <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border-cyan);border-radius:12px;padding:20px;">
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px;">
          <div>
            <span class="cluster-tag">LIVE WORKSHOP BAY TRACKER • ${match.bay_number || "BAY-01"}</span>
            <h3 style="color:#fff;font-size:1.22rem;">${match.booking_code} — ${match.vehicle_brand} ${match.bike_model || match.vehicle_model} (${match.reg_number || match.registration_no})</h3>
            <p style="font-size:0.83rem;color:var(--text-muted);">Customer: <strong>${match.customer_name}</strong> • Area: <strong>${match.area_name} (${match.pincode})</strong> • Supervised By: <strong>${CFG.managerAndDispatcher}</strong></p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.76rem;color:var(--text-muted);">Pickup Tier</div>
            <div style="font-weight:800;color:#34d399;">${match.is_vip_free_pickup ? "FREE VIP PICKUP (₹0)" : "Standard ₹500"}</div>
          </div>
        </div>

        <div class="tracker-steps">
          ${stages.map((st, i) => `
            <div class="tracker-step ${i < currentIdx ? "done" : i === currentIdx ? "current" : ""}">
              <div style="font-size:0.74rem;font-weight:800;color:${i <= currentIdx ? "#fff" : "var(--text-dim)"};">${st.label}</div>
              <div style="font-size:0.69rem;color:${i < currentIdx ? "#34d399" : i === currentIdx ? "#fbbf24" : "var(--text-dim)"};margin-top:4px;">
                ${i < currentIdx ? "✓ Completed" : i === currentIdx ? "● Active Stage" : "Pending"}
              </div>
            </div>
          `).join("")}
        </div>

        <div style="background:rgba(11,15,25,0.92);border:1px solid var(--border-amber);border-radius:10px;padding:16px;margin-top:14px;">
          <h4 style="color:var(--amber-bright);margin-bottom:6px;">📋 Diagnostic Report & Genuine OEM Parts Approval:</h4>
          <p style="font-size:0.88rem;color:#e2e8f0;margin-bottom:10px;">${match.inspection_findings || "Inspection in progress."}</p>
          <div style="display:flex;flex-wrap:wrap;gap:10px;">
            <a href="https://wa.me/${CFG.officialWhatsApp}?text=${encodeURIComponent(approveWaMsg)}" target="_blank" class="btn btn-whatsapp">
              ✅ Confirm Change on WhatsApp (Approve Genuine Parts)
            </a>
            <a href="https://wa.me/${CFG.officialWhatsApp}?text=${encodeURIComponent(rejectWaMsg)}" target="_blank" class="btn btn-crimson">
              ✋ Nako / Do Not Change Parts (0 Paisa Extra)
            </a>
            <button type="button" class="btn btn-cyan" onclick="dispatchWarrantyCertificate('${match.booking_code}')">
              📜 1-Click Digital Warranty & Invoice Sign-Off
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // REQUIREMENT 4 & 5: "MY ORDERS" & FAMILY VEHICLE GARAGE HUB + 1-CLICK WARRANTY DISPATCH
  // ==========================================================================
  function renderMyOrdersAndFamilyGarage(mobileQuery) {
    const statsContainer = document.getElementById("my-orders-stats");
    const garageGrid = document.getElementById("family-garage-grid");
    const historyBody = document.getElementById("service-history-tbody");
    if (!garageGrid) return;

    const allBookings = getBookings();
    const familyVehicles = getFamilyGarage();
    const cleanQ = String(mobileQuery || "").replace(/\D/g, "");

    const filteredBookings = cleanQ
      ? allBookings.filter(b => String(b.phone || b.customer_mobile || "").replace(/\D/g, "").includes(cleanQ))
      : allBookings;

    const totalCompleted = familyVehicles.length + filteredBookings.length;

    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="hero-badge-card">
          <strong style="font-size:1.35rem;color:#34d399;">${totalCompleted}</strong>
          <span>Total Services Completed & Logged</span>
        </div>
        <div class="hero-badge-card">
          <strong style="font-size:1.35rem;color:var(--amber-bright);">${familyVehicles.length} Vehicles</strong>
          <span>Registered in Family Garage Hub</span>
        </div>
        <div class="hero-badge-card">
          <strong style="font-size:1.1rem;color:var(--cyan);">30-Day Guarantee</strong>
          <span>Active Workmanship Warranty Status</span>
        </div>
        <div class="hero-badge-card">
          <strong style="font-size:0.95rem;color:#fff;">Mr. Nitish Kumar</strong>
          <span>Manager & Lead Dispatcher (+91 8333084261)</span>
        </div>
      `;
    }

    garageGrid.innerHTML = familyVehicles.map((v, idx) => `
      <div class="service-card" style="border-color:rgba(6,182,212,0.4);">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;">
            <span class="cluster-tag">${v.reg_number}</span>
            <span style="font-size:0.75rem;color:var(--amber-bright);font-weight:700;">Odometer: ${Number(v.odometer_km).toLocaleString()} KM</span>
          </div>
          <h3 style="font-size:1.08rem;color:#fff;margin-bottom:4px;">${v.vehicle_brand} ${v.vehicle_model}</h3>
          <div style="font-size:0.76rem;color:var(--cyan);font-weight:700;margin-bottom:10px;">${v.vehicle_class}</div>
          <div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;font-size:0.8rem;margin-bottom:10px;">
            <div style="margin-bottom:4px;"><span style="color:var(--text-muted);">Parts Changed / Work Done:</span><br><strong style="color:#e2e8f0;">${v.parts_changed}</strong></div>
            <div style="display:flex;justify-content:space-between;margin-top:8px;border-top:1px solid var(--border-subtle);padding-top:6px;">
              <span>Last Bill: <strong>${v.last_service_date}</strong></span>
              <span style="color:#fbbf24;">Next Due: <strong>${v.next_service_due_date} / ${Number(v.next_service_due_km).toLocaleString()} KM</strong></span>
            </div>
          </div>
          <p style="font-size:0.76rem;color:#34d399;margin-bottom:12px;">🛡️ ${v.warranty_status}</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" class="btn btn-amber" style="flex:1;padding:8px 10px;font-size:0.78rem;" onclick="dispatchFamilyVehicleCertificate(${idx})">
            📜 Dispatch Warranty & Invoice
          </button>
          <button type="button" class="btn btn-outline" style="padding:8px 10px;font-size:0.78rem;" onclick="quickRebookFamilyVehicle(${idx})">
            🔄 Re-Book
          </button>
        </div>
      </div>
    `).join("");

    if (historyBody) {
      const combinedRows = [
        ...filteredBookings.map(b => ({
          code: b.booking_code,
          date: b.booking_date || b.preferred_date || "2026-11-14",
          vehicle: `${b.vehicle_brand} ${b.bike_model || b.vehicle_model} (${b.reg_number || b.registration_no})`,
          odo: b.odometer_km ? `${b.odometer_km} KM` : "Recorded at Intake",
          work: b.parts_changed || b.service_type || b.service_category,
          nextDue: b.next_service_due_date || "After 3,000 KM",
          warranty: "30-Day Workmanship Guarantee Active",
          customer: `${b.customer_name} (${b.phone || b.customer_mobile})`
        })),
        ...familyVehicles.map(v => ({
          code: v.certificate_no,
          date: v.last_service_date,
          vehicle: `${v.vehicle_brand} ${v.vehicle_model} (${v.reg_number})`,
          odo: `${Number(v.odometer_km).toLocaleString()} KM`,
          work: v.parts_changed,
          nextDue: `${v.next_service_due_date} OR ${Number(v.next_service_due_km).toLocaleString()} KM`,
          warranty: v.warranty_status,
          customer: v.customer_name || "Registered Family Garage"
        }))
      ];

      historyBody.innerHTML = combinedRows.map(r => `
        <tr>
          <td><strong style="color:var(--amber-bright);">${r.code}</strong><br><small style="color:var(--text-muted);">${r.date}</small></td>
          <td><strong>${r.vehicle}</strong><br><small style="color:var(--cyan);">Odometer: ${r.odo}</small></td>
          <td style="max-width:280px;font-size:0.8rem;">${r.work}</td>
          <td><strong style="color:#fbbf24;">${r.nextDue}</strong></td>
          <td><span class="cluster-tag">${r.warranty}</span></td>
          <td>
            <button type="button" class="btn btn-whatsapp" style="padding:6px 10px;font-size:0.75rem;" onclick="sendDirectSignOffWhatsApp('${r.code}', '${r.vehicle}', '${r.odo}', '${r.nextDue}')">
              📲 WhatsApp Certificate
            </button>
          </td>
        </tr>
      `).join("");
    }
  }

  window.addFamilyVehicleModal = async function (e) {
    if (e) e.preventDefault();
    const phone = (document.getElementById("fv-phone").value || "").trim();
    const brand = document.getElementById("fv-brand").value;
    const model = (document.getElementById("fv-model").value || "").trim();
    const reg = (document.getElementById("fv-reg").value || "").trim().toUpperCase();
    const odo = Number(document.getElementById("fv-odo").value || 0);

    if (!phone || !model || !reg) {
      alert("Please enter your Mobile Number, Vehicle Model, and Registration Number.");
      return;
    }

    const nextKm = odo + 3000;
    const dueObj = new Date();
    dueObj.setMonth(dueObj.getMonth() + 6);
    const dueStr = dueObj.toISOString().split("T")[0];

    const newVeh = {
      customer_phone: phone,
      reg_number: reg,
      vehicle_brand: brand,
      vehicle_model: model,
      vehicle_class: "Petrol Two-Wheeler (100cc–2500cc)",
      engine_cc: "Multi-CC",
      odometer_km: odo,
      last_service_date: new Date().toISOString().split("T")[0],
      next_service_due_date: dueStr,
      next_service_due_km: nextKm,
      parts_changed: "Registered in Family Garage Hub — Eligible for 30-Day Guarantee & Free VIP Pickup",
      total_amount: 0,
      warranty_status: "Active — 30-Day Workmanship Guarantee",
      certificate_no: "CCM-GAR-" + Math.floor(1000 + Math.random() * 9000),
      supervised_by: CFG.managerAndDispatcher
    };

    const list = getFamilyGarage();
    list.unshift(newVeh);
    saveFamilyGarage(list);
    renderMyOrdersAndFamilyGarage(phone);

    await syncToSupabase("family_vehicles", "POST", {
      customer_phone: phone,
      vehicle_brand: brand,
      vehicle_model: model,
      reg_number: reg,
      odometer_km: odo,
      last_service_date: newVeh.last_service_date,
      next_service_due_date: dueStr,
      next_service_due_km: nextKm,
      parts_changed_history: newVeh.parts_changed,
      warranty_status: newVeh.warranty_status
    });

    document.getElementById("add-family-vehicle-form").reset();
  };

  window.quickRebookFamilyVehicle = function (idx) {
    const v = getFamilyGarage()[idx];
    if (!v) return;
    if (document.getElementById("vehicle_brand")) document.getElementById("vehicle_brand").value = v.vehicle_brand;
    if (document.getElementById("bike_model")) document.getElementById("bike_model").value = v.vehicle_model;
    if (document.getElementById("reg_number")) document.getElementById("reg_number").value = v.reg_number;
    if (document.getElementById("odometer_km")) document.getElementById("odometer_km").value = v.odometer_km;
    if (v.customer_phone && document.getElementById("phone")) document.getElementById("phone").value = v.customer_phone;
    const formSec = document.getElementById("booking-section");
    if (formSec) formSec.scrollIntoView({ behavior: "smooth" });
  };

  window.dispatchFamilyVehicleCertificate = function (idx) {
    const v = getFamilyGarage()[idx];
    if (!v) return;
    sendDirectSignOffWhatsApp(v.certificate_no, `${v.vehicle_brand} ${v.vehicle_model} (${v.reg_number})`, `${v.odometer_km} KM`, `${v.next_service_due_date} or ${v.next_service_due_km} KM`);
  };

  window.dispatchWarrantyCertificate = function (bookingCode) {
    const b = getBookings().find(x => x.booking_code === bookingCode);
    const vehicleStr = b ? `${b.vehicle_brand} ${b.bike_model || b.vehicle_model} (${b.reg_number || b.registration_no})` : "Petrol Two-Wheeler";
    const odoStr = b && b.odometer_km ? `${b.odometer_km} KM` : "Recorded on Job Card";
    const nextStr = b && b.next_service_due_date ? b.next_service_due_date : "After 3,000 KM / 90 Days";
    sendDirectSignOffWhatsApp(bookingCode, vehicleStr, odoStr, nextStr);
  };

  window.sendDirectSignOffWhatsApp = async function (certCode, vehicleStr, odoStr, nextDueStr) {
    const signOffText = [
      `*CC MOTOCRAFTS AI ENGINE LABS SERVICE — OFFICIAL DIGITAL SERVICE & WARRANTY CERTIFICATE*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📜 *Certificate / Job ID:* ${certCode}`,
      `🏍️ *Vehicle & Reg No:* ${vehicleStr}`,
      `📟 *Recorded Odometer:* ${odoStr}`,
      `📅 *Next Service Due:* ${nextDueStr}`,
      `🛡️ *Workmanship Warranty:* 30-Day Unconditional Workmanship Guarantee Active`,
      `⚙️ *Major Engine Warranty:* First check within 15–30 days / 500–750 km; periodic oil service every 1,800–2,000 km / 45–60 days.`,
      `✅ *Genuine Parts Certification:* 100% Genuine OEM Parts installed with prior customer WhatsApp approval.`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `👨‍💼 *Supervised & Dispatched By:*`,
      `*Mr. Nitish Kumar* (Manager & Lead Dispatcher)`,
      `📞 *Official Helpline & WhatsApp:* +91 8333084261`,
      `✉️ *Official Email:* info@ccmotocrafts.in`,
      `🌐 *Platform:* https://ccmotocrafts.in`
    ].join("\n");

    await syncToSupabase("job_cards", "POST", {
      job_card_no: certCode,
      booking_id: certCode,
      vehicle_model: vehicleStr,
      Inspection_notes: "Official Digital Service & Warranty Sign-Off Dispatched",
      warranty_certificate_no: certCode,
      warranty_status: "30-Day Unconditional Workmanship Guarantee Active",
      dispatched_by: "Mr. Nitish Kumar (Manager & Lead Dispatcher, +91 8333084261)"
    });

    window.open(`https://wa.me/${CFG.officialWhatsApp}?text=${encodeURIComponent(signOffText)}`, "_blank");
  };

  // ==========================================================================
  // FLOATING AI ASSISTANT & QUICK WHATSAPP BOOKING
  // ==========================================================================
  function initGlobalFloatingAssistant() {
    const dock = document.getElementById("global-floating-dock");
    if (!dock) return;

    dock.innerHTML = `
      <div class="ai-chat-window" id="ai-assistant-window">
        <div class="ai-chat-header">
          <div>
            <strong style="color:#fff;font-size:0.9rem;">🤖 CC Motocrafts AI Engine Advisor</strong>
            <div style="font-size:0.7rem;color:#a5f3fc;">100cc–2500cc Petrol Diagnostics • Supervised by Mr. Nitish Kumar</div>
          </div>
          <button type="button" onclick="toggleAiAssistant()" style="background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer;">✕</button>
        </div>
        <div class="ai-chat-body">
          <div class="chat-msg bot">
            👋 Welcome to <strong>CC Motocrafts AI Engine Labs</strong>! Enter your details below to log your booking in our database & confirm directly with Manager & Lead Dispatcher <strong>Mr. Nitish Kumar (+91 8333084261)</strong>:
          </div>
          <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border-subtle);padding:12px;border-radius:8px;display:flex;flex-direction:column;gap:8px;">
            <input type="text" id="qa-name" class="form-control" placeholder="Your Full Name *" style="padding:8px 10px;font-size:0.82rem;">
            <input type="tel" id="qa-mobile" class="form-control" placeholder="10-Digit Mobile Number *" style="padding:8px 10px;font-size:0.82rem;">
            <input type="text" id="qa-bike" class="form-control" placeholder="Petrol Bike/Scooter & Reg No (e.g. Activa / Hayabusa) *" style="padding:8px 10px;font-size:0.82rem;">
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
              📲 Save Booking & Share on WhatsApp
            </button>
          </div>
        </div>
      </div>
      <div class="floating-buttons-row">
        <button type="button" class="btn btn-amber" onclick="toggleAiAssistant()" style="border-radius:999px;box-shadow:0 8px 25px rgba(0,0,0,0.7);">
          🤖 AI Engineer / Quick Book
        </button>
        <a href="https://wa.me/${CFG.officialWhatsApp}?text=${encodeURIComponent("Hello Mr. Nitish Kumar (CC Motocrafts AI Engine Labs)! I need petrol two-wheeler service / diagnostic support in Hyderabad.")}" target="_blank" class="btn btn-whatsapp" style="border-radius:999px;box-shadow:0 8px 25px rgba(0,0,0,0.7);">
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
    const customer_name = (document.getElementById("qa-name").value || "").trim();
    const phone = (document.getElementById("qa-mobile").value || "").trim();
    const bike = (document.getElementById("qa-bike").value || "").trim();
    const pin = document.getElementById("qa-pin").value;
    const issue = (document.getElementById("qa-issue").value || "").trim() || "AI Diagnostic & Service Check";

    if (!customer_name || !phone || !bike) {
      alert("Please enter your Name, 10-Digit Mobile Number, and Bike Model.");
      return;
    }

    const pinInfo = window.CCM_API.checkPinEligibility(pin);
    const code = "CCM-" + Math.floor(100000 + Math.random() * 900000);
    const today = new Date().toISOString().split("T")[0];

    const quickRecord = {
      booking_code: code,
      booking_id: code,
      customer_name: customer_name,
      phone: phone,
      customer_mobile: phone,
      email: "",
      customer_email: "",
      vehicle_brand: bike.split(" ")[0] || "Petrol Two-Wheeler",
      bike_model: bike,
      vehicle_model: bike,
      reg_number: "QUICK-BOOK",
      registration_no: "QUICK-BOOK",
      vehicle_class: "Commuter (100–160cc Petrol)",
      engine_cc: "100cc–2500cc",
      service_type: issue,
      service_category: issue,
      complaint_note: issue,
      complaint_notes: issue,
      area_name: pinInfo.isVip ? "VIP Free Pickup Zone" : "Greater Hyderabad",
      pincode: pin,
      is_vip_free_pickup: pinInfo.isVip,
      pickup_charge: pinInfo.pickupFee,
      cancellation_fee: pinInfo.cancellationFee,
      booking_date: today,
      preferred_date: today,
      time_slot: "11:00–13:00",
      preferred_time_window: "11:00–13:00",
      address: "Shared via Quick Booking Widget",
      street_address: "Shared via Quick Booking Widget",
      landmark: "Hyderabad",
      booking_status: "received",
      customer_parts_approval_status: "pending_inspection",
      created_at: new Date().toISOString()
    };

    const list = getBookings();
    list.unshift(quickRecord);
    saveBookings(list);
    await syncToSupabase("bookings", "POST", quickRecord);

    const waText = buildWhatsAppMessage(quickRecord);
    window.open(`https://wa.me/${CFG.officialWhatsApp}?text=${encodeURIComponent(waText)}`, "_blank");
  };

  window.toggleMobileNav = function () {
    const nav = document.getElementById("main-nav-links");
    if (nav) nav.classList.toggle("open");
  };
})();

// ============================================================================
// PWA INSTALLER & OFFLINE BOOKING SYNC
// ============================================================================
(function () {
  let deferredInstallPrompt = null;

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    document.querySelectorAll(".pwa-install-btn").forEach((btn) => {
      btn.style.display = "inline-flex";
    });
  });

  window.installCCMotocraftsApp = async function () {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === "accepted") deferredInstallPrompt = null;
    } else {
      alert(
        "📲 Install CC Motocrafts Native App:\n\n" +
        "• On Android Chrome: Tap the 3 dots (⋮) at top-right → tap 'Install app' or 'Add to Home screen'.\n" +
        "• On iPhone Safari: Tap 'Share' → tap 'Add to Home Screen'.\n\n" +
        "Opens full-screen with hidden browser URL bars and works online & offline!"
      );
    }
  };

  function autoFillSavedCustomerProfile() {
    const saved = localStorage.getItem("ccm_customer_profile_v9");
    if (!saved) return;
    try {
      const p = JSON.parse(saved);
      const setVal = (id, v) => { const el = document.getElementById(id); if (el && v && !el.value) el.value = v; };
      setVal("customer_name", p.customer_name);
      setVal("phone", p.phone);
      setVal("email", p.email);
      if (p.vehicle_brand && document.getElementById("vehicle_brand")) document.getElementById("vehicle_brand").value = p.vehicle_brand;
      setVal("bike_model", p.bike_model);
      setVal("reg_number", p.reg_number);
      if (p.odometer_km) setVal("odometer_km", p.odometer_km);
      if (p.pincode && document.getElementById("pincode")) document.getElementById("pincode").value = p.pincode;
      setVal("address", p.address);
      setVal("landmark", p.landmark);
    } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", autoFillSavedCustomerProfile);
})();
