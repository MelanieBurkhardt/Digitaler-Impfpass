# Digitaler-Impfpass

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.3.

## Project setup

Install node.js 

## Packages and Execution

Run `npm install` to install node packages

Run `npm start` to execute script (frondend)

Run `node app.js` to call to server (samlBackend)

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Configuration

Import `realm-export_keycloak.json` into keycloak

If something in Keycloak is changed, export the whole config and replace the json-File


## TODOs: 

[ ] app.js: 		// TODO: Fix req.isAuthenticated. It doesnt recognize a revisiting user - as a result the api key is never submitted 
