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
  import InfiniteScroll from "./InfiniteScroll.svelte";

  let subscription: Subscription;
  const searchBox = new BehaviorSubject("");
  let data = [];
  let count = 20;
  let fakeData = Array(20).map((x) => `${x}`);

  function fetchData() {
    fakeData = [...fakeData, ...Array(20).map((x) => `${x + count}`)];
    count += 20;
  }

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

<div style="width:100px; height: 100px">
  <div>
    {#each fakeData as row}
      <p>{row}</p>
    {/each}
  </div>
  <InfiniteScroll hasMore={true} on:loadMore={fetchData} threshold={60} />
</div>
