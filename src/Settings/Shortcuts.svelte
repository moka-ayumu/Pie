<script lang="ts">
  import { _ } from "svelte-i18n";
  import { Shortcuts, shortcutStore } from "../lib/Store";
  let input = [];
  let firstKey = "";
  let inputAble = false;
  let inputName = "";
  let selectStore = "default";
  let editSelect = 0;
  $: selected = $shortcutStore[selectStore] as Shortcuts;

  function keydown(e: KeyboardEvent) {
    const { key } = e;
    if (inputAble) {
      if (firstKey === "") {
        firstKey = key.length === 1 ? key.toLowerCase() : key;
        input = [firstKey];
      }
      if (e.key !== firstKey && input.indexOf(e.key) === -1) {
        input.push(key.length === 1 ? key.toLowerCase() : key);
        input = input;
      }
    }
  }

  function keyup(e: KeyboardEvent) {
    if (inputAble && e.key === firstKey) {
      firstKey = "";
      inputAble = false;
    }
  }

  function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (showNewShortcut === 2) {
      selected.edit(editSelect, inputName, input);
    } else if (input.length > 0) {
      selected.add(inputName, input);
    }
    inputName = "";
    input = [];
    showNewShortcut = 0;
  }

  let showNewShortcut = 0;
</script>

<div class="root">
  <div class="title">
    <h2>{$_("settings.tabs.shortcuts.shortcuts")}</h2>
    <label for="profile">{$_("settings.tabs.shortcuts.profile")}</label>
    <select bind:value={selectStore} id="profile">
      {#each Object.entries($shortcutStore) as [key, shortcuts]}
        <option value={key}>{key}</option>
      {/each}
    </select>
  </div>

  <button
    on:click={() => {
      showNewShortcut = 1;
      inputName = "";
      input = [];
    }}>+</button
  >
  <div class="shortcuts">
    {#each selected.data as shortcut, i}
      <div class="shortcut">
        <h3>{shortcut[0]}</h3>
        <p>{shortcut[2].join(" + ")}</p>
        <div>
          <button
            on:click={() => {
              editSelect = i;
              inputName = selected.data[i][0];
              input = selected.data[i][2];
              showNewShortcut = 2;
            }}
            class="btn-left">{$_("settings.tabs.shortcuts.shortcut-edit")}</button
          >
          <button on:click={() => selected.remove(i)} class="btn-right"
            >{$_("settings.tabs.shortcuts.shortcut-remove")}</button
          >
        </div>
      </div>
    {/each}
  </div>
  {#if showNewShortcut}
    <div class="newShortcut_back" on:click={(e) => (showNewShortcut = 0)} />
    <div class="newShortcut">
      <form on:submit={onSubmit}>
        <h2>{showNewShortcut === 1 ? $_("settings.tabs.shortcuts.new") : $_("settings.tabs.shortcuts.edit")}</h2>
        <input type="text" bind:value={inputName} placeholder={$_("settings.tabs.shortcuts.shortcut-name")} required />
        <div class="keyListener">
          <input
            type="text"
            readonly
            value={input.join(" + ")}
            required
            placeholder={$_("settings.tabs.shortcuts.need-keys")}
          />
          <button on:click={() => (inputAble = true)} disabled={inputAble}
            >{inputAble ? $_("settings.tabs.shortcuts.listening") : $_("settings.tabs.shortcuts.key-listen")}</button
          >
        </div>
        <div class="newShortcutControl">
          <input
            type="submit"
            value={showNewShortcut === 1
              ? $_("settings.tabs.shortcuts.shortcut-add")
              : $_("settings.tabs.shortcuts.edit")}
          />
          <button on:click={() => (showNewShortcut = 0)}>{$_("settings.tabs.shortcuts.cancel")}</button>
        </div>
      </form>
    </div>
  {/if}
</div>

<svelte:window on:keydown={keydown} on:keyup={keyup} />

<style lang="scss">
  .root {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .title {
    display: flex;
    gap: 10px;
    & > label {
      margin: auto 0;
    }
    & > select {
      margin: auto 0;
    }
  }

  .keyListener {
    display: flex;
    gap: 5px;
    & > input[type="text"] {
      text-overflow: ellipsis;
    }
  }

  .shortcuts {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .shortcut {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100px;
    height: 130px;
    padding: 10px;
    border-radius: 10px;
    background-color: bisque;
    & > h3 {
      margin-right: 10px;
      margin: 0;
    }
    & > p {
      margin-right: auto;
      margin: 0;
    }
    & > div {
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0%);
      bottom: 10px;
      display: flex;
      margin: auto;
      & > button {
        padding: 5px 10px;
        width: 50px;
      }
    }
    animation: inShortcut 0.5s;
    animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  .btn-left {
    border-radius: 10px 0 0 10px;
  }

  .btn-right {
    border-radius: 0 10px 10px 0;
  }

  @keyframes inShortcut {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .newShortcut_back {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(92, 82, 70, 0.5);
  }
  .newShortcut {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    width: 400px;
    height: 300px;
    display: flex;
    border-radius: 10px;

    & > form {
      margin: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      & > h2 {
        margin-top: 0px;
      }
    }
  }

  .newShortcutControl {
    display: flex;
    gap: 10px;
    & > button,
    input[type="submit"] {
      padding: 5px;
      width: 100%;
    }
  }
</style>
