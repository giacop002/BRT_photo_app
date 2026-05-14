<script>
    import { createEventDispatcher } from 'svelte';
    import getBaseMetadata from "@/utils/getBaseMetadata";
    import SampleList from "./samples/SampleList.svelte";
    import SampleCreateForm from "./samples/SampleCreateForm.svelte";
    import BatchCreateForm from "./samples/BatchCreateForm.svelte";
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

    let isBatchCreating = false;
    let batchSamples = [];
    let selectedBatchIndex = 0;

    let headerRef;

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
        isBatchCreating = false;
        isEditingSample = false;
        selectedSampleId = null;
        dispatch('goBack');
    }

    $: if (selectedProbeId !== prevProbeId) {
        selectedSampleId = null;
        isCreatingSample = false;
        isBatchCreating = false;
        isEditingSample = false;
        sampleToEdit_id = null;
        prevProbeId = selectedProbeId;
    }

    async function handleOpenBatchCreate() {
        const files = await window.api.selectImageFiles();

        if (!files.length) {
            isBatchCreating = false;
            headerRef.cancelBatchUpload();
            return;
        }

        files.sort();
        batchSamples = buildBatchSamples(files);

        selectedBatchIndex = 0;
        isBatchCreating = true;
    }

    function buildBatchSamples(files) {
        let _, meta = getBaseMetadata(samples);
        const generatedSamples = files.map((file, index) => ({
            temp_id: `batch-${index}`,
            file_path: file,
            depth_from: meta.depth_from + index,
            depth_to: meta.depth_from + index + 1,
            sample_date: meta.sample_date,
            croppped_image: null,
            edited: false,
        }));
        return generatedSamples;
    }

    function handleSaveBatch() {
        dispatch('saveBatch', { samples: batchSamples });
        isBatchCreating = false;
        batchSamples = [];
    }

    function handleCancelBatch() {
        isBatchCreating = false;
        batchSamples = [];
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
            {isBatchCreating}
            on:exportSample={(e) => handleExportThisSample(e.detail.id)}
            on:exportAllSamples={handleExportAllSamples}
            on:openSampleCreateForm={handleOpenSampleCreateForm}
            on:openBatchCreateForm={handleOpenBatchCreate}
            on:editSample={(e) => handleStartEdit(e.detail.id)}
            on:goBack={handleGoBack}
            bind:this={headerRef}
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
        {:else if isBatchCreating}
            <BatchCreateForm
                {batchSamples}
                on:saveAll={handleSaveBatch}
                on:close={handleCancelBatch}
            />
        {:else if selectedSampleId}
            <SampleDetail
                sampleId={selectedSampleId}
            />
        {:else}
            {#if !selectedProbeId}
                <div class="empty">
                    <strong>Select a drill hole</strong> on the sidebar to see its samples, or <strong>create a new one:</strong>
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
      <div class="overlay {loadingSamples ? 'active' : 'empty'}">Loading samples...</div>
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

    .overlay.active {
        position: absolute;
        inset: 0;
        background: rgba(255,255,255,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        pointer-events: all;
    }

    .overlay.empty {
        pointer-events: none;
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