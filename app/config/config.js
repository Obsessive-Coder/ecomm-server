const {
  LOCAL_DB_PORT,
  LOCAL_DB_HOST_NAME,
  LOCAL_DB_NAME,
  LOCAL_DB_USERNAME,
  LOCAL_DB_PASSWORD,
  RDS_PORT,
  RDS_HOSTNAME,
  RDS_DB_NAME,
  RDS_USERNAME,
  RDS_PASSWORD,
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
    'port': RDS_PORT,
    'username': RDS_USERNAME,
    'password': RDS_PASSWORD,
    'database': RDS_DB_NAME,
    'host': RDS_HOSTNAME,
    'dialect': 'mysql',
    'define': {
      'timestamps': false
    },
    'dialectOptions': {
      'decimalNumbers': true
    }
  },
  'development': {
    'port': RDS_PORT,
    'username': RDS_USERNAME,
    'password': RDS_PASSWORD,
    'database': RDS_DB_NAME,
    'host': RDS_HOSTNAME,
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