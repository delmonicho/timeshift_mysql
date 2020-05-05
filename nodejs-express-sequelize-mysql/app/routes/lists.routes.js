module.exports = app => {
  const lists = require("../controllers/lists.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", lists.create);

  // Retrieve all Tutorials
  router.get("/", lists.findAll);

  // Retrieve all published Tutorials
  //router.get("/published", lists.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", lists.findOne);

  // Update a Tutorial with id
  router.put("/:id", lists.update);

  // Delete a Tutorial with id
  router.delete("/:id", lists.delete);

  // Create a new Tutorial
  router.delete("/", lists.deleteAll);

  app.use('/api/lists', router);
};
