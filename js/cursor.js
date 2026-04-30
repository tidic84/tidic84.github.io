const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const links = document.querySelectorAll('a');

window.addEventListener('mousemove', function(e) {
    const posX = e.clientX;
    const posY = e.clientY;
    
    // Centrer le curseur en soustrayant la moitié de la taille
    const dotSize = 10; // Taille du point cursor-dot
    const outlineSize = 40; // Taille par défaut du contour cursor-outline
    
    cursorDot.style.left = (posX - dotSize / 2) + 'px';
    cursorDot.style.top = (posY - dotSize / 2) + 'px';
    
    // Récupérer la taille actuelle du contour (qui peut changer au survol des liens)
    const currentOutlineSize = parseInt(window.getComputedStyle(cursorOutline).width);
    
    cursorOutline.style.left = (posX - currentOutlineSize / 2) + 'px';
    cursorOutline.style.top = (posY - currentOutlineSize / 2) + 'px';
    
    cursorOutline.animate({
        left: (posX - currentOutlineSize / 2) + 'px',
        top: (posY - currentOutlineSize / 2) + 'px'
    }, {duration: 500, fill: 'forwards'});
});

window.addEventListener('mouseout', function() {
    cursorDot.style.opacity = 0;
    cursorOutline.style.opacity = 0;
});

window.addEventListener('mouseover', function() {
    cursorDot.style.opacity = 1;
    cursorOutline.style.opacity = 1;
});

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursorOutline.style.backgroundColor = '#FDF0F0';
        cursorOutline.style.width = '70px';
        cursorOutline.style.height = '70px';
        cursorDot.style.display = 'none';
        
        // Recentrer le curseur avec la nouvelle taille
        const rect = cursorOutline.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        cursorOutline.style.left = (centerX - 35) + 'px'; // 70/2 = 35
        cursorOutline.style.top = (centerY - 35) + 'px';
    });

    link.addEventListener('mouseleave', () => {
        cursorOutline.style.backgroundColor = 'hsla(0, 73%, 97%, 0)';
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorDot.style.display = 'block';
        
        // Recentrer le curseur avec la taille par défaut
        const rect = cursorOutline.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        cursorOutline.style.left = (centerX - 20) + 'px'; // 40/2 = 20
        cursorOutline.style.top = (centerY - 20) + 'px';
    });
});