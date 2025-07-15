# 🏗️ Tower Blocks Game

A modern 3D tower building game with multiplayer features, beautiful animations, and immersive sound effects.

## 🎮 Features

### Core Gameplay
- **3D Tower Building**: Stack blocks to build the tallest tower possible
- **Physics-Based**: Realistic block physics with Three.js
- **Smooth Animations**: Powered by GSAP and Anime.js
- **Responsive Design**: Works on desktop and mobile devices

### Visual & Audio
- **Purple Theme**: Cohesive purple color scheme throughout the UI
- **Dynamic Backgrounds**: Choose from 5 beautiful wallpapers
- **Bouncy Title Animation**: Eye-catching animated title with Anime.js
- **Click Sound Effects**: Audio feedback for every interaction
- **Background Music**: Looping background music with volume control

### User Interface
- **Clean Welcome Screen**: Streamlined player entry
- **Draggable Widget**: Movable and minimizable MultiSynq panel
- **Volume Controls**: Music toggle and volume slider
- **Smooth Transitions**: Anime.js powered animations

### Multiplayer Features
- **Real-time Multiplayer**: Powered by MultiSynq
- **Live Leaderboards**: See high scores from all players
- **Active Players**: View who's currently playing
- **Shared Events**: Real-time game events and notifications

## 🚀 Getting Started

### Prerequisites
- Modern web browser with WebGL support
- Local web server (for development)

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd Tower-Blocks
```

2. Start a local web server:
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js
npx http-server -p 8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

## 🎯 How to Play

1. **Enter Your Name**: Type your name in the welcome screen
2. **Start Playing**: Click "Continue" to begin
3. **Stack Blocks**: Click or press spacebar to place blocks
4. **Build Higher**: Stack blocks perfectly to build the tallest tower
5. **Compete**: Your score is shared with other players in real-time

## 🛠️ Technical Stack

- **3D Graphics**: Three.js r83
- **Animations**: GSAP TweenMax & Anime.js 3.2.1
- **Multiplayer**: MultiSynq Client 0.5.0
- **Audio**: Web Audio API & HTML5 Audio
- **Styling**: CSS3 with Google Fonts (Comfortaa)
- **JavaScript**: ES6+ features

## 📁 Project Structure

```
Tower-Blocks/
├── index.html              # Main HTML file
├── main.js                 # Core game logic (Three.js)
├── welcome-screen.js       # Welcome screen handler
├── style.css              # Main stylesheet
├── click-sound.js         # Sound effects manager
├── multisynq-init.js      # Multiplayer integration
├── app-loader.js          # Dependency loader
├── audio-preloader.js     # Audio preloading
├── assets/
│   ├── audio/
│   │   └── Arf_Gang.mp3   # Background music
│   └── images/            # Background wallpapers
└── README.md              # This file
```

## 🎨 Customization

### Changing Colors
The game uses a purple theme (`#8B4CBF`). To customize colors, modify the CSS variables in `style.css`.

### Adding Backgrounds
1. Add your image to `assets/images/`
2. Update the wallpaper options in `index.html`
3. Add the new option to the `changeWallpaper` function

### Sound Effects
Sound effects are generated using the Web Audio API. Modify `click-sound.js` to customize:
- Click sounds
- Block placement sounds
- Game over sounds

## 🔧 Configuration

### MultiSynq Settings
Update the MultiSynq configuration in `multisynq-init.js`:
- API Key
- Room ID
- Server endpoints

### Audio Settings
Modify audio settings in `welcome-screen.js`:
- Default volume
- Music autoplay
- Sound effect preferences

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Three.js community for the excellent 3D library
- GSAP for smooth animations
- Anime.js for beautiful UI animations
- MultiSynq for multiplayer capabilities
- Font: Comfortaa from Google Fonts

## 🐛 Known Issues

- TouchStart events disabled on mobile to prevent double-tap issues
- Some browsers may require user interaction before playing audio

## 🚀 Future Enhancements

- [ ] Power-ups and special blocks
- [ ] Tournament mode
- [ ] Social sharing features
- [ ] Mobile app version
- [ ] Advanced graphics settings

---

Built with ❤️ and lots of ☕
