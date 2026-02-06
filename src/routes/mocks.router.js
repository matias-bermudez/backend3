import { Router } from 'express';
import { generateUsers, generatePets } from '../utils/mocking.js';
import userModel from '../dao/models/User.js';
import petModel from '../dao/models/Pet.js';

const router = Router();

router.get('/mockingpets', (req, res) => {
    try {
        const pets = generatePets(100);
        res.status(200).json({
            status: 'success',
            payload: pets
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/mockingusers', (req, res) => {
    try {
        const users = generateUsers(50);
        res.status(200).json({
            status: 'success',
            payload: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.post('/generateData', async (req, res) => {
    try {
        const { users, pets } = req.body;
        if (users === undefined || pets === undefined) {
            return res.status(400).json({
                status: 'error',
                message: 'Se requieren los parámetros "users" y "pets"'
            });
        }
        if (isNaN(users) || isNaN(pets)) {
            return res.status(400).json({
                status: 'error',
                message: 'Los parámetros deben ser números válidos'
            });
        }
        if (users < 0 || pets < 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Los parámetros deben ser números positivos'
            });
        }
        const generatedUsers = generateUsers(parseInt(users));
        const generatedPets = generatePets(parseInt(pets));
        const insertedUsers = await userModel.insertMany(generatedUsers);
        const insertedPets = await petModel.insertMany(generatedPets);
        res.status(201).json({
            status: 'success',
            message: 'Datos generados e insertados correctamente',
            payload: {
                users: {
                    requested: parseInt(users),
                    inserted: insertedUsers.length
                },
                pets: {
                    requested: parseInt(pets),
                    inserted: insertedPets.length
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;