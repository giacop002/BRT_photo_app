const { contextBridge, ipcRenderer } = require('electron')
const path = require('path')
const { pathToFileURL } = require('url')

contextBridge.exposeInMainWorld('api', {
  createProbe: (data) => ipcRenderer.invoke('create-probe', data),
  getProbes: () => ipcRenderer.invoke('get-probes'),
  deleteProbe: (probe_id) => ipcRenderer.invoke('delete-probe', probe_id),
  createSample: (data) => ipcRenderer.invoke('create-sample', data),
  getSamplesByProbe: (probe_id) => ipcRenderer.invoke('get-samples-by-probe', probe_id),
  deleteSample: (sample_id) => ipcRenderer.invoke('delete-sample', sample_id),
  createObservation: (data) => ipcRenderer.invoke('create-observation', data),
  getObservationsBySample: (sample_id) => ipcRenderer.invoke('get-observations-by-sample', sample_id),
  deleteObservation: (observation_id) => ipcRenderer.invoke('delete-observation', observation_id),
  toFileUrl: (filePath) => { return pathToFileURL(filePath).href }
})