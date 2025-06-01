// Système de parallax spatial multicouches optimisé
class SpaceParallax {
    constructor() {
        this.scrollY = 0;
        this.targetScrollY = 0;
        this.currentScrollY = 0;
        this.ticking = false;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Configuration du smooth scrolling
        this.smoothScrolling = {
            enabled: true,
            lerp: 0.1, // Facteur d'interpolation (0.05 = très fluide, 0.2 = plus réactif)
            threshold: 0.1 // Seuil minimal de mouvement
        };
        
        // Système de contrôle de qualité adaptatif
        this.performanceMonitor = {
            frameCount: 0,
            lastTime: performance.now(),
            currentFPS: 60,
            targetFPS: 60,
            adaptiveQuality: true
        };
        
        // Cache des éléments DOM pour éviter les requêtes répétées
        this.elements = {
            bgLayer1: null,
            bgLayer2: null,
            bgLayer3: null,
            starsLayer1: null,
            starsLayer2: null,
            starsLayer3: null
        };
        
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
    }    init() {
        if (this.prefersReducedMotion) {
            console.log('Animations réduites détectées - parallax désactivé');
            return;
        }
        
        this.cacheElements();
        this.createStars();
        this.bindEvents();
        this.startPerformanceMonitoring();
        this.startSmoothScrolling();
        this.updateParallax(); // Position initiale
    }
    
    // Démarrage du système de smooth scrolling
    startSmoothScrolling() {
        if (!this.smoothScrolling.enabled) return;
        
        const updateSmooth = () => {
            // Interpolation linéaire pour un mouvement fluide
            const diff = this.targetScrollY - this.currentScrollY;
            
            if (Math.abs(diff) > this.smoothScrolling.threshold) {
                this.currentScrollY += diff * this.smoothScrolling.lerp;
                this.scrollY = this.currentScrollY;
                this.requestTick();
            }
            
            requestAnimationFrame(updateSmooth);
        };
        
        requestAnimationFrame(updateSmooth);
    }
    
    // Système de monitoring des performances
    startPerformanceMonitoring() {
        if (!this.performanceMonitor.adaptiveQuality) return;
        
        setInterval(() => {
            const now = performance.now();
            const deltaTime = now - this.performanceMonitor.lastTime;
            this.performanceMonitor.currentFPS = Math.round(1000 / deltaTime * this.performanceMonitor.frameCount);
            
            // Réduction adaptative si les performances chutent
            if (this.performanceMonitor.currentFPS < 45) {
                this.reduceQuality();
            } else if (this.performanceMonitor.currentFPS > 55) {
                this.restoreQuality();
            }
            
            this.performanceMonitor.frameCount = 0;
            this.performanceMonitor.lastTime = now;
        }, 1000);
    }
    
