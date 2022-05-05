<script lang="ts">
  export let name: string;
  export let value: number = undefined;
  export let min = undefined;
  export let max = undefined;
  export let canNull = false;
</script>

<div>
  <h3>{name}</h3>
  <input
    type="number"
    bind:value
    {min}
    {max}
    on:change={(e) => {
      if (!canNull && value === null) {
        value = 0;
      } else if (value === null) {
        value = undefined;
      }
    }}
  />
</div>

<style lang="scss">
  div {
    display: flex;
    flex-direction: column;
  }

  input {
    border: 1px solid black;
    padding: 5px 10px;
    border-radius: 30px;
    transition: all 0.2s;
    outline: none;
  }

  input:focus {
    border: 1px solid rgb(255, 52, 137);
  }
</style>
