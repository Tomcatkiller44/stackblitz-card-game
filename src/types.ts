export type CardType = 'attack' | 'skill';
export type CardRarity = 'common' | 'uncommon' | 'rare';

export interface CardDef {
  id: string;
  name: string;
  cost: number;
  type: CardType;
  rarity: CardRarity;
  description: string;
  damage?: number;
  block?: number;
  vulnerable?: number;
  drawCards?: number;
  heal?: number;
  thorns?: number;
}

export interface CardInstance extends CardDef {
  uid: string;
}

export interface EnemyDef {
  id: string;
  name: string;
  maxHP: number;
  intents: EnemyIntent[];
}

export interface EnemyIntent {
  type: 'attack' | 'defend' | 'buff';
  value: number;
  label: string;
}

export type GamePhase = 'player' | 'enemy' | 'cleared' | 'won' | 'lost';
export type GameScreen = 'start' | 'battle';

export interface FloatingNumber {
  id: number;
  target: 'player' | 'enemy';
  text: string;
  kind: 'damage' | 'block' | 'heal';
}
