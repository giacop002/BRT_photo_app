<script>
  import Sidebar from "./components/Sidebar.svelte";
  import MainWindow from "./components/MainWindow.svelte";

  let projects = [];
  let probes = {};
  let samples = [];

  let selectedProbeId = null;
  let selectedProbeName = null;
  let selectedSampleId = null;
  let selectedProjectId = null;

  let loadingSamples = false;

  async function refocusWindow() {
    await window.api.refocusWindow();
  }

  async function loadProbes() {
    projects = await window.api.getProjects();
    if (projects.length === 0) {
      probes = {};
      return;
    }
    for (const project of projects) {
      const projectProbes = await window.api.getProbes(project.id);
      probes[project.id] = projectProbes;
    }
  }

  async function handleSelectProbe({ id, name, project_id }) {
    selectedProbeId = id;
    selectedProbeName = name;
    selectedProjectId = project_id;
    selectedSampleId = null;

    loadingSamples = true;
    samples = await window.api.getSamplesByProbe(id);
    loadingSamples = false;
  }

  async function handleCreateProbe({ name }) {
    let new_project_id = await window.api.createProject({ name: 'New Project', code: 'NPR' });
    let new_probe_id = await window.api.createProbe({ name, project_id: new_project_id });
    await loadProbes();
    handleSelectProbe({ id: new_probe_id, name, project_id: new_project_id });
  }

  async function handleCreateProbeToProject({ name, project_id }) {
    let new_probe_id = await window.api.createProbe({ name, project_id });
    await loadProbes();
    handleSelectProbe({ id: new_probe_id, name, project_id });
  }

  async function handleDeleteProbe(id) {
    await window.api.deleteProbe(id);
    if (selectedProbeId === id) { selectedProbeId, selectedProbeName, selectedProjectId = null, null, null; }
    await loadProbes();
    await refocusWindow();
  }

  async function handleRenameProbe({ id, name }) {
    await window.api.renameProbe({ id, name });
    await loadProbes();
    if (selectedProbeId === id) {
      selectedProbeName = name;
    }
  }

  function handleSelectSample(id) {
    selectedSampleId = id;
  }

  function handleGoBack() {
    selectedSampleId = null;
  }

  async function handleCreateSample(data) {
    const { file_path, cropped_image, ...rest } = data;
    console.log('Creating sample with data:', { ...rest, file_path, cropped_image }); // Debug log

    await window.api.createSample({
      ...rest,
      probe_id: selectedProbeId,
      image_path: file_path,
      cropped_image: cropped_image
    })

    loadingSamples = true;
    await loadProbes();
    handleSelectProbe({ id: selectedProbeId, name: selectedProbeName });
    loadingSamples = false;
  }

  async function handleCreateBatchSamples(batchSamples) {
    if (!selectedProbeId) return;
    loadingSamples = true;

    try {
      for (const sample of batchSamples) {
        console.log('Creating sample with data:', { sample }); // Debug log
        const { file_path, cropped_image, ...rest } = sample;

        await window.api.createSample({
          ...rest,
          probe_id: selectedProbeId,
          image_path: file_path,
          // cropped_image
        });
      }
    }
    catch (err) {
      console.error(err);
      alert('Failed to import batch samples');
    }
    finally {
      await loadProbes();
      await handleSelectProbe({ id: selectedProbeId, name: selectedProbeName });
      loadingSamples = false;
    }
  }

  async function handleUpdateSample(data) {

    await window.api.updateSample({
      sample_id: data.id,
      image_path: data.file_path,
      depth_from: data.depth_from,
      depth_to: data.depth_to,
      sample_date: data.sample_date
    });

    loadingSamples = true;
    await loadProbes();
    handleSelectProbe({ id: selectedProbeId, name: selectedProbeName });
    loadingSamples = false;
  }

  async function handleDeleteSample(id) {
    await window.api.deleteSample(id);
    await loadProbes();
    handleSelectProbe({ id: selectedProbeId, name: selectedProbeName });
    loadingSamples = false;
  }

  async function handleExportAllSamples() {
    if (!selectedProbeId) return;
    if (samples.length === 0) {
      alert('No samples to export');
      return;
    }

    loadingSamples = true;
    const result = await window.api.exportAllSamples(selectedProbeId);
    loadingSamples = false;
    if (result.canceled) return;
    if (result.success) {
      alert('Samples exported successfully');
      await refocusWindow();
    } else {
      alert('Failed to export samples: ' + result.error);
      await refocusWindow();
    }
  }

  async function handleExportThisSample(id) {
    const data = { sample_id: id, probe_id: selectedProbeId };
    loadingSamples = true;
    const result = await window.api.exportSample(data);
    loadingSamples = false;
    if (result.canceled) return;
    if (result.success) {
      alert('Sample exported successfully');
      await refocusWindow();
    } else {
      alert('Failed to export sample: ' + result.error);
      await refocusWindow();
    }
  }


  loadProbes();
</script>

<div class="app">
  <Sidebar
    {projects}
    {probes}
    {selectedProbeId}
    {selectedProjectId}
    on:selectProbe={(e) => handleSelectProbe(e.detail)}
    on:createProbe={(e) => handleCreateProbe(e.detail)}
    on:createProbeToProject={(e) => handleCreateProbeToProject(e.detail)}
    on:deleteProbe={(e) => handleDeleteProbe(e.detail.id)}
    on:renameProbe={(e) => handleRenameProbe(e.detail)}
  />

  <MainWindow
    {samples}
    {selectedSampleId}
    {loadingSamples}
    on:selectSample={(e) => handleSelectSample(e.detail.id)}
    on:createSample={(e) => handleCreateSample(e.detail)}
    on:saveBatch={(e) => handleCreateBatchSamples(e.detail.samples)}
    on:editSample={(e) => handleUpdateSample(e.detail)}
    on:deleteSample={(e) => handleDeleteSample(e.detail.id)}
    on:exportAllSamples={handleExportAllSamples}
    on:exportThisSample={(e) => handleExportThisSample(e.detail.id)}
    on:goBack={handleGoBack}
    {selectedProbeId}
    {selectedProbeName}
  />
</div>

<style>
  .app {
    display: flex;
    height: 100vh;
  }
</style>