const mongoose = require('mongoose');

//check if model is valid to generate ics file
const AppointmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment;
