const {
  LOCAL_DB_PORT,
  LOCAL_DB_HOST_NAME,
  LOCAL_DB_NAME,
  LOCAL_DB_USERNAME,
  LOCAL_DB_PASSWORD,
  AWS_RDS_PORT,
  AWS_RDS_HOST_NAME,
  AWS_RDS_NAME,
  AWS_RDS_USERNAME,
  AWS_RDS_PASSWORD,
} = process.env;

module.exports = {
  'local': {
    'port': LOCAL_DB_PORT,
    'username': LOCAL_DB_USERNAME,
    'password': LOCAL_DB_PASSWORD,
    'database': LOCAL_DB_NAME,
    'host': LOCAL_DB_HOST_NAME,
    'dialect': 'mysql',
    'define': {
      'timestamps': false
    },
    'dialectOptions': {
      'decimalNumbers': true
    }
  },
  'local-remote': {
    'port': AWS_RDS_PORT,
    'username': AWS_RDS_USERNAME,
    'password': AWS_RDS_PASSWORD,
    'database': AWS_RDS_NAME,
    'host': AWS_RDS_HOST_NAME,
    'dialect': 'mysql',
    'define': {
      'timestamps': false
    },
    'dialectOptions': {
      'decimalNumbers': true
    }
  },
  'development': {
    'port': AWS_RDS_PORT,
    'username': AWS_RDS_USERNAME,
    'password': AWS_RDS_PASSWORD,
    'database': AWS_RDS_NAME,
    'host': AWS_RDS_HOST_NAME,
    'dialect': 'mysql',
    'define': {
      'timestamps': false
    },
    'dialectOptions': {
      'decimalNumbers': true
    }
  },
  'test': {
    'username': 'root',
    'password': null,
    'database': 'database_test',
    'host': '127.0.0.1',
    'dialect': 'mysql'
  },
  'production': {
    'username': 'root',
    'password': null,
    'database': 'database_production',
    'host': '127.0.0.1',
    'dialect': 'mysql'
  }
};