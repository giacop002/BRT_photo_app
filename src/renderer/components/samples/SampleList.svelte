<script>
    import { createEventDispatcher } from 'svelte';
    import SampleRow from './SampleRow.svelte';

    export let samples = [];
    export let selectedSampleId = null;

    const dispatch = createEventDispatcher();

    function handleSelect(id) {
        dispatch('selectSample', { id });
    }

    function handleDelete(id) {
        if (confirm('Are you sure you want to delete this sample?')) {
            dispatch('deleteSample', { id });
        }
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
                on:delete={() => handleDelete(sample.id)}
                on:export={() => dispatch('exportSample', { id: sample.id })}
            />
        {/each}
    {/if}
</div>

<style>
  .list {
    overflow-y: auto;
  }

  .empty {
    padding: 20px;
    color: #777;
  }
</style>