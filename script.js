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
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            console.log(`Navigation vers : ${target}`);
            
            // Trigger loading screen for page transitions
            if (target === '#equipe') {
                // Show loading screen with video
                loadingScreen.classList.add('active');
                
                // Play video and redirect after animation
                const loadingVideo = document.getElementById('loadingVideo');
                if (loadingVideo) {
                    loadingVideo.currentTime = 0;
                    loadingVideo.play();
                }
                
                // Redirect after video plays (approximately 2-3 seconds)
                setTimeout(() => {
                    loadingScreen.classList.remove('active');
                    loadingScreen.classList.add('exit');
                    
                    // Redirect to our-team.html after animation
                    setTimeout(() => {
                        window.location.href = 'our-team.html';
                    }, 600);
                }, 2500);
            }
        });
    });
    
    // Initial page load - show video preloader
    const loadingVideo = document.getElementById('loadingVideo');
    if (loadingScreen && loadingVideo) {
        // Show loading screen on initial load
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
            if (minTimeElapsed && pageLoaded && loadingScreen.classList.contains('active')) {
                loadingScreen.classList.remove('active');
                loadingScreen.classList.add('exit');
                
                setTimeout(() => {
                    loadingScreen.classList.remove('exit');
                }, 600);
            }
        }
        
        // Fallback: hide after 5 seconds maximum
        setTimeout(() => {
            if (loadingScreen.classList.contains('active')) {
                loadingScreen.classList.remove('active');
                loadingScreen.classList.add('exit');
                
                setTimeout(() => {
                    loadingScreen.classList.remove('exit');
                }, 600);
            }
        }, 5000);
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
