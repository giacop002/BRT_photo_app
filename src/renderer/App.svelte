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
    await loadProbes();
  }

  function handleSelectSample(id) {
    selectedSampleId = id;
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
  />
</div>

<style>
  .app {
    display: flex;
    height: 100vh;
  }
</style>