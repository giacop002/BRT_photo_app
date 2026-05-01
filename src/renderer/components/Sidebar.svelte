<script>
  import { createEventDispatcher, tick } from 'svelte'
  export let probes = []
  export let selectedProbeId = null

  const dispatch = createEventDispatcher()

  let isCreating = false
  let newProbeName = ''
  let createInput

  function handleSelect(id, name) {
    dispatch('selectProbe', { id, name })
  }

  function handleDelete(id, event) {
    event.stopPropagation()
    if (confirm('Are you sure you want to delete this probe?')) {
      dispatch('deleteProbe', { id })
    }
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
</script>

<div class="sidebar">
  <div class="header">
    <span>Probes</span>
    <button on:click={startCreate}>+</button>
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
        <div class="item {probe.id === selectedProbeId ? 'selected' : ''}">
          <button class="name" on:click={() => handleSelect(probe.id, probe.name)}>
            {probe.name}
          </button>
          <button class="delete" on:click={(e) => handleDelete(probe.id, e)}>X</button>
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

  .delete {
    opacity: 0;
  }

  .item:hover .delete {
    opacity: 1;
  }
</style>