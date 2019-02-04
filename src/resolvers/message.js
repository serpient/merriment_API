import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from './authorization';

export default {
  Query: {
    messages: async (parent, args, { models }) => {
      return await models.Message.findAll();  
    },
    message: async (parent, { id }, { models }) => {
      return await models.Message.findById(id);
    }
  },

  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { me, models }) => {
        return await models.Message.create({
          text,
          userId: me.id,
        });
      }
      /*
      Now the isAuthenticated() resolver function always runs before the resolver 
      that creates the message associated with the authenticated user in the database. 
      The resolvers get chained to each other, and you can reuse the protecting resolver 
      function wherever you need it.
      */
    ),
    
    deleteMessage: async (parent, { id }, { models }) => {
      return await models.Message.destroy({ where: { id }});
    },
  },

  Message: {
    user: async (message, args, { models }) => {
      return models.User.findById(message.userId);
    }
  }
}