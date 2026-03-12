/**
 * MascotEngine - Interactive character animation system.
 *
 * Composes springs, organic waves, and gestures into a single
 * animation loop. Supports floating companion mode (follows user
 * on scroll) and pauses when off-screen for performance.
 *
 * Usage:
 *   const engine = new MascotEngine('m', { floating: true });
 *   engine.start();
 *   // later: engine.stop();
 */
import { Spring } from './spring';
import { OrganicWave } from './organic-wave';
import {
  Blinker,
  WaveGesture,
  BounceGesture,
  PerkGesture,
} from './gestures';

export interface MascotEngineConfig {
  /** Enable floating companion mode (bottom-right on scroll) */
  floating?: boolean;
  /** Hero section ID to observe for floating trigger */
  heroId?: string;
  /** Default pupil center positions in SVG coords */
  pupils?: { lx: number; ly: number; rx: number; ry: number };
  /** Default highlight positions in SVG coords */
  highlights?: { lx: number; ly: number; rx: number; ry: number };
}

const DEFAULTS = {
  pupils: { lx: 44.5, ly: 50, rx: 58.5, ry: 50 },
  highlights: { lx: 46, ly: 48.5, rx: 60, ry: 48.5 },
};

export class MascotEngine {
  // DOM refs
  private box: HTMLElement;
  private svg: SVGSVGElement;
  private pl: Element | null;
  private pr: Element | null;
  private hl: Element | null;
  private hr: Element | null;
  private eyes: HTMLElement | null;
  private clawL: Element | null;
  private clawR: Element | null;
  private antL: Element | null;
  private antR: Element | null;
  private shadow: Element | null;

  // Config
  private pd: typeof DEFAULTS.pupils;
  private hd: typeof DEFAULTS.highlights;

  // State
  private t: number;
  private mx: number;
  private my: number;
  private vis = true;
  private isFloating = false;
  private animId: number | null = null;

  // Physics
  private tiltX = new Spring(0, 0.05, 0.91);
  private tiltY = new Spring(0, 0.05, 0.91);
  private tiltTargetX = 0;
  private tiltTargetY = 0;

  // Organic motion
  private breath = new OrganicWave([
    [1.7, 4.5],
    [0.6, 2.5, 1.3],
    [3.1, 0.8],
  ]);
  private sway = new OrganicWave([
    [0.4, 1.5],
    [1.1, 0.8, 2],
  ]);
  private antWaveL = new OrganicWave([
    [1.2, 7],
    [0.35, 4.5, 0.8],
  ]);
  private antWaveR = new OrganicWave([
    [1.2, 7, 0.6],
    [0.35, 4.5, 2.8],
  ]);
  private clawWaveL = new OrganicWave([
    [0.9, 5.5],
    [2.3, 2],
    [0.15, 3],
  ]);
  private clawWaveR = new OrganicWave([
    [0.9, 5.5, Math.PI],
    [2.3, 2, 1.2],
    [0.15, 3, 1],
  ]);

  // Gestures
  private blinker: Blinker;
  private waveGesture = new WaveGesture(5000, 12000);
  private bounceGesture = new BounceGesture(10000, 15000);
  private perkGesture = new PerkGesture(6000, 14000);

  // Gesture easing state
  private waveAmt = 0;
  private bounceAmt = 0;
  private antPerkL = 0;
  private antPerkR = 0;

  // Observers
  private heroObserver: IntersectionObserver | null = null;

  constructor(
    prefix: string,
    private config: MascotEngineConfig = {},
  ) {
    const $ = (id: string) => document.getElementById(`${prefix}-${id}`);

    this.box = $('container') as HTMLElement;
    this.svg = $('svg') as unknown as SVGSVGElement;
    this.pl = $('pl');
    this.pr = $('pr');
    this.hl = $('hl');
    this.hr = $('hr');
    this.eyes = $('eyes') as HTMLElement | null;
    this.clawL = $('claw-l');
    this.clawR = $('claw-r');
    this.antL = $('ant-l');
    this.antR = $('ant-r');
    this.shadow = $('shadow');

    this.pd = config.pupils ?? DEFAULTS.pupils;
    this.hd = config.highlights ?? DEFAULTS.highlights;
    this.t = Math.random() * 100;
    this.mx = window.innerWidth / 2;
    this.my = window.innerHeight / 2;

    this.blinker = new Blinker(this.eyes!, 50, 51);
  }

  // ------- Public API -------

  start(): void {
    if (!this.box || !this.svg) return;

    window.addEventListener('mousemove', this.onMouse);
    window.addEventListener('touchmove', this.onTouch, { passive: true });

    this.blinker.start();
    this.waveGesture.start();
    this.bounceGesture.start();
    this.perkGesture.start();

    if (this.config.floating) this.setupFloating();

    this.tick();
  }

