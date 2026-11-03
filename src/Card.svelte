<script lang="ts">
  import { Sword, Shield } from 'lucide-svelte';
  import type { CardInstance } from './types';
  import ShieldArt from './ShieldArt.svelte';
  import WeaponArt from './WeaponArt.svelte';

  export let card: CardInstance;
  export let playable: boolean;
  export let index: number;
  export let onPlay: (uid: string) => void;

  let hovered = false;

  function handleClick() {
    if (playable) onPlay(card.uid);
  }

  const rarityBorder: Record<string, string> = {
    common: 'border-slate-500',
    uncommon: 'border-sky-400',
    rare: 'border-amber-400',
  };

  const rarityGlow: Record<string, string> = {
    common: '',
    uncommon: 'shadow-sky-900/50',
    rare: 'shadow-amber-900/50',
  };

  $: cardClass = `relative w-36 h-52 rounded-lg border-2 ${rarityBorder[card.rarity]} ${
    playable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
  } transition-all duration-200 ease-out ${
    hovered && playable ? '-translate-y-6 scale-105 shadow-2xl' : 'shadow-lg'
  } ${rarityGlow[card.rarity]}`;

  $: bgClass = card.type === 'attack'
    ? 'bg-gradient-to-b from-slate-800 via-slate-900 to-black'
    : 'bg-gradient-to-b from-sky-950 via-slate-900 to-black';

  $: rarityBar = card.rarity === 'rare' ? 'bg-amber-400'
    : card.rarity === 'uncommon' ? 'bg-sky-400'
    : 'bg-slate-500';
</script>

<div
  class={cardClass}
  style="transition-delay: {index * 30}ms"
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
  on:click={handleClick}
  on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
  role="button"
  tabindex="0"
>
  <div class="absolute inset-0 rounded-lg overflow-hidden {bgClass}">
    <!-- Cost orb -->
    <div class="absolute top-1.5 left-1.5 z-10">
      <div class="w-7 h-7 rounded-full bg-amber-500 border-2 border-amber-300 flex items-center justify-center shadow-md">
        <span class="text-black font-bold text-sm">{card.cost}</span>
      </div>
    </div>

    <!-- Type icon -->
    <div class="absolute top-2 right-2 z-10 text-slate-400">
      {#if card.type === 'attack'}
        <Sword size={16} />
      {:else}
        <Shield size={16} />
      {/if}
    </div>

    <!-- Art area -->
    <div class="absolute top-0 left-0 right-0 h-24 flex items-center justify-center">
      {#if card.weapon}
        <WeaponArt weapon={card.weapon} className="w-16 h-16 drop-shadow-lg" />
      {:else if card.art}
        <ShieldArt art={card.art} className="w-16 h-16 drop-shadow-lg" />
      {/if}
    </div>

    <!-- Divider -->
    <div class="absolute top-24 left-2 right-2 border-t border-slate-600/50"></div>

    <!-- Name and effect text -->
    <div class="absolute top-24 bottom-1 left-0 right-0 flex flex-col items-center justify-center gap-1.5 px-3">
      <h3 class="text-center text-xs font-bold text-slate-100 leading-tight">{card.name}</h3>
      <p class="text-center text-[10px] text-slate-300 leading-snug whitespace-pre-line">{card.description}</p>
    </div>

    <!-- Bottom rarity bar -->
    <div class="absolute bottom-0 left-0 right-0 h-1 {rarityBar}"></div>
  </div>
</div>
