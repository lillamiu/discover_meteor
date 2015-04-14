Template.notifications.helpers({
  notifications: function () {
    return Notifications.find({userId: Meteor.userId(), read: false});
  },
  notificationCount: function () {
    return Notifications.find({userId: Meteor.userId(), read: false}).count();
  }
});

Template.notificationItem.helpers({
  notificationPostPath: function () {
    return Router.routes.postPage.path({_id: this.postId});
  }
});

// if a user clicks on the post link in the notification, it will be set to read
Template.notificationItem.events({
  'click a': function () {
    Notifications.update(this._id, {$set: {read: true}});
  }
});