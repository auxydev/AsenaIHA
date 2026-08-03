/* =============================================
   Asena İHA — GCS Panel JavaScript
   ============================================= */

// ─── Theme Toggle (early init) ──────────────────
(function initTheme() {
    const saved = localStorage.getItem('asena-theme');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();

// ─── Data Store (localStorage) ──────────────────
const STORAGE_KEYS = {
    settings: 'asena_gcs_settings',
    logs: 'asena_gcs_logs',
    stats: 'asena_gcs_stats'
};

function loadData(key) {
    try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; }
}
function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
function getSettings() { return loadData(STORAGE_KEYS.settings) || { dataUrl: '', pollInterval: 1000 }; }
function getLogs() { return loadData(STORAGE_KEYS.logs) || []; }
function setLogs(list) { saveData(STORAGE_KEYS.logs, list); }

// ─── State ──────────────────────────────────────
let isConnected = false;
let pollTimer = null;
let uptimeTimer = null;
let uptimeSeconds = 0;
let map = null;
let uavMarker = null;
let homeMarker = null;
let flightPath = null;
let pathCoords = [];
let requestCount = 0;
let simulationMode = true;
let simAngle = 0;

// Telemetry data model
let telemetry = {
    lat: 39.7767, lon: 32.8560,  // Default: Turkey center
    alt: 0, relAlt: 0,
    groundSpeed: 0, airSpeed: 0, verticalSpeed: 0,
    heading: 0,
    pitch: 0, roll: 0, yaw: 0,
    battery: 100, voltage: 12.6, current: 0,
    gps_satellites: 0, gps_fix: 0,
    rssi: 0,
    mode: 'STABILIZE',
    armed: false
};

// ─── Page Navigation ────────────────────────────
const pages = {
    dashboard: 'Dashboard',
    telemetry: 'Detaylı Telemetri',
    control: 'Uçuş Kontrol',
    api: 'API Komut Paneli',
    logs: 'İstek Logları'
};

function showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const target = document.getElementById('page-' + name);
    if (target) target.style.display = 'block';
    document.getElementById('pageTitle').textContent = pages[name] || name;

    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    const link = document.querySelector(`.sidebar-nav a[data-page="${name}"]`);
    if (link) link.classList.add('active');

    if (name === 'dashboard' && map) setTimeout(() => map.invalidateSize(), 100);
    if (name === 'logs') renderLogs();
}

document.querySelectorAll('.sidebar-nav a[data-page]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        showPage(a.dataset.page);
    });
});

// Sidebar toggle for mobile
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

function checkMobile() {
    if (window.innerWidth <= 768) {
        sidebarToggle.style.display = 'flex';
    } else {
        sidebarToggle.style.display = 'none';
        sidebar.classList.remove('open');
    }
}
checkMobile();
window.addEventListener('resize', () => {
    checkMobile();
    if (map) map.invalidateSize();
});

sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));

// ─── Clock & Uptime ────────────────────────────
function updateClock() {
    const now = new Date();
    document.getElementById('liveClock').textContent = now.toLocaleTimeString('tr-TR');
}

