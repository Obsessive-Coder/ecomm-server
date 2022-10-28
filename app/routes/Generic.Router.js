const router = require('express').Router();

class GenericRouter {
  constructor(controller) {
    this.router = router;

    const { findAll, create, findOne, update, destroy } = controller;

    this.router.route('/')
      .get(findAll)
      .post(create);

    this.router.route('/:id')
      .get(findOne)
      .put(update)
      .delete(destroy);
  }
};

module.exports = GenericRouter;