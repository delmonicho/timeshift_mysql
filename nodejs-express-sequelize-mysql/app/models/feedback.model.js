//step 1: make postman request proper data format json string
module.exports = (sequelize, Sequelize) => {
  const Feedback = sequelize.define("feedback", {
    //track_id primary key auto generated
    consent: {
      type: Sequelize.BOOLEAN
    },
    old_start_time: {
      type: Sequelize.DATETIME
    },
    new_start_time: {
      type: Sequelize.DATETIME
    },
    shared_users: {
      type: Sequelize.JSON
    },
    //foreign key
    task_id: {
      type: Sequelize.INTEGER
    }
  });

  return Feedback;
};
