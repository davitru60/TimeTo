const bcrypt = require('bcrypt');
const { faker, fakerES } = require('@faker-js/faker');

const generateUser = async (qty=1) =>{
    let users = []
    const adminPass = await bcrypt.hash('admin123', 10)

    let admin = {
        name: 'admin',
        first_surname: 'admin',
        second_surname: 'admin',
        email: 'admin@admin.com',
        password: adminPass,
    }

    users.push(admin)

    for(let i=0; i<qty; i++){
        const pass = await bcrypt.hash('user123', 10)

        let user = {
            name: fakerES.person.firstName(),
            first_surname: fakerES.person.middleName(),
            second_surname: fakerES.person.middleName(),
            email: faker.internet.email(),
            password: pass,
        }

        users.push(user)
    }

    return Promise.all(users)
}

module.exports = generateUser