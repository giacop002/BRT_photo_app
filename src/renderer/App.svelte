<script>
  import Sidebar from "./components/Sidebar.svelte";
  import MainWindow from "./components/MainWindow.svelte";
</script>

<div class="app">
  <Sidebar />
  <MainWindow />
</div>

<style>
  .app {
    display: flex;
    height: 100vh;
  }
</style>