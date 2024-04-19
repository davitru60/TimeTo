const models = require("../../models");
const { Sequelize } = require('sequelize')


class Project{
    static getProjectImages = async (projectId) =>{
        
        try{
            const imagePaths = await models.ProjectImage.findAll({
                where:{
                    project_id: projectId
                }
            })

            return  imagePaths;
        }catch(error){
            throw error
        }
    }
}

module.exports = Project;