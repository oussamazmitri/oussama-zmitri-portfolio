/**
 * Matrix Digital Rain Canvas Engine
 * Lightweight, optimized, paused when inactive or when reduced motion is preferred
 */

export class MatrixRainEngine {
  constructor(canvasElement, state) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.state = state;
    this.animationFrameId = null;
    this.columns = 0;
    this.drops = [];
    this.fontSize = 15;
    this.lastRenderTime = 0;
    this.fpsInterval = 1000 / 30; // Throttled to ~30 FPS for high efficiency

    this.characters = '010101ABCDEFHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Subscribe to state changes
    this.state.subscribe(() => {
      this.checkState();
    });

    this.checkState();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = Array(this.columns).fill(1).map(() => Math.floor(Math.random() * -50));
  }

  checkState() {
    const shouldRun = this.state.template === 'matrix' && 
                      this.state.matrixRain && 
                      !this.state.prefersReducedMotion;

    if (shouldRun && !this.animationFrameId) {
      this.start();
    } else if (!shouldRun && this.animationFrameId) {
      this.stop();
    }
  }

  start() {
    this.lastRenderTime = performance.now();
    const loop = (currentTime) => {
      this.animationFrameId = requestAnimationFrame(loop);
      const elapsed = currentTime - this.lastRenderTime;

      if (elapsed > this.fpsInterval) {
        this.lastRenderTime = currentTime - (elapsed % this.fpsInterval);
        this.draw();
      }
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  draw() {
    if (!this.ctx || !this.canvas) return;

    // Faint translucent overlay to create fading stream trails
    const isDark = this.state.theme === 'dark';
    this.ctx.fillStyle = isDark ? 'rgba(5, 8, 5, 0.08)' : 'rgba(237, 247, 238, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = isDark ? '#00FF41' : '#00A82B';
    this.ctx.font = `${this.fontSize}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const char = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      if (y > 0) {
        this.ctx.fillText(char, x, y);
      }

      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }
  }
}
