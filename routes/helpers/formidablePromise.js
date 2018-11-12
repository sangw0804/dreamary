const formidable = require('formidable');

const form = new formidable.IncomingForm();

const formPromise = req =>
  new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => resolve({ err, fields, files }));
  });

module.exports = formPromise;
