const { BrowserWindow, dialog } = require('electron');
const { getSampleById, getSamplesByProbe } = require('../db/sampleService');
const { getProbeById } = require('../db/probeService');
const { buildSampleHTML, buildAllSamplesHTML } = require('./buildHtml');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

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
      title: 'Export Sample to PDF',
      defaultPath: `${probe.name.replace(/\s+/g, '_')}-${sample.depth_from}-${sample.depth_to}.pdf`,
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    });

    if (canceled || !filePath) {
      return { success: false, canceled: true };
    }

    const finalPath = filePath.endsWith('.pdf') ? filePath : filePath + '.pdf';

    const html = buildSampleHTML({ sample, probe });

    await exportSampleToPDF(html, finalPath);

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

    const finalPathAll = filePath.endsWith('.pdf') ? filePath : filePath + '.pdf';

    const htmlAll = buildAllSamplesHTML({ samples, probe });

    await exportSampleToPDF(htmlAll, finalPathAll);

    const dir = path.dirname(finalPathAll);

    for (const sample of samples) {
      const html = buildSampleHTML({ sample, probe });

      const finalPath = path.join(
        dir,
        `${probe.name.replace(/\s+/g, '_')}-${sample.depth_from}-${sample.depth_to}.pdf`
      );

      await exportSampleToPDF(html, finalPath);
    }

    return { success: true, path: finalPathAll };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
  exportSample,
  exportAllSamples
}