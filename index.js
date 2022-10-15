const express = require('express');
const cors = require('cors');

const app = express();

// TODO: store origin in .env file.
var corsConfig = { origin: 'http://localhost:8081' };

// Setup middleware.
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: Put routes in own directory.
// Connect to routes.
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the e-comm server and api' });
});

// TODO: Store port in .env file.
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
  console.log(`You can view the server at http://localhost:${PORT}`);
});