/**
 * Fast, Easy and Dynamic translation for AngularJS
 * @version v0.0.3 - 2014-10-22 * @link https://github.com/a8m/ng-translation
 * @author Ariel Mashraki <ariel@mashraki.co.il>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function ( window, angular, undefined ) {
/*jshint globalstrict:true*/
'use strict';

var isUndefined = angular.isUndefined,
  isString = angular.isString,
  isObject = angular.isObject,
  forEach = angular.forEach,
  extend = angular.extend;

/**
 * @description
 * returns if a string ends with a particular suffix
 * @param str
 * @param suffix
 * @returns {boolean}
 */
function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/**
 * @description
 * returns if a string starts with a particular prefix
 * @param str
 * @param prefix
 * @returns {boolean}
 */
function startWith(str, prefix) {
  return !str.indexOf(prefix);
}

/**
 * @ngdoc module
 * @name ng-translation
 *
 * @requires ng-translation.filter
 * @requires ng-translation.provider
 * @requires ng-translation.directive
 *
 * @description
 * ngStatic description
 */

angular.module('ng-translation', [
    'ng-translation.filter',
    'ng-translation.provider',
    'ng-translation.directive'
  ])
  .run(['ngTranslation', function(ngStatic) {
    ngStatic.init();
  }]);


/**
 * @ngdoc module
 * @name ng-translation.directive
 *
 * @description
 * ngTranslationDirective
 * @example
 * <p ng-translate="file(key)"></p> || <p ng-translate="key"></p>
 */

angular.module('ng-translation.directive', [ 'ng-translation.provider' ])
  .directive('ngTranslate', ['$parse', ngTranslationDirective]);

function ngTranslationDirective($parse) {
  return {
    restrict: 'A',
    compile: function(tElm, tAttr, transclude) {

      var args = tAttr[this.name]
        .replace(/\s/g, '')
        .match(/^([^(]+?)\s*(\((.*)\))?$/);

      //set the file name if exist
      var params = /[)]$/.test(tAttr[this.name])
        ? { file: ': \'' + args[1] + '\'', key: args[3] }
        : { file: '', key: args[1] };

      tElm.text('{{ ' + params.key + ' | translate' + params.file +' }}');

      //linkFn
      return function(scope, elm, attr){}

    }
  };
}


/**
 * @ngdoc module
 * @name ng-translation.filter
 *
 * @description
 * ngTranslationFilter get key as a string, and staticFileName as an arguments
 * and return the value.
 * @example
 * <p>{{ 'someKey' | translate: 'homepage' }}</p>
 */

angular.module('ng-translation.filter', [ 'ng-translation.provider' ])
  .filter('translate', ['$parse', '$interpolate', 'ngTranslation', function($parse, $interpolate, ngTranslation) {

    var translateFilter = function(string) {

      var args = Array.prototype.slice.call(arguments, 1);
      var funcName = isString(args[0]) ? 'get' : 'getUsed';
      var res = $parse(string)(ngTranslation[funcName](args[0]));

      //if there is no arguments
      if(!args.length || isUndefined(res)) {
        return res || string;
        //if the first argument is an object
      } else if(isObject(args[0])) {
        return $interpolate(res)(args[0] || {})
      }
      //the first arguments is a string
      //check if it should be interpolate
      return isObject(args[1])
        ? $interpolate(res)(args[1] || {})
        : res
    };

    translateFilter.$stateful = true;

    return translateFilter;

  }]);


/**
 * @ngdoc module
 * @name ng-translation.provider
 *
 * @description
 * ngTranslation description
 */

angular.module('ng-translation.provider', [ 'ng-translation.files-loader' ])
  .provider('ngTranslation', ngTranslationProvider);

/**
 * @ngdoc function
 * @name ngTranslationProvider
 *
 * @description
 */
