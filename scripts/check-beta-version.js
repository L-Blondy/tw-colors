import packageJson from '../package.json' with { type: 'json' };

if (!packageJson.version.includes('beta'))
   throw new Error('The package version is not valid for a beta release');
