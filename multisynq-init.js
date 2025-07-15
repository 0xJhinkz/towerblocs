document.addEventListener('DOMContentLoaded', function() {
    console.log('MultiSynq integration loading...');
    if (!document.getElementById('multisynq-panel')) {
        createMultiSynqPanel();
    }
    setTimeout(initMultiSynq, 1000);
});

function createMultiSynqPanel() {
    const panel = document.createElement('div');
    panel.id = 'multisynq-panel';
    panel.innerHTML = `
        <div id="multisynq-header">
            <h3>MultiSynq</h3>
            <button id="multisynq-toggle">▼</button>
        </div>
        <div id="multisynq-content">
            <div id="multisynq-counter">Shared Count: 0</div>
            <div id="multisynq-controls">
                <button id="multisynq-increment">+1</button>
                <button id="multisynq-reset">Reset</button>
            </div>
            <div id="multisynq-status">Status: Disconnected</div>
        </div>
    `;
    document.body.appendChild(panel);

    const style = document.createElement('style');
    style.textContent = `
        #multisynq-panel {
            position: fixed;
            bottom: 0;
            right: 10px;
            width: 250px;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 10px 10px 0 0;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            font-family: "Comfortaa", cursive;
            transition: transform 0.3s ease;
            z-index: 1000;
            display: block;
        }
        #multisynq-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background-color: #333344;
            color: white;
            border-radius: 10px 10px 0 0;
            cursor: pointer;
        }
        #multisynq-header h3 {
            margin: 0;
            font-size: 16px;
        }
        #multisynq-toggle {
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 0;
        }
        #multisynq-content {
            padding: 15px;
            max-height: 200px;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        #multisynq-content.collapsed {
            max-height: 0;
            padding-top: 0;
            padding-bottom: 0;
        }
        #multisynq-counter {
            font-size: 18px;
            margin-bottom: 10px;
            color: #333344;
        }
        #multisynq-controls {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }
        #multisynq-increment, #multisynq-reset {
            padding: 5px 15px;
            font-family: "Comfortaa", cursive;
            border: 2px solid #333344;
            background-color: transparent;
            color: #333344;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        #multisynq-increment:hover, #multisynq-reset:hover {
            background-color: #333344;
            color: white;
        }
        #multisynq-status {
            font-size: 12px;
            color: #666;
        }
    `;
    document.head.appendChild(style);
}

