<script>
    import { createEventDispatcher } from "svelte";
    import ImagePreview from "../img/ImagePreview.svelte";
    import cropImgIcon from "@/assets/iconCropImg.svg";
    import cropSqrIcon from "@/assets/iconCropSquare.svg";
    import cancelIcon from "@/assets/iconX.svg";
    import createIcon from "@/assets/iconPlus_White.svg";
    import saveIcon from "@/assets/iconSave_White.svg";

    export let samples = [];
    export let isCreatingSample = false;
    export let editMode = false;
    export let sampleToEdit_id = null;

    let prevSampleId = null;

    let sampleToEdit = null;
    async function loadData() {
        if (loading) return;
        loading = true;

        try {
            sampleToEdit = await window.api.getSampleById(sampleToEdit_id);
        } finally {
            loading = false;
        }
    }


    const dispatch = createEventDispatcher();

    let file_path = null;
    let cropped_image = null;
    let depth_from = '';
    let depth_to = '';
    let sample_date = '';

    let initialized = false;

    let previewRef;
    let loading = false;

    function getToday() {
        return new Date().toISOString().slice(0, 10);
    }

    $: if (editMode && sampleToEdit_id !== prevSampleId) {
        prevSampleId = sampleToEdit_id;

        sampleToEdit = null;
        initialized = false;

        file_path = null;
        depth_from = '';
        depth_to = '';
        sample_date = '';

        loadData();
    }

    $: if (editMode && sampleToEdit && !initialized) {
        file_path = sampleToEdit.image_path;
        depth_from = sampleToEdit.depth_from ?? '';
        depth_to = sampleToEdit.depth_to ?? '';
        sample_date = sampleToEdit.sample_date
            ? sampleToEdit.sample_date.slice(0, 10)
            : '';

        initialized = true;
    }

    $: if (!editMode && samples && !initialized) {
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
            cropped_image: previewRef?.getCroppedImage(),
            depth_from: depth_from !== '' ? parseFloat(depth_from) : null,
            depth_to: depth_to !== '' ? parseFloat(depth_to) : null,
            sample_date: sample_date || null
        });

        reset()
    }

    async function handleSubmitEdit() {
        if (!file_path) {
            alert('Please select an image');
            return;
        }

        if (depth_from && depth_to && depth_from > depth_to) {
            alert('Depth from < depth to');
            return;
        }

        dispatch('edit', {
            id: sampleToEdit.id,
            file_path,
            cropped_image: previewRef?.getCroppedImage(),
            depth_from: depth_from !== '' ? parseFloat(depth_from) : null,
            depth_to: depth_to !== '' ? parseFloat(depth_to) : null,
            sample_date: sample_date || null
        });

        reset();
    }

    function handleCancel() {
        reset();
    }

    function reset() {
        file_path = null;
        depth_from = '';
        depth_to = '';
        sample_date = '';

        initialized = false;
        isCreatingSample = false;
        editMode = false;
        sampleToEdit_id = null;
        dispatch('close');
    }

    async function pickFile() {
        file_path = await window.api.selectImageFile();
    }
</script>

<div class="content">
    <div class="left">
        <div class="preview">
        {#if editMode}
            <img src={file_path} alt="sample">
        {:else}
            {#if file_path}
                <ImagePreview
                    {file_path}
                    bind:this={previewRef}
                    on:crop={(e) => cropped_image = e.detail.dataUrl}
                />
            {:else}
                <div class="placeholder">
                    No image selected
                    <button class="pick-img" on:click={pickFile}>
                        Select image
                    </button>
                </div>
            {/if}
        {/if}
        </div>
    </div>
    <div class="right">
        <div class="depth field">
            <p>From:</p>
            <input type="number" step="0.01" min="0" placeholder="Depth From" bind:value={depth_from} />
        </div>
        <div class="depth field">
            <p>To:</p>
            <input type="number" step="0.01" min="0" placeholder="Depth To" bind:value={depth_to} />
        </div>
        <div class="date field">
            <p>Date:</p>
            <input type="date" bind:value={sample_date} />
        </div>
        {#if !editMode}
            <button class="pick-img" on:click={pickFile}>
                {file_path ? 'Change image' : 'Select image'}
            </button>
            <div class="adjust-crop">
                <button class="maximize-crop" on:click={() => previewRef?.maximizeCrop()} disabled={!file_path}>
                    <img class="icon" src={cropImgIcon} alt="Use full img icon" />
                    Use full image
                </button>
                <button class="reset-crop" on:click={() => previewRef?.resetCrop()} disabled={!file_path}>
                    <img class="icon" src={cropSqrIcon} alt="Reset crop icon" />
                    Reset crop
                </button>
            </div>
        {/if}
        <div class="actions">
            {#if editMode}
                <button class="save" on:click={handleSubmitEdit}>
                    <img class="icon" src={saveIcon} alt="Save" />
                    Save
                </button>
            {:else}
                <button class="save" on:click={handleSubmit}>
                    <img class="icon" src={createIcon} alt="Create" />
                    Create
                </button>
            {/if}
            <button class="cancel" on:click={handleCancel}>
                <img class="icon" src={cancelIcon} alt="Cancel" />
                Cancel
            </button>
        </div>
    </div>
</div>

<style>
    .content {
        display: flex;
        flex: 1;
        gap: 16px;
        font-family: Lato, sans-serif;
    }

    div, p, input, button {
        font-family: Lato, sans-serif;
        margin: 0;
    }

    p {
        font-weight: bold;
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

    .preview img {
        max-width: 100%;
        max-height: 100%;
    }

    .placeholder {
        color: #888;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .right {
        margin-top: 10px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }

    .field {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-content: center;
        width: 100%;
    }

    .right input {
        padding: 8px;
        border: 1px solid #ccc;
    }


    .actions {
        display: flex;
        width: 100%;
        justify-content: space-between;
        gap: 10px;
    }

    .actions button {
        flex: 1;
        padding: 10px;
        border: none;
        cursor: pointer;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }

    .save {
        background: rgb(5, 69, 112);
        color: white;
    }

    .save:hover {
        background: rgb(6, 89, 144);
    }

    .cancel:hover {
        background: #ccc;
    }

    .adjust-crop {
        display: flex;
        gap: 10px;
        width: 100%;
    }

    .adjust-crop button {
        flex: 1;
        padding: 10px;
        border: none;
    }

    .adjust-crop button:not(:disabled):hover {
        cursor: pointer;
        background: #ccc;
    }

    .pick-img {
        padding: 10px;
        border: none;
        cursor: pointer;
        background: rgb(5, 69, 112);
        color: white;
    }

    .pick-img:hover {
        background: rgb(6, 89, 144);
    }

    img.icon {
        width: 16px;
        height: 16px;
    }
</style>