import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export const generateUser = () => {
    const hashedPassword = bcrypt.hashSync('coder123', 10);
    const role = faker.helpers.arrayElement(['user', 'admin']);
    return {
        _id: faker.database.mongodbObjectId(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: hashedPassword,
        role: role,
        pets: []
    };
};

export const generateUsers = (count = 50) => {
    const users = [];
    for (let i = 0; i < count; i++) {
        users.push(generateUser());
    }
    return users;
};

export const generatePet = () => {
    const species = ['dog', 'cat', 'bird', 'fish', 'hamster', 'rabbit'];
    return {
        name: faker.person.firstName(),
        specie: faker.helpers.arrayElement(species),
        birthDate: faker.date.past({ years: 10 }),
        adopted: false,
        owner: null
    };
};

export const generatePets = (count = 50) => {
    const pets = [];
    for (let i = 0; i < count; i++) {
        pets.push(generatePet());
    }
    return pets;
};