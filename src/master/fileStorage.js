const fs = require('fs');
const path = require('path');
const { app, dialog } = require('electron');
const { v4: uuidv4 } = require('uuid');

function getImagesDir() {
    const userDataPath = app.getPath('userData');
    const imagesDir = path.join(userDataPath, 'images');

    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }

    return imagesDir;
}

function getFileExtension(filePath) {
    return path.extname(filePath).toLowerCase();
}

function isValidImageExtension(ext) {
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
}

function generateFileName(originalPath) {
    const ext = getFileExtension(originalPath);
    if (!isValidImageExtension(ext)) {
        throw new Error('Formato de imagen no válido. Solo se permiten JPG, JPEG, PNG y WEBP.');
    }

    const id = uuidv4();
    return `${id}${ext}`;
}

function copyImageToLocal(originalPath) {
    if (!originalPath) {
        throw new Error('Ruta de archivo inválida.');
    }

    if(!fs.existsSync(originalPath)) {
        throw new Error('El archivo especificado no existe.');
    }

    const imagesDir = getImagesDir();
    const fileName = generateFileName(originalPath);
    const destinationPath = path.join(imagesDir, fileName);

    fs.copyFileSync(originalPath, destinationPath);
    return destinationPath;
}

async function selectImageFile() {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp'] }
        ]
    });

    if (result.canceled) return null

    return result.filePaths[0];
}

function saveBase64Image(dataUrl) {
    if (!dataUrl) {
        throw new Error('Data URL inválido.');
    }

    const matches = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);

    if (!matches) {
        throw new Error('Formato de Data URL no válido.');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    const ext = mimeType.split('/')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    const imagesDir = getImagesDir();
    const fileName = `${uuidv4()}.${ext}`;
    const filePath = path.join(imagesDir, fileName);

    fs.writeFileSync(filePath, buffer);

    return filePath;
}

module.exports = {
    copyImageToLocal,
    getImagesDir,
    selectImageFile,
    saveBase64Image
};