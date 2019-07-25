const express = require('express');
const router = express.Router();
//const bcrypt = require('bcryptjs');
//const passport = require('passport');

// Load Vaccination model
const Vaccination = require('../models/Vaccination');
//required??
//const { forwardAuthenticated } = require('../config/auth');

// Vaccination Certificate Page- change from vaccinations to vaccination
router.get('/',(req, res) => {
  return res.render('vaccinations');
});

// Add vaccination 
router.post('/', (req, res) => {
  console.log('blablabla');
  const { impfstoff, dosis, arzt, impfdatum, auffrischung } = req.body;
  let errors = [];
  
  console.log('post successfull');

  if (!impfstoff || !dosis || !arzt || !impfdatum || !auffrischung) {
    errors.push({ msg: 'Bitte füllen Sie alle Felder aus' });
  }
     else {
        const newVaccination = new Vaccination({
          impfstoff,
          dosis,
          arzt,
          impfdatum,
          auffrischung
        });          
          newVaccination
              .save()
              .then(vaccination => {
                req.flash(
                  'success_msg',
                  'Impfung erfolgreich hinzugefügt'
                );
                //res.redirect('/dashboard/vaccinations');
                res.redirect('/');
              })
              .catch(err => console.log(err));
            };

});
     
module.exports = router;
