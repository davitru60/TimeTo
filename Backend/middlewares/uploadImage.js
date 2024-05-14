const multer = require('multer');
const { StatusCodes } = require('http-status-codes');

// Middleware para subir imágenes
const uploadImageMiddleware = multer().any('image');

const handleUploadImage = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Images haven't been provided" });
    }

    const imageOriginalNames = req.files.map(file => file.originalname);
    req.imageOriginalNames = imageOriginalNames; // Guardar los nombres originales de las imágenes en el objeto req

    next(); 
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error uploading images", detail: error });
  }
};

module.exports = { uploadImageMiddleware,handleUploadImage };