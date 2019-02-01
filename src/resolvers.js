import uuidv4 from 'uuid/v4';

export default {
  Query: {
    me: (parent, args, { me }) => {
      return me;
    },
    user: (parent, { id }) => {
      return users[id]
    },
    users: () => {
      return Object.values(users);
    },
    messages: () => {
      return Object.values(messages);
    },
    message: (parent, { id }) => {
      return messages[id];
    }
  },

  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id,
      }
      messages[id] = message;
      users[me.id].messageIds.push(id);

      return message;
    },

    deleteMessage: (parent, { id }) => {
      const { [id]: message, ...otherMessages } = messages;

      if (!message) {
        return false;
      }

      messages = otherMessages;
      return true;
    }
  },

  User: {
    username: (parent) => parent.username,
    messages: user => {
      return Object.values(messages).filter(
        message => message.userId === user.id,
      )
    }
  },

  Message: {
    user: message => {
      return users[message.userId]
    }
  }
}