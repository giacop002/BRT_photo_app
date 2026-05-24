<script>
    // Stores
    import { selectedSample } from "@S/samples";
    // Assets
    import placeholderImg from "@A/Placeholder.svg";
</script>

{#if $selectedSample}
<div class="content">
    <div class="image">
        <img
            src={`file://${$selectedSample.image_path}`}
            alt="sample"
            on:error={(e) => e.target.src = placeholderImg}
        />
    </div>

    <div class="meta">
        <p><strong>From:</strong> {$selectedSample.depth_from} m</p>
        <p><strong>To:</strong> {$selectedSample.depth_to} m</p>
        <p><strong>Date:</strong> {$selectedSample.sample_date || '-'}</p>
    </div>
</div>
{/if}

<style>
    .content {
        display: flex;
        gap: 16px;
        font-family: Lato, sans-serif;
    }

    div, p {
        font-family: Lato, sans-serif;
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