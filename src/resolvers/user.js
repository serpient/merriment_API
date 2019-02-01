export default {
  Query: {
    me: (parent, args, { me }) => {
      return me;
    },
    user: (parent, { id }, { models }) => {
      return models.users[id]
    },
    users: (parent, args, { models }) => {
      return Object.values(models.users);
    },
  },

  User: {
    messages: (user, args, { models }) => {
      return Object.values(models.users).filter(
        message => message.userId === user.id,
      )
    }
  },
}