<script>
  import Sidebar from "./components/Sidebar.svelte";

  let probes = [];
  let selectedProbeId = null;

  async function loadProbes() {
    probes = await window.api.getProbes();
  }

  async function handleSelectProbe(id) {
    selectedProbeId = id;
    // cargar samples
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

  loadProbes();
</script>

<div>
  <Sidebar
    {probes}
    {selectedProbeId}
    on:selectProbe={(e) => handleSelectProbe(e.detail)}
    on:createProbe={(e) => handleCreateProbe(e.detail)}
    on:deleteProbe={(e) => handleDeleteProbe(e.detail.id)}
  />
</div>
