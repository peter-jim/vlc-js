import SHA256 from 'crypto-js/sha256.js';

export class Clock {
  constructor() {
    this.values = new Map();
  }

  // Increment counter for specified ID
  inc(id) {
    const value = this.values.get(id) || 0;
    this.values.set(id, value + 1);
  }

  // Get counter value for specified ID
  get(id) {
    return this.values.get(id) || 0;
  }

  // Reset all counters
  clear() {
    this.values.clear();
  }

  // Merge with other clocks
  merge(others) {
    for (const clock of others) {
      for (const [id, value] of clock.values) {
        const currentValue = this.values.get(id) || 0;
        this.values.set(id, currentValue > value ? currentValue : value);
      }
    }
  }

  // Calculate difference with another clock
  diff(other) {
    const result = new Clock();
    for (const [id, value] of this.values) {
      const otherValue = other.values.get(id) || 0;
      result.values.set(id, value > otherValue ? value - otherValue : 0);
    }
    return result;
  }

  // Generate index key for the clock
  indexKey() {
    return Array.from(this.values)
      .map(([index, value]) => `${index}-${value}-`)
      .join('');
  }

  // Calculate common base with another clock
  baseCommon(other) {
    const result = new Clock();
    for (const [id, value] of this.values) {
      const otherValue = other.values.get(id) || 0;
      result.values.set(id, value <= otherValue ? value : otherValue);
    }
    return result;
  }

  // Check if clock is in genesis state
  isGenesis() {
    return Array.from(this.values.values())
      .reduce((sum, value) => sum + value, 0) === 0;
  }

  // Compare with another clock
  compareTo(other) {
    let less = false;
    let greater = false;

    for (const [id, value] of this.values) {
      const otherValue = other.values.get(id);
      if (!otherValue || value > otherValue) {
        greater = true;
      } else if (value < otherValue) {
        less = true;
      }
    }

    for (const id of other.values.keys()) {
      if (!this.values.has(id)) {
        less = true;
      }
    }

    if (less && greater) return null;
    if (less) return -1;
    if (greater) return 1;
    return 0;
  }

  // Calculate SHA256 hash
  calculateSHA256() {
    const data = JSON.stringify(Array.from(this.values));
    return SHA256(data).toString();
  }

  // Create a deep copy of the clock
  clone() {
    const cloned = new Clock();
    for (const [key, value] of this.values) {
      cloned.values.set(key, value);
    }
    return cloned;
  }
} 