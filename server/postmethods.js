Meteor.methods({
  addPost: function (data) {
    Posts.insert({
      image: data,
      createdAt: new Date().toLocaleString(),
      user: {
        _id: Meteor.user()._id,
        email: Meteor.user().emails[0].address
      }
    });
  },
  deletePost: function(postId){
    var post = Posts.findOne({_id: postId }),
    postUserId = post.user._id;
    currentUserId = Meteor.userId();
    if(postUserId === currentUserId) {
      console.log("User deleted post.")
      Posts.remove({_id: postId});
    } else if(Roles.userIsInRole(Meteor.user(), ['admin'])){
      console.log("Admin deleted post.")
      Posts.remove({_id: postId});
    } else {
      console.log("Someone's trying to delete posts and shouldn't be.")
    }
  }
});
