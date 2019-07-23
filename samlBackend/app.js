var http = require('http');
var fs = require('fs');
var express = require('express');
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var saml = require('passport-saml');
var cors = require('cors');
const webdav = require('webdav-server').v2;
// Use var instead of const, because sever is declared twice
var server = new webdav.WebDAVServer();
// TODO: proper MongoDB connection  
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var MemoryStore = require('memorystore')(session);
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');

const app = express();

var passport = require('passport');
var samlStrategy = require('passport-saml').Strategy;
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

// Always use CORS
app.use(cors());

// Middleware not supported by Express, source: https://www.npmjs.com/package/body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(cookieParser());
// app.use(bodyParser());
app.use(session({
	secret: process.env.SESSION_SECRET,
	name: "impfpass_session",
	proxy: true,
	resave: true,
	saveUninitialized: true,
	store: memoryStore,
	cookie: {
		secure: false,
	}
}));

app.use(Keycloak.middleware());

// session cookies
// if (app.get('env') === 'production') {
// 	app.set('trust proxy', 1) // trust first proxy
// 	session.cookie.secure = true // save secure cookies
// }

app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated())
		return next();
	else
		return res.redirect('/login')
};

// routes
app.get('/',
	ensureAuthenticated,
	Keycloak.protect(),
	function (req, res) {
		res.status(200)
			.type('application/json')
			.send('{"token": "abasbdasdaksjdlaks"}')
			.redirect('localhost:4200');
	}
);

app.get('/login',
	passport.authenticate('saml', {failureRedirect: '/', failureFlash: true}),
	function (req, res) {
		console.log('successfully authentificated');
		res.redirect('http://localhost:4200');
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
		if (req.session !=={}) {
			console.log(req.session);
			res.status(200)
			.type('application/json')
			.send('{"token": "abasbdasdaksjdlaks"}');
		} else {
			res.status(401).send;
		}
	}
	// function (req, res) {
	// 	// TODO: Fix req.isAuthenticated. It doesnt recognize a revisiting user - as a result the api key is never submitted
	// 	if (req.isAuthenticated()) {
	// 		res.status(200)
	// 			.type('application/json')
	// 			.send('{"token": "abasbdasdaksjdlaks"}');
	// 	} else {
	// 		res.status(401).send();
	// 	}
	// }
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

// WebDAV 
server.setFileSystem('/webDAV', new webdav.PhysicalFileSystem('\Desktop\test'), (success) => {
    //server.start(() => console.log('READY'));
});

var server = app.listen(4006, function () {
	console.log('Listening on port %d', server.address().port)
});


// TODO: Insert MongoDB content from mongoDBconnection/app.js here