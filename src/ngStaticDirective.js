
/**
 * @ngdoc module
 * @name ng.static.directive
 *
 * @description
 * ngStaticDirective
 * @example
 * <p ng-static="file(key)"></p>
 */

angular.module('ng.static.directive', [ 'ng.static.provider' ])
  .directive('ngStatic', ['$parse', ngStaticDirective]);

function ngStaticDirective($parse) {
  return {
    restrict: 'A',
    compile: function(tElm, tAttr, transclude) {

      var args = tAttr[this.name]
        .match(/^([^(]+?)\s*(\((.*)\))?$/);

      tElm.text('{{ ' + args[3] + ' | static:' + args[1] + ' }}');

      //linkFn
      return function(scope, elm, attr){}

    }
  };
}
