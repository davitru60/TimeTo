const { StatusCodes } = require("http-status-codes");
const project = require("./project.database");
const Dropbox = require("dropbox").Dropbox;
const fetch = require("isomorphic-fetch");
const multer = require('multer');
const upload = multer();


class ProjectController {
  
  static getAllProjects = async (req, res) => {
    try {
      
      const projects = await project.getAllProjects();

      for (let i = 0; i < projects.length; i++) {
        if (projects[i].path != null) {
          projects[i].path = `${process.env.REQUEST_URL}${process.env.PORT}${process.env.IMAGE_REQUEST}/show-image?path=${encodeURIComponent(
            process.env.FOLDER_PATH + "/" + projects[i].path
          )}`;
        }
      }

      const response = {
        success: true,
        data: {
          projects: projects,
        },
      };
      res.status(StatusCodes.OK).json(response);
      
    } catch (error) {
      throw new Error("Error getting projects");
    }
  };

  static getProjectImages = async (req, res) => {
    try {
      
      const projectId = req.params.id;

      const images = await project.getProjectImages(projectId);  
      console.log(images)
  
      // Mapear las rutas de las imágenes a URL de visualización en Dropbox
      images.forEach((entry) => {
        const imagePath = entry.dataValues.path;
        const imageUrl = `${process.env.REQUEST_URL}${process.env.PORT}${process.env.IMAGE_REQUEST}/show-image?path=${encodeURIComponent(
          process.env.FOLDER_PATH + "/" + imagePath
        )}`;

        entry.dataValues.path = imageUrl;
      });
  
 
      const response = {
        success: true,
        data: {
          images: images,
        },
      };
  
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error getting Dropbox images" });
    }
  };

  static showImage = async (req, res) => {
    try {
      const dbx = req.dbx;
      if (!dbx) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Dropbox client not found. Authentication required.",
        });
      }
  
      const imagePath = req.query.path;
      if (!imagePath) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "No image path provided.",
        });
      }
  
      const response = await dbx.filesDownload({ path: imagePath });
  
      if (!response.result.fileBinary) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Image not found in Dropbox.",
        });
      }
  
      res.set("Content-Type", response.result.fileBinary[".tag"]);
      res.send(response.result.fileBinary);
    } catch (error) {
      console.error("Error in showImage:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Error retrieving image from Dropbox.",
        detail: error,
      });
    }
  };

 
  static uploadImage =  [upload.any('image'), async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Images hasn't been provided" });
      }

      const dbx = req.dbx;

      const projectId= req.params.id

      const imageUrls = []; 
      const imageOriginalNames = []

      console.log(req.files)

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const response = await dbx.filesUpload({
          path: `/Fotos/${file.originalname}`,
          contents: file.buffer,
        });

        imageUrls.push(response.result.path_display); 
        imageOriginalNames.push(file.originalname)
    
      }
    
   const result = await project.uploadImage(projectId, imageOriginalNames);

      if (!result) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          data: {},
        });
      }
      

      res.status(StatusCodes.OK).json({
        imageUrls,
      });


    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error al subir las imágenes a Dropbox", detail: error });
    }
  }];

  static getProjectTexts = async(req,res)=>{

    try{
      const projectId = req.params.id;

      const texts = await project.getProjectTexts(projectId);
  
      const response = {
        success: true,
        data: {
          texts: texts,
        },
      };
      res.status(StatusCodes.OK).json(response);
    }catch(error){
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error getting project texts", detail: error });
    }
  }

  static updateImageOrder = async(req,res) => {

    try{
      const projectId = req.params.id
      

      const updatedOrder = project.updateImageOrder(projectId,req.body)
  
      if(updatedOrder){
        const response = {
          success:true,
          msg: 'Images order has been successfully updated',
        }
  
        res.status(StatusCodes.OK).json(response)
      }else{
        const response = {
          success:false,
          msg:'Failed to update image order'
        }
        res.status(StatusCodes.BAD_REQUEST).json(response)
      }
    }catch(error){
      console.error('Error updating', error);
      const response = {
        success:false,
        msg:'Failed to update image order'
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
    }
 
  }

  static updateEditorOrder = async(req,res) => {

    try{
      const projectId = req.params.id
      
      const updatedOrder = project.updateEditorOrder(projectId,req.body)
  
      if(updatedOrder){
        const response = {
          success:true,
          msg: 'Editor order has been successfully updated',
        }
  
        res.status(StatusCodes.OK).json(response)
      }else{
        const response = {
          success:false,
          msg:'Failed to update editor order'
        }
        res.status(StatusCodes.BAD_REQUEST).json(response)
      }
    }catch(error){
      console.error('Error updating', error);
      const response = {
        success:false,
        msg:'Failed to update editor order'
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
    }
 
  }


  static deleteImage = async (req,res) =>{
    try {
      const projImgId = req.params.id; 
  
  
      const isDeleted = await project.deleteImage(projImgId);
  
      if (isDeleted) {
        // Respuesta para eliminación exitosa
        const response = {
          success: true,
          msg: 'Image has been successfully deleted',
        };
        res.status(StatusCodes.OK).json(response); 
      } else {

        const response = {
          success: false,
          msg: 'Failed to delete image',
        };
        res.status(StatusCodes.BAD_REQUEST).json(response); 
      }
    } catch (error) {
      console.error('Error deleting image:', error); 
      const response = {
        success: false,
        msg: 'Failed to delete image due to server error',
      };
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response); 
    }
  }



}

module.exports = ProjectController;
