//step 1: make postman request proper data format json string
module.exports = (sequelize, Sequelize) => {
  const Events = sequelize.define("event", {
    //event_id primary key auto generated
    title: {
      type: Sequelize.STRING
    },
    start_time: {
      type: Sequelize.DATE
    },
    end_time: {
      type: Sequelize.DATE
    },
    recurring: {
      type: Sequelize.ENUM,
      values: ['MON','TUE','WED','THU','FRI','SAT','SUN']
    },
    //foreign key
    user_id: {
      type: Sequelize.INTEGER
    }
  });

  return Events;
};