  stop(): void {
    window.removeEventListener('mousemove', this.onMouse);
    window.removeEventListener('touchmove', this.onTouch);
    this.blinker.stop();
    this.waveGesture.stop();
    this.bounceGesture.stop();
    this.perkGesture.stop();
    this.heroObserver?.disconnect();
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  // ------- Input handlers -------

  private onMouse = (e: MouseEvent): void => {
    this.mx = e.clientX;
    this.my = e.clientY;
  };

  private onTouch = (e: TouchEvent): void => {
    if (e.touches[0]) {
      this.mx = e.touches[0].clientX;
      this.my = e.touches[0].clientY;
    }
  };

  // ------- Eye tracking -------

  private updateEyes(): void {
    if (!this.pl || !this.pr || !this.hl || !this.hr) return;

    const r = this.svg.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = this.mx - cx;
    const dy = this.my - cy;
    const angle = Math.atan2(dy, dx);
    const dist = Math.min(Math.hypot(dx, dy) / 250, 1);
    const maxMove = 2.8;
    const ex = Math.cos(angle) * maxMove * dist;
    const ey = Math.sin(angle) * maxMove * dist;

    this.pl.setAttribute('cx', String(this.pd.lx + ex));
    this.pl.setAttribute('cy', String(this.pd.ly + ey));
    this.pr.setAttribute('cx', String(this.pd.rx + ex));
    this.pr.setAttribute('cy', String(this.pd.ry + ey));
    this.hl.setAttribute('cx', String(this.hd.lx + ex * 0.5));
    this.hl.setAttribute('cy', String(this.hd.ly + ey * 0.5));
    this.hr.setAttribute('cx', String(this.hd.rx + ex * 0.5));
    this.hr.setAttribute('cy', String(this.hd.ry + ey * 0.5));

    // Store tilt targets (scaled down when floating)
    const tScale = this.isFloating ? 0.5 : 1;
    this.tiltTargetY = (dx / window.innerWidth) * 10 * tScale;
    this.tiltTargetX = (-dy / window.innerHeight) * 6 * tScale;
  }

  // ------- Animation loop -------

  private tick = (): void => {
    if (!this.vis) {
      this.animId = requestAnimationFrame(this.tick);
      return;
    }

    this.t += 0.016;
    this.updateEyes();

    // Scale down motion when floating as mini companion
    const fs = this.isFloating ? 0.35 : 1;

    // Ease gesture values (smooth interpolation)
    this.waveAmt += (this.waveGesture.target - this.waveAmt) * 0.13;
    this.bounceAmt += (this.bounceGesture.target - this.bounceAmt) * 0.15;
    this.antPerkL += (this.perkGesture.target - this.antPerkL) * 0.09;
    this.antPerkR += (this.perkGesture.target - this.antPerkR) * 0.07;

    // Breathing + bounce
    const b = this.breath.atScaled(this.t, fs) + this.bounceAmt * fs;
    const sx = this.sway.atScaled(this.t, fs);

    // Spring tilt toward mouse
    const tx = this.tiltX.to(this.tiltTargetX);
    const ty = this.tiltY.to(this.tiltTargetY);

    this.box.style.transform = `perspective(800px) translateY(${b}px) translateX(${sx}px) rotateX(${tx}deg) rotateY(${ty}deg)`;

    // Shadow responds to height
    if (this.shadow) {
      this.shadow.setAttribute('rx', String(Math.max(16, 22 - Math.abs(b) * 0.3)));
      this.shadow.setAttribute('ry', String(Math.max(2.5, 4 - Math.abs(b) * 0.08)));
    }

    // Antennae: organic wave + tilt influence + perk dampening
    const a1 =
      this.antWaveL.at(this.t) * (1 - this.antPerkL * 0.8) + ty * 0.4;
    const a2 =
      this.antWaveR.at(this.t) * (1 - this.antPerkR * 0.8) + ty * 0.4;
    this.antL?.setAttribute('transform', `rotate(${a1}, 39, 34)`);
    this.antR?.setAttribute('transform', `rotate(${a2}, 61, 34)`);

    // Left claw: idle
    const c1 = this.clawWaveL.at(this.t);
    this.clawL?.setAttribute('transform', `rotate(${c1}, 28, 54)`);

    // Right claw: idle + wave gesture
    const c2 = this.clawWaveR.at(this.t) + this.waveAmt;
    this.clawR?.setAttribute('transform', `rotate(${c2}, 72, 54)`);

    this.animId = requestAnimationFrame(this.tick);
  };

  // ------- Floating companion -------

  private setupFloating(): void {
    const heroId = this.config.heroId ?? 'hero';
    const heroEl = document.getElementById(heroId);
    if (!heroEl) return;

    // Click floating mascot to scroll back to top
    this.box.addEventListener('click', () => {
      if (this.isFloating) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    this.heroObserver = new IntersectionObserver(
      (entries) => {
        const heroVisible = entries[0].isIntersecting;

        if (!heroVisible && !this.isFloating) {
          this.box.classList.add('is-floating');
          this.isFloating = true;
        } else if (heroVisible && this.isFloating) {
          this.box.classList.remove('is-floating');
          this.isFloating = false;
        }

        // Always keep animating
        this.vis = true;
      },
      { threshold: 0.1, rootMargin: '120px 0px 0px 0px' },
    );

    this.heroObserver.observe(heroEl);
  }
}
