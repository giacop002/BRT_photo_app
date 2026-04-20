<script>
    import { createEventDispatcher } from 'svelte';
    import SampleRow from './SampleRow.svelte';

    export let samples = [];
    export let selectedSampleId = null;

    const dispatch = createEventDispatcher();

    function handleSelect(id) {
        dispatch('selectSample', { id });
    }
</script>

<div class="list">
    {#if samples.length === 0}
        <div class="empty">No samples yet</div>
    {:else}
        {#each samples as sample}
            <SampleRow
                {sample}
                isSelected={sample.id === selectedSampleId}
                on:click={() => handleSelect(sample.id)}
            />
        {/each}
    {/if}
</div>

<style>
  .list {
    height: 100%;
    overflow-y: auto;
  }

  .empty {
    padding: 20px;
    color: #777;
  }
</style>