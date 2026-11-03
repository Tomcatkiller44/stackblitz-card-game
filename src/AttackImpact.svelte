<script lang="ts">
  import type { ImpactStyle } from './types';
  import ShieldArt from './ShieldArt.svelte';

  export let style: ImpactStyle;

  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI) / 4;
    return {
      x1: 50 + Math.cos(angle) * 22,
      y1: 50 + Math.sin(angle) * 22,
      x2: 50 + Math.cos(angle) * 42,
      y2: 50 + Math.sin(angle) * 42,
    };
  });
</script>

<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
  {#if style === 'slash' || style === 'x-slash' || style === 'bonk'}
    <svg viewBox="0 0 100 100" class="w-full h-full overflow-visible" aria-hidden="true">
      {#if style === 'slash'}
        <line class="glow slash" pathLength="1" x1="16" y1="14" x2="86" y2="88" />
        <line class="streak slash" pathLength="1" x1="16" y1="14" x2="86" y2="88" />
      {:else if style === 'x-slash'}
        <line class="glow slash" pathLength="1" x1="16" y1="14" x2="86" y2="88" />
        <line class="streak slash" pathLength="1" x1="16" y1="14" x2="86" y2="88" />
        <line class="glow slash late" pathLength="1" x1="86" y1="14" x2="16" y2="88" />
        <line class="streak slash late" pathLength="1" x1="86" y1="14" x2="16" y2="88" />
      {:else}
        <circle class="ring" cx="50" cy="50" r="20" />
        <circle class="flash" cx="50" cy="50" r="12" />
        {#each rays as ray}
          <line class="ray" x1={ray.x1} y1={ray.y1} x2={ray.x2} y2={ray.y2} />
        {/each}
      {/if}
    </svg>
  {:else}
    <div class="shield-pop">
      <ShieldArt art={style} className="w-24 h-24 drop-shadow-xl" />
    </div>
  {/if}
</div>

<style>
  .slash {
    fill: none;
    stroke-linecap: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: slash-draw 0.22s ease-out forwards, fade-out 0.3s ease-in 0.4s forwards;
  }

  .glow {
    stroke: #ef4444;
    stroke-width: 9;
    opacity: 0.7;
  }

  .streak {
    stroke: #fef2f2;
    stroke-width: 3.5;
  }

  .late {
    animation-delay: 0.12s, 0.52s;
  }

  .ring {
    fill: none;
    stroke: #fde68a;
    stroke-width: 4;
    transform-box: view-box;
    transform-origin: 50px 50px;
    animation: ring-burst 0.5s ease-out forwards;
  }

  .flash {
    fill: #fef3c7;
    transform-box: view-box;
    transform-origin: 50px 50px;
    animation: flash 0.25s ease-out forwards;
  }

  .ray {
    stroke: #fcd34d;
    stroke-width: 4;
    stroke-linecap: round;
    transform-box: view-box;
    transform-origin: 50px 50px;
    animation: ray-burst 0.45s ease-out forwards;
  }

  .shield-pop {
    animation: shield-pop 0.7s ease-out forwards;
  }

  @keyframes slash-draw {
    from { stroke-dashoffset: 1; }
    to { stroke-dashoffset: 0; }
  }

  @keyframes fade-out {
    to { opacity: 0; }
  }

  @keyframes ring-burst {
    from { transform: scale(0.3); opacity: 1; }
    to { transform: scale(1.8); opacity: 0; }
  }

  @keyframes flash {
    from { transform: scale(0.6); opacity: 1; }
    to { transform: scale(2.2); opacity: 0; }
  }

  @keyframes ray-burst {
    from { transform: scale(0.4); opacity: 1; }
    to { transform: scale(1.1); opacity: 0; }
  }

  @keyframes shield-pop {
    0% { transform: scale(0.4); opacity: 0; }
    35% { transform: scale(1.08); opacity: 1; }
    75% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1); opacity: 0; }
  }
</style>
