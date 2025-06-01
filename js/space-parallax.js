// Système de parallax spatial multicouches optimisé
class SpaceParallax {
    constructor() {
        this.scrollY = 0;
        this.ticking = false;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Configuration des vitesses de parallax pour chaque couche
        this.parallaxSpeeds = {
            bgLayer1: 0.05,   // Très lent - arrière-plan lointain
            bgLayer2: 0.15,   // Lent - plan moyen
            bgLayer3: 0.25,   // Moyen - premier plan
            stars1: 0.1,      // Lent - étoiles lointaines
            stars2: 0.3,      // Moyen - étoiles moyennes
            stars3: 0.5       // Rapide - étoiles proches
        };
        
        this.init();
    }
    
    init() {
        if (this.prefersReducedMotion) {
            console.log('Animations réduites détectées - parallax désactivé');
            return;
        }
        
        this.createStars();
        this.bindEvents();
        this.updateParallax(); // Position initiale
    }
    
    // Génération des étoiles avec distribution réaliste
    createStars() {
        const layers = [
            { element: '.stars-layer-1', count: 80, sizeRange: [1, 2] },
            { element: '.stars-layer-2', count: 60, sizeRange: [2, 3] },
            { element: '.stars-layer-3', count: 40, sizeRange: [3, 4] }
        ];
        
        layers.forEach((layer, layerIndex) => {
            const container = document.querySelector(layer.element);
            if (!container) return;
            
            for (let i = 0; i < layer.count; i++) {
                const star = this.createStar(layer.sizeRange, layerIndex);
                container.appendChild(star);
            }
        });
    }
    
    // Création d'une étoile individuelle
    createStar(sizeRange, layerIndex) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Position aléatoire
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        
        // Taille basée sur la couche avec variation
        const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Couleur et type d'étoile
        const rand = Math.random();
        if (rand < 0.15) {
            star.classList.add('pink');
        } else if (rand < 0.25) {
            star.classList.add('blue');
        }
        
        // Délai d'animation aléatoire pour éviter la synchronisation
        const delay = Math.random() * 3;
        star.style.animationDelay = `${delay}s`;
        
        // Opacité de base selon la couche
        const baseOpacity = 0.8 - (layerIndex * 0.2);
        const opacity = baseOpacity + (Math.random() * 0.4 - 0.2);
        star.style.opacity = Math.max(0.2, Math.min(1, opacity));
        
        return star;
    }
    
    // Gestion des événements
    bindEvents() {
        // Écoute du scroll avec throttling optimisé
        window.addEventListener('scroll', () => {
            this.scrollY = window.pageYOffset;
            this.requestTick();
        }, { passive: true });
        
        // Gestion du redimensionnement
        window.addEventListener('resize', () => {
            this.requestTick();
        }, { passive: true });
    }
    
    // Système de throttling pour optimiser les performances
    requestTick() {
        if (!this.ticking) {
            this.ticking = true;
            requestAnimationFrame(() => {
                this.updateParallax();
                this.ticking = false;
            });
        }
    }
    
    // Mise à jour principale du parallax
    updateParallax() {
        const scrollY = this.scrollY;
        
        // Mise à jour des couches de background
        this.updateBackgroundLayers(scrollY);
        
        // Mise à jour des couches d'étoiles
        this.updateStarsLayers(scrollY);
    }
    
    // Parallax des couches de background
    updateBackgroundLayers(scrollY) {
        const bgLayer1 = document.querySelector('.bg-layer-1');
        const bgLayer2 = document.querySelector('.bg-layer-2');
        const bgLayer3 = document.querySelector('.bg-layer-3');
        
        if (bgLayer1) {
            const offset1 = scrollY * this.parallaxSpeeds.bgLayer1;
            bgLayer1.style.transform = `translate3d(0, ${offset1}px, 0)`;
        }
        
        if (bgLayer2) {
            const offset2 = scrollY * this.parallaxSpeeds.bgLayer2;
            bgLayer2.style.transform = `translate3d(0, ${offset2}px, 0)`;
        }
        
        if (bgLayer3) {
            const offset3 = scrollY * this.parallaxSpeeds.bgLayer3;
            bgLayer3.style.transform = `translate3d(0, ${offset3}px, 0)`;
        }
    }
    
    // Parallax des couches d'étoiles
    updateStarsLayers(scrollY) {
        const starsLayer1 = document.querySelector('.stars-layer-1');
        const starsLayer2 = document.querySelector('.stars-layer-2');
        const starsLayer3 = document.querySelector('.stars-layer-3');
        
        if (starsLayer1) {
            const offset1 = scrollY * this.parallaxSpeeds.stars1;
            starsLayer1.style.transform = `translate3d(0, ${offset1}px, 0)`;
        }
        
        if (starsLayer2) {
            const offset2 = scrollY * this.parallaxSpeeds.stars2;
            starsLayer2.style.transform = `translate3d(0, ${offset2}px, 0)`;
        }
        
        if (starsLayer3) {
            const offset3 = scrollY * this.parallaxSpeeds.stars3;
            starsLayer3.style.transform = `translate3d(0, ${offset3}px, 0)`;
        }
    }
    
    // Méthode pour ajuster dynamiquement les vitesses (optionnel)
    updateSpeeds(newSpeeds) {
        this.parallaxSpeeds = { ...this.parallaxSpeeds, ...newSpeeds };
        this.updateParallax();
    }
}

// Initialisation automatique quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si l'utilisateur préfère les animations réduites
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        // Initialiser le système de parallax spatial
        window.spaceParallax = new SpaceParallax();
        console.log('🌌 Système de parallax spatial initialisé');
    } else {
        console.log('🌌 Mode animations réduites - parallax désactivé');
    }
});

// API publique pour contrôler les effets depuis la console (debug)
window.SpaceParallaxAPI = {
    enable: () => {
        if (!window.spaceParallax) {
            window.spaceParallax = new SpaceParallax();
        }
    },
    disable: () => {
        if (window.spaceParallax) {
            window.spaceParallax = null;
        }
    },
    updateSpeeds: (speeds) => {
        if (window.spaceParallax) {
            window.spaceParallax.updateSpeeds(speeds);
        }
    }
};
