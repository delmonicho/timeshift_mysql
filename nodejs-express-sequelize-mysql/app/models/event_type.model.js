//step 1: make postman request proper data format json string
module.exports = (sequelize, Sequelize) => {
  const EventType = sequelize.define("event_type", {
    //event_type_id primary key auto generated
    category: {
      type: Sequelize.STRING
    },
    note: {
      type: Sequelize.STRING
    },
    is_shared: {
      type: Sequelize.BOOLEAN
    },
    priority: {
      type: Sequelize.ENUM
    },
    //foreign key
    event_id: {
      type: Sequelize.INTEGER
    }
  });

  return EventType;
};
