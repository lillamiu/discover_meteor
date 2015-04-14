Comments = new Mongo.Collection('comments');

Meteor.methods({
  commentInsert: function (commentAttributes) {
    check(this.userId, String);
    check(commentAttributes, {
      postId: String,
      body: String
    });
    var user = Meteor.user();
    var post = Posts.findOne(commentAttributes.postId);

    if (! post) {
      throw new Meteor.Error('invalid-comment', "You must comment on a post");
    }

    comment = _.extend(commentAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    // update the post with the number of comments
    // $inc is a MongoDB operator to increment a field by x
    Posts.update(comment.postId, {$inc: {commentsCount: 1}});

    // create the comment, save the id
    comment._id = Comments.insert(comment);

    //now create a notification, informing the owner of the post that there's been a comment on his post
    createCommentNotification(comment);

    return comment._id;
  }
});