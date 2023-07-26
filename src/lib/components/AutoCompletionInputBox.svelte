<script lang="ts">
  import {
    BehaviorSubject,
    Subscription,
    debounceTime,
    distinctUntilChanged,
  } from "rxjs";
  import { onDestroy, onMount } from "svelte";
  import InputBox from "./InputBox.svelte";
  import { servicesClient } from "../services/service";

  let subscription: Subscription;
  const searchBox = new BehaviorSubject("");
  let data = [];

  const onSearchBoxChanged = (e: InputEvent) => {
    searchBox.next((e.target as HTMLInputElement).value);
  };

  onMount(() => {
    subscription = searchBox
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(async (value) => {
        const resp = await servicesClient
          .path("/api/v1/devices")
          .get({ body: { query: value } });

        if (resp.status == "200") {
          data = resp.body.devices;
        }
      });
  });

  onDestroy(() => {
    subscription?.unsubscribe();
  });
</script>

<div class="auto-completion-container">
  <div class="search-area-wrapper">
    <InputBox name="searh-box" label="search" on:input={onSearchBoxChanged} />
  </div>
</div>

<ul>
  {#each data as { id, name }}
    <li>{id} - {name}</li>
  {/each}
</ul>
