<script>
    import { onMount } from "svelte";

    export let sampleId;

    let sample = null;

    async function loadData() {
        sample = await window.api.getSampleById(sampleId);
    }

    onMount(loadData);
</script>

{#if sample}
<div class="content">
    <div class="image">
        <img src={`file://${sample.image_path}`} alt="sample" />
    </div>

    <div class="meta">
        <p><strong>Depth:</strong> {sample.depth_from} - {sample.depth_to}</p>
        <p><strong>Date:</strong> {sample.sample_date || '-'}</p>
    </div>
</div>
{/if}

<style>
    .content {
        display: flex;
        gap: 16px;
    }

    .image {
        flex: 2;
    }

    .image img {
        width: 100%;
        height: auto;
        object-fit: contain;
    }

    .meta {
        flex: 1;
    }
</style>