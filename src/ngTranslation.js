
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
