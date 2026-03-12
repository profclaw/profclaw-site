/**
 * Spring physics - smooth, organic easing with overshoot.
 * Used for mouse-following tilt, gesture easing, and any
 * value that should feel "physical" rather than linear.
 */
export class Spring {
  value: number;
  velocity = 0;

  constructor(
    initial = 0,
    public stiffness = 0.05,
    public damping = 0.91,
  ) {
    this.value = initial;
  }

  /** Set target and step once, return current value */
  to(target: number): number {
    this.velocity =
      (this.velocity + (target - this.value) * this.stiffness) * this.damping;
    this.value += this.velocity;
    return this.value;
  }

  /** Step toward current target without changing it */
  step(): number {
    return this.to(this.value);
  }

  /** Snap to value immediately (no animation) */
  set(v: number): void {
    this.value = v;
    this.velocity = 0;
  }
}
