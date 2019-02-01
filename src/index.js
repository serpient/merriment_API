import express from 'express';
import cors from 'cors'
import { ApolloServer, gql } from 'apollo-server-express';
import 'dotenv/config';

const app = express(cors());

const schema = gql`
  type Query {
    users: [User!]
    me: User
    user(id: ID!): User
  }
  type User {
    id: ID!
    username: String!
  }
`
const resolvers = {
  Query: {
    me: () => {
      return users[1]
    },
    user: (parent, { id }) => {
      return users[id]
    },
    users: () => {
      return Object.values(users);
    }
  },

  User: {
    username: (parent) => parent.username,
  }
}

let users = {
  1: {
    id: '1',
    username: 'Robin Wieruch',
  },
  2: {
    id: '2',
    username: 'Dave Davids',
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
})

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
})