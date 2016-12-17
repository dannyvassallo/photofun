Template.postPartial.events({
  "click .delete-post": function () {
    var postId = event.target.dataset.id
    Meteor.call('deletePost', postId);
  },
  "click .like-post": function () {
    var postId = event.target.dataset.id
    Meteor.call('likePost', postId);
  }
});

Template.postPartial.helpers({
  'isAdminOrCreator': function(post) {
    postUserId = post.user._id;
    currentUserId = Meteor.userId();
    if(postUserId === currentUserId) {
      return true
    } else if(Roles.userIsInRole(Meteor.user(), ['admin'])){
      return true
    } else {
      return false
    }
  }
});
