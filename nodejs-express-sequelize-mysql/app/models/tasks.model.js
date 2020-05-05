//step 1: make postman request proper data format json string
module.exports = (sequelize, Sequelize) => {
  const Tasks = sequelize.define("tasks", {
    //task_id primary key auto generated
    title: {
      type: Sequelize.STRING
    },
    est_time: {
      type: Sequelize.FLOAT
    },
    alg_time: {
      type: Sequelize.FLOAT
    },
    //foreign key
    listId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  return Tasks;
};
