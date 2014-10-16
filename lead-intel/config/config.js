var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'phantom'
    },
    port: 3000,
    db: 'mongodb://localhost/phantom-development'
    
  },

  test: {
    root: rootPath,
    app: {
      name: 'phantom'
    },
    port: 3000,
    db: 'mongodb://localhost/phantom-test'
    
  },

  production: {
    root: rootPath,
    app: {
      name: 'phantom'
    },
    port: 3000,
    db: 'mongodb://localhost/phantom-production'
    
  }
};

module.exports = config[env];
