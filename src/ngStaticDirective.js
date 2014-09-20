
/**
 * @ngdoc module
 * @name ng.static.directive
 *
 * @description
 * ngStaticDirective
 * @example
 * <p ng-static="file(key)"></p> || <p ng-static="key"></p>
 */

angular.module('ng.static.directive', [ 'ng.static.provider' ])
  .directive('ngStatic', ['$parse', ngStaticDirective]);

function ngStaticDirective($parse) {
  return {
    restrict: 'A',
    compile: function(tElm, tAttr, transclude) {

      var args = tAttr[this.name]
        .match(/^([^(]+?)\s*(\((.*)\))?$/);

      //set the file name if exist
      var params = /[)]$/.test(tAttr[this.name])
        ? { file: ': ' + args[1], key: args[3] }
        : { file: '', key: args[1] };

      tElm.text('{{ ' + params.key + ' | static' + params.file +' }}');

      //linkFn
      return function(scope, elm, attr){}

    }
  };
}
