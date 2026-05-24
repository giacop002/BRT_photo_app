<script>
    // Stores
    import {
        batchSamples,
        selectedSampleIndex,
        batchDate,
        selectedSample,
        updateBatchSample,
        saveBatch,
        cancelBatch,
        selectBatchSample
    } from '@S/batch';

    // import ImagePreview from '@C/img/ImagePreview.svelte';

    // let previewRef;

    function handleSelectSample(index) {
        selectBatchSample(index);
    }

    function handlePrev() {
        if ($selectedSampleIndex > 0) {
            handleSelectSample($selectedSampleIndex - 1);
        }
    }

    function handleNext() {
        if ($selectedSampleIndex < $batchSamples.length - 1) {
            handleSelectSample($selectedSampleIndex + 1);
        }
    }

    function handleSaveAll() {
        saveBatch();
    }

    function handleCancel() {
        cancelBatch();
    }

    // function handleCrop(event) {
    //     currentSample.cropped_image = event.detail.dataUrl;
    // }
</script>

<div class="batch-container">
    <div class="sidebar">
        <div class="sidebar-header">
            <h3>Imported Photos</h3>
            <p>{$batchSamples.length} samples</p>
        </div>

        <div class="thumbnail-list">
            {#each $batchSamples as sample, index}
                <button
                    class:selected={index === $selectedSampleIndex}
                    class="thumbnail-item"
                    on:click={() => handleSelectSample(index)}
                >
                    <img
                        src={`file://${sample.file_path}`}
                        class="thumbnail"
                        alt="sample thumbnail"
                    />

                    <div class="meta">
                        <div>
                            From {sample.depth_from} - To {sample.depth_to}
                        </div>
                        <div class="filename">
                            {sample.file_path.split('/').pop()}
                        </div>
                    </div>
                </button>
            {/each}
        </div>
    </div>

    <div class="editor">
        <div class="right">
            <div class="fields">
                <div class="field">
                    <p>Batch Date:</p>
                    <input
                        type="date"
                        value={$batchDate}
                        on:input={(e) =>
                            updateBatchSample(
                                $selectedSampleIndex,
                                {
                                    batch_date: e.target.value
                                }
                            )
                        }
                    />
                </div>
                <div class="field">
                    <p>From:</p>
                    <input
                        type="number"
                        step="0.01"
                        value={$selectedSample.depth_from}
                        on:input={(e) =>
                            updateBatchSample(
                                $selectedSample.order,
                                {
                                    depth_from: parseFloat(e.target.value)
                                }
                            )
                        }
                    />
                </div>
                <div class="field">
                    <p>To:</p>
                    <input
                        type="number"
                        step="0.01"
                        value={$selectedSample.depth_to}
                        on:input={(e) =>
                            updateBatchSample(
                                $selectedSample.order,
                                {
                                    depth_to: parseFloat(e.target.value)
                                }
                            )
                        }
                    />
                </div>
            </div>

            <div class="actions">
                <button class="save btn-secondary" on:click={handlePrev} disabled={$selectedSampleIndex === 0}>
                    Previous
                </button>

                <button class="prev btn-secondary" on:click={handleNext} disabled={$selectedSampleIndex === $batchSamples.length - 1}>
                    Next
                </button>

                <button class="next btn-primary" on:click={handleSaveAll}>
                    Save All Samples
                </button>

                <button class="cancel btn-secondary" on:click={handleCancel}>
                    Cancel
                </button>
            </div>
        </div>

        <div class="left">
            <div class="preview">
                <!-- <ImagePreview
                    file_path={$selectedSample.file_path}
                    on:crop={handleCrop}
                /> -->
                <img src={$selectedSample.file_path} alt="current sample">
            </div>
        </div>
    </div>
</div>

<style>
    .batch-container {
        display: flex;
        flex: 1;
        height: 100%;
        overflow: hidden;
    }

    /* SIDEBAR */

    .sidebar {
        width: 260px;
        border-right: 1px solid #ddd;
        display: flex;
        flex-direction: column;
        background: #fafafa;
    }

    .sidebar-header {
        padding: 12px;
        border-bottom: 1px solid #ddd;
    }

    .thumbnail-list {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .thumbnail-item {
        display: flex;
        gap: 10px;
        padding: 8px;
        border: 1px solid transparent;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        text-align: left;
    }

    .thumbnail-item:hover {
        background: #f0f0f0;
    }

    .thumbnail-item.selected {
        border-color: rgb(6, 89, 144);
        background: #9ed8ff;
    }

    .thumbnail-item img {
        width: 70px;
        height: 70px;
        object-fit: cover;
        border-radius: 6px;
        flex-shrink: 0;
    }

    .meta {
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
        font-size: 13px;
    }

    .filename {
        color: #777;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /* EDITOR */

    .editor {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: row;
        padding: 16px;
        gap: 16px;
    }

    .left {
        flex: 3;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .preview {
        flex: 1;
        border: 1px solid #ddd;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fafafa;
        max-height: 100vh;
    }

    .preview img {
        width: 100%;
    }

    .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        gap: 20px;
    }

    .fields {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .field {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        gap: 6px;
    }

    .field input {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 6px;
    }

    .field p {
        margin: 0;
        font-weight: bold;
    }

    .actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
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

    button {
        border: none;
        padding: 10px 14px;
        border-radius: 8px;
    }
</style>