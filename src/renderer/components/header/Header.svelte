<script>
    import ButtonBox from '@C/header/ButtonBox.svelte';
    import logo from '@A/fitzroy-minerals-logo.png';

    // Stores
    import { currentMode } from '@S/ui';
    import { selectedProject } from '@S/projects';
    import { selectedProbe } from '@S/probes';
</script>

<div class="header">
    <div class="title">
        <img src={logo} alt="Logo" />
        <h2>
        {#if !$selectedProject}
            Probe Photo App
        {:else}
            {$selectedProject.name} ({$selectedProject.code})
            {#if $currentMode != 'project' && $selectedProbe}
                {' - ' + $selectedProbe.name}
                {#if $currentMode === 'list'}
                    {' - Samples'}
                {:else if $currentMode === 'create'}
                    {' - New Sample'}
                {:else if $currentMode === 'batch'}
                    {' - Import Batch'}
                {:else if $currentMode === 'edit'}
                    {' - Edit Sample'}
                {:else if $currentMode === 'detail'}
                    {' - Sample Detail'}
                {/if}
            {/if}
        {/if}
        </h2>
    </div>
    <ButtonBox />
</div>

<style>
    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
        font-family: Lato, sans-serif;
    }

    div, h2 {
        font-family: Lato, sans-serif;
    }

    h2 {
        font-weight: 700;
        color: rgb(5, 69, 112);
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