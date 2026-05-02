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
  let newProbeName = ''
  let createInput
  let renamingId = null
  let renameValue = ''
  let renameInput

  function handleSelect(id, name) {
    dispatch('selectProbe', { id, name })
  }

  function handleDelete(id, event) {
    event.stopPropagation()
    if (confirm('Are you sure you want to delete this probe?')) {
      dispatch('deleteProbe', { id })
    }
  }

  function handleOptionsMenu(id, event) {
    event.stopPropagation()
    openMenuId = openMenuId === id ? null : id
  }

  async function handleRename(probe) {
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
    isCreating = true
    newProbeName = ''
    await tick()
    createInput?.focus()
  }

  function submitCreate() {
    if (newProbeName.trim()) {
      dispatch('createProbe', { name: newProbeName.trim() })
      isCreating = false
    }
  }

  function cancelCreate() {
    isCreating = false
    newProbeName = ''
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
    <span>Probes</span>
    <button class="create" on:click={startCreate}>
      <img class="icon" src={plusIcon} alt="Create Probe" />
    </button>
  </div>

  {#if isCreating}
    <input
      class="input"
      bind:this={createInput}
      bind:value={newProbeName}
      placeholder="Drill Hole"
      on:keydown={handleKey}
      on:blur={cancelCreate}
    />
  {/if}

  <div class="list">
    {#if probes.length === 0}
      <div class="empty">No probes yet</div>
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
            <button class="name" on:click={() => handleSelect(probe.id, probe.name)}>
              {probe.name}
            </button>
          {/if}

          <button class="options" on:click={(e) => handleOptionsMenu(probe.id, e)}>
            <img class="icon" src={gearIcon} alt="Options" />
          </button>

          {#if openMenuId === probe.id}
            <div class="menu">
              <button on:click={() => handleRename(probe)}>
                <img class="icon" src={editIcon} alt="Rename" />
                Rename
              </button>
              <button on:click={(e) => handleDelete(probe.id, e)}>
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
    background: #1e1e1e;
    color: #fff;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #333;
    margin-right: 1vw;
  }

  .header {
    padding: 12px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #333;
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
    background: #2a2a2a;
    text-decoration: underline;
  }

  .item.selected {
    background: #3a3a3a;
  }

  .input {
    padding: 8px 10px;
    margin: 8px;
    background: #2a2a2a;
    border: 1px solid #444;
    color: white;
  }

  .empty {
    padding: 12px;
    color: #aaa;
  }

  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 16px;
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
    background: #2a2a2a;
    border: 1px solid #444;
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
    background: #3a3a3a;
  }

  .rename-input {
    width: 100%;
    padding: 4px 6px;
    background: #2a2a2a;
    border: 1px solid #666;
    color: white;
    font-size: 14px;
  }
</style>