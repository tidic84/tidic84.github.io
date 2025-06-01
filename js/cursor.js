const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const links = document.querySelectorAll('a');

window.addEventListener('mousemove', function(e) {
    const posX = e.clientX;
    const posY = e.clientY;
    
    cursorDot.style.left = posX + 'px';
    cursorDot.style.top = posY + 'px';
    
    cursorOutline.style.left = posX + 'px';
    cursorOutline.style.top = posY + 'px';
    
    cursorOutline.animate({
        left: posX + 'px',
        top: posY + 'px'
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
    });

    link.addEventListener('mouseleave', () => {
        cursorOutline.style.backgroundColor = 'hsla(0, 73%, 97%, 0)';
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorDot.style.display = 'block';
    });
});