import packageJson from '../package.json' with { type: 'json' };

if (packageJson.version.includes('beta') || version.includes('-'))
   throw new Error('The package version is not valid for a stable release');
