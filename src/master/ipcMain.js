const { ipcMain } = require('electron/main')
const { createProbe, getProbes, deleteProbe } = require('./db/probeService')
const { createSample, getSamplesByProbe, deleteSample } = require('./db/sampleService')
const { createObservation, getObservationsBySample, deleteObservation } = require('./db/observationService')

function setupIpcHandlers() {
  ipcMain.handle('create-probe', async (__, data) => {
    return createProbe(data)
  })

  ipcMain.handle('get-probes', async () => {
    return getProbes()
  })

  ipcMain.handle('delete-probe', async (__, probe_id) => {
    return deleteProbe(probe_id)
  })

  ipcMain.handle('create-sample', async (__, data) => {
    return createSample(data)
  })

  ipcMain.handle('get-samples-by-probe', async (__, probe_id) => {
    return getSamplesByProbe(probe_id)
  })

  ipcMain.handle('delete-sample', async (__, sample_id) => {
    return deleteSample(sample_id)
  })

  ipcMain.handle('create-observation', async (__, data) => {
    return createObservation(data)
  })

  ipcMain.handle('get-observations-by-sample', async (__, sample_id) => {
    return getObservationsBySample(sample_id)
  })

  ipcMain.handle('delete-observation', async (__, observation_id) => {
    return deleteObservation(observation_id)
  })
}

module.exports = { setupIpcHandlers }