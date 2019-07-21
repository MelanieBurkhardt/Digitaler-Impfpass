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

Import `realm-export_keycloak.json` from the project into keycloak (main menu > import > overwrite files)

If something in Keycloak is changed e. g. clients, export the whole config and replace the json-File `realm-export_keycloak.json`


## TODOs: 

[ ] app.js: 		// TODO: Fix req.isAuthenticated. It doesnt recognize a revisiting user - as a result the api key is never submitted 
