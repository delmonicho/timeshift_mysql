const db = require("../models");
const Users = db.users;
const Op = db.Sequelize.Op;

// Create and Save a new users
exports.create = (req, res) => {
  // Validate request
  if (!req.body.first_name) {
    res.status(400).send({
      message: "Missing req.body.first_name. Content can not be empty!"
    });
    return;
  }

  // Create a users
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  };

  // Save users in the database
  Users.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the users."
      });
    });
};

// Retrieve all users from the database where title like..
exports.findAll = (req, res) => {
  //change title to req.user
  //const title = req.query.tasks;
  //var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
//{ where: condition }

//Table Associations
  Users.findAll({
    include: [
      {
        //model: db.events,
        model: db.lists,
        include: [
          {
            model: db.tasks
          }
        ]
      }
    ]
  }).then(users => {
    const resObj = users.map(user => {

      //tidy up the user data
      return Object.assign(
        {},
        {
          userId: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          username: user.username,
          password: user.password,
          lists: user.lists.map(list => {

            //tidy up the list data
            return Object.assign(
              {},
              {
                listId: list.id,
                title: list.title,
                color: list.color,
                userId: list.userId,
                tasks: list.tasks.map(task => {

                  //tidy up the tasks data
                  return Object.assign(
                    {},
                    {
                      taskId: task.id,
                      title: task.title,
                      est_time: task.est_time,
                      alg_time: task.alg_time,
                      listId: task.listId
                    }
                  )
                })
              }
            )
          })
        }
      )
    });
    res.json(resObj)
  });
    // .then(data => {
    //   res.send(data);
    // })
    // .catch(err => {
    //   res.status(500).send({
    //     message:
    //       err.message || "Some error occurred while retrieving users."
    //   });
    // });
};

// Find a single users with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Users.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving users with id=" + id
      });
    });
};

// Update a users by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Users.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "users was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update users with id=${id}. Maybe users was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating users with id=" + id
      });
    });
};

// Delete a users with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Users.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "users was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete users with id=${id}. Maybe users was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete users with id=" + id
      });
    });
};

// Delete all userss from the database.
exports.deleteAll = (req, res) => {
  Users.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} users were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};

// // Find all published userss
// exports.findAllPublished = (req, res) => {
//   users.findAll({ where: { published: true } })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving users."
//       });
//     });
// };
