Meteor.methods({
  addPost: function (data) {
    Posts.insert({
      image: data,
      createdAt: new Date().toLocaleString(),
      likes: 0,
      user: {
        _id: Meteor.user()._id,
        email: Meteor.user().emails[0].address
      }
    });
  },
  likePost: function(postId){
    userSignedIn = Meteor.user() || false;
    if(userSignedIn){
      Posts.update({_id: postId}, {$inc: {likes: 1} });
    }
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
