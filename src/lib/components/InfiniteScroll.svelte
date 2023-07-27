<script lang="ts">
  import { Subscription, debounceTime, fromEvent, map } from "rxjs";
  import { createEventDispatcher, onDestroy } from "svelte";

  export let horizontal = false;
  export let threshold = 50;
  export let elementScroll: any = null;
  export let hasMore = false;

  const dispatch = createEventDispatcher();
  let loading = false;
  let component: any;
  let disposers: Subscription[] = [];

  function onScroll(element: HTMLElement) {
    const offset = horizontal
      ? element.scrollWidth - element.clientWidth - element.scrollLeft
      : element.scrollHeight - element.clientHeight - element.scrollTop;

    if (offset < threshold && !loading && hasMore) {
      loading = true;
      dispatch("loadMore");
    } else {
      loading = false;
    }
  }

  $: {
    if (component || elementScroll) {
      const element = elementScroll ? elementScroll : component.parentNode;
      disposers.push(
        fromEvent(element, "scroll")
          .pipe(
            debounceTime(300),
            map((e: UIEvent) => e.target)
          )
          .subscribe(onScroll)
      );
      disposers.push(
        fromEvent(element, "resize")
          .pipe(
            debounceTime(300),
            map((e: UIEvent) => e.target)
          )
          .subscribe(onScroll)
      );
    }
  }
  onDestroy(() => {
    disposers.forEach((disposer) => disposer.unsubscribe());
  });
</script>

<div bind:this={component} />
