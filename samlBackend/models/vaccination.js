const mongoose = require('mongoose');

const VaccinationSchema = new mongoose.Schema({
  impfstoff: {
    type: String,
    required: true
  },
  dosis: {
    type: Number,
    required: true
  },
  arzt: {
    type: String,
    required: true
  },
  impfdatum: {
    type: Date,
    default: Date.now
  },
  auffrischung: {
    type: Date,
    default: Date.now
  }
});

const Vaccination = mongoose.model('Vaccination', VaccinationSchema);

module.exports = Vaccination;
