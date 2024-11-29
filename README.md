# Verifiable Logical Clock

A JavaScript implementation of Verifiable Logical Clock (VLC) for distributed systems. This library provides a verifiable logical clock construct that can be used in peer-to-peer networks to order events and ensure consistency.

## Features

- Standard logical clock implementation with vector clock properties
- Optimized ordinary clock implementation for better performance
- Support for clock comparison, merging, and difference calculation
- SHA256 hash calculation for verification
- Support for both numeric and string identifiers
- Comprehensive test coverage

## Installation

```bash
npm install verifiable-logical-clock
```

## Usage

### Basic Clock Usage

```javascript
import { Clock } from 'verifiable-logical-clock';

// Create a new clock
const clock = new Clock();

// Increment clock for specific IDs (can be numbers or strings)
clock.inc('alice');
clock.inc('bob');
clock.inc('alice');  // increment again

// Get clock value for an ID
console.log(clock.get('alice'));  // 2
console.log(clock.get('bob'));    // 1

// Check if clock is in genesis state
console.log(clock.isGenesis());  // false

// Calculate verification hash
console.log(clock.calculateSHA256());

// Merge with another clock
const clock2 = new Clock();
clock2.inc('charlie');
clock.merge([clock2]);
```

### Ordinary Clock Usage

```javascript
import { OrdinaryClock } from 'verifiable-logical-clock';

// Create clocks
const clock1 = new OrdinaryClock();
clock1.values.set(1, 10);
clock1.values.set(2, 0);

const clock2 = new OrdinaryClock();
clock2.values.set(1, 0);
clock2.values.set(2, 20);

// Merge clocks
const merged = clock1.merge(clock2);
console.log(merged.values);  // Map { 1 => 10, 2 => 20 }

// Update clock
const updated = clock1.update([clock2], 1);
console.log(updated.values);  // Incremented value for ID 1
```

## API Reference

### Clock Class

- `constructor()`: Create a new clock instance
- `inc(id)`: Increment counter for specified ID
- `get(id)`: Get counter value for specified ID
- `clear()`: Reset all counters
- `merge(others)`: Merge with other clocks
- `diff(other)`: Calculate difference with another clock
- `indexKey()`: Generate index key for the clock
- `baseCommon(other)`: Calculate common base with another clock
- `isGenesis()`: Check if clock is in genesis state
- `compareTo(other)`: Compare with another clock (-1, 0, 1, or null)
- `calculateSHA256()`: Calculate verification hash
- `clone()`: Create a deep copy of the clock

### OrdinaryClock Class

- `constructor()`: Create a new ordinary clock instance
- `isGenesis()`: Check if clock is in genesis state
- `merge(other)`: Merge with another clock
- `update(others, id)`: Update clock with others and increment ID
- `static base(others)`: Calculate base clock from multiple clocks
- `calculateSHA256()`: Calculate verification hash
- `clone()`: Create a deep copy of the clock
- `compareTo(other)`: Compare with another clock (-1, 0, 1, or null)

## Development

### Setup

```bash
git clone https://github.com/yourusername/verifiable-logical-clock.git
cd verifiable-logical-clock
npm install
```

### Testing

```bash
npm test
```

### Building

```bash
npm run build
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## References
- [vlc rust](https://github.com/NagaraTech/chronos/blob/poc_1/crates/vlc/src/lib.rs)
- [Lamport Timestamps](https://en.wikipedia.org/wiki/Lamport_timestamps)
- [Vector Clocks](https://en.wikipedia.org/wiki/Vector_clock) 