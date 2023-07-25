<script lang="ts">
  import { onMount } from "svelte";
  import { userStore } from "../stores/user_store";
  import { navigate } from "svelte-routing";

  onMount(() => {
    userStore.remove();
    navigate("login", { replace: true });
  });
</script>
