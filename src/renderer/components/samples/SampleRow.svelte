<script>
	// Stores
	import { openSampleDetail } from "@S/ui";
	import { selectSample, exportSampleToPdf, deleteSample } from "@S/samples";

	// Assets
    import rightArrowIcon from "@A/iconArrowRight_White.svg";
	import deleteIcon from "@A/iconDelete.svg";
	import exportIcon from "@A/iconFileExport.svg";

	export let sample;

	function handleSampleDetail() {
		selectSample(sample.id);
		openSampleDetail();
	}

	async function handleSampleExport() {
		await exportSampleToPdf(sample.id);
	}

	async function handleSampleDelete() {
		if (confirm('Are you sure you want to delete this sample?')) {
			await deleteSample(sample.id);
		}
	}
</script>

<div class="row" >
  	<img
		class="preview"
		src={`file://${sample.thumbnail_path || sample.image_path}`}
		alt="Sample preview"
	/>

	<div class="info">
		<div class="depth">
			{sample.depth_from} - {sample.depth_to} m
		</div>
		<div class="date">
			{sample.sample_date || 'Unknown date'}
		</div>
	</div>

  <div class="actions">
		<button class="primary" on:click={handleSampleDetail}>
			<img class="icon" src={rightArrowIcon} alt="Detail" />
			Detail
		</button>
		<button class="secondary" on:click={handleSampleExport}>
			<img class="icon" src={exportIcon} alt="Export" />
			Export
		</button>
		<button class="secondary" on:click={handleSampleDelete}>
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
		font-family: Lato, sans-serif;
	}

	div, button {
		font-family: Lato, sans-serif;
	}

	.row:hover {
		background: #f5f5f5;
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
		border: none;
	}

	.actions button.primary {
		background-color: rgb(5, 69, 112);
		color: white;
	}

	.actions button.primary:hover {
		background-color: rgb(6, 89, 144);
		cursor: pointer;
	}

	.actions button.secondary:hover {
		background-color: #ccc;
		cursor: pointer;
	}

	img.icon {
		width: 16px;
		height: 16px;
	}
</style>