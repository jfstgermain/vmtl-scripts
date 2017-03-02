const _ = require('lodash');
const csv = require('csv');
const fs = require('fs');

const colDefTemplate = _.template("@Column('<%= types.ormType %>', {name: '<%= dbName %>'})\npublic <%= _.camelCase(dbName) %>: <%= types.jsType %>;");

function convertToJsTypes (type) {
  let types = null;

  if (type.match(/integer|number/i)) {
    types = {
      ormType: 'number',
      jsType: 'number',
    };
  } else if (type.match(/string.*|varchar.*/i)) {
    types = {
      ormType: 'string',
      jsType: 'string',
    };
  } else if (type.match(/date.*/i)) {
    types = {
      ormType: 'date',
      jsType: 'Date',
    };
  }

  return types;
}

function generateModel (defFilePath) {
  fs.createReadStream(defFilePath)
    .pipe(csv.parse())
    .pipe(csv.transform((data) => {
      return `${colDefTemplate({
        dbName: _.toUpper(data[0]),
        types: convertToJsTypes(data[1]),
      })}\n\n`;
    }))
    .pipe(process.stdout);
}

module.exports = {
  generateModel,
};
