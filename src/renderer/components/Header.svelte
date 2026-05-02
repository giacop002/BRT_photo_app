<script>
    import { createEventDispatcher } from 'svelte';
    import ButtonBox from './ButtonBox.svelte';
    import logo from "@/assets/fitzroy-minerals-logo.png";

    export let samples = [];
    export let selectedProbeId = null;
    export let selectedProbeName = null;
    export let selectedSampleId = null;
    export let isCreatingSample = false;

    const dispatch = createEventDispatcher();

    function handleExportSample(e) {
        dispatch('exportSample', e.detail);
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

<div class="header">
    <div class="title">
        <img src={logo} alt="Logo" />
        <h2>
        {#if isCreatingSample}
            Probe {selectedProbeName} - New Sample
        {:else if selectedSampleId}
            Probe {selectedProbeName} - Sample Detail
        {:else if (!selectedProbeId)}
            No probe selected
        {:else}
            Probe {selectedProbeName} - Samples
        {/if}
        </h2>
    </div>
    <ButtonBox
        {samples}
        {selectedProbeId}
        {selectedSampleId}
        {isCreatingSample}
        on:exportSample={handleExportSample}
        on:exportAllSamples={handleExportAllSamples}
        on:openSampleCreateForm={handleOpenSampleCreateForm}
        on:goBack={handleGoBack}
    />
</div>

<style>
    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
    }

    .title {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        gap: 10px;
        align-items: center;
    }

    .title img {
        height: 40px;
    }
</style>