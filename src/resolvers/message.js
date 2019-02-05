import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';
import { Sequelize } from 'sequelize';

const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string => Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    messages: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
      ? {
          createdAt: {
            [Sequelize.Op.lt]: fromCursorHash(cursor),
          }
        }
      : null;

      const messages = await models.Message.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
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

      const hasNextPage = messages.length > limit;
      const edges = hasNextPage ? messages.slice(0, -1) : messages;
      /*
      You only retrieve one more message than defined in the limit. If the list of messages is 
      longer than the limit, there is a next page; otherwise, there is no next page. You return 
      the limited messages, or all messages if there is no next page. Now you can include the 
      hasNextPage field in the pageInfo field. If you query messages with a limit of 2 and no 
      cursor, you get true for the hasNextPage field. If query messages with a limit of more than 
      2 and no cursor, the hasNextPage field becomes false. Then, your GraphQL client application 
      knows that the list has reached its end.
      */
      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(edges[edges.length - 1].createdAt.toString()),
        },
      }
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