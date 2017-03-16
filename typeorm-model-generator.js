const _ = require('lodash');
const csv = require('csv');
const fs = require('fs');

const colDefTemplate = _.template("@Column('<%= types.ormType %>', {name: '<%= dbName %>'<% if(types.length) {%>, length: <%= types.length %><% } %>})\npublic <%= _.camelCase(dbName) %>: <%= types.jsType %>;");

function convertToJsTypes (type) {
  let types = null;
  let matchRes;

  if (matchRes = type.match(/integer|number(\((\d+)\))?/i)) {
    types = {
      ormType: 'number',
      jsType: 'number',
      length: matchRes[2],
    };
  } else if (matchRes = type.match(/string.*|varchar2?(\((\d+)\))?/i)) {
    types = {
      ormType: 'string',
      jsType: 'string',
      length: matchRes[2],
    };
  } else if (matchRes = type.match(/date.*/i)) {
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
