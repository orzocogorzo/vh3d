import Game from "../game/index.js";

export default {
  template: `<div id="game">
    <div v-if="!gameLock" class="menu-veil">
      <div v-if="!waiting" class="menu-wrapper">
        <div v-if="!help" class="game-menu menu">
          <h2 class="centered">{{ gameOver ? 'Game Over' : 'Menu' }}</h2>
          <ul class="centered">
            <li v-if="!gameOver"><button @click="gameLock = true" class="button">{{ isTouch ? 'Explorar' : 'Jugar' }}</button></li>
            <li v-if="gameOver"><button @click="restart" class="button">Reiniciar</button></li>
            <li><button @click="exit" class="button">Sortir</button></li>
            <li><button @click="help = true" class="button">Ajuda</button></li>
          </ul>
        </div>
        <div v-if="help" class="help-menu menu">
          <h2 class="centered">Ajuda</h2>
          <ul class="centered">
            <li><button @click="help = false" class="button">Tornar</button></li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="gameLock && isTouch" @click="gameLock = false" class="is-touch-unlocker"></div>
    <div v-if="!isTouch" class="controls-highlights" :class="{'hidden': !showControls}">
      <ul class="centered">
        <li class="movement"><div class="icon"><p><strong>A,W,D,S</strong><br/>per desplaçar-se</p></div></li>
        <li class="jump"><div class="icon"><p><strong>Barra espaciadora</strong><br/>per saltar</p></div></li>
        <li class="camera"><div class="icon"><p><strong>Ratolí</strong><br/>per moure la camara</p></div></li>
        <li class="action"><div class="icon"><p><strong>Click esquerra</strong><br/>per interactuar</p></div></li>
      </ul>
    </div>
    <aside v-if="!isTouch" class="game-aside">
      <ul class="centered">
        <li class="escape"><div class="icon"><p><strong>Menú</strong></p></div></li>
        <li class="map"><div class="icon"><p><strong>Mapa</strong></p></div></li>
        <li class="help"><div class="icon"><p><strong>Controls</strong></p></div></li>
      </ul>
    </aside>
    <canvas id="canvas"></canvas>
  </div>`,
  data() {
    return {
      gameLock: undefined,
      help: false,
      showControls: false,
      game: null,
      waiting: false,
      gameOver: false,
    };
  },
  mounted() {
    document.removeEventListener("unlock", this.onGameUnlock);
    document.addEventListener("unlock", this.onGameUnlock);
    document.removeEventListener("help", this.onHelp);
    document.addEventListener("help", this.onHelp);
    document.removeEventListener("gameover", this.onGameOver);
    document.addEventListener("gameover", this.onGameOver);
    this.game = new Game(this.isTouch);
  },
  computed: {
    isTouch() {
      return (
        "touchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0 ||
        window.innerWidth < window.innerHeight
      );
    },
  },
  methods: {
    exit() {
      this.game.lock();
      this.$router.push({ path: "/" });
    },
    onGameUnlock() {
      this.gameLock = false;
    },
    onHelp() {
      this.showControls = !this.showControls;
    },
    restart() {
      this.game = new Game(this.isTouch);
      this.gameOver = false;
    },
    onGameOver() {
      this.gameOver = true;
    },
  },
  watch: {
    gameLock(to, from) {
      this.game.lock(to);
      if (from !== void 0) {
        this.waiting = true;
        setTimeout(() => {
          this.waiting = false;
        }, 1000);
      }
      if (to) {
        this.showControls = true;
        setTimeout((_) => (this.showControls = false), 3000);
      }
    },
  },
};
