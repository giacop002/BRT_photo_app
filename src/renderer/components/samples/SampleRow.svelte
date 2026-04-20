<script>
  import { createEventDispatcher } from 'svelte'

  export let sample
  export let isSelected = false

  const dispatch = createEventDispatcher()
</script>

<button
  type="button"
  class="row {isSelected ? 'selected' : ''}"
  on:click={() => dispatch('click')}
  aria-pressed={isSelected}
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
</button>

<style>
  .row {
    display: flex;
    gap: 10px;
    padding: 10px;
    width: 100%;
    cursor: pointer;
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
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .depth {
    font-weight: bold;
  }

  .date {
    font-size: 12px;
    color: #666;
  }
</style>