function ngTranslationProvider() {

  //store all files
  var langsFiles;

  //store all values
  var langsValues;

  //files suffix
  var suffix;

  //base url / directory
  var baseUrl;

  //fallback language
  var fallbackLanguage;

  //used language, file to use
  var usedLanguage;

  /**
   * @ngdoc method
   * @description
   * Set languages files as a key value pairs
   * @param files
   * @return {ngTranslationProvider}
   * @example
   * ngTranslationProvider
   *  .langsFiles({
   *    en: 'file.json',
   *    he: 'folder/file.json',
   *    ru: 'file' <== by default prefix is json
   *  })
   */
  this.langsFiles = function(files) {
    langsFiles = files;
    return this;
  };

  /**
   * @ngdoc method
   * @description
   * Add file to languages files object
   * @param file
   * @returns {ngTranslationProvider}
   * @example
   * ngTranslationProvider
   *  .addLangFile({
   *   en: filename.json
   *  })
   */
  this.addLangFile = function(file) {
    langsFiles = langsFiles
      ? extend(langsFiles, file)
      : file;
    return this;
  };

  /**
   * @ngdoc method
   * @description
   * Set array of values as a files
   * @param values {Array}
   * @return {ngTranslationProvider}
   * @example
   * ngTranslationProvider
   *  .langsValue([
   *    'en',
   *    'ru'
   *  ])
   */
  this.langsValues = function(values) {
    langsValues = values;
    return this;
  };

  /**
   * @ngdoc method
   * @description
   * Set global suffix to all files
   * @param sfx
   * @returns {ngTranslationProvider}
   * @example
   * ngTranslationProvider
   *  .setFilesSuffix('-static.json')
   *  .langsFiles({
   *    en: 'en' <== en-static.json
   *  })
   */
  this.setFilesSuffix = function(sfx) {
    suffix = sfx;
    return this;
  };

  /**
   * @ngdoc method
   * @description
   * Set base url static files directory
   * @param url {String}
   * @returns {ngTranslationProvider}
   * @example
   *  __ __ __ __ __ __
   * | - dist          |
   * |   - assets      |
   * |     - static    |
   * |__ __ __ __ __ __|
   *
   * ngTranslationProvider
   *  .setBaseUrl('dist/assets/static')
   *  .langsFiles({
   *    en: 'english,json' <== dist/assets/static/english.json
   *  })
   */
  this.setBaseUrl = function(url) {
    baseUrl = new RegExp(/\/$/).test(url) ?
     url.substring(0, url.length-1) :
      url;
    return this;
  };

  /**
   * @ngdoc method
   * @description
   * Set fallback language
   * @param lang
   * @returns {ngTranslationProvider}
   * @example
   * ngTranslationProvider
   *  .fallbackLanguage('en')
   *
   */
  this.fallbackLanguage = function(lang) {
    fallbackLanguage = lang;
    return this;
  };

  /**
   * Alias to setBaseUrl function
   */
  this.setDirectory = this.setBaseUrl;

  /**
   * @description
   * returned api
   */
  this.$get = ['$q', '$injector', 'staticFilesLoader', function($q, $injector, staticFilesLoader) {

    /**
     * @description
     * Store all static files content
     * @var object
     */
    var staticFilesContainer = {};

    /**
     * @description
     * Store all configuration service
     * @var object
     */
    var configuration = {
      baseUrl: baseUrl || '',
      suffix: suffix,
      langsFiles: langsFiles,
      langsValues: langsValues,
      fallbackLanguage: fallbackLanguage,
      usedLanguage: usedLanguage
    };

    /**
     * @ngdoc method
     * @param name
     * @returns usedLanguage || false
     * @private
     */
    function $$setUsedLanguage(name) {
      return isString(name)
        ? usedLanguage = name
        : false;
    }

    /**
     * @ngdoc method
     * @description
     * Return the current used file || fallback file
     * @returns {*}
     */
    function $$getUsed() {
      return staticFilesContainer[usedLanguage] ||
        staticFilesContainer[fallbackLanguage];
    }

    /**
     * @ngdoc method
     * @param name
     * @returns specific file || the first(default) file
     * @private
     */
    function $$getFile(name) {
      return staticFilesContainer[name] ||
        staticFilesContainer[Object.keys(staticFilesContainer)[0]];
    }

    /**
     * @ngdoc method
     * @description
     * returns all files / staticFiles object
     * @returns {{}}
     * @private
     */
    function $$getFiles() {
      return staticFilesContainer;
    }

    /**
     * @description
     * bind files array to staticFilesContainer object
     * @param filesArray
     */
    function $$bindFiles(filesArray) {
      forEach(filesArray, function(value, key) {
        extend(staticFilesContainer, value);
      });
    }

    /**
     * @ngdoc method
     * @description
     * load all files and then call bindFiles function
     */
    function $$loadAllFiles() {

      var promises = [];

      forEach(langsFiles, function(value, key) {
        promises.push(staticFilesLoader.get({
          baseUrl: configuration.baseUrl,
          suffix: suffix,
          value: (startWith(value, '/') || endsWith(configuration.baseUrl, '/')) ?
          value : '/' + value,
          key: key
        }));
      });

      return $q.all(promises);
    }

    /**
     * @description
     * bind all values to staticFilesContainer object as a files
     * @return {Array}
     */
    function $$bindValues() {
      return forEach(langsValues || [], function(value) {
        var file = {};
        file[value] = $injector.get(value);
        extend(staticFilesContainer, file);
      });
    }

    /**
     * @description
     * init function
     */
    function $$init() {
      return $$bindValues() && $$loadAllFiles()
        .then($$bindFiles);
    }

    return {
      configuration: configuration,
      get: $$getFile,
      getAll: $$getFiles,
      getUsed: $$getUsed,
      init: $$init,
      use: $$setUsedLanguage
    }

  }];

}


/**
 * @ngdoc module
 * @name ng-translation.files-loader
 *
 * @description
 * handle load static files phase
 */

angular.module('ng-translation.files-loader', [])
  .factory('staticFilesLoader', ['$http', '$q', staticFilesLoaderFactory]);


function staticFilesLoaderFactory($http, $q) {

  /**
   * @ngdoc method
   * @param data
   * @param key
   * @returns object
   * @private
   */
  function $$extendRes(data, key) {
    var object = {};
    object[key] = data;
    return object;
  }

  /**
   * @ngdoc method
   * @param options [baseUrl, key, value, suffix]
   * @returns {Q.promise}
   */
  function $$get(options) {

    var deferred = $q.defer();

    $http({
      url: [
        options.baseUrl,
        options.value,
        options.suffix
      ].join(''),
      method: 'GET',
      params: ''
    }).success(function (data) {
      //if everything work well return new object
      //contains { name: staticResponse }
      deferred.resolve($$extendRes(data, options.key));
    }).error(function (data) {
      //else return
      deferred.reject(options.key);
    });

    return deferred.promise;

  }

  return {
    get: $$get
  }

}
})( window, window.angular );