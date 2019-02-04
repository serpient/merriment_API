import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';
import { Sequelize } from 'sequelize';

export default {
  Query: {
    messages: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
      ? {
          createdAt: {
            [Sequelize.Op.lt]: cursor,
          }
        }
      : null;
      return await models.Message.findAll({
        order: [['createdAt', 'DESC']],
        limit,
        where: cursorOptions,
        /*
        the cursor is the createdAt property of a message. With Sequelize and other ORMs 
        it is possible to add a clause to find all items in a list by a starting property 
        (createdAt) with less than (lt) or greater than (gt, which is not used here) 
        values for this property. Using a date as a cursor, the where clause finds all 
        messages before this date, because there is an lt Sequelize operator. 

        First, the list should be ordered by createdAt date, otherwise the cursor won’t help. 
        However, you can be sure that requesting the first page of messages without a cursor 
        will lead to the most recent messages when the list is ordered. When you request the 
        next page with a cursor based on the previous page’s final creation date, you get the 
        next page of messages ordered by creation date. That’s how you can move page by page 
        through the list of messages.

        Second, the ternary operator for the cursor makes sure the cursor isn’t needed for the 
        first page request. As mentioned, the first page only retrieves the most recent messages 
        in the list, so you can use the creation date of the last message as a cursor for the 
        next page of messages.
        */
      });  
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
    
    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { models }) => {
        return await models.Message.destroy({ where: { id }});
      }
    ),
    
  },

  Message: {
    user: async (message, args, { models }) => {
      return models.User.findById(message.userId);
    }
  }
}