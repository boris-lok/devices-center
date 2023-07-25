import { get, writable } from 'svelte/store';

const KEY = 'app_user';

const createWritableStore = (key: string, initial_value: unknown) => {
  const { subscribe, set } = writable(initial_value);

  return {
    subscribe,
    set,
    useLocalStorage: () => {
      const json = localStorage.getItem(key);
      if (json && json !== 'null') {
        set(json);
      }

      // Subscribe the user' change, if any new value is updated, update
      // local storage value.
      subscribe((current: string) => localStorage.setItem(key, current));
    },
    remove: () => {
      userStore.set(null);
      localStorage.removeItem(key);
    },
    get: () => {
      return get(userStore);
    },
  };
};

export const userStore = createWritableStore(KEY, null);
