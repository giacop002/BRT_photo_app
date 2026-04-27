const { getDB } = require('./db')
const { v4: uuidv4 } = require('uuid')

function createProbe({ name, description }) {
  const db = getDB()
  const id = uuidv4()
  const stmt = db.prepare('INSERT INTO probes (id, name, description) VALUES (?, ?, ?)')
  stmt.run(id, name, description)
  return id
}

function getProbes() {
  const db = getDB()
  const stmt = db.prepare(`
    SELECT * FROM probes
    ORDER BY created_at DESC
    `)
  return stmt.all()
}

function getProbeById(probe_id) {
  const db = getDB()
  const stmt = db.prepare('SELECT * FROM probes WHERE id = ?')
  return stmt.get(probe_id)
}

function deleteProbe(probe_id) {
  const db = getDB()
  const stmt = db.prepare('DELETE FROM probes WHERE id = ?')
  stmt.run(probe_id)
}

module.exports = {
  createProbe,
  getProbes,
  getProbeById,
  deleteProbe
}