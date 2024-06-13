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

// POST crear una nueva publicación
exports.createPublication = (req, res) => {
  const { driverId, origin, destination, availableSeats, cost } = req.body;
  Publication.create({ driverId, origin, destination, availableSeats, cost, status: false })
    .then(publication => {
      res.status(201).send(publication);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// PUT actualizar una publicación existente
exports.updatePublication = (req, res) => {
  const id = req.params.id;
  const { driverId, origin, destination, availableSeats, cost, status } = req.body;

  Publication.update({ driverId, origin, destination, availableSeats, cost, status }, {
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
};

// DELETE eliminar una publicación existente
exports.deletePublication = (req, res) => {
  const id = req.params.id;

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
};