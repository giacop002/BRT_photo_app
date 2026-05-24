<script>
    // Stores
    import { get } from 'svelte/store';
    import {
        currentMode,
        openCreateSample,
        openEditSample,
        resetUI
    } from '@S/ui';
    import {
        samples,
        selectedSampleId,
        canExportSamples,
        exportSampleToPdf,
        exportAllSamplesToPdf
    } from '@S/samples';
    import { selectedProbeId } from '@S/probes';
    import { startBatchCreate } from '@S/batch';

    // Assets
    import leftArrowIcon from '@A/iconArrowLeft.svg';
    import exportIcon from '@A/iconFileExport.svg';
    import exportAllIcon from '@A/iconFiles.svg';
    import addIcon from '@A/iconPlus_White.svg';
    import editIcon from '@A/iconEdit_White.svg';
    import addPhotoIcon from '@A/iconPlusPhoto_White.svg';
    import addMultipleIcon from '@A/iconPlusMultiple_White.svg';

    let showCreateOptions = false;

    function handleExportSample() {
        const sampleId = get(selectedSampleId);

        if (!sampleId) return;

        exportSampleToPdf(sampleId);
    }

    function handleExportAllSamples() {
        const probeId = get(selectedProbeId);
        const currentSamples = get(samples);

        if (!probeId) return;

        if (currentSamples.length === 0) {
            alert('No samples to export');
            return;
        }

        exportAllSamplesToPdf();
    }

    function toggleCreateOptionsMenu() {
        showCreateOptions = !showCreateOptions;
    }

    function handleOpenSampleCreateForm() {
        showCreateOptions = false;
        openCreateSample();
    }

    function handleOpenBatchCreateForm() {
        showCreateOptions = false;
        startBatchCreate();
    }

    function handleGoBack() {
        resetUI();
    }

    function handleEditSample() {
        const sampleId = get(selectedSampleId);
        if (!sampleId) return;
        openEditSample(sampleId);
    }

    $: if ($currentMode !== 'list') {
        showCreateOptions = false;
    }
</script>

<div class="button-box">
    {#if $currentMode != 'list'}
        <button class="back btn-secondary"
            on:click={handleGoBack}
        >
            <img class="icon" src={leftArrowIcon} alt="Back" />
             Back
        </button>
        {#if $currentMode === 'detail'}
            <button class="edit btn-primary"
                on:click={handleEditSample}
            >
                <img class="icon" src={editIcon} alt="Edit" />
                 Edit
            </button>
            <button class="export btn-secondary"
                on:click={handleExportSample}
                disabled={!$selectedSampleId}
            >
                <img class="icon" src={exportIcon} alt="Export Sample" />
                Export
            </button>
        {/if}
    {:else}
        <button class="create btn-primary"
                disabled={!$selectedProbeId}
                on:click={toggleCreateOptionsMenu}>
            <img class="icon" src={addIcon} alt="Add Sample" />
            Add Sample
        </button>
        {#if showCreateOptions}
            <div class="menu">
                <button class="btn" on:click={handleOpenSampleCreateForm}>
                <img class="icon" src={addPhotoIcon} alt="Create sample" />
                Create new sample
                </button>
                <button class="btn" on:click={handleOpenBatchCreateForm}>
                <img class="icon" src={addMultipleIcon} alt="Import batch" />
                Import multiple samples
                </button>
            </div>
        {/if}
        <button class="export btn-secondary"
                disabled={!$canExportSamples}
                on:click={handleExportAllSamples}
        >
            <img class="icon" src={exportAllIcon} alt="Export All Samples" />
            Export all samples
        </button>
    {/if}
</div>

<style>
    img.icon {
        width: 16px;
        height: 16px;
    }

    .button-box {
        display: flex;
        flex-direction: row;
        gap: 12px;
        padding: 12px;
        border-radius: 4px;
        font-family: Lato, sans-serif;
        position: relative;
    }

    button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        font-size: 14px;
        font-family: Lato, sans-serif;
        border: none;
        border-radius: 4px;
    }

    .btn-secondary:hover:not(:disabled) {
        background-color: #ccc;
        cursor: pointer;
    }

    .btn-primary {
        background-color: rgb(5, 69, 112);
        color: white;
    }

    .btn-primary:disabled {
        background-color: rgb(5, 69, 112, 0.5);
    }

    .btn-primary:hover:not(:disabled) {
        background-color: rgb(6, 89, 144);
        cursor: pointer;
    }

    .menu {
        position: absolute;
        top: 80%;
        right: 20%;
        background: rgb(5, 69, 112);
        border: 1px solid rgb(226, 232, 240);
        border-radius: 4px;
        padding: 4px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 10;
    }

    .menu button {
        padding: 8px 10px;
        background: rgb(5, 69, 112);
        text-align: left;
        font-size: 14px;
        color: white;
    }

    .menu button:hover {
        background: rgb(6, 89, 144);
    }
</style>