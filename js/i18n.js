// =========================================
// i18n — Internationalization Module
// =========================================
// Default language: English (en)
// Turkish content stays as original HTML.
// English translations are applied via data-i18n keys.

const translations = {
    en: {
        // Page title
        "page-title": "Asena & Turan UAV Team",

        // Navbar
        "nav-home": "Home",
        "nav-tech": "Capabilities",
        "nav-asena": "Asena UAV",
        "nav-turan": "Turan UAV",
        "nav-roadmap": "R&D",
        "nav-team": "Team",
        "nav-gallery": "Gallery",
        "nav-sponsorship": "Sponsorship",
        "nav-contact": "Contact",
        "nav-panel": "UAV Control Panel",

        // Hero
        "hero-title": "THE SKYPOWER OF TOMORROW",
        "hero-desc": "Founded at Aksaray University, our team develops indigenous unmanned aerial vehicles powered by autonomous flight systems, AI-driven image processing, and advanced engineering solutions.",
        "hero-cta": "EXPLORE SYSTEMS",

        // Stats
        "stat-label-1": "ACTIVE TEAM MEMBERS",
        "stat-label-2": "ORIGINAL UAV PROJECTS",
        "stat-label-3": "COMPETITION TARGETS",
        "stat-status": "// STATUS: IN PREPARATION //",
        "stat-disclaimer": "We are currently in the design and manufacturing phase, gearing up for the runway.",

        // Tech Section
        "tech-title": "TECHNICAL CAPABILITIES",
        "tech-1-title": "Autonomous Algorithms",
        "tech-1-desc": "Waypoint navigation and mission planning infrastructure.",
        "tech-2-title": "Image Processing (AI)",
        "tech-2-desc": "AI-powered object detection and autonomous target tracking.",
        "tech-3-title": "Aerodynamics",
        "tech-3-desc": "Advanced CFD analysis and wing optimization.",
        "tech-4-title": "Avionics",
        "tech-4-desc": "Flight control hardware and sensor integration.",
        "tech-5-title": "Embedded Software",
        "tech-5-desc": "Custom flight software and telemetry communication infrastructure.",

        // Asena UAV Section
        "asena-badge-1": "IMechE UAS (UK)",
        "asena-badge-2": "Teknofest",
        "asena-tab-specs": "PARAMETERS",
        "asena-tab-mission": "MISSION PROFILE",
        "asena-tab-comp": "COMPETITIONS",
        "asena-specs-title": "SYSTEM TECHNICAL DATA",
        "asena-spec-1-label": "Max. Takeoff Weight",
        "asena-spec-2-label": "Flight Duration",
        "asena-spec-2-value": "45 MIN",
        "asena-spec-3-label": "Cruise Speed",
        "asena-spec-3-value": "70 KM/H",
        "asena-spec-4-label": "Mission Range",
        "asena-spec-5-label": "Payload Capacity",
        "asena-spec-6-label": "Communication",
        "asena-mission-title": "CONCEPT & MISSION DEFINITION",
        "asena-mission-p1": "The Asena Unmanned Aerial Vehicle has been developed to perform autonomous payload delivery, moving object tracking, and wide-area surveillance missions in demanding operational environments. The core architecture of the system is built on a redundant flight control infrastructure capable of maintaining stable flight even in GPS-degraded environments.",
        "asena-mission-p2": "The airframe structure is manufactured from aviation-grade composite materials to balance lightweight and strength, maintaining aerodynamic stability even in high-wind conditions. The AI module is capable of making independent decisions during flight without reliance on the ground station.",
        "asena-comp-title": "MISSION & OBJECTIVES",
        "asena-comp-1-title": "IMechE UAS CHALLENGE (UK)",
        "asena-comp-1-desc": "In the UK-based IMechE UAS organization, one of the world's leading engineering competitions, the Asena UAV system is designed to demonstrate fully autonomous flight capabilities in challenging meteorological conditions and AI-powered precision object identification capacity.",
        "asena-comp-2-title": "TEKNOFEST INTERNATIONAL UAV",
        "asena-comp-2-desc": "In line with the national technology initiative vision at the Teknofest operational field, we demonstrate our competency to complete complex scenario targets (target coordinate detection, autonomous landing, water ball dropping) with zero human intervention.",

        // Turan UAV Section
        "turan-badge-1": "AUVSI SUAS (USA)",
        "turan-badge-2": "IMechE UAS",
        "turan-tab-specs": "PARAMETERS",
        "turan-tab-mission": "MISSION PROFILE",
        "turan-tab-comp": "COMPETITIONS",
        "turan-specs-title": "SYSTEM TECHNICAL DATA",
        "turan-spec-1-label": "Max. Takeoff Weight",
        "turan-spec-2-label": "Flight Duration",
        "turan-spec-2-value": "60 MIN",
        "turan-spec-3-label": "Cruise Speed",
        "turan-spec-3-value": "90 KM/H",
        "turan-spec-4-label": "Mission Range",
        "turan-spec-5-label": "Payload Capacity",
        "turan-spec-6-label": "Target Detection Mod.",
        "turan-mission-title": "CONCEPT & MISSION DEFINITION",
        "turan-mission-p1": "Turan UAV has been specifically designed for operational areas requiring strategic reconnaissance, high-speed surveillance, and heavy payload carrying capacity. The developed airframe structure enables high maneuverability while featuring aerodynamically optimized profiles that minimize wind resistance.",
        "turan-mission-p2": "The system can classify targets during flight, perform threat analysis, and provide uninterrupted critical image/data transmission to the ground control station through its onboard deep learning (ML) algorithms.",
        "turan-comp-title": "MISSION & OBJECTIVES",
        "turan-comp-1-title": "AUVSI SUAS (USA)",
        "turan-comp-1-desc": "At AUVSI SUAS, the world's most prestigious university-level autonomous systems competition, our system is designed to pass tests for autonomous obstacle avoidance, aerial target characterization, route planning, and precision deployment of payloads from high altitude.",
        "turan-comp-2-title": "GLOBAL ENGINEERING VISION",
        "turan-comp-2-desc": "Turan UAV goes beyond being merely a competition platform; it serves as an R&D testbed for subsystem (Avionics, Image Processing, Autopilot) technologies that can be integrated into the defense industry ecosystem.",

        // Roadmap
        "roadmap-title": "ENGINEERING ROADMAP",
        "roadmap-phase-1-title": "Concept & CFD Analysis",
        "roadmap-phase-1-desc": "Mission-driven aerodynamic preliminary design, Ansys flow simulations, and structural durability iterations in virtual environments.",
        "roadmap-phase-2-title": "Composite Airframe Manufacturing",
        "roadmap-phase-2-desc": "Airframe production using carbon fiber and fiberglass hybrid structures, optimized for weight-to-strength ratio at aviation standards.",
        "roadmap-phase-3-title": "Avionics & Software Integration",
        "roadmap-phase-3-desc": "Hardware and software integration of redundant flight control units, custom mission computers, and AI modules (target recognition) into the aircraft.",
        "roadmap-phase-4-title": "Field & Flight Tests",
        "roadmap-phase-4-desc": "Comprehensive ground tests (HIL/SIL), autonomous cruise algorithm verification, and full operational flight execution under international mission field (IMechE/Teknofest) conditions.",

        // Team
        "team-title": "ENGINEERING TEAM",
        "dept-captain": "// TEAM CAPTAIN",
        "dept-software": "// SOFTWARE TEAM",
        "dept-electronics": "// ELECTRICAL & ELECTRONICS TEAM",
        "dept-mechanical": "// MECHANICAL TEAM",
        "dept-management": "// MANAGEMENT",

        // Team Roles
        "role-captain": "General Team Captain",
        "role-sw-captain": "Software Captain",
        "role-sw-member": "Software Team",
        "role-ee-captain": "Electrical Electronics Captain",
        "role-ee-member": "Electrical/Electronics",
        "role-mech-captain": "Mechanical Captain",
        "role-mech-member": "Mechanical Team",
        "role-mgmt": "Management",

        // Team Descriptions
        "desc-ali": "Team strategy, project management, and autonomous systems lead. Image processing technologies specialist.",
        "desc-tolga": "Web-based API management panel, ground control station interface, and telemetry infrastructure developer.",
        "desc-berkay": "Telemetry interface development, autonomous flight systems, and C# desktop application developer.",
        "desc-sinan": "Autonomous flight algorithm development and advanced pathfinding specialist.",
        "desc-hakan": "General software development, system optimization, and team software infrastructure developer.",
        "desc-elif": "UAV sensor integration, signal processing, and avionics subsystem design specialist.",
        "desc-irem": "Power distribution systems, PCB design, and advanced avionics integration process manager.",
        "desc-samet-altun": "Electrical power systems, battery management (BMS), and wiring architecture (harness) developer.",
        "desc-samet-alkan": "UAV composite airframe production, structural mechanical assembly, and aerodynamic design specialist.",
        "desc-mete": "UAV composite airframe production, structural mechanical assembly, and aerodynamic design specialist.",
        "desc-caner": "UAV composite airframe production, structural mechanical assembly, and aerodynamic design specialist.",
        "desc-duygu": "Corporate communications, sponsorship management, project documentation, and general team coordinator.",

        // Gallery
        "gallery-title": "PHOTO GALLERY",
        "gallery-enlarge": "ENLARGE",

        // Sponsorship
        "sponsor-title": "BECOME OUR SPONSOR",
        "sponsor-desc": "Take your place in the national technology initiative by supporting our team developing the unmanned aerial vehicle technologies of the future.",
        "sponsor-cta": "[ SPONSORSHIP BROCHURE (PDF) ]",

        // Contact
        "contact-title": "CONTACT INFORMATION",
        "contact-subtitle-hq": "Operations Center",
        "contact-desc": "You can reach us through our communication channels for our engineering projects, endeavors, or sponsorship proposals.",
        "contact-email-label": "E-Mail Network",
        "contact-ig-label": "Instagram (Social)",
        "contact-loc-label": "Headquarters / Location",
        "contact-form-title": "Send System Message",
        "contact-form-name-label": "// FULL NAME",
        "contact-form-name-placeholder": "Your identity",
        "contact-form-email-label": "// E-MAIL",
        "contact-form-email-placeholder": "Return address",
        "contact-form-msg-label": "// MESSAGE CONTENT",
        "contact-form-msg-placeholder": "Enter data to be transmitted...",
        "contact-form-submit": "TRANSMIT DATA",

        // Footer
        "footer-desc": "An unmanned aerial vehicle team founded at Aksaray University, producing completely independent, high-technology-focused engineering solutions.",
        "footer-quick-title": "QUICK ACCESS",
        "footer-link-tech": "Technical Capabilities",
        "footer-link-asena": "Asena System Details",
        "footer-link-turan": "Turan System Details",
        "footer-link-roadmap": "Engineering Process",
        "footer-link-team": "Team Members",
        "footer-legal-title": "LEGAL / INFO",
        "footer-legal-1": "Privacy Policy (N/A)",
        "footer-legal-2": "Aksaray University Permissions",
        "footer-legal-3": "Request Sponsorship Booklet",
        "footer-copyright": "SYS_V2.0 // © 2026 TOLGA FİDAN. ALL RIGHTS RESERVED.",
    }
};

