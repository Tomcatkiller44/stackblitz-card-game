<script lang="ts">
  import type { GameScreen } from './types';
  import { persistentWritable } from './persistentStore';
  import StartScreen from './StartScreen.svelte';
  import BattleScene from './BattleScene.svelte';

  function isGameScreen(value: unknown): value is GameScreen {
    return value === 'start' || value === 'battle';
  }

  const screen = persistentWritable<GameScreen>('spire-clash:screen:v1', 'start', isGameScreen);
</script>

{#if $screen === 'start'}
  <StartScreen onStart={() => screen.set('battle')} />
{:else}
  <BattleScene />
{/if}
