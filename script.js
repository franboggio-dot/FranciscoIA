/* =====================================================
   FRANCISCO IA — Script Principal
   Particles, Scroll Animations, Counters, Mobile Menu
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- PARTICLE SYSTEM ----
    const particlesContainer = document.getElementById('particles-container');
    if (particlesContainer) {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.setProperty('--delay', (Math.random() * 20) + 's');
            particle.style.setProperty('--duration', (15 + Math.random() * 15) + 's');
            particle.style.setProperty('--tx', (Math.random() * 200 - 100) + 'px');
            particle.style.setProperty('--ty', (-100 - Math.random() * 300) + 'px');
            particle.style.setProperty('--tx2', (Math.random() * 150 - 75) + 'px');
            particle.style.setProperty('--ty2', (-200 - Math.random() * 200) + 'px');
            particle.style.width = (2 + Math.random() * 3) + 'px';
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

    // ---- NAVBAR SCROLL EFFECT ----
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    const handleScroll = () => {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ---- MOBILE MENU ----
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
        // Close menu on link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ---- SCROLL REVEAL (Intersection Observer) ----
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stagger = parseInt(entry.target.style.getPropertyValue('--stagger')) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, stagger * 120);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    });
    revealElements.forEach(el => revealObserver.observe(el));

    // ---- ANIMATED COUNTERS ----
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target, 2000);
                });
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    function animateCounter(element, target, duration) {
        const startTime = performance.now();
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.round(target * eased);
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        requestAnimationFrame(update);
    }

    // ---- FLIP CARDS ON MOBILE (TAP) ----
    if (window.innerWidth <= 767) {
        document.querySelectorAll('.service-card-flip').forEach(card => {
            card.addEventListener('click', () => {
                const inner = card.querySelector('.service-card-inner');
                inner.classList.toggle('flipped');
            });
        });
    }

    // ---- SMOOTH SCROLL for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---- PARALLAX on hero visual (subtle) ----
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && window.innerWidth > 767) {
        window.addEventListener('mousemove', (e) => {
            const xRatio = (e.clientX / window.innerWidth - 0.5) * 2;
            const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;
            heroVisual.style.transform = `translate(${xRatio * 15}px, ${yRatio * 10}px)`;
        }, { passive: true });
    }

    // ---- NAVBAR ACTIVE LINK ON SCROLL ----
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link:not(.nav-cta)');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinksAll.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });
    sections.forEach(s => sectionObserver.observe(s));

    // ---- TYPING EFFECT for hero label (optional enhancement) ----
    // Already handled by CSS animations

    // ---- CONTACT FORM → WEBHOOK n8n ----
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnArrow = document.getElementById('btnArrow');
    const btnSpinner = document.getElementById('btnSpinner');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    const errorMsg = document.getElementById('errorMsg');

    // Webhook URL de n8n
    const WEBHOOK_URL = 'https://boggioia.app.n8n.cloud/webhook/3f30a5c3-9868-44a4-940e-50a6cba5a360';

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Disable button and show loading
            submitBtn.disabled = true;
            btnText.textContent = 'Enviando...';
            btnArrow.style.display = 'none';
            btnSpinner.style.display = 'block';

            // Collect all form data into JSON
            const formData = {
                nombre: document.getElementById('nombre').value.trim(),
                email: document.getElementById('email').value.trim(),
                telefono: document.getElementById('telefono').value.trim(),
                negocio: document.getElementById('negocio').value.trim(),
                servicio: document.getElementById('servicio').value,
                presupuesto: document.getElementById('presupuesto').value || 'No especificado',
                mensaje: document.getElementById('mensaje').value.trim(),
                fecha_envio: new Date().toISOString(),
                origen: 'Landing Page Francisco IA'
            };

            console.log('📤 Enviando datos al webhook:', JSON.stringify(formData, null, 2));

            try {
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    console.log('✅ Datos enviados exitosamente');
                    // Show success message
                    contactForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                    formError.style.display = 'none';
                } else {
                    throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
                }
            } catch (error) {
                console.error('❌ Error al enviar:', error);
                // Show error message
                contactForm.style.display = 'none';
                formError.style.display = 'block';
                formSuccess.style.display = 'none';
                errorMsg.textContent = `Error: ${error.message}. Verifica que el webhook esté activo e intenta de nuevo.`;
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                btnText.textContent = 'Enviar Consulta Gratis';
                btnArrow.style.display = '';
                btnSpinner.style.display = 'none';
            }
        });
    }

    console.log('🚀 Francisco IA — Landing Page loaded successfully!');
});