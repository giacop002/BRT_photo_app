<script>
    import { createEventDispatcher } from 'svelte';
    import SampleList from "./samples/SampleList.svelte";
    import SampleCreateForm from "./samples/SampleCreateForm.svelte";
    import SampleDetail from "./samples/SampleDetail.svelte";
    import Header from "./Header.svelte";
    import plusIcon from '@/assets/iconPlus.svg'

    export let samples = [];
    export let selectedSampleId = null;
    export let loadingSamples = false;
    export let selectedProbeId = null;
    export let selectedProbeName = null;

    let isCreatingSample = false;
    let isEditingSample = false;
    let sampleToEdit_id = null;
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

    function handleStartEdit(sampleId) {
        isEditingSample = true;
        sampleToEdit_id = sampleId;
        isCreatingSample = true;
    }

    function handleSubmitEdit(sampleData) {
        isEditingSample = false;
        isCreatingSample = false;
        dispatch('editSample', sampleData);
    }

    function handleGoBack() {
        isCreatingSample = false;
        isEditingSample = false;
        selectedSampleId = null;
        dispatch('goBack');
    }

    $: if (selectedProbeId !== prevProbeId) {
        selectedSampleId = null;
        isCreatingSample = false;
        isEditingSample = false;
        sampleToEdit_id = null;
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
            {isEditingSample}
            on:exportSample={(e) => handleExportThisSample(e.detail.id)}
            on:exportAllSamples={handleExportAllSamples}
            on:openSampleCreateForm={handleOpenSampleCreateForm}
            on:editSample={(e) => handleStartEdit(e.detail.id)}
            on:goBack={handleGoBack}
        />
        {#if isCreatingSample}
            <SampleCreateForm
                {samples}
                {isCreatingSample}
                editMode={isEditingSample}
                {sampleToEdit_id}
                on:submit={(e) => handleSubmitCreateSample(e.detail)}
                on:edit={(e) => handleSubmitEdit(e.detail)}
                on:close={handleGoBack}
            />
        {:else if selectedSampleId}
            <SampleDetail
                sampleId={selectedSampleId}
            />
        {:else}
            {#if !selectedProbeId}
                <div class="empty">
                    {#if samples.length === 0}
                    <strong>Create a new drill hole:</strong>
                    {:else}
                    <strong>Select a drill hole</strong> on the sidebar to see its samples, or <strong>create a new one:</strong>
                    {/if}
                    <ol>
                        <li>click the <img class="icon" src={plusIcon} alt="Create Probe" /> button on the sidebar.</li>
                        <li>enter a name for the new drill hole, e.g., "BRT-DDH-001".</li>
                        <li>press Enter to create the drill hole.</li>
                    </ol>
                </div>
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
        font-family: Lato, sans-serif;
    }

    div {
        font-family: Lato, sans-serif;
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

    img.icon {
        width: 16px;
        height: 16px;
    }
</style>