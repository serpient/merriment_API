import express from 'express';
import cors from 'cors'
import { ApolloServer, gql } from 'apollo-server-express';
import 'dotenv/config';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const app = express();

app.user(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models,
    me: models.user[1],
  }
})

server.applyMiddleware({ app, path: '/graphql' });

sequelize.sync().then(async () => {
  app.listen(process.env.PORT, () => {
    console.log('Apollo Server on http://localhost:8000/graphql')
  })
})