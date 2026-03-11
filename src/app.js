import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

const app = express();
const PORT = process.env.PORT || 8080;
const connection = mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB connected"))
    .catch(err => console.log("Error connecting to DB:", err));

app.use(express.json());
app.use(cookieParser());

try {
    const { specs, swaggerUiExpress } = await import('./config/swagger.config.js');
    app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
} catch (err) {
    console.log("Swagger not available - install swagger-jsdoc and swagger-ui-express to enable docs");
}

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);

export default app;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}
