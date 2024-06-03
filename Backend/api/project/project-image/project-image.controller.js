const { StatusCodes } = require("http-status-codes");
const {uploadImageToDropbox} = require("../../../helpers/dropboxImageUploader")
const projectImage = require("./project-image.database")

class ProjectImageController{
    static getProjectImages = async (req, res) => {
        try {
          const projectId = req.params.id;
    
          const images = await projectImage.getProjectImages(projectId);
          console.log(images);
    
          // Mapear las rutas de las imágenes a URL de visualización en Dropbox
          images.forEach((entry) => {
            const imagePath = entry.dataValues.path;
            const imageUrl = `${process.env.REQUEST_URL}${process.env.PORT}${
              process.env.IMAGE_REQUEST
            }/show-image?path=${encodeURIComponent(
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
    
      static addImageToProject = async (req, res) => {
        try {
          const projectId = req.params.id;
          const imageOriginalNames = await uploadImageToDropbox(req);
          const result = await projectImage.addImageToProject(
            projectId,
            imageOriginalNames,
            req.body
          );
    
          res.status(StatusCodes.OK).json({
            success: true,
            data: {
              result: result,
            },
            message: "Images uploaded successfully.",
          });
        } catch (error) {
          console.error("Error adding images to project:", error);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: "Error adding images to project",
            detail: error,
          });
        }
      };

      static updateImageFromProject = async (req,res)=>{
        const projectId = req.params.id;
        let updatedImage = null;

        if (req.files) {
          const imageOriginalName = await uploadImageToDropbox(req);
    
          const projectImg = {
            project_id: projectId,
            path: imageOriginalName,
          };
    
          updatedImage = await projectImage.updateImageFromProject(projectImg);

          if(updatedImage){
            const response = {
              success: true,
              msg: "Image has been successfully updated",
              data: {
                updatedImage
              }
            };
            res.status(StatusCodes.OK).json(response);
          }else{
            
          }

          

          
        }

        

      }
    
      static deleteImage = async (req, res) => {
        try {
          const projImgId = req.params.id;
    
          const isDeleted = await projectImage.deleteImage(projImgId);
    
          if (isDeleted) {
            const response = {
              success: true,
              msg: "Image has been successfully deleted",
            };
            res.status(StatusCodes.OK).json(response);
          } else {
            const response = {
              success: false,
              msg: "Failed to delete image",
            };
            res.status(StatusCodes.BAD_REQUEST).json(response);
          }
        } catch (error) {
          console.error("Error deleting image:", error);
          const response = {
            success: false,
            msg: "Failed to delete image due to server error",
          };
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
        }
      };
}


module.exports=ProjectImageController;