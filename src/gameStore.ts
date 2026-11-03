import { writable, derived, get } from 'svelte/store';
import type { CardInstance, GamePhase, FloatingNumber, ImpactEffect, ImpactStyle } from './types';
import { CARDS, ENEMIES, STARTER_DECK, PLAYER_MAX_HP, PLAYER_MAX_ENERGY, HAND_SIZE, RECOVERY_BETWEEN_FOES } from './gameData';
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
  playerThorns: number;
  energy: number;
  enemyHP: number;
  enemyBlock: number;
  enemyVulnerable: number;
  enemyIndex: number;
  intentIndex: number;
  phase: GamePhase;
  turn: number;
  damageDealt: number;
  damageTaken: number;
  log: string[];
}

function isGamePhase(value: unknown): value is GamePhase {
  return value === 'player' || value === 'enemy' || value === 'cleared' || value === 'won' || value === 'lost';
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
    'playerHP', 'playerBlock', 'playerThorns', 'energy', 'enemyHP', 'enemyBlock',
    'enemyVulnerable', 'intentIndex', 'turn', 'enemyIndex', 'damageDealt', 'damageTaken',
  ];

  return (
    Array.isArray(state.deck) && state.deck.every(isCardInstance) &&
    Array.isArray(state.hand) && state.hand.every(isCardInstance) &&
    Array.isArray(state.discard) && state.discard.every(isCardInstance) &&
    numericFields.every((field) => typeof state[field] === 'number' && Number.isFinite(state[field])) &&
    state.enemyIndex! >= 0 && state.enemyIndex! < ENEMIES.length &&
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
    playerThorns: 0,
    energy: PLAYER_MAX_ENERGY,
    enemyHP: ENEMIES[0].maxHP,
    enemyBlock: 0,
    enemyVulnerable: 0,
    enemyIndex: 0,
    intentIndex: 0,
    phase: 'player',
    turn: 1,
    damageDealt: 0,
    damageTaken: 0,
    log: ['Battle begins!'],
  };
}

export const game = persistentWritable<GameState>(
  'spire-clash:game:v1',
  createInitialState(),
  isGameState
);
export const floats = writable<FloatingNumber[]>([]);
export const impactEffects = writable<ImpactEffect[]>([]);

export const enemyIntent = derived(game, ($g) => {
  const intents = ENEMIES[$g.enemyIndex].intents;
  return intents[$g.intentIndex % intents.length];
});

let pendingEnemyTurn: ReturnType<typeof setTimeout> | undefined;

let impactId = 0;

function showImpact(style: ImpactStyle, target: 'player' | 'enemy') {
  const id = ++impactId;
  impactEffects.update((prev) => [...prev, { id, style, target }]);
  setTimeout(() => {
    impactEffects.update((prev) => prev.filter((e) => e.id !== id));
  }, 700);
}

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
    let playerThorns = prev.playerThorns;
    let deck = prev.deck;
    let damageDealt = prev.damageDealt;
    const enemy = ENEMIES[prev.enemyIndex];
    const log = [...prev.log];

    showImpact(card.impact, card.damage ? 'enemy' : 'player');

    if (card.damage) {
      let dmg = card.damage;
      if (enemyVulnerable > 0) dmg = Math.floor(dmg * 1.5);
      const absorbed = Math.min(enemyBlock, dmg);
      const realDmg = dmg - absorbed;
      enemyBlock -= absorbed;
      if (realDmg > 0) {
        enemyHP = Math.max(0, enemyHP - realDmg);
        damageDealt += Math.min(realDmg, prev.enemyHP);
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
      log.unshift(`${enemy.name} is Vulnerable!`);
    }

    if (card.thorns) {
      playerThorns += card.thorns;
      log.unshift(`Thorns ${card.thorns} until your next turn.`);
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
      const isFinalFoe = prev.enemyIndex === ENEMIES.length - 1;
      phase = isFinalFoe ? 'won' : 'cleared';
      log.unshift(`${enemy.name} is defeated!`);
    }

    return { ...prev, deck, hand, discard, playerHP, playerBlock, playerThorns, enemyHP, enemyBlock, enemyVulnerable, damageDealt, energy: newEnergy, phase, log: log.slice(0, 6) };
  });
}

