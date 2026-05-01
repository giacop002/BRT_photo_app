const { BrowserWindow, dialog } = require('electron');
const { getSampleById, getSamplesByProbe } = require('../db/sampleService');
const { getProbeById } = require('../db/probeService');
const { buildSampleHTML, buildAllSamplesHTML } = require('./buildHtml');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

async function exportSampleToPNG(html, outputPath) {
  const win = new BrowserWindow({
    show: false,
    width: 1754,
    height: 1240,
    webPreferences: {
      offscreen: true
    }
  });

  await win.loadURL(
    'data:text/html;charset=utf-8,' + encodeURIComponent(html),
    {
      baseURLForDataURL: `file://${app.getAppPath()}/`
    }
  );

  await new Promise(resolve => setTimeout(resolve, 300));

  const image = await win.webContents.capturePage();
  const buffer = image.toPNG();

  fs.writeFileSync(outputPath, buffer);

  win.close();
}

async function exportSampleToPDF(html, outputPath) {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      offscreen: true
    }
  });

  await win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html),
    {
      baseURLForDataURL: `file://${app.getAppPath()}/`
    }
  );

  const pdf = await win.webContents.printToPDF({
    printBackground: true,
    landscape: true,
    pageSize: 'A4',
    margins: {
      marginType: 'none'
    },
  });

  fs.writeFileSync(outputPath, pdf);

  win.close();
}

async function exportSample(sample_id, probe_id) {
  try {
    const sample = getSampleById(sample_id);
    const probe = getProbeById(probe_id);

    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Export Sample to PNG',
      defaultPath: `${probe.name.replace(/\s+/g, '_')}-${sample.depth_from}-${sample.depth_to}.png`,
      filters: [{ name: 'PNG', extensions: ['png'] }]
    });

    if (canceled || !filePath) {
      return { success: false, canceled: true };
    }

    const finalPath = filePath.endsWith('.png') ? filePath : filePath + '.png';

    const html = buildSampleHTML({ sample, probe });

    await exportSampleToPNG(html, finalPath);

    return { success: true, path: finalPath };

  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function exportAllSamples(probe_id) {
  try {
    const samples = getSamplesByProbe(probe_id);
    const probe = getProbeById(probe_id);

    if (!samples.length) {
      return { success: false, error: 'No samples to export' };
    }

    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Export Probe Samples',
      defaultPath: `${probe.name.replace(/\s+/g, '_')}.pdf`,
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    });

    if (canceled || !filePath) {
      return { success: false, canceled: true };
    }

    const finalPath = filePath.endsWith('.pdf') ? filePath : filePath + '.pdf';

    const htmlAll = buildAllSamplesHTML({ samples, probe });

    await exportSampleToPDF(htmlAll, finalPath);

    const dir = path.dirname(finalPath);

    for (const sample of samples) {
      const html = buildSampleHTML({ sample, probe });

      const pngPath = path.join(
        dir,
        `${probe.name.replace(/\s+/g, '_')}-${sample.depth_from}-${sample.depth_to}.png`
      );

      await exportSampleToPNG(html, pngPath);
    }

    return { success: true, path: finalPath };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
  exportSample,
  exportAllSamples
}