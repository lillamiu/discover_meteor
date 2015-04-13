Posts = new Mongo.Collection('posts');

Posts.allow({
  remove: function(userId, post) {
    return ownsDocument(userId, post);
  }
});

Meteor.methods({
  postInsert: function(postAttributes) {
    //MANDATORY TYPE CHECKS-----------------
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });

    var errors = validatePost(postAttributes);
    if (errors.title || errors.url) {
      throw new Meteor.Error('invalid-post', "You must set a title and URL for your post.");
    }

    //CHECK URL UNIQUENESS -----------------
    var postWithSameLink = Posts.findOne({
      url: postAttributes.url
    });
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }

    //DO INSERT WITH POST ATTRIBUTES -------
    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username, 
      submitted: new Date()
    });
    var postId = Posts.insert(post);

    return {
      _id: postId
    }
  },

  postUpdate: function(postAttributes, postId) {
    var post = Posts.findOne({
      _id: postId
    });

    //MANDATORY TYPE CHECKS ----------------
    check(Meteor.userId(), String);
    //Note! The value may not contain any keys not listed in the pattern.
    check(postAttributes, {
      title: String,
      url: String
    });

    //CHECK IF USER OWNS POST --------------
    var userId = Meteor.user()._id; 
    if (! ownsDocument(userId, post)) {
      return {
        notOwner: true,
        _id: post._id
      }
    }

    //CHECK URL UNIQUENESS -----------------
    var postWithSameLink = Posts.findOne({
      url: postAttributes.url
    });

    if (postWithSameLink && (postWithSameLink._id !== post._id)) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }

    //DO UPDATE WITH POST ATTRIBUTES -------
    var user = Meteor.user();
    _.extend(postAttributes, {
      lastEdit: new Date()
    });
    
    _.extend(post, postAttributes);
    
    Posts.update(post._id, {$set: postAttributes});

    return {
      _id: post._id
    }
  }
});

validatePost = function (post) {
  var errors = {};

  if (! post.title) {
    errors.title = "Please fill in a headline title for your post"
  }

  if (!post.url) {
    errors.url = "Please fill in a URL"
  }

  return errors;
};