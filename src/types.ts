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
  impact: ImpactStyle;
  art: CardArtKind;
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

export type ShieldStyle = 'shield' | 'shield-reinforced' | 'shield-spiky';
export type ImpactStyle = 'slash' | 'x-slash' | 'bonk' | ShieldStyle;
export type CardArtKind = 'sword' | 'sword-reinforced' | 'sword-reversed' | ShieldStyle;

export interface ImpactEffect {
  id: number;
  style: ImpactStyle;
  target: 'player' | 'enemy';
}

export interface FloatingNumber {
  id: number;
  target: 'player' | 'enemy';
  text: string;
  kind: 'damage' | 'block' | 'heal';
}
