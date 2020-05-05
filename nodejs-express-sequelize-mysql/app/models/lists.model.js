//step 1: make postman request proper data format json string
module.exports = (sequelize, Sequelize) => {
  const Lists = sequelize.define("lists", {
    //list_id primary key auto generated
    title: {
      type: Sequelize.STRING
    },
    color: {
      type: Sequelize.ENUM,
      values: ['RED','ORANGE','YELLOW','GREEN','BLUE','VIOLET']
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  return Lists;
};

//// TODO:
//FIX foreign key create() not connecting input id to primary table
