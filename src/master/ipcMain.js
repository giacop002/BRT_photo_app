const { ipcMain } = require('electron/main')
const { createProbe, getProbes, deleteProbe, renameProbe } = require('./db/probeService')
const { createSample, getSamplesByProbe, getSampleById, deleteSample } = require('./db/sampleService')
const { createObservation, getObservationsBySample, deleteObservation } = require('./db/observationService')
const { copyImageToLocal, getImagesDir, selectImageFile, saveBase64Image } = require('./fileStorage')
const { exportSample, exportAllSamples } = require('./export/exportToPdf')

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

  ipcMain.handle('rename-probe', async (__, data) => {
    return renameProbe(data)
  })

  ipcMain.handle('create-sample', async (__, data) => {
    const { original_path, cropped_image, ...rest } = data

    let image_path;

    if (cropped_image) {
      image_path = saveBase64Image(cropped_image)
    } else {
      image_path = copyImageToLocal(original_path)
    }
    return createSample({ ...rest, image_path })
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

  ipcMain.handle('copy-image-to-local', async (__, originalPath) => {
    return copyImageToLocal(originalPath)
  })

  ipcMain.handle('get-images-dir', async () => {
    return getImagesDir()
  })

  ipcMain.handle('select-image-file', async () => {
    return await selectImageFile();
  })

  ipcMain.handle('get-sample-by-id', async (__, sample_id) => {
    return getSampleById(sample_id)
  })

  ipcMain.handle('export-sample', async (__, data) => {
    const { sample_id, probe_id } = data;
    return await exportSample(sample_id, probe_id);
  })

  ipcMain.handle('export-all-samples', async (__, probe_id) => {
    return await exportAllSamples(probe_id);
  })
}

module.exports = { setupIpcHandlers }