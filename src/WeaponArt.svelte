<script lang="ts">
  import type { WeaponStyle } from './types';

  export let weapon: WeaponStyle;
  export let className: string = 'w-16 h-16';
</script>

<svg viewBox="0 0 100 100" class={className} aria-hidden="true">
  {#if weapon === 'longsword'}
    <g transform="rotate(45 50 50)">
      <path d="M50 3 L57 16 L57 60 L43 60 L43 16 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5" stroke-linejoin="round" />
      <line x1="50" y1="14" x2="50" y2="56" stroke="#94a3b8" stroke-width="1.5" />
      <rect x="28" y="60" width="44" height="6" rx="3" fill="#fbbf24" stroke="#b45309" stroke-width="1.5" />
      <rect x="46" y="66" width="8" height="20" rx="2" fill="#7c2d12" />
      <circle cx="50" cy="91" r="5.5" fill="#fbbf24" stroke="#b45309" stroke-width="1.5" />
    </g>
  {:else if weapon === 'warhammer'}
    <rect x="45" y="34" width="10" height="58" rx="4" fill="#92400e" />
    <rect x="22" y="12" width="56" height="28" rx="4" fill="#64748b" stroke="#cbd5e1" stroke-width="2" />
    <rect x="22" y="12" width="12" height="28" rx="3" fill="#334155" />
    <line x1="36" y1="12" x2="36" y2="40" stroke="#cbd5e1" stroke-width="1.5" />
    <line x1="14" y1="16" x2="6" y2="10" stroke="#fcd34d" stroke-width="3" stroke-linecap="round" />
    <line x1="86" y1="16" x2="94" y2="10" stroke="#fcd34d" stroke-width="3" stroke-linecap="round" />
    <line x1="14" y1="30" x2="4" y2="30" stroke="#fcd34d" stroke-width="3" stroke-linecap="round" />
    <line x1="86" y1="30" x2="96" y2="30" stroke="#fcd34d" stroke-width="3" stroke-linecap="round" />
  {:else if weapon === 'twin-axes'}
    <line x1="20" y1="80" x2="72" y2="28" stroke="#92400e" stroke-width="6" stroke-linecap="round" />
    <line x1="80" y1="80" x2="28" y2="28" stroke="#92400e" stroke-width="6" stroke-linecap="round" />
    <path d="M72 28 L60 12 Q92 2 96 36 Z" fill="#94a3b8" stroke="#e2e8f0" stroke-width="2" stroke-linejoin="round" />
    <path d="M28 28 L40 12 Q8 2 4 36 Z" fill="#94a3b8" stroke="#e2e8f0" stroke-width="2" stroke-linejoin="round" />
  {:else}
    <path d="M20 30 Q12 50 20 70" fill="none" stroke="#fcd34d" stroke-width="3" stroke-linecap="round" opacity="0.6" />
    <path d="M80 30 Q88 50 80 70" fill="none" stroke="#fcd34d" stroke-width="3" stroke-linecap="round" opacity="0.6" />
    <polygon points="50,6 56,22 56,56 44,56 44,22" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5" stroke-linejoin="round" />
    <line x1="34" y1="58" x2="66" y2="58" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" />
    <line x1="50" y1="58" x2="50" y2="76" stroke="#92400e" stroke-width="6" stroke-linecap="round" />
    <circle cx="50" cy="84" r="8" fill="#fbbf24" stroke="#b45309" stroke-width="1.5" />
  {/if}
</svg>
