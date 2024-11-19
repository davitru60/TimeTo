const models = require("../../../models");

class ContentOrder {
  static updateImageOrder = async (projectId, body) => {
    let updatedImage = null;
  
    try {
      const image = await models.ProjectImage.findOne({
        where: {
          proj_img_id: body.proj_img_id,
          project_id: projectId,
          index: body.previousIndex,
        },
        attributes: { exclude: ["id"] },
      });
  
      if (image) {
        await models.ProjectImage.update(
          { index: body.newIndex },
          {
            where: {
              project_id: projectId,
              proj_img_id: body.proj_img_id,
            },
          }
        );
  
        updatedImage = await models.ProjectImage.findOne({
          where: {
            proj_img_id: body.proj_img_id,
            project_id: projectId,
            index: body.newIndex,
          },
          attributes: { exclude: ["id"] },
        });
      }
    } catch (error) {
      console.error("Error updating the image order", error);
    }
  
    return updatedImage;
  };

  static updateEditorOrder = async (projectId, body) => {
    let updatedText = null;
  

    try {
      const text = await models.ProjectText.findOne({
        where: {
          proj_text_id: body.proj_text_id,
          project_id: projectId,
          index: body.previousIndex,
        },
        attributes: { exclude: ["id"] },
      });
  
      if (text) {
        await models.ProjectText.update(
          { index: body.newIndex },
          {
            where: {
              project_id: projectId,
              proj_text_id: body.proj_text_id,
            },
          }
        );
  
        updatedText = await models.ProjectText.findOne({
          where: {
            proj_text_id: body.proj_text_id,
            project_id: projectId,
            index: body.newIndex,
          },
          attributes: { exclude: ["id"] },
        });
      } else {
        updatedText = null;
      }
    } catch (error) {
      console.error("Error updating the editor order", error);
    }
  
    return updatedText;
  };
}

module.exports = ContentOrder