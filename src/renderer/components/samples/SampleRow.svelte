<script>
  import { createEventDispatcher } from 'svelte'
  import rightArrowIcon from "../../../assets/iconArrowRight.svg";
  import deleteIcon from "../../../assets/iconDelete.svg";
  import exportIcon from "../../../assets/iconFileExport.svg";

  export let sample
  export let isSelected = false

  const dispatch = createEventDispatcher()
</script>

<div
  class="row {isSelected ? 'selected' : ''}"
>
  <img class="preview" src={sample.image_path} alt="Sample preview" />

  <div class="info">
    <div class="depth">
      {sample.depth_from}m - {sample.depth_to}m
    </div>
    <div class="date">
      {sample.sample_date || 'Unknown date'}
    </div>
  </div>

  <div class="actions">
    <button on:click={() => dispatch('click')}>
      <img class="icon" src={rightArrowIcon} alt="Detail" />
      Detail
    </button>
    <button on:click={() => dispatch('export')} disabled={!sample}>
      <img class="icon" src={exportIcon} alt="Export" />
      Export
    </button>
    <button on:click={() => dispatch('delete')}>
      <img class="icon" src={deleteIcon} alt="Delete" />
      Delete
    </button>
  </div>
</div>

<style>
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding: 10px;
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

  img.preview {
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
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
  }

  img.icon {
    width: 16px;
    height: 16px;
  }
</style>