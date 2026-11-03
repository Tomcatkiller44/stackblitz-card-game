import type { CardDef, EnemyDef } from './types';

export const CARDS: CardDef[] = [
  {
    id: 'strike',
    name: 'Strike',
    cost: 1,
    type: 'attack',
    rarity: 'common',
    description: 'Deal 6 damage.',
    damage: 6,
    impact: 'slash',
  },
  {
    id: 'defend',
    name: 'Defend',
    cost: 1,
    type: 'skill',
    rarity: 'common',
    description: 'Gain 5 Block.',
    block: 5,
    impact: 'shield',
    art: 'shield',
  },
  {
    id: 'bash',
    name: 'Bash',
    cost: 2,
    type: 'attack',
    rarity: 'uncommon',
    description: 'Deal 8 damage.\nApply 2 Vulnerable.',
    damage: 8,
    vulnerable: 2,
    impact: 'slash',
  },
  {
    id: 'cleave',
    name: 'Cleave',
    cost: 1,
    type: 'attack',
    rarity: 'common',
    description: 'Deal 9 damage.',
    damage: 9,
    impact: 'x-slash',
  },
  {
    id: 'pommel',
    name: 'Pommel Strike',
    cost: 1,
    type: 'attack',
    rarity: 'uncommon',
    description: 'Deal 7 damage.\nDraw 1 card.',
    damage: 7,
    drawCards: 1,
    impact: 'bonk',
  },
  {
    id: 'bulwark',
    name: 'Bulwark',
    cost: 2,
    type: 'skill',
    rarity: 'uncommon',
    description: 'Gain 12 Block.',
    block: 12,
    impact: 'shield-reinforced',
    art: 'shield-reinforced',
  },
  {
    id: 'thornmail',
    name: 'Thornmail',
    cost: 1,
    type: 'skill',
    rarity: 'uncommon',
    description: 'Gain 4 Block.\nWhen attacked, deal 2 damage back.',
    block: 4,
    thorns: 2,
    impact: 'shield-spiky',
    art: 'shield-spiky',
  },
];

export const STARTER_DECK: string[] = [
  'strike', 'strike', 'strike', 'strike',
  'defend', 'defend', 'defend',
  'bash', 'cleave', 'pommel',
  'bulwark', 'thornmail',
];

export const ENEMIES: EnemyDef[] = [
  {
    id: 'slime',
    name: 'Slime',
    maxHP: 45,
    intents: [
      { type: 'attack', value: 11, label: 'Tackle' },
      { type: 'defend', value: 6, label: 'Harden' },
      { type: 'attack', value: 16, label: 'Crush' },
      { type: 'attack', value: 11, label: 'Tackle' },
      { type: 'defend', value: 6, label: 'Harden' },
    ],
  },
  {
    id: 'zombie',
    name: 'Zombie',
    maxHP: 55,
    intents: [
      { type: 'attack', value: 12, label: 'Claw' },
      { type: 'defend', value: 8, label: 'Rotten Guard' },
      { type: 'attack', value: 15, label: 'Bite' },
    ],
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    maxHP: 70,
    intents: [
      { type: 'attack', value: 14, label: 'Slash' },
      { type: 'defend', value: 10, label: 'Bone Shield' },
      { type: 'attack', value: 18, label: 'Skewer' },
    ],
  },
  {
    id: 'demon',
    name: 'Demon',
    maxHP: 90,
    intents: [
      { type: 'attack', value: 18, label: 'Hellfire' },
      { type: 'defend', value: 12, label: 'Infernal Ward' },
      { type: 'attack', value: 22, label: 'Cleave' },
    ],
  },
  {
    id: 'dragon',
    name: 'Dragon',
    maxHP: 120,
    intents: [
      { type: 'attack', value: 20, label: 'Tail Sweep' },
      { type: 'defend', value: 15, label: 'Scale Armor' },
      { type: 'attack', value: 28, label: 'Inferno Breath' },
      { type: 'attack', value: 24, label: 'Claw Rend' },
    ],
  },
];

export const PLAYER_MAX_HP = 72;
export const PLAYER_MAX_ENERGY = 3;
export const HAND_SIZE = 5;
export const RECOVERY_BETWEEN_FOES = 20;
