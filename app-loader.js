// This file is used to load all necessary dependencies and ensure they load in the correct order

// Wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Tower Blocks game loading...');
  
  // Check if all required libraries are loaded
  let allDepsLoaded = true;
  
  if (typeof THREE === 'undefined') {
    console.error('THREE.js is not loaded!');
    allDepsLoaded = false;
  }
  
  if (typeof TweenMax === 'undefined') {
    console.error('GSAP TweenMax is not loaded!');
    allDepsLoaded = false;
  }
  
  if (typeof Multisynq === 'undefined') {
    console.error('Multisynq library is not loaded!');
    allDepsLoaded = false;
  }
  
  if (allDepsLoaded) {
    console.log('All dependencies loaded successfully!');
    
    // Initialize the game
    if (typeof window.GameConstructor === 'function') {
      console.log('Initializing Tower Blocks game...');
      window.game = new window.GameConstructor();
    } else {
      console.error('Game constructor not found!');
    }
  } else {
    console.error('Some dependencies failed to load. Game initialization aborted.');
  }
});
