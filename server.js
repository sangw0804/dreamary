const { app } = require('./app');
const logger = require('./log');

const port = process.env.PORT || 3030;
app.listen(port, () => {
  logger.info(`env : ${process.env.NODE_ENV || 'development'}`);
  logger.info(`listening to port : ${port}`);
});
logger.error('error!');
