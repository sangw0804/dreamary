const auth = (req, res, next) => {
  if (req.headers.authtoken !== 'dreamary0418') res.status(400).send({ Error: 'invalid token' });
  else next();
};

module.exports = auth;
