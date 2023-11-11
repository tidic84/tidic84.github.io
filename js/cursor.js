const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const links = document.querySelectorAll('a');
function load() {
    var ev = window.event;
    cursorDot.style.left = `${ev.clientX}px`;
    cursorDot.style.top = `${ev.clientY}px`;
}


window.addEventListener('mousemove', trackMouse, false);
window.addEventListener('mouseenter', trackMouse, false);
document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = 0;
    cursorOutline.style.opacity = 0;
});

function trackMouse(e) {
    var posX = e.clientX;
    var posY = e.clientY;
    if(posX != undefined && posY != undefined) {
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        cursorDot.style.opacity = 1;
        cursorOutline.style.opacity = 1;
    }
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    if(cursorDot.style.opacity == 1) {
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, {
            duration: 400,
            fill: 'forwards',
            easing: 'ease-in'
        });
    }
}

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