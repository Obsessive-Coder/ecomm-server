const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../models');

class GenericController {
  constructor(modelName) {
    this.modelName = modelName;
    this.TableModel = db[modelName];

    // Bind class methods.
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
    this.destroyAll = this.destroyAll.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  getPagingData(data, page, limit) {
    const { count: itemCount, rows } = data;
    const pageIndex = page ? +page : 0;
    const pageCount = Math.ceil(limit ? itemCount / limit : itemCount);

    return { itemCount, pageCount, pageIndex, rows };
  };

  // Route Handlers.
  create(req, res) {
    this.TableModel.create(req.body)
      .then(record => res.send(record))
      .catch(error => res.status(500).send(this.handleError(error)));
  }

  findAll(req, res) {
    const {
      order: { column = 'id', direction = 'ASC' } = {},
      category_id,
      type_id,
      id: categoryId,
      title,
      page,
      limit
    } = req.query;

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const offset = pageInt * limitInt;

    this.TableModel.findAndCountAll({
      where: {
        ...(category_id ? { category_id } : {}),
        ...(type_id ? { type_id } : {}),
        ...(categoryId ? { id: categoryId } : {}),
        ...(title ? { title: { [Op.like]: `%${title}%` } } : {}),
      },
      order: [[column, direction]],
      distinct: true,
      ...(limit ? { limit: limitInt } : {}),
      ...(offset ? { offset } : {})
    })
      .then(records => {
        const data = this.getPagingData(records, pageInt, limitInt);
        res.send(data)
      })
      .catch(error => res.status(500).send(this.handleError(error)));
  }

  findOne(req, res) {
    const { id } = req.params;

    this.TableModel.findByPk(id)
      .then(record => {
        if (record) {
          res.send(record);
        } else {
          res.status(404).send(
            this.handleError({ message: `Could not find the requested record in ${this.modelName}.` })
          );
        }
      })
      .catch(error => res.status(500).send(this.handleError(error)));
  }

  update(req, res) {
    const { id } = req.params;
    this.TableModel.update(req.body, { where: { id } })
      .then(updatedCount => {
        if (updatedCount == 1) {
          res.send({ message: `Successfully updated the record in ${this.modelName}.` });
        } else {
          res.send(this.handleError({ message: `Could not update the record in ${this.modelName}.` }))
        }
      })
      .catch(error => res.status(500).send(this.handleError(error)));
  }

  destroy(req, res) {
    const { id } = req.params;

    this.TableModel.destroy({ where: { id } })
      .then(destroyedCount => {
        if (destroyedCount == 1) {
          res.send({ message: `Successfully deleted the record in ${this.modelName}.` });
        } else {
          res.send(this.handleError({ message: `Could not delete the record in ${this.modelName}.` }));
        }
      })
      .catch(error => res.status(500).send(this.handleError(error)));
  }

  destroyAll(req, res) {
    this.TableModel.destroy({ where: {}, truncate: false })
      .then(destroyedCount => {
        res.send({ message: `${destroyedCount} records were deleted in ${this.modelName}` })
      })
      .catch(error => res.status(500).send(this.handleError(error)));
  }

  handleError(error) {
    return {
      message:
        error.message || 'An error occurred while accessing the database.'
    }
  }
}

module.exports = GenericController;