<script>
    // Stores
    import { resetUI } from "@S/ui";
    import { updateSample, selectedSample } from "@S/samples";

    // Assets
    import cancelIcon from "@A/iconX.svg";
    import saveIcon from "@A/iconSave_White.svg";


    let file_path = null;
    let depth_from = '';
    let depth_to = '';
    let sample_date = '';

    let initialized = false;

    // let previewRef;

    $: if ($selectedSample && !initialized) {
        file_path = $selectedSample.image_path;
        depth_from = $selectedSample.depth_from ?? '';
        depth_to = $selectedSample.depth_to ?? '';
        sample_date = $selectedSample.sample_date
            ? $selectedSample.sample_date.slice(0, 10)
            : '';

        initialized = true;
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

        const updatedSampleData = {
            file_path,
            // cropped_image: previewRef?.getCroppedImage(),
            depth_from: depth_from !== '' ? parseFloat(depth_from) : null,
            depth_to: depth_to !== '' ? parseFloat(depth_to) : null,
            sample_date: sample_date || null
        };

        try {
            await updateSample($selectedSample.id, updatedSampleData);
            reset();
        }
        catch (err) {
            console.error(err);
            alert('Failed to update sample');
        }
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
        resetUI();
    }
</script>

<div class="content">
    <div class="left">
        <div class="preview">
            <img src={file_path} alt="sample">
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

        <div class="actions">
            <button class="save" on:click={handleSubmitEdit}>
                <img class="icon" src={saveIcon} alt="Save" />
                Save
            </button>
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

    img.icon {
        width: 16px;
        height: 16px;
    }
</style>