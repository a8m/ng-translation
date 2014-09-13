/**
 * Elegant way to store your app static content
 * @version v0.0.1 - 2014-09-13 * @link https://github.com/a8m/ng-static
 * @author Ariel Mashraki <ariel@mashraki.co.il>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function ( window, angular, undefined ) {
/*jshint globalstrict:true*/
'use strict';

var isDefined = angular.isDefined,
  isUndefined = angular.isUndefined,
  isFunction = angular.isFunction,
  isString = angular.isString,
  isNumber = angular.isNumber,
  isObject = angular.isObject,
  isArray = angular.isArray,
  forEach = angular.forEach,
  extend = angular.extend,
  copy = angular.copy,
  equals = angular.equals;

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
 * @name ng.static
 *
 * @requires ng.static.filter
 * @requires ng.static.provider
 *
 * @description
 * ngStatic description
 */

angular.module('ng.static', [
    'ng.static.filter',
    'ng.static.provider'
  ])
  .run(['ngStatic', function(ngStatic) {
    ngStatic.init();
  }]);


/**
 * @ngdoc module
 * @name ng.static.filter
 *
 * @description
 * ngStaticFilter get key as a string, and staticFileName as an arguments
 * and return the value.
 * @example
 * <p>{{ 'someKey' | ng-static: 'homepage' }}</p>
 */

angular.module('ng.static.filter', [ 'ng.static.provider' ])
  .filter('static', ['$parse', 'ngStatic', function($parse, ngStatic) {

    return function(string, staticFile) {

      return $parse(string)(ngStatic.get(staticFile)) || string;

    }

  }]);


/**
 * @ngdoc module
 * @name ng.static.provider
 *
 * @description
 * ngStatic description
 */

angular.module('ng.static.provider', [ 'ng.static.files-loader' ])
  .provider('ngStatic', ngStaticProvider);

/**
 * @ngdoc function
 * @name ngStaticProvider
 *
 * @description
 */
function ngStaticProvider() {

  //store all files
  var staticFiles;

  //files suffix
  var suffix;

  //base url / directory
  var baseUrl;

  /**
   * @ngdoc method
   * @description
   * Set static files as a key value pairs
   * @param files
   * @return {ngStaticProvider}
   * @example
   * ngStaticProvider
   *  .staticFiles({
   *    homepage: 'file.json',
   *    login: 'folder/file.json',
   *    search: 'file' <== by default prefix is json
   *  })
   */
  this.staticFiles = function(files) {
    staticFiles = files;
    return this;
  };

  /**
   * @ngdoc method
   * @description
   * Add file to static files object
   * @param file
   * @returns {ngStaticProvider}
   * @example
   * ngStaticProvider
   *  .addStaticFile({
   *    name: filename.json
   *  })
   */
  this.addStaticFile = function(file) {
    staticFiles = (staticFiles) ?
      extend(staticFiles, file) :
      file;
    return this;
  };


  /**
   * @ngdoc method
   * @description
   * Set global suffix to all files
   * @param sfx
   * @returns {ngStaticProvider}
   * @example
   * ngStaticProvider
   *  .setFilesSuffix('-static.json')
   *  .setFiles({
   *    homepage: 'homepage' <== homepage-static.json
   *  })
   */
  this.setFilesSuffix = function(sfx) {
    suffix = sfx;
    return this;
  };

  /**
   * @ngdoc method
   * @description
   * Set base url static file
   * @param url {String}
   * @returns {ngStaticProvider}
   * @example
   *  __ __ __ __ __ __
   * | - dist          |
   * |   - assets      |
   * |     - static    |
   * |__ __ __ __ __ __|
   *
   * ngStaticProvider
   *  .setBaseUrl('dist/assets/static')
   *  .staticFiles({
   *    homepage: 'homepage' <== dist/assets/static/homepage.json
   *  })
   */
  this.setBaseUrl = function(url) {
    baseUrl = new RegExp(/\/$/).test(url) ?
     url.substring(0, url.length-1) :
      url;
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
  this.$get = ['$q', 'staticFilesLoader', function($q, staticFilesLoader) {

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
      staticFiles: staticFiles
    };

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

      forEach(staticFiles, function(value, key) {
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
     * init function
     */
    function $$init() {
      return $$loadAllFiles()
        .then($$bindFiles);
    }

    return {
      configuration: configuration,
      get: $$getFile,
      getAll: $$getFiles,
      init: $$init
    }

  }];

}


/**
 * @ngdoc module
 * @name ng.static.files-loader
 *
 * @description
 * handle load static files phase
 */

angular.module('ng.static.files-loader', [])
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