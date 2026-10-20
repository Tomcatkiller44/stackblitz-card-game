import { writable, derived, get } from 'svelte/store';
import type { CardInstance, GamePhase, FloatingNumber } from './types';
import { CARDS, ENEMY, STARTER_DECK, PLAYER_MAX_HP, PLAYER_MAX_ENERGY, HAND_SIZE } from './gameData';
import { persistentWritable } from './persistentStore';

let uidCounter = 0;
const nextUid = () => `c${++uidCounter}`;

let floatId = 0;

function buildDeck(): CardInstance[] {
  return STARTER_DECK.map((id) => {
    const def = CARDS.find((c) => c.id === id)!;
    return { ...def, uid: nextUid() };
  });
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drawCards(
  deck: CardInstance[],
  discard: CardInstance[],
  n: number
): { hand: CardInstance[]; deck: CardInstance[]; discard: CardInstance[] } {
  let d = [...deck];
  let dis = [...discard];
  const drawn: CardInstance[] = [];

  for (let i = 0; i < n; i++) {
    if (d.length === 0) {
      if (dis.length === 0) break;
      d = shuffle(dis);
      dis = [];
    }
    drawn.push(d[0]);
    d = d.slice(1);
  }

  return { hand: drawn, deck: d, discard: dis };
}

export interface GameState {
  deck: CardInstance[];
  hand: CardInstance[];
  discard: CardInstance[];
  playerHP: number;
  playerBlock: number;
  energy: number;
  enemyHP: number;
  enemyBlock: number;
  enemyVulnerable: number;
  intentIndex: number;
  phase: GamePhase;
  turn: number;
  log: string[];
}

function isGamePhase(value: unknown): value is GamePhase {
  return value === 'player' || value === 'enemy' || value === 'won' || value === 'lost';
}

function isCardInstance(value: unknown): value is CardInstance {
  if (!value || typeof value !== 'object') return false;
  const card = value as Partial<CardInstance>;
  return typeof card.uid === 'string' && CARDS.some((definition) => definition.id === card.id);
}

function isGameState(value: unknown): value is GameState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<GameState>;
  const numericFields: (keyof GameState)[] = [
    'playerHP', 'playerBlock', 'energy', 'enemyHP', 'enemyBlock',
    'enemyVulnerable', 'intentIndex', 'turn',
  ];

  return (
    Array.isArray(state.deck) && state.deck.every(isCardInstance) &&
    Array.isArray(state.hand) && state.hand.every(isCardInstance) &&
    Array.isArray(state.discard) && state.discard.every(isCardInstance) &&
    numericFields.every((field) => typeof state[field] === 'number' && Number.isFinite(state[field])) &&
    isGamePhase(state.phase) &&
    Array.isArray(state.log) && state.log.every((entry) => typeof entry === 'string')
  );
}

function createInitialState(): GameState {
  const full = shuffle(buildDeck());
  const { hand, deck, discard } = drawCards(full, [], HAND_SIZE);
  return {
    deck, hand, discard,
    playerHP: PLAYER_MAX_HP,
    playerBlock: 0,
    energy: PLAYER_MAX_ENERGY,
    enemyHP: ENEMY.maxHP,
    enemyBlock: 0,
    enemyVulnerable: 0,
    intentIndex: 0,
    phase: 'player',
    turn: 1,
    log: ['Battle begins!'],
  };
}

export const game = persistentWritable<GameState>(
  'spire-clash:game:v1',
  createInitialState(),
  isGameState
);
export const floats = writable<FloatingNumber[]>([]);

export const enemyIntent = derived(game, ($g) => ENEMY.intents[$g.intentIndex % ENEMY.intents.length]);

let pendingEnemyTurn: ReturnType<typeof setTimeout> | undefined;

export function addFloat(target: 'player' | 'enemy', text: string, kind: 'damage' | 'block' | 'heal') {
  const id = ++floatId;
  floats.update((prev) => [...prev, { id, target, text, kind }]);
  setTimeout(() => {
    floats.update((prev) => prev.filter((f) => f.id !== id));
  }, 1200);
}

