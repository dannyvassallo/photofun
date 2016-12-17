Meteor.methods({
  createPost: function (data) {
    Posts.insert({
      image: data,
      user: {
        _id: Meteor.user()._id,
      }
    });
  }
});
