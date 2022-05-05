<script lang="ts">
  import { appWindow, LogicalSize, PhysicalSize } from "@tauri-apps/api/window";
  import { listen } from "@tauri-apps/api/event";
  import { Shortcuts, themeStore, Ttheme } from "./lib/Store";
  import { invoke } from "@tauri-apps/api";
  import { drawPie } from "./lib/Pie";
  import { t } from "svelte-i18n";

  let x = 0;
  let y = 0;
  let shortcuts: Shortcuts["data"] = [];
  let runShortcutState = false;
  let focusing = false;
  let selected = 0;

  let requestAnimationFrameHandle;

  let canvas: HTMLCanvasElement;

  appWindow.listen("tauri://focus", ({ event, payload }) => {
    x = 0;
    y = 0;
    focusing = true;
    requestAnimationFrameHandle = window.requestAnimationFrame(requestAnimationFrame);
  });

  appWindow.listen("tauri://blur", ({ event, payload }) => {
    window.cancelAnimationFrame(requestAnimationFrameHandle);
    focusing = false;
    appWindow.hide();
  });

  listen("update", (e) => {
    shortcuts = JSON.parse(e.payload as string).shortcuts;
  });

  listen("updateTheme", (e) => {
    const theme = JSON.parse(e.payload as string).theme as Ttheme;
    themeStore.set(theme);
    appWindow.setSize(new PhysicalSize(theme.windowsize[0], theme.windowsize[1]));
    console.log(theme, appWindow);
  });

  function windowClick(e: MouseEvent) {
    runShortcut();
  }

  function pointerMove(e: PointerEvent) {
    let tmp = $themeStore.windowsize[0] / 2;
    x = e.x - tmp;
    tmp -= 10;
    if (x > tmp) x = tmp;
    else if (x < -tmp) x = -tmp;
    tmp = $themeStore.windowsize[1] / 2;
    y = tmp - e.y;
    tmp -= 10;
    if (y > tmp) y = tmp;
    else if (y < -tmp) y = -tmp;
    console.log(x, y);
  }

  function pointerLeave(e: PointerEvent) {
    if (e.x < 70 || e.y < 70 || e.x > 130 || e.y > 130) {
      runShortcut();
    }
  }

  function runShortcut() {
    if (!runShortcutState) {
      appWindow.hide().then(() => {
        if (shortcuts.length > 0) {
          runShortcutState = true;
          invoke("simulate", { shortcuts: shortcuts[selected][2] }).then(() => {
            runShortcutState = false;
          });
        }
      });
    }
  }

  function requestAnimationFrame(timestamp: number) {
    selected = drawPie(canvas, shortcuts, x, y);
    requestAnimationFrameHandle = window.requestAnimationFrame(requestAnimationFrame);
  }
</script>

<div class="root">
  <canvas
    bind:this={canvas}
    class:show={focusing}
    width={`${$themeStore.windowsize[0]}px`}
    height={`${$themeStore.windowsize[1]}px`}
    on:click={windowClick}
    on:pointermove={pointerMove}
    on:pointerleave={pointerLeave}
  />
</div>

<svelte:body on:contextmenu={(e) => e.preventDefault()} />

<style lang="scss">
  :global(body) {
    overflow: hidden;
  }

  .root {
    width: 100vw;
    height: 100vh;
    cursor: none;
  }

  canvas {
    border-radius: 50%;
    transform: scale(0);
    opacity: 0;
  }

  .show {
    animation: anim_show 0.05s ease-out;
    animation-fill-mode: forwards;
  }

  @keyframes anim_show {
    from {
      transform: scale(0);
      transform: rotate(-0.3turn);
      opacity: 0;
    }
    to {
      transform: scale(1);
      transform: rotate(0turn);
      opacity: 1;
    }
  }
</style>
