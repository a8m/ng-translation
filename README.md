#ng-static
>A nice way to separate the coding from the static content

##Table of contents:
- [Get Started](#get-started)
- [Documentation](documentation)
  - [Configuring ngStatic](#configuring-ngstatic)
    - [setBaseUrl]()
    - [seDirectory]()
    - [setFilesSuffix]()
    - [staticFiles]()
    - [addStaticFile]()
  - [configuration]()
  - [get]()
  - [getAll]()
  - [init]()
- [Example](#example)
- [Development](#development)

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
#Example
App direcrtory:
```js
/*  __ __ __ __ __ __
 * | - dist          |
 * |   - assets      |
 * |     - static    |
 * |__ __ __ __ __ __|
 */
```
**JS:**
```js
//create demo app and add ng.s
angular.module('app', ['ng.static'])
  .config(['ngStaticProvider', function(ngStaticProvider) {
    ngStaticProvider
      //set files directory
      .setDirectory('/assets/static')
      //set files suffix
      .setFilesSuffix('.json')
      //add files as a key value pairs
      .staticFiles({
        demo1:  'demo',
        demo2: 'demo'
      })
  }]);
```
**HTML:**
```html
 <div>
   <!--  key , and file name as an argument -->
   {{ 'key' | static: 'demo1' }}
</div>
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
