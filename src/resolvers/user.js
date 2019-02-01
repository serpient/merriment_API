import jwt from 'jsonwebtoken';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username } = user;
  return await jwt.sign(
    { id, email, username },
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
    }
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