<script>
  import Sidebar from "./components/Sidebar.svelte";
  import MainWindow from "./components/MainWindow.svelte";

  let probes = [];
  let samples = [];

  let selectedProbeId = null;
  let selectedSampleId = null;

  let loadingSamples = false;

  async function loadProbes() {
    probes = await window.api.getProbes();
  }

  async function handleSelectProbe(id) {
    selectedProbeId = id;
    selectedSampleId = null;

    loadingSamples = true;
    samples = await window.api.getSamplesByProbe(id);
    loadingSamples = false;
  }

  async function handleCreateProbe(data) {
    console.log('Creating probe with data:', data);
    await window.api.createProbe(data);
    await loadProbes();
  }

  async function handleDeleteProbe(id) {
    await window.api.deleteProbe(id);
    selectedProbeId = null;
    await loadProbes();
  }

  function handleSelectSample(id) {
    selectedSampleId = id;
  }

  async function handleCreateSample(data) {
    const { file_path, cropped_image, ...rest } = data

    await window.api.createSample({
      ...rest,
      probe_id: selectedProbeId,
      image_path: file_path,
      cropped_image: cropped_image
    })

    await handleSelectProbe(selectedProbeId)
  }

  async function handleDeleteSample(id) {
    await window.api.deleteSample(id);
    await handleSelectProbe(selectedProbeId);
  }

  async function handleBackToList() {
    selectedSampleId = null;
    await handleSelectProbe(selectedProbeId);
  }

  async function handleExportAllSamples() {
    if (!selectedProbeId) return;
    if (samples.length === 0) {
      alert('No samples to export');
      return;
    }

    const result = await window.api.exportAllSamples(selectedProbeId);
    if (result.success) {
      alert('Samples exported successfully');
    } else {
      alert('Failed to export samples: ' + result.error);
    }
  }

  async function handleExportThisSample(id) {
    const data = { sample_id: id, probe_id: selectedProbeId };
    const result = await window.api.exportSample(data);
    if (result.success) {
      alert('Sample exported successfully');
    } else {
      alert('Failed to export sample: ' + result.error);
    }
  }


  loadProbes();
</script>

<div class="app">
  <Sidebar
    {probes}
    {selectedProbeId}
    on:selectProbe={(e) => handleSelectProbe(e.detail)}
    on:createProbe={(e) => handleCreateProbe(e.detail)}
    on:deleteProbe={(e) => handleDeleteProbe(e.detail.id)}
  />

  <MainWindow
    {samples}
    {selectedSampleId}
    {loadingSamples}
    on:selectSample={(e) => handleSelectSample(e.detail.id)}
    on:createSample={(e) => handleCreateSample(e.detail)}
    on:deleteSample={(e) => handleDeleteSample(e.detail.id)}
    on:exportAllSamples={handleExportAllSamples}
    on:exportThisSample={(e) => handleExportThisSample(e.detail.id)}
    on:backToList={handleBackToList}
    {selectedProbeId}

  />
</div>

<style>
  .app {
    display: flex;
    height: 100vh;
  }
</style>