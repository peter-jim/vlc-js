import { OrdinaryClock } from '../src/ordinary-clock.js';

describe('OrdinaryClock', () => {
  let clock;

  beforeEach(() => {
    clock = new OrdinaryClock();
  });

  test('should create empty clock', () => {
    expect(clock.values.size).toBe(0);
    expect(clock.isGenesis()).toBe(true);
  });

  test('should merge clocks correctly', () => {
    const clock1 = new OrdinaryClock();
    clock1.values.set(1, 10n);
    clock1.values.set(2, 0n);

    const clock2 = new OrdinaryClock();
    clock2.values.set(1, 5n);
    clock2.values.set(2, 20n);

    const merged = clock1.merge(clock2);
    expect(merged.values.get(1)).toBe(10n);
    expect(merged.values.get(2)).toBe(20n);
  });

  test('should update clock correctly', () => {
    const clock1 = new OrdinaryClock();
    clock1.values.set(1, 10n);
    
    const clock2 = new OrdinaryClock();
    clock2.values.set(1, 5n);

    const updated = clock1.update([clock2], 1);
    expect(updated.values.get(1)).toBe(11n);
  });

  test('should calculate base clock', () => {
    const clock1 = new OrdinaryClock();
    clock1.values.set(1, 10n);
    clock1.values.set(2, 0n);

    const clock2 = new OrdinaryClock();
    clock2.values.set(1, 5n);
    clock2.values.set(2, 20n);

    const base = OrdinaryClock.base([clock1, clock2]);
    expect(base.values.get(1)).toBe(5n);
    expect(base.values.get(2)).toBe(0n);
  });

  test('should calculate SHA256 hash', () => {
    clock.values.set(1, 10n);
    const hash = clock.calculateSHA256();
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(64);
  });

  test('should clone clock', () => {
    clock.values.set(1, 10n);
    clock.values.set(2, 20n);
    const cloned = clock.clone();
    expect(cloned.values).not.toBe(clock.values);
    expect(cloned.values.get(1)).toBe(clock.values.get(1));
    expect(cloned.values.get(2)).toBe(clock.values.get(2));
  });

  test('should compare clocks correctly', () => {
    const clock1 = new OrdinaryClock();
    clock1.values.set(1, 10n);
    clock1.values.set(2, 5n);

    const clock2 = new OrdinaryClock();
    clock2.values.set(1, 5n);
    clock2.values.set(2, 20n);

    expect(clock1.compareTo(clock2)).toBe(null);

    const clock3 = new OrdinaryClock();
    clock3.values.set(1, 5n);
    clock3.values.set(2, 3n);

    expect(clock1.compareTo(clock3)).toBe(1);
    expect(clock3.compareTo(clock1)).toBe(-1);
  });
}); 