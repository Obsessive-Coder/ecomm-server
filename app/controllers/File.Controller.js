const AWS = require('aws-sdk');

const {
  AWS_S3_BUCKET, AWS_S3_REGION, AWS_IAM_ACCESS_KEY_ID, AWS_IAM_SECRET_ACCESS_KEY
} = process.env;

const s3 = new AWS.S3({
  region: AWS_S3_REGION,
  apiVersion: 'latest',
  credentials: {
    accessKeyId: AWS_IAM_ACCESS_KEY_ID,
    secretAccessKey: AWS_IAM_SECRET_ACCESS_KEY
  }
});

class FileController {
  constructor() {
    // Bind class methods.
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
    this.destroyAll = this.destroyAll.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  async upload(imageName, base64Image, type) {
    const params = {
      Bucket: AWS_S3_BUCKET,
      Key: imageName,
      Body: new Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64'),
      ContentType: type
    };

    let data;

    try {
      data = await this.promiseUpload(params);
    } catch (error) {
      return this.handleError(error);
    }

    return data.Location;
  }

  promiseUpload(params) {
    return new Promise(function (resolve, reject) {
      s3.upload(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async create(req, res) {
    const base64Image = req.body.image;
    const imageName = req.body.name;
    const type = req.body.type;

    let response;

    try {
      response = await this.upload(imageName, base64Image, type);
    } catch (error) {
      return this.handleError(error);
    }

    var params = { Bucket: AWS_S3_BUCKET, Key: imageName };
    var url = await s3.getSignedUrlPromise('getObject', params);

    res.send(url);
  }

  findAll(req, res) {
    res.send('Find All');
  }

  findOne(req, res) {
    res.send('Find One');
  }

  update(req, res) {
    res.send('Update');
  }

  destroy(req, res) {
    res.send('Destroy');
  }

  destroyAll(req, res) {
    res.send('Destroy All');
  }

  handleError(error) {
    return {
      message:
        error.message || 'An error occurred while accessing the database.'
    }
  }
}

module.exports = new FileController();