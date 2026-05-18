const { getDB } = require('./db')
const { v4: uuidv4 } = require('uuid')

function createProbe({ name, description, project_id }) {
  const db = getDB()
  const id = uuidv4()
  const stmt = db.prepare('INSERT INTO probes (id, name, description, project_id) VALUES (?, ?, ?, ?)')
  stmt.run(id, name, description, project_id)
  return id
}

function getProbes(project_id) {
  const db = getDB()
  const stmt = db.prepare(`
    SELECT * FROM probes
    WHERE project_id = ?
    ORDER BY name
    `)
  return stmt.all(project_id)
}

function renameProbe({ id, name }) {
  const db = getDB()
  const stmt = db.prepare('UPDATE probes SET name = ? WHERE id = ?')
  stmt.run(name, id)
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
  deleteProbe,
  renameProbe
}