#!/usr/bin/env node
const typeOrmGen = require('./typeorm-model-generator');
const argv = require('yargs').argv;

if (argv.generateModel) {
  typeOrmGen.generateModel(argv.generateModel);
}
