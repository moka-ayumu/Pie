<script lang="ts">
  import { getAll, WebviewWindow } from "@tauri-apps/api/window";

  import { _, locale, locales } from "svelte-i18n";

  function openLicense() {
    const license = new WebviewWindow("License", {
      title: "License",
      url: "License.html",
    });
    license.show();
  }
</script>

<div class="container">
  <div class="misc">
    <h2>{$_("settings.tabs.misc.language")}</h2>
    <select bind:value={$locale}>
      {#each $locales as locale}
        <option value={locale}>{locale}</option>
      {/each}
    </select>
  </div>
  <button on:click={openLicense}>License</button>
</div>

<style lang="scss">
  .container {
    padding: 20px 0px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .misc {
    display: flex;
    gap: 10px;
    & > * {
      margin: auto 0;
    }
  }

  button {
    padding: 5px 10px;
  }
</style>
