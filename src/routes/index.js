const express = require('express');
const router = express.Router();

const loginRoutes = require('./loginRoutes');
const userRoutes = require('./userRoutes');
const serviceRoutes = require('./serviceRoutes');

router.use('/login', loginRoutes);
// router.use('/user', userRoutes);
// router.use('/service', serviceRoutes);


module.exports = router;