#MeteoReddit

The fastest built reddit clone you've ever seen homie.

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

###Getting Started

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

###Adding Dependencies Up Front

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

###Create An Index Route and a Layout

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

###Remove boilerplate code

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

###Not Found and Authentication Routes

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

###Authorization

We've also added a "materialized" admin account manager. Lets set that template up next.
