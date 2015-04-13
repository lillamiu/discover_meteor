Template.postSubmit.created = function() {
  Session.set('postSubmitErrors', {}); //reset every time, so no old errors are kept
};

Template.postSubmit.helpers({
  errorMessage: function (field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function (field) {
    // '!!' converts an object/non-boolean into a boolean
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.postSubmit.events({
  'submit form': function (e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    var errors = validatePost(post);
    if (errors.title || errors.url) {
      return Session.set('postSubmitErrors', errors);
    }

    Meteor.call('postInsert', post, function (error, result) {
      if (error) {
        //display the error to the user and abort
        return Errors.throw(error.reason);
      }

      if (result.postExists) {
        Errors.throw("This link has already been posted");
      }

      Router.go('postPage', {_id: result._id});
    });
  }
});