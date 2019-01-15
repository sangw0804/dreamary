const https = require('https');
const fs = require('fs');

const { app } = require('./app');
const logger = require('./log');

const port = process.env.PORT || 3030;
const port2 = 443;
app.listen(port, () => {
  logger.info(`env : ${process.env.NODE_ENV || 'development'}`);
  logger.info(`listening to port : ${port}`);
});

https
  .createServer(
    {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.cert')
    },
    app
  )
  .listen(port2, () => console.log(`https listening to port : ${port2}`));
