<script lang="ts">
  import type { ShieldStyle } from './types';

  export let art: ShieldStyle;
  export let className: string = 'w-16 h-16';
</script>

<svg viewBox="0 0 100 100" class={className} aria-hidden="true">
  {#if art === 'shield'}
    <circle cx="50" cy="50" r="42" fill="#0369a1" stroke="#7dd3fc" stroke-width="4" />
    <circle cx="50" cy="50" r="30" fill="none" stroke="#bae6fd" stroke-width="2" stroke-dasharray="4 4" />
    <circle cx="50" cy="50" r="13" fill="#e0f2fe" />
    <circle cx="50" cy="50" r="5" fill="#0369a1" />
  {:else if art === 'shield-reinforced'}
    <path d="M22 8 L78 8 L78 64 Q78 88 50 96 Q22 88 22 64 Z" fill="#475569" stroke="#fbbf24" stroke-width="4" stroke-linejoin="round" />
    <rect x="46" y="8" width="8" height="84" fill="#fbbf24" />
    <rect x="22" y="34" width="56" height="6" fill="#fbbf24" />
    <rect x="22" y="60" width="56" height="5" fill="#fbbf24" />
    <circle cx="30" cy="20" r="2.5" fill="#fde68a" />
    <circle cx="70" cy="20" r="2.5" fill="#fde68a" />
    <circle cx="30" cy="77" r="2.5" fill="#fde68a" />
    <circle cx="70" cy="77" r="2.5" fill="#fde68a" />
  {:else}
    <polygon points="50,2 56,22 74,8 72,28 92,24 80,42 98,50 80,58 92,76 72,72 74,92 56,78 50,98 44,78 26,92 28,72 8,76 20,58 2,50 20,42 8,24 28,28 26,8 44,22" fill="#0f766e" stroke="#5eead4" stroke-width="2" stroke-linejoin="round" />
    <circle cx="50" cy="50" r="28" fill="#115e59" stroke="#5eead4" stroke-width="2" />
    <circle cx="50" cy="50" r="12" fill="#ccfbf1" />
    <circle cx="50" cy="50" r="4" fill="#0f766e" />
  {/if}
</svg>
