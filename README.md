#ng-static
>A nice way to separate the coding from the static content

##Table of contents:
- [Get Started](#get-started)
- [Development](#development)
- [Documentation](documentation)

#Get Started
**(1)** Get ng-static in one of 2 ways:
  - clone & [build](#developing) this repository
  - via **[Bower](http://bower.io/)**: by running `$ bower install ng-static` from your console

**(2)** Include `ng-static.js` (or `ng-static.min.js`) in your `index.html`, after including Angular itself.

**(3)** Add `'ng.static'` to your main module's list of dependencies.

When you're done, your setup should look similar to the following:

```html
<!doctype html>
<html ng-app="myApp">
<head>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular.min.js"></script>
    <script src="js/ng-static.min.js"></script>
    <script>
        var myApp = angular.module('myApp', ['ng.static']);

    </script>
    ...
</head>
<body>
    ...
</body>
</html>
```

#Development
Clone the project: <br/>
```
$ git clone 
$ npm install
$ bower install
```
Run the tests:
```
$ grunt test
```
**Deploy:**<br/>
Run the build task, update version before(bower,package)
```
$ grunt build
$ git tag v0.*.*
$ git push origin master --tags
