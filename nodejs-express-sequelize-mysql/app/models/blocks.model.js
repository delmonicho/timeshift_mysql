//step 1: make postman request proper data format json string
module.exports = (sequelize, Sequelize) => {
  const Blocks = sequelize.define("block", {
    // data: {
    //   type: Sequelize.TEXT,
    //   get: function () {
    //     return JSON.parse(this.getDataValue('value'));
    //   },
    //   set: function (value) {
    //     this.setDataValue('value', JSON.stringify(value));
    //   }
    start_time: {
      type: Sequelize.STRING
    },
    end_time: {
      type: Sequelize.STRING
    },
    event_id: {
      type: Sequelize.INTEGER
    }
  });

  return Blocks;
};
