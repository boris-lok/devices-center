<script lang="ts">
  import InputBox from "../components/InputBox.svelte";
  import { servicesClient } from "../services/service";
  import { userStore } from "../stores/user_store";
  import { navigate } from "svelte-routing";

  $: if ($userStore) {
    navigate("/dashboard", { replace: true });
  }

  let errorMsg: string | null = null;
  let username = "";
  let password = "";

  async function onKeyPress(e: KeyboardEvent) {
    const keyCode = e.code || e.key;
    if (keyCode == "Enter") {
      await login();
    }
  }

  async function submitHandler() {
    await login();
  }

  async function login() {
    function validate() {
      return username !== "" && password != "";
    }

    if (validate()) {
      errorMsg = null;
      const resp = await servicesClient.path("/api/v1/login").post({
        body: {
          username: username,
          password: password,
        },
      });

      if (resp.status == "200") {
        userStore.set(
          JSON.stringify({ username: username, token: resp.body.token })
        );

        navigate("/dashboard", { replace: true });
      } else {
        errorMsg = resp.body.message;
      }
    }
  }

  const onUserChanged = (e: InputEvent) =>
    (username = (e.target as HTMLInputElement).value);

  const onPasswordChanged = (e: InputEvent) =>
    (password = (e.target as HTMLInputElement).value);
</script>

<main>
  <div class="login-wrapper">
    <div class="login-container">
      {#if errorMsg !== null}
        <div class="error">{errorMsg}</div>
      {/if}
      <InputBox
        hasError={errorMsg !== null}
        label="Username"
        name="username"
        on:input={onUserChanged}
        on:keypress={onKeyPress}
      />
      <InputBox
        hasError={errorMsg !== null}
        label="Password"
        name="password"
        type="text"
        on:input={onPasswordChanged}
        on:keypress={onKeyPress}
      />

      <div class="btn-container">
        <button on:click={submitHandler}>Login</button>
      </div>
    </div>
  </div>
</main>

<style lang="scss">
  @import "src/assets/constants";

  .login-wrapper {
    width: 100%;
    height: 100vh;

    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;
  }

  .login-container {
    width: 100%;
    max-width: 24rem;
    height: 16rem;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    box-shadow: 0 0 24px 0 $grey-shadow;

    border-radius: 0.5rem;

    padding: 0 1.5rem;
  }

  .btn-container {
    width: 100%;
    text-align: center;
    margin-top: 1em;

    > button {
      width: 120px;
      height: 40px;
      color: $black;
      font-size: 1em;
      font-weight: 400;
      cursor: pointer;
      border: 1px solid $black;
      border-radius: 5px;
      background-color: $light-blue;
      transition: all 0.5s;

      &:hover {
        background-color: $deep-blue;
        font-weight: 600;
      }
    }
  }

  div.error {
    font-size: 1em;
    font-weight: 500;
    color: $error;
  }
</style>
