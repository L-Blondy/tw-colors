const version = require('../package.json').version;

if (!version.includes('beta'))
   throw new Error('The package version is not valid for a beta release');
