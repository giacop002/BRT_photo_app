<script>
  import { onMount, onDestroy, createEventDispatcher, tick } from "svelte";
  import plusIcon from '@/assets/iconPlus_White.svg'
  import gearIcon from '@/assets/iconGear_White.svg'
  import editIcon from '@/assets/iconEdit_White.svg'
  import deleteIcon from '@/assets/iconDelete_White.svg'
  import dotsIcon from '@/assets/iconDots_White.svg'


  export let projects = []
  export let probes = {}
  export let selectedProbeId = null
  export let selectedProjectId = null

  const dispatch = createEventDispatcher()

  let isCreating = false
  let openProbeMenuId = null
  let openProjectMenuId = null
  let newProbeName = 'BRT-DDH-'
  let newProbeToProjectName = 'BRT-DDH-'
  let createInput
  let renamingId = null
  let renameValue = ''
  let renameInput
  let createToProjectInput
  let createToProjectId = null

  function handleSelect(id, name, project_id) {
    dispatch('selectProbe', { id, name, project_id })
  }

  function handleDelete(id, event) {
    event.stopPropagation()
    if (confirm('Are you sure you want to delete this drill hole and its samples?')) {
      dispatch('deleteProbe', { id })
    }
  }

  function handleDeleteProject(id, event) {
    event.stopPropagation()
    if (confirm('Are you sure you want to delete this project and all its drill holes?')) {
      dispatch('deleteProject', { id })
    }
  }

  function handleProbeOptionsMenu(id, event) {
    event.stopPropagation()
    openProbeMenuId = openProbeMenuId === id ? null : id
  }

  function handleProjectOptionsMenu(id, event) {
    event.stopPropagation()
    openProjectMenuId = openProjectMenuId === id ? null : id
  }

  async function handleProbeRename(probe) {
    renamingId = probe.id
    renameValue = probe.name
    openProbeMenuId = null
    openProjectMenuId = null

    await tick()
    renameInput?.focus()
    renameInput?.select()
  }

  async function handleProjectRename(project_id) {
    dispatch('renameProject', { id: project_id })
    openProjectMenuId = null
  }

  function submitRename(probe) {
    if (renameValue.trim() && renameValue !== probe.name) {
      dispatch('renameProbe', {
        id: probe.id,
        name: renameValue.trim()
      })
    }
    renamingId = null
  }

  function cancelRename() {
    renamingId = null
    renameValue = ''
  }

  function handleRenameKey(e, probe) {
    if (e.key === 'Enter') submitRename(probe)
    if (e.key === 'Escape') cancelRename()
  }

  async function startCreate() {
    isCreating = true;
    newProbeName = 'BRT-DDH-';

    await tick();

    setTimeout(() => {
      createInput?.focus();
      createInput?.select();
    }, 0);
  }

  function submitCreate() {
    if (newProbeName.trim()) {
      dispatch('createProbe', { name: newProbeName.trim() })
      isCreating = false
    }
  }

  function cancelCreate() {
    isCreating = false
    newProbeName = 'BRT-DDH-'
  }

  async function startCreateToProject(project_id) {
    createToProjectId = project_id;
    newProbeToProjectName = 'BRT-DDH-';

    await tick();

    setTimeout(() => {
      createToProjectInput?.focus();
      createToProjectInput?.select();
    }, 0);
  }

  function submitCreateToProject() {
    if (newProbeToProjectName.trim()) {
      dispatch('createProbeToProject', { name: newProbeToProjectName.trim(), project_id: createToProjectId })
      createToProjectId = null
    }
  }

  function cancelCreateToProject() {
    createToProjectId = null
    newProbeToProjectName = 'BRT-DDH-'
  }

  function handleKey(e) {
    if (e.key === 'Enter') submitCreate()
    if (e.key === 'Escape') cancelCreate()
  }

  function handleCreateToProjectKey(e, project_id) {
    if (e.key === 'Enter') {
      submitCreateToProject()
      createToProjectId = null
    }
    if (e.key === 'Escape') {
      cancelCreateToProject()
    }
  }

  function handleClickOutside() {
    openProbeMenuId = null
    openProjectMenuId = null
  }

  onMount(() => {
    window.addEventListener('click', handleClickOutside)
  })

  onDestroy(() => {
    window.removeEventListener('click', handleClickOutside)
  })
</script>

