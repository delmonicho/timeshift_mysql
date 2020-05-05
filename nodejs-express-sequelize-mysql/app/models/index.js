const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models/Tables
db.blocks = require("./blocks.model.js")(sequelize, Sequelize);
db.users = require("./users.model.js")(sequelize, Sequelize);
db.events = require("./events.model.js")(sequelize, Sequelize);
db.lists = require("./lists.model.js")(sequelize, Sequelize);
db.tasks = require("./tasks.model.js")(sequelize, Sequelize);


// Relations
//db.events.belongsTo(db.users);
//db.users.hasMany(db.events);
db.lists.belongsTo(db.users);
db.users.hasMany(db.lists);

db.tasks.belongsTo(db.lists);
db.lists.hasMany(db.tasks);


module.exports = db;