export function playCard(uid: string) {
  game.update((prev) => {
    if (prev.phase !== 'player') return prev;
    const card = prev.hand.find((c) => c.uid === uid);
    if (!card || card.cost > prev.energy) return prev;

    const newEnergy = prev.energy - card.cost;
    const newHand = prev.hand.filter((c) => c.uid !== uid);
    let discard = [...prev.discard, card];
    let hand = newHand;

    let enemyHP = prev.enemyHP;
    let enemyBlock = prev.enemyBlock;
    let enemyVulnerable = prev.enemyVulnerable;
    let playerHP = prev.playerHP;
    let playerBlock = prev.playerBlock;
    let deck = prev.deck;
    const log = [...prev.log];

    if (card.damage) {
      let dmg = card.damage;
      if (enemyVulnerable > 0) dmg = Math.floor(dmg * 1.5);
      const absorbed = Math.min(enemyBlock, dmg);
      const realDmg = dmg - absorbed;
      enemyBlock -= absorbed;
      if (realDmg > 0) {
        enemyHP = Math.max(0, enemyHP - realDmg);
        log.unshift(`${card.name} deals ${realDmg} damage!`);
      } else {
        log.unshift(`${card.name} was blocked!`);
      }
      addFloat('enemy', realDmg > 0 ? `-${realDmg}` : 'Blocked', realDmg > 0 ? 'damage' : 'block');
    }

    if (card.block) {
      playerBlock += card.block;
      log.unshift(`You gain ${card.block} Block.`);
      addFloat('player', `+${card.block}`, 'block');
    }

    if (card.vulnerable) {
      enemyVulnerable += card.vulnerable;
      log.unshift(`${ENEMY.name} is Vulnerable!`);
    }

    if (card.heal) {
      playerHP = Math.min(PLAYER_MAX_HP, playerHP + card.heal);
      log.unshift(`You heal ${card.heal} HP.`);
      addFloat('player', `+${card.heal}`, 'heal');
    }

    if (card.drawCards) {
      const result = drawCards(deck, discard, card.drawCards);
      hand = [...hand, ...result.hand];
      deck = result.deck;
      discard = result.discard;
    }

    let phase: GamePhase = prev.phase;
    if (enemyHP <= 0) {
      phase = 'won';
      log.unshift(`${ENEMY.name} is defeated! Victory!`);
    }

    return { ...prev, deck, hand, discard, playerHP, playerBlock, enemyHP, enemyBlock, enemyVulnerable, energy: newEnergy, phase, log: log.slice(0, 6) };
  });
}

export function endTurn() {
  if (get(game).phase !== 'player') return;

  game.update((prev) => {
    const newDiscard = [...prev.discard, ...prev.hand];
    return { ...prev, hand: [], discard: newDiscard, phase: 'enemy', log: ['--- Enemy Turn ---', ...prev.log].slice(0, 6) };
  });
}

function scheduleEnemyTurn(intentIndex: number) {
  if (pendingEnemyTurn !== undefined) clearTimeout(pendingEnemyTurn);

  const intent = ENEMY.intents[intentIndex % ENEMY.intents.length];
  pendingEnemyTurn = setTimeout(() => {
    pendingEnemyTurn = undefined;
    game.update((prev) => {
      if (prev.phase !== 'enemy' || prev.intentIndex !== intentIndex) return prev;

      let playerHP = prev.playerHP;
      let playerBlock = prev.playerBlock;
      let enemyBlock = prev.enemyBlock;
      const log = [...prev.log];

      if (intent.type === 'attack') {
        const dmg = intent.value;
        const absorbed = Math.min(playerBlock, dmg);
        playerBlock -= absorbed;
        const hpLoss = dmg - absorbed;
        if (hpLoss > 0) {
          playerHP = Math.max(0, playerHP - hpLoss);
          log.unshift(`${ENEMY.name} uses ${intent.label} for ${hpLoss} damage!`);
        } else {
          log.unshift(`${ENEMY.name} uses ${intent.label}! Blocked.`);
        }
        addFloat('player', hpLoss > 0 ? `-${hpLoss}` : 'Blocked', hpLoss > 0 ? 'damage' : 'block');
      } else if (intent.type === 'defend') {
        enemyBlock += intent.value;
        log.unshift(`${ENEMY.name} hardens, gaining ${intent.value} Block.`);
        addFloat('enemy', `+${intent.value}`, 'block');
      }

      const nextIntentIndex = prev.intentIndex + 1;
      let phase: GamePhase = 'player';
      if (playerHP <= 0) {
        phase = 'lost';
        log.unshift('You have been defeated!');
      }

      let turn = prev.turn;
      let energy = prev.energy;
      let enemyVulnerable = prev.enemyVulnerable;
      let deck = prev.deck;
      let discard = prev.discard;
      let hand: CardInstance[] = [];

      if (phase === 'player') {
        turn += 1;
        energy = PLAYER_MAX_ENERGY;
        playerBlock = 0;
        enemyBlock = 0;
        enemyVulnerable = Math.max(0, enemyVulnerable - 1);
        const result = drawCards(deck, discard, HAND_SIZE);
        hand = result.hand;
        deck = result.deck;
        discard = result.discard;
        log.unshift(`--- Turn ${turn} ---`);
      }

      return { ...prev, deck, hand, discard, playerHP, playerBlock, enemyBlock, enemyVulnerable, energy, intentIndex: nextIntentIndex, phase, turn, log: log.slice(0, 6) };
    });
  }, 900);
}

export function restart() {
  if (pendingEnemyTurn !== undefined) {
    clearTimeout(pendingEnemyTurn);
    pendingEnemyTurn = undefined;
  }
  game.set(createInitialState());
  floats.set([]);
}

let previousPhase: GamePhase | undefined;
game.subscribe((state) => {
  if (state.phase === 'enemy' && previousPhase !== 'enemy') {
    scheduleEnemyTurn(state.intentIndex);
  } else if (state.phase !== 'enemy' && pendingEnemyTurn !== undefined) {
    clearTimeout(pendingEnemyTurn);
    pendingEnemyTurn = undefined;
  }
  previousPhase = state.phase;
});
