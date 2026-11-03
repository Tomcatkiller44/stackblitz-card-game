<script lang="ts">
  import { ArrowRight, RotateCcw, Trophy, Skull, Sword, Heart } from 'lucide-svelte';
  import type { GamePhase } from './types';
  import { RECOVERY_BETWEEN_FOES } from './gameData';

  export let phase: Extract<GamePhase, 'cleared' | 'won' | 'lost'>;
  export let foeName: string;
  export let nextFoeName: string | undefined = undefined;
  export let foeNumber: number;
  export let totalFoes: number;
  export let turn: number;
  export let damageDealt: number;
  export let damageTaken: number;
  export let onContinue: () => void;
  export let onRestart: () => void;
</script>

<div class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 px-6 animate-fade-in">
  <div class="w-full max-w-md text-center bg-slate-900/90 border border-slate-700 rounded-2xl p-8 shadow-2xl">
    {#if phase === 'cleared'}
      <Sword size={40} class="text-amber-400 mx-auto mb-3" />
      <h2 class="text-3xl font-bold text-amber-400 mb-2">{foeName} Defeated</h2>
      <p class="text-slate-300 mb-6">
        Foe {foeNumber} of {totalFoes} is down. Recover {RECOVERY_BETWEEN_FOES} HP before you face the {nextFoeName}.
      </p>
      <button
        on:click={onContinue}
        class="flex items-center gap-2 px-6 py-3 mx-auto bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors shadow-xl"
      >
        Face the {nextFoeName}
        <ArrowRight size={18} />
      </button>
    {:else if phase === 'won'}
      <Trophy size={44} class="text-amber-400 mx-auto mb-3" />
      <h2 class="text-4xl font-bold text-amber-400 mb-2">Congratulations!</h2>
      <p class="text-slate-300 mb-6">
        You conquered the Spire and slew the {foeName}, the final foe. Your legend is complete.
      </p>
      <div class="grid grid-cols-3 gap-3 mb-8">
        <div class="bg-slate-800/60 border border-slate-700 rounded-xl p-3 flex flex-col items-center">
          <span class="text-2xl font-bold text-white">{turn}</span>
          <span class="text-[11px] text-slate-400 uppercase tracking-wide">Turns</span>
        </div>
        <div class="bg-slate-800/60 border border-slate-700 rounded-xl p-3 flex flex-col items-center">
          <span class="text-2xl font-bold text-red-400">{damageDealt}</span>
          <span class="text-[11px] text-slate-400 uppercase tracking-wide">Dealt</span>
        </div>
        <div class="bg-slate-800/60 border border-slate-700 rounded-xl p-3 flex flex-col items-center">
          <span class="text-2xl font-bold text-sky-300">{damageTaken}</span>
          <span class="text-[11px] text-slate-400 uppercase tracking-wide">Taken</span>
        </div>
      </div>
      <button
        on:click={onRestart}
        class="flex items-center gap-2 px-6 py-3 mx-auto bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors shadow-xl"
      >
        <RotateCcw size={18} />
        Play Again
      </button>
    {:else}
      <Skull size={40} class="text-red-500 mx-auto mb-3" />
      <h2 class="text-5xl font-bold text-red-500 mb-4">DEFEATED</h2>
      <p class="text-slate-400 mb-6">
        The {foeName} has bested you on foe {foeNumber} of {totalFoes} after {turn} turns.
      </p>
      <div class="flex items-center justify-center gap-6 text-sm text-slate-400 mb-8">
        <span class="flex items-center gap-1.5"><Sword size={14} class="text-red-400" />{damageDealt} dealt</span>
        <span class="flex items-center gap-1.5"><Heart size={14} class="text-red-400" />{damageTaken} taken</span>
      </div>
      <button
        on:click={onRestart}
        class="flex items-center gap-2 px-6 py-3 mx-auto bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors shadow-xl"
      >
        <RotateCcw size={18} />
        Rematch
      </button>
    {/if}
  </div>
</div>
