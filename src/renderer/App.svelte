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
    const { file_path, ...rest } = data
    console.log('Creating sample with data:', data);
    console.log('File path:', file_path);

    const result = await window.api.copyImageToLocal(file_path);

    console.log('Image copied to:', result);

    await window.api.createSample({
      ...rest,
      probe_id: selectedProbeId,
      image_path: result
    })

    await handleSelectProbe(selectedProbeId)
  }

  async function handleDeleteSample(id) {
    await window.api.deleteSample(id);
    await handleSelectProbe(selectedProbeId);
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
    {selectedProbeId}

  />
</div>

<style>
  .app {
    display: flex;
    height: 100vh;
  }
</style>