#MeteoReddit

Not quite a reddit clone, but an app that takes photos and lets you vote on them like reddit does.

###What's in it?

* Meteor
* Iron Router
* Blaze
* AccountsUI
* scss
* materialize-scss
* useraccounts Materialize
* browser-policy
* alanning:roles
* cunneen:accounts-admin-materializecss

<a name="dir"></a>
###Directory

#####Lesson 1: A Boilerplate
 * [Getting Started](#start)
 * [Adding Dependencies Up Front](#deps)
 * [Create An Index Route and a Layout](#index)
 * [Remove Boilerplate Code](#boiler)
 * [Not Found And Authentication Routes](#404)
 * [Authorization](#auth)

#####Lesson 2

* [Making Posts](#posts)
* [Styling Camera Package](#camera)

#####Lesson 3: Deployment & App

 * [Deployment](#horse)
 * [Sync Settings With Heroku](#heroku)
 * [Running on Android](#android)
 * [Generating Icons and Splashes](#icons)

<a name="start"></a>
###Getting Started

` `

`-----------------------------------------------------`

[Back To Top 🔼](#dir)

`-----------------------------------------------------`

` `

First, we Install [meteor](https://www.meteor.com/install). Second, we start er' up.

NOTE: If you have problems with ANYTHING on windows, try using CMD or PowerShell instead of gitbash to start your meteor instance.

```shell
meteor create myredditclone
cd myredditclone
touch README.md
npm install
meteor run #or meteor
```

Start tracking on github. Like, now.
Visit `localhost:3000` in your browser.
To use robomongo, connect to port `3001`
To use minimongo console, type `mongo` in the
terminal while in the `myredditclone` dir.

Meteor will livereload EVERYTHING. Enjoy that.

<a name="deps"></a>
###Adding Dependencies Up Front
` `

`-----------------------------------------------------`

[Back To Top 🔼](#dir)

`-----------------------------------------------------`

` `

Meteor has it's own package system called [Atmosphere](https://atmospherejs.com/) that installs
dependencies to `./meteor/package` using `meteor add <dep name>`. You can also use `npm i -S <package name>` to get node modules. You would import node modules the same way you are used to. Meteor packages are automatically available.

Let's get our dependencies installed.
copy paste the following into the bottom
of `./meteor/packages` (bypassing the `meteor add` or `npm install` step.)

```
fourseven:scss
poetic:materialize-scss
useraccounts:materialize
useraccounts:core
useraccounts:iron-routing
accounts-password@1.3.1
browser-policy@1.0.9
browser-policy-common@1.0.11
browser-policy-content@1.0.12
browser-policy-framing@1.0.12
alanning:roles
cunneen:accounts-admin-materializecss
```

We get Scss, materialize-scss, useraccounts (for authentication), Roles (for authorization), browser-policy (for CORS), and an admin panel for account control.

Delete the following lines from the packages file as well:

```
autopublish@1.0.7             # Publish all data to the clients (for prototyping)
insecure@1.0.7                # Allow all DB writes from clients (for prototyping)
```

As a final step run `meteor npm install --save bcrypt`.

<a name="index"></a>
###Create An Index Route and a Layout
` `

`-----------------------------------------------------`

[Back To Top 🔼](#dir)

`-----------------------------------------------------`

` `

Lets create an Iron Router. In the root of your project, make a new folder called `lib`. In the lib folder, make a `router.js` and paste in the following:

```javascript
// In the configuration, we declare the layout, 404, loading,
// navbar, and footer templates.
Router.configure({
  layoutTemplate: 'masterLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  yieldTemplates: {
    navbar: {to: 'navbar'},
    footer: {to: 'footer'},
  }
});

// In the map, we set our routes.
Router.map(function () {
  // Index Route
  this.route('home', {
    path: '/',
    template: 'home',
    layoutTemplate: 'masterLayout'
  });
});
```

After you've saved the router, goto `localhost:3000`. You should see "Couldn't find a template named "masterLayout" or "masterLayout". Are you sure you defined it?" in red. That's ok.

Let's import materialize now. In the client folder, rename `main.css` to `main.scss` and paste in the following:

```css
@import "{poetic:materialize-scss}/sass/components/_color.scss";
$primary-color: color("grey", "darken-4");
@import "{poetic:materialize-scss}/sass/materialize.scss";
```

You can change the entire color of the materialize theme by changing the primary-color to one of the colors from materialize's [color panel](http://materializecss.com/color.html#palette).

Now we'll put together our template.

Create a layouts folder in your client folder.

Then create a `masterLayout.html` with the following:

```html
<template name="masterLayout">
  {{> yield region='navbar'}}
    <main>
      {{> yield}}
    </main>
  {{> yield region='footer'}}
</template>
```

Visit `localhost:3000` and you should now see:
```
Couldn't find a template named "navbar" or "navbar". Are you sure you defined it?
Couldn't find a template named "home" or "home". Are you sure you defined it?
Couldn't find a template named "footer" or "footer". Are you sure you defined it?
```

We're still good.

Let's over write our `client/main.html` with some new information. Paste in the following over what's there:

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <title>MeteoReddit</title>
</head>
<body>
</body>
```

This takes care of our material icon cdn, and our responsive viewport meta.

If you've done everything right, `localhost:3000` should just be expecting our 3 templates right now.

Let's create them. First up is the navbar.

We need jQuery for materialize and we don't get `document.ready` because of the way blaze renders templates.

Create a new folder called `controllers` under client. I liked this naming convention because, while not necessarily controllers, they handle a lot of the data binding logic by way of calls.

In this folder, create a `masterLayout.js` and paste in the following:

```javascript
Template.masterLayout.rendered = function () {
  $(".button-collapse").sideNav();
};
```

Now we can paste in the navbar with a working collapse.

In your `layouts` folder, create another folder called `partials`. In the new `partials` folder, create a `navbar.html` and paste in the following:

```html
<template name="navbar">
  <nav>
    <div class="container">
      <div class="row">
        <div class="col s12">
          <div class="nav-wrapper">
            <a href="/" class="brand-logo">MeteoReddit</a>
            <a href="#" data-activates="mobile-nav" class="button-collapse"><i class="material-icons">menu</i></a>
            <ul class="right hide-on-med-and-down">
              {{#if currentUser}}
                <li><a href="/sign-out">Sign Out</a></li>
              {{else}}
                <li><a href="/sign-in">Sign In</a></li>
              {{/if}}
            </ul>
            <ul class="side-nav" id="mobile-nav">
              {{#if currentUser}}
                <li><a href="/sign-out">Sign Out</a></li>
              {{else}}
                <li><a href="/sign-in">Sign In</a></li>
              {{/if}}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
```

At `localhost:3000` you should have a functioning navbar.

2 errors to kill.

Let's get your footer setup.

create another partial in the `layouts/partials` folder called `footer.html`. Paste in the following:

```html
<template name="footer">
  <footer class="page-footer">
    <div class="container">
      <div class="row">
        <div class="col l6 s12">
          <h5 class="white-text">Footer Content</h5>
          <p class="grey-text text-lighten-4">You can use rows and columns here to organize your footer content.</p>
        </div>
        <div class="col l4 offset-l2 s12">
          <h5 class="white-text">Links</h5>
          <ul>
            <li><a class="grey-text text-lighten-3" href="#!">Link 1</a></li>
            <li><a class="grey-text text-lighten-3" href="#!">Link 2</a></li>
            <li><a class="grey-text text-lighten-3" href="#!">Link 3</a></li>
            <li><a class="grey-text text-lighten-3" href="#!">Link 4</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-copyright">
      <div class="container">
      © 2016 Dan Vassallo
      <a class="grey-text text-lighten-4 right" href="#!">More Links</a>
      </div>
    </div>
  </footer>
</template>
```

You should now just see one error on `localhost:3000` but The footer is up the navbar's butt. Let's fix that with a sticky footer from materialize.

In the client folder create a folder called `stylesheets`. In `client/stylesheets` create a `_stickyfooter.scss` partial and paste the following into it:

```
body {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

main {
  flex: 1 0 auto;
}
```

Import this file into the `client/main.scss` file so it looks like this:

```
@import "./stylesheets/_stickyfooter.scss";
```

and visit `localhost:3000` to see the magic happen.

Now last but not least, we need to create a homepage.

In the client folder, create another folder called `views`.

In views create another folder called `pages`.

In `client/views/pages/` create a file called `home.html` and paste in the following:

```html
<template name="home">
  <div class="container">
    <div class="row">
      <div class="col s12">
        <h1>Home</h1>
        <p>This is the index path.</p>
      </div>
    </div>
  </div>
</template>
```

That takes care of our home page errors -- even if we have some broken routes. Don't worry. That's up next.

<a name="boiler"></a>
###Remove boilerplate code
` `

`-----------------------------------------------------`

[Back To Top 🔼](#dir)

`-----------------------------------------------------`

` `

To get rid of the rest of the boilerplate code, setup CORS for your mobile devices, and gear up for the first admin, change the following:

Replace `client/main.js` with this
```javascript
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
```

And replace `server/main.js` with this
```javascript
import { Meteor } from 'meteor/meteor';
import { BrowserPolicy } from 'meteor/browser-policy-common';

Meteor.startup(() => {
  BrowserPolicy.content.allowOriginForAll('*');
  // code to run on server at startup

  // create admin from settings
  if (Meteor.users.findOne(Meteor.settings.adminId)){
    Roles.addUsersToRoles(Meteor.settings.adminId, ['admin']);
  }
}
```

<a name="404"></a>
###Not Found and Authentication Routes
` `

`-----------------------------------------------------`

[Back To Top 🔼](#dir)

`-----------------------------------------------------`

` `

If we click the sign in link, we see an error in our view:

`Couldn't find a template named "notFound" or "notFound". Are you sure you defined it?`

This comes from our router here:

`notFoundTemplate: 'notFound',`

We've defined a "Not Found" or 404 template but haven't created one yet. Let's do this now.

Under `client > views > pages` create a file called `notfound.html` and put the following in it:

```html
<template name="notFound">
  <main class="notfoundbody">
    <div class="container">
      <div class="row">
        <div class="col s12">
          <p>Page not found.</p>
        </div>
      </div>
    </div>
  </main>
</template>
```

When visit the sign-in link now, we should see "Page not found." instead. Our app is now rendering a custom 404 page.

Now we actually want to show a sign in page. We've already created the authentication methods and models by installing the account dependencies in the beginning. The specific version we've used already has materialize templates so they'll match our layout. Let's create the routes first, and then we'll do the templates.

Fix your router so it looks like this:

```javascript
// In the map, we set our routes.
Router.map(function () {
  // Index Route
  this.route('home', {
    path: '/',
    template: 'home',
    layoutTemplate: 'masterLayout'
  });
  // Sign In Route
  AccountsTemplates.configureRoute('signIn', {
      name: 'signin',
      path: '/sign-in',
      template: 'signIn',
      layoutTemplate: 'masterLayout',
      redirect: '/',
  });
  // Sign Up Route
  AccountsTemplates.configureRoute('signUp', {
      name: 'sign-up',
      path: '/sign-up',
      template: 'signUp',
      layoutTemplate: 'masterLayout',
      redirect: '/',
  });
  // Sign Out Route
  this.route('/sign-out', function(){
      Meteor.logout(function(err) {
          if (err) alert('There was a problem logging you out.');
          Router.go("/");
      });
      Router.go("/");
  });
});
```

Now when we visit the browser we should no longer see our "Not Found" template but a new error:

`Couldn't find a template named "signIn" or "signIn". Are you sure you defined it?`

The templates are premade by the package I previously mentioned. So lets drop in a template for our sign in and sign up routes.

In `client > views > pages` let's create a file called `signin.html`. Put the following inside it:

```html
<template name="signIn">
  <main class="signinbody">
    <div class="container">
      <div class="row row-pad">
        <div class="col s12 m6 offset-m3 l6 offset-l3 white z-depth-1 login">
          {{> atForm state='signIn'}}
        </div>
      </div>
    </div>
  </main>
</template>
```

Create another file called `signup.html` in the same folder and drop the following into it:

```html
<template name="signUp">
  <main class="registerbody">
    <div class="container">
      <div class="row">
        <div class="col s12 m6 offset-m3 l6 offset-l3 white z-depth-1 login">
          {{> atForm state='signUp'}}
        </div>
      </div>
    </div>
  </main>
</template>
```

User authentication is literally finished. You can create a user, and it will sign you in. You should now see a "Log Out" link in the navbar. You can also click this to sign out.

<a name="auth"></a>
###Authorization
` `

`-----------------------------------------------------`

[Back To Top 🔼](#dir)

`-----------------------------------------------------`

` `

We've also added a "materialized" admin account manager. Lets set that template up next.

Since we're loading a collection, we'll also need to setup our loader template.

First off let's update our router to include our "user management" route.

```javascript
// In the map, we set our routes.
Router.map(function () {
  // Index Route
  this.route('home', {
    path: '/',
    template: 'home',
    layoutTemplate: 'masterLayout'
  });
  // User Mgmt Route
  this.route('usermgmt', {
    path: '/usermgmt',
    template: 'userManagement',
    layoutTemplate: 'masterLayout',
    onBeforeAction: function() {
      if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
          this.redirect('/');
      }
      this.next();
    },
    loadingTemplate: 'loading'
  });
  // Sign In Route
  AccountsTemplates.configureRoute('signIn', {
      name: 'signin',
      path: '/sign-in',
      template: 'signIn',
      layoutTemplate: 'masterLayout',
      redirect: '/',
  });
  // Sign Up Route
  AccountsTemplates.configureRoute('signUp', {
      name: 'sign-up',
      path: '/sign-up',
      template: 'signUp',
      layoutTemplate: 'masterLayout',
      redirect: '/',
  });
  // Sign Out Route
  this.route('/sign-out', function(){
      Meteor.logout(function(err) {
          if (err) alert('There was a problem logging you out.');
          Router.go("/");
      });
      Router.go("/");
  });
});
```

Visit `http://localhost:3000/usermgmt` in your browser. You should get kicked back to the index because of the Role protection in the routes `onBeforeAction`. The route is missing a template or two, but lets get in to see the error first.

While logged in, paste the following into your console in chrome:

```javascript
Meteor.userId();
```

Put the ID somewhere for a moment. Meteor will likely refresh your console so save it in an empty document.

In the root of your project, create a new file called `settings.json`. Put this in that file:

```json
{
  "adminId": "<THE ID YOU JUST GOT FROM THE CHROME CONSOLE>"
}
```

Go to the terminal, and stop the meteor server with `ctrl+c`.

We're going to restart it with our settings file and take care of creating our first admin user -- Us.

Use the following command to start meteor:

`meteor run --settings settings.json`

Now when we visit `localhost:3000/usermgmt` we should see an error:

`Couldn't find a template named "userManagement" or "userManagement". Are you sure you defined it?`

Congrats, you now have user roles. Onto managing them. Let's use the prebuilt template for role management. Create an html file in `client > views > pages` called `usermgmt.html`. Put the following in it:

```html
<template name="userManagement">
  <main class="usermgmtbody">
    <div class="container">
      <div class="row white z-depth-1 usermgmt">
        <div class="col s12 m10 offset-m1">
          {{> accountsAdmin}}
        </div>
      </div>
    </div>
  </main>
</template>
```

Now you should see the user management panel as an admin. Tight.

Let's make a helper so we can show a link to this page in the navbar when an admin is present. Under `client > controllers` create a file called `navbar.js` that matches the following:

```javascript
Template.navbar.helpers({
  // check if user is an admin
  'isAdminUser': function() {
    return Roles.userIsInRole(Meteor.user(), ['admin']);
  }
});

```

And change `client > layouts > partials > navbar.html` to match this:

```html
<template name="navbar">
  <nav>
    <div class="container">
      <div class="row">
        <div class="col s12">
          <div class="nav-wrapper">
            <a href="/" class="brand-logo">MeteoReddit</a>
            <a href="#" data-activates="mobile-nav" class="button-collapse"><i class="material-icons">menu</i></a>
            <ul class="right hide-on-med-and-down">
              {{#if isAdminUser}}
                <li><a href="/usermgmt">User Management</a></li>
              {{/if}}
              {{#if currentUser}}
                <li><a href="/sign-out">Sign Out</a></li>
              {{else}}
                <li><a href="/sign-in">Sign In</a></li>
              {{/if}}
            </ul>
            <ul class="side-nav" id="mobile-nav">
              {{#if currentUser}}
                <li><a href="/sign-out">Sign Out</a></li>
              {{else}}
                <li><a href="/sign-in">Sign In</a></li>
              {{/if}}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
```

Sweet. We're done with user management. You can create any roles you want as the admin and assign them to any user.

Since we reference it, let's create a loading template using the loader from materialize.

Under `client > views > pages` create a file called `loading.html` and put the loader in it:

```html
<template name="loading">
  <div class="loadingbody">
    <div class="preloader-wrapper big active">
      <div class="spinner-layer spinner-blue">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-red">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-yellow">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>

      <div class="spinner-layer spinner-green">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
  </div>
</template>
```

Let's make a route to see the loader. Fix your router to match the following and visit `localhost:3000/loading` when you're finished:

```javascript
// In the configuration, we declare the layout, 404, loading,
// navbar, and footer templates.
Router.configure({
  layoutTemplate: 'masterLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  yieldTemplates: {
    navbar: {to: 'navbar'},
    footer: {to: 'footer'},
  }
});

// In the map, we set our routes.
Router.map(function () {
  // Index Route
  this.route('home', {
    path: '/',
    template: 'home',
    layoutTemplate: 'masterLayout'
  });
  this.route('loading', {
    path: 'loading',
    template: 'loading',
    layoutTemplate: 'masterLayout'
  });
  // User Mgmt Route
  this.route('usermgmt', {
    path: '/usermgmt',
    template: 'userManagement',
    layoutTemplate: 'masterLayout',
    onBeforeAction: function() {
      if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
          this.redirect('/');
      }
      this.next();
    },
    loadingTemplate: 'loading'
  });
  // Sign In Route
  AccountsTemplates.configureRoute('signIn', {
      name: 'signin',
      path: '/sign-in',
      template: 'signIn',
      layoutTemplate: 'masterLayout',
      redirect: '/',
  });
  // Sign Up Route
  AccountsTemplates.configureRoute('signUp', {
      name: 'sign-up',
      path: '/sign-up',
      template: 'signUp',
      layoutTemplate: 'masterLayout',
      redirect: '/',
  });
  // Sign Out Route
  this.route('/sign-out', function(){
      Meteor.logout(function(err) {
          if (err) alert('There was a problem logging you out.');
          Router.go("/");
      });
      Router.go("/");
  });
});
```

The loader looks a little screwy and our margins from the navbar are a bit funky. Let's write some sass to fix this.

Change your `client > main.scss` to match the following:

```css
@import "{poetic:materialize-scss}/sass/components/_color.scss";
$primary-color: color("grey", "darken-4");
@import "{poetic:materialize-scss}/sass/materialize.scss";
@import "./stylesheets/_stickyfooter.scss";
@import "./stylesheets/_loading.scss";
@import "./stylesheets/_navbar.scss";
```

Now create the two new files we want to import.

In `client > stylesheets` create a file called `_loading.scss` with the following in it:

```css
main{
  position: relative;
}

.loadingbody{
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 0 auto;
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  z-index: -1;
}
```

In the same folder, make another file called `_navbar.scss` with the following in it:

```css
nav{
  margin-bottom: 40px;
}
```

We now have the entire foundation to build any authorized, authenticated, CRUD app with meteor. Congrats. Next, we'll be adding our own functionality, deploying the app, and compiling it for our phone.

##END OF FIRST LESSON
------------------------
Checkout this first portion alone [here](https://github.com/dannyvassallo/meteorlesson1). This next part will add features beyond the template setup in the first part, but feel free to clone down this link and use it to start a new project.

------------------------

##BEGIN SECOND LESSON

<a name="posts"></a>
###Making Posts

` `

`-----------------------------------------------------`

[Back To Top 🔼](#dir)

`-----------------------------------------------------`

` `


Let's make a reference to our first collection. Dat's right -- we're up in the shiz now.

In the `lib` folder, create a file called `collections.js`. Inside put the following:

```javascript
// Init Posts collection on mongodb
Posts = new Mongo.Collection('posts');
```

Now we can insert a post into the Posts collection -- kind of. There are a few more things to take care of first.

We're going to create some methods. Methods are a way for us to write calls to mongo that we can invoke within our controllers. I like to think of it as an additional controller layer.

For the first time we're going to create files in our server folder. First, let's make one called `postmethods.js` and put the following in it:

```javascript
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
```

Next, we're going to add some new functionality to our app. For our posts, the content will be pulled from your camera. There is a meteor package to assist with this.

Let's add that now using the command line. In your project directory, run this: `meteor add mdg:camera`.

Now that we've added this dependency, you should see a new package added to your `./meteor/packages` file. like this:

```
fourseven:scss
poetic:materialize-scss
useraccounts:materialize
useraccounts:core
useraccounts:iron-routing
accounts-password@1.3.1
browser-policy@1.0.9
browser-policy-common@1.0.11
browser-policy-content@1.0.12
browser-policy-framing@1.0.12
alanning:roles
cunneen:accounts-admin-materializecss
mdg:camera
```

Cool. Lets write a new controller.

In your `client/controllers/` folder, make a new file called `newpost.js`. Put the following inside of it:

```javascript
Template.newPost.events({
  "click #newPost": function (e) {
    e.preventDefault();

    MeteorCamera.getPicture(function (err, data) {
      if (!err) {
        Meteor.call("addPost", data);
      }
    });

    return false;
  }
});
```

If you look in this code, you'll see that we are using the new [mdg:camera](https://atmospherejs.com/mdg/camera) package that we just added as well as calling the serverside method we've created. Dope. You can also see that we've written an event listener for a blaze template called `newPost` and we're listening for click on an element with the id `#newPost`. Let's make this event's dream a reality and create a template for it to interact with.

As a note before we move on -- let's discuss the new package. The way it works, is that it will pull a base 64 image from your camera, and store it in mongo. This means no s3. no credentials to store in a bucket, just quick easy image capture where `data` is the base64 image in the callback.

Now, lets create that template. We're going to do this like a react component and render the partial wherever we feel like.

In `client/views/` make a new folder called `partials`.

In the new `partials` folder, create a file called `newPost.html`. In that file, put the following:

```html
<template name="newPost">
  {{#if currentUser}}
  <div id="newPost" class="fixed-action-btn">
    <a class="btn-floating btn-large red">
      <i class="large material-icons">add</i>
    </a>
  </div>
  {{/if}}
</template>
```

Before this will work at all, we need to update our browser policy to allow us to take photos with our app. update `server/main.js` with the following:

```
import { Meteor } from 'meteor/meteor';
import { BrowserPolicy } from 'meteor/browser-policy-common';

Meteor.startup(() => {
  BrowserPolicy.content.allowOriginForAll('*');
  BrowserPolicy.content.allowImageOrigin("blob:");
  var constructedCsp = BrowserPolicy.content._constructCsp();
  BrowserPolicy.content.setPolicy(constructedCsp +" media-src blob:;");
  // code to run on server at startup

  // create admin from settings
  if (Meteor.users.findOne(Meteor.settings.adminId)){
    Roles.addUsersToRoles(Meteor.settings.adminId, ['admin']);
  }
});
```

Now let's render that in the homepage.

Change the homepage's content to match this:

```html
<template name="home">
  <div class="container">
    <div class="row">
      <div class="col s12">
        <h1>Home</h1>
        <p>This is the index path.</p>
      </div>
    </div>
  </div>
  {{> newPost}}
</template>
```

Now we get a fixed button that opens our new camera package.

The button overlaps the footer so let's create a new layout template for our homepage that doesn't have one.

Duplicate the `masterLayout.html` in the `client/views/layouts/` folder and name it `homepageLayout.html`.

Change it's content to match this:

```html
<template name="homepageLayout">
  {{> yield region='navbar'}}
    <main>
      {{> yield}}
    </main>
</template>
```

Update the router to match the following so the homepage view can get the new template:

```javascript
// In the configuration, we declare the layout, 404, loading,
// navbar, and footer templates.
Router.configure({
  layoutTemplate: 'masterLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  yieldTemplates: {
    navbar: {to: 'navbar'},
    footer: {to: 'footer'},
  }
});

// In the map, we set our routes.
Router.map(function () {
  // Index Route
  this.route('home', {
    path: '/',
    template: 'home',
    layoutTemplate: 'homepageLayout'
  });
  this.route('loading', {
    path: 'loading',
    template: 'loading',
    layoutTemplate: 'masterLayout'
  });
  // User Mgmt Route
  this.route('usermgmt', {
    path: '/usermgmt',
    template: 'userManagement',
    layoutTemplate: 'masterLayout',
    onBeforeAction: function() {
      if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
          this.redirect('/');
      }
      this.next();
    },
    loadingTemplate: 'loading'
  });
  // Sign In Route
  AccountsTemplates.configureRoute('signIn', {
      name: 'signin',
      path: '/sign-in',
      template: 'signIn',
      layoutTemplate: 'masterLayout',
      redirect: '/',
  });
  // Sign Up Route
  AccountsTemplates.configureRoute('signUp', {
      name: 'sign-up',
      path: '/sign-up',
      template: 'signUp',
      layoutTemplate: 'masterLayout',
      redirect: '/',
  });
  // Sign Out Route
  this.route('/sign-out', function(){
      Meteor.logout(function(err) {
          if (err) alert('There was a problem logging you out.');
          Router.go("/");
      });
      Router.go("/");
  });
});
```

If you click the plus button now, you can grab pictures from your camera on any device. Pretty sweet. But the UI looks like crap and you'll notice that if you open it. Let's extend some sass classes to the UI and make it more materialized!

<a name="camera"></a>
###Styling Camera Package

` `

`-----------------------------------------------------`

[Back To Top 🔼](#dir)

`-----------------------------------------------------`

` `


##END OF SECOND LESSON
------------------------
This section will cover whatever app this ends up being.

------------------------

##BEGIN THIRD LESSON

<a name="horse"></a>
###Deployment

` `

`-----------------------------------------------------`

[Back To Top 🔼](#dir)

`-----------------------------------------------------`

` `

Deploy using the [Meteor Horse Buildpack](https://github.com/AdmitHub/meteor-buildpack-horse) and Heroku


* Set up your app to [deploy to heroku with git](https://devcenter.heroku.com/articles/git).
*  Set this repository as the buildpack URL:
```
heroku buildpacks:set https://github.com/AdmitHub/meteor-buildpack-horse.git
```
* Add the MongoLab addon:
```
heroku addons:create mongolab
```
* Set the `ROOT_URL` environment variable. This is required for bundling and running the app.  Either define it explicitly, or enable the [Dyno Metadata](https://devcenter.heroku.com/articles/dyno-metadata) labs addon to default to `https://<appname>.herokuapp.com`.
```
heroku config:set ROOT_URL="https://<appname>.herokuapp.com" # or other URL
```
Once that's done, you can deploy your app using this build pack any time by pushing to heroku:
```
git push heroku master
```

<a name="heroku"></a>
###Sync your local settings w/ Heroku

` `

`-----------------------------------------------------`

[Back To Top 🔼](#dir)

`-----------------------------------------------------`

` `

```
heroku config:add METEOR_SETTINGS="$(cat settings.json)"
```

<a name="android"></a>
###Running on android

` `

`-----------------------------------------------------`

[Back To Top 🔼](#dir)

`-----------------------------------------------------`

` `


In the shell with your device connected run:

```
MONGO_URL="mongodb://<username>:<password>@<mlab url>.mlab.com:<portnumber>/<dbname>" meteor run android-device --mobile-server=https://<appname>.herokuapp.com
```

<a name="icons"></a>
###Generating Icons and splashes

` `

`-----------------------------------------------------`

[Back To Top 🔼](#dir)

`-----------------------------------------------------`

` `


Use meteor image asset generator [here](https://github.com/lpender/meteor-assets).

Follow the instructions and copy the resulting resources folder over the one in this project.
