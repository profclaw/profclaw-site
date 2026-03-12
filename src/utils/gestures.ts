/**
 * Random gesture system for character animation.
 * Schedules gestures at natural-feeling random intervals.
 */

/** Schedule a callback after a random delay between min and max ms */
export function randomDelay(
  min: number,
  max: number,
  fn: () => void,
): ReturnType<typeof setTimeout> {
  return setTimeout(fn, min + Math.random() * (max - min));
}

/**
 * Blink controller - triggers scaleY blinks with natural timing.
 * Supports single and double blinks.
 */
export class Blinker {
  private timeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private eyeGroup: SVGElement | HTMLElement,
    private originX: number,
    private originY: number,
    private minInterval = 1800,
    private maxInterval = 7300,
    private doubleProbability = 0.2,
  ) {}

  start(): void {
    this.schedule();
  }

  stop(): void {
    if (this.timeout) clearTimeout(this.timeout);
  }

  private schedule(): void {
    this.timeout = randomDelay(this.minInterval, this.maxInterval, () =>
      this.blink(),
    );
  }

  private blink(): void {
    const el = this.eyeGroup;
    el.style.transformOrigin = `${this.originX}px ${this.originY}px`;

    // Close
    el.style.transition = 'transform 0.07s ease-in';
    el.style.transform = 'scaleY(0.05)';

    setTimeout(() => {
      // Open
      el.style.transition = 'transform 0.1s ease-out';
      el.style.transform = 'scaleY(1)';

      // 20% chance of double blink
      if (Math.random() < this.doubleProbability) {
        setTimeout(() => {
          el.style.transition = 'transform 0.06s ease-in';
          el.style.transform = 'scaleY(0.05)';
          setTimeout(() => {
            el.style.transition = 'transform 0.1s ease-out';
            el.style.transform = 'scaleY(1)';
            this.schedule();
          }, 60);
        }, 180);
      } else {
        this.schedule();
      }
    }, 70);
  }
}

/**
 * Wave gesture - rapid back-and-forth claw motion (saying hi).
 * Returns a target value that should be eased toward.
 */
export class WaveGesture {
  target = 0;
  private active = false;
  private timeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private minInterval = 5000,
    private maxInterval = 15000,
    private swingRange: [number, number] = [-30, 10],
    private swingVariance = 10,
  ) {}

  start(): void {
    this.schedule();
  }

  stop(): void {
    if (this.timeout) clearTimeout(this.timeout);
  }

  private schedule(): void {
    this.timeout = randomDelay(this.minInterval, this.maxInterval, () =>
      this.wave(),
    );
  }

  private wave(): void {
    if (this.active) {
      this.schedule();
      return;
    }
    this.active = true;
    const swings = 3 + Math.floor(Math.random() * 2);
    let i = 0;

    const swing = (): void => {
      if (i >= swings * 2) {
        this.target = 0;
        this.active = false;
        this.schedule();
        return;
      }
      this.target =
        i % 2 === 0
          ? this.swingRange[0] - Math.random() * this.swingVariance
          : this.swingRange[1] + Math.random() * (this.swingVariance * 0.8);
      i++;
      setTimeout(swing, 120 + Math.random() * 60);
    };
    swing();
  }
}

/**
 * Bounce gesture - excited vertical hop sequence.
 */
export class BounceGesture {
  target = 0;
  private timeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private minInterval = 12000,
    private maxInterval = 27000,
    private hopHeight = [-12, -6],
  ) {}

  start(): void {
    this.schedule();
  }

  stop(): void {
    if (this.timeout) clearTimeout(this.timeout);
  }

  private schedule(): void {
    this.timeout = randomDelay(this.minInterval, this.maxInterval, () =>
      this.bounce(),
    );
  }

  private bounce(): void {
    const count = 2 + Math.floor(Math.random() * 2);
    let i = 0;

    const hop = (): void => {
      if (i >= count) {
        this.target = 0;
        this.schedule();
        return;
      }
      this.target =
        this.hopHeight[0] - Math.random() * Math.abs(this.hopHeight[1]);
      setTimeout(() => {
        this.target = 0;
        i++;
        setTimeout(hop, 150);
      }, 130);
    };
    hop();
  }
}

/**
 * Antenna perk gesture - antennae snap upright briefly (alert/curious).
 * Returns a 0-1 value representing perk intensity.
 */
export class PerkGesture {
  target = 0;
  private timeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private minInterval = 8000,
    private maxInterval = 20000,
    private duration: [number, number] = [800, 1400],
  ) {}

  start(): void {
    this.schedule();
  }

  stop(): void {
    if (this.timeout) clearTimeout(this.timeout);
  }

  private schedule(): void {
    this.timeout = randomDelay(this.minInterval, this.maxInterval, () =>
      this.perk(),
    );
  }

  private perk(): void {
    this.target = 1;
    const dur =
      this.duration[0] + Math.random() * (this.duration[1] - this.duration[0]);
    setTimeout(() => {
      this.target = 0;
      this.schedule();
    }, dur);
  }
}