function updateUptime() {
    uptimeSeconds++;
    const h = String(Math.floor(uptimeSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((uptimeSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(uptimeSeconds % 60).padStart(2, '0');
    document.getElementById('uptime').textContent = `${h}:${m}:${s}`;
}

setInterval(updateClock, 1000);
updateClock();

// ─── Map Init ───────────────────────────────────
function initMap() {
    map = L.map('map', {
        center: [telemetry.lat, telemetry.lon],
        zoom: 16,
        zoomControl: true,
        attributionControl: false
    });

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
    }).addTo(map);

    // UAV marker
    const uavIcon = L.divIcon({
        className: 'uav-icon',
        html: '✈️',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    uavMarker = L.marker([telemetry.lat, telemetry.lon], { icon: uavIcon }).addTo(map);
    uavMarker.bindPopup('<b>Asena İHA</b><br>Konum takibi aktif');

    // Home marker
    const homeIcon = L.divIcon({
        className: 'home-icon',
        html: '🏠',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    homeMarker = L.marker([telemetry.lat, telemetry.lon], { icon: homeIcon }).addTo(map);
    homeMarker.bindPopup('<b>Kalkış Noktası</b>');

    // Flight path polyline
    flightPath = L.polyline([], {
        color: '#06b6d4',
        weight: 2,
        opacity: 0.7,
        dashArray: '5, 8'
    }).addTo(map);
}

function centerMap() {
    if (map && uavMarker) {
        map.setView(uavMarker.getLatLng(), 17);
    }
}

function clearPath() {
    pathCoords = [];
    if (flightPath) flightPath.setLatLngs([]);
    showToast('Uçuş izi temizlendi.', 'info');
}

// ─── Connection ─────────────────────────────────
function toggleConnection() {
    if (isConnected) {
        disconnect();
    } else {
        connect();
    }
}

function connect() {
    const url = document.getElementById('dataSourceUrl').value.trim();

    if (!url) {
        showToast('Lütfen bir veri kaynağı URL\'si girin veya Demo modunu kullanın.', 'warning');
        return;
    }

    simulationMode = false;
    const settings = getSettings();
    settings.dataUrl = url;
    saveData(STORAGE_KEYS.settings, settings);

    isConnected = true;
    uptimeSeconds = 0;
    uptimeTimer = setInterval(updateUptime, 1000);

    document.getElementById('connectionDot').classList.add('connected');
    const btn = document.getElementById('connectBtn');
    btn.innerHTML = '<i class="fas fa-unlink"></i> Kes';
    btn.classList.add('connected');
    document.getElementById('demoBtn').style.display = 'none';

    startPolling();

    addLog('SYS', 'Bağlantı kuruldu', 'OK', 0);
    showToast('Bağlantı başarılı!', 'success');
}

function startDemo() {
    if (isConnected) {
        showToast('Önce mevcut bağlantıyı kesin.', 'warning');
        return;
    }

    simulationMode = true;
    isConnected = true;
    uptimeSeconds = 0;
    uptimeTimer = setInterval(updateUptime, 1000);

    document.getElementById('connectionDot').classList.add('connected');
    const btn = document.getElementById('connectBtn');
    btn.innerHTML = '<i class="fas fa-unlink"></i> Kes';
    btn.classList.add('connected');
    document.getElementById('demoBtn').style.display = 'none';

    startSimulation();

    addLog('SYS', 'Demo modu başlatıldı (Simülasyon)', 'OK', 0);
    showToast('Demo modu başlatıldı — Simülasyon verileri üretiliyor.', 'info');
}

function disconnect() {
    isConnected = false;
    if (pollTimer) clearInterval(pollTimer);
    if (uptimeTimer) clearInterval(uptimeTimer);
    pollTimer = null;
    uptimeTimer = null;

    document.getElementById('connectionDot').classList.remove('connected');
    const btn = document.getElementById('connectBtn');
    btn.innerHTML = '<i class="fas fa-link"></i> Bağlan';
    btn.classList.remove('connected');
    document.getElementById('demoBtn').style.display = '';

    addLog('SYS', 'Bağlantı kesildi', 'OK', 0);
    showToast('Bağlantı kesildi.', 'info');
}

// ─── Data Polling ───────────────────────────────
function startPolling() {
    fetchTelemetry();
    pollTimer = setInterval(fetchTelemetry, 1000);
}

async function fetchTelemetry() {
    const url = document.getElementById('dataSourceUrl').value.trim();
    if (!url) return;

    const startTime = performance.now();
    try {
        const response = await fetch(url);
        const elapsed = Math.round(performance.now() - startTime);
        const data = await response.json();

        // Map response data to telemetry (flexible mapping)
        parseTelemetryData(data);
        updateAllUI();
        requestCount++;

    } catch (err) {
        const elapsed = Math.round(performance.now() - startTime);
        console.warn('Telemetry fetch error:', err.message);
        // Show first error as toast so user knows something is wrong
        if (requestCount === 0) {
            const hint = err.message.includes('Failed to fetch')
                ? ' — CORS veya ağ hatası olabilir. Sunucuda CORS aktif mi?'
                : '';
            showToast(`Veri alınamadı: ${err.message}${hint}`, 'error');
        }
    }
}

function parseTelemetryData(data) {
    // ─── MAVLink nested format (ATTITUDE, VFR_HUD, GLOBAL_POSITION_INT, HEARTBEAT) ───
    if (data.GLOBAL_POSITION_INT || data.ATTITUDE || data.VFR_HUD || data.HEARTBEAT) {

        // ATTITUDE → pitch, roll, yaw (radians → degrees)
        const att = data.ATTITUDE;
        if (att) {
            if (att.pitch != null) telemetry.pitch = att.pitch * (180 / Math.PI);
            if (att.roll != null) telemetry.roll = att.roll * (180 / Math.PI);
            if (att.yaw != null) {
                telemetry.yaw = att.yaw * (180 / Math.PI);
                if (telemetry.yaw < 0) telemetry.yaw += 360;
                telemetry.heading = telemetry.yaw;
            }
        }

        // VFR_HUD → airspeed, groundspeed, alt, climb
        const vfr = data.VFR_HUD;
        if (vfr) {
            if (vfr.airspeed != null) telemetry.airSpeed = vfr.airspeed;
            if (vfr.groundspeed != null) telemetry.groundSpeed = vfr.groundspeed;
            if (vfr.alt != null) telemetry.alt = vfr.alt;
            if (vfr.climb != null) telemetry.verticalSpeed = vfr.climb;
            if (vfr.heading != null) telemetry.heading = vfr.heading;
        }

        // GLOBAL_POSITION_INT → lat, lon, alt, rel_alt, vx, vy, vz
        const gpi = data.GLOBAL_POSITION_INT;
        if (gpi) {
            if (gpi.lat != null) telemetry.lat = gpi.lat;
            if (gpi.lon != null) telemetry.lon = gpi.lon;
            if (gpi.rel_alt != null) telemetry.relAlt = gpi.rel_alt;
            // If GLOBAL_POSITION_INT.alt is present and VFR_HUD.alt wasn't, use it
            if (gpi.alt != null && !(vfr && vfr.alt != null)) telemetry.alt = gpi.alt;
            // vx/vy/vz are typically cm/s in MAVLink → convert to m/s
            if (gpi.vx != null && gpi.vy != null) {
                const gsFromGPI = Math.sqrt(gpi.vx * gpi.vx + gpi.vy * gpi.vy) / 100;
                if (!(vfr && vfr.groundspeed != null)) telemetry.groundSpeed = gsFromGPI;
            }
            if (gpi.vz != null && !(vfr && vfr.climb != null)) {
                telemetry.verticalSpeed = gpi.vz / 100;
            }
            if (gpi.hdg != null) telemetry.heading = gpi.hdg / 100;
        }

        // HEARTBEAT → armed, mode (if your parser provides these fields)
        const hb = data.HEARTBEAT;
        if (hb) {
            if (hb.base_mode != null) telemetry.armed = !!(hb.base_mode & 128);
            if (hb.custom_mode != null) telemetry.mode = hb.custom_mode;
            if (hb.mode != null) telemetry.mode = hb.mode;
            if (hb.armed != null) telemetry.armed = hb.armed;
        }

        return;
    }

    // ─── Flat JSON format (fallback) ───
    const d = data;
    telemetry.lat = d.lat ?? d.latitude ?? d.location?.lat ?? telemetry.lat;
    telemetry.lon = d.lon ?? d.lng ?? d.longitude ?? d.location?.lon ?? d.location?.lng ?? telemetry.lon;
    telemetry.alt = d.alt ?? d.altitude ?? d.position?.alt ?? telemetry.alt;
    telemetry.relAlt = d.relAlt ?? d.relative_altitude ?? d.rel_alt ?? telemetry.relAlt;
    telemetry.groundSpeed = d.groundSpeed ?? d.ground_speed ?? d.gs ?? d.speed ?? telemetry.groundSpeed;
    telemetry.airSpeed = d.airSpeed ?? d.air_speed ?? d.as ?? telemetry.airSpeed;
    telemetry.verticalSpeed = d.verticalSpeed ?? d.vertical_speed ?? d.vs ?? d.vspeed ?? telemetry.verticalSpeed;
    telemetry.heading = d.heading ?? d.hdg ?? d.yaw ?? telemetry.heading;
    telemetry.pitch = d.pitch ?? d.attitude?.pitch ?? telemetry.pitch;
    telemetry.roll = d.roll ?? d.attitude?.roll ?? telemetry.roll;
    telemetry.yaw = d.yaw ?? d.attitude?.yaw ?? telemetry.yaw;
    telemetry.battery = d.battery ?? d.batt ?? d.battery_remaining ?? telemetry.battery;
    telemetry.voltage = d.voltage ?? d.volt ?? d.battery_voltage ?? telemetry.voltage;
    telemetry.current = d.current ?? d.amp ?? d.battery_current ?? telemetry.current;
    telemetry.gps_satellites = d.satellites ?? d.gps_satellites ?? d.sat ?? d.numSat ?? telemetry.gps_satellites;
    telemetry.gps_fix = d.gps_fix ?? d.fix_type ?? d.gpsFix ?? telemetry.gps_fix;
    telemetry.rssi = d.rssi ?? d.signal ?? telemetry.rssi;
    telemetry.mode = d.mode ?? d.flight_mode ?? d.flightMode ?? telemetry.mode;
    telemetry.armed = d.armed ?? d.is_armed ?? d.isArmed ?? telemetry.armed;
}

// ─── Simulation ─────────────────────────────────
function startSimulation() {
    pollTimer = setInterval(simulationTick, 800);
}

function simulationTick() {
    simAngle += 2;
    const rad = (simAngle * Math.PI) / 180;

    // Simulate circular flight pattern
    const centerLat = 39.7767;
    const centerLon = 32.8560;
    const radius = 0.003;

    telemetry.lat = centerLat + radius * Math.cos(rad);
    telemetry.lon = centerLon + radius * Math.sin(rad);
    telemetry.alt = 50 + 10 * Math.sin(rad * 0.5);
    telemetry.relAlt = telemetry.alt;
    telemetry.groundSpeed = 8 + 2 * Math.sin(rad);
    telemetry.airSpeed = telemetry.groundSpeed + 1.5;
    telemetry.verticalSpeed = 2 * Math.cos(rad * 0.5);
    telemetry.heading = ((simAngle + 90) % 360);
    telemetry.pitch = 5 * Math.sin(rad * 2);
    telemetry.roll = 15 * Math.sin(rad);
    telemetry.yaw = telemetry.heading;
    telemetry.battery = Math.max(20, 100 - (simAngle * 0.05));
    telemetry.voltage = 10.5 + (telemetry.battery / 100) * 2.1;
    telemetry.current = 8 + 4 * Math.abs(Math.sin(rad));
    telemetry.gps_satellites = 12 + Math.floor(3 * Math.sin(rad * 0.3));
    telemetry.gps_fix = 3;
    telemetry.rssi = 85 + Math.floor(10 * Math.sin(rad * 0.7));
    telemetry.mode = 'AUTO';
    telemetry.armed = true;

    requestCount++;
    updateAllUI();
}

// ─── UI Update ──────────────────────────────────
function updateAllUI() {
    updateDashboardStats();
    updateMap();
    updateAttitude();
    updateQuickTelemetry();
    updateFullTelemetry();
}

function flashElement(el) {
    el.classList.remove('data-flash');
    void el.offsetWidth;
    el.classList.add('data-flash');
}

function updateDashboardStats() {
    const altEl = document.getElementById('statAltitude');
    const speedEl = document.getElementById('statSpeed');
    const headEl = document.getElementById('statHeading');
    const battEl = document.getElementById('statBattery');
    const gpsEl = document.getElementById('statGPS');
    const modeEl = document.getElementById('statMode');

    altEl.innerHTML = `${Math.round(telemetry.alt)}<span class="stat-unit">m</span>`;
    speedEl.innerHTML = `${telemetry.groundSpeed.toFixed(1)}<span class="stat-unit">m/s</span>`;
    headEl.innerHTML = `${Math.round(telemetry.heading)}<span class="stat-unit">°</span>`;
    battEl.innerHTML = `${Math.round(telemetry.battery)}<span class="stat-unit">%</span>`;
    gpsEl.innerHTML = `${telemetry.gps_satellites}<span class="stat-unit">sat</span>`;
    modeEl.textContent = telemetry.mode;

    // Progress bars
    document.getElementById('altBar').style.width = Math.min(100, (telemetry.alt / 120) * 100) + '%';
    document.getElementById('speedBar').style.width = Math.min(100, (telemetry.groundSpeed / 30) * 100) + '%';
    document.getElementById('headBar').style.width = (telemetry.heading / 360) * 100 + '%';
    document.getElementById('battBar').style.width = telemetry.battery + '%';
    document.getElementById('gpsBar').style.width = Math.min(100, (telemetry.gps_satellites / 20) * 100) + '%';

    // Battery color
    const battBar = document.getElementById('battBar');
    if (telemetry.battery < 20) {
        battBar.style.background = 'var(--danger)';
    } else if (telemetry.battery < 40) {
        battBar.style.background = 'var(--warning)';
    } else {
        battBar.style.background = '';
    }
}

function updateMap() {
    if (!map || !uavMarker) return;

    const latlng = [telemetry.lat, telemetry.lon];
    uavMarker.setLatLng(latlng);

    // Rotate UAV icon based on heading
    const iconEl = uavMarker.getElement();
    if (iconEl) {
        iconEl.style.transform = iconEl.style.transform.replace(/rotate\([^)]*\)/, '') + ` rotate(${telemetry.heading}deg)`;
    }

    // Update path
    pathCoords.push(latlng);
    if (pathCoords.length > 500) pathCoords.shift();
    flightPath.setLatLngs(pathCoords);

    // Update overlay info
    document.getElementById('mapLat').textContent = telemetry.lat.toFixed(6);
    document.getElementById('mapLon').textContent = telemetry.lon.toFixed(6);
    document.getElementById('mapAlt').textContent = Math.round(telemetry.alt);
}

function updateAttitude() {
    const pitchOffset = telemetry.pitch * 1.5; // Scale for visual
    const rollAngle = telemetry.roll;

    const sky = document.getElementById('attitudeSky');
    const ground = document.getElementById('attitudeGround');

    if (sky && ground) {
        sky.style.transform = `translateY(${pitchOffset}px) rotate(${rollAngle}deg)`;
        ground.style.transform = `translateY(${pitchOffset}px) rotate(${rollAngle}deg)`;
    }

    document.getElementById('attPitch').textContent = telemetry.pitch.toFixed(1) + '°';
    document.getElementById('attRoll').textContent = telemetry.roll.toFixed(1) + '°';
    document.getElementById('attYaw').textContent = telemetry.yaw.toFixed(1) + '°';
}

function updateQuickTelemetry() {
    document.getElementById('tLat').textContent = telemetry.lat.toFixed(6);
    document.getElementById('tLon').textContent = telemetry.lon.toFixed(6);
    document.getElementById('tVSpeed').innerHTML = `${telemetry.verticalSpeed.toFixed(1)} <small>m/s</small>`;
    document.getElementById('tGSpeed').innerHTML = `${telemetry.groundSpeed.toFixed(1)} <small>m/s</small>`;
    document.getElementById('tVolt').innerHTML = `${telemetry.voltage.toFixed(1)} <small>V</small>`;
    document.getElementById('tCurrent').innerHTML = `${telemetry.current.toFixed(1)} <small>A</small>`;
    document.getElementById('tRSSI').innerHTML = `${telemetry.rssi} <small>%</small>`;

    const armedEl = document.getElementById('tArmed');
    armedEl.textContent = telemetry.armed ? 'EVET' : 'HAYIR';
    armedEl.className = 'telem-value armed-status' + (telemetry.armed ? ' armed' : '');
}

function updateFullTelemetry() {
    // Only update if telemetry page is visible
    const page = document.getElementById('page-telemetry');
    if (page.style.display === 'none') return;

    document.getElementById('tfLat').textContent = telemetry.lat.toFixed(6);
    document.getElementById('tfLon').textContent = telemetry.lon.toFixed(6);
    document.getElementById('tfAlt').textContent = Math.round(telemetry.alt) + ' m';
    document.getElementById('tfRelAlt').textContent = Math.round(telemetry.relAlt) + ' m';
    document.getElementById('tfGS').textContent = telemetry.groundSpeed.toFixed(1) + ' m/s';
    document.getElementById('tfAS').textContent = telemetry.airSpeed.toFixed(1) + ' m/s';
    document.getElementById('tfVS').textContent = telemetry.verticalSpeed.toFixed(1) + ' m/s';
    document.getElementById('tfHead').textContent = Math.round(telemetry.heading) + '°';
    document.getElementById('tfPitch').textContent = telemetry.pitch.toFixed(1) + '°';
    document.getElementById('tfRoll').textContent = telemetry.roll.toFixed(1) + '°';
    document.getElementById('tfYaw').textContent = telemetry.yaw.toFixed(1) + '°';
    document.getElementById('tfBatt').textContent = Math.round(telemetry.battery) + ' %';
    document.getElementById('tfVolt').textContent = telemetry.voltage.toFixed(1) + ' V';
    document.getElementById('tfCur').textContent = telemetry.current.toFixed(1) + ' A';
    document.getElementById('tfSat').textContent = telemetry.gps_satellites;
    document.getElementById('tfFix').textContent = telemetry.gps_fix >= 3 ? '3D Fix' : telemetry.gps_fix >= 2 ? '2D Fix' : 'Yok';
    document.getElementById('tfRSSI').textContent = telemetry.rssi + ' %';
    document.getElementById('tfMode').textContent = telemetry.mode;
    document.getElementById('tfArmed').textContent = telemetry.armed ? 'EVET' : 'HAYIR';

    const h = String(Math.floor(uptimeSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((uptimeSeconds % 3600) / 60)).padStart(2, '0');
    document.getElementById('tfUptime').textContent = `${h}:${m}`;
}

// ─── Control Commands ───────────────────────────
async function sendCommand(command) {
    const url = document.getElementById('dataSourceUrl').value.trim();

    if (command === 'emergency_stop') {
        if (!confirm('⚠️ ACİL DURDURMA komutu gönderilecek! Motorlar kesilecek. Emin misiniz?')) return;
    }

    const payload = { command: command, timestamp: new Date().toISOString() };

    if (simulationMode || !url) {
        // Simulation mode — just show the command
        handleSimulatedCommand(command);
        addLog('CMD', command.toUpperCase(), 'SIM', 0);
        showToast(`Komut gönderildi: ${command.toUpperCase()}`, 'success');
        return;
    }

    const startTime = performance.now();
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const elapsed = Math.round(performance.now() - startTime);
        addLog('CMD', `POST ${command.toUpperCase()}`, response.status, elapsed);
        showToast(`Komut gönderildi: ${command.toUpperCase()} (${response.status})`, response.ok ? 'success' : 'warning');
    } catch (err) {
        const elapsed = Math.round(performance.now() - startTime);
        addLog('CMD', `POST ${command.toUpperCase()}`, 'ERR', elapsed);
        showToast(`Komut hatası: ${err.message}`, 'error');
    }
}

function handleSimulatedCommand(cmd) {
    switch (cmd) {
        case 'arm': telemetry.armed = true; telemetry.mode = 'STABILIZE'; break;
        case 'disarm': telemetry.armed = false; break;
        case 'takeoff': telemetry.mode = 'GUIDED'; break;
        case 'land': telemetry.mode = 'LAND'; break;
        case 'rtl': telemetry.mode = 'RTL'; break;
        case 'loiter': telemetry.mode = 'LOITER'; break;
        case 'auto': telemetry.mode = 'AUTO'; break;
        case 'guided': telemetry.mode = 'GUIDED'; break;
        case 'stabilize': telemetry.mode = 'STABILIZE'; break;
        case 'emergency_stop': telemetry.armed = false; telemetry.mode = 'EMERGENCY'; break;
    }
    updateAllUI();
}

async function setParam(param, value) {
    const url = document.getElementById('dataSourceUrl').value.trim();
    const payload = { param: param, value: parseFloat(value), timestamp: new Date().toISOString() };

    if (simulationMode || !url) {
        addLog('CMD', `SET ${param}=${value}`, 'SIM', 0);
        showToast(`Parametre ayarlandı: ${param} = ${value}`, 'success');
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        addLog('CMD', `SET ${param}=${value}`, response.status, 0);
        showToast(`Parametre ayarlandı: ${param} = ${value}`, response.ok ? 'success' : 'warning');
    } catch (err) {
        showToast(`Parametre hatası: ${err.message}`, 'error');
    }
}

// ─── API Command Panel ─────────────────────────
function switchApiTab(btn, tab) {
    document.querySelectorAll('.tester-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-api-headers').style.display = tab === 'api-headers' ? 'block' : 'none';
    document.getElementById('tab-api-body').style.display = tab === 'api-body' ? 'block' : 'none';
}

async function sendApiRequest() {
    const method = document.getElementById('apiMethod').value;
    const url = document.getElementById('apiUrl').value.trim();
    const headersRaw = document.getElementById('apiHeaders').value.trim();
    const bodyRaw = document.getElementById('apiBody').value.trim();

    if (!url) {
        showToast('Lütfen bir URL girin.', 'error');
        return;
    }

    const container = document.getElementById('apiResponse');
    container.style.display = 'block';
    container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);"><i class="fas fa-spinner fa-spin"></i> İstek gönderiliyor...</div>';

    let headers = {};

    if (headersRaw) {
        try {
            headers = { ...headers, ...JSON.parse(headersRaw) };
        } catch {
            showToast('Headers JSON formatında olmalıdır.', 'error');
            container.innerHTML = '';
            container.style.display = 'none';
            return;
        }
    }

    const fetchOptions = { method, headers };
    if (['POST', 'PUT', 'PATCH'].includes(method) && bodyRaw) {
        fetchOptions.body = bodyRaw;
        if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
    }

    const startTime = performance.now();
    try {
        const response = await fetch(url, fetchOptions);
        const elapsed = Math.round(performance.now() - startTime);

        let responseText;
        const contentType = response.headers.get('Content-Type') || '';
        if (contentType.includes('json')) {
            const json = await response.json();
            responseText = JSON.stringify(json, null, 2);
        } else {
            responseText = await response.text();
        }

        const statusClass = response.status < 300 ? 's2xx' : response.status < 400 ? 's3xx' : response.status < 500 ? 's4xx' : 's5xx';

        container.innerHTML = `
            <div class="response-header">
                <div class="response-status">
                    <span class="status-code ${statusClass}">${response.status} ${response.statusText}</span>
                    <span class="response-time">${elapsed}ms</span>
                </div>
            </div>
            <div class="response-body">${escapeHTML(responseText)}</div>
        `;

        addLog(method, url, response.status, elapsed);

    } catch (err) {
        const elapsed = Math.round(performance.now() - startTime);
        container.innerHTML = `
            <div class="response-header">
                <div class="response-status">
                    <span class="status-code s5xx">Hata</span>
                    <span class="response-time">${elapsed}ms</span>
                </div>
            </div>
            <div class="response-body" style="color:var(--danger);">${escapeHTML(err.message)}\n\nNot: CORS kısıtlaması veya ağ hatası olabilir.</div>
        `;
        addLog(method, url, 'ERR', elapsed);
    }
}

// ─── Logs ───────────────────────────────────────
function addLog(method, url, status, time) {
    const logs = getLogs();
    logs.unshift({
        id: generateId(),
        method, url, status, time,
        timestamp: new Date().toISOString()
    });
    if (logs.length > 200) logs.length = 200;
    setLogs(logs);
}

function renderLogs() {
    const logs = getLogs();
    const container = document.getElementById('logList');
    if (logs.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-scroll"></i><p>Henüz log kaydı yok.</p></div>';
        return;
    }

    container.innerHTML = logs.map(log => {
        const methodClass = log.method.toLowerCase();
        const statusClass = typeof log.status === 'number'
            ? (log.status < 300 ? 's2xx' : log.status < 400 ? 's3xx' : log.status < 500 ? 's4xx' : 's5xx')
            : (log.status === 'OK' || log.status === 'SIM' ? 's2xx' : 's5xx');

        const timeStr = new Date(log.timestamp).toLocaleTimeString('tr-TR');
        return `
            <div class="log-item">
                <span class="log-timestamp">${timeStr}</span>
                <span class="log-method ${methodClass}">${log.method}</span>
                <span class="log-url">${escapeHTML(log.url)}</span>
                <span class="log-status status-code ${statusClass}">${log.status}</span>
                <span class="log-time">${log.time}ms</span>
            </div>
        `;
    }).join('');
}

function clearLogs() {
    if (confirm('Tüm loglar silinsin mi?')) {
        setLogs([]);
        renderLogs();
        showToast('Loglar temizlendi.', 'info');
    }
}

// ─── Toast ──────────────────────────────────────
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: 'check-circle', error: 'times-circle', info: 'info-circle', warning: 'exclamation-triangle' };
    toast.innerHTML = `<i class="fas fa-${icons[type] || 'info-circle'}"></i> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ─── Helpers ────────────────────────────────────
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ─── Init ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initMap();

    // Restore saved URL
    const settings = getSettings();
    if (settings.dataUrl) {
        document.getElementById('dataSourceUrl').value = settings.dataUrl;
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('asena-theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('asena-theme', 'dark');
            }
        });
    }
});
