# Rhythmos
[![Build Status](https://travis-ci.org/verbetam/rhythmos.svg?branch=master)](https://travis-ci.org/verbetam/rhythmos)

A rhythm game as web app built in Angular2 with HTML5 database local storage and p2p transfer via a web torrent cloud. Follows Stepmania's SM and SSC file specifications and scoring rules.

## Prereq
Project is developed with [NodeJS](https://nodejs.org/). It is easiest to build with [Angular-Cli](https://github.com/angular/angular-cli). With node and npm:
```bash
npm i -g angular-cli
git clone https://github.com/verbetam/rhythmos
cd rhythmos
npm install
```

### Building
The project can be built into es5 js standards for distribution with the following commands:
```bash
$ ng build
```
Build files are built to rhythmos/dist/

### Serve App Locally
The project can be built and served locally through an httplight server using:
```bash
$ ng serve
```
This build the project and serve files from the dist directory at localhost:4200

### Testing
The Jasmine unit tests specs can be run with:
```bash
$ npm test
```
