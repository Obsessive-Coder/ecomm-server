const GenericRouter = require('./Generic.Router');
const fileController = require('../controllers/File.Controller');

class FileRouter extends GenericRouter {
  constructor() {
    super(fileController);
  }
}

module.exports = new FileRouter().router;