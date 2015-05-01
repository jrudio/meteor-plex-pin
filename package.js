Package.describe({
  // name: 'jrudio:plex-pin',
  name: 'jrudio:plex-pin',
  version: '0.0.5',
  // Brief, one-line summary of the package.
  summary: 'A Plex PIN request module for Plex Media Server(PMS) authorization',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/jrudio/meteor-plex-pin',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  'plex-pin': '0.0.5'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  // Dependencies
  api.use('http', 'client');

  // Muh Library
  api.addFiles('lib/server/plexpin.js', 'server');
  api.addFiles('lib/client/plexpin.js', 'client');

  // Promise Library
  api.addFiles('compatibility/bluebird.min.js', 'client');

  api.export('PlexPin');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('jrudio:plex-pin');
  api.addFiles('test/plexpin-tests.js');
});
