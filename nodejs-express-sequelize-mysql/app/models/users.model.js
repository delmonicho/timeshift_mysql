//step 1: make postman request proper data format json string
module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("users", {
    //User_id primary key auto generated
    first_name: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      required: true
    },
    username: {
      type: Sequelize.STRING,
      required: true
    },
    password: {
      type: Sequelize.STRING,
      required: true
    }

  });

  return Users;
};
