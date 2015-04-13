Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentPostId = this._id;

    var postAttributes = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    Meteor.call('postUpdate', postAttributes, currentPostId, function(error, result) {
      if (error) {
        //display the error to the user and abort
        return throwError(error.reason);
      }

      if (result.postExists) {
        throwError("This link has already been posted");
      }

      if (result.notOwner) {
        throwError("This post is not yours to edit!");
      }

      if (result.invalidFieldUpdate) {
        throwError("Those fields shouldn't be touched!");
      }

      Router.go('postPage', {_id: result._id});
    });

  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('postsList');
    }
  }
});