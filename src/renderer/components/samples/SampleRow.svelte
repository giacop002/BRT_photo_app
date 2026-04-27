<script>
  import { createEventDispatcher } from 'svelte'

  export let sample
  export let isSelected = false

  const dispatch = createEventDispatcher()
</script>

<div
  class="row {isSelected ? 'selected' : ''}"
>
  <img src={sample.image_path} alt="Sample preview" />

  <div class="info">
    <div class="depth">
      {sample.depth_from}m - {sample.depth_to}m
    </div>
    <div class="date">
      {sample.sample_date || 'Unknown date'}
    </div>
  </div>

  <div class="actions">
    <button on:click={() => dispatch('click')}>Detail</button>
    <button on:click={() => dispatch('export')} disabled={!sample}>Export</button>
    <button on:click={() => dispatch('delete')}>Delete</button>
  </div>
</div>

<style>
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding: 10px;
    width: 100%;
    border: none;
    border-bottom: 1px solid #eee;
    background: transparent;
    text-align: left;
  }

  .row:hover {
    background: #f5f5f5;
  }

  .row.selected {
    background: #e0e0e0;
  }

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    background: #ddd;
    flex-shrink: 0;
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
  }

  .depth {
    font-weight: bold;
  }

  .date {
    font-size: 12px;
    color: #666;
  }

  .actions {
    display: flex;
    gap: 6px;
  }

  .actions button {
    font-size: 12px;
    padding: 4px 8px;
    cursor: pointer;
  }
</style>