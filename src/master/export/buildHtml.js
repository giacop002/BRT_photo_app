const { getLogoPath } = require('../fileStorage')

function buildSampleHTML({ sample, probe }) {
  return `
  <html>
    <head>
      <style>

        html, body {
          overflow: hidden;
        }

        body {
          font-family: Arial;
          display: flex;
          flex-direction: column;
          justify-content: start;
          gap: 20px;
          height: 100vh;
        }

        .header {
          display: flex;
          flex-direction: row;
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
          max-width: 100vw;
          height: 80vh;
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
  const pages = samples.map((sample, index) => `
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
        body {
          font-family: Arial;
          display: flex;
          flex-direction: column;
          justify-content: start;
          gap: 20px;
          height: 100vh;
        }

        .header {
          display: flex;
          flex-direction: row;
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
          height: 80vh;
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