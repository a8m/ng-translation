
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
