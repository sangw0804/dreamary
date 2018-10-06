const { transports, format, createLogger } = require('winston');
const appRoot = require('app-root-path');

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.File({
      filename: `${appRoot}/log/error.log`,
      level: 'error'
    }),
    new transports.File({
      filename: `${appRoot}/log/info.log`,
      level: 'info'
    }),
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.printf(
          info => `[${info.timestamp}] ${info.level}: ${info.message}`
        )
      )
    })
  ]
});

module.exports = logger;
