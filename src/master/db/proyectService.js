const { getDB } = require('./db')
const { v4: uuidv4 } = require('uuid')

function createProyect({ name, code, description }) {
  const db = getDB()
  const id = uuidv4()
  const stmt = db.prepare('INSERT INTO proyects (id, name, code, description) VALUES (?, ?, ?, ?)')
  stmt.run(id, name, code, description)
  return id
}

function getProyects() {
  const db = getDB()
  const stmt = db.prepare('SELECT * FROM proyects ORDER BY created_at DESC')
  return stmt.all()
}

function deleteProyect(proyect_id) {
  const db = getDB()
  const stmt = db.prepare('DELETE FROM proyects WHERE id = ?')
  stmt.run(proyect_id)
}

function editProyect({ proyect_id, name, code, description }) {
  const db = getDB()
  const stmt = db.prepare('UPDATE proyects SET name = ?, code = ?, description = ? WHERE id = ?')
  stmt.run(name, code, description, proyect_id)
}

module.exports = {
  createProyect,
  getProyects,
  deleteProyect,
  editProyect
}