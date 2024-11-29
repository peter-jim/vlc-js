import SHA256 from 'crypto-js/sha256.js';

export class Clock {
  constructor() {
    this.values = new Map();
  }

  // 增加指定ID的计数
  inc(id) {
    const value = this.values.get(id) || 0;
    this.values.set(id, value + 1);
  }

  // 获取指定ID的计数
  get(id) {
    return this.values.get(id) || 0;
  }

  // 清空时钟
  clear() {
    this.values.clear();
  }

  // 合并多个时钟
  merge(others) {
    for (const clock of others) {
      for (const [id, value] of clock.values) {
        const currentValue = this.values.get(id) || 0;
        this.values.set(id, currentValue > value ? currentValue : value);
      }
    }
  }

  // 计算与另一个时钟的差值
  diff(other) {
    const result = new Clock();
    for (const [id, value] of this.values) {
      const otherValue = other.values.get(id) || 0;
      result.values.set(id, value > otherValue ? value - otherValue : 0);
    }
    return result;
  }

  // 生成索引键
  indexKey() {
    return Array.from(this.values)
      .map(([index, value]) => `${index}-${value}-`)
      .join('');
  }

  // 计算两个时钟的共同基础
  baseCommon(other) {
    const result = new Clock();
    for (const [id, value] of this.values) {
      const otherValue = other.values.get(id) || 0;
      result.values.set(id, value <= otherValue ? value : otherValue);
    }
    return result;
  }

  // 检查是否为创世时钟
  isGenesis() {
    return Array.from(this.values.values())
      .reduce((sum, value) => sum + value, 0) === 0;
  }

  // 比较两个时钟
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

  // 计算SHA256哈希
  calculateSHA256() {
    const data = JSON.stringify(Array.from(this.values));
    return SHA256(data).toString();
  }

  // 克隆时钟
  clone() {
    const cloned = new Clock();
    for (const [key, value] of this.values) {
      cloned.values.set(key, value);
    }
    return cloned;
  }
} 