export function advanceToNextFoe() {
  game.update((prev) => {
    if (prev.phase !== 'cleared') return prev;

    const nextIndex = prev.enemyIndex + 1;
    const next = ENEMIES[nextIndex];
    const recycled = [...prev.discard, ...prev.hand];
    const { hand, deck, discard } = drawCards(prev.deck, recycled, HAND_SIZE);
    const playerHP = Math.min(PLAYER_MAX_HP, prev.playerHP + RECOVERY_BETWEEN_FOES);

    return {
      ...prev,
      deck,
      hand,
      discard,
      playerHP,
      playerBlock: 0,
      playerThorns: 0,
      energy: PLAYER_MAX_ENERGY,
      enemyHP: next.maxHP,
      enemyBlock: 0,
      enemyVulnerable: 0,
      enemyIndex: nextIndex,
      intentIndex: 0,
      phase: 'player',
      turn: prev.turn + 1,
      log: [`--- Turn ${prev.turn + 1}: ${next.name} appears! ---`, ...prev.log].slice(0, 6),
    };
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

  pendingEnemyTurn = setTimeout(() => {
    pendingEnemyTurn = undefined;
    game.update((prev) => {
      if (prev.phase !== 'enemy' || prev.intentIndex !== intentIndex) return prev;

      const enemy = ENEMIES[prev.enemyIndex];
      const intent = enemy.intents[intentIndex % enemy.intents.length];
      let playerHP = prev.playerHP;
      let playerBlock = prev.playerBlock;
      let enemyBlock = prev.enemyBlock;
      let enemyHP = prev.enemyHP;
      let damageTaken = prev.damageTaken;
      let damageDealt = prev.damageDealt;
      const log = [...prev.log];

      if (intent.type === 'attack') {
        const dmg = intent.value;
        const absorbed = Math.min(playerBlock, dmg);
        playerBlock -= absorbed;
        const hpLoss = Math.min(playerHP, dmg - absorbed);
        if (hpLoss > 0) {
          playerHP -= hpLoss;
          damageTaken += hpLoss;
          log.unshift(`${enemy.name} uses ${intent.label} for ${hpLoss} damage!`);
        } else {
          log.unshift(`${enemy.name} uses ${intent.label}! Blocked.`);
        }
        addFloat('player', hpLoss > 0 ? `-${hpLoss}` : 'Blocked', hpLoss > 0 ? 'damage' : 'block');

        if (prev.playerThorns > 0) {
          const thornAbsorbed = Math.min(enemyBlock, prev.playerThorns);
          enemyBlock -= thornAbsorbed;
          const thornDmg = Math.min(enemyHP, prev.playerThorns - thornAbsorbed);
          if (thornDmg > 0) {
            enemyHP -= thornDmg;
            damageDealt += thornDmg;
            log.unshift(`Thorns hit ${enemy.name} for ${thornDmg}!`);
            addFloat('enemy', `-${thornDmg}`, 'damage');
          }
        }
      } else if (intent.type === 'defend') {
        enemyBlock += intent.value;
        log.unshift(`${enemy.name} gains ${intent.value} Block with ${intent.label}.`);
        addFloat('enemy', `+${intent.value}`, 'block');
      }

      const nextIntentIndex = prev.intentIndex + 1;
      let phase: GamePhase = 'player';
      if (playerHP <= 0) {
        phase = 'lost';
        log.unshift('You have been defeated!');
      } else if (enemyHP <= 0) {
        phase = prev.enemyIndex === ENEMIES.length - 1 ? 'won' : 'cleared';
        log.unshift(`${enemy.name} is defeated!`);
      }

      let turn = prev.turn;
      let energy = prev.energy;
      let enemyVulnerable = prev.enemyVulnerable;
      let playerThorns = prev.playerThorns;
      let deck = prev.deck;
      let discard = prev.discard;
      let hand: CardInstance[] = [];

      if (phase === 'player') {
        turn += 1;
        energy = PLAYER_MAX_ENERGY;
        playerBlock = 0;
        playerThorns = 0;
        enemyBlock = 0;
        enemyVulnerable = Math.max(0, enemyVulnerable - 1);
        const result = drawCards(deck, discard, HAND_SIZE);
        hand = result.hand;
        deck = result.deck;
        discard = result.discard;
        log.unshift(`--- Turn ${turn} ---`);
      }

      return { ...prev, deck, hand, discard, playerHP, playerBlock, playerThorns, enemyHP, enemyBlock, enemyVulnerable, energy, damageDealt, damageTaken, intentIndex: nextIntentIndex, phase, turn, log: log.slice(0, 6) };
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
