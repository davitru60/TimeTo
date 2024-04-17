//Auth raw queries file
module.exports = {
    getUsers: `
      SELECT DISTINCT r.name 
      FROM roles r
      JOIN user_role ur ON r.role_id = ur.role_id
      WHERE ur.user_id = :userId
    `,
    registerUser: `
      INSERT INTO users (name, first_surname, second_surname, email, password)
      VALUES (:name, :first_surname, :second_surname, :email, :password)
    `,
    createRoleUser: `
      INSERT INTO user_role (role_id, user_id)
      VALUES (?, ?)
    `,
  };