const db = require("../models");
const Tasks = db.tasks;
const Op = db.Sequelize.Op;

// Create and Save a new tasks
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Missing req.body.title. Content can not be empty!"
    });
    return;
  }

  // Create a tasks
  const task = {
    title: req.body.title,
    est_time: req.body.est_time,
    alg_time: req.body.alg_time,
    listId: req.body.listId
  };

  // Save tasks in the database
  Tasks.create(task)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the tasks."
      });
    });
};

// Retrieve all tasks from the database where title like..
exports.findAll = (req, res) => {
  //change title to req.task
  //const title = req.query.tasks;
  //var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
//{ where: condition }
  Tasks.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tasks."
      });
    });
};

// Find a single tasks with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tasks.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving tasks with id=" + id
      });
    });
};

// Update a tasks by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Tasks.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "tasks was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update tasks with id=${id}. Maybe tasks was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating tasks with id=" + id
      });
    });
};

// Delete a tasks with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tasks.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "tasks was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete tasks with id=${id}. Maybe tasks was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete tasks with id=" + id
      });
    });
};

// Delete all taskss from the database.
exports.deleteAll = (req, res) => {
  Tasks.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} tasks were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tasks."
      });
    });
};

// // Find all published taskss
// exports.findAllPublished = (req, res) => {
//   tasks.findAll({ where: { published: true } })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving tasks."
//       });
//     });
// };
