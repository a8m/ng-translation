#ng-static &nbsp; [![Coverage Status](https://coveralls.io/repos/a8m/ng-static/badge.png?branch=master)](https://coveralls.io/r/a8m/ng-static?branch=master)
>Separate the coding from the static content in a nice-ish way to

##Table of contents:
- [Get Started](#get-started)
- [Documentation](documentation)
  - [Configuring ngStatic](#configuring-ngstatic)
    - [setBaseUrl]()
    - [setDirectory]()
    - [setFilesSuffix]()
    - [staticFiles]()
    - [addStaticFile]()
    - [staticValues]()
  - [configuration]()
  - [get]()
  - [getAll]()
  - [init]()
- [Example](#example)
- [TODO](#todo)
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
/*  __ __ __ __ __ __ __
 * | - dist             |
 * |   - assets         |
 * |     - static       |
 * |      * demo1.json  |
 * |      * demo2.json  |
 * |__ __ __ __ __ __ __|
 */
```
**JS:**
```js
//create demo app and add ng.static
angular.module('app', ['ng.static'])
  //usage: [name]: [object]
  .value({
    value1: { key: 'value' },
    value2: { key: 'value' }
  })
  .config(['ngStaticProvider', function(ngStaticProvider) {
    ngStaticProvider
      //set files directory
      .setDirectory('/assets/static')
      //set files suffix
      .setFilesSuffix('.json')
      //add files as a key value pairs
      .staticFiles({
        demo1: 'demo1',
        demo2: 'demo2'
      })
      .staticValues([
        'value1',
        'value2'
      ])
  }]);
```
**JSON files:**(demo1.json)
```json
{
  "foo": "bar",
  "message": {
    "manager": "Hello Manager",
    "employee": "Hello Employee"
  },
  "slides": [
    "slide1: Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "slide2: Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "slide3: Lorem Ipsum is simply dummy text of the printing and typesetting industry."
  ]
}
```
**HTML:**
```html
 <div>
   <!--  key , and file name as an argument (if there is only one file use: {{ 'key' | static }} )-->
   {{ 'foo' | static: 'demo1' }}
</div>

<div ng-repeat="slider in 'slides' | static: 'demo1' track by $index">
  {{ slider }}
</div>
<!-- chnage content dynamically -->
<p>Initial Message:</p>
<h2>{{ 'message.' + role | static: 'demo1' }}</h2>
```
#TODO
- Integrate with localStorage/sessionStorage
- Add examples
- Project page (branch: gh-pages)
- API improvement

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
