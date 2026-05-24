<script>
    import SampleRow from '@C/samples/SampleRow.svelte';
    import { samples } from '@S/samples';
</script>

<div class="list">
    {#if $samples.length === 0}
        <div class="empty">No samples yet</div>
    {:else}
        {#each $samples as sample (sample.id)}
            <SampleRow {sample} />
        {/each}
    {/if}
</div>

<style>
    .list {
        overflow-y: auto;
        font-family: Lato, sans-serif;
    }

    div {
        font-family: Lato, sans-serif;
    }

    .empty {
        padding: 20px;
        color: #777;
    }
</style>