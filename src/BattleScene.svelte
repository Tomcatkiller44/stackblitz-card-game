<script lang="ts">
  import { Heart, Zap, Flame, Shield, Swords, RotateCcw, Sparkles } from 'lucide-svelte';
  import { game, floats, enemyIntent, playCard, endTurn, restart, advanceToNextFoe } from './gameStore';
  import { ENEMIES, PLAYER_MAX_HP, PLAYER_MAX_ENERGY } from './gameData';
  import Card from './Card.svelte';
  import HealthBar from './HealthBar.svelte';
  import EnemyPortrait from './EnemyPortrait.svelte';
  import BattleResultOverlay from './BattleResultOverlay.svelte';

  $: state = $game;
  $: intent = $enemyIntent;
  $: enemy = ENEMIES[state.enemyIndex];
  $: nextEnemy = ENEMIES[state.enemyIndex + 1];
  $: enemyFloats = $floats.filter((f) => f.target === 'enemy');
  $: playerFloats = $floats.filter((f) => f.target === 'player');

  function floatColor(kind: string): string {
    if (kind === 'damage') return 'text-red-400';
    if (kind === 'block') return 'text-sky-400';
    return 'text-green-400';
  }
</script>

<div class="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white flex flex-col overflow-hidden">
  <!-- Top bar -->
  <div class="flex items-center justify-between px-6 py-3 bg-black/40 border-b border-slate-800">
    <div class="flex items-center gap-2">
      <Swords size={22} class="text-amber-400" />
      <span class="text-lg font-bold tracking-wide">Spire Clash</span>
    </div>
    <div class="text-sm text-slate-400">Foe {state.enemyIndex + 1} of {ENEMIES.length} &middot; Turn {state.turn}</div>
  </div>

  <!-- Battle area -->
  <div class="flex-1 flex flex-col px-6 py-4 gap-3 max-w-5xl mx-auto w-full">
    <!-- Enemy section -->
    <div class="flex flex-col items-center gap-2">
      <div class="flex items-start gap-6">
        <!-- Intent bubble -->
        <div class="flex flex-col items-center gap-1 mt-4">
          <div class="w-14 h-14 rounded-full bg-black/60 border-2 border-slate-600 flex flex-col items-center justify-center">
            {#if intent.type === 'attack'}
              <Swords size={20} class="text-red-400" />
              <span class="text-xs font-bold text-red-400">{intent.value}</span>
            {:else if intent.type === 'defend'}
              <Shield size={20} class="text-sky-400" />
            {:else}
              <Flame size={20} class="text-amber-400" />
            {/if}
          </div>
          <span class="text-[10px] text-slate-500">{intent.label}</span>
        </div>

        <!-- Enemy portrait -->
        <div class="relative">
          <div
            class="w-32 h-32 rounded-2xl border-2 bg-gradient-to-b from-emerald-900/40 to-slate-900 flex items-center justify-center transition-all duration-300 {state.enemyVulnerable > 0 ? 'border-red-500 animate-pulse' : 'border-slate-700'} {state.phase === 'enemy' ? 'scale-105' : ''}"
          >
            <EnemyPortrait id={enemy.id} />
          </div>

          {#if state.enemyVulnerable > 0}
            <div class="absolute -top-2 -right-2 flex items-center gap-1 px-1.5 py-0.5 bg-red-950 border border-red-600 rounded-full">
              <Flame size={10} class="text-red-400" />
              <span class="text-[10px] font-bold text-red-300">{state.enemyVulnerable}</span>
            </div>
          {/if}

          {#if state.enemyBlock > 0}
            <div class="absolute -top-2 -left-2 flex items-center gap-1 px-1.5 py-0.5 bg-sky-950 border border-sky-600 rounded-full">
              <Shield size={10} class="text-sky-400" />
              <span class="text-[10px] font-bold text-sky-300">{state.enemyBlock}</span>
            </div>
          {/if}

          {#each enemyFloats as f (f.id)}
            <div class="absolute top-8 left-1/2 -translate-x-1/2 text-2xl font-bold animate-float-up {floatColor(f.kind)}">
              {f.text}
            </div>
          {/each}
        </div>
      </div>

      <div class="w-64">
        <p class="text-center text-sm font-semibold mb-1">{enemy.name}</p>
        <HealthBar current={state.enemyHP} max={enemy.maxHP} block={state.enemyBlock} />
      </div>
    </div>

    <!-- VS divider -->
    <div class="flex items-center gap-3 my-1">
      <div class="flex-1 h-px bg-gradient-to-r from-transparent to-slate-700"></div>
      <Swords size={18} class="text-slate-600" />
      <div class="flex-1 h-px bg-gradient-to-l from-transparent to-slate-700"></div>
    </div>

    <!-- Player section -->
    <div class="flex flex-col items-center gap-2">
      <div class="relative">
        <div
          class="w-28 h-28 rounded-2xl border-2 border-slate-600 bg-gradient-to-b from-amber-900/30 to-slate-900 flex items-center justify-center {state.phase === 'enemy' ? 'animate-shake' : ''}"
        >
          <svg viewBox="0 0 100 100" class="w-20 h-20">
            <path d="M 35 30 L 65 30 L 70 50 L 65 80 L 35 80 L 30 50 Z" fill="#475569" stroke="#334155" stroke-width="1" />
            <rect x="40" y="45" width="20" height="6" fill="#1e293b" rx="1" />
            <path d="M 30 50 L 25 40 L 28 55" fill="#475569" />
            <path d="M 70 50 L 75 40 L 72 55" fill="#475569" />
            <rect x="38" y="80" width="24" height="3" fill="#334155" />
          </svg>
        </div>

        {#if state.playerBlock > 0}
          <div class="absolute -top-2 -left-2 flex items-center gap-1 px-1.5 py-0.5 bg-sky-950 border border-sky-600 rounded-full">
            <Shield size={10} class="text-sky-400" />
            <span class="text-[10px] font-bold text-sky-300">{state.playerBlock}</span>
          </div>
        {/if}

        {#if state.playerThorns > 0}
          <div class="absolute -top-2 -right-2 flex items-center gap-1 px-1.5 py-0.5 bg-rose-950 border border-rose-600 rounded-full">
            <Sparkles size={10} class="text-rose-400" />
            <span class="text-[10px] font-bold text-rose-300">{state.playerThorns}</span>
          </div>
        {/if}

        {#each playerFloats as f (f.id)}
          <div class="absolute top-4 left-1/2 -translate-x-1/2 text-2xl font-bold animate-float-up {floatColor(f.kind)}">
            {f.text}
          </div>
        {/each}
      </div>

      <div class="w-64">
        <div class="flex items-center justify-center gap-1 mb-1">
          <Heart size={12} class="text-red-400" />
          <span class="text-xs font-semibold">Ironclad</span>
        </div>
        <HealthBar current={state.playerHP} max={PLAYER_MAX_HP} block={state.playerBlock} />
      </div>

      <div class="flex items-center gap-2 mt-1">
        <div class="flex items-center gap-1.5 px-3 py-1 bg-amber-950/60 border border-amber-700 rounded-full">
          <Zap size={14} class="text-amber-400" />
          <span class="text-sm font-bold text-amber-200">{state.energy} / {PLAYER_MAX_ENERGY}</span>
        </div>
      </div>
    </div>

    <!-- Battle log -->
    <div class="h-14 overflow-hidden bg-black/30 rounded-lg border border-slate-800 px-3 py-1.5">
      {#each state.log.slice(0, 2) as entry, i}
        <p class="text-xs {i === 0 ? 'text-slate-200' : 'text-slate-500'} truncate">{entry}</p>
      {/each}
    </div>
  </div>

  <!-- Bottom: cards + controls -->
  <div class="bg-black/50 border-t border-slate-800 px-6 py-4">
    <div class="max-w-5xl mx-auto">
      <div class="flex items-end justify-center gap-3 min-h-[13rem]">
        {#if state.hand.length === 0 && state.phase === 'player'}
          <p class="text-slate-500 text-sm self-center">No cards in hand</p>
        {/if}
        {#each state.hand as card, i (card.uid)}
          <Card
            card={card}
            index={i}
            playable={state.phase === 'player' && card.cost <= state.energy}
            onPlay={playCard}
          />
        {/each}
      </div>

      <div class="flex items-center justify-between mt-3">
        <div class="flex items-center gap-2 text-xs text-slate-400">
          <div class="flex items-center gap-1">
            <div class="w-6 h-8 rounded bg-slate-700 border border-slate-600 flex items-center justify-center">
              <span class="text-[10px] font-bold">{state.deck.length}</span>
            </div>
            <span>Draw</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-6 h-8 rounded bg-slate-800 border border-slate-600 flex items-center justify-center">
              <span class="text-[10px] font-bold">{state.discard.length}</span>
            </div>
            <span>Discard</span>
          </div>
        </div>

        {#if state.phase === 'won' || state.phase === 'lost'}
          <button
            on:click={restart}
            class="flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors shadow-lg"
          >
            <RotateCcw size={16} />
            Play Again
          </button>
        {:else}
          <button
            on:click={endTurn}
            disabled={state.phase !== 'player'}
            class="flex items-center gap-2 px-5 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-lg"
          >
            End Turn
          </button>
        {/if}
      </div>
    </div>
  </div>

  {#if state.phase === 'cleared' || state.phase === 'won' || state.phase === 'lost'}
    <BattleResultOverlay
      phase={state.phase}
      foeName={enemy.name}
      nextFoeName={nextEnemy?.name}
      foeNumber={state.enemyIndex + 1}
      totalFoes={ENEMIES.length}
      turn={state.turn}
      damageDealt={state.damageDealt}
      damageTaken={state.damageTaken}
      onContinue={advanceToNextFoe}
      onRestart={restart}
    />
  {/if}
</div>
