const { getLogoPath } = require('../fileStorage')

function buildSampleHTML({ sample, probe }) {
  return `
  <html>
    <head>
      <style>
        body {
          font-family: Arial;
          padding: 40px;
        }

        .header {
          text-align: center;
          margin-bottom: 20px;
        }

        .logo {
          height: 60px;
        }

        .image {
          text-align: center;
          margin: 20px 0;
        }

        .image img {
          max-width: 100%;
          max-height: 400px;
        }

        .meta {
          margin-top: 20px;
          font-size: 14px;
        }
      </style>
    </head>

    <body>
      <div class="header">
        <img class="logo" src="file://${getLogoPath()}" />
        <h2>${probe.name}</h2>
        <p>${sample.sample_date || ''}</p>
      </div>

      <div class="image">
        <img src="file://${sample.image_path}" />
      </div>

      <div class="meta">
        <p><strong>Depth:</strong> ${sample.depth_from} - ${sample.depth_to}</p>
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
        <h2>${probe.name}</h2>
        <p>${sample.sample_date || ''}</p>
      </div>

      <div class="image">
        <img src="file://${sample.image_path}" />
      </div>

      <div class="meta">
        <p><strong>Depth:</strong> ${sample.depth_from} - ${sample.depth_to}</p>
      </div>
    </div>
  `).join('');

  return `
  <html>
    <head>
      <style>
        body {
          font-family: Arial;
        }

        .page {
          page-break-after: always;
          padding: 40px;
        }

        .header {
          text-align: center;
          margin-bottom: 20px;
        }

        .logo {
          height: 60px;
        }

        .image {
          text-align: center;
          margin: 20px 0;
        }

        .image img {
          max-width: 100%;
          max-height: 400px;
        }

        .meta {
          margin-top: 20px;
          font-size: 14px;
        }

        .page {
            page-break-after: always;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100vh;
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