    // Réduction de la qualité en cas de baisse de performances
    reduceQuality() {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index % 3 === 0) { // Cacher 1 étoile sur 3
                star.style.display = 'none';
            }
        });
        console.log('🔧 Qualité réduite pour maintenir les performances');
    }
    
    // Restauration de la qualité
    restoreQuality() {
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            star.style.display = 'block';
        });
    }
      // Cache des éléments DOM pour optimiser les performances
    cacheElements() {
        this.elements.bgLayer1 = document.querySelector('.bg-layer-1');
        this.elements.bgLayer2 = document.querySelector('.bg-layer-2');
        this.elements.bgLayer3 = document.querySelector('.bg-layer-3');
        this.elements.starsLayer1 = document.querySelector('.stars-layer-1');
        this.elements.starsLayer2 = document.querySelector('.stars-layer-2');
        this.elements.starsLayer3 = document.querySelector('.stars-layer-3');
        
        // Configuration de l'Intersection Observer
        this.setupIntersectionObserver();
    }
    
    // Configuration de l'Intersection Observer pour optimiser l'affichage
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        };
        
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                if (entry.isIntersecting) {
                    element.style.willChange = 'transform';
                } else {
                    element.style.willChange = 'auto';
                }
            });
        }, options);
        
        // Observer les sections pour optimiser les transformations
        document.querySelectorAll('section').forEach(section => {
            this.intersectionObserver.observe(section);
        });
    }
      // Génération des étoiles avec distribution réaliste et optimisée
    createStars() {
        // Réduction significative du nombre d'étoiles pour améliorer les performances
        const layers = [
            { element: '.stars-layer-1', count: 80, sizeRange: [1, 2] },  
            { element: '.stars-layer-2', count: 60, sizeRange: [2, 3] }, 
            { element: '.stars-layer-3', count: 40, sizeRange: [3, 4] } 
        ];
        
        layers.forEach((layer, layerIndex) => {
            const container = document.querySelector(layer.element);
            if (!container) return;
            
            // Utilisation d'un fragment pour éviter les reflows multiples
            const fragment = document.createDocumentFragment();
            
            for (let i = 0; i < layer.count; i++) {
                const star = this.createStar(layer.sizeRange, layerIndex);
                fragment.appendChild(star);
            }
            
            // Ajout en une seule fois pour optimiser le DOM
            container.appendChild(fragment);
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
    }    // Gestion des événements avec throttling adaptatif optimisé
    bindEvents() {
        // Variables pour un throttling adaptatif
        let lastScrollTime = 0;
        let throttleDelay = 16; // Démarrage à ~60fps
        let scrollVelocity = 0;
        let lastScrollY = 0;
        
        // Écoute du scroll avec smooth scrolling intégré
        window.addEventListener('scroll', () => {
            const now = performance.now();
            const currentScrollY = window.pageYOffset;
            
            // Calcul de la vélocité pour adapter le throttling
            scrollVelocity = Math.abs(currentScrollY - lastScrollY);
            
            // Adaptation dynamique du throttling selon la vitesse de scroll
            if (scrollVelocity > 50) {
                throttleDelay = 8; // Scroll rapide = throttling plus réactif
                this.smoothScrolling.lerp = 0.15; // Plus réactif pour le scroll rapide
            } else if (scrollVelocity > 20) {
                throttleDelay = 12;
                this.smoothScrolling.lerp = 0.12;
            } else {
                throttleDelay = 16; // Scroll normal
                this.smoothScrolling.lerp = 0.08; // Plus fluide pour le scroll lent
            }
            
            // Throttling temporel pour éviter trop d'appels
            if (now - lastScrollTime < throttleDelay) {
                return;
            }
            
            // Mise à jour du scroll target pour le smooth scrolling
            this.targetScrollY = currentScrollY;
            
            // Fallback direct si smooth scrolling désactivé
            if (!this.smoothScrolling.enabled) {
                this.scrollY = currentScrollY;
                this.requestTick();
            }
            
            lastScrollY = currentScrollY;
            lastScrollTime = now;
        }, { passive: true });
        
        // Gestion du redimensionnement avec debounce optimisé
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.cacheElements(); // Re-cache après resize
                this.requestTick();
            }, 150); // Debounce de 150ms pour éviter trop d'appels
        }, { passive: true });
        
        // Optimisation de visibilité pour économiser les ressources
        document.addEventListener('visibilitychange', () => {
            this.performanceMonitor.adaptiveQuality = !document.hidden;
        });
    }
      // Système de throttling pour optimiser les performances
    requestTick() {
        if (!this.ticking) {
            this.ticking = true;
            requestAnimationFrame(() => {
                this.updateParallax();
                this.performanceMonitor.frameCount++;
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
      // Parallax des couches de background avec éléments cachés
    updateBackgroundLayers(scrollY) {
        if (this.elements.bgLayer1) {
            const offset1 = scrollY * this.parallaxSpeeds.bgLayer1;
            this.elements.bgLayer1.style.transform = `translate3d(0, ${offset1}px, 0)`;
        }
        
        if (this.elements.bgLayer2) {
            const offset2 = scrollY * this.parallaxSpeeds.bgLayer2;
            this.elements.bgLayer2.style.transform = `translate3d(0, ${offset2}px, 0)`;
        }
        
        if (this.elements.bgLayer3) {
            const offset3 = scrollY * this.parallaxSpeeds.bgLayer3;
            this.elements.bgLayer3.style.transform = `translate3d(0, ${offset3}px, 0)`;
        }
    }
    
    // Parallax des couches d'étoiles avec éléments cachés
    updateStarsLayers(scrollY) {
        if (this.elements.starsLayer1) {
            const offset1 = scrollY * this.parallaxSpeeds.stars1;
            this.elements.starsLayer1.style.transform = `translate3d(0, ${offset1}px, 0)`;
        }
        
        if (this.elements.starsLayer2) {
            const offset2 = scrollY * this.parallaxSpeeds.stars2;
            this.elements.starsLayer2.style.transform = `translate3d(0, ${offset2}px, 0)`;
        }
        
        if (this.elements.starsLayer3) {
            const offset3 = scrollY * this.parallaxSpeeds.stars3;
            this.elements.starsLayer3.style.transform = `translate3d(0, ${offset3}px, 0)`;
        }
    }    // Méthode pour ajuster dynamiquement les vitesses (optionnel)
    updateSpeeds(newSpeeds) {
        this.parallaxSpeeds = { ...this.parallaxSpeeds, ...newSpeeds };
        this.updateParallax();
    }
    
    // Contrôle du smooth scrolling
    setSmoothScrolling(enabled, lerp = 0.1) {
        this.smoothScrolling.enabled = enabled;
        this.smoothScrolling.lerp = lerp;
        
        if (!enabled) {
            // Si désactivé, synchroniser immédiatement
            this.currentScrollY = this.targetScrollY;
            this.scrollY = this.currentScrollY;
        }
        
        console.log(`🌊 Smooth scrolling ${enabled ? 'activé' : 'désactivé'} (lerp: ${lerp})`);
    }
    
    // Méthode de nettoyage pour libérer les ressources
    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        // Nettoyage des éléments
        Object.keys(this.elements).forEach(key => {
            this.elements[key] = null;
        });
        
        console.log('🧹 SpaceParallax nettoyé et ressources libérées');
    }
    
    // Méthode publique pour diagnostiquer les performances
    getPerformanceStats() {
        return {
            currentFPS: this.performanceMonitor.currentFPS,
            adaptiveQuality: this.performanceMonitor.adaptiveQuality,
            totalStars: document.querySelectorAll('.star').length,
            visibleStars: document.querySelectorAll('.star:not([style*="display: none"])').length,
            smoothScrolling: {
                enabled: this.smoothScrolling.enabled,
                lerp: this.smoothScrolling.lerp,
                currentPosition: Math.round(this.currentScrollY),
                targetPosition: Math.round(this.targetScrollY),
                distance: Math.round(Math.abs(this.targetScrollY - this.currentScrollY))
            }
        };
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
            window.spaceParallax.destroy();
            window.spaceParallax = null;
        }
    },
    updateSpeeds: (speeds) => {
        if (window.spaceParallax) {
            window.spaceParallax.updateSpeeds(speeds);
        }
    },
    getStats: () => {
        return window.spaceParallax ? window.spaceParallax.getPerformanceStats() : null;
    },
    reduceQuality: () => {
        if (window.spaceParallax) {
            window.spaceParallax.reduceQuality();
        }
    },
    restoreQuality: () => {
        if (window.spaceParallax) {
            window.spaceParallax.restoreQuality();
        }
    },
    // Nouveaux contrôles pour le smooth scrolling
    enableSmoothScrolling: (lerp = 0.1) => {
        if (window.spaceParallax) {
            window.spaceParallax.setSmoothScrolling(true, lerp);
        }
    },
    disableSmoothScrolling: () => {
        if (window.spaceParallax) {
            window.spaceParallax.setSmoothScrolling(false);
        }
    },
    setSmoothness: (lerp) => {
        if (window.spaceParallax && lerp >= 0.01 && lerp <= 1) {
            window.spaceParallax.smoothScrolling.lerp = lerp;
            console.log(`🌊 Fluidité réglée à ${lerp} (0.01=très fluide, 0.3=réactif)`);
        }
    }
};
