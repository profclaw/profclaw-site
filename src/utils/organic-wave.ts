/**
 * Compound sine wave generator for organic, never-repeating motion.
 * Layering multiple sine waves at irrational frequency ratios
 * produces motion that feels alive rather than looping.
 *
 * Usage:
 *   const breathing = new OrganicWave([[1.7, 4.5], [0.6, 2.5, 1.3]]);
 *   const y = breathing.at(time); // sample at current time
 */
export type WavePart = [frequency: number, amplitude: number, phase?: number];

export class OrganicWave {
  constructor(private parts: WavePart[]) {}

  /** Sample the combined wave at time t */
  at(t: number): number {
    return this.parts.reduce(
      (sum, [freq, amp, phase = 0]) => sum + Math.sin(t * freq + phase) * amp,
      0,
    );
  }

  /** Sample with a scale factor (useful for floating/mini mode) */
  atScaled(t: number, scale: number): number {
    return this.at(t) * scale;
  }
}
