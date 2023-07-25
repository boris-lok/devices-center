<script lang="ts">
  import { navigate } from "svelte-routing";
  import { userStore } from "../stores/user_store";

  $: if (!$userStore) {
    navigate("login", { replace: true });
  }
</script>

{#if $userStore}
  <slot />
{/if}
