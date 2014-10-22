#ngTranslation [![Coverage Status](https://img.shields.io/coveralls/a8m/ng-translation.svg)](https://coveralls.io/r/a8m/ng-translation)
> Fast, Easy and Dynamic translation for AngularJS. **v0.0.3**

##Table of contents:
- [Get Started](#get-started)
- [Example](#example)
- [Development](#development)
- [ngTranslationProvider](#ngtranslationprovider)
  - [Configuration](#configuration)
    - [setBaseUrl](#setbaseurl)
    - [langsFiles](#langsfiles)
    - [langsValues](#langsvalues)
    - [addLangFile](#addlangfile)
    - [setFilesSuffix](#setfilessuffix)
    - [fallbackLanguage](#fallbacklanguage)
  - [API](#api)
    - [configuration](#configuration1)
    - [get](#get)
    - [getAll](#getall)
    - [getUsed](#getused)
    - [init](init)
    - [use](#use)
- [ngTranslationFilter](#ngtranslationfilter)
- [ngTranslationDirective](#ngtranslationdirective)

##Get Started
**(1)** You can install ng-translation using 3 different ways:  
  - clone & [build](#developing) this repository
  - **[Bower](http://bower.io/)**: by running `$ bower install ng-translation` from your terminal
  - via **[npm](https://www.npmjs.org/)**: by running `$ npm install ng-translation` from your terminal  

**(2)** Include `ng-translation.js` (or `ng-translation.min.js`) in your `index.html`, after including Angular itself.    

**(3)** Add `'ng-translation'` to your main module's list of dependencies.    

When you're done, your setup should look similar to the following:

```html
<!doctype html>
<html ng-app="myApp">
<head>
   
</head>
<body>
    ...
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular.min.js"></script>
    <script src="bower_components/js/angular-filter.min.js"></script>
    ...
    <script>
        angular.module('myApp', ['ng-translation'])
          .controller('MainCtrl', function($scope) {
            //...
          });
    </script>
    ...
</body>
</html>
```
##Example
**Quick example:**  
**JS:**  
```js
/**
 * Directory structure
 * __ __ __ __ __ __
 * | - dist          |
 * |   - assets      |
 * |     - static    |
 * |__ __ __ __ __ __|
 */
//AngularJS app
angular.module('app', ['ng-translation'])
  .config(['ngTranslationProvider', function(ngTranslationProvider) {
    ngTranslationProvider
      .setDirectory('/dist/assets/static')
      .setFilesSuffix('.json')
      .langsFiles({
        en: 'en',
        de: 'de',
        es: 'es'
      })
      .fallbackLanguage('en')
  }])
  .run(['ngTranslation', '$location'], function(ngTranslation, $location) {
    ngTranslation.use(
        $location.search().lang
      );
  });
```
**JSON:** (one file for example)    
```json
{
  "title": "Wählen Sie eine Vorlage, um zu beginnen.",
  "description": {
    "text": "Hunderte vollständig anpassbarer HTML5-Templates in jeder Kategorie verfügbar."
  },
  "button": "Anmelden",
  "message": "Hallo {{user.name}}, Uw wachtwoord is: {{user.password}}"
}
```
**HTML:**
```html
    <!-- simple usage example -->
    <h3>{{ 'title' | translate }}</h3>
    <h4>{{ 'description.text'  | translate }}</h4>
    <p>{{ 'button' | translate }}</p>

    <!-- directive example -->
    <p ng-translate="'message'"></p>
    <p ng-translate="es('message')"></p>

    <!-- bind to model example -->
    <table style="border:1px solid red">
        <tr>
            <td>User Details:</td>
        </tr>
        <tr>
            <td>{{ 'message' | translate: this }}</td>
        </tr>
        <tr>
            Change user details:
        </tr>
        <tr>
            <td>name: <input ng-model="user.name" type="text"/> </td>
        </tr>
        <tr>
            <td>password: <input ng-model="user.password" type="text"/> </td>
        </tr>
    </table>
```

**To learn more, Read the documentation...**

##Configuration
ngTranlation configuration options, **see below:**

###setBaseUrl
Set base url for static/languages files directory.  
**Aliases:** `setDirectory`
```js
angular.module('app', ['ng-translation'])
  .config(['ngTranslationProvider', function(ngTranslationProvider) {
    ngTranslationProvider
      .setDirectory('/ng-translation/demo/languages');
  }]);
```
###langsFiles
Set languages files as a key value pairs.  
```js
angular.module('app', ['ng-translation'])
  .config(['ngTranslationProvider', function(ngTranslationProvider) {
    ngTranslationProvider
      .setDirectory('/ng-translation/demo/languages')
      .langsFiles({
        en: 'en.json',
        de: 'de.json',
        es: 'es.json'
      });
  }]);
```
###langsValues
Set array of values as a languages files.  
```js
angular.module('app', ['ng-translation'])
  .value({
    en: { foo: 'Hello' },
    de: { foo: 'Hallo' }
  })
  .config(['ngTranslationProvider', function(ngTranslationProvider) {
    ngTranslationProvider
      .langsValues([
        'en',
        'de'
      ]);
  }]);
```
###addLangFile
Add a single language file.  
```js
angular.module('app', ['ng-translation'])
  .config(['ngTranslationProvider', function(ngTranslationProvider) {
    ngTranslationProvider
      .addLangFile({
        en: 'filename.json'
      });
  }]);
```
###setFilesSuffix
Set global suffix to all files.  
```js
angular.module('app', ['ng-translation'])
  .config(['ngTranslationProvider', function(ngTranslationProvider) {
    ngTranslationProvider
      .setFilesSuffix('-static.json')
      .langsFiles({
        en: 'en', // <== en-static.json
        de: 'de',
        es: 'es'
      });
  }]);
```
###fallbackLanguage
Set fallback language. 
```js
angular.module('app', ['ng-translation'])
  .config(['ngTranslationProvider', function(ngTranslationProvider) {
    ngTranslationProvider
      .fallbackLanguage('en');
  }]);
```
##API
The returns API, **see below:**

###configuration
The expose configuration
```js
angular.module('app', ['ng-translation'])
  .controller('MainCtrl', function(ngTranslation) {
    console.log(ngTranslation.configuration);
    //{ baseUrl: "/ng-translation/demo/languages", suffix: ".json", langsFiles: Obje... }
  });
```
###get
Get specific file by name.  
**Usage:** `ngTranslation.get({String})`
**Returns:** file `{Object}`
```js
angular.module('app', ['ng-translation'])
  .controller('MainCtrl', function(ngTranslation) {
    $scope.getByName = function(name) {
      return ngTranslation.get(name); 
      //{title: "Select a Template", message: "Hello {{ user.name... }
    };
  });
```
###getAll
Get all files(the staticFilesContainer)
**Usage:** `ngTranslation.getAll()`
**Returns:** files `{Object}`
```js
angular.module('app', ['ng-translation'])
  .controller('MainCtrl', function(ngTranslation) {
    $scope.getAll = function() {
      return ngTranslation.getAll(); 
      //{ en: Object, de: Object, es: Obje... }
    };
  });
```
###getUsed
Get the current used file || fallback file
**Usage:** `ngTranslation.getUsed()`
**Returns:** file `{Object}`
```js
angular.module('app', ['ng-translation'])
  .controller('MainCtrl', function(ngTranslation) {
    $scope.getUsed = function() {
      return ngTranslation.getUsed(); 
       //{title: "Select a Template", message: "Hello {{ user.name... }
    };
  });
```
###init
`@private` function.  

###use
Use specific language.(prefered language)  
**Usage:** `ngTranslation.use({String})`  
**Returns:** `{Boolean}`
```js
angular.module('app', ['ng-translation'])
  .run(function($location, ngTranslation) {
    ngTranslation.use(
      $location.search().lang //e.g: "de", "en"
    );
  });
```
##ngTranslationFilter
There's a 4 ways to use the `translate` filter.  
* simple - pass a key, and get the value from the **usedFile**(prefered language, `.use`).
```html
<p>{{ 'message' | translate }}</p>
<p>{{ 'message.nested' | translate }}</p>
<!-- note: 'key' is a property on the scope -->
<p>{{ key | translate }}</p>
```
* from specific file - pass a key, and fileName(language), and get the value from `this` file.
```html
<p>{{ 'message' | translate: 'en' }}<p>
<p>{{ 'message.nested' | translate: 'de' }}<p>
<!-- note: 'key' and `lang` are a properties on the scope -->
<p>{{ key | translate: lang }}<p>
```
* interpolate - there's a situation, that you want to store an angular expression as a value.  
**e.g**: `'this is string that {{ foo }}, {{ bar.baz }} need to interpolate.'`  
**Usage:** `{{ key | translate: object }}`  
```js
$scope.user = { name: 'Ariel M.' }
$scope.property = 'value';
```
```html
<!-- note: user is a property on the scope, so if the real value on the file is:
`hello {{ name }}, wanna login?`
the result will be: `hello Ariel M., wanna login ?` -->
<p>{{ 'user.message' | translate: user }}</p>
<!-- note: if you want to use directly properties on $scope, use the `this` keyword,
(every $scope, have the own `this` property that point to him self) -->
<p>{{ 'message' | translate: this }}</p>
```
* interpolate from other file - if you want the same interpolation behavior, but get the value 
from specific file.  
**Usage:** `{{ key | translate: lang: object }}`  
```html
<p>{{ 'user.message' | translate: 'de': user }}</p>
<!-- note: 'key' and `lang` are a properties on the scope -->
<p>{{ key | translate: lang: this }}</p>
```
##ngTranslationDirective
There's a 2 ways to use the `ngTranslate` directive.
* get the value from the **usedFile**(prefered language, `.use`).
```html
<p ng-translate="'message'"></p>
<!-- note: 'key' is a property on the scope -->
<p ng-translate="key"></p>
```
* get the value from specific file(specific language).
```html
<!-- note: `en` interpolate as a string -->
<p ng-translate="en('message')"></p>
<!-- note: 'key' is a property on the scope -->
<p ng-translate="de(key)"></p>
```


