import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import typeDefs from './graphql/TypeDefs.js';
import resolvers from './graphql/Resolvers.js';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : [
      'http://localhost:5173',
      'http://localhost:3001',
      'https://movie-list.com',
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS Request Blocked ${origin}`);
        callback(new Error('Blocked By CORS'));
      }
    },
    credentials: true,
  })
);

if (
  process.env.NODE_ENV === 'production' ||
  process.env.LOCAL_BUILD === 'true'
) {
  const clientBuildPath = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));
  app.use('/graphql', express.json());
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  context: async ({ req }) => {

    if (req.method === 'GET') return {};
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) return { user: null };

    try {
      const user = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY || 'Secret-Key'
      );
      return { user };
    } catch (error) {
      console.log(`${error}`);
      return { user: null };
    }
  },
});

if (
  process.env.NODE_ENV === 'production' ||
  process.env.LOCAL_BUILD === 'true'
) {
  const clientBuildPath = path.resolve(__dirname, '../../client/dist');
  console.log(`✅ Serving frontend from: ${clientBuildPath}`);

  app.use(express.static(clientBuildPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/graphql')) return next();
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

async function startServer() {
  await server.start();
  server.applyMiddleware({
    app,
    cors: { origin: allowedOrigins, credentials: true },
  });
  console.log(`🚀 GraphQL Server ready at http://localhost:3001/graphql`);
}

startServer();

export default app;