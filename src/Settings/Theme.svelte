<script lang="ts">
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";

  import { drawPie, getroundxy } from "../lib/Pie";

  import { resetTheme, themeStore } from "../lib/Store";
  import ColInput from "../components/ColInput.svelte";
  let canvas: HTMLCanvasElement;
  const template: [string, string, string[]][] = [
    ["A", "", [""]],
    ["B", "", [""]],
    ["C", "", [""]],
  ];
  let angle = 0;
  onMount(() => {
    requestAnimationFrame(preview);
  });

  function preview() {
    let [x, y] = getroundxy(angle, 70);
    drawPie(canvas, template, x, y, 200, 200);
    angle = angle < 0 ? 360 : angle - 0.01;
    requestAnimationFrame(preview);
  }

  function detailAutoWindowSize() {
    themeStore.update((v) => {
      const size = v.radius * 3;
      v.windowsize = [size, size];
      return v;
    });
  }
</script>

<div class="container">
  <div class="title">
    <h2>{$_("settings.tabs.theme.title")}</h2>
    <button class="btnReset" on:click={resetTheme}>{$_("settings.tabs.theme.reset")}</button>
  </div>
  <div class="root">
    <canvas width="200" height="200" bind:this={canvas} />
    <div>
      <div class="inputcolor">
        <input type="color" bind:value={$themeStore.default} />
        <p>{$_("settings.tabs.theme.default")}</p>
      </div>
      <div class="inputcolor">
        <input type="color" bind:value={$themeStore.unselected} />
        <p>{$_("settings.tabs.theme.unselected")}</p>
      </div>
      <div class="inputcolor">
        <input type="color" bind:value={$themeStore.selected} />
        <p>{$_("settings.tabs.theme.selected")}</p>
      </div>
      <div class="inputcolor">
        <input type="color" bind:value={$themeStore.text.color} />
        <p>{$_("settings.tabs.theme.textcolor")}</p>
      </div>
    </div>
  </div>
  <ColInput name={$_("settings.tabs.theme.font-size")} min="0" max="100" bind:value={$themeStore.text.size} />
  <div class="details">
    <h2>{$_("settings.tabs.theme.details")}</h2>
    <div>
      <ColInput
        name={$_("settings.tabs.theme.thickness")}
        min="0"
        max="500"
        bind:value={$themeStore.thickness}
        on:change={detailAutoWindowSize}
      />
      <ColInput
        name={$_("settings.tabs.theme.radius")}
        min="0"
        max="500"
        bind:value={$themeStore.radius}
        on:change={detailAutoWindowSize}
      />
    </div>
    <h2>{$_("settings.tabs.theme.inner-pie")}</h2>
    <ColInput
      name={$_("settings.tabs.theme.thickness")}
      min="0"
      max="500"
      bind:value={$themeStore.followThickness}
      on:change={detailAutoWindowSize}
    />
    <ColInput
      name={$_("settings.tabs.theme.radius")}
      min="0"
      max="500"
      bind:value={$themeStore.followRadius}
      on:change={detailAutoWindowSize}
      canNull={true}
    />
  </div>
</div>

<style lang="scss">
  canvas {
    width: 200px;
    height: 200px;
    background-color: white;
    border-radius: 50px;
    margin-right: 10px;
  }

  .container {
    display: flex;
    flex-direction: column;
  }

  .title {
    display: flex;
  }

  .root {
    display: flex;
    align-self: center;
    & > div {
      display: flex;
      width: 100%;
      height: 200px;
      margin: auto;
    }
  }

  .inputcolor {
    position: relative;
    max-width: 130px;
    min-width: 90px;
    width: 25%;
    height: 95%;
    & > input {
      border: 0;
      background: none;
      padding: 0;
      border-radius: 100%;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
    & > p {
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translate(-50%, 0%);
      font-weight: 100;
    }
  }

  .btnReset {
    margin: auto auto auto 10px;
    padding: 5px 10px;
    height: 30px;
  }

  .details {
    display: flex;
    margin: auto;
    gap: 10px;
    & > div {
      display: flex;
      gap: 10px;
    }
  }
</style>
