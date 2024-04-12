
const generateUserRole = async (qty=1)=>{
    const users = [1,2,3,4]
    const roles = [1,2,3]

    let userRole = []

    let admin = {
        role_id:1,
        user_id:1
    }

    userRole.push(admin)

    for(let i=0; i<qty; i++){
        userRole.push({
            role_id: roles[Math.floor(Math.random() * roles.length )],
            user_id: users[Math.floor(Math.random() * users.length)]
        })
    }

    return Promise.all(userRole)
}

module.exports = generateUserRole