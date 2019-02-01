const message = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    text: {
      type: DataTypes.string,
    },
  });

  Message.associate = models => {
    Message.belongsTo(models.User);
  }
  
  return Message;
}

export default message;