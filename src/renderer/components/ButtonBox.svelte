<script>
    import { createEventDispatcher } from 'svelte';
    import leftArrowIcon from "@/assets/iconArrowLeft.svg";
    import exportIcon from "@/assets/iconFileExport.svg";
    import exportAllIcon from "@/assets/iconFiles.svg";
    import addIcon from "@/assets/iconPlus.svg";

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
</script>

<div class="button-box">
    {#if isCreatingSample}
        <button
            on:click={handleGoBack}
        >
            <img class="icon" src={leftArrowIcon} alt="Back" />
             Back
        </button>
    {:else if selectedSampleId}
        <button
            on:click={handleGoBack}
        >
            <img class="icon" src={leftArrowIcon} alt="Back" />
             Back
        </button>
        <button
            on:click={handleExportSample}
            disabled={!selectedSampleId}
        >
            <img class="icon" src={exportIcon} alt="Export Sample" />
            Export
        </button>
    {:else if selectedProbeId}
        <button class="create btn"
                disabled={!selectedProbeId}
                on:click={handleOpenSampleCreateForm}>
            <img class="icon" src={addIcon} alt="Create Sample" />
            Add Sample
        </button>
        <button class="export btn"
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
    }

    button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        font-size: 14px;
        cursor: pointer;
    }
</style>