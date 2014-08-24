
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
      deferred.resolve(data);
    }).error(function (data) {
      deferred.reject(options.key);
    });

    return deferred.promise;

  }

  return {
    get: $$get
  }

}













