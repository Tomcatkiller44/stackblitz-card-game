<script lang="ts">
  import type { WeaponStyle } from './types';

  export let weapon: WeaponStyle;
  export let className: string = 'w-16 h-16';
</script>

<svg viewBox="0 0 100 100" class={className} aria-hidden="true">
  {#if weapon === 'longsword'}
    <polygon points="84,6 90,12 52,56 40,60 44,48" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5" stroke-linejoin="round" />
    <line x1="29" y1="47" x2="45" y2="63" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" />
    <line x1="37" y1="55" x2="18" y2="74" stroke="#92400e" stroke-width="6" stroke-linecap="round" />
    <circle cx="14" cy="78" r="5" fill="#fbbf24" stroke="#b45309" stroke-width="1.5" />
  {:else if weapon === 'warhammer'}
    <line x1="22" y1="88" x2="60" y2="46" stroke="#92400e" stroke-width="7" stroke-linecap="round" />
    <rect x="47" y="33" width="30" height="18" rx="2" fill="#64748b" stroke="#cbd5e1" stroke-width="2" transform="rotate(45 62 42)" />
    <rect x="58" y="22" width="12" height="40" rx="2" fill="#475569" stroke="#cbd5e1" stroke-width="2" transform="rotate(45 62 42)" />
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
