import { writable, type Writable } from 'svelte/store';

export function persistentWritable<T>(
  key: string,
  initialValue: T,
  isValid: (value: unknown) => value is T
): Writable<T> {
  let value = initialValue;

  if (typeof window !== 'undefined') {
    try {
      const savedValue = window.localStorage.getItem(key);
      if (savedValue !== null) {
        const parsed: unknown = JSON.parse(savedValue);
        if (isValid(parsed)) {
          value = parsed;
        } else {
          console.warn(`Ignoring invalid saved state for "${key}".`);
        }
      }
    } catch (error) {
      console.error(`Could not load saved state for "${key}".`, error);
    }
  }

  const store = writable(value);
  store.subscribe((currentValue) => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(key, JSON.stringify(currentValue));
    } catch (error) {
      console.error(`Could not save state for "${key}".`, error);
    }
  });

  return store;
}
