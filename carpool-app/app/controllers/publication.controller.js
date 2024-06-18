const db = require('../models');
const Publication = db.publication;

// GET todas las publicaciones
exports.getAllPublications = (req, res) => {
  Publication.findAll()
    .then(publications => {
      res.status(200).send(publications);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// GET publicación por ID
exports.getPublicationById = (req, res) => {
  const id = req.params.id;
  Publication.findByPk(id)
    .then(publication => {
      if (!publication) {
        return res.status(404).send({ message: "Publication Not found." });
      }
      res.status(200).send(publication);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// GET publicaciones de usuario
exports.getPublicationsByUserId = (req, res) => {
  const userId = req.params.driverId;
  Publication.findAll({
    where: {
      driverId: userId
    }
  })
    .then(publications => {
      res.status(200).send(publications);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// POST crear una nueva publicación (solo para drivers)
exports.createPublication = (req, res) => {
  const { origin, destination, availableSeats, cost } = req.body;
  const driverId = req.userId;

  Publication.create({ driverId, driverName, origin, destination, availableSeats, cost, status: false, departureDate })
    .then(publication => {
      res.status(201).send(publication);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// PATCH actualizar una publicación existente (solo para drivers)
exports.updatePublication = (req, res) => {
  const id = req.params.id;
  const { origin, destination, availableSeats, cost, status, departureDate } = req.body;
  const driverId = req.userId;

  // Verificar si la publicación pertenece al driver
  Publication.findByPk(id)
    .then(publication => {
      if (!publication) {
        return res.status(404).send({ message: "Publication Not found." });
      }
      if (publication.driverId !== driverId) {
        return res.status(403).send({ message: "You can only update your own publications." });
      }

      Publication.update({ origin, destination, availableSeats, cost, status }, {
        where: { id }
      })
        .then(num => {
          if (num == 1) {
            res.status(200).send({ message: "Publication was updated successfully." });
          } else {
            res.status(404).send({ message: `Cannot update Publication with id=${id}. Maybe Publication was not found or req.body is empty!` });
          }
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// DELETE eliminar una publicación existente (solo para drivers)
exports.deletePublication = (req, res) => {
  const id = req.params.id;
  const driverId = req.userId;

  // Verificar si la publicación pertenece al driver
  Publication.findByPk(id)
    .then(publication => {
      if (!publication) {
        return res.status(404).send({ message: "Publication Not found." });
      }
      if (publication.driverId !== driverId) {
        return res.status(403).send({ message: "You can only delete your own publications." });
      }

      Publication.destroy({
        where: { id }
      })
        .then(num => {
          if (num == 1) {
            res.status(200).send({ message: "Publication was deleted successfully!" });
          } else {
            res.status(404).send({ message: `Cannot delete Publication with id=${id}. Maybe Publication was not found!` });
          }
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
