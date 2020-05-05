module.exports = app => {
  const blocks = require("../controllers/blocks.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", blocks.create);

  // Retrieve all Tutorials
  router.get("/", blocks.findAll);

  // Retrieve all published Tutorials
  //router.get("/published", blocks.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", blocks.findOne);

  // Update a Tutorial with id
  router.put("/:id", blocks.update);

  // Delete a Tutorial with id
  router.delete("/:id", blocks.delete);

  // Create a new Tutorial
  router.delete("/", blocks.deleteAll);

  app.use('/api/blocks', router);
};
