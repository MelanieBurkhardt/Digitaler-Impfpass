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
const ical = require('ical-generator');
const cal = ical({domain: 'impfpass.pass', name: 'my first iCal'});
var wfs = require("webdav-fs");
 


const app = express();

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

// TODO: Insert MongoDB content from mongoDBconnection/app.js here
// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// // Express body parser
// app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// // // Passport middleware
// // app.use(passport.initialize());
// // app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
//path changed. old: '/dashboard/vaccinations ???CHECK???
app.use('/dashboard/vaccinations', require('./routes/vaccinations.js'));
console.log('xyz');
//get methode for icall - app.use or app.get?? 
//app.use('/calendar', require('./routes/calendar.js'));


//maybe app.use for appointments required
(() => {
	app.get('/dashboard/appointments/subscribe', (req, res) => {
		res.send('Hello iCal')
	});
	const PORT = process.env.PORT || 5000;

	app.listen(PORT, console.log(`Server started on port ${PORT}`));
})();

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
app.get('/test', (req, res, next) => {console.log('###############'); next()});

app.get('/', 
	ensureAuthenticated, (req, res, next) => {console.log('###############'); next();},
	Keycloak.protect(), 
	function (req, res) {
		res.status(200)
			.type('application/json')
			.send('{"token": "112222333"}')
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
ensureAuthenticated, (req, res, next) => {console.log('###############'); next();},
Keycloak.protect(),
	function (req, res) { 
		if (req.session !=={}) {
			console.log(req.session);
			res.status(200)
			.type('application/json')
			.send('{"token": "aaaaaaaaaabbbbbbbbb"}');
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

// ical: localhost:4006/ical
app.get('/ical', 
function (req, res) {
	cal.createEvent({
		start: '20190725T153000',
		end: '20190725T154700' ,
		summary: 'Example Event',
		description: 'SSD Beispiel',
		location: 'M',
		url: 'http://sebbo.net/'
	});
	cal.serve(res); 
})

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

// WebDAV Server
app.use(webdav.extensions.express('/webDAV', server));

server.setFileSystem('/webDav', new webdav.PhysicalFileSystem('C:/Users/burkh/Documents/15_Master/01_Kernfächer/Service Solution Design/DigitalerImpfpass/samlBackend/public/webDavFiles'), (success) => {

let file1 = webdav.ResourceType.File;

// //let content = "test123";
// fs.writeFile('http://localhost:5000/webDav/test.txt', "hallo", function(err) {
//     // throws an error, you could also catch it here
//    if (err) {
// 	console.error(err.message);
// 	}

//     // success case, the file was saved
//    // console.log('Content saved!');
// })
// //check!!!
  server.rootFileSystem().addSubTree(server.createExternalContext(), {
      'folder1': {                                // /folder1
          'file1.txt': webdav.ResourceType.File,  // /folder1/file1.txt
          'file2.txt': webdav.ResourceType.File   // /folder1/file2.txt
      },
      'file0.txt': webdav.ResourceType.File       // /file0.txt
  })
//write into the generated file
server.start(() => console.log('READY'));
});

// wfs.stat("/report.docx", function(err, data) {
//     console.log("Is file:", data.isFile());
// });

// wfs.writeFile("/Temp/im-here.txt", "This is a saved file! REALLY!!", function(err) {
//     if (err) {
//         console.error(err.message);
//     }
// });
 
var server = app.listen(4006, function () {
	console.log('Listening on port %d', server.address().port)
});




