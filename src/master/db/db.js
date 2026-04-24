const Database = require('better-sqlite3')
const path = require('path')
const { app } = require('electron')

let db

function initDB() {
  const dbPath = path.join(app.getPath('userData'), 'database.sqlite')

  db = new Database(dbPath)

  db.exec(`
    CREATE TABLE IF NOT EXISTS probes (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS samples (
      id TEXT PRIMARY KEY,
      probe_id TEXT NOT NULL,
      image_path TEXT NOT NULL,
      depth_from REAL,
      depth_to REAL,
      sample_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(probe_id) REFERENCES probes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS observations (
      id TEXT PRIMARY KEY,
      sample_id TEXT NOT NULL,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(sample_id) REFERENCES samples(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_samples_date ON samples(sample_date);
    CREATE INDEX IF NOT EXISTS idx_observations_sample ON observations(sample_id);
    CREATE INDEX IF NOT EXISTS idx_probes_name ON probes(name);
    CREATE INDEX IF NOT EXISTS idx_samples_probe ON samples(probe_id);
  `)
}

function getDB() {
  if (!db) throw new Error('DB not initialized')
  return db
}

module.exports = { initDB, getDB }