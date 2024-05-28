const models = require("../../../models");

class ContentOrder {
  static updateImageOrder = async (projectId, body) => {
    let result = true;

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
              index: body.previousIndex,
            },
          }
        );
        result = true;
      } else {
        result = false;
      }
    } catch (error) {
      console.error("Error updating the image order", error);
    }

    return result;
  };

  static updateEditorOrder = async (projectId, body) => {
    let result = true;

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
              index: body.previousIndex,
            },
          }
        );
        result = true;
      } else {
        result = false;
      }
    } catch (error) {
      console.error("Error updating the image order", error);
    }

    return result;
  };
}

module.exports = ContentOrder