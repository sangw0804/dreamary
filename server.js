const { app } = require('./app');

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`env : ${process.env.NODE_ENV || 'development'}`);
  console.log(`listening to port : ${port}`);
});
