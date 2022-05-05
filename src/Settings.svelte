<script lang="ts">
  import { invoke } from "@tauri-apps/api/tauri";

  import { read, save, shortcutStore, themeStore } from "./lib/Store";
  import { _ } from "svelte-i18n";
  import Theme from "./Settings/Theme.svelte";
  import ShortcutsComp from "./Settings/Shortcuts.svelte";
  import Misc from "./Settings/Misc.svelte";
  import { onMount } from "svelte";
  import { appWindow, getAll, PhysicalPosition } from "@tauri-apps/api/window";
  import { globalShortcut } from "@tauri-apps/api";
  import { getPie } from "./lib/Pie";

  let tabs = [
    { name: "settings.tabs.shortcuts.title", comp: ShortcutsComp },
    { name: "settings.tabs.theme.title", comp: Theme },
    { name: "settings.tabs.misc.title", comp: Misc },
  ];
  let selectedTab = tabs[0];

  onMount(() => {
    read().then(() => {
      globalShortcut.unregisterAll().then(() =>
        globalShortcut.register("CmdOrControl+Q", () =>
          invoke("get_mouse").then((v: [number, number]) => {
            const pie = getPie();
            pie.setPosition(
              new PhysicalPosition(
                Math.round(v[0] - $themeStore.windowsize[0] / 2),
                Math.round(v[1] - $themeStore.windowsize[1] / 2)
              )
            );
            pie.show();
          })
        )
      );

      shortcutStore.subscribe((v) => {
        const pie = getPie();
        save();
        pie.emit("update", { shortcuts: v.default.data });
      });

      themeStore.subscribe((v) => {
        const pie = getPie();
        save();
        pie.emit("updateTheme", { theme: v });
      });
    });
  });

  appWindow.listen("tauri://close-requested", (e) => {
    const all = getAll();
    for (let i = 0; i < all.length; i++) {
      const e = all[i];
      e.close();
    }
  });
</script>

<div class="main">
  <div class="top">
    <h1>{$_("settings.title")}</h1>
  </div>
  <div class="tabmenu">
    {#each tabs as tab}
      <div on:click={() => (selectedTab = tab)} class:selected={selectedTab === tab}><p>{$_(tab.name)}</p></div>
    {/each}
  </div>
  <div class="tabitem">
    <svelte:component this={selectedTab.comp} />
  </div>
</div>

<style lang="scss">
  .main {
    display: flex;
    flex-direction: column;
    padding: 0px 10px;
    height: 100vh;
  }

  :global(button, input[type="submit"]) {
    border-radius: 20px;
    border: none;
  }

  :global(input[type="text"]) {
    border: none;
    box-shadow: inset 0px 0px 3px rgb(75, 75, 75);
    padding: 10px;
    border-radius: 30px;
  }

  .top {
    display: flex;
  }

  .selected {
    background-color: rgb(255, 201, 136) !important;
  }

  .tabmenu {
    display: flex;
    gap: 5px;
    & > div {
      padding: 0px 20px;
      border-radius: 10% 10% 0 0;
      background-color: bisque;
      box-shadow: inset 0px -1px 5px rgb(255, 201, 136);
      transition: all 0.3s;
    }
  }

  .tabitem {
    padding: 0px 10px;
    overflow: auto;
    border-top: 3px solid rgb(255, 201, 136);
    height: 100%;
  }
</style>
