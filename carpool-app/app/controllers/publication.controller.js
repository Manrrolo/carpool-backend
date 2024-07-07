const db = require('../models');
const Publication = db.publication;
const User = db.user;
const Trip = db.trip;
const Request = db.request;
const Op = db.Sequelize.Op;

// GET todas las publicaciones
exports.getAllPublications = async (req, res) => {
  try {
    const publications = await Publication.findAll({
      include: [
        { model: User, as: 'driver', attributes: ['firstName', 'lastName'] }
      ]
    });
    res.status(200).send(publications);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// POST publicaciones filtradas
exports.postFilteredPublications = async (req, res) => {
  try {
    let { origin, destination, date } = req.body;
    let publications;
    const startDate = new Date(date).setHours(0,0,0,0);
    const finalDate = new Date(date).setHours(23,59,59,999);

    if (date == '')
      publications = await Publication.findAll({ where: {origin: {[Op.iLike]: `%${origin}%`}, destination: {[Op.iLike]: `%${destination}%`},}});
    else
      publications = await Publication.findAll({ where: {origin: {[Op.iLike]: `%${origin}%`}, destination: {[Op.iLike]: `%${destination}%`}, departureDate: {[Op.between]: [startDate, finalDate]},}});

    res.status(200).send(publications);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

// GET publicación por ID
exports.getPublicationById = async (req, res) => {
  try {
    const id = req.params.id;
    const publication = await Publication.findByPk(id, {
      include: [
        { model: User, as: 'driver', attributes: ['firstName', 'lastName'] }
      ]
    });
    if (!publication) {
      return res.status(404).send({ message: "Publication Not found." });
    }

    res.status(200).send(publication);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// GET publicaciones de usuario
exports.getPublicationsByUserId = async (req, res) => {
  try {
    const userId = req.params.driverId;
    const publications = await Publication.findAll({
      where: {
        driverId: userId
      },
      include: [
        { model: User, as: 'driver', attributes: ['firstName', 'lastName'] }
      ]
    });
    res.status(200).send(publications);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// POST crear una nueva publicación (solo para drivers)
exports.createPublication = async (req, res) => {
  const { origin, destination, availableSeats, cost, departureDate } = req.body;
  const driverId = req.userId;

  try {
    const publication = await Publication.create({ driverId, origin, destination, availableSeats, cost, status: true, departureDate });
    const trip = await Trip.create({ publicationId: publication.publicationId, userId: driverId, status: 'pending' })
    res.status(201).send({ publication, trip });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// PATCH actualizar una publicación existente (solo para drivers)
exports.updatePublication = async (req, res) => {
  const id = req.params.id;
  const { origin, destination, availableSeats, cost, status, departureDate } = req.body;
  const driverId = req.userId;

  try {
    const publication = await Publication.findByPk(id);
    if (!publication) {
      return res.status(404).send({ message: "Publication Not found." });
    }
    if (publication.driverId !== driverId) {
      return res.status(403).send({ message: "You are not authorized to update this publication." });
    }

    const [num] = await Publication.update({ origin, destination, availableSeats, cost, status, departureDate }, {
      where: { publicationId: id }
    });
    if (num === 1) {
      res.status(200).send({ message: "Publication was updated successfully." });
    } else {
      res.status(404).send({ message: `Cannot update Publication with id=${id}. Maybe Publication was not found or req.body is empty!` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// DELETE eliminar una publicación existente (solo para drivers)
exports.deletePublication = async (req, res) => {
  const id = req.params.id;
  const driverId = req.userId;

  try {
    const publication = await Publication.findByPk(id);
    if (!publication) {
      return res.status(404).send({ message: "Publication Not found." });
    }
    if (publication.driverId !== driverId) {
      return res.status(403).send({ message: 'You are not authorized to delete this publication.' });
    }

    const num = await Publication.destroy({
      where: { publicationId: id }
    });
    if (num === 1) {
      res.status(200).send({ message: "Publication was deleted successfully!" });
    } else {
      res.status(404).send({ message: `Cannot delete Publication with id=${id}. Maybe Publication was not found!` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// PATCH cancelar una publicación (solo para drivers)
exports.cancelPublication = async (req, res) => {
  const id = req.params.id;
  const driverId = req.userId;

  try {
    const publication = await Publication.findByPk(id);
    if (!publication) {
      return res.status(404).send({ message: "Publication Not found." });
    }
    if (publication.driverId !== driverId) {
      return res.status(403).send({ message: "You are not authorized to cancel this publication." });
    }

    // Actualizar el estado de la publicación a false
    await Publication.update({ status: false }, { where: { publicationId: id } });

    // Actualizar todas las solicitudes relacionadas a rejected
    await Request.update({ status: 'rejected' }, { where: { publicationId: id } });

    res.status(200).send({ message: "Publication was cancelled successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};