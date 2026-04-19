const { getDB } = require('./db')
const { v4: uuidv4 } = require('uuid')

function createObservation({ sample_id, notes }) {
  const db = getDB()
  const id = uuidv4()
  const stmt = db.prepare('INSERT INTO observations (id, sample_id, notes) VALUES (?, ?, ?)')
  stmt.run(id, sample_id, notes)
  return id
}

function getObservationsBySample(sample_id) {
  const db = getDB()
  const stmt = db.prepare(`
    SELECT * FROM observations
    WHERE sample_id = ?
    ORDER BY created_at DESC
    `)
  return stmt.all(sample_id)
}

function deleteObservation(observation_id) {
  const db = getDB()
  const stmt = db.prepare('DELETE FROM observations WHERE id = ?')
  stmt.run(observation_id)
}

module.exports = {
  createObservation,
  getObservationsBySample,
  deleteObservation
}