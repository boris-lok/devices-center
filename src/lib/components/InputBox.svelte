<script lang="ts">
  import { type InputBoxType } from "../models/inputType";

  export let value = "";
  export let hasError = false;
  export let name = "";
  export let type: InputBoxType = "text";
  export let label = "";
  export let hint: string | null = null;

  export const reset = () => (ref.value = "");

  let ref: { value: string };
  const typeAction = (node: HTMLInputElement) => {
    node.type = type;
  };
</script>

<div class="input-box-container">
  <input
    bind:this={ref}
    class:error={hasError}
    {name}
    on:blur
    on:input
    on:keypress
    placeholder=""
    type="text"
    use:typeAction
    {value}
  />
  <span>{label}</span>
  {#if hint !== null}
    <div class="hint">{hint}</div>
  {/if}
</div>

<style lang="scss">
  @import "src/assets/constants";

  .input-box-container {
    position: relative;
    width: 100%;
    margin: 1em 0;

    > input {
      width: 100%;
      border: 1px solid $black;
      padding: 10px 16px;
      border-radius: 5px;
      outline: none;
      font-size: 1em;
    }

    > span {
      position: absolute;
      left: 0;
      padding: 10px;
      pointer-events: none;
      font-size: 1em;
      text-transform: uppercase;
      transition: 0.3s;
    }

    > input:focus ~ span,
    input:not(:placeholder-shown) ~ span {
      color: $deep-blue;
      transform: translateX(10px) translateY(-12px);
      font-size: 0.65em;
      padding: 0 16px;
      background-color: $pure-white;
      border-radius: 5px;
    }

    > input:focus {
      border: 1px solid $deep-blue;
    }

    > input.error {
      border: 1px solid $error;
    }

    .hint {
      font-size: 13px;
      color: $deep-blue;
      font-weight: 700;
      padding: 0 1em;
      margin: 0.25em 0 0 0;
    }
  }
</style>
