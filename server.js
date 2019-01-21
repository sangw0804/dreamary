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
	  ca: fs.readFileSync('/etc/letsencrypt/archive/dreamaryserver.ga/chain1.pem'),
      key: fs.readFileSync('/etc/letsencrypt/archive/dreamaryserver.ga/privkey1.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/archive/dreamaryserver.ga/cert1.pem')
    },
    app
  )
  .listen(port2, () => console.log(`https listening to port : ${port2}`));
