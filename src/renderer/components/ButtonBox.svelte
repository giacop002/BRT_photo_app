<script>
    import { createEventDispatcher } from 'svelte';
    import leftArrowIcon from "@/assets/iconArrowLeft.svg";
    import exportIcon from "@/assets/iconFileExport.svg";
    import exportAllIcon from "@/assets/iconFiles.svg";
    import addIcon from "@/assets/iconPlus_White.svg";
    import editIcon from '@/assets/iconEdit_White.svg';
    import addPhotoIcon from '@/assets/iconPlusPhoto_White.svg';
    import addMultipleIcon from '@/assets/iconPlusMultiple_White.svg';

    export let samples = [];
    export let selectedProbeId = null;
    export let selectedSampleId = null;
    export let isCreatingSample = false;
    export let isBatchCreating = false;

    let openCreateMenu = false;

    const dispatch = createEventDispatcher();

    function handleExportSample() {
        if (!selectedSampleId) return;
        dispatch('exportSample', { id: selectedSampleId });
    }

    function handleExportAllSamples() {
        if (!selectedProbeId) return;
        if (samples.length === 0) {
            alert('No samples to export');
            return;
        }
        dispatch('exportAllSamples');
    }

    function handleOpenCreateMenu() {
        openCreateMenu = !openCreateMenu;
    }

    function handleOpenSampleCreateForm() {
        openCreateMenu = false;
        isCreatingSample = true;
        dispatch('openSampleCreateForm');
    }

    function handleOpenBatchCreateForm() {
        openCreateMenu = false;
        isBatchCreating = true;
        dispatch('openBatchCreateForm');
    }

    function handleGoBack() {
        isCreatingSample = false;
        isBatchCreating = false;
        openCreateMenu = false;
        selectedSampleId = null;
        dispatch('goBack');
    }

    function handleEditSample() {
        if (!selectedSampleId) return;
        dispatch('editSample', { id: selectedSampleId });
    }
</script>

<div class="button-box">
    {#if isCreatingSample || isBatchCreating}
    <!-- Sample Create Form -->
        <button class="back btn-secondary"
            on:click={handleGoBack}
        >
            <img class="icon" src={leftArrowIcon} alt="Back" />
             Back
        </button>
    {:else if selectedSampleId}
    <!-- Sample Details/Edit -->
        <button class="back btn-secondary"
            on:click={handleGoBack}
        >
            <img class="icon" src={leftArrowIcon} alt="Back" />
             Back
        </button>
        <button class="edit btn-primary"
            on:click={handleEditSample}
        >
            <img class="icon" src={editIcon} alt="Edit" />
             Edit
        </button>
        <button class="export btn-secondary"
            on:click={handleExportSample}
            disabled={!selectedSampleId}
        >
            <img class="icon" src={exportIcon} alt="Export Sample" />
            Export
        </button>
    {:else if selectedProbeId}
    <!-- Sample List -->
        <button class="create btn-primary"
                disabled={!selectedProbeId}
                on:click={handleOpenCreateMenu}>
            <img class="icon" src={addIcon} alt="Add Sample" />
            Add Sample
        </button>
        {#if openCreateMenu}
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
                disabled={!selectedProbeId || samples.length === 0}
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
    }

    .btn-secondary:hover:not(:disabled) {
        background-color: #ccc;
        cursor: pointer;
    }

    .btn-primary {
        background-color: rgb(5, 69, 112);
        color: white;
    }

    .btn-primary:hover {
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