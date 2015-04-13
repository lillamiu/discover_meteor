Package.describe({
  name: "lillamiu:errors",
  version: "0.0.2",
  // Brief, one-line summary of the package.
  summary: "A pattern to display application errors to the user",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: null
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.2');
  api.use(['minimongo', 'mongo-livedata', 'templating'], 'client');
  api.addFiles(['errors.js', 'errors_list.html', 'errors_list.js'], 'client');

  if (api.export) {
    api.export('Errors');
  }
});