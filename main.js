const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const { initDB } = require('./src/master/db/db')
const { setupIpcHandlers } = require('./src/master/ipcMain')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'src', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false
    }
  })

  const isDev = !app.isPackaged;

  const indexPath = isDev
    ? path.join(__dirname, 'dist', 'index.html')
    : path.join(app.getAppPath(), 'dist', 'index.html');

  win.loadURL(`file://${indexPath}`);;
}

app.whenReady().then(() => {
  initDB()
  setupIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})