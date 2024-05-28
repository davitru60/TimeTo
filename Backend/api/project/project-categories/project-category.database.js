const models = require("../../../models");
const { Sequelize, QueryTypes } = require("sequelize");

class ProjectCategory{
    static getProjectCategories = async (projectId) => {
        try {
          const projectCategories = await models.ProjectCategory.findAll({
            where:{
              project_id: projectId,
            }
          })
    
          return projectCategories
        } catch (error) {
          console.error(error);
          throw error;
        }
      };
    
      static addProjectCategory = async (body) =>{
        let result = false;
    
        console.log(body)
    
        try {
          const newProjectCategory = await models.ProjectCategory.create({
             project_id:body.project_id,
             category_id:body.category_id 
          });
    
          if (newProjectCategory) {
            result = true;
          }
         
        }catch(error){
    
        }
    
        return result
      }
    
      static deleteProjectCategory = async(projCatId) =>{
        try{
          let result = false;
    
          try {
            const category = await models.ProjectCategory.findByPk(projCatId);
      
            if (category) {
              result = true;
              await category.destroy();
            } else {
              result = false;
            }
          } catch (error) {}
      
          return result;
        }catch(error){
    
        }
      }
}


module.exports = ProjectCategory;