// Store original Turkish content
const originalContent = {};

function cacheTurkishContent() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            originalContent[key] = el.placeholder;
        } else {
            originalContent[key] = el.innerHTML;
        }
    });
    // Cache page title
    originalContent['page-title'] = document.title;
}

function setLanguage(lang) {
    const currentLang = lang || 'en';
    localStorage.setItem('asena-lang', currentLang);

    // Update html lang attribute
    document.documentElement.lang = currentLang === 'en' ? 'en' : 'tr';

    if (currentLang === 'en') {
        // Apply English translations
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations.en[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations.en[key];
                } else {
                    el.textContent = translations.en[key];
                }
            }
        });
        document.title = translations.en['page-title'];
    } else {
        // Restore Turkish content from cache
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (originalContent[key] !== undefined) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = originalContent[key];
                } else {
                    el.innerHTML = originalContent[key];
                }
            }
        });
        document.title = originalContent['page-title'];
    }

    // Update toggle button state
    updateLangToggle(currentLang);
}

function updateLangToggle(lang) {
    const btnTr = document.getElementById('lang-tr');
    const btnEn = document.getElementById('lang-en');
    if (btnTr && btnEn) {
        btnTr.classList.toggle('active', lang === 'tr');
        btnEn.classList.toggle('active', lang === 'en');
    }
}

function initI18n() {
    // Cache all Turkish content first
    cacheTurkishContent();

    // Always default to English
    const savedLang = localStorage.getItem('asena-lang') || 'en';
    setLanguage(savedLang);

    // Bind toggle buttons
    const btnTr = document.getElementById('lang-tr');
    const btnEn = document.getElementById('lang-en');

    if (btnTr) {
        btnTr.addEventListener('click', () => setLanguage('tr'));
    }
    if (btnEn) {
        btnEn.addEventListener('click', () => setLanguage('en'));
    }
}
