const db = require('../models');
const Review = db.review;
const User = db.user;
const { Op } = require('sequelize');
const { Readable } = require('stream');
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
require('dotenv').config();
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');



const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const s3 = new S3Client({ 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }, 
  region: process.env.AWS_REGION });


exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Buscar el usuario por userId
    const user = await User.findOne({
      where: { userId: userId },
    });

    // Si el usuario no existe, devolver error 404
    if (!user) {
      return res.status(404).send({ message: `User with userId ${userId} not found.` });
    }

    // Buscar los reviews del usuario
    const reviews = await Review.findAll({
      where: { userId: userId },
    });

    let averageRating = null;
    // Calcular el rating promedio si el usuario tiene reviews
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      averageRating = totalRating / reviews.length;
    }

    res.status(200).send({
      reviews,
      averageRating,
      user
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


exports.changeRole = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({
      where: { email: email },
    });

    // If user does not exist, return 404
    if (!user) {
      return res.status(404).send({ message: `User with email ${email} not found.` });
    }

    // Update the user's role to 'driver'
    user.role = 'driver';
    await user.save();

    res.status(200).send({ message: `User role updated to driver.` });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.uploadDriversLicence = async (req, res) => {
  try {
    const userId = req.params.userId;
    const file = req.file;
    console.log("FILES", req.file)
    console.log("BUFFER", req.file.buffer)

    if (!file) {
      return res.status(400).send({ message: 'No file uploaded.' });
    }

    const fileName = randomImageName();

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: req.file.originalname,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command)

    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.originalname}`;

    const user = await User.findOne({
      where: { userId: userId },
    });

    if (!user) {
      return res.status(404).send({ message: `User with userId ${userId} not found.` });
    }

    user.driversLicence = imageUrl;
    await user.save();

    res.status(200).send({ message: 'Profile picture uploaded successfully.', imageUrl: imageUrl });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getDriversLicenceRequests = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        driversLicence: {
          [Sequelize.Op.not]: null // driversLicence no es nulo
        },
        role: 'passenger' // Rol es 'passenger'
      },
      attributes: ['userId', 'email'] // Seleccionar solo el atributo 'email'
    });

    res.status(200).json(users.map(user => ({
      userId: user.userId,
      email: user.email
    })));
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).send({ message: 'Error fetching emails.' });
  }
};


exports.getDriversLicence = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findOne({
      where: { userId: userId }
    });

    if (!user || !user.driversLicence) {
      return res.status(404).send({ message: `User with userId ${userId} or profile picture not found.` });
    }

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: path.basename(user.driversLicence) // Nombre de archivo en S3
    };

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    console.log("URL: ", url)

    res.status(200).json({
      url: url,
    });
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).send({ message: 'Error fetching profile picture.' });
  }
};


exports.acceptDriversLicence = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findOne({
      where: { userId: userId },
    });

    if (!user || !user.driversLicence) {
      return res.status(404).send({ message: `User with userId ${userId} or driver's licence not found.` });
    }

    // Update the user's role to 'driver'
    user.role = 'driver';
    await user.save();

    res.status(200).send({ message: `User role updated to driver.` });
  } catch (err) {
    console.error("Error accepting driver's licence: ", err);
    res.status(500).send({ message: err.message });
  }
};

// Endpoint to reject the driver's licence validation
exports.rejectDriversLicence = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findOne({
      where: { userId: userId },
    });

    if (!user || !user.driversLicence) {
      return res.status(404).send({ message: `User with userId ${userId} or driver's licence not found.` });
    }

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: path.basename(user.driversLicence), // Nombre de archivo en S3
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    user.driversLicence = null;
    await user.save();

    res.status(200).send({ message: `Driver's licence rejected and removed.` });
  } catch (err) {
    console.error("Error rejecting driver's licence: ", err);
    res.status(500).send({ message: err.message });
  }
};
