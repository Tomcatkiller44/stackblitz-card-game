<script lang="ts">
  import type { CardArtKind } from './types';

  export let art: CardArtKind;
  export let className: string = 'w-16 h-16';

  $: isShield = art === 'shield' || art === 'shield-reinforced' || art === 'shield-spiky';
  $: isReinforcedSword = art === 'sword-reinforced';
</script>

<svg viewBox="0 0 100 100" class={className} aria-hidden="true">
  {#if isShield}
    {#if art === 'shield'}
      <path d="M50 8 L82 18 L82 50 Q82 78 50 92 Q18 78 18 50 L18 18 Z" fill="#0369a1" stroke="#7dd3fc" stroke-width="3" stroke-linejoin="round" />
      <path d="M50 20 L70 26 L70 50 Q70 68 50 78 Q30 68 30 50 L30 26 Z" fill="#0284c7" />
      <circle cx="50" cy="48" r="9" fill="#bae6fd" />
      <circle cx="50" cy="48" r="4" fill="#0369a1" />
    {:else if art === 'shield-reinforced'}
      <path d="M50 8 L82 18 L82 50 Q82 78 50 92 Q18 78 18 50 L18 18 Z" fill="#475569" stroke="#fbbf24" stroke-width="4" stroke-linejoin="round" />
      <path d="M50 16 L76 24 L76 50 Q76 72 50 84 Q24 72 24 50 L24 24 Z" fill="none" stroke="#fbbf24" stroke-width="2" />
      <path d="M50 26 L66 31 L66 50 Q66 64 50 72 Q34 64 34 50 L34 31 Z" fill="#334155" />
      <circle cx="26" cy="22" r="2.5" fill="#fde68a" />
      <circle cx="74" cy="22" r="2.5" fill="#fde68a" />
      <circle cx="50" cy="48" r="10" fill="#fbbf24" />
      <circle cx="50" cy="48" r="4" fill="#78350f" />
    {:else}
      <path d="M18 30 L4 38 L18 46 Z M18 56 L4 64 L18 70 Z M82 30 L96 38 L82 46 Z M82 56 L96 64 L82 70 Z M34 14 L28 3 L44 10 Z M66 14 L72 3 L56 10 Z" fill="#cbd5e1" stroke="#64748b" stroke-width="1" stroke-linejoin="round" />
      <path d="M50 8 L82 18 L82 50 Q82 78 50 92 Q18 78 18 50 L18 18 Z" fill="#0f766e" stroke="#5eead4" stroke-width="3" stroke-linejoin="round" />
      <path d="M50 20 L70 26 L70 50 Q70 68 50 78 Q30 68 30 50 L30 26 Z" fill="#115e59" />
      <circle cx="50" cy="48" r="9" fill="#ccfbf1" />
      <circle cx="50" cy="48" r="3.5" fill="#0f766e" />
    {/if}
  {:else}
    <g transform={art === 'sword-reversed' ? 'rotate(180 50 50)' : undefined}>
      {#if isReinforcedSword}
        <path d="M50 4 L58 18 L58 62 L42 62 L42 18 Z" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5" stroke-linejoin="round" />
        <path d="M50 4 L50 62" stroke="#64748b" stroke-width="1" />
        <rect x="42" y="30" width="16" height="3" fill="#64748b" />
        <rect x="42" y="44" width="16" height="3" fill="#64748b" />
        <rect x="24" y="58" width="8" height="10" rx="2" fill="#b45309" />
        <rect x="68" y="58" width="8" height="10" rx="2" fill="#b45309" />
      {:else}
        <path d="M50 6 L56 18 L56 62 L44 62 L44 18 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5" stroke-linejoin="round" />
        <path d="M50 6 L50 62" stroke="#94a3b8" stroke-width="1" />
      {/if}
      <rect x="30" y="62" width="40" height="6" rx="2" fill="#b45309" />
      <rect x="46" y="68" width="8" height="16" rx="2" fill="#78350f" />
      <circle cx="50" cy="89" r="5" fill="#f59e0b" />
    </g>
  {/if}
</svg>
