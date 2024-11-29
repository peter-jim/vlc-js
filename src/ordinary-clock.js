import SHA256 from 'crypto-js/sha256.js';

export class OrdinaryClock {
  constructor() {
    this.values = new Map();
  }

  // 检查是否为创世时钟
  isGenesis() {
    return Array.from(this.values.values()).every(v => v === 0);
  }

  // 合并两个时钟
  merge(other) {
    const merged = new OrdinaryClock();
    const allKeys = new Set([...this.values.keys(), ...other.values.keys()]);

    for (const id of allKeys) {
      const value = Math.max(
        this.values.get(id) || 0,
        other.values.get(id) || 0
      );
      merged.values.set(id, value);
    }
    return merged;
  }

  // 更新时钟
  update(others, id) {
    let updated = this.clone();
    for (const other of others) {
      updated = updated.merge(other);
    }
    const currentValue = updated.values.get(id) || 0;
    updated.values.set(id, currentValue + 1);
    return updated;
  }

  // 计算基础时钟
  static base(others) {
    const combined = new OrdinaryClock();
    
    for (const clock of others) {
      for (const [key, value] of clock.values) {
        const currentValue = combined.values.get(key);
        if (currentValue === undefined) {
          combined.values.set(key, value);
        } else {
          combined.values.set(key, Math.min(currentValue, value));
        }
      }
    }

    return combined;
  }

  // 计算SHA256哈希
  calculateSHA256() {
    const data = JSON.stringify(Array.from(this.values));
    return SHA256(data).toString();
  }

  // 克隆时钟
  clone() {
    const cloned = new OrdinaryClock();
    for (const [key, value] of this.values) {
      cloned.values.set(key, value);
    }
    return cloned;
  }

  // 比较两个时钟
  compareTo(other) {
    const ge = (clock, otherClock) => {
      for (const [otherId, otherN] of otherClock.values) {
        if (otherN === 0) continue;
        const n = clock.values.get(otherId);
        if (!n || n < otherN) return false;
      }
      return true;
    };

    const selfGe = ge(this, other);
    const otherGe = ge(other, this);

    if (selfGe && otherGe) return 0;
    if (selfGe) return 1;
    if (otherGe) return -1;
    return null;
  }
} 