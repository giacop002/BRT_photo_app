const { getLogoPath } = require('../fileStorage')

function buildSampleHTML({ sample, probe }) {
  return `
  <html>
    <head>
      <style>
        @page {
          size: A4 landscape;
          margin: 0;
        }

        html, body {
          margin: 0;
          padding: 0;
          width: 297mm;
          height: 210mm;
          overflow: hidden;
          font-family: Arial;
        }

        body {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
          box-sizing: border-box;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          height: 50px;
        }

        .image {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image img {
          max-width: 100%;
          max-height: 90vh;
          object-fit: contain;
        }
      </style>
    </head>

    <body>
      <div class="header">
        <img class="logo" src="file://${getLogoPath()}" />
        <h2>Probe ${probe.name}</h2>
        <h3>Depth: ${sample.depth_from} - ${sample.depth_to} m</h3>
        <h4>${sample.sample_date || ''}</h4>
      </div>

      <div class="image">
        <img src="file://${sample.image_path}" />
      </div>

    </body>
  </html>
  `;
}

function buildAllSamplesHTML({ samples, probe }) {
  const pages = samples.map(sample => `
    <div class="page">
      <div class="header">
        <img class="logo" src="file://${getLogoPath()}" />
        <h2>Probe ${probe.name}</h2>
        <h3>Depth: ${sample.depth_from} - ${sample.depth_to} m</h3>
        <h4>${sample.sample_date || ''}</h4>
      </div>

      <div class="image">
        <img src="file://${sample.image_path}" />
      </div>
    </div>
  `).join('');

  return `
  <html>
    <head>
      <style>
        @page {
          size: A4 landscape;
          margin: 0;
        }

        html, body {
          margin: 0;
          padding: 0;
          font-family: Arial;
        }

        .page {
          width: 297mm;
          height: 210mm;
          box-sizing: border-box;
          padding: 20px;

          display: flex;
          flex-direction: column;
          justify-content: space-between;

          page-break-after: always;
        }

        .page:last-child {
          page-break-after: auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          height: 50px;
        }

        .image {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image img {
          max-width: 100%;
          max-height: 85vh;
          object-fit: contain;
        }
      </style>
    </head>

    <body>
      ${pages}
    </body>
  </html>
  `;
}

module.exports = {
  buildSampleHTML,
  buildAllSamplesHTML
}