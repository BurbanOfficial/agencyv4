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
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            console.log(`Navigation vers : ${target}`);
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
    
    // Start the typewriter effect
    typeWriter();
    
    // ========================================
    // CUSTOM SQUARE CURSOR
    // ========================================
    
    const cursor = document.getElementById('customCursor');
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
});
