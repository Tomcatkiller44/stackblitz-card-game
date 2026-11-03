<script lang="ts">
  import { Swords, Heart, Zap, Shield } from 'lucide-svelte';

  export let onStart: () => void;
</script>

<div class="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white flex items-center justify-center px-6">
  <div class="max-w-lg text-center">
    <div class="flex items-center justify-center gap-3 mb-6">
      <div class="relative">
        <Swords size={48} class="text-amber-400" />
        <div class="absolute inset-0 blur-xl bg-amber-500/30"></div>
      </div>
    </div>

    <h1 class="text-5xl font-bold tracking-tight mb-2 bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-transparent">
      Spire Clash
    </h1>
    <p class="text-slate-400 mb-10 text-lg">
      A roguelike card battle. Strategize your turns, manage your energy, and conquer five foes, from the humble Slime to the mighty Dragon.
    </p>

    <div class="grid grid-cols-3 gap-4 mb-10">
      <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col items-center">
        <Heart size={24} class="text-red-400 mb-2" />
        <p class="text-xs text-slate-400">Survive</p>
      </div>
      <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col items-center">
        <Zap size={24} class="text-amber-400 mb-2" />
        <p class="text-xs text-slate-400">Spend Energy</p>
      </div>
      <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col items-center">
        <Shield size={24} class="text-sky-400 mb-2" />
        <p class="text-xs text-slate-400">Block Attacks</p>
      </div>
    </div>

    <button
      on:click={onStart}
      class="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg rounded-xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-900/50"
    >
      Enter the Spire
    </button>
  </div>
</div>
