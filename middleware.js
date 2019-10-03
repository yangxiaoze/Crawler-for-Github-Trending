const path = require('path');

module.exports.errorHandler = (error, request, response, next) => {
  if (error) {
    console.log('error - ', error);
    response.status(200).sendFile(path.join(`${__dirname}/constipated-robot.html`));
  }
  next(error);
};

module.exports.verboseLogging = (request, response, next) => {
  process.stdout.write('Logged\n');
  console.log('Request: ', request.originalUrl, 'Query: ', request.query, 'Body: ', request.body);
  const { send } = response;
  // eslint-disable-next-line func-names
  response.send = function (body) {
    console.log('Request: ', request.originalUrl, 'Response body: ', body);
    send.call(this, body);
  };
  next();
};
