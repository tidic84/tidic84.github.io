/* Guide d'utilisation du Smooth Scrolling
   ====================================== */

/* 
   Le système de smooth scrolling a été intégré au portfolio pour une expérience plus fluide.
   
   🌊 COMMENT ÇA MARCHE :
   ----------------------
   - Le scroll natif du navigateur définit la position cible
   - JavaScript interpole graduellement vers cette position
   - Le parallax utilise la position interpolée pour un effet fluide
   
   ⚙️ CONFIGURATION PAR DÉFAUT :
   -----------------------------
   - Facteur de fluidité (lerp) : 0.1 (équilibré)
   - Adaptatif selon la vitesse de scroll
   - Scroll rapide = plus réactif (0.15)
   - Scroll lent = plus fluide (0.08)
   
   🎛️ CONTRÔLES DISPONIBLES :
   --------------------------
   Dans la console du navigateur :
   
   // Voir les statistiques en temps réel
   SpaceParallaxAPI.getStats()
   
   // Ajuster la fluidité (0.01 = très fluide, 0.3 = réactif)
   SpaceParallaxAPI.setSmoothness(0.05)  // Très fluide
   SpaceParallaxAPI.setSmoothness(0.15)  // Équilibré
   SpaceParallaxAPI.setSmoothness(0.25)  // Réactif
   
   // Activer/désactiver
   SpaceParallaxAPI.disableSmoothScrolling()  // Scroll natif
   SpaceParallaxAPI.enableSmoothScrolling()   // Smooth scrolling
   
   🎯 RECOMMANDATIONS :
   -------------------
   - 0.05-0.08 : Pour un effet très fluide et cinématique
   - 0.1-0.15  : Équilibré, recommandé pour la plupart des utilisateurs
   - 0.2-0.3   : Plus réactif, pour les utilisateurs préférant la rapidité
   
   ⚡ PERFORMANCE :
   ---------------
   Le système s'adapte automatiquement :
   - Réduit la fluidité si les performances chutent
   - Désactive le smooth scrolling sur les appareils faibles
   - Compatible avec le système de qualité adaptative
   
   🖱️ CURSEUR :
   -----------
   Le curseur personnalisé n'est pas affecté par le smooth scrolling.
   Il continue de fonctionner normalement sur tous les éléments.
*/

console.log('📖 Guide du Smooth Scrolling chargé - Voir performance-guide.js pour plus d\'infos');
