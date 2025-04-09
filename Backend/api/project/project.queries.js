
module.exports = {
    getAllProjects: `SELECT p.project_id, p.name, p.description, hpi.path FROM home_project_imgs hpi JOIN projects p ON hpi.project_id = p.project_id ORDER BY p.project_id DESC;`,
    addImageToProject: `INSERT INTO project_images (project_id, f_type_id, path, \`index\`) VALUES (:project_id, :f_type_id, :path, :index)`,
    createProject: `INSERT INTO projects (name,description) VALUES (:name,:description)`,
    addImageToProjectCreate: `INSERT INTO home_project_imgs (project_id,path) VALUES (:project_id,:path)`
};