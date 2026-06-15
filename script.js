// Script pour la navigation interactive, l'horloge en temps réel, l'année dynamique et le texte rotatif

document.addEventListener('DOMContentLoaded', () => {
    // Horloge en temps réel
    const timeElement = document.getElementById('currentTime');
    
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}:${seconds} Paris`;
    }
    
    updateTime();
    setInterval(updateTime, 1000);
    
    // Année du copyright dynamique
    const yearElement = document.getElementById('copyrightYear');
    const currentYear = new Date().getFullYear();
    yearElement.textContent = currentYear;
    

    // ========================================
    // PAGE TRANSITION
    // ========================================
    const transitionScreen = document.getElementById('transitionScreen');

    // On page arrival: screen is always visible (enter class set by inline script)
    if (transitionScreen) {
        const video = transitionScreen.querySelector('.transition-video');
        if (video) {
            let videoEnded = false;
            let minTimePassed = false;
            let pageLoaded = false;

            const tryExit = () => {
                if ((videoEnded || pageLoaded) && minTimePassed) {
                    transitionScreen.classList.add('leave');
                    transitionScreen.classList.remove('enter');
                }
            };

            video.addEventListener('ended', () => { videoEnded = true; tryExit(); });
            window.addEventListener('load', () => { pageLoaded = true; tryExit(); });
            setTimeout(() => { minTimePassed = true; tryExit(); }, 2500);

            // Fallback: force exit after 7s
            setTimeout(() => {
                transitionScreen.classList.add('leave');
                transitionScreen.classList.remove('enter');
            }, 7000);
        } else {
            // Other pages: coming from navigation → hold 1s, else exit quickly
            const holdTime = sessionStorage.getItem('transitioning') ? 1000 : 300;
            sessionStorage.removeItem('transitioning');
            setTimeout(() => {
                transitionScreen.classList.add('leave');
                transitionScreen.classList.remove('enter');
            }, holdTime);
        }
    }

    // On link click: wait 1.5s, slide screen up from bottom, then navigate
    const navLinks = document.querySelectorAll('.nav-link, .contact-link, .project-name');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            if (!target || !target.endsWith('.html')) return;
            e.preventDefault();

            // 1.5s delay, then slide screen in from bottom
            setTimeout(() => {
                // Force screen back to bottom (no transition) then trigger enter animation
                transitionScreen.classList.remove('enter', 'leave');
                transitionScreen.style.transition = 'none';
                transitionScreen.style.transform = 'translateY(100%)';
                // Force reflow so the reset is painted before re-animating
                transitionScreen.offsetHeight;
                transitionScreen.style.transition = '';
                transitionScreen.style.transform = '';
                transitionScreen.classList.add('enter');
                // After enter animation (0.6s), navigate
                setTimeout(() => {
                    sessionStorage.setItem('transitioning', 'true');
                    window.location.href = target;
                }, 650);
            }, 80);
        });
    });
    
    // ========================================
    // ROTATING TYPEWRITER TEXT EFFECT
    // ========================================
    
    const rotatingTextElement = document.getElementById('rotatingText');
    const phrases = [
        'CRÉATIVITÉ.<br>STRATÉGIE.<br>RÉSULTATS.',
        'OPTIMISER.<br>CONVERTIR.<br>GRANDIR.',
        'CARBON.<br>VOS IDÉES,<br>NOTRE JOB.'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    const typingSpeed = 80;
    const deletingSpeed = 40;
    const pauseTime = 3000;
    
    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];
        const plainText = currentPhrase.replace(/<br>/g, '\n');
        
        if (isWaiting) {
            return;
        }
        
        if (isDeleting) {
            // Removing characters
            const displayText = plainText.substring(0, charIndex - 1);
            rotatingTextElement.innerHTML = displayText.replace(/\n/g, '<br>');
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(typeWriter, 500);
            } else {
                setTimeout(typeWriter, deletingSpeed);
            }
        } else {
            // Adding characters
            const displayText = plainText.substring(0, charIndex + 1);
            rotatingTextElement.innerHTML = displayText.replace(/\n/g, '<br>');
            charIndex++;
            
            if (charIndex === plainText.length) {
                isWaiting = true;
                setTimeout(() => {
                    isWaiting = false;
                    isDeleting = true;
                    typeWriter();
                }, pauseTime);
            } else {
                setTimeout(typeWriter, typingSpeed);
            }
        }
    }
    
    // Start the typewriter effect only if element exists
    if (rotatingTextElement) {
        typeWriter();
    }
    
    // ========================================
    // CUSTOM SQUARE CURSOR
    // ========================================
    
    const cursor = document.getElementById('customCursor');
    
    if (cursor) {
        const hoverElements = document.querySelectorAll('a, button, .nav-link, .contact-link, .project-name');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const footer = document.querySelector('.site-footer');
        if (footer) {
            footer.addEventListener('mouseenter', () => cursor.classList.add('on-dark'));
            footer.addEventListener('mouseleave', () => cursor.classList.remove('on-dark'));
        }
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }
    
    // ========================================
    // CONTACT FORMS — tabs + multi-step
    // ========================================

    // Init timestamps for anti-spam
    const tsP = document.getElementById('tsParticulier');
    const tsPro = document.getElementById('tsPro');
    if (tsP) tsP.value = Date.now();
    if (tsPro) tsPro.value = Date.now();

    // --- Tab switching ---
    window.switchTab = function(type) {
        const formP   = document.getElementById('formParticulier');
        const formPro = document.getElementById('formPro');
        const tabP    = document.getElementById('tabParticulier');
        const tabPro  = document.getElementById('tabPro');
        if (!formP) return;

        if (type === 'particulier') {
            formP.classList.add('active');
            formPro.classList.remove('active');
            tabP.classList.add('active');
            tabPro.classList.remove('active');
        } else {
            formPro.classList.add('active');
            formP.classList.remove('active');
            tabPro.classList.add('active');
            tabP.classList.remove('active');
        }
    };

    // --- Step helpers ---
    function getSteps(btn) {
        return btn.closest('form').querySelectorAll('.fstep');
    }

    function getActiveIndex(steps) {
        for (let i = 0; i < steps.length; i++) {
            if (steps[i].classList.contains('active')) return i;
        }
        return 0;
    }

    function updateBar(form, activeIdx) {
        form.querySelectorAll('.step-item').forEach((item, i) => {
            item.classList.remove('active', 'done');
            if (i === activeIdx) item.classList.add('active');
            else if (i < activeIdx) item.classList.add('done');
        });
        form.querySelectorAll('.step-sep').forEach((sep, i) => {
            sep.style.background = i < activeIdx ? '#000000' : '#cccccc';
        });
    }

    function validateStep(fstep) {
        let ok = true;
        fstep.querySelectorAll('input[required], textarea[required]').forEach(field => {
            const val = field.value.trim();
            if (!val) {
                ok = false;
                field.style.borderBottomColor = '#cc0000';
                field.style.borderBottomWidth = '2px';
            } else {
                field.style.borderBottomColor = '#000000';
                field.style.borderBottomWidth = '1px';
            }
        });
        return ok;
    }

    // --- Global navigation ---
    window.goNext = function(btn) {
        const steps = getSteps(btn);
        const idx   = getActiveIndex(steps);
        if (!validateStep(steps[idx])) return;
        if (idx < steps.length - 1) {
            steps[idx].classList.remove('active');
            steps[idx + 1].classList.add('active');
            updateBar(btn.closest('form'), idx + 1);
        }
    };

    window.goPrev = function(btn) {
        const steps = getSteps(btn);
        const idx   = getActiveIndex(steps);
        if (idx > 0) {
            steps[idx].classList.remove('active');
            steps[idx - 1].classList.add('active');
            updateBar(btn.closest('form'), idx - 1);
        }
    };

    // --- Form submission with anti-spam ---
    document.querySelectorAll('.contact-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Honeypot check
            const hp = form.querySelector('[name="_hp"]');
            if (hp && hp.value !== '') return;

            // Time check (min 4s)
            const tsField = form.querySelector('[name="timestamp"]');
            if (tsField && Date.now() - parseInt(tsField.value, 10) < 4000) {
                alert('Veuillez prendre le temps de remplir le formulaire.');
                return;
            }

            // Math anti-spam (3 + 4 = 7)
            const antispam = form.querySelector('[name="antispam"]');
            if (antispam && parseInt(antispam.value, 10) !== 7) {
                antispam.style.borderBottomColor = '#cc0000';
                antispam.style.borderBottomWidth = '2px';
                antispam.focus();
                return;
            }

            // All good — submit (or show success)
            form.innerHTML = '<p class="form-success">Merci ! Votre message a bien été envoyé.<br>Nous vous répondrons dans les plus brefs délais.</p>';
        });
    });

    // ========================================
    // FOOTER — statut horaires + téléphone
    // ========================================
    function updateFooterStatus() {
        const dot = document.getElementById('footerStatusDot');
        const label = document.getElementById('footerStatusLabel');
        if (!dot || !label) return;

        const now = new Date();
        const day = now.getDay(); // 0=dim, 1=lun, ..., 6=sam
        const hour = now.getHours() + now.getMinutes() / 60;
        const isWeekday = day >= 1 && day <= 6;
        const isOpen = isWeekday && hour >= 9 && hour < 18;
        const isSoon = isWeekday && hour >= 17 && hour < 18;
        const closed = !isOpen;

        dot.className = 'footer-status-dot ' + (closed ? 'closed' : isSoon ? 'soon' : 'open');
        label.textContent = closed ? 'Fermé' : isSoon ? 'Bientôt fermé' : 'Ouvert';
    }
    updateFooterStatus();
    setInterval(updateFooterStatus, 60000);

    const phoneBtn = document.getElementById('footerPhoneBtn');
    const phoneNumber = document.getElementById('footerPhoneNumber');
    if (phoneBtn && phoneNumber) {
        phoneBtn.addEventListener('click', () => {
            const now = new Date();
            const day = now.getDay();
            const hour = now.getHours() + now.getMinutes() / 60;
            const isOpen = day >= 1 && day <= 6 && hour >= 9 && hour < 18;
            if (isOpen) {
                phoneBtn.style.display = 'none';
                phoneNumber.style.display = 'inline';
            } else {
                phoneBtn.textContent = 'Numéro indisponible (fermé)';
                phoneBtn.disabled = true;
                phoneBtn.style.opacity = '0.4';
                phoneBtn.style.cursor = 'not-allowed';
            }
        });
    }

    const newsletterForm = document.getElementById('footerNewsletter');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const success = document.getElementById('footerNewsletterSuccess');
            if (success) success.textContent = 'Merci, vous êtes bien inscrit(e) !';
            newsletterForm.querySelector('.footer-newsletter-input').value = '';
        });
    }

    // ========================================
    // PROJECTS CAROUSEL — drag to scroll
    // ========================================
    const carouselWrapper = document.querySelector('.projects-carousel-wrapper');
    const carousel = document.getElementById('projectsCarousel');
    if (carouselWrapper && carousel) {
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;

        carouselWrapper.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - carouselWrapper.offsetLeft;
            scrollLeft = carouselWrapper.scrollLeft;
        });
        carouselWrapper.addEventListener('mouseleave', () => { isDragging = false; });
        carouselWrapper.addEventListener('mouseup', () => { isDragging = false; });
        carouselWrapper.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - carouselWrapper.offsetLeft;
            const walk = (x - startX) * 1.5;
            carouselWrapper.scrollLeft = scrollLeft - walk;
        });
    }

    // ========================================
    // CTA CUSTOM CURSOR
    // ========================================
    const ctaSection = document.querySelector('.cta-section');
    const ctaCursor = document.querySelector('.cta-cursor');
    if (ctaSection && ctaCursor) {
        ctaSection.addEventListener('mousemove', (e) => {
            ctaCursor.style.left = e.clientX + 'px';
            ctaCursor.style.top = e.clientY + 'px';
        });
    }

    // ========================================
    // FAQ ACCORDION
    // ========================================
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(el => {
                el.classList.remove('open');
                el.querySelector('.faq-icon').textContent = '+';
            });
            if (!isOpen) {
                item.classList.add('open');
                btn.querySelector('.faq-icon').textContent = '−';
            }
        });
    });

    // ========================================
    // EN SAVOIR PLUS — underline direction
    // ========================================
    document.querySelectorAll('.exp-detail-more, .exp-service-title').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.classList.remove('leaving');
        });
        btn.addEventListener('mouseleave', () => {
            btn.classList.add('leaving');
            btn.addEventListener('transitionend', () => {
                btn.classList.remove('leaving');
            }, { once: true });
        });
    });
});
