<script>
  import { onMount, onDestroy, createEventDispatcher, tick } from "svelte";
  import plusIcon from '@/assets/iconPlus_White.svg'
  import gearIcon from '@/assets/iconGear_White.svg'
  import editIcon from '@/assets/iconEdit_White.svg'
  import deleteIcon from '@/assets/iconDelete_White.svg'


  export let probes = []
  export let selectedProbeId = null

  const dispatch = createEventDispatcher()

  let isCreating = false
  let openMenuId = null
  let newProbeName = 'BRT-DDH-'
  let createInput
  let renamingId = null
  let renameValue = ''
  let renameInput

  function handleSelect(id, name) {
    dispatch('selectProbe', { id, name })
  }

  function handleDelete(id, event) {
    event.stopPropagation()
    if (confirm('Are you sure you want to delete this drill hole and its samples?')) {
      dispatch('deleteProbe', { id })
    }
  }

  function handleOptionsMenu(id, event) {
    event.stopPropagation()
    openMenuId = openMenuId === id ? null : id
  }

  async function handleRename(probe) {
    window.focus();
    renamingId = probe.id
    renameValue = probe.name
    openMenuId = null

    await tick()
    renameInput?.focus()
    renameInput?.select()
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
    window.focus();
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

  function handleKey(e) {
    if (e.key === 'Enter') submitCreate()
    if (e.key === 'Escape') cancelCreate()
  }

  function handleClickOutside() {
    openMenuId = null
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
  {/if}

  <div class="list">
    {#if probes.length === 0 && !isCreating}
      <div class="empty">
        No drill holes yet
        <button class="create" on:click={startCreate}>
          Click
          <img class="icon" src={plusIcon} alt="Create Probe" />
          to create
        </button>
      </div>
    {:else}
      {#each probes as probe}
        <div class="item
          {probe.id === selectedProbeId ? 'selected' : ''}
          {(openMenuId === probe.id) || (selectedProbeId === probe.id) ? 'active' : ''}"
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
            <button class="name btn" on:click={() => handleSelect(probe.id, probe.name)}>
              {probe.name}
            </button>
          {/if}

          <button class="options btn" on:click={(e) => handleOptionsMenu(probe.id, e)}>
            <img class="icon" src={gearIcon} alt="Options" />
          </button>

          {#if openMenuId === probe.id}
            <div class="menu">
              <button class="btn" on:click={() => handleRename(probe)}>
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
</div>

<style>
  .sidebar {
    width: 220px;
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
    border-bottom: 1px solid rgb(226, 232, 240);
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
    margin: 8px;
    background: rgb(6, 89, 144);
    border: 1px solid rgb(226, 232, 240);
    color: white;
  }

  .empty {
    padding: 12px;
    color: #aaa;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .empty button.create {
    border-color: #fff;
    border-radius: 5px;
    border-width: 2px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 8px 12px;
  }

  .empty button.create:hover {
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