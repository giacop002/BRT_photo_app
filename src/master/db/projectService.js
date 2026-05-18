const { getDB } = require('./db')
const { v4: uuidv4 } = require('uuid')

function createProject({ name, code, description }) {
  const db = getDB()
  const id = uuidv4()
  const stmt = db.prepare('INSERT INTO projects (id, name, code, description) VALUES (?, ?, ?, ?)')
  stmt.run(id, name, code, description)
  return id
}

function getProjects() {
  const db = getDB()
  const stmt = db.prepare('SELECT * FROM projects ORDER BY created_at DESC')
  return stmt.all()
}

function deleteProject(project_id) {
  const db = getDB()
  const stmt = db.prepare('DELETE FROM projects WHERE id = ?')
  stmt.run(project_id)
}

function editProject({ project_id, name, code, description }) {
  const db = getDB()
  const stmt = db.prepare('UPDATE projects SET name = ?, code = ?, description = ? WHERE id = ?')
  stmt.run(name, code, description, project_id)
}

module.exports = {
  createProject,
  getProjects,
  deleteProject,
  editProject
}