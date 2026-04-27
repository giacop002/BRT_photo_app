<script>
  import ImageCrop from "./ImageCrop.svelte";
  import { createEventDispatcher } from "svelte";

  export let file_path;
  export let enableCrop = true;

  const dispatch = createEventDispatcher();

  function handleCrop(e) {
    dispatch('crop', e.detail);
  }

  let cropRef;

  export function maximizeCrop() {
    cropRef?.maximizeCrop();
  }

  export function resetCrop() {
    cropRef?.resetCrop();
  }
</script>

<div class="container">
  {#if enableCrop}
    <ImageCrop
      src={`file://${file_path}`}
      bind:this={cropRef}
      on:crop={handleCrop}
    />
  {:else}
    <img src={`file://${file_path}`} alt="img" />
  {/if}
</div>

<style>
.container {
  width: 100%;
  height: 100%;
}
img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>