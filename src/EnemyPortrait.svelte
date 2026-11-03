<script lang="ts">
  export let id: string;
</script>

<svg viewBox="0 0 100 100" class="w-24 h-24" aria-hidden="true">
  {#if id === 'slime'}
    <ellipse cx="50" cy="70" rx="38" ry="25" fill="#10b981" opacity="0.8" />
    <ellipse cx="50" cy="60" rx="35" ry="30" fill="#34d399" opacity="0.7" />
    <circle cx="38" cy="55" r="5" fill="#1e293b" />
    <circle cx="62" cy="55" r="5" fill="#1e293b" />
    <circle cx="39" cy="54" r="2" fill="white" />
    <circle cx="63" cy="54" r="2" fill="white" />
    <path d="M 38 68 Q 50 75 62 68" stroke="#1e293b" stroke-width="2" fill="none" />
  {:else if id === 'zombie'}
    <rect x="22" y="46" width="56" height="5" rx="2.5" fill="#65a30d" />
    <rect x="30" y="50" width="40" height="34" rx="4" fill="#4d7c0f" />
    <rect x="41" y="82" width="8" height="12" rx="2" fill="#3f6212" />
    <rect x="51" y="82" width="8" height="12" rx="2" fill="#3f6212" />
    <rect x="35" y="16" width="30" height="34" rx="12" fill="#84cc16" />
    <circle cx="43" cy="32" r="4" fill="#1e293b" />
    <circle cx="57" cy="32" r="4" fill="#1e293b" />
    <path d="M 40 42 L 44 40 L 48 43 L 52 40 L 56 43 L 60 42" stroke="#1e293b" stroke-width="2" fill="none" />
    <path d="M 46 18 L 50 12 L 54 18" stroke="#3f6212" stroke-width="2" fill="none" />
  {:else if id === 'skeleton'}
    <rect x="46" y="50" width="8" height="34" rx="2" fill="#cbd5e1" />
    <path d="M 30 56 H 70 M 32 64 H 68 M 34 72 H 66" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round" />
    <path d="M 36 84 L 50 92 L 64 84" stroke="#e2e8f0" stroke-width="3" fill="none" />
    <path d="M 36 26 Q 36 12 50 12 Q 64 12 64 26 L 64 40 Q 64 48 56 50 L 44 50 Q 36 48 36 40 Z" fill="#e2e8f0" />
    <circle cx="43" cy="30" r="6" fill="#0f172a" />
    <circle cx="57" cy="30" r="6" fill="#0f172a" />
    <path d="M 49 38 L 51 38 L 50 42 Z" fill="#0f172a" />
    <path d="M 42 45 H 58" stroke="#0f172a" stroke-width="2" />
  {:else if id === 'demon'}
    <path d="M 30 36 L 18 14 L 40 26 Z" fill="#7f1d1d" />
    <path d="M 70 36 L 82 14 L 60 26 Z" fill="#7f1d1d" />
    <ellipse cx="50" cy="60" rx="26" ry="28" fill="#b91c1c" />
    <ellipse cx="50" cy="40" rx="20" ry="18" fill="#dc2626" />
    <path d="M 34 80 L 26 92 M 66 80 L 74 92" stroke="#7f1d1d" stroke-width="5" stroke-linecap="round" />
    <path d="M 36 40 L 46 44 L 36 46 Z" fill="#facc15" />
    <path d="M 64 40 L 54 44 L 64 46 Z" fill="#facc15" />
    <path d="M 40 52 L 44 56 L 48 52 L 52 56 L 56 52 L 60 56" stroke="#fef2f2" stroke-width="2" fill="none" />
  {:else}
    <path d="M 42 40 L 6 18 L 14 56 L 30 60 Z" fill="#0f766e" opacity="0.85" />
    <path d="M 58 40 L 94 18 L 86 56 L 70 60 Z" fill="#0f766e" opacity="0.85" />
    <path d="M 38 60 Q 36 92 50 94 Q 64 92 62 60 Z" fill="#15803d" />
    <ellipse cx="50" cy="44" rx="20" ry="18" fill="#16a34a" />
    <path d="M 36 30 L 44 20 L 50 28 L 56 20 L 64 30" fill="#ea580c" />
    <path d="M 36 44 L 26 50 L 36 52 Z" fill="#fde68a" />
    <circle cx="42" cy="42" r="3" fill="#fde047" />
    <circle cx="58" cy="42" r="3" fill="#fde047" />
    <circle cx="42" cy="42" r="1.2" fill="#1e293b" />
    <circle cx="58" cy="42" r="1.2" fill="#1e293b" />
    <path d="M 44 52 Q 50 56 56 52" stroke="#14532d" stroke-width="2" fill="none" />
  {/if}
</svg>
