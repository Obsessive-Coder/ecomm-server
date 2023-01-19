require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./app/models');
const routes = require('./app/routes');

const app = express();

const { NODE_ENV, LOCAL_ORIGIN, LIVE_ORIGIN } = process.env

var corsConfig = {
  origin: NODE_ENV.includes('local') ? LOCAL_ORIGIN : LIVE_ORIGIN
};

// Setup middleware.
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sync the database.
db.sequelize.sync()
  .then(() => console.log('Synced database.'))
  .catch(error => console.log(`Failed to sync database: ${error.message}`));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Connect to routes.
app.use(routes);

// TODO: Store port in .env file.
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
  console.log(`You can view the server at http://localhost:${PORT}`);
});