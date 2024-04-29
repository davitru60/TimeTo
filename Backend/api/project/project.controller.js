const { StatusCodes } = require("http-status-codes");
const project = require("./project.database");
const Dropbox = require("dropbox").Dropbox;
const fetch = require("isomorphic-fetch");
const multer = require('multer');
const upload = multer();

const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_TOKEN,
  fetch,
});

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
      const imagePath = req.query.path;
      const response = await dbx.filesDownload({ path: imagePath });

      res.set("Content-Type", response.result.fileBinary[".tag"]);

      res.send(response.result.fileBinary);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error getting the image from Dropbox", error });
    }
  };

 
  static uploadImage =  [upload.any('image'), async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Images hasn't been provided" });
      }

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
 
}

module.exports = ProjectController;
