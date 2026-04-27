<script>
    import { createEventDispatcher } from 'svelte';
    import SampleList from "./samples/SampleList.svelte";
    import SampleCreateForm from "./samples/SampleCreateForm.svelte";
    import SampleDetail from "./samples/SampleDetail.svelte";

    export let samples = [];
    export let selectedSampleId = null;
    export let loadingSamples = false;
    export let selectedProbeId = null;

    let isCreatingSample = false;

    const dispatch = createEventDispatcher();

    function handleSelectSample(id) {
        dispatch('selectSample', { id });
    }

    function handleOpenSampleModal() {
        isCreatingSample = true;
    }

    function handleExportThisSample(id) {
        dispatch('exportThisSample', { id });
    }

    function handleExportAllSamples() {
        if (!selectedProbeId) return;
        if (samples.length === 0) {
            alert('No samples to export');
            return;
        }
        dispatch('exportAllSamples');
    }

    function handleBackToList() {
        selectedSampleId = null;
        dispatch('backToList');
    }

</script>

<div class="main">
    <div class="samples">
        {#if isCreatingSample}
            <SampleCreateForm
                {samples}
                isOpen={isCreatingSample}
                on:close={() => isCreatingSample = false}
                on:submit={(e) => {
                dispatch('createSample', e.detail);
                isCreatingSample = false;
                }}
            />
        {:else if selectedSampleId}
            <SampleDetail
                sampleId={selectedSampleId}
                on:back={handleBackToList}
                on:exportSample={(e) => handleExportThisSample(e.detail.id)}
            />
        {:else}
            <div class="header">
                <h2>
                {#if (!selectedProbeId)}
                    No probe selected
                {:else}
                    Probe {selectedProbeId}
                {/if}
                </h2>
                <div class="button-box">
                    <button class="create btn"
                            disabled={!selectedProbeId}
                            on:click={handleOpenSampleModal}>
                        + Add Sample
                    </button>
                    <button class="export btn"
                            disabled={true}
                            on:click={handleExportAllSamples}
                    >
                        Export all samples
                    </button>
                </div>
            </div>
            {#if !selectedProbeId}
                <div class="empty">Please select a probe to see its samples</div>
            {:else}
                <SampleList
                {samples}
                {selectedSampleId}
                on:selectSample={(e) => handleSelectSample(e.detail.id)}
                on:deleteSample={(e) => dispatch('deleteSample', { id: e.detail.id })}
                on:exportSample={(e) => handleExportThisSample(e.detail.id)}
                />
            {/if}
        {/if}
    </div>

    {#if loadingSamples}
      <div class="overlay">Loading samples...</div>
    {/if}
</div>

<style>
    .main {
        flex: 1;
        height: 100%;
    }

    .samples {
        height: 95%;
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: rgba(255,255,255,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #eee;
    }

    .empty {
        padding: 20px;
        color: #777;
    }
</style>