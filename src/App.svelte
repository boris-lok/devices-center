<script>
  import Login from "./lib/pages/Login.svelte";
  import { userStore } from "./lib/stores/user_store";

  userStore.useLocalStorage();
</script>

<main>
  <Login />
</main>
