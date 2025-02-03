import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/Resolvers';
import path from 'path';
import bodyParser from 'body-parser';
import { User } from './models/User';

const app = express();
app.use(bodyParser.json());

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3001'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  context: async ({ req }) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return { user: null };

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'secret_key') as { id: string };
      const user = await User.findById(decoded.id);
      return { user: user ? { id: user.id.toString() } : null };
    } catch (error) {
      console.error('Invalid token:', error);
      return { user: null };
    }
  }
});

if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  console.log(`🚀 Server ready at http://localhost:3001${server.graphqlPath}`);
}

startServer();

export default app;