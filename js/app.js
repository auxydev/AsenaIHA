document.addEventListener('DOMContentLoaded', () => {
    const waypointDots = Array.from(document.querySelectorAll('.waypoint-dot'));
    const sectorCodeEl = document.getElementById('sectorCode');
    const sectorLabelEl = document.getElementById('sectorLabel');

    window.syncActiveSectorLabel = function () {
        const activeDot = document.querySelector('.waypoint-dot.active') || waypointDots[0];
        if (!activeDot) return;
        const label = activeDot.querySelector('.waypoint-label');
        if (sectorCodeEl && activeDot.dataset.code) sectorCodeEl.textContent = activeDot.dataset.code;
        if (sectorLabelEl && label) sectorLabelEl.textContent = label.textContent.trim();
    };

    // 1. Initialize i18n (defaults to English on first load)
    if (typeof initI18n === 'function') {
        initI18n();
    }
    window.syncActiveSectorLabel();

    // 2. Scroll & section-aware minimal aerospace navbar
    const navbar = document.getElementById('navbar');
    const heroSection = document.getElementById('hero');
    function updateNavbarState() {
        if (!navbar) return;
        const scrolledPast = window.scrollY > 40 || document.documentElement.scrollTop > 40;
        const heroOutOfView = heroSection ? heroSection.getBoundingClientRect().bottom <= 80 : false;
        navbar.classList.toggle('scrolled', scrolledPast || heroOutOfView);
    }
    updateNavbarState();
    window.addEventListener('scroll', updateNavbarState, { passive: true });
    window.addEventListener('load', updateNavbarState);
    window.addEventListener('hashchange', updateNavbarState);

    if ('IntersectionObserver' in window && heroSection && navbar) {
        const heroNavObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    navbar.classList.add('scrolled');
                } else {
                    updateNavbarState();
                }
            });
        }, { threshold: 0.05 });
        heroNavObserver.observe(heroSection);
    }

    // 3. Slide-out navigation drawer
    const menuToggle = document.getElementById('menuToggle');
    const navDrawer = document.getElementById('navDrawer');
    const drawerBackdrop = document.getElementById('drawerBackdrop');
    const drawerClose = document.getElementById('drawerClose');

    function setDrawerOpen(isOpen) {
        if (!navDrawer || !drawerBackdrop || !menuToggle) return;
        navDrawer.classList.toggle('open', isOpen);
        drawerBackdrop.classList.toggle('open', isOpen);
        navDrawer.setAttribute('aria-hidden', String(!isOpen));
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    if (menuToggle) menuToggle.addEventListener('click', () => setDrawerOpen(true));
    if (drawerClose) drawerClose.addEventListener('click', () => setDrawerOpen(false));
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', () => setDrawerOpen(false));

    document.querySelectorAll('.drawer-link').forEach(link => {
        link.addEventListener('click', () => setDrawerOpen(false));
    });

    // 4. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            e.preventDefault();
            const navHeight = navbar ? navbar.offsetHeight : 0;
            const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 8;

            window.scrollTo({
                top: Math.max(0, targetTop),
                behavior: 'smooth'
            });
        });
    });

    // 5. Right-edge diamond waypoint tracking + top bar sector readout sync
    const trackedSections = waypointDots
        .map(dot => document.getElementById(dot.dataset.section))
        .filter(Boolean);

    if ('IntersectionObserver' in window && trackedSections.length > 0) {
        const waypointObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    waypointDots.forEach(dot => {
                        dot.classList.toggle('active', dot.dataset.section === id);
                    });
                    window.syncActiveSectorLabel();
                }
            });
        }, { rootMargin: '-40% 0px -45% 0px', threshold: 0 });

        trackedSections.forEach(sec => waypointObserver.observe(sec));
    }

    // 6. Content visibility (no hidden reveal traps)
    const revealSelectors = '.flightlog-entry, .tech-cell, .uav-grid, .comparison-block, .gcs-grid, .roadmap-item, .team-card, .join-team-banner, .gallery-item, .support-card';
    document.querySelectorAll(revealSelectors).forEach(el => {
        el.classList.add('reveal-target');
    });

    // 7. Tab switching for Asena & Turan UAV panels
    document.querySelectorAll('.cyber-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.closest('.uav-details');
            const targetId = btn.getAttribute('data-target');
            if (!parent || !targetId) return;

            parent.querySelectorAll('.cyber-tab-btn').forEach(b => b.classList.remove('active'));
            parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });

    // 7b. Multi-view CAD angle switcher for Asena UAV
    const asenaCadImage = document.getElementById('asenaCadImage');
    const cadViewBtns = document.querySelectorAll('.cad-view-btn');
    cadViewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const newSrc = btn.getAttribute('data-src');
            if (!newSrc || !asenaCadImage) return;
            cadViewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            asenaCadImage.src = newSrc;
        });
    });

    // 8. Gentle animated GCS avionics preview (respects reduced motion)
    const horizonDisc = document.getElementById('gcsHorizonDisc');
    const attitudeLabel = document.getElementById('gcsAttitudeLabel');
    const gcsSimAlt = document.getElementById('gcsSimAlt');
    const gcsSimSpd = document.getElementById('gcsSimSpd');
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (horizonDisc && !prefersReducedMotion) {
        let phase = 0;
        setInterval(() => {
            phase += 0.25;
            const roll = Math.sin(phase) * 4.5;
            const pitch = Math.cos(phase * 0.7) * 2.2;
            const alt = Math.round(124 + Math.sin(phase * 0.5) * 3);
            const spd = (15.4 + Math.cos(phase * 0.6) * 0.4).toFixed(1);

            horizonDisc.style.transform = `rotate(${roll.toFixed(1)}deg) translateY(${pitch.toFixed(1)}px)`;
            if (attitudeLabel) {
                const pSign = pitch >= 0 ? '+' : '';
                const rSign = roll >= 0 ? '+' : '';
                attitudeLabel.textContent = `PITCH ${pSign}${pitch.toFixed(1)}° // ROLL ${rSign}${roll.toFixed(1)}°`;
            }
            if (gcsSimAlt) gcsSimAlt.textContent = `${alt} m`;
            if (gcsSimSpd) gcsSimSpd.textContent = `${spd} m/s`;
        }, 1400);
    }

    // 9. Gallery filtering + lightbox modal with captions
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const filterButtons = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.getElementById('modalClose');
    const prevBtn = document.getElementById('modalPrev');
    const nextBtn = document.getElementById('modalNext');

    let visibleItems = [...galleryItems];
    let currentIndex = 0;

    const galleryBento = document.querySelector('.gallery-bento');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter || 'all';
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (galleryBento) galleryBento.classList.toggle('is-filtered', filter !== 'all');

            galleryItems.forEach(item => {
                const match = filter === 'all' || item.dataset.category === filter;
                item.classList.toggle('is-hidden', !match);
                item.classList.remove('reveal-pending');
            });

            visibleItems = galleryItems.filter(item => !item.classList.contains('is-hidden'));
        });
    });

    function renderModalImage(index) {
        if (!visibleItems.length || !modalImg) return;
        currentIndex = (index + visibleItems.length) % visibleItems.length;
        const item = visibleItems[currentIndex];
        const img = item.querySelector('img');
        const cap = item.querySelector('.gallery-caption');

        if (img) {
            modalImg.src = img.src;
            modalImg.alt = img.alt;
        }
        if (modalCaption && cap) {
            modalCaption.textContent = cap.textContent.trim();
        }
    }

    function openModal(item) {
        if (!modal) return;
        const idx = visibleItems.indexOf(item);
        renderModalImage(idx >= 0 ? idx : 0);
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => openModal(item));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (nextBtn) nextBtn.addEventListener('click', () => renderModalImage(currentIndex + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => renderModalImage(currentIndex - 1));

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            setDrawerOpen(false);
            closeModal();
            return;
        }
        if (modal && modal.classList.contains('open')) {
            if (e.key === 'ArrowRight') renderModalImage(currentIndex + 1);
            if (e.key === 'ArrowLeft') renderModalImage(currentIndex - 1);
        }
    });

    // 10. Pre-fill contact topic from Join Team chips & Sponsorship CTAs
    const contactTopic = document.getElementById('contactTopic');
    const contactName = document.getElementById('contactName');
    const contactEmail = document.getElementById('contactEmail');
    const contactMsg = document.getElementById('contactMsg');

    function jumpToContact(topic, prefillText) {
        if (contactTopic && topic) contactTopic.value = topic;
        if (contactMsg && prefillText) contactMsg.value = prefillText;

        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const navHeight = navbar ? navbar.offsetHeight : 0;
            const top = contactSection.getBoundingClientRect().top + window.scrollY - navHeight - 8;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }
        setTimeout(() => {
            if (contactName) contactName.focus();
        }, 450);
    }

    document.querySelectorAll('.join-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const isTr = typeof getCurrentLanguage === 'function' && getCurrentLanguage() === 'tr';
            const dept = chip.textContent.trim();
            const prefill = isTr
                ? `Merhaba, Asena İHA Takımı ${dept} birimi için başvuruda bulunmak istiyorum.`
                : `Hello, I would like to apply to join the Asena UAV Team (${dept} sub-team).`;
            jumpToContact('team', prefill);
        });
    });

    document.querySelectorAll('[data-topic="sponsorship"]').forEach(el => {
        el.addEventListener('click', () => {
            if (contactTopic) contactTopic.value = 'sponsorship';
        });
    });

    // 11. Contact form validation + inline feedback + toast notification
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const toast = document.getElementById('toastNotification');
    const toastClose = document.getElementById('toastClose');
    let toastTimer = null;

    function showToast() {
        if (!toast) return;
        clearTimeout(toastTimer);
        toast.classList.add('show');
        toast.setAttribute('aria-hidden', 'false');
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
            toast.setAttribute('aria-hidden', 'true');
        }, 6000);
    }

    if (toastClose && toast) {
        toastClose.addEventListener('click', () => {
            clearTimeout(toastTimer);
            toast.classList.remove('show');
            toast.setAttribute('aria-hidden', 'true');
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const isTr = typeof getCurrentLanguage === 'function' && getCurrentLanguage() === 'tr';
            const nameVal = contactName ? contactName.value.trim() : '';
            const emailVal = contactEmail ? contactEmail.value.trim() : '';
            const msgVal = contactMsg ? contactMsg.value.trim() : '';
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);

            if (!nameVal || !emailValid || msgVal.length < 5) {
                if (formFeedback) {
                    formFeedback.className = 'form-feedback error';
                    formFeedback.textContent = isTr
                        ? 'Lütfen ad soyad, geçerli bir e-posta adresi ve mesaj içeriği giriniz.'
                        : 'Please enter your full name, a valid email address, and a message.';
                }
                return;
            }

            if (formFeedback) {
                formFeedback.className = 'form-feedback success';
                formFeedback.textContent = isTr
                    ? `Teşekkürler ${nameVal}! Mesajınız başarıyla alındı; en kısa sürede size dönüş yapılacaktır.`
                    : `Thank you, ${nameVal}! Your message has been received and our team will reply shortly.`;
            }

            showToast();
            contactForm.reset();
        });
    }
});
