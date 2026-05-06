<script>
  import Sidebar from "./components/Sidebar.svelte";
  import MainWindow from "./components/MainWindow.svelte";

  let probes = [];
  let samples = [];

  let selectedProbeId = null;
  let selectedProbeName = null;
  let selectedSampleId = null;

  let loadingSamples = false;

  async function refocusWindow() {
    await window.api.refocusWindow();
  }

  async function loadProbes() {
    probes = await window.api.getProbes();
  }

  async function handleSelectProbe({ id, name }) {
    selectedProbeId = id;
    selectedProbeName = name;
    selectedSampleId = null;

    loadingSamples = true;
    samples = await window.api.getSamplesByProbe(id);
    loadingSamples = false;
  }

  async function handleCreateProbe({ name }) {
    let new_probe_id = await window.api.createProbe({ name });
    await loadProbes();
    handleSelectProbe({ id: new_probe_id, name });
  }

  async function handleDeleteProbe(id) {
    await window.api.deleteProbe(id);
    if (selectedProbeId === id) { selectedProbeId, selectedProbeName = null, null; }
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

  window.addEventListener('blur', () => console.log('WINDOW BLUR'));
  window.addEventListener('focus', () => console.log('WINDOW FOCUS'));
</script>

<div class="app">
  <Sidebar
    {probes}
    {selectedProbeId}
    on:selectProbe={(e) => handleSelectProbe(e.detail)}
    on:createProbe={(e) => handleCreateProbe(e.detail)}
    on:deleteProbe={(e) => handleDeleteProbe(e.detail.id)}
    on:renameProbe={(e) => handleRenameProbe(e.detail)}
  />

  <MainWindow
    {samples}
    {selectedSampleId}
    {loadingSamples}
    on:selectSample={(e) => handleSelectSample(e.detail.id)}
    on:createSample={(e) => handleCreateSample(e.detail)}
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