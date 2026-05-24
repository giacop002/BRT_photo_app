<script>
	import { onMount, onDestroy, tick } from "svelte";
	// Stores
	import { openProjectEdit } from '@S/ui'
	import {
		projects,
		loadProjects,
		selectedProjectId,
		selectProject,
		deleteProject
	} from '@S/projects'
	import {
		probes,
		loadProbes,
		selectedProbeId,
		selectProbe,
		createProbeToNewProject,
		createProbeToProject,
		deleteProbe,
		updateProbe
	} from '@S/probes'

	// Assets
	import plusIcon from '@A/iconPlus_White.svg'
	import gearIcon from '@A/iconGear_White.svg'
	import editIcon from '@A/iconEdit_White.svg'
	import deleteIcon from '@A/iconDelete_White.svg'
	import dotsIcon from '@A/iconDots_White.svg'

	let isCreatingProbe = false
	let isCreatingProbeToProject = {}

	let openProbeMenuId = null
	let openProjectMenuId = null

	let newProbeName
	let newProbeToProjectName
	let createInput
	let createToProjectInput

	let probeRenamingId = null
	let probeRenameValue = ''
	let probeRenameInput

	function handleSelectProbe(id, projectId) {
		selectProject(projectId);
		selectProbe(id);
	}

	async function handleDeleteProbe(id, event) {
		event.stopPropagation()
		if (confirm('Are you sure you want to delete this drill hole and its samples?')) {
			await deleteProbe(id);
		}
	}

	async function handleDeleteProject(id, event) {
		event.stopPropagation()
		if (confirm('Are you sure you want to delete this project and all its drill holes?')) {
			await deleteProject(id);
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

	function handleEditProject(project_id) {
		selectProject(project_id);
		openProjectEdit();
		openProjectMenuId = null
	}

	async function handleStartProbeRename(probe) {
		probeRenamingId = probe.id
		probeRenameValue = probe.name
		openProbeMenuId = null
		openProjectMenuId = null

		await tick()
		probeRenameInput?.focus()
		probeRenameInput?.select()
	}

	async function submitProbeRename(probe) {
		if (probeRenameValue.trim() && probeRenameValue !== probe.name) {
		await updateProbe(
			probe.id,
			{name: probeRenameValue.trim()}
		)
		}
		probeRenamingId = null
	}

	function cancelProbeRename() {
		probeRenamingId = null
		probeRenameValue = ''
	}

	async function handleRenameKey(e, probe) {
		if (e.key === 'Enter') await submitProbeRename(probe)
		if (e.key === 'Escape') cancelProbeRename()
	}

	async function startCreateProbe() {
		isCreatingProbe = true;
		newProbeName = 'BRT-DDH-';

		await tick();

		setTimeout(() => {
		createInput?.focus();
		createInput?.select();
		}, 0);
	}

	async function submitCreateProbe() {
		if (newProbeName.trim()) {
			await createProbeToNewProject({ name: newProbeName.trim() })
			isCreatingProbe = false
		}
	}

	function cancelCreateProbe() {
		isCreatingProbe = false
		newProbeName = 'BRT-DDH-'
	}

	async function handleKey(e) {
		if (e.key === 'Enter') await submitCreateProbe()
		if (e.key === 'Escape') cancelCreateProbe()
	}

	async function startCreateProbeToProject(id, code) {
		isCreatingProbeToProject = {
			...isCreatingProbeToProject,
			[id]: true
		};
		selectProject(id);
		newProbeToProjectName = `${code}-DDH-`;

		await tick();

		setTimeout(() => {
		createToProjectInput?.focus();
		createToProjectInput?.select();
		}, 0);
	}

	async function submitCreateProbeToProject(id) {
		if (newProbeToProjectName.trim()) {
			await createProbeToProject({
				name: newProbeToProjectName.trim(),
				project_id: id
			})
			isCreatingProbeToProject = {
				...isCreatingProbeToProject,
				[id]: false
			};
		}
	}

	function cancelCreateProbeToProject(id) {
		newProbeToProjectName = ''
		isCreatingProbeToProject = {
			...isCreatingProbeToProject,
			[id]: false
		};
	}

	async function handleCreateToProjectKey(e, id) {
		if (e.key === 'Enter') await submitCreateProbeToProject(id)
		if (e.key === 'Escape') cancelCreateProbeToProject(id)
	}

	function handleClickOutside() {
		openProbeMenuId = null
		openProjectMenuId = null
	}

	onMount(async () => {
		window.addEventListener('click', handleClickOutside);

		await loadProjects();
		await loadProbes();
	});

	onDestroy(() => {
		window.removeEventListener('click', handleClickOutside)
	})
</script>

<div class="sidebar">
	<div class="header">
		<span>Drill Holes</span>
		<button class="create btn" on:click={startCreateProbe}>
			<img class="icon" src={plusIcon} alt="Create Probe" />
		</button>
	</div>

	<div class="list">
		{#each $projects as project}
		<div class="project">
			<div class="header
			{project.id === $selectedProjectId ? 'selected' : ''}
			{(openProjectMenuId === project.id) || (project.id === $selectedProjectId) ? 'active' : ''}"
			>
				<button on:click={() => selectProject(project.id)}>
					{project.name} ({project.code})
				</button>
				<div class="actions">
					<button class="btn" on:click={() => startCreateProbeToProject(project.id, project.code)}>
						<img class="icon" src={plusIcon} alt="Create Probe" />
					</button>
					<button class="project-options btn" on:click={(e) => handleProjectOptionsMenu(project.id, e)}>
						<img class="icon" src={dotsIcon} alt="Options" />
					</button>
				</div>
			</div>
			{#if openProjectMenuId === project.id}
				<div class="menu">
					<button class="btn" on:click={() => startCreateProbeToProject(project.id, project.code)}>
						<img class="icon" src={plusIcon} alt="Create Probe" />
						Add to Project
					</button>
					<button class="btn" on:click={() => handleEditProject(project.id)}>
						<img class="icon" src={editIcon} alt="Rename" />
						Rename Project
					</button>
					<button class="btn" on:click={(e) => handleDeleteProject(project.id, e)}>
						<img class="icon" src={deleteIcon} alt="Delete" />
						Delete Project
					</button>
				</div>
			{/if}
			{#if isCreatingProbeToProject[project.id]}
				<div class="item">
					<input
						class="create-to-project"
						key={`create-to-project-input-${project.id}`}
						bind:this={createToProjectInput}
						bind:value={newProbeToProjectName}
						placeholder="New Drill Hole"
						on:keydown={(e) => handleCreateToProjectKey(e, project.id)}
						on:blur={() => cancelCreateProbeToProject(project.id)}
					/>
				</div>
			{/if}
			{#if $selectedProjectId === project.id}
				{#each $probes as probe}
					<div class="item
						{probe.id === $selectedProbeId ? 'selected' : ''}
						{(openProbeMenuId === probe.id) || ($selectedProbeId === probe.id) ? 'active' : ''}"
					>
						{#if probeRenamingId === probe.id}
							<input
								class="rename-probe"
								bind:this={probeRenameInput}
								bind:value={probeRenameValue}
								on:keydown={(e) => handleRenameKey(e, probe)}
								on:blur={() => cancelProbeRename()}
							/>
						{:else}
							<button class="name btn" on:click={() => handleSelectProbe(probe.id, project.id)}>
								{probe.name}
							</button>
						{/if}

						<button class="options btn" on:click={(e) => handleProbeOptionsMenu(probe.id, e)}>
							<img class="icon" src={gearIcon} alt="Options" />
						</button>

						{#if openProbeMenuId === probe.id}
							<div class="menu">
								<button class="btn" on:click={() => handleStartProbeRename(probe)}>
									<img class="icon" src={editIcon} alt="Rename" />
									Rename
								</button>
								<button class="btn" on:click={(e) => handleDeleteProbe(probe.id, e)}>
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
		{#if isCreatingProbe}
		<input
			class="create-new"
			key="create-input"
			bind:this={createInput}
			bind:value={newProbeName}
			placeholder="New Drill Hole"
			on:keydown={handleKey}
			on:blur={cancelCreateProbe}
		/>
		{:else}
		<button class="create" on:click={startCreateProbe}>
			<img class="icon" src={plusIcon} alt="Create Probe" />
			Add to New Project
		</button>
		{/if}
	</div>
</div>

<style>
	.sidebar {
		width: 300px;
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
		border-bottom: none;
	}

	.project {
		margin: 8px;
		border: 1px solid rgb(226, 232, 240);
		border-radius: 4px;
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
		padding: 10px 15px;
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

	input {
		padding: 4px 6px;
		background: rgb(6, 89, 144);
		border: 1px solid rgb(226, 232, 240);
		color: white;
		font-size: 14px;
		padding: 10px 12px;
		width: 100%;
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
</style>