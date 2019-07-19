var http = require('http');
var fs = require('fs');
var express = require("express");
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var saml = require('passport-saml');
var cors = require('cors');
// MongoDB einbinden
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var MemoryStore = require('memorystore')(session);

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// Keycloack
var session = require('express-session');
var Keycloak = require('keycloak-connect');

var memoryStore = new session.MemoryStore();
var Keycloak = new Keycloak({store: memoryStore});

dotenv.load();

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

var samlStrategy = new saml.Strategy({
	// URL that goes from the Identity Provider -> Service Provider
	callbackUrl: process.env.CALLBACK_URL,
	// URL that goes from the Service Provider -> Identity Provider
	entryPoint: process.env.ENTRY_POINT,
	// Usually specified as `/shibboleth` from site root
	issuer: process.env.ISSUER,
	identifierFormat: null,
	// Service Provider private key
	//decryptionPvk: fs.readFileSync(__dirname + '/cert/key.pem'),
	// Service Provider Certificate
	//privateCert: fs.readFileSync(__dirname + '/cert/server.crt'),
	// Identity Provider's public key
	//cert: fs.readFileSync(__dirname + '/cert/idp_cert.pem'),
	validateInResponseTo: false,
	disableRequestedAuthnContext: true
}, function (profile, done) {
	return done(null, profile);
});

passport.use(samlStrategy);

var app = express();
// Allways use CORS
app.use(cors());

app.use(cookieParser());
app.use(bodyParser());
app.use(session({
	secret: process.env.SESSION_SECRET,
	name: "impfpass_session",
	proxy: true,
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated())
		return next();
	else
		return res.redirect('/login');
}

app.get('/',
	ensureAuthenticated,
	function (req, res) {
		res.status(200)
			.type('application/json')
			.send('{"token": "abasbdasdaksjdlaks"}').redirect('localhost:4200');
	}
);

app.get('/login',
	passport.authenticate('saml', {failureRedirect: '/', failureFlash: true}),
	function (req, res) {
		console.log('successfully authentificated');
		res.redirect('localhost:4200');
	}
);

app.post('/login/callback',
	passport.authenticate('saml', {failureRedirect: '/', failureFlash: true}),
	function (req, res) {
		res.redirect('http://localhost:4200');
	}
);

app.get('/apitoken',
	function (req, res) {
		// TODO: Fix req.isAuthenticated. It doesnt recognize a revisiting user - as a result the api key is never submitted
		if (req.isAuthenticated()) {
			res.status(200)
				.type('application/json')
				.send('{"token": "abasbdasdaksjdlaks"}');
		} else {
			res.status(401).send();
		}
	}
);

app.get('/logout', function (req, res) {
	console.log('logging out');
	req.logout();
	res.redirect('http://localhost:4200/');
});

app.get('/login/fail',
	function (req, res) {
		res.status(401).send('Login failed');
	}
);

app.get('/Shibboleth.sso/Metadata',
	function (req, res) {
		res.type('application/xml');
		res.status(200).send(samlStrategy.generateServiceProviderMetadata(fs.readFileSync(__dirname + '/cert/cert.pem', 'utf8')));
	}
);

//general error handler
app.use(function (err, req, res, next) {
	console.log("Fatal error: " + JSON.stringify(err));
	next(err);
});

var server = app.listen(4006, function () {
	console.log('Listening on port %d', server.address().port)
});
