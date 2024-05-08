
module.exports = {
    getAllProjects: `SELECT p.project_id, p.name, p.description, hpi.path FROM home_project_imgs hpi JOIN projects p ON hpi.project_id = p.project_id;`,
    uploadImage: `INSERT INTO project_images (project_id, f_type_id, path, \`index\`) VALUES (:project_id, :f_type_id, :path, :index)`,
};