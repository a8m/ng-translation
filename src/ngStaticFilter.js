
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
