
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
