<script>
    import { createEventDispatcher } from 'svelte';
    import SampleList from "./samples/SampleList.svelte";
    import SampleCreateForm from "./samples/SampleCreateForm.svelte";
    import SampleDetail from "./samples/SampleDetail.svelte";
    import Header from "./Header.svelte";

    export let samples = [];
    export let selectedSampleId = null;
    export let loadingSamples = false;
    export let selectedProbeId = null;
    export let selectedProbeName = null;

    let isCreatingSample = false;
    let prevProbeId = null;

    const dispatch = createEventDispatcher();

    function handleSelectSample(id) {
        dispatch('selectSample', { id });
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

    function handleOpenSampleCreateForm() {
        isCreatingSample = true;
        dispatch('openSampleCreateForm');
    }

    function handleSubmitCreateSample(sampleData) {
        isCreatingSample = false;
        dispatch('createSample', sampleData);
    }

    function handleGoBack() {
        isCreatingSample = false;
        selectedSampleId = null;
        dispatch('goBack');
    }

    $: if (selectedProbeId !== prevProbeId) {
        selectedSampleId = null;
        isCreatingSample = false;

        prevProbeId = selectedProbeId;
    }

</script>

<div class="main">
    <div class="samples">
        <Header
            {samples}
            {selectedProbeId}
            {selectedProbeName}
            {selectedSampleId}
            {isCreatingSample}
            on:exportSample={(e) => handleExportThisSample(e.detail.id)}
            on:exportAllSamples={handleExportAllSamples}
            on:openSampleCreateForm={handleOpenSampleCreateForm}
            on:goBack={handleGoBack}
        />
        {#if isCreatingSample}
            <SampleCreateForm
                {samples}
                {isCreatingSample}
                on:submit={(e) => handleSubmitCreateSample(e.detail)}
                on:close={handleGoBack}
            />
        {:else if selectedSampleId}
            <SampleDetail
                sampleId={selectedSampleId}
            />
        {:else}
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
        margin-right: 1vw;
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

    .empty {
        padding: 20px;
        color: #777;
    }
</style>