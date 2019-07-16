const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VaccinationCertificateSchema = new Schema({
    name: String,
    datum: Date,
    dosis = Float32Array,
    arzt = String,
    auffrischimpfung = Date
});


const Vaccinations = mongoose.model('vaccinationcert',VaccinationCertificateSchema);

module.exports = Vaccinations;
