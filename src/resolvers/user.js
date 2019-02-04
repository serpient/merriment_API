import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { UserInputError, AuthenticationError } from 'apollo-server';
import { isAdmin } from './authorization';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign(
    { id, email, username, role },
    secret,
    { expiresIn },
  );
  /*
  The first argument to “sign” a token can be any user information except
  sensitive data like passwords, because the token will land on the 
  client side of your application stack. Signing a token means putting 
  data into it, which you’ve done, and securing it, which you haven’t done 
  yet. To secure your token, pass in a secret (any long string) that is only 
  available to you and your server. No third-party entities should have access, 
  because it is used to encode (sign) and decode your token.
  */
}

export default {
  Query: {
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }
      return await models.User.findById(me.id);
    },
    user: async (parent, { id }, { models }) => {
      return await models.User.findById(id);
    },
    users: async (parent, args, { models }) => {
      return await models.User.findAll();
    },
  },

  Mutation: {
    signUp: async (
      parent,
      { username, email, password },
      { models, secret },
    ) => {
      const user = await models.User.create({
        username,
        email,
        password,
      });

      return { token: createToken(user, secret, '30m') };
    },

    signIn: async(
      parent,
      { login, password },
      { models, secret },
    ) => {
      const user = await models.User.findByLogin(login);

      if (!user) {
        throw new UserInputError(
          'No user found with this login credentials',
        );
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return { token: createToken(user, secret, '30m') };
    },

    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        return await models.User.destroy({
          where: { id },
        });
      },
    ),

  },

  User: {
    messages: async (user, args, { models }) => {
      return await models.Message.findAll({
        where: {
          userId: user.id,
        }
      })
    }
  },
}