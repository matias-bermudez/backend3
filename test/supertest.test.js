import mongoose from 'mongoose';
import supertest from 'supertest';
import chai from 'chai';
import app from '../src/app.js';

const expect = chai.expect;
const requester = supertest(app);

describe('Testing Adoption Router', function () {
    this.timeout(10000);

    let testUser;
    let testPet;
    let testAdoption;

    // Crear un usuario y una mascota de prueba antes de los tests
    before(async function () {
        this.timeout(15000);
        // Esperar a que la DB se conecte
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Crear usuario de prueba via registro
        const userResponse = await requester.post('/api/sessions/register').send({
            first_name: 'Test',
            last_name: 'Adoption',
            email: `testadoption_${Date.now()}@test.com`,
            password: 'test1234'
        });

        // Obtener el usuario creado
        const usersResponse = await requester.get('/api/users');
        const users = usersResponse.body.payload;
        testUser = users[users.length - 1];

        // Crear mascota de prueba via mocks (generamos data y luego la buscamos)
        await requester.post('/api/mocks/generateData').send({
            users: 0,
            pets: 1
        });

        const petsResponse = await requester.get('/api/pets');
        const pets = petsResponse.body.payload;
        // Buscar una mascota que NO esté adoptada
        testPet = pets.find(p => !p.adopted) || pets[pets.length - 1];
    });

    // Limpiar después de los tests
    after(async function () {
        this.timeout(10000);
        // Eliminar datos de prueba si existen
        if (testUser && testUser._id) {
            await requester.delete(`/api/users/${testUser._id}`);
        }
        // Cerrar la conexión a la DB
        await mongoose.connection.close();
    });

    describe('GET /api/adoptions', () => {
        it('Debe obtener todas las adopciones - responde con status 200 y un array', async () => {
            const response = await requester.get('/api/adoptions');
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status', 'success');
            expect(response.body).to.have.property('payload');
            expect(response.body.payload).to.be.an('array');
        });
    });

    describe('GET /api/adoptions/:aid', () => {
        it('Debe retornar error 404 si la adopción no existe', async () => {
            const fakeId = '644bcc7f0e4a1a2b3c4d5e6f';
            const response = await requester.get(`/api/adoptions/${fakeId}`);
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('status', 'error');
            expect(response.body).to.have.property('error', 'Adoption not found');
        });

        it('Debe obtener una adopción existente por su ID', async () => {
            // Primero creamos una adopción para poder buscarla
            if (testUser && testPet) {
                const createResponse = await requester.post(`/api/adoptions/${testUser._id}/${testPet._id}`);
                if (createResponse.status === 200) {
                    // Obtener todas las adopciones y buscar la que acabamos de crear
                    const allAdoptions = await requester.get('/api/adoptions');
                    testAdoption = allAdoptions.body.payload.find(
                        a => a.owner === testUser._id || a.owner?._id === testUser._id
                    );

                    if (testAdoption) {
                        const response = await requester.get(`/api/adoptions/${testAdoption._id}`);
                        expect(response.status).to.equal(200);
                        expect(response.body).to.have.property('status', 'success');
                        expect(response.body).to.have.property('payload');
                        expect(response.body.payload).to.have.property('_id');
                        expect(response.body.payload).to.have.property('owner');
                        expect(response.body.payload).to.have.property('pet');
                    }
                }
            }
        });
    });

    describe('POST /api/adoptions/:uid/:pid', () => {
        it('Debe retornar error 404 si el usuario no existe', async () => {
            const fakeUserId = '644bcc7f0e4a1a2b3c4d5e6f';
            const petId = testPet ? testPet._id : '644bcc7f0e4a1a2b3c4d5e70';
            const response = await requester.post(`/api/adoptions/${fakeUserId}/${petId}`);
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('status', 'error');
            expect(response.body.error).to.include('Not found');
        });

        it('Debe retornar error 404 si la mascota no existe', async () => {
            const userId = testUser._id;
            const fakePetId = '644bcc7f0e4a1a2b3c4d5e70';
            const response = await requester.post(`/api/adoptions/${userId}/${fakePetId}`);
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('status', 'error');
            expect(response.body.error).to.include('not found');
        });

        it('Debe retornar error 400 si la mascota ya está adoptada', async () => {
            // Si ya se adoptó testPet en un test anterior, intentamos de nuevo
            if (testPet && testUser) {
                // Primero verificamos si la mascota ya está adoptada
                const petsResponse = await requester.get('/api/pets');
                const adoptedPet = petsResponse.body.payload.find(p => p.adopted === true);

                if (adoptedPet) {
                    const response = await requester.post(`/api/adoptions/${testUser._id}/${adoptedPet._id}`);
                    expect(response.status).to.equal(400);
                    expect(response.body).to.have.property('status', 'error');
                    expect(response.body.error).to.include('already adopted');
                }
            }
        });

        it('Debe crear una adopción exitosamente con usuario y mascota válidos', async () => {
            // Generar una nueva mascota no adoptada
            await requester.post('/api/mocks/generateData').send({
                users: 0,
                pets: 1
            });

            const petsResponse = await requester.get('/api/pets');
            const availablePet = petsResponse.body.payload.find(p => !p.adopted);

            if (availablePet && testUser) {
                const response = await requester.post(`/api/adoptions/${testUser._id}/${availablePet._id}`);
                expect(response.status).to.equal(200);
                expect(response.body).to.have.property('status', 'success');
                expect(response.body).to.have.property('message', 'Pet adopted');
            }
        });
    });
});
