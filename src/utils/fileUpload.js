const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Upload file to local storage
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - File name
 * @param {string} mimeType - File MIME type
 * @returns {Promise<string>} - Local file URL
 */
const uploadToLocal = async (fileBuffer, fileName, mimeType) => {
    try {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        // Clean filename, remove spaces, keep extension
        const cleanFileName = fileName.replace(/\s+/g, '-');
        const finalFileName = `${uniqueSuffix}-${cleanFileName}`;

        const filePath = path.join(UPLOADS_DIR, finalFileName);

        await fs.promises.writeFile(filePath, fileBuffer);

        logger.info(`File uploaded locally: ${finalFileName}`);
        // Return URL relative to server root
        return `/uploads/${finalFileName}`;
    } catch (error) {
        logger.error('Local Upload Error:', error);
        throw error;
    }
};

/**
 * Delete file from local storage
 * @param {string} fileUrl - Local file URL
 * @returns {Promise<void>}
 */
const deleteFromLocal = async (fileUrl) => {
    try {
        if (!fileUrl) return;

        // fileUrl is like /uploads/filename.jpg
        const fileName = path.basename(fileUrl);
        const filePath = path.join(UPLOADS_DIR, fileName);

        try {
            await fs.promises.access(filePath);
            await fs.promises.unlink(filePath);
            logger.info(`File deleted locally: ${fileName}`);
        } catch (err) {
            // File doesn't exist or other error
            logger.warn(`File delete warning: ${err.message}`);
        }
    } catch (error) {
        logger.error('Local Delete Error:', error);
        throw error;
    }
};

module.exports = {
    uploadToLocal,
    deleteFromLocal
};
