// Script de test des performances du portfolio
// À exécuter dans la console du navigateur pour diagnostiquer les performances

console.log('🚀 Test de performance du portfolio Space Parallax');
console.log('================================================');

// Test 1: Vérification de l'initialisation
if (window.spaceParallax) {
    console.log('✅ SpaceParallax initialisé correctement');
    
    // Test 2: Statistiques des performances
    const stats = window.SpaceParallaxAPI.getStats();
    console.log('📊 Statistiques actuelles:', stats);
    
    // Test 3: Performance du DOM
    const domElements = {
        totalStars: document.querySelectorAll('.star').length,
        parallaxLayers: document.querySelectorAll('.bg-layer, .stars-layer').length,
        sections: document.querySelectorAll('section').length
    };
    console.log('🏗️ Éléments DOM:', domElements);
    
} else {
    console.log('❌ SpaceParallax non initialisé');
}

// Test 4: Mesure du temps de rendu
let frameCount = 0;
let startTime = performance.now();

function measureRenderTime() {
    frameCount++;
    
    if (frameCount === 60) { // Mesure sur 60 frames
        const endTime = performance.now();
        const totalTime = endTime - startTime;
        const avgFrameTime = totalTime / 60;
        const estimatedFPS = 1000 / avgFrameTime;
        
        console.log('⚡ Performance de rendu:');
        console.log(`   • Temps moyen par frame: ${avgFrameTime.toFixed(2)}ms`);
        console.log(`   • FPS estimé: ${estimatedFPS.toFixed(1)}`);
        console.log(`   • Performance: ${estimatedFPS > 55 ? '🟢 Excellente' : estimatedFPS > 45 ? '🟡 Bonne' : '🔴 À améliorer'}`);
        
        return;
    }
    
    requestAnimationFrame(measureRenderTime);
}

// Démarrer la mesure
requestAnimationFrame(measureRenderTime);

// Test 5: Commandes utiles
console.log('\n🛠️ Commandes de débogage disponibles:');
console.log('• SpaceParallaxAPI.getStats() - Statistiques en temps réel');
console.log('• SpaceParallaxAPI.reduceQuality() - Réduire la qualité');
console.log('• SpaceParallaxAPI.restoreQuality() - Restaurer la qualité');
console.log('• SpaceParallaxAPI.disable() - Désactiver le parallax');
console.log('• SpaceParallaxAPI.enable() - Réactiver le parallax');

// Test 6: Surveillance continue des performances
setInterval(() => {
    if (window.spaceParallax) {
        const currentStats = window.SpaceParallaxAPI.getStats();
        if (currentStats && currentStats.currentFPS < 45) {
            console.warn('⚠️ Performance dégradée détectée:', currentStats);
        }
    }
}, 5000);

console.log('\n✨ Tests de performance en cours...');
