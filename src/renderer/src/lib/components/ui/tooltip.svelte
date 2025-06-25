<script lang="ts">
  import { tick } from 'svelte';
  export let content = '';
  export let placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  let show = false;

  function handleMouseEnter() {
    show = true;
  }
  function handleMouseLeave() {
    show = false;
  }
  async function handleClick(e: MouseEvent) {
    show = false;
    await tick();
  }
</script>

<style>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}
.tooltip-tip {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  background: #222;
  color: #fff;
  font-size: 13px;
  padding: 4px 10px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  z-index: 100;
  opacity: 1;
  pointer-events: auto;
  transition: opacity 0.15s, top 0.15s;
}
.tooltip-wrapper:hover .tooltip-tip,
.tooltip-wrapper:focus-within .tooltip-tip {
  opacity: 1;
  pointer-events: auto;
}
.tooltip-tip.top { bottom: 120%; }
.tooltip-tip.bottom { top: 120%; }
.tooltip-tip.left { right: 120%; left: auto; top: 50%; transform: translateY(-50%); }
.tooltip-tip.right { left: 120%; top: 50%; transform: translateY(-50%); }
@media (prefers-color-scheme: dark) {
  .tooltip-tip {
    background: #333;
    color: #eee;
  }
}
</style>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
  class="tooltip-wrapper"
  tabindex="-1"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  on:focusin={handleMouseEnter}
  on:focusout={handleMouseLeave}
  on:click|capture={handleClick}
>
  <slot />
  {#if show && content}
    <span role="tooltip" aria-hidden="true" class="tooltip-tip {placement}">{content}</span>
  {/if}
</span> 