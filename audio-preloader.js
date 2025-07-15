// Audio preloader for Tower Blocks game
(function() {
    // Preload the ARF Gang music file
    const audioPreloader = new Image();
    audioPreloader.src = 'Arf_Gang.mp3';
    
    // Log that preloading has started
    console.log('Preloading ARF Gang music...');
    
    // Create a backup audio element to ensure loading
    const preloadAudio = document.createElement('audio');
    preloadAudio.style.display = 'none';
    preloadAudio.preload = 'auto';
    
    const source = document.createElement('source');
    source.src = 'Arf_Gang.mp3';
    source.type = 'audio/mpeg';
    
    preloadAudio.appendChild(source);
    
    // Add it to the page but keep it hidden and muted
    document.addEventListener('DOMContentLoaded', function() {
        document.body.appendChild(preloadAudio);
        
        // Try to load it (but muted and at very low volume)
        preloadAudio.volume = 0.001;
        preloadAudio.muted = true;
        
        preloadAudio.load();
        
        // Try to play and immediately pause to ensure loading
        // This addresses autoplay policy issues in some browsers
        const playPromise = preloadAudio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                preloadAudio.pause();
                console.log('ARF Gang music preloaded successfully');
            }).catch(e => {
                console.log('Music preloading note:', e.message);
            });
        }
    });
})();
