const message = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    text: DataTypes.string,
  });

  Message.associate = models => {
    Message.belongsTo(models.User, {
      onDelete: 'CASCADE',
      /*
      Now, in case a user is deleted, we may want to perform a
      so called cascade delete for all messages in relation to 
      the user. That’s why you can extend schemas with a CASCADE 
      flag. In this case, we add the flag to our user schema to 
      remove all messages of this user on its deletion.
      */
    });
  }
  
  return Message;
}

export default message;