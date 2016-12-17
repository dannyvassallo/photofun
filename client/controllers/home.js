Template.home.helpers({
  // check if user is an admin
  'post': function() {
    return Posts.find({}, {sort: {likes: -1} });
  }
});

Template.home.rendered = function () {
  var $container = $('#masonry-grid');
  // initialize
  $container.masonry({
    columnWidth: '.col',
    itemSelector: '.col',
  });
};
