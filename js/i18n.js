// =========================================
// i18n — Internationalization Module
// =========================================
// Default language: English (en)
// Turkish content stays in index.html and is cached at boot.

const translations = {
    en: {
        "page-title": "Asena & Turan UAV Team",

        // Header & Drawer & Waypoints
        "nav-panel": "Control Panel",
        "nav-menu": "Menu",
        "drawer-kicker": "FLIGHT DIRECTORY // NAVIGATION",
        "drawer-grp-1": "01 // AERIAL PLATFORMS",
        "drawer-grp-2": "02 // SYSTEMS & R&D",
        "drawer-grp-3": "03 // TEAM & PARTNERSHIP",
        "nav-home": "Home",
        "nav-announcements": "Milestones",
        "nav-tech": "Technical Capabilities",
        "nav-asena": "Asena UAV (4 KG)",
        "nav-turan": "Turan UAV (10 KG)",
        "nav-gcs": "Ground Control Station",
        "nav-roadmap": "Engineering Roadmap",
        "nav-team": "Engineering Team",
        "nav-gallery": "Photo Gallery",
        "nav-sponsorship": "Sponsorship",
        "nav-contact": "Contact & Apply",
        "drawer-panel-cta": "Launch GCS Panel",
        "wp-hero": "Home",
        "wp-announcements": "Updates",
        "wp-tech": "Capabilities",
        "wp-asena": "Asena UAV",
        "wp-turan": "Turan UAV",
        "wp-gcs": "GCS Panel",
        "wp-roadmap": "Roadmap",
        "wp-team": "Team",
        "wp-gallery": "Gallery",
        "wp-sponsorship": "Sponsor",
        "wp-contact": "Contact",

        // Hero
        "hero-pill": "AKSARAY UNIVERSITY UAV TEAM",
        "hero-title": "THE SKYPOWER OF TOMORROW",
        "hero-desc": "Building indigenous UAVs with autonomous flight and AI-powered vision.",
        "hero-cta": "Explore UAV Systems",
        "hero-cta-secondary": "Sponsorship Dossier (PDF)",

        // Announcements
        "ann-title": "TEAM UPDATES",
        "ann-all": "Field Photos",
        "ann-1-tag": "FOUNDATION",
        "ann-1-title": "Founded at Aksaray University",
        "ann-2-tag": "PROTOTYPE & EXPO",
        "ann-2-title": "First fixed-wing prototype & campus showcases",
        "ann-3-tag": "ACTIVE R&D",
        "ann-3-title": "Teknofest & AUVSI SUAS preparations",

        // Technical Capabilities
        "tech-title": "TECHNICAL CAPABILITIES",
        "tech-1-title": "Autonomous Algorithms",
        "tech-2-title": "Image Processing (AI)",
        "tech-3-title": "Aerodynamics",
        "tech-4-title": "Avionics",
        "tech-5-title": "Embedded Software",

        // Asena UAV
        "asena-badge-1": "Teknofest",
        "asena-badge-2": "4 KG Class",
        "asena-view-iso": "ISOMETRIC",
        "asena-view-top": "TOP",
        "asena-view-side": "SIDE",
        "asena-view-bot": "BOTTOM",
        "asena-tab-specs": "PARAMETERS",
        "asena-tab-mission": "MISSION PROFILE",
        "asena-tab-comp": "OBJECTIVES",
        "asena-specs-title": "SYSTEM TECHNICAL DATA",
        "asena-spec-1-label": "Total Weight",
        "asena-spec-5-label": "Payload (1/4 Ratio)",
        "asena-spec-2-label": "Flight Endurance",
        "asena-spec-2-value": "35 MIN",
        "asena-spec-3-label": "Cruise Speed",
        "asena-spec-3-value": "55 KM/H",
        "asena-spec-4-label": "Mission Range",
        "asena-spec-6-label": "Communication",
        "asena-ratio-label": "PAYLOAD RATIO",
        "asena-mission-title": "CONCEPT & MISSION DEFINITION",
        "asena-mission-p1": "Asena is an agile 4 kg fixed-wing UAV carrying a 1 kg payload, designed for autonomous payload drops, target tracking and field surveillance.",
        "asena-comp-title": "MISSION & OBJECTIVES",
        "asena-comp-1-title": "TEKNOFEST INTERNATIONAL UAV",
        "asena-comp-1-desc": "Optimized to complete target detection, autonomous landing and precision payload drops without human intervention.",

        // Turan UAV
        "turan-badge-1": "AUVSI SUAS (USA)",
        "turan-badge-2": "10 KG Class",
        "turan-tab-specs": "PARAMETERS",
        "turan-tab-mission": "MISSION PROFILE",
        "turan-tab-comp": "OBJECTIVES",
        "turan-specs-title": "SYSTEM TECHNICAL DATA",
        "turan-spec-1-label": "Total Weight",
        "turan-spec-5-label": "Payload (1/4–1/3 Ratio)",
        "turan-spec-2-label": "Flight Endurance",
        "turan-spec-2-value": "55 MIN",
        "turan-spec-3-label": "Cruise Speed",
        "turan-spec-3-value": "75 KM/H",
        "turan-spec-4-label": "Mission Range",
        "turan-spec-6-label": "Target Detection",
        "turan-ratio-label": "PAYLOAD RATIO",
        "turan-mission-title": "CONCEPT & MISSION DEFINITION",
        "turan-mission-p1": "Turan is a 10 kg class UAV with a 2.5–3 kg modular payload, built for wide-area reconnaissance and AI-assisted target classification.",
        "turan-comp-title": "MISSION & OBJECTIVES",
        "turan-comp-1-title": "AUVSI SUAS (USA)",
        "turan-comp-1-desc": "Designed for autonomous obstacle avoidance, aerial target identification and precision payload delivery.",

        // Comparison Table
        "comp-title": "Asena & Turan Technical Comparison",
        "comp-col-param": "Parameter",
        "comp-row-1": "Total Weight Class",
        "comp-row-2": "Payload Capacity (1/4–1/3)",
        "comp-row-3": "Cruise Speed / Endurance",
        "comp-asena-perf": "55 km/h • 35 min",
        "comp-turan-perf": "75 km/h • 55 min",
        "comp-row-4": "Mission Range",
        "comp-row-5": "Primary Role & Target",
        "comp-asena-goal": "Agile Autonomous Mission & Teknofest",
        "comp-turan-goal": "Wide-Area Recon & AUVSI SUAS",

        // Ground Control Station
        "gcs-title": "CUSTOM GROUND CONTROL STATION",
        "gcs-desc": "Our in-house web-based ground control software: live map, artificial horizon and telemetry in one screen.",
        "gcs-feat-1": "Live map & flight trail",
        "gcs-feat-2": "Artificial horizon",
        "gcs-feat-3": "API console & demo mode",
        "gcs-cta": "Explore Live GCS Panel →",
        "gcs-badge": "DEMO READY",
        "gcs-tile-alt": "ALTITUDE",
        "gcs-tile-spd": "SPEED",
        "gcs-tile-bat": "BATTERY",
        "gcs-tile-gps": "GPS LOCK",

        // Roadmap
        "roadmap-title": "ENGINEERING ROADMAP",
        "roadmap-phase-1-title": "Concept & CFD Analysis",
        "roadmap-phase-1-desc": "Aerodynamic pre-design and flow simulations.",
        "roadmap-phase-2-title": "Composite Airframe Manufacturing",
        "roadmap-phase-2-desc": "Carbon fiber and fiberglass hybrid airframe production.",
        "roadmap-phase-3-title": "Avionics & Software Integration",
        "roadmap-phase-3-desc": "Integration of flight control, mission computer and AI modules.",
        "roadmap-phase-4-title": "Field & Flight Tests",
        "roadmap-phase-4-desc": "HIL/SIL testing and flights under Teknofest & AUVSI SUAS mission profiles.",

        // Team
        "team-title": "ENGINEERING TEAM",
        "dept-captain": "// TEAM CAPTAIN",
        "dept-software": "// SOFTWARE TEAM",
        "dept-electronics": "// ELECTRICAL & ELECTRONICS TEAM",
        "dept-mechanical": "// MECHANICAL TEAM",
        "dept-management": "// MANAGEMENT",
        "role-captain": "General Team Captain",
        "role-sw-captain": "Software Captain",
        "role-sw-member": "Software Team",
        "role-ee-captain": "Electrical Electronics Captain",
        "role-ee-member": "Electrical/Electronics",
        "role-mech-captain": "Mechanical Captain",
        "role-mech-member": "Mechanical Team",
        "role-mgmt": "Management",

        // Join Team Banner
        "join-title": "Want to Join Our Engineering Team?",
        "join-chip-sw": "Software",
        "join-chip-ee": "Electrical-Electronics",
        "join-chip-mech": "Mechanical",
        "join-chip-mgmt": "Management",

        // Gallery
        "gallery-title": "PHOTO GALLERY",
        "gal-filter-all": "All",
        "gal-filter-proto": "Prototype",
        "gal-filter-event": "Events & Expo",
        "gallery-enlarge": "ENLARGE",
        "gal-cap-1": "University Protocol Visit",
        "gal-cap-2": "Campus Technology Expo",
        "gal-cap-3": "Prototype Wing Review",
        "gal-cap-4": "Propulsion Briefing",
        "gal-cap-5": "Fixed-Wing Prototype & GCS",
        "gal-cap-6": "Asena UAV Team Presentation",

        // Sponsorship
        "sponsor-title": "BECOME OUR SPONSOR",
        "sponsor-desc": "Your support is an investment in tomorrow's engineers — your brand appears on our website, team apparel and UAVs.",
        "sponsor-cta": "Download Sponsorship Dossier (PDF)",
        "sponsor-cta-contact": "Send Partnership Inquiry",
        "support-areas-title": "SUPPORT CATEGORIES",
        "sup-1-title": "Electronic Components",
        "sup-2-title": "Composites & Materials",
        "sup-3-title": "3D Printing & CNC Machining",
        "sup-4-title": "Software Licenses",
        "sup-5-title": "Testing & Lab Support",
        "sup-6-title": "Logistics & Financial Aid",
        "partners-label": "INSTITUTIONAL STAKEHOLDERS & SUPPORTERS",
        "partner-1-name": "Aksaray University",
        "partner-1-role": "Academic Host Institution",
        "partner-2-name": "Entrepreneurship & R&D Ecosystem",
        "partner-2-role": "Technology & Exhibition Stakeholder",
        "partner-3-name": "+ Main Sponsor Slot",
        "partner-3-role": "Your Brand Can Be Featured Here",

        // Contact & Toast
        "contact-title": "CONTACT INFORMATION",
        "contact-subtitle-hq": "Operations Center",
        "contact-email-label": "E-Mail Network",
        "contact-ig-label": "Instagram (Social)",
        "contact-loc-label": "Headquarters / Location",
        "contact-form-title": "Send System Message",
        "contact-form-topic-label": "// INQUIRY TYPE",
        "topic-sponsorship": "Sponsorship Proposal",
        "topic-team": "Team Application",
        "topic-general": "General Inquiry / Collaboration",
        "contact-form-name-label": "// FULL NAME",
        "contact-form-name-placeholder": "Your full name",
        "contact-form-email-label": "// E-MAIL",
        "contact-form-email-placeholder": "Your reply email",
        "contact-form-msg-label": "// MESSAGE CONTENT",
        "contact-form-msg-placeholder": "Write your message here...",
        "contact-form-submit": "SEND MESSAGE",
        "toast-success-title": "Message Received",
        "toast-success-desc": "Your message has been recorded successfully. Our team will get back to you soon.",

        // Footer
        "footer-desc": "Aksaray University Unmanned Aerial Vehicle Team.",
        "footer-quick-title": "QUICK ACCESS",
        "footer-link-tech": "Technical Capabilities",
        "footer-link-asena": "Asena System Details",
        "footer-link-turan": "Turan System Details",
        "footer-link-gcs": "Ground Control Station",
        "footer-link-team": "Team Members",
        "footer-legal-title": "INSTITUTIONAL / INFO",
        "footer-legal-1": "Aksaray University UAV Team",
        "footer-legal-2": "UAV Control Panel",
        "footer-legal-3": "2026 Sponsorship Dossier (PDF)",
        "footer-copyright": "© 2026 ASENA UAV TEAM. ALL RIGHTS RESERVED."
    }
};

