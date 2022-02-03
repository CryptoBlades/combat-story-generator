
import * as Seedrandom from 'seedrandom';

export interface ICombatStoryCombatant {
  name: string;
  power: number;
}

export interface ICombatStoryArgs {
  combatants: ICombatStoryCombatant[];
  powerScalar?: number;
  seed?: string;
}

export interface ICombatStoryStep {
  message: string;
  damageDealt: number;
  combatantStats: ICombatStoryCombatant[];
}

export interface ICombatStoryResult {
  steps: ICombatStoryStep[];
}

const clone = (obj: any) => JSON.parse(JSON.stringify(obj));

const getRandomDamageBasedOnPower = (rng: Seedrandom, power: number, powerScalar = 0.2, canMiss = true): number => {
  if(canMiss && rng() < 0.1) return 0;

  return Math.floor(rng() * power * powerScalar);
};

export const getCombatStory = (args: ICombatStoryArgs): ICombatStoryResult => {
  const scalar = args.powerScalar ?? 0.2;

  const result: ICombatStoryResult = {
    steps: []
  };

  const rng = Seedrandom(args.seed || '');

  const addStep = (step: ICombatStoryStep) => {
    result.steps.unshift(step);
  };

  // Do the final step first 
  const finalStep: ICombatStoryStep = {
    message: '',
    damageDealt: 0,
    combatantStats: []
  };

  finalStep.damageDealt = getRandomDamageBasedOnPower(rng, args.combatants[0].power, scalar, false);
  finalStep.message = `${args.combatants[0].name} attacks ${args.combatants[1].name} for ${finalStep.damageDealt} damage!`;
  finalStep.combatantStats = [
    { ...args.combatants[0], power: 0 }, 
    { ...args.combatants[1], power: 0 }
  ];

  addStep(finalStep);

  // calculate the intermediate steps

  // go through each attack, one player at a time
  // update the previous step with the new numbers

  let prevAttacker = 0;
  let currentAttacker = 1;
  while(true) {
    const prevStep: ICombatStoryStep = result.steps[0];

    const step: ICombatStoryStep = {
      message: '',
      damageDealt: 0,
      combatantStats: clone(prevStep.combatantStats)
    };
    
    // calculate current step damage
    step.damageDealt = getRandomDamageBasedOnPower(rng, args.combatants[currentAttacker].power, scalar);
    if(step.damageDealt === 0) {
      step.message = `${args.combatants[currentAttacker].name} misses ${args.combatants[prevAttacker].name}!`;

    } else {
      step.message = `${args.combatants[currentAttacker].name} attacks ${args.combatants[prevAttacker].name} for ${step.damageDealt} damage!`;
    }

    // update the previous steps combatant
    step.combatantStats[prevAttacker].power = prevStep.combatantStats[prevAttacker].power + step.damageDealt;
    
    // add the most recent step
    addStep(step);

    // change the attacker
    currentAttacker++;
    if(currentAttacker >= args.combatants.length) {
      currentAttacker = 0;
    }

    // update the prev attacker
    prevAttacker = currentAttacker - 1;
    if(prevAttacker === -1) {
      prevAttacker = args.combatants.length - 1;
    }

    if(step.combatantStats[prevAttacker].power >= args.combatants[prevAttacker].power) {
      break;
    }
  }

  // do the "initial" step
  const firstStep: ICombatStoryStep = {
    message: '',
    damageDealt: 0,
    combatantStats: args.combatants.map(c => ({ ...c })) 
  };
  
  firstStep.message = `${args.combatants[0].name} engages ${args.combatants[1].name} in combat!`;
  
  addStep(firstStep);

  // calculate the attacker/defender health at each step
  const attackerHPDiff = result.steps[0].combatantStats[0].power - result.steps[1].combatantStats[0].power;
  const defenderHPDiff = result.steps[0].combatantStats[1].power - result.steps[1].combatantStats[1].power;

  result.steps.forEach((step, index) => {
    if(index === 0) return;

    step.combatantStats[0].power = step.combatantStats[0].power + attackerHPDiff;
    step.combatantStats[1].power = step.combatantStats[1].power + defenderHPDiff;
  });

  result.steps = result.steps.filter(step => step.combatantStats[1].power > 0);

  // rewrite negative attacker hp into misses
  result.steps.forEach((step, index) => {
    if(index === 0 || index === result.steps.length - 1) return;

    const nextStep = result.steps[index + 1];
    if(nextStep.combatantStats[0].power > 0) return;
  
    step.message = `${step.combatantStats[1].name} misses ${step.combatantStats[0].name}!`;
    step.damageDealt = 0;
    step.combatantStats[0].power = result.steps[index - 1].combatantStats[0].power;

    result.steps.slice(index + 1).forEach(s => {
      s.combatantStats[0].power = step.combatantStats[0].power;
    });
  });

  // add the final "death" step
  const finalStats = clone(result.steps[result.steps.length - 1].combatantStats);
  finalStats[1].power = 0;

  result.steps.push({
    message: `${args.combatants[1].name} has been defeated by ${args.combatants[0].name}!`,
    damageDealt: 0,
    combatantStats: finalStats
  });
  
  return result;
};