<div class="sidebar">
  <div class="header">
    <span>Drill Holes</span>
    <button class="create btn" on:click={startCreate}>
      <img class="icon" src={plusIcon} alt="Create Probe" />
    </button>
  </div>

  <div class="list">
    {#each projects as project}
      <div class="project">
        <div class="header
          {project.id === selectedProjectId ? 'selected' : ''}
          {(openProjectMenuId === project.id) || (project.id === selectedProjectId) ? 'active' : ''}"
        >
          <span>
            {project.name} ({project.code})
          </span>
          <button class="project-options btn" on:click={(e) => handleProjectOptionsMenu(project.id, e)}>
            <img class="icon" src={dotsIcon} alt="Options" />
          </button>
        </div>
        {#if openProjectMenuId === project.id}
          <div class="menu">
            <button class="btn" on:click={() => startCreateToProject(project.id)}>
              <img class="icon" src={plusIcon} alt="Create Probe" />
              Add to Project
            </button>
            <button class="btn" on:click={() => handleProjectRename(project.id)}>
              <img class="icon" src={editIcon} alt="Rename" />
              Rename Project
            </button>
            <button class="btn" on:click={(e) => handleDeleteProject(project.id, e)}>
              <img class="icon" src={deleteIcon} alt="Delete" />
              Delete Project
            </button>
          </div>
        {/if}
        {#if createToProjectId === project.id}
          <input
            class="input"
            key={`create-to-project-input-${project.id}`}
            bind:this={createToProjectInput}
            bind:value={newProbeToProjectName}
            placeholder="New Drill Hole"
            on:keydown={(e) => handleCreateToProjectKey(e, project.id)}
            on:blur={() => cancelCreateToProject()}
          />
        {/if}
        {#if probes[project.id]}
          {#each probes[project.id] as probe}
            <div class="item
              {probe.id === selectedProbeId ? 'selected' : ''}
              {(openProbeMenuId === probe.id) || (selectedProbeId === probe.id) ? 'active' : ''}"
            >
              {#if renamingId === probe.id}
                <input
                  class="rename-input"
                  bind:this={renameInput}
                  bind:value={renameValue}
                  on:keydown={(e) => handleRenameKey(e, probe)}
                  on:blur={() => cancelRename()}
                />
              {:else}
                <button class="name btn" on:click={() => handleSelect(probe.id, probe.name, project.id)}>
                  {probe.name}
                </button>
              {/if}

              <button class="options btn" on:click={(e) => handleProbeOptionsMenu(probe.id, e)}>
                <img class="icon" src={gearIcon} alt="Options" />
              </button>

              {#if openProbeMenuId === probe.id}
                <div class="menu">
                  <button class="btn" on:click={() => handleProbeRename(probe)}>
                    <img class="icon" src={editIcon} alt="Rename" />
                    Rename
                  </button>
                  <button class="btn" on:click={(e) => handleDelete(probe.id, e)}>
                    <img class="icon" src={deleteIcon} alt="Delete" />
                    Delete
                  </button>
                </div>
              {/if}
            </div>
          {/each}
        {/if}
      </div>
    {/each}
  </div>

  <div class="bottom">
    {#if isCreating}
      <input
        class="input"
        key="create-input"
        bind:this={createInput}
        bind:value={newProbeName}
        placeholder="New Drill Hole"
        on:keydown={handleKey}
        on:blur={cancelCreate}
      />
    {:else}
      <button class="create" on:click={startCreate}>
        <img class="icon" src={plusIcon} alt="Create Probe" />
        Add to New Project
      </button>
    {/if}
  </div>
</div>

<style>
  .sidebar {
    width: 15vw;
    height: 100vh;
    background: rgb(5, 69, 112);
    color: #fff;
    display: flex;
    flex-direction: column;
    border-right: 1px solid rgb(226, 232, 240);
    margin-right: 1vw;
    font-family: Lato, sans-serif;
  }

  div, input, button {
      font-family: Lato, sans-serif;
  }

  .header {
    padding: 12px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid rgb(226, 232, 240);
  }

  .project .header {
    background: rgb(6, 89, 144);
    border-bottom: none;
  }

  .project {
    margin: 8px 0;
  }

  .bottom {
    padding: 12px;
    border-top: 2px solid rgb(226, 232, 240);
    display: flex;
    justify-content: center;
  }

  .list {
    position: relative;
    flex: 1;
    overflow-y: auto;
  }

  .item {
    padding: 10px 12px;
    display: flex;
    justify-content: space-between;
  }

  .item:hover {
    background: rgb(6, 89, 144);
    text-decoration: underline;
  }

  .item.selected {
    background: rgb(6, 89, 144);
  }

  .input {
    padding: 8px 10px;
    background: rgb(6, 89, 144);
    border: 1px solid rgb(226, 232, 240);
    color: white;
  }

  button.create {
    border-color: #fff;
    border-radius: 5px;
    border-width: 2px;
    padding: 8px 12px;
  }

  .bottom button.create {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
  }

  button.create:hover {
    background-color: rgb(6, 89, 144);
    cursor: pointer;
  }

  button {
    font-family: Lato, sans-serif;
    cursor: pointer;
    background: none;
    color: white;
  }

  .btn {
    border: none;
    font-size: 16px;
    font-family: Lato, sans-serif;
  }

  img.icon {
    width: 16px;
    height: 16px;
  }

  .options {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }

  .item:hover .options,
  .item.active .options {
    opacity: 1;
    pointer-events: auto;
  }

  .menu {
    position: absolute;
    right: 20%;
    background: rgb(5, 69, 112);
    border: 1px solid rgb(226, 232, 240);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    z-index: 10;
    min-width: 120px;
  }

  .menu button {
    padding: 8px 10px;
    text-align: left;
    font-size: 14px;
  }

  .menu button:hover {
    background: rgb(6, 89, 144);
  }

  .rename-input {
    width: 100%;
    padding: 4px 6px;
    background: rgb(6, 89, 144);
    border: 1px solid rgb(226, 232, 240);
    color: white;
    font-size: 14px;
  }
</style>