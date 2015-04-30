Package.describe({
  name: 'jrudio:plex-pin',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'A Plex PIN request module for Plex Media Server(PMS) authorization',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('plexpin.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('jrudio:plex-pin');
  api.addFiles('plexpin-tests.js');
});
