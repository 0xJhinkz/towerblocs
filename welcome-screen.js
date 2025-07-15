// Welcome Screen Handler for Tower Blocks
document.addEventListener('DOMContentLoaded', function() {
    // Ensure DOM elements are loaded
    const checkDOM = setInterval(() => {
        const welcomeScreen = document.getElementById('welcome-screen');
        const welcomeNameInput = document.getElementById('welcome-name-input');
        const welcomeStartButton = document.getElementById('welcome-start-button');
        const container = document.getElementById('container');
        const multisynqPlayerNameInput = document.getElementById('playerNameInput');
        
        if (welcomeScreen && welcomeNameInput && welcomeStartButton && container && multisynqPlayerNameInput) {
            clearInterval(checkDOM);
            console.log('DOM elements loaded successfully');

            // Global functions for game control
            
            // Define the changeWallpaper function globally for access from HTML
            window.changeWallpaper = function(event) {
                if (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                
                // Get wallpaper value
                const selectedBg = event && event.target ? event.target.value : 'default';
                let bgColor = '#D0CBC7';
                let bgImage = 'none';
                
                switch (selectedBg) {
                    case 'mountain-sunset':
                        bgImage = 'url("assets/images/mountain-sunset.png")';
                        break;
                    case 'tropical-beach':
                        bgImage = 'url("assets/images/tropical-beach.png")';
                        break;
                    case 'cyberpunk-city':
                        bgImage = 'url("assets/images/cyberpunk-city.png")';
                        break;
                    case 'starry-galaxy':
                        bgImage = 'url("assets/images/starry-galaxy.png")';
                        break;
                    case 'enchanted-forest':
                        bgImage = 'url("assets/images/enchanted-forest.png")';
                        break;
                    default:
                        bgColor = '#2c3e50';
                        break;
                }
                
                document.body.style.backgroundImage = bgImage;
                document.body.style.backgroundColor = bgColor;
                localStorage.setItem('towerBlocks_background', selectedBg);
            };

            // Create and configure background music
            const backgroundMusic = new Audio('assets/audio/Arf_Gang.mp3');
            backgroundMusic.id = 'background-music';
            backgroundMusic.loop = true;
            backgroundMusic.preload = 'auto';
            
            // Add error handling for music loading
            backgroundMusic.addEventListener('error', function(e) {
                console.error('Error loading background music:', e);
                console.log('Trying fallback music path...');
                backgroundMusic.src = 'Arf_Gang.mp3'; // Fallback to root directory
            });
            
            backgroundMusic.addEventListener('loadeddata', function() {
                console.log('Background music loaded successfully');
            });
            
            const savedVolume = localStorage.getItem('towerBlocks_volume');
            const initialVolume = savedVolume ? parseFloat(savedVolume) : 0.7;
            backgroundMusic.volume = initialVolume;
            
            const musicEnabled = localStorage.getItem('towerBlocks_musicEnabled') !== 'false';
            
            document.body.appendChild(backgroundMusic);
            
            const audioControls = document.getElementById('audio-controls');
            audioControls.innerHTML = `
                <div id="audio-panel">
                    <div id="music-toggle-widget">
                        <button id="music-toggle" class="music-on" title="Toggle Music">
                            <span class="speaker-icon">🔊</span>
                            <span class="mute-slash"></span>
                        </button>
                    </div>
                    <div id="volume-control">
                        <div id="volume-slider-container">
                            <div id="volume-slider-bg"></div>
                            <div id="volume-slider-fill"></div>
                            <div id="volume-slider-handle"></div>
                        </div>
                        <div id="volume-value">70%</div>
                    </div>
                </div>
            `;
            // No need to append since we're using the existing div

            // Get references to the dynamically created elements
            const musicToggleBtn = document.getElementById('music-toggle');
            const volumeSliderContainer = document.getElementById('volume-slider-container');
            const volumeSliderFill = document.getElementById('volume-slider-fill');
            const volumeSliderHandle = document.getElementById('volume-slider-handle');
            const volumeValueDisplay = document.getElementById('volume-value');
            
            let currentVolume = localStorage.getItem('towerBlocks_volume') ? parseFloat(localStorage.getItem('towerBlocks_volume')) : 0.7;
            if (!localStorage.getItem('towerBlocks_lastVolume') && currentVolume > 0) {
                localStorage.setItem('towerBlocks_lastVolume', currentVolume);
            }
            
            const savedUsername = localStorage.getItem('towerBlocks_playerName');
            if (savedUsername) {
                welcomeNameInput.value = savedUsername;
            } else {
                welcomeNameInput.value = 'Player_' + Math.floor(Math.random() * 10000);
            }

            function toggleMusic(event) {
                event.preventDefault();
                event.stopPropagation();
                
                if (backgroundMusic.paused) {
                    backgroundMusic.play().catch(e => console.error('Music playback failed:', e));
                    musicToggleBtn.className = 'music-on';
                    musicToggleBtn.title = 'Mute Music';
                    musicToggleBtn.querySelector('.mute-slash').style.display = 'none';
                    localStorage.setItem('towerBlocks_musicEnabled', 'true');
                } else {
                    backgroundMusic.pause();
                    musicToggleBtn.className = 'music-off';
                    musicToggleBtn.title = 'Enable Music';
                    musicToggleBtn.querySelector('.mute-slash').style.display = 'block';
                    localStorage.setItem('towerBlocks_musicEnabled', 'false');
                }
                return false;
            }
            
            function updateVolume(volume, animate = true) {
                volume = Math.max(0, Math.min(1, volume));
                currentVolume = volume;
                backgroundMusic.volume = volume;
                localStorage.setItem('towerBlocks_volume', volume);
                const percentage = Math.round(volume * 100);
                volumeValueDisplay.textContent = percentage + '%';
                if (animate && typeof anime !== 'undefined') {
                    anime({ targets: volumeSliderFill, width: percentage + '%', easing: 'easeOutQuad', duration: 300 });
                    anime({ targets: volumeSliderHandle, left: percentage + '%', easing: 'easeOutQuad', duration: 300 });
                } else {
                    volumeSliderFill.style.width = percentage + '%';
                    volumeSliderHandle.style.left = percentage + '%';
                }
                if (volume <= 0) {
                    musicToggleBtn.className = 'music-off';
                    musicToggleBtn.title = 'Enable Music';
                    musicToggleBtn.querySelector('.mute-slash').style.display = 'block';
                    backgroundMusic.pause();
                } else {
                    if (localStorage.getItem('towerBlocks_musicEnabled') !== 'false') {
                        backgroundMusic.play().catch(e => console.error('Music playback failed:', e));
                        musicToggleBtn.className = 'music-on';
                        musicToggleBtn.title = 'Mute Music';
                        musicToggleBtn.querySelector('.mute-slash').style.display = 'none';
                    }
                }
            }
            
            if (volumeSliderContainer) {
                let isDragging = false;
                function calculateVolumeFromEvent(event) {
                    const rect = volumeSliderContainer.getBoundingClientRect();
                    let x = event.clientX - rect.left;
                    let percentage = x / rect.width;
                    percentage = Math.max(0, Math.min(1, percentage));
                    return percentage;
                }
                volumeSliderContainer.addEventListener('mousedown', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    isDragging = true;
                    const volume = calculateVolumeFromEvent(event);
                    if (currentVolume <= 0 && volume > 0) localStorage.setItem('towerBlocks_musicEnabled', 'true');
                    updateVolume(volume);
                    return false;
                }, true);
                document.addEventListener('mousemove', function(event) {
                    if (isDragging) {
                        event.preventDefault();
                        const volume = calculateVolumeFromEvent(event);
                        updateVolume(volume);
                    }
                }, true);
                document.addEventListener('mouseup', function() {
                    isDragging = false;
                }, true);
                const volumeControl = document.getElementById('volume-control');
                if (volumeControl) {
                    volumeControl.addEventListener('click', function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    }, true);
                }
                updateVolume(currentVolume, false);
            }
            
            if (musicToggleBtn) {
                const musicEnabled = localStorage.getItem('towerBlocks_musicEnabled') !== 'false';
                if (musicEnabled && currentVolume > 0) {
                    musicToggleBtn.className = 'music-on';
                    musicToggleBtn.title = 'Mute Music';
                    musicToggleBtn.querySelector('.mute-slash').style.display = 'none';
                } else {
                    musicToggleBtn.className = 'music-off';
                    musicToggleBtn.title = 'Enable Music';
                    musicToggleBtn.querySelector('.mute-slash').style.display = 'block';
                }
                musicToggleBtn.addEventListener('click', toggleMusic, true);
                const musicToggleWidget = document.getElementById('music-toggle-widget');
                if (musicToggleWidget) {
                    musicToggleWidget.addEventListener('click', function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    }, true);
                }
            }

            // Global startGame function
            window.startGame = function(event) {
                if (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                console.log('startGame triggered');
                
                // Get username
                const username = welcomeNameInput.value.trim() || ('Player_' + Math.floor(Math.random() * 10000));
                
                // Save username
                localStorage.setItem('towerBlocks_playerName', username);
                
                // Update MultiSynq player name if available
                if (multisynqPlayerNameInput) multisynqPlayerNameInput.value = username;
                
                // Try to play music if enabled
                if (localStorage.getItem('towerBlocks_musicEnabled') !== 'false' && currentVolume > 0) {
                    backgroundMusic.play().catch(e => console.error('Music playback failed:', e));
                }
                
                // Hide welcome screen and show game with improved method
                welcomeScreen.style.opacity = '0';
                welcomeScreen.style.transition = 'opacity 0.5s ease';
                welcomeScreen.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    welcomeScreen.style.display = 'none';
                    welcomeScreen.style.visibility = 'hidden';
                    container.style.visibility = 'visible';
                    container.style.display = 'block';
                    document.body.classList.add('game-active');
                    console.log('Game started successfully');
                }, 500);
                
                return false;
            };
            
            // Set up event listeners
            
            // Click event for continue button
            welcomeStartButton.addEventListener('click', function(event) {
                console.log('Continue button clicked');
                startGame(event);
            });
            
            // Enter key on input
            welcomeNameInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') startGame(event);
            });
            
            // Fix click propagation
            welcomeNameInput.addEventListener('click', function(event) {
                event.stopPropagation();
            });
            
            // Keyboard shortcut
            document.addEventListener('keydown', function(event) {
                if ((event.key === 's' || event.key === 'S') && 
                    welcomeScreen && 
                    welcomeScreen.style.display !== 'none') {
                    startGame(event);
                }
            });
            
            // Load saved wallpaper
            const savedWallpaper = localStorage.getItem('towerBlocks_background') || 'default';
            if (bgSelect) {
                bgSelect.value = savedWallpaper;
                changeWallpaper({ 
                    preventDefault: () => {}, 
                    stopPropagation: () => {},
                    target: { value: savedWallpaper }
                });
            }
            
            // Make sure container is initially hidden and welcome screen is visible
            container.style.visibility = 'hidden';
            welcomeScreen.style.opacity = '0';
            welcomeScreen.style.display = 'flex';  // Ensure the welcome screen is visible
            welcomeScreen.style.pointerEvents = 'auto';  // Enable click events
            
            setTimeout(() => {
                welcomeScreen.style.opacity = '1';
                welcomeNameInput.focus();
            }, 100);

            // Initialize default wallpaper or restore from local storage
            const savedBg = localStorage.getItem('towerBlocks_background') || 'default';
            const wallpaperSelect = document.getElementById('wallpaper-select');
            if (wallpaperSelect) {
                wallpaperSelect.value = savedBg;
            }
            changeWallpaper({ target: { value: savedBg } });
        }
    }, 100);
});