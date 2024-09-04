const version = require('../package.json').version;

if (version.includes('beta') || version.includes('-'))
   throw new Error('The package version is not valid for a stable release');
