
# Combat Story Generator

A small tool to build a storied combat with minimal information.

## Installation

`npm install combat-story-generator`

## Sample Usage

```ts
import { getCombatStory } from 'combat-story-generator';

const story = getCombatStory({
  combatants: [
    { name: 'Player 1', power: 9000 },
    { name: 'Player 2', power: 10000 },
  ],
  seed: Math.random().toString(),
  powerScalar: 0.2
});
```

### Arguments

* `combatants`: An array of combatants. Each combatant has a `name` and `power` property.
* `seed`: A seed to use for the random number generator. Not required.
* `powerScalar`: The maximum amount of damage each combatant can hit based on their power per hit. Smaller numbers means longer combats.

### Sample Story Building

A sample story could be built with a function like this:

```
const formatStory = (story: ICombatStoryResult) => {
  const res = story.steps.map(step => {
    return `[${step.combatantStats[0]?.power ?? -1}/${step.combatantStats[1]?.power ?? -1}] ${step.message}`;
  });

  return res.join('\n');
};
```

Which would cause an output like this:

```
[9999/10000] Player 1 engages Player 2 in combat!
[9999/10000] Player 1 attacks Player 2 for 1340 damage!
[9999/8660] Player 2 attacks Player 1 for 1939 damage!
[8060/8660] Player 1 attacks Player 2 for 1284 damage!
[8060/7376] Player 2 attacks Player 1 for 1102 damage!
[6958/7376] Player 1 attacks Player 2 for 1123 damage!
[6958/6253] Player 2 attacks Player 1 for 212 damage!
[6746/6253] Player 1 attacks Player 2 for 1250 damage!
[6746/5003] Player 2 attacks Player 1 for 828 damage!
[5918/5003] Player 1 attacks Player 2 for 919 damage!
[5918/4084] Player 2 attacks Player 1 for 604 damage!
[5314/4084] Player 1 attacks Player 2 for 1485 damage!
[5314/2599] Player 2 attacks Player 1 for 1013 damage!
[4301/2599] Player 1 attacks Player 2 for 1649 damage!
[4301/950] Player 2 attacks Player 1 for 204 damage!
[4097/950] Player 1 misses Player 2!
[4097/950] Player 2 attacks Player 1 for 1848 damage!
[2249/950] Player 1 attacks Player 2 for 359 damage!
[2249/591] Player 2 attacks Player 1 for 1357 damage!
[892/591] Player 1 attacks Player 2 for 1481 damage!
[892/0] Player 2 has been defeated by Player 1!
```