<script>
    // Stores
    import { ui, currentMode } from '@S/ui';
    import { selectedProbe } from '@S/probes';

    // Components
    import Header from '@C/header/Header.svelte';
    import ProjectEditForm from '@C/projects/ProjectEditForm.svelte';
    import SampleList from '@C/samples/SampleList.svelte';
    import SampleCreateForm from '@C/samples/SampleCreateForm.svelte';
    import SampleEditForm from '@C/samples/SampleEditForm.svelte';
    import BatchCreateForm from '@C/samples/BatchCreateForm.svelte';
    import SampleDetail from '@C/samples/SampleDetail.svelte';

    // Assets
    import plusIcon from '@A/iconPlus.svg';
</script>

<div class="main">
    <div class="samples">
        <Header />
        {#if $currentMode === 'project'}
            <ProjectEditForm />
        {:else if $currentMode === 'create'}
            <SampleCreateForm />
        {:else if $currentMode === 'edit'}
            <SampleEditForm />
        {:else if $currentMode === 'detail'}
            <SampleDetail />
        {:else if $currentMode === 'batch'}
            <BatchCreateForm />
        {:else}
            {#if !$selectedProbe}
                <div class="empty">
                    <strong>Select a drill hole</strong> on the sidebar to see its samples, or <strong>create a new one:</strong>
                    <ol>
                        <li>click the <img class="icon" src={plusIcon} alt="Create Probe" /> button on the sidebar.</li>
                        <li>enter a name for the new drill hole, e.g., "BRT-DDH-001".</li>
                        <li>press Enter to create the drill hole.</li>
                    </ol>
                </div>
            {:else}
                <SampleList />
            {/if}
        {/if}
    </div>

    {#if $ui.loading}
      <div class="overlay {$ui.loading ? 'active' : 'empty'}">{$ui.overlayMessage}</div>
    {/if}
</div>

<style>
    .main {
        flex: 1;
        height: 100%;
        margin-right: 1vw;
        font-family: Lato, sans-serif;
    }

    div {
        font-family: Lato, sans-serif;
    }

    .samples {
        height: 95%;
    }

    .overlay.active {
        position: absolute;
        inset: 0;
        background: rgba(255,255,255,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        pointer-events: all;
    }

    .overlay.empty {
        pointer-events: none;
    }

    .empty {
        padding: 20px;
        color: #777;
    }

    img.icon {
        width: 16px;
        height: 16px;
    }
</style>