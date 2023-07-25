<script lang="ts">
  import { Route } from "svelte-routing";
  import PrivateRouteGuard from "./PrivateRouteGuard.svelte";

  export let path: string;
</script>

<Route let:location let:params {path}>
  <PrivateRouteGuard>
    <slot {location} {params} />
  </PrivateRouteGuard>
</Route>
