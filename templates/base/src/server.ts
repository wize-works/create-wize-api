
import './config/dotenv';
import Sentry from './lib/sentry';

import Fastify from 'fastify';
import mercurius from 'mercurius';
import { exampleSchema } from './schemas/examples';
import { authContext } from './lib/auth';


const app = Fastify();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 80;

Sentry.setupFastifyErrorHandler(app);

app.register(mercurius, {
    schema: exampleSchema,
    graphiql: true,
    path: '/graphql',
    context: authContext,
});

app.setErrorHandler((error, request, reply) => {
    console.error('Error occurred:', error);
    Sentry.captureException(error);
    reply.status(500).send({ error: 'Internal Server Error' });
});

app.setNotFoundHandler((request, reply) => {
    const error = new Error(`Route ${request.method} ${request.url} not found`);
    Sentry.captureException(error);
    reply.status(404).send({ error: 'Not Found' });
});

app.listen({ port: port }, (err, address) => {
    if (err) {
        Sentry.captureException(err);
        console.error(err);
        process.exit(1);
    }
    console.log(`🚀 __PROJECT_NAME__ API ready on port ${port}`);
});