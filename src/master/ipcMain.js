const { ipcMain, BrowserWindow } = require('electron/main')
const { createProyect, getProyects, editProyect, deleteProyect } = require('./db/proyectService')
const { createProbe, getProbes, deleteProbe, renameProbe } = require('./db/probeService')
const { createSample, getSamplesByProbe, getSampleById, updateSample, deleteSample } = require('./db/sampleService')
const { createObservation, getObservationsBySample, deleteObservation } = require('./db/observationService')
const { copyImageToLocal, getImagesDir, selectImageFile, selectImageFiles, saveBase64Image } = require('./fileStorage')
const { exportSample, exportAllSamples } = require('./export/exportToPdf')

function reloadMainWindow() {
  const win = BrowserWindow.getAllWindows()[0];
  if (win) {
    win.webContents.reload();
    return true;
  }
  return false;
}

function setupIpcHandlers() {
  ipcMain.handle('refocus-window', async () => {
    return reloadMainWindow();
  })

  ipcMain.handle('create-proyect', async (__, data) => {
    return createProyect(data)
  })

  ipcMain.handle('get-proyects', async () => {
    return getProyects()
  })

  ipcMain.handle('delete-proyect', async (__, proyect_id) => {
    return deleteProyect(proyect_id)
  })

  ipcMain.handle('edit-proyect', async (__, data) => {
    return editProyect(data)
  })

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
    const { image_path, cropped_image, ...rest } = data

    let final_path;

    if (cropped_image) {
      final_path = saveBase64Image(cropped_image)
    } else {
      final_path = copyImageToLocal(image_path)
    }
    return createSample({ ...rest, image_path: final_path })
  })

  ipcMain.handle('get-samples-by-probe', async (__, probe_id) => {
    return getSamplesByProbe(probe_id)
  })

  ipcMain.handle('delete-sample', async (__, sample_id) => {
    return deleteSample(sample_id)
  })

  ipcMain.handle('update-sample', async (__, data) => {
    return updateSample(data)
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

  ipcMain.handle('select-image-files', async () => {
    return await selectImageFiles();
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