const path = require('path');

const config = {
  basePath: path.normalize(path.join(__dirname, '../')),
  patterns: {
    atom: {
      path: 'patterns/atoms',
      patternPrefix: 'a'
    },
    molecule: {
      path: 'patterns/molecules',
      patternPrefix: 'm'
    },
    organism: {
      path: 'patterns/organisms',
      patternPrefix: 'o'
    }
  }
}

module.exports = config;
