<script lang="ts">
  import Sidebar from "./Sidebar.svelte";
</script>

<main class="main-wrapper">
  <Sidebar show={true} />
  <div class="content-wrapper">
    <slot />
  </div>
</main>

<style lang="scss">
  .main-wrapper {
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 100vh;

    > .content-wrapper {
      background-color: antiquewhite;
      width: 100%;
      height: 100vh;
    }
  }
</style>
