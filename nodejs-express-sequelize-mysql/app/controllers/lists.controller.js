const db = require("../models");
const Lists = db.lists;
const Op = db.Sequelize.Op;

// Create and Save a new Lists
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Missing req.body.title. Content can not be empty!"
    });
    return;
  }

  // Create a Lists
  const list = {
    title: req.body.title,
    color: req.body.color,
    userId: req.body.userId
  };

  // Save Lists in the database
  Lists.create(list)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Lists."
      });
    });
};

// Retrieve all Lists from the database where title like..
exports.findAll = (req, res) => {
  //change title to req.list
  //const title = req.query.tasks;
  //var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
//{ where: condition }
  Lists.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving lists."
      });
    });
};

// Find a single Lists with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Lists.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Lists with id=" + id
      });
    });
};

// Update a Lists by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Lists.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Lists was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Lists with id=${id}. Maybe Lists was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Lists with id=" + id
      });
    });
};

// Delete a Lists with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Lists.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Lists was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Lists with id=${id}. Maybe Lists was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Lists with id=" + id
      });
    });
};

// Delete all Listss from the database.
exports.deleteAll = (req, res) => {
  Lists.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Lists were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all lists."
      });
    });
};

// // Find all published Listss
// exports.findAllPublished = (req, res) => {
//   Lists.findAll({ where: { published: true } })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving lists."
//       });
//     });
// };
