const { contextBridge, ipcRenderer } = require('electron')
const path = require('path')
const { pathToFileURL } = require('url')
const { selectImageFile } = require('./master/fileStorage')

contextBridge.exposeInMainWorld('api', {
  refocusWindow: () => ipcRenderer.invoke('refocus-window'),
  createProject: (data) => ipcRenderer.invoke('create-project', data),
  getProjects: () => ipcRenderer.invoke('get-projects'),
  deleteProject: (project_id) => ipcRenderer.invoke('delete-project', project_id),
  editProject: (data) => ipcRenderer.invoke('edit-project', data),
  createProbe: (data) => ipcRenderer.invoke('create-probe', data),
  getProbes: (project_id) => ipcRenderer.invoke('get-probes', project_id),
  deleteProbe: (probe_id) => ipcRenderer.invoke('delete-probe', probe_id),
  renameProbe: (data) => ipcRenderer.invoke('rename-probe', data),
  createSample: (data) => ipcRenderer.invoke('create-sample', data),
  updateSample: (data) => ipcRenderer.invoke('update-sample', data),
  getSamplesByProbe: (probe_id) => ipcRenderer.invoke('get-samples-by-probe', probe_id),
  deleteSample: (sample_id) => ipcRenderer.invoke('delete-sample', sample_id),
  createObservation: (data) => ipcRenderer.invoke('create-observation', data),
  getObservationsBySample: (sample_id) => ipcRenderer.invoke('get-observations-by-sample', sample_id),
  deleteObservation: (observation_id) => ipcRenderer.invoke('delete-observation', observation_id),
  toFileUrl: (filePath) => { return pathToFileURL(filePath).href },
  copyImageToLocal: (originalPath) => ipcRenderer.invoke('copy-image-to-local', originalPath),
  getImagesDir: () => ipcRenderer.invoke('get-images-dir'),
  selectImageFile: () => ipcRenderer.invoke('select-image-file'),
  selectImageFiles: () => ipcRenderer.invoke('select-image-files'),
  getSampleById: (sample_id) => ipcRenderer.invoke('get-sample-by-id', sample_id),
  exportSample: (data) => ipcRenderer.invoke('export-sample', data),
  exportAllSamples: (probe_id) => ipcRenderer.invoke('export-all-samples', probe_id)
})