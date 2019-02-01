import express from 'express';
import cors from 'cors'
import { ApolloServer, gql } from 'apollo-server-express';
import 'dotenv/config';

import schema from './schema';
import resolvers from './resolvers';
import models from './models';

const app = express(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models,
    me: users[1],
  }
})

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
})