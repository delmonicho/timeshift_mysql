const db = require("../models");
const Events = db.events;
const Op = db.Sequelize.Op;

// Create and Save a new Events
exports.create = (req, res) => {
  // Validate request
  if (!req.body.start_time) {
    res.status(400).send({
      message: "Missing req.body.start_time. Content can not be empty!"
    });
    return;
  }

  // Create a Events
  const event = {
    title: req.body.title,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    recurring: req.body.recurring,
    user_id: req.body.user_id
  };

  // Save Events in the database
  Events.create(event)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Events."
      });
    });
};

// Retrieve all Events from the database where title like..
exports.findAll = (req, res) => {
  //change title to req.event
  //const title = req.query.tasks;
  //var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
//{ where: condition }
  Events.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving events."
      });
    });
};

// Find a single Events with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Events.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Events with id=" + id
      });
    });
};

// Update a Events by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Events.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Events was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Events with id=${id}. Maybe Events was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Events with id=" + id
      });
    });
};

// Delete a Events with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Events.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Events was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Events with id=${id}. Maybe Events was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Events with id=" + id
      });
    });
};

// Delete all Eventss from the database.
exports.deleteAll = (req, res) => {
  Events.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Eventss were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all events."
      });
    });
};

// // Find all published Eventss
// exports.findAllPublished = (req, res) => {
//   Events.findAll({ where: { published: true } })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving events."
//       });
//     });
// };
