

import { getCombatStory, ICombatStoryResult } from '../src';

const formatStory = (story: ICombatStoryResult) => {
  const res = story.steps.map(step => {
    return `[${step.combatantStats[0]?.power ?? -1}/${step.combatantStats[1]?.power ?? -1}] ${step.message}`;
  });

  return res.join('\n');
};

/*
console.log(formatStory(getCombatStory({
  combatants: [
    { name: 'Chriserus', power: 10000 },
    { name: 'Levitate', power: 9500 }
  ],
  seed: '2'
})))

console.log();
*/

console.log(formatStory(getCombatStory({
  combatants: [
    { name: 'Kroge', power: 9999 },
    { name: 'Seiyria', power: 10000 },
  ],
  seed: Math.random().toString()
})))