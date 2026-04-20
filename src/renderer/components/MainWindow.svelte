<script>
    import { createEventDispatcher } from 'svelte';
    import SampleList from "./samples/SampleList.svelte";

    export let samples = [];
    export let selectedSampleId = null;
    export let loadingSamples = false;

    const dispatch = createEventDispatcher();

    function handleSelectSample(id) {
        dispatch('selectSample', { id });
    }
</script>

<div class="main">
    <SampleList
      {samples}
      {selectedSampleId}
      on:selectSample={(e) => handleSelectSample(e.detail)}
    />

    {#if loadingSamples}
      <div class="overlay">Loading samples...</div>
    {/if}
</div>

<style>
    .main {
        flex: 1;
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: rgba(255,255,255,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>