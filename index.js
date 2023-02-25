require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const db = require('./app/models');
const routes = require('./app/routes');

const { NODE_ENV, LOCAL_ORIGIN, LIVE_ORIGIN, FIREBASE_PROJECT_ID } = process.env;

admin.initializeApp({ projectId: FIREBASE_PROJECT_ID });

const app = express();

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

app.use(decodeIDToken);

// Connect to routes.
app.use(routes);

// TODO: Store port in .env file.
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
  console.log(`You can view the server at http://localhost:${PORT}`);
});

async function decodeIDToken(req, res, next) {
  // This function taken from: https://fireship.io/snippets/express-middleware-auth-token-firebase/.
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const accessToken = req.headers.authorization.split('Bearer ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(accessToken);
      req.currentUser = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }

  if (!req.currentUser) {
    return res.status(403).send('You are not authorized to access this resource');
  }

  next();
}