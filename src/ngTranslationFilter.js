
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
  .filter('translate', ['$parse', 'ngTranslation', function($parse, ngTranslation) {

    return function(string, value) {

      return $parse(string)(ngTranslation.getUsed()) || string;

    }

  }]);
