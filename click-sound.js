// Click sound generator using Web Audio API
class ClickSoundManager {
    constructor() {
        this.audioContext = null;
        this.initialized = false;
        this.enabled = true;
        this.init();
    }

    init() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            console.log('Click sound manager initialized');
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
            this.initialized = false;
        }
    }

    // Generate a click sound
    playClick() {
        if (!this.initialized || !this.enabled || !this.audioContext) return;

        try {
            // Resume audio context if suspended (required for Chrome)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            // Create oscillator for the click sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            // Connect nodes
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // Configure the click sound (short, sharp beep)
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime); // High frequency
            oscillator.type = 'sine';

            // Configure volume envelope (quick fade)
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

            // Play the sound
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);

        } catch (error) {
            console.warn('Error playing click sound:', error);
        }
    }

    // Generate a block placement sound (different pitch)
    playBlockPlace() {
        if (!this.initialized || !this.enabled || !this.audioContext) return;

        try {
            // Resume audio context if suspended
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            // Create oscillator for the block placement sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            // Connect nodes
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // Configure the block placement sound (lower frequency, slightly longer)
            oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.2);
            oscillator.type = 'sine';

            // Configure volume envelope
            gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

            // Play the sound
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);

        } catch (error) {
            console.warn('Error playing block placement sound:', error);
        }
    }

    // Generate a game over sound
    playGameOver() {
        if (!this.initialized || !this.enabled || !this.audioContext) return;

        try {
            // Resume audio context if suspended
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            // Create oscillator for the game over sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            // Connect nodes
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // Configure the game over sound (descending tone)
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.5);
            oscillator.type = 'sawtooth';

            // Configure volume envelope
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

            // Play the sound
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);

        } catch (error) {
            console.warn('Error playing game over sound:', error);
        }
    }

    // Toggle sound on/off
    toggleSound() {
        this.enabled = !this.enabled;
        localStorage.setItem('towerBlocks_clickSounds', this.enabled.toString());
        console.log('Click sounds', this.enabled ? 'enabled' : 'disabled');
    }

    // Load saved preference
    loadPreference() {
        const saved = localStorage.getItem('towerBlocks_clickSounds');
        if (saved !== null) {
            this.enabled = saved === 'true';
        }
    }
}

// Create global instance
window.clickSoundManager = new ClickSoundManager();
window.clickSoundManager.loadPreference();
