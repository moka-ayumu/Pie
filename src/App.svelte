<script lang="ts">
  import Pie from "./Pie.svelte";
  import Settings from "./Settings.svelte";
  import "./lib/i18n";
  import { isLoading } from "svelte-i18n";

  const hash = window.location.hash;
  const pages = {
    "": Settings,
    "#Pie": Pie,
  };
</script>

{#if $isLoading}
  <div>Loading</div>
{:else}
  <svelte:component this={pages[hash]} />
{/if}

<style lang="scss" global>
  @import "scss/ibm-plex.scss";

  :root {
    font-family: "IBM Plex Sans", "IBM Plex Sans KR";
    margin: 0;
    padding: 0;
  }
</style>
