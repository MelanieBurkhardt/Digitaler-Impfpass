const express = require('express');
const router = express.Router();

const Appointment = require('../models/Appointment');
//Appointment view required??
router.get('/', (req, res) => res.render('vaccinations'));

module.exports = router;
