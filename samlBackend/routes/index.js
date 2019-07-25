const fs = require ('fs');
const moment = require ('moment');
const mdq = require ('mongo-date-query');
const json2csv = require ('json2csv').parse;
const path = require ('path');
const fields = ['name','email'];
const User = require('../models/User');

const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

// Vaccination Insertion 
router.get('/dashboard/vaccinations', ensureAuthenticated, (req, res) =>
  res.render('vaccinations', { 
    user: req.user
  })
);

//CSV Export inserted 
router.get('/dashboard/export', ensureAuthenticated, function (req, res) {
  User.find({name: req.user.name}, function (err, users) {
    if (err) {
      return res.status(500).json({ err });
    }
    else {
      res.setHeader('Content-Type', 'text/csv')
      let csv
      try {
        csv = json2csv(users, { fields });
        res.write(csv);
        res.end();
      } catch (err) {
        return res.status(500).send('second error');
      }
      //const dateTime = moment().format('YYYYMMDDhhmmss');
      //const filePath = path.join(__dirname, "..", "public", "exports", "csv-" + dateTime + ".csv")
      //fs.writeFile(filePath, csv, function (err) {
      //  if (err) {
      //    return res.json(err).status(500);
      //  }
      //  else {
      //    setTimeout(function () {
      //      fs.unlinkSync(filePath); // delete this file after 30 seconds
      //    }, 30000)
      //    return res.json("/exports/csv-" + dateTime + ".csv");
      //  }
     // });

    }
  })
//router.get methode required to use ical functionality??
  
});

router.get('/vaccinations', ensureAuthenticated, function (req, res) {
  User.find({name: req.user.name}, function (err, users) {
    if (err) {
      return res.status(500).json({ err });
    } else {
      fs.writeFile('\Desktop\test') 
    }
  })
});

// ical appointments

module.exports = router;