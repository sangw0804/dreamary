const logger = require('../log');

const logging = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  if (Object.keys(req.body).length) logger.info('body : %o', req.body);
  if (Object.keys(req.params).length) logger.info('params : %o', req.params);
  if (Object.keys(req.query).length) logger.info('query : %o', req.query);
  next();
};

module.exports = { logging };
