import { gql } from 'apollo-server-express';

import userSchema from './user';
import messageSchema from './message';

const linkSchema = gql`
  scalar Date
  
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`

export default [linkSchema, userSchema, messageSchema];


/*
In this file, both schemas are merged with the help of a utility 
called linkSchema. The linkSchema defines all types shared within
the schemas. It already defines a Subscription type for GraphQL 
subscriptions, which may be implemented later. As a workaround, 
there is an empty underscore field with a Boolean type in the 
merging utility schema, because there is no official way of 
completing this action yet. The utility schema defines the shared
base types, extended with the extend statement in the other 
domain-specific schemas. 
*/