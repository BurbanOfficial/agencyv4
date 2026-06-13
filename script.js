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
    
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link, .contact-link, .project-name');
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingText = document.getElementById('loadingText');
    
    // Page routes for navigation with loading screen
    const pageRoutes = {
        'our-projects.html': 'our-projects.html',
        'our-expertise.html': 'our-expertise.html',
        'our-team.html': 'our-team.html',
        'contact.html': 'contact.html'
    };
    
    // Flag to prevent initial loading screen from hiding during navigation
    let isNavigating = false;
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            console.log(`Navigation vers : ${target}`);
            
            // Check if it's a page navigation (not anchor link)
            if (pageRoutes[target] || target.endsWith('.html')) {
                e.preventDefault();
                
                // Set navigating flag to prevent initial loading screen from hiding
                isNavigating = true;
                
                // Show loading screen with video
                loadingScreen.style.display = 'flex';
                loadingScreen.offsetHeight; // Force reflow
                loadingScreen.classList.add('active');
                
                // Play video and redirect after animation
                const loadingVideo = document.getElementById('loadingVideo');
                if (loadingVideo) {
                    loadingVideo.currentTime = 0;
                    loadingVideo.play();
                }
                
                // After video plays, start exit animation and navigate immediately
                setTimeout(() => {
                    // Set flag to skip loading screen on destination page
                    sessionStorage.setItem('skipLoading', 'true');
                    
                    // Start exit animation and navigate at the same time
                    loadingScreen.classList.remove('active');
                    loadingScreen.classList.add('exit');
                    
                    // Navigate immediately - loading screen stays visible during transition
                    window.location.href = target;
                }, 2500);
            }
        });
    });
    
    // Initial page load - show video preloader (skip if coming from internal navigation)
    const loadingVideo = document.getElementById('loadingVideo');
    const skipLoading = sessionStorage.getItem('skipLoading');
    
    if (loadingScreen && loadingVideo && !skipLoading) {
        // Show loading screen on initial load
        loadingScreen.style.display = 'flex';
        // Force reflow
        loadingScreen.offsetHeight;
        loadingScreen.classList.add('active');
        loadingVideo.play();
        
        // Track loading state
        let minTimeElapsed = false;
        let pageLoaded = false;
        
        // Minimum 2.5 seconds display
        setTimeout(() => {
            minTimeElapsed = true;
            checkHideLoading();
        }, 2500);
        
        // Wait for page to be fully loaded
        if (document.readyState === 'complete') {
            pageLoaded = true;
            checkHideLoading();
        } else {
            window.addEventListener('load', () => {
                pageLoaded = true;
                checkHideLoading();
            });
        }
        
        function checkHideLoading() {
            // Don't hide if we're navigating to another page
            if (minTimeElapsed && pageLoaded && loadingScreen.classList.contains('active') && !isNavigating) {
                loadingScreen.classList.remove('active');
                loadingScreen.classList.add('exit');
                
                setTimeout(() => {
                    loadingScreen.classList.remove('exit');
                    // Clear the skip flag after initial load completes
                    sessionStorage.removeItem('skipLoading');
                }, 600);
            }
        }
        
        // Fallback: hide after 5 seconds maximum (only if not navigating)
        setTimeout(() => {
            if (loadingScreen.classList.contains('active') && !isNavigating) {
                loadingScreen.classList.remove('active');
                loadingScreen.classList.add('exit');
                
                setTimeout(() => {
                    loadingScreen.classList.remove('exit');
                    // Clear the skip flag
                    sessionStorage.removeItem('skipLoading');
                }, 600);
            }
        }, 5000);
    } else if (skipLoading) {
        // Clear the flag if we skipped loading (coming from internal navigation)
        sessionStorage.removeItem('skipLoading');
    }
    
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
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }
});
