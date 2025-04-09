uploadImageToDropbox = async (req) => {
    try {
      if (!req.files || req.length === 0) {
        console.log("Images hasn't been provided");
      }

      const dbx = req.dbx;

      const imageUrls = [];
      const imageOriginalNames = [];

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const response = await dbx.filesUpload({
          path: `/Fotos/${file.originalname}`,
          contents: file.buffer,
        });

        imageUrls.push(response.result.path_display);
        imageOriginalNames.push(file.originalname);
      }

      return imageOriginalNames;
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  module.exports = {
    uploadImageToDropbox,
  };