document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple scroll reveal animation for elements
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.uav-grid, .team-card, .tech-card, .gallery-item, .contact-info-panel, .contact-form-panel, .timeline-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Tab Logic for UAV Sections
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.closest('.uav-details');
            const targetId = btn.getAttribute('data-target');
            
            // Remove active classes
            parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class
            btn.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Gallery Lightbox Logic
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.getElementById('modalClose');
    const prevBtn = document.getElementById('modalPrev');
    const nextBtn = document.getElementById('modalNext');

    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

    function openModal(index) {
        currentImageIndex = index;
        modalImg.src = images[currentImageIndex];
        modal.classList.add('open');
    }

    function closeModal() {
        modal.classList.remove('open');
    }

    function showNext() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        modalImg.src = images[currentImageIndex];
    }

    function showPrev() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        modalImg.src = images[currentImageIndex];
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openModal(index);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
});
