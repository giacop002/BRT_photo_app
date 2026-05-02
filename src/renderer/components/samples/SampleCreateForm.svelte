<script>
    import { createEventDispatcher } from "svelte";
    import ImagePreview from "../img/ImagePreview.svelte";
    import { get } from "svelte/store";

    export let samples = [];
    export let isCreatingSample = false;

    const dispatch = createEventDispatcher();

    let file_path = null;
    let cropped_image = null;
    let depth_from = '';
    let depth_to = '';
    let sample_date = '';

    let initialized = false;

    let previewRef;

    function getToday() {
        return new Date().toISOString().slice(0, 10);
    }

    $: if (samples && !initialized) {
        if (samples.length === 0) {
            depth_from = 0;
            depth_to = 1;
            sample_date = getToday();
        } else {
            const maxSample = samples.reduce((max, s) => {
                const to = s.depth_to ?? 0;
                return to > (max.depth_to ?? 0) ? s : max;
            }, samples[0]);

            depth_from = maxSample.depth_to ?? 0;
            depth_to = depth_from + 1;
            const latestSample = samples.reduce((latest, s) => {
                if (!s.sample_date) return latest;
                if (!latest) return s;
                return new Date(s.sample_date) > new Date(latest.sample_date) ? s : latest;
            }, null);

            sample_date = latestSample?.sample_date
                ? latestSample.sample_date.slice(0, 10)
                : new Date().toISOString().slice(0, 10);
        }

        initialized = true;
    }

    async function handleSubmit() {
        if (!file_path) {
            alert('Please select an image');
            return;
        }
        if (depth_from && depth_to && depth_from > depth_to) {
            alert('Depth from < depth to')
            return
        }

        dispatch('submit', {
            file_path,
            cropped_image,
            depth_from: depth_from !== '' ? parseFloat(depth_from) : null,
            depth_to: depth_to !== '' ? parseFloat(depth_to) : null,
            sample_date: sample_date || null
        });

        reset()
    }

    function handleCancel() {
        reset();
        isCreatingSample = false;
        dispatch('close');
    }

    function reset() {
        file_path = null;
        depth_from = '';
        depth_to = '';
        sample_date = '';

        initialized = false;
    }

    async function pickFile() {
        file_path = await window.api.selectImageFile();
    }
</script>

<div class="content">
    <div class="left">
        <div class="preview">
            {#if file_path}
                <ImagePreview
                    {file_path}
                    bind:this={previewRef}
                    on:crop={(e) => cropped_image = e.detail.dataUrl}
                />
            {:else}
                <div class="placeholder">No image selected</div>
            {/if}
        </div>
        <button on:click={pickFile}>
            {file_path ? 'Cambiar imagen' : 'Seleccionar imagen'}
        </button>
        <div class="adjust-crop">
            <button on:click={() => previewRef?.maximizeCrop()} disabled={!file_path}>
                Use full image
            </button>
            <button on:click={() => previewRef?.resetCrop()} disabled={!file_path}>
                Reset crop
            </button>
        </div>
    </div>
    <div class="right">
        <p>Depth from:</p>
        <input type="number" step="0.01" min="0" placeholder="Depth From" bind:value={depth_from} />
        <p>Depth to:</p>
        <input type="number" step="0.01" min="0" placeholder="Depth To" bind:value={depth_to} />
        <p>Sample date:</p>
        <input type="date" bind:value={sample_date} />
        <div class="actions">
            <button class="save" on:click={handleSubmit}>Save</button>
            <button class="cancel" on:click={handleCancel}>Cancel</button>
        </div>
    </div>
</div>

<style>
    .content {
        display: flex;
        flex: 1;
        gap: 16px;
    }

    .left {
        flex: 2;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .preview {
        flex: 1;
        min-height: 300px;
        border: 1px solid #ddd;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fafafa;
    }

    .placeholder {
        color: #888;
    }

    .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .right input {
        padding: 8px;
        border: 1px solid #ccc;
    }


    .actions {
        margin-top: auto;
        display: flex;
        gap: 10px;
    }

    .save {
        background: #2e7d32;
        color: white;
    }

    .cancel {
        background: #ccc;
    }

    .adjust-crop {
        display: flex;
        width: 100%;
        gap: 10px;
    }

    .adjust-crop button {
        flex: 1;
    }
</style>