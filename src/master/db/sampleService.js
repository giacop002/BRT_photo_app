// const { get } = require('svelte/store')
const { getDB } = require('./db')
const { v4: uuidv4 } = require('uuid')

function createSample({ probe_id, image_path, depth_from, depth_to, sample_date }) {
  const db = getDB()
  const id = uuidv4()

  const stmt = db.prepare('INSERT INTO samples (id, probe_id, image_path, depth_from, depth_to, sample_date) VALUES (?, ?, ?, ?, ?, ?)')
  stmt.run(id, probe_id, image_path, depth_from, depth_to, sample_date)
  return id
}

function getSamplesByProbe(probe_id) {
  const db = getDB()
  const stmt = db.prepare(`
    SELECT * FROM samples
    WHERE probe_id = ?
    ORDER BY depth_from ASC
    `)
  return stmt.all(probe_id)
}

function getSampleById(sample_id) {
  const db = getDB()
  const stmt = db.prepare('SELECT * FROM samples WHERE id = ?')
  return stmt.get(sample_id)
}

function deleteSample(sample_id) {
  const db = getDB()
  const stmt = db.prepare('DELETE FROM samples WHERE id = ?')
  stmt.run(sample_id)
}

module.exports = {
  createSample,
  getSamplesByProbe,
  getSampleById,
  deleteSample
}