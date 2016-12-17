Template.home.helpers({
  // check if user is an admin
  'post': function() {
    return Posts.find({}, {sort: {likes: -1} });
  }
});
