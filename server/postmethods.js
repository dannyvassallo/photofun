Meteor.methods({
  createPost: function (data) {
    Items.insert({
      image: data,
      user: {
        _id: Meteor.user()._id,
      }
    });
  }
});
