// Local (client only)  collection. send in null as mongo db name.

Errors = new Mongo.Collection(null);

throwError = function(message) {
  Errors.insert({message: message});
};