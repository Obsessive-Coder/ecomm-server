const admin = require('firebase-admin');

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

module.exports = { decodeIDToken }