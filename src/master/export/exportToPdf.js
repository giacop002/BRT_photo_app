const { BrowserWindow } = require('electron');
const { getSampleById, getSamplesByProbe } = require('../db/sampleService');
const { getProbeById } = require('../db/probeService');
const { buildSampleHTML, buildAllSamplesHTML } = require('./buildHtml');
const path = require('path');
const { app } = require('electron');

async function exportSampleToPDF(html, outputPath) {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      offscreen: true
    }
  });

  await win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));

  const pdf = await win.webContents.printToPDF({
    printBackground: true
  });

  require('fs').writeFileSync(outputPath, pdf);

  win.close();
}

async function  exportSample(sample_id, probe_id) {
    try {
        const sample = getSampleById(sample_id);
        const probe = getProbeById(probe_id);

        const html = buildSampleHTML({ sample, probe });

        const outputPath = path.join(
        app.getPath('documents'),
        `sample-${sample.id}.pdf`
        );

        await exportSampleToPDF(html, outputPath);

        return { success: true, path: outputPath };
  } catch (err) {
        return { success: false, error: err.message };
  }
}

async function exportAllSamples(probe_id) {
  try {
    const samples = getSamplesByProbe(probe_id);
    const probe = getProbeById(probe_id);

    const html = buildAllSamplesHTML({ samples, probe });

    const outputPath = path.join(
      app.getPath('documents'),
      `probe-${probe.id}-samples.pdf`
    );

    await exportSampleToPDF(html, outputPath);

    return { success: true, path: outputPath };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
  exportSample,
  exportAllSamples
}