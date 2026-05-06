<script>
    import { createEventDispatcher } from 'svelte';
    import leftArrowIcon from "@/assets/iconArrowLeft.svg";
    import exportIcon from "@/assets/iconFileExport.svg";
    import exportAllIcon from "@/assets/iconFiles.svg";
    import addIcon from "@/assets/iconPlus_White.svg";
    import editIcon from '@/assets/iconEdit_White.svg'

    export let samples = [];
    export let selectedProbeId = null;
    export let selectedSampleId = null;
    export let isCreatingSample = false;

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

    function handleOpenSampleCreateForm() {
        isCreatingSample = true;
        dispatch('openSampleCreateForm');
    }

    function handleGoBack() {
        isCreatingSample = false;
        selectedSampleId = null;
        dispatch('goBack');
    }

    function handleEditSample() {
        if (!selectedSampleId) return;
        dispatch('editSample', { id: selectedSampleId });
    }
</script>

<div class="button-box">
    {#if isCreatingSample}
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
                on:click={handleOpenSampleCreateForm}>
            <img class="icon" src={addIcon} alt="Create Sample" />
            Add Sample
        </button>
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
</style>