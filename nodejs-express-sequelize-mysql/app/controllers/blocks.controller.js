const db = require("../models");
const Blocks = db.blocks;
const Op = db.Sequelize.Op;

// Create and Save a new Blocks
exports.create = (req, res) => {
  // Validate request
  if (!req.body.start_time) {
    res.status(400).send({
      message: "Missing req.body.start_time. Content can not be empty!"
    });
    return;
  }

  // Create a Blocks
  const block = {
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    event_id: req.body.event_id
  };

  // Save Blocks in the database
  Blocks.create(block)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Blocks."
      });
    });
};

// Retrieve all Blocks from the database where title like..
exports.findAll = (req, res) => {
  //change title to req.block
  //const title = req.query.tasks;
  //var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
//{ where: condition }
  Blocks.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving blocks."
      });
    });
};

// Find a single Blocks with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Blocks.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Blocks with id=" + id
      });
    });
};

// Update a Blocks by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Blocks.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Blocks was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Blocks with id=${id}. Maybe Blocks was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Blocks with id=" + id
      });
    });
};

// Delete a Blocks with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Blocks.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Blocks was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Blocks with id=${id}. Maybe Blocks was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Blocks with id=" + id
      });
    });
};

// Delete all Blockss from the database.
exports.deleteAll = (req, res) => {
  Blocks.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Blockss were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all blocks."
      });
    });
};

// // Find all published Blockss
// exports.findAllPublished = (req, res) => {
//   Blocks.findAll({ where: { published: true } })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving blocks."
//       });
//     });
// };
