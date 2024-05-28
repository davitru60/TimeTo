const models = require("../../../models");

class ProjectText{
    static getProjectTexts = async (projectId) => {
        try {
          const texts = await models.ProjectText.findAll({
            where: {
              project_id: projectId,
            },
            attributes: { exclude: ["id"] },
          });
    
          return texts;
        } catch (error) {
          console.error("Error getting project texts", error);
          throw error;
        }
      };
    
      static addProjectTexts = async (projectId, body) => {
        let result = false;
    
        try {
          const texts = await models.ProjectText.create({
            ...body,
            project_id: projectId,
          });
    
          texts ? (result = true) : (result = false);
        } catch (error) {
          console.error("Error al añadir el texto:", error);
        }
    
        return result;
      };
    
      static updateProjectTexts = async (body) => {
        let result = false;
    
        try {
          const text = await models.ProjectText.findByPk(body.proj_text_id);
    
          if (text) {
            await text.update(body);
    
            result = true;
          }
        } catch (error) {
          console.error("Error al actualizar el texto:", error);
        }
    
        return result;
      };
    
      static deleteProjectTexts = async (projTextId) => {
        let result = true;
    
        try {
          const text = await models.ProjectText.findOne({
            where: {
              proj_text_id: projTextId,
            },
            attributes: { exclude: ["id"] },
          });
    
          if (text) {
            await models.ProjectText.destroy({
              where: {
                proj_text_id: projTextId,
              },
            });
            console.log("Texto eliminado con éxito:", text);
          } else {
            console.warn("El texto no se encontró con el ID:", projTextId);
            result = false;
          }
        } catch (error) {
          console.error("Error al eliminar la imagen:", error);
          result = false;
        }
    
        return result;
      };
}

module.exports = ProjectText