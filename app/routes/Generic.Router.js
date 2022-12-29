const express = require('express');

class GenericRouter {
  constructor(controller) {
    this.router = express.Router();

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