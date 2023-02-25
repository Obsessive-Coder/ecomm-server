require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const db = require('./app/models');
const routes = require('./app/routes');
const { decodeIDToken } = require('./app/utils/middleware');

const { NODE_ENV, LOCAL_ORIGIN, LIVE_ORIGIN, FIREBASE_PROJECT_ID, PORT = 8080 } = process.env;

admin.initializeApp({ projectId: FIREBASE_PROJECT_ID });

const app = express();

var corsConfig = {
  origin: NODE_ENV.includes('local') ? LOCAL_ORIGIN : LIVE_ORIGIN
};

// Setup middleware.
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(decodeIDToken);

// Connect to routes.
app.use(routes);

// Sync the database.
db.sequelize.sync()
  .then(() => console.log('Synced database.'))
  .catch(error => console.log(`Failed to sync database: ${error.message}`));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
  console.log(`You can view the server at http://localhost:${PORT}`);
});