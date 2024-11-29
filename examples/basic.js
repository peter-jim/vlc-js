import { Clock, OrdinaryClock } from '../src/index.js';

// Clock examples
console.log('=== Clock Examples ===');

const clock = new Clock();
clock.inc(1);
clock.inc(2);
clock.inc('alice');
clock.inc('alice');

clock.values.set('alice', 101);
console.log('Clock values:', clock.values);
console.log('Is genesis?', clock.isGenesis());
console.log('Clock hash:', clock.calculateSHA256());

const clock2 = new Clock();
clock2.inc('bob');
clock.merge([clock2]);

console.log('After merge:', Object.fromEntries(clock.values));
console.log('merge result:', clock.compareTo(clock2));

// OrdinaryClock examples
console.log('\n=== OrdinaryClock Examples ===');

const oc1 = new OrdinaryClock();
oc1.values.set(1, 10);
oc1.values.set(2, 0);
oc1.values.set(3, 5);

const oc2 = new OrdinaryClock();
oc2.values.set(1, 0);
oc2.values.set(2, 20);
oc2.values.set(3, 2);

console.log('Clock 1:', Object.fromEntries(oc1.values));
console.log('Clock 2:', Object.fromEntries(oc2.values));

const merged = oc1.merge(oc2);
console.log('Merged clock:', Object.fromEntries(merged.values));

const updated = oc1.update([oc2], 1);
console.log('Updated clock:', Object.fromEntries(updated.values));

const base = OrdinaryClock.base([oc1, oc2]);
console.log('Base clock:', Object.fromEntries(base.values)); 