Template.newPost.events({
  "submit #newPhoto": function (e) {
    e.preventDefault();

    MeteorCamera.getPicture(function (err, data) {
      if (!err) {
        Meteor.call("addPost", data);
      }
    });

    return false;
  }
});
