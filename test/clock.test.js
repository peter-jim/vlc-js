import { Clock } from '../src/clock.js';

describe('Clock', () => {
  let clock;

  beforeEach(() => {
    clock = new Clock();
  });

  test('should create empty clock', () => {
    expect(clock.values.size).toBe(0);
    expect(clock.isGenesis()).toBe(true);
  });

  test('should increment counter', () => {
    clock.inc(0);
    clock.inc(0);
    expect(clock.get(0)).toBe(2n);
  });

  test('should clear clock', () => {
    clock.inc(0);
    clock.inc(1);
    clock.clear();
    expect(clock.values.size).toBe(0);
    expect(clock.isGenesis()).toBe(true);
  });

  test('should merge clocks correctly', () => {
    const c1 = new Clock();
    c1.inc(0);
    const c2 = new Clock();
    c2.inc(1);
    const c3 = new Clock();
    c3.inc(2);

    c1.merge([c2, c3]);
    expect(c1.get(0)).toBe(1n);
    expect(c1.get(1)).toBe(1n);
    expect(c1.get(2)).toBe(1n);
  });

  test('should calculate diff correctly', () => {
    const c1 = new Clock();
    c1.inc(0);
    c1.inc(0);
    const c2 = new Clock();
    c2.inc(0);

    const diff = c1.diff(c2);
    expect(diff.get(0)).toBe(1n);
  });

  test('should generate index key', () => {
    clock.inc(1);
    clock.inc(2);
    const key = clock.indexKey();
    expect(key).toBe('1-1-2-1-');
  });

  test('should calculate base common', () => {
    const c1 = new Clock();
    c1.inc(0);
    c1.inc(0);
    const c2 = new Clock();
    c2.inc(0);

    const base = c1.baseCommon(c2);
    expect(base.get(0)).toBe(1n);
  });

  test('should compare clocks correctly', () => {
    const c1 = new Clock();
    c1.inc(0);
    const c2 = new Clock();
    c2.inc(0);
    const c3 = new Clock();
    c3.inc(1);

    expect(c1.compareTo(c2)).toBe(0);
    expect(c1.compareTo(c3)).toBe(null);
    expect(c2.compareTo(c3)).toBe(null);

    c1.inc(0);
    expect(c2.compareTo(c1)).toBe(-1);
    expect(c3.compareTo(c1)).toBe(null);
  });

  test('should calculate SHA256 hash', () => {
    clock.inc(0);
    const hash = clock.calculateSHA256();
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(64);
  });

  test('should clone clock', () => {
    clock.inc(0);
    clock.inc(1);
    const cloned = clock.clone();
    expect(cloned.values).not.toBe(clock.values);
    expect(cloned.get(0)).toBe(clock.get(0));
    expect(cloned.get(1)).toBe(clock.get(1));
  });
}); 