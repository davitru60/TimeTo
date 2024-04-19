const { StatusCodes } = require("http-status-codes");
const project = require("./project.database")
const Dropbox = require('dropbox').Dropbox;
const fetch = require('isomorphic-fetch');

const dbx = new Dropbox({
    accessToken: process.env.DROPBOX_TOKEN,
    fetch
})

class ProjectController {
    static getProjectImages = async (req, res) => {
        try {
          const projectId = req.params.id;
       
          const folderPath = "/Fotos";
          const imagePaths = await project.getProjectImages(projectId);
          
          // Mapear las rutas de las imágenes a URL de visualización en Dropbox
          const imageUrls = imagePaths.map(entry => `http://localhost:9090/api/projects/show-image?path=${encodeURIComponent(folderPath + '/' + entry.dataValues.path)}`);
    
          
          res.status(StatusCodes.OK).json(imageUrls);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Error getting Dropbox images'});
        }
    };

  static showImage = async (req,res) =>{
    try {
        const imagePath = req.query.path; 
        const response = await dbx.filesDownload({ path: imagePath });
        console.log(imagePath)


        res.set('Content-Type', response.result.fileBinary['.tag']);

        // Enviar la imagen como respuesta
        res.send(response.result.fileBinary);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error getting the image from Dropbox',error });
    }
  }
}

module.exports= ProjectController;