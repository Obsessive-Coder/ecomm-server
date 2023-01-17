require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./app/models');
const routes = require('./app/routes');

const app = express();

// TODO: store origin in .env file.
var corsConfig = { origin: 'http://localhost:8081' };

// Setup middleware.
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sync the database.
db.sequelize.sync()
  .then(() => console.log('Synced database.'))
  .catch(error => console.log(`Failed to sync database: ${error.message}`));

// Connect to routes.
app.use(routes);

// TODO: Store port in .env file.
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
  console.log(`You can view the server at http://localhost:${PORT}`);
});