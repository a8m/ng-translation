#WIP - ngTranslation [![Coverage Status](https://img.shields.io/coveralls/a8m/ng-translation.svg)](https://coveralls.io/r/a8m/ng-translation)
> Fast, Easy and Dynamic translation for AngularJS

##Table of contents:
- [Get Started](#get-started)
- [Development](#development)
- [ngTranslationProvider](#ngTranslationProvider)
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
