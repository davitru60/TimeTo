const multer = require("multer");
const { StatusCodes } = require("http-status-codes");

// Middleware para subir imágenes
const uploadImageMiddleware = multer().any("image");

const handleUploadImage = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(); 
    }

    // Verificar que todos los archivos sean imágenes
    const areAllImages = req.files.every(file => file.mimetype.startsWith('image/'));

    if (!areAllImages) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Only image files are allowed" });
    }

    const imageOriginalNames = req.files.map((file) => file.originalname);
    req.imageOriginalNames = imageOriginalNames; // Guardar los nombres originales de las imágenes en el objeto req

    next();
  } catch (error) {
    console.error("Error uploading images:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error uploading images", detail: error });
  }
};

const handleUpdateImage = async (req, res, next) => {
  try {
 
    if (!req.files || req.files.length === 0) {
      return next(); 
    }


    const imageOriginalNames = req.files.map((file) => file.originalname);
    req.imageOriginalNames = imageOriginalNames; 

    console.log(req.imageOriginalNames)

    next();
  } catch (error) {
    console.error("Error handling update image:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error handling update image", detail: error });
  }
};

module.exports = { uploadImageMiddleware, handleUploadImage, handleUpdateImage };
