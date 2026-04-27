<script>
    import { onMount } from "svelte";
    import { createEventDispatcher } from "svelte";

    export let sampleId;

    const dispatch = createEventDispatcher();

    let sample = null;
    let observations = [];
    let newNote = '';

    async function loadData() {
        console.log('Loading data for sample ID:', sampleId);
        sample = await window.api.getSampleById(sampleId);
        observations = await window.api.getObservationsBySample(sampleId);
    }

    async function handleAddObservation() {
        if (!newNote.trim()) return;

        console.log('Adding observation for sample ID:', sampleId, 'Note:', newNote);

        await window.api.createObservation({
            sample_id: sampleId,
            notes: newNote
        });

        newNote = '';
        await loadData();
    }

    async function handleDeleteObservation(observationId) {
        await window.api.deleteObservation(observationId);
        await loadData();
    }

    onMount(loadData);
</script>

<div class="container">
    <div class="header">
        <div class="actions">
            <button
                on:click={() => dispatch('back')}
            >
                ← Back
            </button>
            <button
                on:click={() => dispatch('exportSample', { id: sampleId })}
                disabled={!sample}
            >
                Export
            </button>
        </div>
        <h2>Sample Detail</h2>
    </div>

    {#if sample}
        <div class="content">
            <div class="image">
                <img src={`file://${sample.image_path}`} alt="sample" />
            </div>

            <div class="meta">
                <p><strong>Depth:</strong> {sample.depth_from} - {sample.depth_to}</p>
                <p><strong>Date:</strong> {sample.sample_date || '-'}</p>
            </div>
        </div>

        <div class="observations">
            <h3>Observations</h3>

            <div class="new">
                <textarea bind:value={newNote} placeholder="Add observation..." />
                <button on:click={handleAddObservation}>Add</button>
            </div>

            {#if observations.length === 0}
                <p class="empty">No observations yet</p>
            {:else}
                {#each observations as obs}
                    <div class="obs">
                        <p>{obs.notes}</p>
                        <button on:click={() => handleDeleteObservation(obs.id)}>Delete</button>
                    </div>
                {/each}
            {/if}
        </div>
    {/if}
</div>

<style>
.container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px;
    gap: 16px;
}

.content {
    display: flex;
    gap: 16px;
}

.image {
    flex: 2;
}

.image img {
    width: 100%;
    height: auto;
    object-fit: contain;
}

.meta {
    flex: 1;
}

.observations {
    margin-top: 16px;
}

.new {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

textarea {
    min-height: 80px;
}

.actions {
    display: flex;
    justify-content: space-between;
}
</style>