const originalContent = {};
let activeLang = 'en';

function cacheTurkishContent() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            originalContent[key] = el.placeholder;
        } else {
            originalContent[key] = el.textContent.trim();
        }
    });
    originalContent['page-title'] = document.title;
}

function setLanguage(lang) {
    const currentLang = lang === 'tr' ? 'tr' : 'en';
    activeLang = currentLang;
    localStorage.setItem('asena-lang', currentLang);
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = currentLang === 'en' ? translations.en[key] : originalContent[key];
        if (value === undefined) return;

        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = value;
        } else {
            el.textContent = value;
        }
    });

    document.title = currentLang === 'en'
        ? translations.en['page-title']
        : originalContent['page-title'];

    updateLangToggle(currentLang);
    if (typeof window.syncActiveSectorLabel === 'function') {
        window.syncActiveSectorLabel();
    }
}

function updateLangToggle(lang) {
    const btnTr = document.getElementById('lang-tr');
    const btnEn = document.getElementById('lang-en');
    if (btnTr && btnEn) {
        btnTr.classList.toggle('active', lang === 'tr');
        btnEn.classList.toggle('active', lang === 'en');
    }
}

function getCurrentLanguage() {
    return activeLang;
}

function initI18n() {
    cacheTurkishContent();

    // Keep English as the default on first visit
    const savedLang = localStorage.getItem('asena-lang') || 'en';
    setLanguage(savedLang);

    const btnTr = document.getElementById('lang-tr');
    const btnEn = document.getElementById('lang-en');

    if (btnTr) btnTr.addEventListener('click', () => setLanguage('tr'));
    if (btnEn) btnEn.addEventListener('click', () => setLanguage('en'));
}
