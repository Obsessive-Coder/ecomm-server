const {
  LOCAL_PORT,
  LOCAL_HOSTNAME,
  LOCAL_DB_NAME,
  LOCAL_USERNAME,
  LOCAL_PASSWORD,
  RDS_PORT,
  RDS_HOSTNAME,
  RDS_DB_NAME,
  RDS_USERNAME,
  RDS_PASSWORD,
} = process.env;

module.exports = {
  // 'local': {
  //   'port': 3306,
  //   'username': 'root',
  //   'password': 'root',
  //   'database': 'ecomm_dev_db',
  //   'host': '127.0.0.1',
  //   'dialect': 'mysql',
  //   'define': {
  //     'timestamps': false
  //   },
  //   'dialectOptions': {
  //     'decimalNumbers': true
  //   }
  // },
  'local': {
    'port': LOCAL_PORT,
    'username': LOCAL_USERNAME,
    'password': LOCAL_PASSWORD,
    'database': LOCAL_DB_NAME,
    'host': LOCAL_HOSTNAME,
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