function initMultiSynq() {
    class GameStateModel extends Multisynq.Model {
        init() {
            this.highScores = [];
            this.activePlayers = {};
            this.gameEvents = [];
            this.currentWallpaper = 'default';
            this.subscribe(this.sessionId, "gameEnded", this.handleGameEnded.bind(this));
            this.subscribe(this.sessionId, "playerJoined", this.handlePlayerJoined.bind(this));
            this.subscribe(this.sessionId, "playerLeft", this.handlePlayerLeft.bind(this));
            this.subscribe(this.sessionId, "blockPlaced", this.handleBlockPlaced.bind(this));
            this.subscribe(this.sessionId, "wallpaperChanged", this.handleWallpaperChanged.bind(this));
        }
        handleGameEnded(data) {
            if (data && data.score && data.playerName) {
                this.highScores.push({ playerName: data.playerName, score: data.score, timestamp: new Date().toISOString() });
                this.highScores.sort((a, b) => b.score - a.score);
                if (this.highScores.length > 10) this.highScores = this.highScores.slice(0, 10);
                this.gameEvents.push({ type: 'gameEnded', playerName: data.playerName, score: data.score, timestamp: new Date().toISOString() });
                this.publish(this.sessionId, "highScoresChanged", this.highScores);
                this.publish(this.sessionId, "gameEventAdded", this.gameEvents[this.gameEvents.length - 1]);
            }
        }
        handlePlayerJoined(data) {
            if (data && data.playerId && data.playerName) {
                this.activePlayers[data.playerId] = { name: data.playerName, joinedAt: new Date().toISOString() };
                this.gameEvents.push({ type: 'playerJoined', playerName: data.playerName, timestamp: new Date().toISOString() });
                this.publish(this.sessionId, "activePlayersChanged", this.activePlayers);
                this.publish(this.sessionId, "gameEventAdded", this.gameEvents[this.gameEvents.length - 1]);
            }
        }
        handlePlayerLeft(data) {
            if (data && data.playerId) {
                const playerName = this.activePlayers[data.playerId]?.name || 'Unknown player';
                delete this.activePlayers[data.playerId];
                this.gameEvents.push({ type: 'playerLeft', playerName, timestamp: new Date().toISOString() });
                this.publish(this.sessionId, "activePlayersChanged", this.activePlayers);
                this.publish(this.sessionId, "gameEventAdded", this.gameEvents[this.gameEvents.length - 1]);
            }
        }
        handleBlockPlaced(data) {
            if (data && data.playerName) {
                this.gameEvents.push({ type: 'blockPlaced', playerName: data.playerName, height: data.height || 'unknown', timestamp: new Date().toISOString() });
                if (this.gameEvents.length > 50) this.gameEvents = this.gameEvents.slice(-50);
                this.publish(this.sessionId, "gameEventAdded", this.gameEvents[this.gameEvents.length - 1]);
            }
        }
        handleWallpaperChanged(data) {
            if (data && data.wallpaper) {
                this.currentWallpaper = data.wallpaper;
                this.gameEvents.push({ type: 'wallpaperChanged', playerName: data.playerName || 'Someone', wallpaper: data.wallpaper, timestamp: new Date().toISOString() });
                this.publish(this.sessionId, "wallpaperUpdated", this.currentWallpaper);
                this.publish(this.sessionId, "gameEventAdded", this.gameEvents[this.gameEvents.length - 1]);
            }
        }
    }
    class CounterModel extends Multisynq.Model {
        init() {
            this.count = 0;
            this.subscribe(this.sessionId, "increment", this.handleIncrement.bind(this));
            this.subscribe(this.sessionId, "reset", this.handleReset.bind(this));
        }
        handleIncrement() {
            this.count += 1;
            this.publish(this.sessionId, "countChanged", this.count);
        }
        handleReset() {
            this.count = 0;
            this.publish(this.sessionId, "countChanged", this.count);
        }
    }
    class CounterView extends Multisynq.View {
        constructor(model) {
            super(model);
            this.subscribe(this.sessionId, "countChanged", this.updateDisplay.bind(this));
            this.setupUI();
            this.updateDisplay(model.count || 0);
        }
        setupUI() {
            var _this = this;
            const incrementButton = document.getElementById("multisynq-increment");
            if (incrementButton) {
                incrementButton.addEventListener("click", function() { _this.publish(_this.sessionId, "increment"); });
            }
            const resetButton = document.getElementById("multisynq-reset");
            if (resetButton) {
                resetButton.addEventListener("click", function() { _this.publish(_this.sessionId, "reset"); });
            }
        }
        updateDisplay(count) {
            const counterElement = document.getElementById("multisynq-counter");
            if (counterElement) {
                counterElement.textContent = "Shared Count: " + count;
            }
        }
    }
    class GameStateView {
        constructor(model) {
            this.model = model;
            this.highScoresList = document.getElementById('highScoresList');
            this.activePlayersList = document.getElementById('activePlayersList');
            this.eventsList = document.getElementById('eventsList');
            this.playerNameInput = document.getElementById('playerNameInput');
            const savedName = localStorage.getItem('towerBlocks_playerName');
            if (this.playerNameInput) {
                this.playerNameInput.value = savedName || 'Player_' + Math.floor(Math.random() * 10000);
                this.playerNameInput.addEventListener('change', () => {
                    localStorage.setItem('towerBlocks_playerName', this.playerNameInput.value);
                });
            }
            this.model.on("highScoresChanged", this.updateHighScores.bind(this));
            this.model.on("activePlayersChanged", this.updateActivePlayers.bind(this));
            this.model.on("gameEventAdded", this.addGameEvent.bind(this));
            this.model.on("wallpaperUpdated", this.updateWallpaper.bind(this));
            this._playerId = 'player_' + Math.random().toString(36).substr(2, 9);
            model.trigger("playerJoined", {
                playerId: this._playerId, playerName: this.playerNameInput ? this.playerNameInput.value : 'Anonymous'
            });
            document.addEventListener('gameOver', (event) => {
                if (event.detail && typeof event.detail.score !== 'undefined') {
                    model.trigger("gameEnded", {
                        score: event.detail.score,
                        playerName: this.playerNameInput ? this.playerNameInput.value : 'Anonymous'
                    });
                }
            });
            document.addEventListener('blockPlaced', (event) => {
                model.trigger("blockPlaced", {
                    playerName: this.playerNameInput ? this.playerNameInput.value : 'Anonymous',
                    height: event.detail?.height || 0
                });
            });
            window.addEventListener('beforeunload', () => {
                model.trigger("playerLeft", { playerId: this._playerId });
            });
            this.updateWallpaper(model.currentWallpaper);
        }
        updateHighScores(highScores) {
            if (!this.highScoresList) return;
            this.highScoresList.innerHTML = '';
            if (highScores && highScores.length > 0) {
                highScores.forEach((score, index) => {
                    const li = document.createElement('li');
                    li.textContent = `${index + 1}. ${score.playerName}: ${score.score}`;
                    this.highScoresList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'No high scores yet';
                this.highScoresList.appendChild(li);
            }
        }
        updateActivePlayers(activePlayers) {
            if (!this.activePlayersList) return;
            this.activePlayersList.innerHTML = '';
            if (activePlayers && Object.keys(activePlayers).length > 0) {
                Object.values(activePlayers).forEach(player => {
                    const li = document.createElement('li');
                    li.textContent = player.name;
                    this.activePlayersList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'No active players';
                this.activePlayersList.appendChild(li);
            }
        }
        addGameEvent(event) {
            if (!this.eventsList) return;
            const li = document.createElement('li');
            switch(event.type) {
                case 'gameEnded':
                    li.textContent = `${event.playerName} scored ${event.score}`; break;
                case 'playerJoined':
                    li.textContent = `${event.playerName} joined the game`; break;
                case 'playerLeft':
                    li.textContent = `${event.playerName} left the game`; break;
                case 'blockPlaced':
                    li.textContent = `${event.playerName} placed a block at height ${event.height}`; break;
                case 'wallpaperChanged':
                    li.textContent = `${event.playerName} changed background to ${event.wallpaper}`; break;
                default:
                    li.textContent = `Unknown event: ${event.type}`;
            }
            const time = new Date(event.timestamp).toLocaleTimeString();
            li.textContent += ` (${time})`;
            this.eventsList.prepend(li);
            while (this.eventsList.children.length > 20) {
                this.eventsList.removeChild(this.eventsList.lastChild);
            }
        }
        updateWallpaper(wallpaper) {
            const background = document.getElementById('wallpaper-background');
            const wallpapers = {
                'default': 'background-color: #D0CBC7;',
                'mountain-sunset': 'background-image: url("assets/images/mountain-sunset.jpg");',
                'tropical-beach': 'background-image: url("assets/images/tropical-beach.jpg");',
                'cyberpunk-city': 'background-image: url("assets/images/cyberpunk-city.jpg");',
                'starry-galaxy': 'background-image: url("assets/images/starry-galaxy.jpg");',
                'enchanted-forest': 'background-image: url("assets/images/enchanted-forest.jpg");'
            };
            background.setAttribute('style', wallpapers[wallpaper] || wallpapers['default']);
            document.getElementById('wallpaper-select').value = wallpaper;
            document.getElementById('multisynq-wallpaper-select').value = wallpaper;
        }
    }
    const statusDisplay = document.getElementById('multisynq-status');
    if (statusDisplay) {
        statusDisplay.textContent = 'Status: Connecting...';
    }
    console.log("Connecting to MultiSynq...");
    Multisynq.Client.create({
        apiKey: "sk.eyJ1c2VySWQiOiJ1c2VyXzIzeW5jYWZvM3YiLCJhcHBJZCI6ImFwcF8yNDAxNDRvcTA0IiwiYXBpS2V5SWQiOiJrZXlfMjQwMTQ1YXQxcyIsInNpZ25hdHVyZSI6IjkxMGNlMjI1OWY1NjM4MmQ5YzBiZjFlZWM4ZjU4YjgyNmY1ZGJiM2UxMjVlM2Y5NTBjMTJlMWZiNzliYzc2MjMiLCJpYXQiOjE3MTY0MDg1NzcsImV4cCI6MTg3NDAyMTM3N30",
        roomId: "tower-blocks-game",
        models: { counter: CounterModel, gameState: GameStateModel }
    }).then(function(client) {
        console.log("Connected to MultiSynq:", client.roomId);
        if (statusDisplay) {
            statusDisplay.textContent = 'Status: Connected';
            statusDisplay.style.color = 'green';
        }
        window.multisynqClient = client;
        const counterView = new CounterView(client.models.counter);
        const gameStateView = new GameStateView(client.models.gameState);
        setupPanelToggle();
        window.debugMultiSynq = function() {
            return { client, models: client.models, roomId: client.roomId, connected: true, counterView, gameStateView };
        };
    }).catch(function(error) {
        console.error("Failed to connect to MultiSynq:", error);
        if (statusDisplay) {
            statusDisplay.textContent = 'Status: Connection Error';
            statusDisplay.style.color = 'red';
        }
        window.debugMultiSynq = function() { return { error, connected: false }; };
    });
}

function setupPanelToggle() {
    const toggleButton = document.getElementById('multisynq-toggle');
    const content = document.getElementById('multisynq-content');
    const header = document.getElementById('multisynq-header');
    if (toggleButton && content && header) {
        function togglePanel() {
            content.classList.toggle('collapsed');
            toggleButton.textContent = content.classList.contains('collapsed') ? '▲' : '▼';
        }
        toggleButton.addEventListener('click', togglePanel);
        header.addEventListener('click', function(e) {
            if (e.target !== toggleButton) { togglePanel(); }
        });
        setTimeout(togglePanel, 1000);
    }
}

function listenForGameEvents(client) {
    console.log("GameStateView is now handling game events");
}