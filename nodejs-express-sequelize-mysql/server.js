const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//call db sync()
const db = require("./app/models");
//db.sequelize.sync();
//In development, you may need to drop existing tables and re-sync database. Just use force: true as following code
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the TimeShift-MySQL application variant.  We are now in the darkest timeline." });
});


//include routes before listen
//require("./app/routes/blocks.routes")(app);
require("./app/routes/users.routes")(app);
require("./app/routes/tasks.routes")(app);
require("./app/routes/lists.routes")(app);
require("./app/routes/events.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
